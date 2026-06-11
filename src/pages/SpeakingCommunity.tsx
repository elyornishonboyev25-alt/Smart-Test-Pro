import { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Award,
  BarChart3,
  Briefcase,
  Clock3,
  Flame,
  GraduationCap,
  Headphones,
  Lock,
  Mic,
  Radar as RadarIcon,
  Sparkles,
  Trophy,
  Users,
  Wand2,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useAuthStore, type AuthState } from '@/store/authStore'
import {
  computeBandTrend,
  computeCriteriaBreakdown,
  computeDailyActivity,
  computeSkillRadar,
  computeSummary,
  selectUserSessions,
  useSpeakingStore,
} from '@/store/speakingStore'
import { xpForBand } from '@/lib/speakingScoring'
import { CountUp, Reveal } from '@/components/fx'
import ExaminerSession, { type SessionConfig } from '@/components/speaking/ExaminerSession'
import SpeakerDirectory from '@/components/speaking/SpeakerDirectory'
import LivePartnerSession from '@/components/speaking/LivePartnerSession'
import type { InterviewKind } from '@/data/speakingQuestions'

type View = 'hub' | 'examiner' | 'session' | 'live'

type ExaminerOption = {
  mode: SessionConfig['mode']
  interviewKind?: InterviewKind
  label: string
  short: string
  description: string
  meta: string
  group: 'ielts' | 'interview'
}

const EXAMINER_OPTIONS: ExaminerOption[] = [
  { mode: 'part1', label: 'IELTS Part 1', short: 'Part 1', description: 'Friendly questions about you — home, work, hobbies, daily life.', meta: '~5 min', group: 'ielts' },
  { mode: 'part2', label: 'IELTS Part 2', short: 'Cue Card', description: 'A cue card with 1 min prep + a 2-minute long turn.', meta: '~4 min', group: 'ielts' },
  { mode: 'part3', label: 'IELTS Part 3', short: 'Discussion', description: 'Deeper, abstract two-way discussion with challenging follow-ups.', meta: '~6 min', group: 'ielts' },
  { mode: 'full_mock', label: 'Full IELTS Mock', short: 'Full Mock', description: 'The complete exam — Part 1 → 2 → 3 — graded as one band score.', meta: '~14 min', group: 'ielts' },
  { mode: 'interview', interviewKind: 'university', label: 'University Interview', short: 'University', description: 'Admissions-style interview: motivation, fit and goals.', meta: '~8 min', group: 'interview' },
  { mode: 'interview', interviewKind: 'scholarship', label: 'Scholarship Interview', short: 'Scholarship', description: 'Committee interview: achievements, leadership and impact.', meta: '~8 min', group: 'interview' },
  { mode: 'interview', interviewKind: 'job', label: 'Job Interview', short: 'Job', description: 'Hiring-manager interview: experience and problem-solving.', meta: '~8 min', group: 'interview' },
]

export default function SpeakingCommunity() {
  const navigate = useNavigate()
  const user = useAuthStore((state: AuthState) => state.user)
  const sessions = useSpeakingStore((s) => s.sessions)
  const addSession = useSpeakingStore((s) => s.addSession)

  const [view, setView] = useState<View>('hub')
  const [config, setConfig] = useState<SessionConfig | null>(null)
  const dashboardRef = useRef<HTMLDivElement | null>(null)

  const userSessions = useMemo(() => selectUserSessions(sessions, user?.id ?? null), [sessions, user?.id])
  const summary = useMemo(() => computeSummary(userSessions), [userSessions])
  const speakingXp = useMemo(() => userSessions.reduce((acc, s) => acc + xpForBand(s.overallBand), 0), [userSessions])

  const bandTrend = useMemo(() => computeBandTrend(userSessions), [userSessions])
  const skillRadar = useMemo(() => computeSkillRadar(userSessions), [userSessions])
  const dailyActivity = useMemo(() => computeDailyActivity(userSessions), [userSessions])
  const criteria = useMemo(() => computeCriteriaBreakdown(userSessions), [userSessions])

  const activeOption = useMemo(
    () => (config ? EXAMINER_OPTIONS.find((o) => o.mode === config.mode && o.interviewKind === config.interviewKind) : null),
    [config],
  )

  const launch = (option: ExaminerOption) => {
    setConfig({ mode: option.mode, interviewKind: option.interviewKind })
    setView('session')
  }

  // ── Active examiner session ───────────────────────────────────────────────
  if (view === 'session' && config) {
    return (
      <div className="relative min-h-screen bg-gradient-to-b from-[#fde8e8] via-[#fceaea] to-[#f9dede] px-4 py-8 sm:px-6 lg:px-10">
        <div className="relative mx-auto w-full max-w-5xl">
          <ExaminerSession
            config={config}
            modeLabel={activeOption?.label ?? 'Speaking Session'}
            onExit={() => { setView('hub'); setConfig(null) }}
            onSaved={(evaluation) => {
              addSession({
                userId: user?.id ?? null,
                modeLabel: activeOption?.label ?? 'Speaking Session',
                kind: 'examiner',
                overallBand: evaluation.overallBand,
                fluencyBand: evaluation.fluencyBand,
                lexicalBand: evaluation.lexicalBand,
                grammarBand: evaluation.grammarBand,
                pronunciationBand: evaluation.pronunciationBand,
                durationSec: evaluation.stats.durationSec,
                wordCount: evaluation.stats.wordCount,
                fillerCount: evaluation.stats.fillerCount,
                summary: evaluation.summary,
              })
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#fde8e8] via-[#fceaea] to-[#f9dede] px-4 py-8 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="ambient-mesh" />
        <div className="ambient-grid" />
        <div className="absolute -left-20 top-8 h-72 w-72 rounded-full bg-red-200/45 blur-3xl" />
        <div className="absolute -right-16 top-20 h-80 w-80 rounded-full bg-rose-200/35 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl space-y-6">
        {/* Hero */}
        <Reveal>
          <section className="premium-hero p-6 sm:p-10">
            <div className="relative grid gap-4 xl:grid-cols-[minmax(0,1fr)_26rem] xl:items-center">
              <div>
                <span className="premium-top-chip">
                  <Mic className="h-3.5 w-3.5" /> Speaking Arena
                </span>
                <h1 className="premium-section-title mt-4">
                  Speak with an <span className="arena-title-accent-red">AI Examiner</span>
                </h1>
                <p className="premium-section-subtitle max-w-3xl">
                  A real-time IELTS speaking experience: the examiner talks to you, asks adaptive follow-up questions,
                  remembers what you said, and grades you across all four band criteria — just like the real exam.
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-3 xl:w-full">
                <HeroStat label="Avg Band" value={summary.averageBand ? summary.averageBand.toFixed(1) : '—'} note="Across sessions" />
                <HeroStat label="Speaking Time" value={`${summary.totalMinutes}m`} note="Total practised" />
                <HeroStat label="Day Streak" value={String(summary.currentStreak)} note="Keep it alive" />
              </div>
            </div>
          </section>
        </Reveal>

        {/* Hub views */}
        {view === 'hub' ? (
          <>
            {/* Mode cards */}
            <section className="grid gap-5 lg:grid-cols-3">
              <ModeCard
                accent="from-red-600 to-rose-600"
                icon={<Wand2 className="h-6 w-6" />}
                title="AI Examiner"
                subtitle="Solo practice + band score"
                description="Part 1, 2, 3 or a full mock. The AI speaks, listens, follows up and grades you with detailed feedback."
                cta="Start practising"
                onClick={() => setView('examiner')}
              />
              <ModeCard
                accent="from-rose-500 to-red-600"
                icon={<Users className="h-6 w-6" />}
                title="Live Partner"
                subtitle="Real people, real voice"
                description="Get matched with another learner for a live, microphone-only speaking session, then rate each other."
                cta="Find a partner"
                badge="New"
                onClick={() => setView('live')}
              />
              <ModeCard
                accent="from-amber-500 to-orange-600"
                icon={<BarChart3 className="h-6 w-6" />}
                title="My Progress"
                subtitle="Charts, streaks & rank"
                description="Open your full speaking profile — band trend, skill radar, achievements and your global rank."
                cta="View my profile"
                onClick={() => navigate('/speaker/me')}
              />
            </section>

            {/* Dashboard */}
            <div ref={dashboardRef} className="scroll-mt-6">
              {userSessions.length === 0 ? (
                <EmptyDashboard onStart={() => setView('examiner')} />
              ) : (
                <Dashboard
                  summary={summary}
                  speakingXp={speakingXp}
                  bandTrend={bandTrend}
                  skillRadar={skillRadar}
                  dailyActivity={dailyActivity}
                  criteria={criteria}
                  recent={[...userSessions].reverse().slice(0, 5)}
                />
              )}
            </div>

            {/* Community directory */}
            <Reveal>
              <SpeakerDirectory />
            </Reveal>
          </>
        ) : null}

        {/* Examiner picker */}
        {view === 'examiner' ? (
          <ExaminerPicker onPick={launch} onBack={() => setView('hub')} />
        ) : null}

        {/* Live partner — real-time peer practice */}
        {view === 'live' ? <LivePartnerSession onExit={() => setView('hub')} /> : null}
      </div>
    </div>
  )
}

// ── Hero stat ────────────────────────────────────────────────────────────────
function HeroStat({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="hero-metric-card interactive-lift">
      <p className="hero-metric-label">{label}</p>
      <p className="hero-metric-value-sm hero-metric-value-compact">{value}</p>
      <p className="hero-metric-note">{note}</p>
    </div>
  )
}

// ── Mode card ────────────────────────────────────────────────────────────────
function ModeCard({
  accent,
  icon,
  title,
  subtitle,
  description,
  cta,
  badge,
  onClick,
}: {
  accent: string
  icon: React.ReactNode
  title: string
  subtitle: string
  description: string
  cta: string
  badge?: string
  onClick: () => void
}) {
  return (
    <motion.button
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="surface-card group relative overflow-hidden p-6 text-left"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-red-100/50 blur-2xl transition group-hover:bg-red-200/60" />
      {badge ? (
        <span className="absolute right-4 top-4 rounded-full bg-red-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
          {badge}
        </span>
      ) : null}
      <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-[0_12px_24px_rgba(220,38,38,0.28)]`}>
        {icon}
      </span>
      <h3 className="mt-4 text-xl font-black text-slate-900">{title}</h3>
      <p className="text-xs font-semibold uppercase tracking-wide text-red-600">{subtitle}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-red-700 group-hover:gap-2">
        {cta} <span className="transition-all">→</span>
      </span>
    </motion.button>
  )
}

// ── Examiner picker ──────────────────────────────────────────────────────────
function ExaminerPicker({ onPick, onBack }: { onPick: (o: ExaminerOption) => void; onBack: () => void }) {
  const ielts = EXAMINER_OPTIONS.filter((o) => o.group === 'ielts')
  const interviews = EXAMINER_OPTIONS.filter((o) => o.group === 'interview')
  return (
    <Reveal>
      <section className="surface-card p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="inline-flex items-center gap-2 text-2xl font-black text-slate-900">
            <Headphones className="h-6 w-6 text-red-600" /> Choose your session
          </h2>
          <button onClick={onBack} className="arena-secondary-btn text-sm">Back</button>
        </div>

        <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-red-600">IELTS Speaking</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ielts.map((o) => (
            <PickCard key={o.label} option={o} onPick={onPick} />
          ))}
        </div>

        <p className="mt-7 text-xs font-bold uppercase tracking-[0.14em] text-red-600">Mock Interviews</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {interviews.map((o) => (
            <PickCard key={o.label} option={o} onPick={onPick} />
          ))}
        </div>
      </section>
    </Reveal>
  )
}

function PickCard({ option, onPick }: { option: ExaminerOption; onPick: (o: ExaminerOption) => void }) {
  const Icon = option.group === 'interview'
    ? option.interviewKind === 'job'
      ? Briefcase
      : GraduationCap
    : option.mode === 'full_mock'
      ? Trophy
      : Mic
  return (
    <motion.button
      whileHover={{ y: -3 }}
      onClick={() => onPick(option)}
      className="rounded-2xl border border-red-100 bg-white p-4 text-left transition hover:border-red-300 hover:shadow-[0_14px_30px_rgba(220,38,38,0.12)]"
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-50 to-rose-100 text-red-600">
          <Icon className="h-5 w-5" />
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-500">
          <Clock3 className="h-3 w-3" /> {option.meta}
        </span>
      </div>
      <p className="mt-3 text-sm font-black text-slate-900">{option.label}</p>
      <p className="mt-1 text-xs leading-5 text-slate-600">{option.description}</p>
    </motion.button>
  )
}

// ── Dashboard ────────────────────────────────────────────────────────────────
type SummaryT = ReturnType<typeof computeSummary>

function Dashboard({
  summary,
  speakingXp,
  bandTrend,
  skillRadar,
  dailyActivity,
  criteria,
  recent,
}: {
  summary: SummaryT
  speakingXp: number
  bandTrend: Array<{ label: string; band: number }>
  skillRadar: Array<{ skill: string; band: number }>
  dailyActivity: Array<{ label: string; minutes: number }>
  criteria: Array<{ criterion: string; band: number; fill: string }>
  recent: Array<{ id: string; modeLabel: string; overallBand: number; date: string; durationSec: number }>
}) {
  const badges = computeBadges(summary)
  return (
    <Reveal>
      <section className="space-y-5">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white">
            <BarChart3 className="h-4 w-4" />
          </span>
          <h2 className="text-xl font-black text-slate-900">Your Speaking Dashboard</h2>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <KpiCard icon={<Trophy className="h-4 w-4" />} label="Best Band" value={summary.bestBand.toFixed(1)} />
          <KpiCard icon={<Sparkles className="h-4 w-4" />} label="Speaking XP" value={<CountUp value={speakingXp} />} />
          <KpiCard icon={<Headphones className="h-4 w-4" />} label="Sessions" value={<CountUp value={summary.sessionCount} />} />
          <KpiCard icon={<Flame className="h-4 w-4" />} label="Streak" value={`${summary.currentStreak}d`} />
        </div>

        {/* Charts */}
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard title="Band Trend" icon={<BarChart3 className="h-4 w-4 text-red-600" />}>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={bandTrend} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fee2e2" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis domain={[0, 9]} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip />
                <Line type="monotone" dataKey="band" stroke="#dc2626" strokeWidth={3} dot={{ r: 4, fill: '#dc2626' }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Skill Radar" icon={<RadarIcon className="h-4 w-4 text-red-600" />}>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={skillRadar}>
                <PolarGrid stroke="#fecaca" />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: '#64748b' }} />
                <Radar dataKey="band" stroke="#dc2626" fill="#ef4444" fillOpacity={0.45} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Speaking Activity (7 days)" icon={<Clock3 className="h-4 w-4 text-red-600" />}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={dailyActivity} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fee2e2" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip />
                <Bar dataKey="minutes" radius={[6, 6, 0, 0]} fill="#f43f5e" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Criteria Breakdown" icon={<RadarIcon className="h-4 w-4 text-red-600" />}>
            <ResponsiveContainer width="100%" height={220}>
              <RadialBarChart data={criteria} innerRadius="25%" outerRadius="100%" startAngle={90} endAngle={-270}>
                <RadialBar background dataKey="band" cornerRadius={8} />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {criteria.map((c) => (
                <span key={c.criterion} className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.fill }} /> {c.criterion} {c.band.toFixed(1)}
                </span>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Achievements + recent */}
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="surface-card p-5">
            <h3 className="inline-flex items-center gap-2 text-base font-black text-slate-900">
              <Award className="h-4 w-4 text-amber-500" /> Achievements
            </h3>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {badges.map((b) => (
                <div
                  key={b.label}
                  className={`rounded-2xl border p-3 text-center ${
                    b.unlocked ? 'border-amber-200 bg-gradient-to-br from-amber-50 to-white' : 'border-slate-100 bg-slate-50/60 opacity-60'
                  }`}
                >
                  <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full">
                    {b.unlocked ? <span className="text-xl">{b.emoji}</span> : <Lock className="h-4 w-4 text-slate-400" />}
                  </div>
                  <p className="mt-1 text-[11px] font-bold text-slate-700">{b.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card p-5">
            <h3 className="inline-flex items-center gap-2 text-base font-black text-slate-900">
              <Headphones className="h-4 w-4 text-red-600" /> Recent Sessions
            </h3>
            <div className="mt-3 space-y-2">
              {recent.map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-xl border border-red-50 bg-white px-3 py-2">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{s.modeLabel}</p>
                    <p className="text-[11px] text-slate-500">
                      {new Date(s.date).toLocaleDateString()} · {Math.round(s.durationSec / 60)} min
                    </p>
                  </div>
                  <span className="rounded-full bg-gradient-to-r from-red-600 to-rose-600 px-3 py-1 text-sm font-black text-white">
                    {s.overallBand.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  )
}

function KpiCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="surface-card p-4">
      <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-red-600">{icon} {label}</span>
      <p className="mt-1 text-2xl font-black text-slate-900">{value}</p>
    </div>
  )
}

function ChartCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="surface-card p-5">
      <h3 className="mb-2 inline-flex items-center gap-2 text-sm font-black text-slate-900">{icon} {title}</h3>
      {children}
    </div>
  )
}

function EmptyDashboard({ onStart }: { onStart: () => void }) {
  return (
    <Reveal>
      <section className="surface-card flex flex-col items-center p-10 text-center">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-[0_16px_32px_rgba(220,38,38,0.3)]">
          <Mic className="h-8 w-8" />
        </span>
        <h2 className="mt-4 text-2xl font-black text-slate-900">Your speaking journey starts here</h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
          Finish your first AI examiner session to unlock your personal dashboard — band trend, skill radar,
          speaking time and achievements will appear here.
        </p>
        <button onClick={onStart} className="arena-primary-btn cta-sheen mt-6 px-6 py-3">
          <Wand2 className="mr-2 h-5 w-5" /> Start your first session
        </button>
      </section>
    </Reveal>
  )
}

// ── Badges (retention) ────────────────────────────────────────────────────────
function computeBadges(summary: SummaryT) {
  return [
    { label: 'First Words', emoji: '🎙️', unlocked: summary.sessionCount >= 1 },
    { label: '10 Sessions', emoji: '🔥', unlocked: summary.sessionCount >= 10 },
    { label: 'Band 7 Club', emoji: '🏅', unlocked: summary.bestBand >= 7 },
    { label: '7-Day Streak', emoji: '⚡', unlocked: summary.currentStreak >= 7 },
    { label: '30-Day Streak', emoji: '🌟', unlocked: summary.currentStreak >= 30 },
    { label: '100-Day Streak', emoji: '👑', unlocked: summary.currentStreak >= 100 },
  ]
}
