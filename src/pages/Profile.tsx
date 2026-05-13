import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  BrainCircuit,
  Gem,
  Sparkles,
  Target,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { apiClient } from '@/lib/apiClient'
import { useAsyncData } from '@/hooks/useAsyncData'
import type { ProfileOverview } from '@/types/platform'
import { Skeleton } from '@/components/common/Skeleton'
import { useMotionPreferences } from '@/hooks/useMotionPreferences'
import { useAuthStore, type AuthState } from '@/store/authStore'

function toneByInsight(type: 'warning' | 'tip' | 'success') {
  if (type === 'warning') {
    return {
      wrapper: 'border-amber-200 bg-amber-50/80',
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
    }
  }

  if (type === 'tip') {
    return {
      wrapper: 'border-blue-200 bg-blue-50/80',
      icon: BrainCircuit,
      iconColor: 'text-blue-600',
    }
  }

  return {
    wrapper: 'border-emerald-200 bg-emerald-50/80',
    icon: Sparkles,
    iconColor: 'text-emerald-600',
  }
}

function ProgressMeter({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
        <p className="text-xs font-semibold text-slate-700">{value.toFixed(1)}</p>
      </div>
      <div className="h-2 w-full rounded-full bg-red-100/70">
        <div
          className="h-full rounded-full bg-gradient-to-r from-red-600 via-rose-500 to-orange-500"
          style={{ width: `${Math.max(5, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  )
}

function CompactSkeletonCard() {
  return <Skeleton className="h-24 w-full rounded-2xl" />
}

const skillMatrixLegend = [
  { label: 'Speaking', tone: 'ielts' },
  { label: 'Writing', tone: 'ielts' },
  { label: 'Listening', tone: 'ielts' },
  { label: 'SAT Math', tone: 'sat' },
  { label: 'SAT Reading/Writing', tone: 'sat' },
] as const

const guestProfilePreview: ProfileOverview = {
  profile: {
    id: 'guest-preview',
    fullName: 'Guest Learner',
    email: 'preview@smarttest.pro',
    level: 2,
    xp: 240,
    currentStreak: 0,
    longestStreak: 0,
    memberSince: new Date().toISOString(),
  },
  stats: {
    totalAttempts: 0,
    averageScore: 0,
    averageAccuracy: 0,
    totalXpFromAttempts: 0,
  },
  levelProgress: {
    currentLevelThreshold: 200,
    nextLevelThreshold: 400,
    xpIntoCurrent: 40,
    levelSpan: 200,
    progressPercent: 20,
  },
  competitive: {
    rank: 512,
    previousRank: 512,
    rankDelta: 0,
    rankTrend: 'same',
    division: 'BRONZE',
    divisionLabel: 'Bronze',
    rankScore: 22.4,
    uniqueTests: 0,
    validatedAttempts: 0,
    discardedAttempts: 0,
    integrityScore: 100,
    breakdown: {
      accuracy: 0,
      speedEfficiency: 0,
      consistencyScore: 0,
      engagementScore: 8,
      inactivityDays: 0,
      inactivityPenalty: 0,
      activityDecay: 0,
      difficultyMultiplier: 1,
      normalizedDifficulty: 0,
      improvementDelta: 0,
      validatedAttempts: 0,
      discardedAttempts: 0,
      integrityScore: 100,
      rankScore: 22.4,
    },
  },
  skillAnalytics: {
    overall: {
      skillPower: 12.8,
      percentile: 86.4,
      projectedSatScore: 980,
      projectedPercentScore: 38,
      growthRate: 0,
      totalUsers: 15420,
    },
    radar: [
      { category: 'IELTS', label: 'IELTS Reading', attempts: 0, accuracy: 0, speed: 0, consistency: 0, skillPower: 14 },
      { category: 'IELTS', label: 'IELTS Listening', attempts: 0, accuracy: 0, speed: 0, consistency: 0, skillPower: 13 },
      { category: 'IELTS', label: 'IELTS Writing', attempts: 0, accuracy: 0, speed: 0, consistency: 0, skillPower: 10 },
      { category: 'IELTS', label: 'IELTS Speaking', attempts: 0, accuracy: 0, speed: 0, consistency: 0, skillPower: 15 },
      { category: 'SAT', label: 'SAT Math', attempts: 0, accuracy: 0, speed: 0, consistency: 0, skillPower: 12 },
      { category: 'SAT', label: 'SAT Reading/Writing', attempts: 0, accuracy: 0, speed: 0, consistency: 0, skillPower: 11 },
    ],
    trackBreakdown: [
      { key: 'IELTS_READING', label: 'IELTS Reading', group: 'IELTS', attempts: 0, accuracy: 0, speed: 0, consistency: 0, skillPower: 14 },
      { key: 'IELTS_LISTENING', label: 'IELTS Listening', group: 'IELTS', attempts: 0, accuracy: 0, speed: 0, consistency: 0, skillPower: 13 },
      { key: 'IELTS_WRITING', label: 'IELTS Writing', group: 'IELTS', attempts: 0, accuracy: 0, speed: 0, consistency: 0, skillPower: 10 },
      { key: 'IELTS_SPEAKING', label: 'IELTS Speaking', group: 'IELTS', attempts: 0, accuracy: 0, speed: 0, consistency: 0, skillPower: 15 },
      { key: 'SAT_MATH', label: 'SAT Math', group: 'SAT', attempts: 0, accuracy: 0, speed: 0, consistency: 0, skillPower: 12 },
      { key: 'SAT_READING_WRITING', label: 'SAT Reading/Writing', group: 'SAT', attempts: 0, accuracy: 0, speed: 0, consistency: 0, skillPower: 11 },
    ],
    distribution: {
      mean: 46.5,
      standardDeviation: 13.2,
      userSkillPower: 12.8,
      curve: [
        { score: 0, density: 0.002 },
        { score: 20, density: 0.012 },
        { score: 40, density: 0.028 },
        { score: 60, density: 0.024 },
        { score: 80, density: 0.01 },
        { score: 100, density: 0.002 },
      ],
    },
    xpMomentum: [
      { label: 'W1', xp: 0, score: 0, accuracy: 0 },
      { label: 'W2', xp: 40, score: 0, accuracy: 0 },
      { label: 'W3', xp: 120, score: 0, accuracy: 0 },
      { label: 'W4', xp: 240, score: 0, accuracy: 0 },
    ],
    insights: [
      {
        id: 'guest-tip-register',
        type: 'tip',
        title: 'Create your account',
        message: 'Register now so this dashboard can start tracking your real skill and rank.',
      },
      {
        id: 'guest-tip-tests',
        type: 'success',
        title: 'Start with one full test',
        message: 'Your matrix and ranking engine activate after the first submitted attempt.',
      },
      {
        id: 'guest-warning-history',
        type: 'warning',
        title: 'Guest mode does not save',
        message: 'Progress shown here is preview-only until you register.',
      },
    ],
  },
  weeklyActivity: [
    { date: '2026-04-11', label: 'Sat', testsCompleted: 0, questionsAnswered: 0, xpEarned: 0, active: false },
    { date: '2026-04-12', label: 'Sun', testsCompleted: 0, questionsAnswered: 0, xpEarned: 0, active: false },
    { date: '2026-04-13', label: 'Mon', testsCompleted: 0, questionsAnswered: 0, xpEarned: 0, active: false },
    { date: '2026-04-14', label: 'Tue', testsCompleted: 0, questionsAnswered: 0, xpEarned: 0, active: false },
    { date: '2026-04-15', label: 'Wed', testsCompleted: 0, questionsAnswered: 0, xpEarned: 0, active: false },
    { date: '2026-04-16', label: 'Thu', testsCompleted: 0, questionsAnswered: 0, xpEarned: 0, active: false },
    { date: '2026-04-17', label: 'Fri', testsCompleted: 0, questionsAnswered: 0, xpEarned: 0, active: false },
  ],
  achievements: [
    {
      unlockedAt: new Date().toISOString(),
      achievement: {
        id: 'guest-preview-achievement',
        slug: 'first-step',
        title: 'First Step',
        description: 'Register and complete your first test to unlock real achievements.',
        icon: 'spark',
        xpReward: 50,
      },
    },
  ],
  recentAttempts: [
    {
      id: 'guest-preview-attempt',
      finalScore: 0,
      percentage: 0,
      xpEarned: 0,
      completedAt: new Date().toISOString(),
      test: {
        id: 'guest-preview-test',
        title: 'Preview Mode',
        category: 'IELTS',
        difficulty: 'EASY',
      },
    },
  ],
}

export default function Profile() {
  const navigate = useNavigate()
  const { allowHoverMotion, minimalMotion } = useMotionPreferences()
  const user = useAuthStore((state: AuthState) => state.user)
  const isGuestPreview = !user
  const { data: fetchedData, loading, error } = useAsyncData<ProfileOverview | null>(
    () => (user ? apiClient.get('/profile/overview') : Promise.resolve(null)),
    [user],
  )
  const data = fetchedData ?? (isGuestPreview ? guestProfilePreview : null)

  const summaryCards = useMemo(() => {
    if (!data) return []

    return [
      {
        label: 'Total Attempts',
        value: data.stats.totalAttempts.toString(),
        icon: Activity,
      },
      {
        label: 'Skill Power',
        value: `${data.skillAnalytics.overall.skillPower.toFixed(1)}`,
        icon: BrainCircuit,
      },
      {
        label: 'Percentile',
        value: `Top ${(100 - data.skillAnalytics.overall.percentile).toFixed(1)}%`,
        icon: Target,
      },
      {
        label: 'Integrity',
        value: data.competitive ? `${data.competitive.integrityScore.toFixed(1)}%` : '--',
        icon: Gem,
      },
    ]
  }, [data])

  const trendText = useMemo(() => {
    if (!data?.competitive) return null

    if (data.competitive.rankTrend === 'up') {
      return `Up +${data.competitive.rankDelta}`
    }

    if (data.competitive.rankTrend === 'down') {
      return `Down ${data.competitive.rankDelta}`
    }

    return 'Stable'
  }, [data])

  const distributionMarker = useMemo(() => {
    const curve = data?.skillAnalytics.distribution.curve
    const userSkill = data?.skillAnalytics.distribution.userSkillPower

    if (!curve || curve.length === 0 || userSkill === undefined) return null

    return curve.reduce((closest, point) => {
      if (!closest) return point
      return Math.abs(point.score - userSkill) < Math.abs(closest.score - userSkill) ? point : closest
    }, null as { score: number; density: number } | null)
  }, [data])

  const ieltsSkills = useMemo(
    () => data?.skillAnalytics.trackBreakdown.filter((item) => item.group === 'IELTS') ?? [],
    [data],
  )
  const satSkills = useMemo(
    () => data?.skillAnalytics.trackBreakdown.filter((item) => item.group === 'SAT') ?? [],
    [data],
  )

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.section
        initial={minimalMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={minimalMotion ? { duration: 0.14 } : { duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
        className="premium-hero p-6 sm:p-9"
      >
        {loading ? (
          <>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="mt-3 h-4 w-80" />
          </>
        ) : data ? (
          <div className="relative grid gap-4 xl:grid-cols-[minmax(0,1fr)_25rem] xl:items-start">
            <div className="xl:pr-2">
              <div className="premium-top-controls">
                <button
                  type="button"
                  onClick={() => navigate('/tests')}
                  className="premium-back-btn"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
                <span className="premium-top-chip">Performance Profile</span>
              </div>
              <h1 className="premium-section-title mt-4">
                Performance <span className="arena-title-accent-red">Dashboard</span>
              </h1>
              <p className="premium-section-subtitle">
                {data.profile.fullName} | {data.profile.email}
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-3 xl:w-full">
              <div className="hero-metric-card interactive-lift">
                <p className="hero-metric-label">Current Rank</p>
                <p className="hero-metric-value-sm">{data.competitive ? `#${data.competitive.rank}` : '--'}</p>
                <p className="hero-metric-note">{trendText ?? 'Stable'}</p>
              </div>
              <div className="hero-metric-card interactive-lift">
                <p className="hero-metric-label">Level / XP</p>
                <p className="hero-metric-value-sm">{data.profile.level} | {data.profile.xp}</p>
                <p className="hero-metric-note">Career progress</p>
              </div>
              <div className="hero-metric-card interactive-lift">
                <p className="hero-metric-label">Division</p>
                <p className="hero-metric-value-sm">
                  {data.competitive ? data.competitive.divisionLabel : 'Unranked'}
                </p>
                <p className="hero-metric-note">Competitive tier</p>
              </div>
            </div>
          </div>
        ) : null}
      </motion.section>

      {isGuestPreview ? (
        <div className="mt-6 rounded-2xl border border-red-200/80 bg-[linear-gradient(120deg,rgba(254,226,226,0.76),rgba(255,255,255,0.92),rgba(255,228,230,0.8))] p-4 text-sm text-red-800 shadow-[0_10px_24px_rgba(220,38,38,0.1)]">
          Preview mode is active. Register to see your real analytics, ranking, and saved attempts.
        </div>
      ) : null}
      {!isGuestPreview && error ? <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => <CompactSkeletonCard key={index} />)
          : summaryCards.map((card) => {
            const Icon = card.icon
            return (
              <motion.article
                key={card.label}
                whileHover={allowHoverMotion ? { y: -4, scale: 1.015 } : undefined}
                className="surface-card p-5"
              >
                <div className="relative flex items-center justify-between">
                  <p className="text-sm text-slate-500">{card.label}</p>
                  <Icon className="h-4 w-4 text-red-600" />
                </div>
                <p className="mt-3 text-3xl font-black text-slate-900">{card.value}</p>
              </motion.article>
            )
          })}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="surface-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Dynamic Ranking Engine</h2>
            {data?.competitive ? (
              <span className="rounded-xl border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                Score {data.competitive.rankScore.toFixed(2)}
              </span>
            ) : null}
          </div>

          {loading ? (
            <div className="mt-4 space-y-3">
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ) : data?.competitive ? (
            <div className="mt-4 space-y-4">
              <div className="grid gap-2 sm:grid-cols-3">
                <div className="rounded-xl border border-red-100 bg-red-50/60 px-3 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-red-600">Unique tests</p>
                  <p className="mt-1 text-lg font-black text-slate-900">{data.competitive.uniqueTests}</p>
                </div>
                <div className="rounded-xl border border-red-100 bg-red-50/60 px-3 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-red-600">Validated</p>
                  <p className="mt-1 text-lg font-black text-slate-900">{data.competitive.validatedAttempts}</p>
                </div>
                <div className="rounded-xl border border-red-100 bg-red-50/60 px-3 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-red-600">Discarded</p>
                  <p className="mt-1 text-lg font-black text-slate-900">{data.competitive.discardedAttempts}</p>
                </div>
              </div>
              <ProgressMeter label="Accuracy Weight" value={data.competitive.breakdown.accuracy} />
              <ProgressMeter label="Speed Efficiency" value={data.competitive.breakdown.speedEfficiency} />
              <ProgressMeter label="Consistency Score" value={data.competitive.breakdown.consistencyScore} />
              <ProgressMeter label="Engagement Score" value={data.competitive.breakdown.engagementScore} />
              <ProgressMeter label="Activity Decay %" value={data.competitive.breakdown.activityDecay} />
              <ProgressMeter label="Difficulty Impact" value={data.competitive.breakdown.normalizedDifficulty} />
              <ProgressMeter label="Improvement Delta" value={data.competitive.breakdown.improvementDelta} />
              <ProgressMeter label="Integrity Score" value={data.competitive.breakdown.integrityScore} />
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-600">Complete a few tests to activate your competitive engine breakdown.</p>
          )}
        </div>

        <div className="surface-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Insight Engine</h2>
            <span className="premium-chip text-[10px]">Auto Recommendations</span>
          </div>

          {loading ? (
            <div className="mt-4 space-y-3">
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {data?.skillAnalytics.insights.map((insight) => {
                const tone = toneByInsight(insight.type)
                const Icon = tone.icon
                return (
                  <motion.article
                    key={insight.id}
                    whileHover={allowHoverMotion ? { y: -2 } : undefined}
                    className={`rounded-xl border p-3 ${tone.wrapper}`}
                  >
                    <div className="flex items-start gap-2">
                      <Icon className={`mt-0.5 h-4 w-4 ${tone.iconColor}`} />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{insight.title}</p>
                        <p className="mt-1 text-xs leading-5 text-slate-600">{insight.message}</p>
                      </div>
                    </div>
                  </motion.article>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="surface-card p-6">
          <h2 className="text-xl font-semibold text-slate-900">IELTS + SAT Skill Matrix</h2>
          <p className="mt-1 text-sm text-slate-500">SkillPower = (Accuracy x 0.6) + (Speed x 0.2) + (Consistency x 0.2)</p>

          {loading ? (
            <Skeleton className="mt-4 h-72 w-full rounded-2xl" />
          ) : data ? (
            <div className="mt-4 space-y-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-red-700">IELTS Skills</p>
                <div className="mt-2 space-y-2">
                  {ieltsSkills.map((skill) => (
                    <ProgressMeter key={skill.key} label={skill.label} value={skill.skillPower} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-rose-700">SAT Skills</p>
                <div className="mt-2 space-y-2">
                  {satSkills.map((skill) => (
                    <ProgressMeter key={skill.key} label={skill.label} value={skill.skillPower} />
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={data.skillAnalytics.trackBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#FEE2E2" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      borderColor: '#FECACA',
                    }}
                  />
                  <Bar dataKey="skillPower" radius={[8, 8, 3, 3]} fill="#DC2626" />
                </BarChart>
              </ResponsiveContainer>
              <div className="rounded-2xl border border-red-100 bg-gradient-to-r from-red-50/60 to-rose-50/40 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-red-700">Skill Labels</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {skillMatrixLegend.map((item) => (
                    <span
                      key={item.label}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        item.tone === 'ielts'
                          ? 'border border-red-200 bg-white text-red-700'
                          : 'border border-rose-200 bg-white text-rose-700'
                      }`}
                    >
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="surface-card p-6">
          <h2 className="text-xl font-semibold text-slate-900">Platform Distribution</h2>
          <p className="mt-1 text-sm text-slate-500">
            Percentile {data ? `${data.skillAnalytics.overall.percentile.toFixed(1)}%` : '--'} across {data?.skillAnalytics.overall.totalUsers ?? '--'} users
          </p>

          {loading ? (
            <Skeleton className="mt-4 h-72 w-full rounded-2xl" />
          ) : data ? (
            <div className="mt-4 h-72 w-full">
              <ResponsiveContainer>
                <LineChart data={data.skillAnalytics.distribution.curve}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#FEE2E2" />
                  <XAxis dataKey="score" tick={{ fill: '#64748B', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#64748B', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      borderColor: '#FECACA',
                    }}
                  />
                  <Line type="monotone" dataKey="density" stroke="#DC2626" strokeWidth={2.5} dot={false} />
                  {distributionMarker ? (
                    <ReferenceDot
                      x={distributionMarker.score}
                      y={distributionMarker.density}
                      r={6}
                      fill="#DC2626"
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                  ) : null}
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : null}
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="surface-card p-6">
          <h2 className="text-xl font-semibold text-slate-900">XP Momentum Timeline</h2>
          <p className="mt-1 text-sm text-slate-500">Cumulative XP and score trend over your recent attempts</p>

          {loading ? (
            <Skeleton className="mt-4 h-72 w-full rounded-2xl" />
          ) : data ? (
            <div className="mt-4 h-72 w-full">
              <ResponsiveContainer>
                <LineChart data={data.skillAnalytics.xpMomentum}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#FEE2E2" />
                  <XAxis dataKey="label" tick={{ fill: '#64748B', fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fill: '#64748B', fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      borderColor: '#FECACA',
                    }}
                  />
                  <Line yAxisId="left" type="monotone" dataKey="xp" stroke="#DC2626" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line yAxisId="right" type="monotone" dataKey="score" stroke="#0F172A" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : null}
        </div>

        <div className="surface-card p-6">
          <h2 className="text-xl font-semibold text-slate-900">Weekly Activity</h2>
          {loading ? (
            <Skeleton className="mt-4 h-72 w-full rounded-2xl" />
          ) : data ? (
            <div className="mt-4 h-72 w-full">
              <ResponsiveContainer>
                <BarChart data={data.weeklyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#FEE2E2" vertical={false} />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                  <Tooltip
                    cursor={{ fill: 'rgba(220,38,38,0.08)' }}
                    contentStyle={{ borderRadius: 12, borderColor: '#FECACA' }}
                  />
                  <Bar dataKey="testsCompleted" radius={[8, 8, 3, 3]} fill="#DC2626" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : null}
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="surface-card p-6">
          <h2 className="text-xl font-semibold text-slate-900">Achievements</h2>
          {loading ? (
            <div className="mt-4 space-y-3">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          ) : data ? (
            <div className="mt-4 space-y-3">
              {data.achievements.slice(0, 6).map((entry) => (
                <div key={entry.achievement.id} className="rounded-xl border border-red-100 bg-white/90 p-3">
                  <p className="text-sm font-semibold text-slate-900">{entry.achievement.title}</p>
                  <p className="mt-1 text-xs text-slate-600">{entry.achievement.description}</p>
                  <p className="mt-1 text-[11px] font-semibold text-red-700">+{entry.achievement.xpReward} XP</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="surface-card p-6">
          <h2 className="text-xl font-semibold text-slate-900">Recent Attempts</h2>
          {loading ? (
            <div className="mt-4 space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : data ? (
            <div className="mt-4 space-y-3">
              {data.recentAttempts.map((attempt) => (
                <div key={attempt.id} className="rounded-xl border border-red-100 bg-white/90 p-3">
                  <p className="text-sm font-semibold text-slate-900">{attempt.test.title}</p>
                  <p className="mt-1 text-xs text-slate-600">
                    Score {attempt.finalScore.toFixed(1)}% | Accuracy {attempt.percentage.toFixed(1)}% | +{attempt.xpEarned} XP
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    {new Date(attempt.completedAt).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  )
}


