import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  BadgeCheck,
  BarChart3,
  Flame,
  Gauge,
  Headphones,
  Lock,
  Medal,
  MessageSquareQuote,
  Mic,
  Radar as RadarIcon,
  Sparkles,
  Star,
  Target,
  Trophy,
  Zap,
} from 'lucide-react'
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
import { apiClient } from '@/lib/apiClient'
import type { LeaderboardResponse, LeaderboardRow } from '@/types/platform'
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
import {
  averageRating,
  initialsOf,
  speakerHandle,
  useSpeakerSocialStore,
} from '@/store/speakerSocialStore'
import { CountUp, ProgressRing, Reveal } from '@/components/fx'

const clampPct = (v: number) => Math.max(0, Math.min(100, Math.round(v)))

export default function SpeakerProfile() {
  const { id = 'me' } = useParams()
  const navigate = useNavigate()
  const user = useAuthStore((state: AuthState) => state.user)
  const sessions = useSpeakingStore((s) => s.sessions)
  const nicknames = useSpeakerSocialStore((s) => s.nicknames)
  const ratingsMap = useSpeakerSocialStore((s) => s.ratings)

  const [board, setBoard] = useState<LeaderboardResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const isSelf = id === 'me' || (!!user && id === user.id)
  const targetUserId = isSelf ? user?.id ?? null : id

  useEffect(() => {
    if (!user) return
    let active = true
    setLoading(true)
    apiClient
      .get<LeaderboardResponse>('/leaderboard?period=all', { auth: true })
      .then((data) => active && setBoard(data))
      .catch(() => active && setBoard(null))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [user])

  const rows = board?.rows ?? []
  const totalPlayers = rows.length
  const targetRow: LeaderboardRow | null = useMemo(() => {
    if (isSelf) return rows.find((r) => r.isCurrentUser) ?? null
    return rows.find((r) => r.userId === targetUserId) ?? null
  }, [rows, isSelf, targetUserId])

  const userSessions = useMemo(() => selectUserSessions(sessions, targetUserId), [sessions, targetUserId])
  const summary = useMemo(() => computeSummary(userSessions), [userSessions])
  const hasSpeaking = userSessions.length > 0

  const displayName = isSelf ? user?.fullName ?? 'You' : targetRow?.fullName ?? 'Speaker'
  const handle = speakerHandle(targetUserId, displayName, nicknames)
  const ratings = (targetUserId && ratingsMap[targetUserId]) || []
  const ratingAvg = averageRating(ratings)

  const rank = targetRow?.rank ?? null
  const percentile = rank && totalPlayers ? clampPct(100 - ((rank - 1) / totalPlayers) * 100) : null

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#fde8e8] via-[#fceaea] to-[#f9dede] px-4 py-8 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="ambient-mesh" />
        <div className="absolute -left-20 top-8 h-72 w-72 rounded-full bg-red-200/45 blur-3xl" />
        <div className="absolute -right-16 top-24 h-80 w-80 rounded-full bg-rose-200/35 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl space-y-6">
        <button onClick={() => navigate(-1)} className="premium-back-btn">
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </button>

        {/* Identity hero */}
        <Reveal>
          <section className="premium-hero p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-red-600 to-rose-600 text-3xl font-black text-white shadow-[0_16px_36px_rgba(220,38,38,0.32)]">
                  {initialsOf(displayName)}
                </div>
                {rank && rank <= 3 ? (
                  <span className="absolute -right-2 -top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-white shadow-md">
                    <Trophy className="h-4 w-4" />
                  </span>
                ) : null}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl font-black tracking-tight text-slate-900">{displayName}</h1>
                  {isSelf ? <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">YOU</span> : null}
                  <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-white px-2 py-0.5 text-xs font-semibold text-red-700">
                    <BadgeCheck className="h-3.5 w-3.5" /> @{handle}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  {targetRow ? `${targetRow.divisionLabel} division` : 'Speaking practitioner'}
                  {targetRow ? ` · ${targetRow.testsCompleted} tests` : ''}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Pill icon={<Trophy className="h-3.5 w-3.5" />} label={rank ? `Rank #${rank}` : 'Unranked'} />
                  <Pill icon={<Zap className="h-3.5 w-3.5" />} label={`${targetRow?.totalXp ?? user?.xp ?? 0} XP`} />
                  {hasSpeaking ? <Pill icon={<Mic className="h-3.5 w-3.5" />} label={`Best band ${summary.bestBand.toFixed(1)}`} /> : null}
                  <Pill icon={<Flame className="h-3.5 w-3.5" />} label={`${targetRow?.streak ?? summary.currentStreak} day streak`} />
                </div>
              </div>

              {/* Global standing gauge */}
              <div className="flex flex-col items-center rounded-3xl border border-red-100 bg-white/80 p-4">
                <ProgressRing value={percentile ?? 0} size={104} from="#f59e0b" to="#dc2626">
                  <div className="text-center leading-none">
                    <p className="text-xl font-black text-slate-900">{rank ? `#${rank}` : '—'}</p>
                    <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">Global rank</p>
                  </div>
                </ProgressRing>
                <p className="mt-2 text-[11px] font-semibold text-slate-500">
                  {percentile !== null ? `Top ${100 - percentile + 1}%` : user ? 'Complete a test to rank' : 'Sign in to rank'}
                </p>
              </div>
            </div>
          </section>
        </Reveal>

        {/* Rating summary (peer feedback) */}
        {ratingAvg.count > 0 ? (
          <Reveal>
            <section className="surface-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="inline-flex items-center gap-2 text-lg font-black text-slate-900">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-500" /> Peer Rating
                </h2>
                <span className="text-sm font-semibold text-slate-500">{ratingAvg.count} review(s)</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <RatingStat label="Overall" value={ratingAvg.overall} highlight />
                <RatingStat label="Fluency" value={ratingAvg.fluency} />
                <RatingStat label="Pronunciation" value={ratingAvg.pronunciation} />
                <RatingStat label="Helpfulness" value={ratingAvg.helpfulness} />
              </div>
            </section>
          </Reveal>
        ) : null}

        {/* Charts */}
        {isSelf && !hasSpeaking ? (
          <EmptySelf onStart={() => navigate('/speaking-community')} />
        ) : hasSpeaking ? (
          <SpeakingCharts
            summary={summary}
            bandTrend={computeBandTrend(userSessions)}
            skillRadar={computeSkillRadar(userSessions)}
            dailyActivity={computeDailyActivity(userSessions)}
            criteria={computeCriteriaBreakdown(userSessions)}
            recent={[...userSessions].reverse().slice(0, 6)}
          />
        ) : targetRow ? (
          <PerformanceCharts row={targetRow} percentile={percentile ?? 0} />
        ) : (
          <NoData loading={loading} signedIn={!!user} />
        )}
      </div>
    </div>
  )
}

function Pill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-red-100 bg-white px-3 py-1 text-xs font-bold text-slate-700">
      <span className="text-red-600">{icon}</span> {label}
    </span>
  )
}

function RatingStat({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl border p-3 text-center ${highlight ? 'border-amber-200 bg-amber-50/60' : 'border-red-100 bg-white'}`}>
      <p className="text-2xl font-black text-slate-900">{value.toFixed(1)}</p>
      <div className="mt-0.5 flex items-center justify-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={`h-3 w-3 ${i < Math.round(value) ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}`} />
        ))}
      </div>
      <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">{label}</p>
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

// ── Speaking-rich charts (self) ───────────────────────────────────────────────
function SpeakingCharts({
  summary,
  bandTrend,
  skillRadar,
  dailyActivity,
  criteria,
  recent,
}: {
  summary: ReturnType<typeof computeSummary>
  bandTrend: Array<{ label: string; band: number }>
  skillRadar: Array<{ skill: string; band: number }>
  dailyActivity: Array<{ label: string; minutes: number }>
  criteria: Array<{ criterion: string; band: number; fill: string }>
  recent: Array<{ id: string; modeLabel: string; overallBand: number; date: string; durationSec: number }>
}) {
  return (
    <Reveal>
      <section className="space-y-5">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Kpi icon={<Trophy className="h-4 w-4" />} label="Best Band" value={summary.bestBand.toFixed(1)} />
          <Kpi icon={<Gauge className="h-4 w-4" />} label="Avg Band" value={summary.averageBand.toFixed(1)} />
          <Kpi icon={<Headphones className="h-4 w-4" />} label="Sessions" value={<CountUp value={summary.sessionCount} />} />
          <Kpi icon={<Mic className="h-4 w-4" />} label="Minutes" value={<CountUp value={summary.totalMinutes} />} />
        </div>

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

          <ChartCard title="Speaking Activity (7 days)" icon={<BarChart3 className="h-4 w-4 text-red-600" />}>
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

        <div className="surface-card p-5">
          <h3 className="inline-flex items-center gap-2 text-base font-black text-slate-900">
            <Headphones className="h-4 w-4 text-red-600" /> Recent Sessions
          </h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {recent.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-xl border border-red-50 bg-white px-3 py-2">
                <div>
                  <p className="text-sm font-bold text-slate-900">{s.modeLabel}</p>
                  <p className="text-[11px] text-slate-500">{new Date(s.date).toLocaleDateString()} · {Math.round(s.durationSec / 60)} min</p>
                </div>
                <span className="rounded-full bg-gradient-to-r from-red-600 to-rose-600 px-3 py-1 text-sm font-black text-white">
                  {s.overallBand.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Reveal>
  )
}

// ── General performance charts (other users, from leaderboard) ────────────────
function PerformanceCharts({ row, percentile }: { row: LeaderboardRow; percentile: number }) {
  const radar = [
    { skill: 'Accuracy', value: clampPct(row.accuracy) },
    { skill: 'Consistency', value: clampPct(row.consistencyScore) },
    { skill: 'Speed', value: clampPct(row.speedEfficiency) },
    { skill: 'Focus', value: clampPct(row.focusConsistency) },
    { skill: 'Daily', value: clampPct(row.dailyCompletionRate) },
  ]
  const bars = [
    { label: 'Accuracy', value: clampPct(row.accuracy), fill: '#dc2626' },
    { label: 'Consistency', value: clampPct(row.consistencyScore), fill: '#f97316' },
    { label: 'Speed', value: clampPct(row.speedEfficiency), fill: '#e11d48' },
    { label: 'Focus', value: clampPct(row.focusConsistency), fill: '#fb7185' },
  ]
  return (
    <Reveal>
      <section className="space-y-5">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Kpi icon={<Trophy className="h-4 w-4" />} label="Global Rank" value={`#${row.rank}`} />
          <Kpi icon={<Zap className="h-4 w-4" />} label="Total XP" value={<CountUp value={row.totalXp} />} />
          <Kpi icon={<Target className="h-4 w-4" />} label="Accuracy" value={`${row.accuracy.toFixed(0)}%`} />
          <Kpi icon={<Medal className="h-4 w-4" />} label="Tests" value={<CountUp value={row.testsCompleted} />} />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard title="Performance Radar" icon={<RadarIcon className="h-4 w-4 text-red-600" />}>
            <ResponsiveContainer width="100%" height={230}>
              <RadarChart data={radar}>
                <PolarGrid stroke="#fecaca" />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: '#64748b' }} />
                <Radar dataKey="value" stroke="#dc2626" fill="#ef4444" fillOpacity={0.45} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Skill Scores" icon={<BarChart3 className="h-4 w-4 text-red-600" />}>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={bars} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fee2e2" />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#dc2626" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Global Standing" icon={<Gauge className="h-4 w-4 text-red-600" />}>
            <div className="flex h-[230px] flex-col items-center justify-center">
              <ProgressRing value={percentile} size={150} from="#f59e0b" to="#dc2626">
                <div className="text-center leading-none">
                  <p className="text-3xl font-black text-slate-900">{percentile}%</p>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Percentile</p>
                </div>
              </ProgressRing>
              <p className="mt-3 text-sm font-semibold text-slate-600">Ranked #{row.rank} globally</p>
            </div>
          </ChartCard>

          <ChartCard title="Division & Streak" icon={<Sparkles className="h-4 w-4 text-red-600" />}>
            <div className="flex h-[230px] flex-col items-center justify-center gap-3">
              <span className="rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-2 text-lg font-black text-white shadow-md">
                {row.divisionLabel}
              </span>
              <div className="flex items-center gap-2 text-2xl font-black text-slate-900">
                <Flame className="h-6 w-6 text-amber-500" /> {row.streak} day streak
              </div>
              <p className="text-sm text-slate-500">Integrity score {row.integrityScore}/100</p>
            </div>
          </ChartCard>
        </div>

        <div className="surface-card flex items-center gap-3 p-5">
          <Lock className="h-5 w-5 shrink-0 text-slate-400" />
          <p className="text-sm text-slate-600">
            This speaker’s detailed speaking history is private. You can still see their global performance and challenge them on the leaderboard.
          </p>
        </div>
      </section>
    </Reveal>
  )
}

function Kpi({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="surface-card p-4">
      <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-red-600">{icon} {label}</span>
      <p className="mt-1 text-2xl font-black text-slate-900">{value}</p>
    </div>
  )
}

function EmptySelf({ onStart }: { onStart: () => void }) {
  return (
    <Reveal>
      <section className="surface-card flex flex-col items-center p-10 text-center">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-red-500 to-rose-600 text-white">
          <Mic className="h-8 w-8" />
        </span>
        <h2 className="mt-4 text-2xl font-black text-slate-900">No speaking sessions yet</h2>
        <p className="mt-2 max-w-md text-sm text-slate-600">Complete an AI examiner session and your charts, bands and achievements will appear on your profile.</p>
        <button onClick={onStart} className="arena-primary-btn cta-sheen mt-6 px-6 py-3">Start a session</button>
      </section>
    </Reveal>
  )
}

function NoData({ loading, signedIn }: { loading: boolean; signedIn: boolean }) {
  return (
    <section className="surface-card flex items-center gap-3 p-6">
      <MessageSquareQuote className="h-5 w-5 text-slate-400" />
      <p className="text-sm text-slate-600">
        {loading
          ? 'Loading profile…'
          : signedIn
            ? 'This speaker hasn’t appeared on the leaderboard yet.'
            : 'Sign in to view community speaker profiles and rankings.'}
      </p>
    </section>
  )
}
