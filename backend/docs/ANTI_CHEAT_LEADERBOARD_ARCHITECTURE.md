# Anti-Cheat Leaderboard Architecture

## 1) Core Principles
- All scoring and ranking logic is server-side only.
- Client payload is treated as untrusted input.
- Raw answer data and telemetry are stored for every submission.
- Leaderboard reads only from `verified_score`.
- Suspicious attempts are auto-excluded and marked as `UNDER_REVIEW`.

## 2) Database Schema
Below is a practical extension to the current Prisma/Postgres stack.

```sql
-- Each started attempt gets a signed server session token and immutable metadata.
create table test_session (
  id uuid primary key,
  user_id text not null references "User"(id) on delete cascade,
  test_id text not null references "Test"(id) on delete cascade,
  started_at timestamptz not null default now(),
  expires_at timestamptz not null,
  ip_hash text not null,
  device_fingerprint_hash text not null,
  user_agent_hash text not null,
  nonce text not null unique,
  status text not null default 'STARTED' check (status in ('STARTED', 'SUBMITTED', 'EXPIRED', 'UNDER_REVIEW'))
);
create index idx_test_session_user_started on test_session(user_id, started_at desc);

-- Store raw submitted answers, not only computed score.
create table raw_answer (
  id bigserial primary key,
  session_id uuid not null references test_session(id) on delete cascade,
  question_id text not null references "TestQuestion"(id) on delete restrict,
  selected_option_id text null references "TestOption"(id) on delete set null,
  answer_order int not null,
  answered_at timestamptz not null,
  latency_ms int null,
  unique(session_id, question_id)
);
create index idx_raw_answer_session on raw_answer(session_id);

-- Canonical computed metrics for each evaluated attempt.
create table score_verification (
  id uuid primary key,
  session_id uuid not null unique references test_session(id) on delete cascade,
  user_id text not null references "User"(id) on delete cascade,
  test_id text not null references "Test"(id) on delete cascade,
  speed_score numeric(5,2) not null,
  accuracy_score numeric(5,2) not null,
  consistency_score numeric(5,2) not null,
  integrity_score numeric(5,2) not null,
  time_efficiency numeric(5,2) not null,
  difficulty_multiplier numeric(5,2) not null,
  leaderboard_score numeric(6,2) not null,
  anomaly_count int not null default 0,
  review_state text not null default 'PASSED' check (review_state in ('PASSED', 'UNDER_REVIEW', 'REJECTED')),
  evaluated_at timestamptz not null default now()
);
create index idx_score_verification_user_eval on score_verification(user_id, evaluated_at desc);
create index idx_score_verification_state on score_verification(review_state, evaluated_at desc);

-- Source of truth used by leaderboard API only.
create table verified_score (
  id bigserial primary key,
  user_id text not null references "User"(id) on delete cascade,
  period_key text not null, -- DAILY | WEEKLY | MONTHLY
  category_key text not null, -- SAT | IELTS | COMBINED
  total_xp int not null default 0,
  tests_completed int not null default 0,
  accuracy numeric(5,2) not null,
  consistency_score numeric(5,2) not null,
  integrity_score numeric(5,2) not null,
  leaderboard_score numeric(6,2) not null,
  rank int null,
  computed_at timestamptz not null default now(),
  unique(user_id, period_key, category_key)
);
create index idx_verified_score_rank on verified_score(period_key, category_key, rank);
create index idx_verified_score_lb on verified_score(period_key, category_key, leaderboard_score desc);

-- Every anomaly rule trigger is stored for audit and model tuning.
create table integrity_event (
  id bigserial primary key,
  session_id uuid not null references test_session(id) on delete cascade,
  user_id text not null references "User"(id) on delete cascade,
  event_code text not null,
  severity text not null check (severity in ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  details jsonb not null,
  created_at timestamptz not null default now()
);
create index idx_integrity_event_user_time on integrity_event(user_id, created_at desc);

-- Optional support table for abuse correlation.
create table user_device_profile (
  id bigserial primary key,
  user_id text not null references "User"(id) on delete cascade,
  device_fingerprint_hash text not null,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  unique(user_id, device_fingerprint_hash)
);
create index idx_device_profile_fingerprint on user_device_profile(device_fingerprint_hash);
```

## 3) Ranking Algorithm
Normalize all sub-scores to `0..100`.

```text
Leaderboard Score =
  (Accuracy × 0.35) +
  (Consistency × 0.20) +
  (Difficulty Multiplier × 0.20) +
  (Time Efficiency × 0.15) +
  (Integrity Score × 0.10)
```

### Calculation Rules
- `Accuracy Score`: server-computed from correct/weighted answers.
- `Speed Score`: derived from expected duration vs real solve time.
- `Time Efficiency`: bounded score to avoid rewarding extreme speed.
- `Consistency Score`: rolling stability from recent verified attempts.
- `Integrity Score`: starts at 100 and decays on anomaly events.
- If `Integrity Score < 70`: exclude from `verified_score` and mark `UNDER_REVIEW`.

## 4) Anomaly Detection Logic
Rules must run synchronously on submission and asynchronously in periodic audits.

### Hard Flags
- Solve speed impossible:
  - Example: `100 questions in <= 3 minutes`.
- Instant accuracy jump:
  - Historical baseline near `40%` then immediate `~100%` with high confidence.
- Repeated answer pattern:
  - Identical answer vector across many attempts/tests/devices.
- Multi-account abuse:
  - Multiple accounts sharing stable device fingerprint + IP pattern + timing overlap.

### Suggested Event Codes
- `IMPOSSIBLE_SPEED`
- `ABNORMAL_ACCURACY_JUMP`
- `REPEATED_PATTERN`
- `MULTI_ACCOUNT_LINKAGE`
- `CLIENT_PAYLOAD_TAMPER`
- `TOKEN_REPLAY`

## 5) Security Controls
- Never accept client-side score, XP, rank, or integrity values.
- Only accept answer selections plus timing telemetry.
- Signed one-time `test_session.nonce`; reject replay.
- Server validates test window, question IDs, and option IDs.
- Rate limiting:
  - `start test`: strict per-user + per-IP.
  - `submit test`: stricter per-user + per-device.
- IP monitoring:
  - Store salted hash, subnet aggregation, velocity checks.
- Device fingerprinting:
  - Store hashed fingerprint, not raw PII.
- WAF + bot screening at edge if available.

## 6) Verification Pipeline
1. `POST /tests/:id/start`
- Server issues signed session nonce and expiration.

2. `POST /tests/:id/submit`
- Save raw answers into `raw_answer`.
- Compute speed/accuracy/consistency/integrity on backend.
- Generate anomaly events in `integrity_event`.
- Write result into `score_verification`.

3. Decision
- `review_state = PASSED` and integrity >= 70:
  - Eligible for leaderboard aggregation.
- Otherwise:
  - Mark `UNDER_REVIEW`, exclude from `verified_score`.

4. Recalculation Job (every 10 minutes)
- Aggregate from `score_verification` where `review_state='PASSED'`.
- Upsert into `verified_score`.
- Re-rank per `(period_key, category_key)`.
- Invalidate leaderboard cache.

5. Leaderboard Read Path
- API returns top users from `verified_score` only.
- Users under review are hidden from ranking and shown as `Under Review` in profile.

## 7) Performance Plan (2000+ Concurrent/Active Users)
- Precompute leaderboard in `verified_score`; avoid heavy joins on live requests.
- Composite indexes for `(period_key, category_key, leaderboard_score desc)`.
- Cursor pagination for deep leaderboard pages.
- Redis cache for top segments (`top_10`, `top_100`) with short TTL.
- Queue-based verification workers for anomaly-heavy checks.
- Batch recompute every 10 minutes plus incremental updates per submission.
- Keep raw and audit tables append-only; archive monthly partitions.
- Use read replicas for leaderboard API if traffic grows.

## 8) Operational Policies
- Manual review queue for `UNDER_REVIEW` users.
- Admin override requires audit trail entry.
- Integrity model thresholds versioned in config table.
- Alerting:
  - spike in `IMPOSSIBLE_SPEED`
  - high replay/token failures
  - abnormal shared fingerprint clusters
