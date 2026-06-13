/**
 * Free-trial allowance for non-premium learners.
 *
 * Every account that is NOT a genuine premium owner (see {@link isPremiumUser})
 * gets a small number of free uses per feature. Once the allowance is spent the
 * feature is gated behind the premium overlay. Premium owners are unlimited.
 *
 * Counters are stored locally per account id (or 'guest'); this is intentionally
 * client-side — it is a soft gate to drive upgrades, not a security boundary.
 */
export type TrialFeature = 'writing' | 'reading' | 'listening' | 'speakingDaily' | 'mock'

/** Free uses granted to non-premium accounts, per feature. */
export const TRIAL_LIMITS: Record<TrialFeature, number> = {
  writing: 2,
  reading: 2,
  listening: 2,
  speakingDaily: 2,
  mock: 2,
}

/** Total Speaking-community time (debate + partner) for non-premium accounts. */
export const COMMUNITY_TRIAL_SECONDS = 60 * 60 // 1 hour

const STORAGE_KEY = 'profai:free-trial:v1'

type AccountTrial = Partial<Record<TrialFeature, number>> & { communitySeconds?: number }
type TrialStore = Record<string, AccountTrial>

function scope(userId?: string | null) {
  return userId && userId.trim() ? userId : 'guest'
}

function readStore(): TrialStore {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as TrialStore) : {}
  } catch {
    return {}
  }
}

function writeStore(store: TrialStore) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {
    // Storage unavailable (private mode) — trial simply won't persist.
  }
}

/** How many free uses of a feature have been spent by this account. */
export function getTrialUsed(feature: TrialFeature, userId?: string | null): number {
  const account = readStore()[scope(userId)]
  return Math.max(0, account?.[feature] ?? 0)
}

/** Spend one free use of a feature; returns the new used-count. */
export function consumeTrial(feature: TrialFeature, userId?: string | null): number {
  const store = readStore()
  const key = scope(userId)
  const current = store[key]?.[feature] ?? 0
  const next = current + 1
  store[key] = { ...store[key], [feature]: next }
  writeStore(store)
  return next
}

/** Seconds of Speaking-community time already spent by this account. */
export function getCommunitySecondsUsed(userId?: string | null): number {
  const account = readStore()[scope(userId)]
  return Math.max(0, account?.communitySeconds ?? 0)
}

/** Add Speaking-community seconds; returns the new total used. */
export function addCommunitySeconds(seconds: number, userId?: string | null): number {
  const store = readStore()
  const key = scope(userId)
  const current = store[key]?.communitySeconds ?? 0
  const next = current + Math.max(0, Math.round(seconds))
  store[key] = { ...store[key], communitySeconds: next }
  writeStore(store)
  return next
}
