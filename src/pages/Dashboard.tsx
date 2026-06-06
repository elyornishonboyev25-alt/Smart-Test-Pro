import { useEffect, useMemo, type ComponentProps } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Award,
  BarChart3,
  Bot,
  Clock3,
  Crown,
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
  Star,
  TrendingUp,
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
    badgeColor: 'border-red-200 bg-red-50 text-red-700',
  },
  {
    title: 'IELTS Listening',
    description: 'Audio flow, distractor filtering, and notes.',
    icon: Headphones,
    path: '/ielts/listening',
    badge: 'IELTS',
    badgeColor: 'border-red-200 bg-red-50 text-red-700',
  },
  {
    title: 'IELTS Writing',
    description: 'Task 1 and Task 2 structured writing studio.',
    icon: PenSquare,
    path: '/ielts/writing',
    badge: 'IELTS',
    badgeColor: 'border-red-200 bg-red-50 text-red-700',
  },
  {
    title: 'IELTS Speaking',
    description: 'Part-by-part speaking with fluency insights.',
    icon: Mic2,
    path: '/ielts/speaking',
    badge: 'IELTS',
    badgeColor: 'border-red-200 bg-red-50 text-red-700',
  },
  {
    title: 'SAT Math',
    description: 'Algebra, problem solving, and speed blocks.',
    icon: Calculator,
    path: '/sat/math',
    badge: 'SAT',
    badgeColor: 'border-blue-200 bg-blue-50 text-blue-700',
  },
  {
    title: 'SAT Reading/Writing',
    description: 'Evidence pairing, grammar, and revision logic.',
    icon: GraduationCapIcon,
    path: '/sat/reading-writing',
    badge: 'SAT',
    badgeColor: 'border-blue-200 bg-blue-50 text-blue-700',
  },
] as const

const specialModules = [
  {
    title: 'National Certificate',
    subtitle: 'Official-style mock mode',
    path: '/tests',
    icon: Trophy,
    iconGradient: 'from-amber-500 to-orange-600',
  },
  {
    title: 'Mock Arena',
    subtitle: 'IELTS + SAT full simulation',
    path: '/mock',
    icon: ShieldCheckIcon,
    iconGradient: 'from-red-500 to-rose-600',
  },
  {
    title: 'Writing Studio',
    subtitle: 'Task 1 + Task 2 feedback',
    path: '/ielts/writing',
    icon: PenSquare,
    iconGradient: 'from-violet-500 to-purple-600',
  },
  {
    title: 'Speaking Studio',
    subtitle: 'Band estimate + pronunciation',
    path: '/ielts/speaking',
    icon: Mic2,
    iconGradient: 'from-emerald-500 to-green-600',
  },
  {
    title: 'Speaking Community',
    subtitle: 'Voice-only partner practice',
    path: '/speaking-community',
    icon: Headphones,
    iconGradient: 'from-sky-500 to-blue-600',
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
    icon: BookOpen,
    gradient: 'from-[#DC2626] to-[#B91C1C]',
  },
  {
    title: 'SAT Arena',
    subtitle: 'Math + Reading/Writing',
    path: '/sat',
    icon: Calculator,
    gradient: 'from-[#EF4444] to-[#DC2626]',
  },
  {
    title: 'Writing Studio',
    subtitle: 'Shared with IELTS Writing',
    path: '/ielts/writing',
    icon: PenSquare,
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    title: 'Speaking Studio',
    subtitle: 'Shared with IELTS Speaking',
    path: '/ielts/speaking',
    icon: Mic2,
    gradient: 'from-emerald-500 to-green-600',
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

const MEDAL_STYLES = ['text-amber-500', 'text-slate-400', 'text-orange-600'] as const

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
      {/* ── Hero ──────────────────────────────────────────────── */}
      <motion.section
        initial={minimalMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={minimalMotion ? { duration: 0.15 } : { duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        className="premium-hero relative overflow-hidden p-6 sm:p-8"
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-red-400/20 to-orange-300/10 blur-3xl" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="premium-top-chip inline-flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" />
              SmartTest Competitive Arena
            </span>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-[#111827] sm:text-5xl">
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

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/premium')}
              className="interactive-lift inline-flex items-center gap-2 rounded-xl border border-amber-300/60 bg-gradient-to-r from-amber-50 to-red-50 px-4 py-3 text-sm font-bold text-red-700 shadow-sm transition hover:shadow-md"
            >
              <Crown className="h-4 w-4 text-amber-500" />
              Go Premium
            </button>
            <button
              onClick={() => navigate('/tests')}
              className="cta-sheen interactive-lift inline-flex items-center rounded-xl bg-gradient-to-r from-[#DC2626] via-[#EF4444] to-[#B91C1C] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(239,68,68,0.35)] hover:-translate-y-0.5"
            >
              Start Practicing
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.section>

      {/* ── Metric cards ──────────────────────────────────────── */}
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

      {/* ── Main grid: left sidebar + right content ───────────── */}
      <section className="mt-8 grid gap-6 lg:grid-cols-10">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-3">
          {/* Leaderboard */}
          <div className="panel-surface relative overflow-hidden p-5">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-[0_8px_18px_rgba(245,158,11,0.35)]">
                  <Trophy className="h-4 w-4" />
                </span>
                <h2 className="text-base font-black tracking-tight text-[#1F2937]">Leaderboard</h2>
              </div>
              <button onClick={() => navigate('/leaderboard')} className="text-[11px] font-bold text-red-600 hover:text-red-700">
                View all
              </button>
            </div>

            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
              </div>
            ) : data ? (
              <div className="space-y-2">
                {data.miniLeaderboard.slice(0, 5).map((row, idx) => (
                  <div
                    key={`${row.rank}-${row.fullName}`}
                    className={`group flex items-center gap-3 rounded-xl border px-3 py-2.5 transition ${
                      row.isCurrentUser
                        ? 'border-red-200 bg-gradient-to-r from-red-50 to-rose-50 shadow-[0_8px_18px_rgba(220,38,38,0.1)]'
                        : 'border-slate-100 bg-white hover:border-red-100 hover:bg-red-50/30'
                    }`}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-black text-slate-600">
                      {idx < 3 ? (
                        <Crown className={`h-4 w-4 ${MEDAL_STYLES[idx]}`} />
                      ) : (
                        `#${row.rank}`
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-[#1F2937]">{row.fullName}</p>
                      <p className="text-[11px] font-medium text-[#64748B]">{Math.max(0, row.totalXp)} XP</p>
                    </div>
                    {row.isCurrentUser ? (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">You</span>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {/* Special Modules */}
          <div className="panel-surface relative overflow-hidden p-5">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-red-400/50 to-transparent" />
            <div className="mb-4 flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-[0_8px_18px_rgba(220,38,38,0.3)]">
                <Zap className="h-4 w-4" />
              </span>
              <h2 className="text-base font-black tracking-tight text-[#1F2937]">Special Modules</h2>
            </div>
            <div className="space-y-2">
              {specialModules.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.title}
                    onClick={() => navigate(item.path)}
                    className="interactive-lift group flex w-full items-center justify-between rounded-xl border border-red-100/70 bg-white px-3 py-2.5 text-left transition hover:border-red-200 hover:shadow-[0_8px_20px_rgba(220,38,38,0.08)]"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${item.iconGradient} text-white shadow-sm`}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-bold text-[#1F2937]">{item.title}</p>
                        <p className="text-[11px] text-[#64748B]">{item.subtitle}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-300 transition-colors group-hover:text-red-500" />
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-7">
          {/* Core Sections */}
          <div className="panel-surface relative overflow-hidden p-5">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#DC2626] to-[#B91C1C] text-white shadow-[0_8px_18px_rgba(220,38,38,0.3)]">
                  <Target className="h-4 w-4" />
                </span>
                <h2 className="text-base font-black tracking-tight text-[#1F2937]">Core Sections</h2>
              </div>
              <span className="rounded-full border border-red-100 bg-red-50 px-2.5 py-0.5 text-[10px] font-bold text-red-700">
                {rightPanelSections.length} sections
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {rightPanelSections.map((section) => {
                const Icon = section.icon
                return (
                  <motion.button
                    key={section.title}
                    onClick={() => navigate(section.path)}
                    className="group interactive-lift relative overflow-hidden rounded-2xl border border-red-100/70 bg-white p-4 text-left shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition hover:border-red-200 hover:shadow-[0_16px_36px_rgba(220,38,38,0.1)]"
                    {...(allowHoverMotion ? { whileHover: { y: -3 } } : {})}
                  >
                    <span className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-red-100/40 blur-2xl transition-opacity group-hover:opacity-80" />
                    <div className="relative mb-3 flex items-center justify-between">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-50 to-rose-50 text-red-600 shadow-sm transition group-hover:shadow-md">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${section.badgeColor}`}>
                        {section.badge}
                      </span>
                    </div>
                    <h3 className="relative text-sm font-bold text-[#1F2937]">{section.title}</h3>
                    <p className="relative mt-1 text-[12px] leading-5 text-[#64748B]">{section.description}</p>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Weekly Progress Chart */}
          <div className="panel-surface relative mt-6 overflow-hidden p-5">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-[0_8px_18px_rgba(16,185,129,0.3)]">
                  <TrendingUp className="h-4 w-4" />
                </span>
                <div>
                  <h2 className="text-base font-black tracking-tight text-[#1F2937]">Weekly Progress</h2>
                  <p className="text-[11px] font-medium text-[#64748B]">7-day tests and activity</p>
                </div>
              </div>
              {strongestDay ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                  <Flame className="h-3 w-3" />
                  Best: {strongestDay.label}
                </span>
              ) : null}
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
                      <Tooltip
                        cursor={{ fill: 'rgba(220,38,38,0.06)' }}
                        contentStyle={{
                          borderRadius: 14,
                          borderColor: '#FECACA',
                          boxShadow: '0 14px 30px rgba(15,23,42,0.12)',
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      />
                      <Bar dataKey="testsCompleted" radius={[10, 10, 4, 4]} fill="url(#weeklyGradientRedBlue)" animationDuration={700} />
                      <defs>
                        <linearGradient id="weeklyGradientRedBlue" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#EF4444" />
                          <stop offset="100%" stopColor="#B91C1C" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="mt-3 text-sm text-[#64748B]">
                  Most active day:{' '}
                  <span className="font-bold text-[#1F2937]">
                    {strongestDay?.label ?? 'N/A'} ({strongestDay?.testsCompleted ?? 0} tests)
                  </span>
                </p>
              </>
            ) : null}
          </div>
        </div>
      </section>

      {/* ── Weekly planner ────────────────────────────────────── */}
      <section className="mt-8">
        <WeeklyPlannerLab />
      </section>

      {/* ── Track Launch Board + Recent Activity ──────────────── */}
      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="panel-surface relative overflow-hidden p-5">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-red-400/50 to-transparent" />
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#DC2626] to-[#B91C1C] text-white shadow-[0_8px_18px_rgba(220,38,38,0.3)]">
                <Zap className="h-4 w-4" />
              </span>
              <h2 className="text-base font-black tracking-tight text-[#1F2937]">Track Launch Board</h2>
            </div>
            <button className="text-[11px] font-bold text-red-600 hover:text-red-700" onClick={() => navigate('/tests')}>
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
            <div className="space-y-2.5">
              {trackLaunches.map((track) => {
                const TrackIcon = track.icon
                return (
                  <article
                    key={track.title}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-red-100/70 bg-white p-3.5 transition hover:border-red-200 hover:shadow-[0_8px_20px_rgba(220,38,38,0.08)]"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${track.gradient} text-white shadow-sm`}>
                        <TrackIcon className="h-4 w-4" />
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-[#1F2937]">{track.title}</h3>
                        <p className="text-[11px] text-[#64748B]">{track.subtitle}</p>
                      </div>
                    </div>
                    <button
                      className="interactive-lift rounded-lg bg-gradient-to-r from-[#DC2626] to-[#B91C1C] px-3.5 py-1.5 text-xs font-bold text-white shadow-[0_6px_14px_rgba(220,38,38,0.25)] transition hover:shadow-[0_10px_20px_rgba(220,38,38,0.35)]"
                      onClick={() => navigate(track.path)}
                    >
                      Open
                    </button>
                  </article>
                )
              })}
            </div>
          )}
        </div>

        <div className="panel-surface panel-recent-activity relative overflow-hidden p-5">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-rose-400/50 to-transparent" />
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-[0_8px_18px_rgba(220,38,38,0.3)]">
                <Clock3 className="h-4 w-4" />
              </span>
              <h2 className="text-base font-black tracking-tight text-[#1F2937]">Recent Activity</h2>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          ) : data ? (
            <ol className="space-y-2.5" aria-label="Recent activity timeline">
              {data.activityTimeline.slice(0, 6).map((entry) => (
                <li key={entry.id} className="rounded-xl border border-red-100/60 bg-white px-3.5 py-3 transition hover:border-red-200 hover:shadow-sm">
                  <p className="text-sm font-bold text-[#1F2937]">{entry.title}</p>
                  <p className="mt-0.5 text-[12px] text-[#64748B]">{entry.description}</p>
                  <p className="mt-1 text-[11px] font-medium text-slate-400">
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

      {/* ── About ──────────────────────────────────────────────── */}
      <section id="about" className="premium-hero relative mt-8 overflow-hidden p-6 sm:p-8">
        <div className="pointer-events-none absolute -left-16 -top-16 h-52 w-52 rounded-full bg-red-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-orange-300/15 blur-3xl" />

        <div className="relative flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-red-700 shadow-sm">
              <Bot className="h-3 w-3" />
              AI-powered platform
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900">About SmartTest</h2>
            <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-600 sm:text-base">
              SmartTest turns IELTS &amp; SAT prep into a game-level experience. AI coaching, daily streaks, XP
              progression, and a structured roadmap to real results — all in one ecosystem.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-white px-3 py-1 text-xs font-bold text-red-700 shadow-[0_8px_18px_rgba(220,38,38,0.12)]">
            <Star className="h-3.5 w-3.5 text-amber-500" />
            Platform v2
          </span>
        </div>

        <div className="relative mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: 'AI Study Coach',
              value: 'Smart',
              note: 'Personal roadmap, weak-point analysis, and instant feedback',
              icon: Bot,
              gradient: 'from-red-500 to-rose-600',
            },
            {
              title: 'Gamified Learning',
              value: 'XP Level',
              note: 'Daily challenges, streaks, achievements, and leaderboards',
              icon: Flame,
              gradient: 'from-orange-500 to-amber-600',
            },
            {
              title: 'Deep Analytics',
              value: 'Insight',
              note: 'Skill trends, focus recommendations, and performance maps',
              icon: BarChart3,
              gradient: 'from-violet-500 to-purple-600',
            },
            {
              title: 'Target Scores',
              value: 'Results',
              note: 'Structured path to IELTS 6.5+ and SAT 1200+',
              icon: Target,
              gradient: 'from-emerald-500 to-green-600',
            },
          ].map((item) => {
            const Icon = item.icon
            return (
              <motion.article
                key={item.title}
                className="group relative overflow-hidden rounded-2xl border border-red-100/80 bg-white p-5 shadow-[0_14px_28px_rgba(15,23,42,0.06)] transition hover:shadow-[0_18px_36px_rgba(220,38,38,0.1)]"
                {...(allowHoverMotion ? { whileHover: { y: -3 } } : {})}
              >
                <span className={`pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-gradient-to-br ${item.gradient} opacity-[0.1] blur-2xl transition-opacity group-hover:opacity-20`} />
                <span className={`relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} text-white shadow-[0_10px_22px_rgba(15,23,42,0.18)]`}>
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.14em] text-red-700">{item.title}</p>
                <p className="mt-1.5 text-2xl font-black leading-none text-slate-900">{item.value}</p>
                <p className="mt-2 text-[12px] leading-5 text-slate-600">{item.note}</p>
              </motion.article>
            )
          })}
        </div>
      </section>
    </div>
  )
}
