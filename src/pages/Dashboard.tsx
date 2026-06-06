import { useEffect, useMemo, type ComponentProps } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Award,
  BarChart3,
  Clock3,
  Flame,
  Sparkles,
  Target,
  ArrowRight,
  Zap,
  BookOpen,
  Calculator,
  PenSquare,
  Mic2,
  Trophy,
  Headphones,
} from 'lucide-react'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { apiClient } from '@/lib/apiClient'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useMotionPreferences } from '@/hooks/useMotionPreferences'
import type { DashboardOverview } from '@/types/platform'
import { useAuthStore, type AuthState } from '@/store/authStore'
import WeeklyPlannerLab from '@/components/dashboard/WeeklyPlannerLab'
import { MetricSkeletonGrid, Skeleton } from '@/components/common/Skeleton'

const metricCardStyle = [
  {
    title: 'Total Tests',
    icon: BarChart3,
    key: 'totalTests',
    gradient: 'from-[#DC2626] to-[#B91C1C]',
    soft: 'from-red-50 to-rose-50/30',
  },
  {
    title: 'Average Score',
    icon: Target,
    key: 'averageScore',
    gradient: 'from-[#EF4444] to-[#DC2626]',
    soft: 'from-orange-50 to-red-50/30',
  },
  {
    title: 'Current Rank',
    icon: Award,
    key: 'currentRank',
    gradient: 'from-[#F87171] to-[#DC2626]',
    soft: 'from-amber-50 to-orange-50/30',
  },
  {
    title: 'Current Streak',
    icon: Flame,
    key: 'currentStreak',
    gradient: 'from-[#FB7185] to-[#DC2626]',
    soft: 'from-rose-50 to-red-50/30',
  },
] as const

const rightPanelSections = [
  {
    title: 'IELTS Reading',
    description: 'Passage strategy, timing, and inference control.',
    icon: BookOpen,
    path: '/ielts/reading',
    badge: 'IELTS',
  },
  {
    title: 'IELTS Listening',
    description: 'Audio flow, distractor filtering, and notes.',
    icon: Headphones,
    path: '/ielts/listening',
    badge: 'IELTS',
  },
  {
    title: 'IELTS Writing',
    description: 'Task 1 and Task 2 structured writing studio.',
    icon: PenSquare,
    path: '/ielts/writing',
    badge: 'IELTS',
  },
  {
    title: 'IELTS Speaking',
    description: 'Part-by-part speaking with fluency insights.',
    icon: Mic2,
    path: '/ielts/speaking',
    badge: 'IELTS',
  },
  {
    title: 'SAT Math',
    description: 'Algebra, problem solving, and speed blocks.',
    icon: Calculator,
    path: '/sat/math',
    badge: 'SAT',
  },
  {
    title: 'SAT Reading/Writing',
    description: 'Evidence pairing, grammar, and revision logic.',
    icon: GraduationCapIcon,
    path: '/sat/reading-writing',
    badge: 'SAT',
  },
] as const

const specialModules = [
  {
    title: 'National Certificate',
    subtitle: 'Official-style mock mode',
    path: '/tests',
    icon: Trophy,
  },
  {
    title: 'Mock Arena',
    subtitle: 'IELTS + SAT full simulation',
    path: '/mock',
    icon: ShieldCheckIcon,
  },
  {
    title: 'Writing Studio',
    subtitle: 'Task 1 + Task 2 feedback',
    path: '/ielts/writing',
    icon: PenSquare,
  },
  {
    title: 'Speaking Studio',
    subtitle: 'Band estimate + pronunciation',
    path: '/ielts/speaking',
    icon: Mic2,
  },
  {
    title: 'Speaking Community',
    subtitle: 'Voice-only partner practice',
    path: '/speaking-community',
    icon: Headphones,
  },
] as const

function formatMetric(key: string, value: number | null) {
  if (value === null) return 'N/A'
  if (key === 'averageScore') return `${value.toFixed(1)}%`
  if (key === 'currentRank') return `#${value}`
  return String(value)
}

const trackLaunches = [
  {
    title: 'IELTS Arena',
    subtitle: 'Reading, Listening, Writing, Speaking',
    path: '/ielts',
  },
  {
    title: 'SAT Arena',
    subtitle: 'Math + Reading/Writing',
    path: '/sat',
  },
  {
    title: 'Writing Studio',
    subtitle: 'Shared with IELTS Writing',
    path: '/ielts/writing',
  },
  {
    title: 'Speaking Studio',
    subtitle: 'Shared with IELTS Speaking',
    path: '/ielts/speaking',
  },
] as const

const guestDashboardOverview: DashboardOverview = {
  metrics: {
    totalTests: 0,
    averageScore: 0,
    currentRank: null,
    currentStreak: 0,
  },
  weeklyProgress: [
    { date: '2026-04-11', label: 'Sat', testsCompleted: 0, questionsAnswered: 0, active: false },
    { date: '2026-04-12', label: 'Sun', testsCompleted: 0, questionsAnswered: 0, active: false },
    { date: '2026-04-13', label: 'Mon', testsCompleted: 0, questionsAnswered: 0, active: false },
    { date: '2026-04-14', label: 'Tue', testsCompleted: 0, questionsAnswered: 0, active: false },
    { date: '2026-04-15', label: 'Wed', testsCompleted: 0, questionsAnswered: 0, active: false },
    { date: '2026-04-16', label: 'Thu', testsCompleted: 0, questionsAnswered: 0, active: false },
    { date: '2026-04-17', label: 'Fri', testsCompleted: 0, questionsAnswered: 0, active: false },
  ],
  recommendedTests: [],
  activityTimeline: [],
  miniLeaderboard: [],
}

function GraduationCapIcon(props: ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 10 12 5 2 10l10 5 10-5Z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  )
}

function ShieldCheckIcon(props: ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3 5 6v6c0 5 3.5 8 7 9 3.5-1 7-4 7-9V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuthStore((state: AuthState) => state.user)
  const { reducedMotion, minimalMotion, allowHoverMotion } = useMotionPreferences()
  const accentFullText = 'Exam Environment for SAT and IELTS'

  const { data, loading, error, refetch } = useAsyncData<DashboardOverview>(
    async () => {
      try {
        return await apiClient.get('/dashboard/overview', { auth: !!user })
      } catch (fetchError) {
        if (!user) return guestDashboardOverview
        throw fetchError
      }
    },
    [user],
  )

  const strongestDay = useMemo(() => {
    if (!data?.weeklyProgress?.length) return null
    return [...data.weeklyProgress].sort((left, right) => right.testsCompleted - left.testsCompleted)[0]
  }, [data?.weeklyProgress])

  const hoverLiftProps = allowHoverMotion
    ? { whileHover: { y: -4, scale: 1.015 }, transition: { duration: 0.2 } }
    : {}

  useEffect(() => {
    if (location.pathname !== '/about') return
    const timeoutId = window.setTimeout(() => {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 120)
    return () => window.clearTimeout(timeoutId)
  }, [location.pathname])

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.section
        initial={minimalMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={minimalMotion ? { duration: 0.15 } : { duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        className="premium-hero p-6 sm:p-8"
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="premium-top-chip">
              SmartTest Competitive Arena
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#111827] sm:text-5xl">
              <motion.span
                className="block"
                initial={reducedMotion ? false : { opacity: 0, y: 12, filter: 'blur(3px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={reducedMotion ? { duration: 0.01 } : { duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
              >
                Experience Real Computer-Delivered
              </motion.span>
              <motion.span
                initial={reducedMotion ? false : { clipPath: 'inset(0 100% 0 0)', opacity: 0 }}
                animate={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
                transition={reducedMotion ? { duration: 0.01 } : { duration: 1.2, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="premium-title-accent dashboard-accent-reveal relative mt-3 inline-flex max-w-full whitespace-normal will-change-transform"
              >
                {accentFullText}
              </motion.span>
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-[#475569]">
              SmartTest combines SAT and IELTS preparation in one premium environment with realistic exam flow, live analytics, and competitive ranking.
            </p>
          </div>

          <button
            onClick={() => navigate('/tests')}
            className="cta-sheen interactive-lift inline-flex items-center rounded-xl bg-gradient-to-r from-[#DC2626] via-[#EF4444] to-[#B91C1C] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(239,68,68,0.35)] hover:-translate-y-0.5 hover:opacity-95"
          >
            Start Practicing
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </motion.section>

      <section className="mt-8">
        {loading ? (
          <MetricSkeletonGrid />
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p>{error}</p>
            <button className="mt-3 rounded-lg border border-red-300 px-3 py-1 text-xs" onClick={() => void refetch()}>
              Retry
            </button>
          </div>
        ) : data ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metricCardStyle.map((metric) => {
              const Icon = metric.icon
              const metricValue = data.metrics[metric.key]

              return (
                <motion.article
                  key={metric.key}
                  className={`group interactive-lift relative overflow-hidden rounded-2xl border border-red-100/80 bg-gradient-to-br ${metric.soft} p-5 shadow-[0_16px_38px_rgba(220,38,38,0.09)]`}
                  {...hoverLiftProps}
                >
                  <span
                    className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${metric.gradient} opacity-[0.12] blur-2xl transition-opacity duration-300 group-hover:opacity-20`}
                  />
                  <div className="relative flex items-center justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#64748B]">{metric.title}</p>
                    <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${metric.gradient} text-white shadow-[0_10px_22px_rgba(220,38,38,0.3)]`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="relative mt-4 text-[2rem] font-black leading-none tracking-tight text-[#1F2937]">
                    {formatMetric(metric.key, metricValue)}
                  </p>
                  <div className="relative mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.18)]" />
                    Live update
                  </div>
                </motion.article>
              )
            })}
          </div>
        ) : null}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-10">
        <div className="space-y-6 lg:col-span-3">
          <div className="panel-surface p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#1F2937]">Competitive Leaderboard</h2>
              <Zap className="h-5 w-5 text-red-600" />
            </div>

            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
              </div>
            ) : data ? (
              <div className="space-y-2">
                {data.miniLeaderboard.slice(0, 5).map((row) => (
                  <div
                    key={`${row.rank}-${row.fullName}`}
                    className={`rounded-xl border px-3 py-2 ${row.isCurrentUser
                      ? 'border-red-200 bg-red-50'
                      : 'border-slate-200 bg-slate-50'
                      }`}
                  >
                    <p className="text-sm font-semibold text-[#1F2937]">#{row.rank} {row.fullName}</p>
                    <p className="mt-1 text-xs text-[#64748B]">Pts: {Math.max(0, row.totalXp)}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="panel-surface p-5">
            <h2 className="text-lg font-semibold text-[#1F2937]">Special Modules</h2>
            <div className="mt-4 space-y-2">
              {specialModules.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.title}
                    onClick={() => navigate(item.path)}
                    className="interactive-lift flex w-full items-center justify-between rounded-xl border border-red-100 bg-red-50/70 px-3 py-2.5 text-left hover:bg-red-100"
                  >
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-white p-1.5 text-red-700">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1F2937]">{item.title}</p>
                        <p className="text-xs text-[#64748B]">{item.subtitle}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[#64748B]" />
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="panel-surface p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="dashboard-heading-strong text-lg">Core Sections ({rightPanelSections.length})</h2>
              <span className="text-xs text-[#64748B]">30/70 layout active</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {rightPanelSections.map((section) => {
                const Icon = section.icon
                return (
                  <motion.button
                    key={section.title}
                    onClick={() => navigate(section.path)}
                    className="panel-soft interactive-lift p-4 text-left hover:-translate-y-0.5 hover:border-red-300 hover:shadow-md"
                    {...(allowHoverMotion ? { whileHover: { y: -3 } } : {})}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="rounded-lg bg-red-100 p-2 text-red-700">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-red-700">
                        {section.badge}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-[#1F2937]">{section.title}</h3>
                    <p className="mt-1 text-xs text-[#64748B]">{section.description}</p>
                  </motion.button>
                )
              })}
            </div>
          </div>

          <div className="panel-surface mt-6 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="dashboard-heading-strong text-xl">Weekly Progress</h2>
                <p className="dashboard-subtitle-strong text-sm">7-day tests and activity</p>
              </div>
              <Sparkles className="h-5 w-5 text-red-600" />
            </div>

            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : data ? (
              <>
                <div className="h-64 w-full">
                  <ResponsiveContainer>
                    <BarChart data={data.weeklyProgress} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                      <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                      <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                      <Tooltip cursor={{ fill: 'rgba(220,38,38,0.06)' }} contentStyle={{ borderRadius: 12, borderColor: '#FECACA' }} />
                      <Bar dataKey="testsCompleted" radius={[10, 10, 4, 4]} fill="url(#weeklyGradientRedBlue)" animationDuration={700} />
                      <defs>
                        <linearGradient id="weeklyGradientRedBlue" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#DC2626" />
                          <stop offset="100%" stopColor="#B91C1C" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="mt-3 text-sm text-[#64748B]">
                  Most active day: <span className="font-semibold text-[#1F2937]">{strongestDay?.label ?? 'N/A'} ({strongestDay?.testsCompleted ?? 0} tests)</span>
                </p>
              </>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mt-8">
        <WeeklyPlannerLab />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="panel-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#1F2937]">Track Launch Board</h2>
            <button className="text-sm font-medium text-red-600 hover:text-red-700" onClick={() => navigate('/tests')}>
              Open library
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="rounded-xl border border-amber-200 bg-amber-50/70 px-3 py-2 text-xs font-medium text-amber-900">
                Current question bank is cleared. New test sets will be added next.
              </div>
              {trackLaunches.map((track) => (
                <article key={track.title} className="panel-soft p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-[#1F2937]">{track.title}</h3>
                      <p className="mt-1 text-xs text-[#64748B]">{track.subtitle}</p>
                    </div>
                    <button
                      className="interactive-lift rounded-lg bg-gradient-to-r from-[#DC2626] to-[#B91C1C] px-3 py-1.5 text-xs font-semibold text-white"
                      onClick={() => navigate(track.path)}
                    >
                      Open
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="panel-surface panel-recent-activity p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#1F2937]">Recent Activity</h2>
            <Clock3 className="h-5 w-5 text-red-500" />
          </div>

          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          ) : data ? (
            <ol className="space-y-3" aria-label="Recent activity timeline">
              {data.activityTimeline.slice(0, 6).map((entry) => (
                <li key={entry.id} className="panel-recent-entry">
                  <p className="text-sm font-semibold text-[#1F2937]">{entry.title}</p>
                  <p className="mt-1 text-xs text-[#64748B]">{entry.description}</p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    {new Date(entry.date).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </li>
              ))}
            </ol>
          ) : null}
        </div>
      </section>

      <section id="about" className="premium-hero mt-8 p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">About the Platform</h2>
            <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-600 sm:text-base">
              SmartTest is a unified learning arena built for serious SAT and IELTS students. It combines a full test library, strict timing workflows, deep review tools, and competitive progress tracking in one seamless experience.
            </p>
          </div>
          <span className="rounded-full border border-red-200 bg-white px-3 py-1 text-xs font-semibold text-red-700 shadow-[0_8px_18px_rgba(220,38,38,0.12)]">
            Platform v2
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: 'Unified Test Engine',
              value: 'Exam-First',
              note: 'Timed workflows with real test pressure',
              icon: Target,
              tone: 'from-red-500/16 to-rose-500/8',
            },
            {
              title: 'Adaptive Review',
              value: 'Precision',
              note: 'Mistake isolation, answer mapping, and retake loops',
              icon: Sparkles,
              tone: 'from-orange-400/15 to-red-500/8',
            },
            {
              title: 'Deep Analytics',
              value: 'Insight',
              note: 'Skill power, trend lines, and focus recommendations',
              icon: BarChart3,
              tone: 'from-red-400/14 to-pink-500/8',
            },
            {
              title: 'Competitive Layer',
              value: 'Ranked',
              note: 'Integrity-focused leaderboard and weekly performance race',
              icon: Award,
              tone: 'from-rose-400/16 to-orange-500/10',
            },
          ].map((item) => {
            const Icon = item.icon
            return (
              <article key={item.title} className={`relative overflow-hidden rounded-2xl border border-red-100 bg-gradient-to-br ${item.tone} p-4 shadow-[0_14px_28px_rgba(220,38,38,0.1)]`}>
                <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-white text-red-700">
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-red-700">{item.title}</p>
                <p className="mt-2 text-3xl font-black leading-none text-slate-900">{item.value}</p>
                <p className="mt-2 text-sm text-slate-600">{item.note}</p>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}
