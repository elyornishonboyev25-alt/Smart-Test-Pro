import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  BookOpenText,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock3,
  Flame,
  Headphones,
  Layers3,
  Lock,
  PlayCircle,
  Search,
  Sparkles,
  Target,
  Trophy,
  type LucideIcon,
} from 'lucide-react'

import {
  getIeltsFullTestCatalog,
  getIeltsPassageCatalog,
  isAvailableIeltsTrackTest,
  type IeltsTrackType,
} from '@/utils/ieltsTrackCatalog'
import { useMotionPreferences } from '@/hooks/useMotionPreferences'

type CatalogFilter = 'all-tests' | 'passages' | 'full-tests'

type CatalogRow = {
  id: string
  testId: string
  title: string
  subtitle: string
  badge: 'passage' | 'full-test'
  level: 'EASY' | 'MEDIUM' | 'HARD'
  durationMinutes: number
  questionCount: number
  availableNow: boolean
  comingSoon: boolean
}

type TrackEngagement = {
  completedIds: string[]
  lastVisitedTestId: string | null
  streakDays: number
  lastActiveDate: string | null
}

type EngagementStore = Record<IeltsTrackType, TrackEngagement>

type TrackTheme = {
  heroPanel: string
  heroGlowPrimary: string
  heroGlowSecondary: string
  accentTitle: 'arena-title-accent-red' | 'arena-title-accent-blue'
  accentText: string
  chip: string
  backButton: string
  metricCard: string
  metricLabel: string
  sidebarPanel: string
  sidebarSwitchWrap: string
  filterHeading: string
  filterActive: string
  filterInactive: string
  filterIconInactive: string
  roadmapPanel: string
  continueCard: string
  progressCard: string
  searchInput: string
  searchIcon: string
  timelineRail: string
  timelineNode: string
  timelineNodeDone: string
  rowHover: string
  neutralBadge: string
  recommendedBadge: string
  newBadge: string
  actionReady: string
  actionDisabled: string
  skeletonTint: string
}

const TRACK_ENGAGEMENT_STORAGE_KEY = 'smarttest:ielts-track-dashboard:v2'
const CARD_EASE = [0.22, 1, 0.36, 1] as const
const DAILY_GOAL = 2
const MILESTONES = [1, 2, 3, 5, 8, 12]

const TRACK_THEMES: Record<IeltsTrackType, TrackTheme> = {
  reading: {
    heroPanel:
      'border-rose-100/85 bg-[linear-gradient(142deg,rgba(255,255,255,0.99),rgba(255,244,247,0.95))] shadow-[0_24px_56px_rgba(190,24,93,0.14)]',
    heroGlowPrimary: 'bg-rose-200/55',
    heroGlowSecondary: 'bg-orange-200/45',
    accentTitle: 'arena-title-accent-red',
    accentText: 'text-rose-700',
    chip: 'border-rose-200 bg-rose-50/80 text-rose-700',
    backButton:
      'border-rose-200 bg-white/90 text-rose-700 shadow-[0_8px_18px_rgba(190,24,93,0.14)] hover:border-rose-300 hover:bg-rose-50',
    metricCard: 'border-rose-100/85 bg-white/90 shadow-[0_12px_28px_rgba(190,24,93,0.11)]',
    metricLabel: 'text-rose-600',
    sidebarPanel: 'border-rose-100/85 bg-white/95 shadow-[0_18px_42px_rgba(190,24,93,0.1)]',
    sidebarSwitchWrap: 'border-rose-100 bg-rose-50/45',
    filterHeading: 'text-rose-600',
    filterActive:
      'border-rose-500 bg-gradient-to-r from-rose-600 via-red-500 to-orange-500 text-white shadow-[0_16px_30px_rgba(190,24,93,0.24)]',
    filterInactive: 'border-rose-100 text-slate-700 hover:border-rose-300 hover:bg-rose-50/45',
    filterIconInactive: 'border-rose-100 bg-rose-50 text-rose-700',
    roadmapPanel: 'border-rose-100/85 bg-white/95 shadow-[0_20px_46px_rgba(15,23,42,0.08)]',
    continueCard: 'border-rose-200/85 bg-gradient-to-r from-rose-50/85 via-white to-orange-50/80',
    progressCard: 'border-rose-200/80 bg-gradient-to-br from-white to-rose-50/75',
    searchInput: 'border-rose-100 focus:border-rose-300 focus:ring-rose-100',
    searchIcon: 'text-rose-400',
    timelineRail: 'bg-gradient-to-b from-rose-200 via-rose-100 to-transparent',
    timelineNode: 'border-rose-300 bg-white text-rose-600 shadow-[0_0_0_4px_rgba(255,241,242,1)]',
    timelineNodeDone:
      'border-emerald-300 bg-emerald-500 text-white shadow-[0_0_0_4px_rgba(236,253,245,1)]',
    rowHover: 'hover:bg-rose-50/45',
    neutralBadge: 'border-slate-200 bg-white text-slate-600',
    recommendedBadge: 'border-fuchsia-200 bg-fuchsia-100 text-fuchsia-700',
    newBadge: 'border-sky-200 bg-sky-100 text-sky-700',
    actionReady:
      'border-rose-600 bg-gradient-to-r from-rose-600 via-red-500 to-red-600 text-white hover:brightness-105',
    actionDisabled: 'border-amber-300 bg-amber-100 text-amber-900',
    skeletonTint: 'from-rose-100/45 via-white to-rose-100/45',
  },
  listening: {
    heroPanel:
      'border-sky-100/85 bg-[linear-gradient(142deg,rgba(255,255,255,0.99),rgba(240,249,255,0.96))] shadow-[0_24px_56px_rgba(14,116,144,0.14)]',
    heroGlowPrimary: 'bg-sky-200/55',
    heroGlowSecondary: 'bg-cyan-200/45',
    accentTitle: 'arena-title-accent-blue',
    accentText: 'text-sky-700',
    chip: 'border-sky-200 bg-sky-50/80 text-sky-700',
    backButton:
      'border-sky-200 bg-white/90 text-sky-700 shadow-[0_8px_18px_rgba(14,116,144,0.14)] hover:border-sky-300 hover:bg-sky-50',
    metricCard: 'border-sky-100/85 bg-white/90 shadow-[0_12px_28px_rgba(14,116,144,0.11)]',
    metricLabel: 'text-sky-600',
    sidebarPanel: 'border-sky-100/85 bg-white/95 shadow-[0_18px_42px_rgba(14,116,144,0.1)]',
    sidebarSwitchWrap: 'border-sky-100 bg-sky-50/45',
    filterHeading: 'text-sky-600',
    filterActive:
      'border-sky-500 bg-gradient-to-r from-sky-600 via-blue-500 to-cyan-500 text-white shadow-[0_16px_30px_rgba(37,99,235,0.24)]',
    filterInactive: 'border-sky-100 text-slate-700 hover:border-sky-300 hover:bg-sky-50/45',
    filterIconInactive: 'border-sky-100 bg-sky-50 text-sky-700',
    roadmapPanel: 'border-sky-100/85 bg-white/95 shadow-[0_20px_46px_rgba(15,23,42,0.08)]',
    continueCard: 'border-sky-200/85 bg-gradient-to-r from-sky-50/85 via-white to-cyan-50/80',
    progressCard: 'border-sky-200/80 bg-gradient-to-br from-white to-sky-50/75',
    searchInput: 'border-sky-100 focus:border-sky-300 focus:ring-sky-100',
    searchIcon: 'text-sky-400',
    timelineRail: 'bg-gradient-to-b from-sky-200 via-sky-100 to-transparent',
    timelineNode: 'border-sky-300 bg-white text-sky-600 shadow-[0_0_0_4px_rgba(240,249,255,1)]',
    timelineNodeDone:
      'border-emerald-300 bg-emerald-500 text-white shadow-[0_0_0_4px_rgba(236,253,245,1)]',
    rowHover: 'hover:bg-sky-50/45',
    neutralBadge: 'border-slate-200 bg-white text-slate-600',
    recommendedBadge: 'border-violet-200 bg-violet-100 text-violet-700',
    newBadge: 'border-indigo-200 bg-indigo-100 text-indigo-700',
    actionReady:
      'border-sky-600 bg-gradient-to-r from-sky-600 via-blue-500 to-cyan-600 text-white hover:brightness-105',
    actionDisabled: 'border-amber-300 bg-amber-100 text-amber-900',
    skeletonTint: 'from-sky-100/45 via-white to-sky-100/45',
  },
}

function defaultTrackEngagement(): TrackEngagement {
  return {
    completedIds: [],
    lastVisitedTestId: null,
    streakDays: 0,
    lastActiveDate: null,
  }
}

function defaultEngagementStore(): EngagementStore {
  return {
    reading: defaultTrackEngagement(),
    listening: defaultTrackEngagement(),
  }
}

function normalizeTrackEngagement(input: Partial<TrackEngagement> | null | undefined): TrackEngagement {
  const completedIds = Array.isArray(input?.completedIds)
    ? input.completedIds.filter((id): id is string => typeof id === 'string')
    : []
  const streakDays = typeof input?.streakDays === 'number' && Number.isFinite(input.streakDays)
    ? Math.max(0, Math.round(input.streakDays))
    : 0

  return {
    completedIds,
    lastVisitedTestId: typeof input?.lastVisitedTestId === 'string' ? input.lastVisitedTestId : null,
    streakDays,
    lastActiveDate: typeof input?.lastActiveDate === 'string' ? input.lastActiveDate : null,
  }
}

function normalizeEngagementStore(input: unknown): EngagementStore {
  if (!input || typeof input !== 'object') {
    return defaultEngagementStore()
  }

  const record = input as Record<string, unknown>
  return {
    reading: normalizeTrackEngagement(record.reading as Partial<TrackEngagement> | undefined),
    listening: normalizeTrackEngagement(record.listening as Partial<TrackEngagement> | undefined),
  }
}

function resolveLevel(index: number): CatalogRow['level'] {
  if (index % 3 === 0) return 'EASY'
  if (index % 3 === 1) return 'MEDIUM'
  return 'HARD'
}

function levelTone(level: CatalogRow['level'], track: IeltsTrackType) {
  if (level === 'EASY') return 'text-emerald-700 bg-emerald-100 border-emerald-200'
  if (level === 'MEDIUM') return 'text-amber-700 bg-amber-100 border-amber-200'
  if (track === 'listening') return 'text-cyan-700 bg-cyan-100 border-cyan-200'
  return 'text-rose-700 bg-rose-100 border-rose-200'
}

function dayDistance(fromIso: string, toIso: string): number {
  const from = new Date(`${fromIso}T00:00:00`)
  const to = new Date(`${toIso}T00:00:00`)
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    return 99
  }
  return Math.round((to.getTime() - from.getTime()) / 86_400_000)
}

function resolveUnlockDays(row: CatalogRow): number {
  const numericValue = Number(row.title.replace(/\D+/g, '')) || 1
  if (row.badge === 'passage') return (numericValue % 6) + 1
  return (numericValue % 5) + 2
}

type DashboardMetricProps = {
  icon: LucideIcon
  label: string
  value: string | number
  helper: string
  allowHoverMotion: boolean
  minimalMotion: boolean
  className: string
  labelClassName: string
}

function DashboardMetric({
  icon: Icon,
  label,
  value,
  helper,
  allowHoverMotion,
  minimalMotion,
  className,
  labelClassName,
}: DashboardMetricProps) {
  return (
    <motion.article
      whileHover={allowHoverMotion ? { y: -2, scale: 1.02 } : undefined}
      whileTap={minimalMotion ? undefined : { scale: 0.995 }}
      transition={minimalMotion ? { duration: 0.12 } : { duration: 0.24, ease: CARD_EASE }}
      className={`relative overflow-hidden rounded-2xl border px-4 py-3 ${className}`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent" />
      <div className="relative flex items-start justify-between gap-2">
        <div>
          <p className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${labelClassName}`}>{label}</p>
          <p className="mt-1 text-[1.8rem] font-black leading-none text-slate-900">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{helper}</p>
        </div>
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/70 bg-white/85 text-slate-600">
          <Icon className="h-4 w-4" />
        </span>
      </div>
    </motion.article>
  )
}

function ProgressRing({ value, track }: { value: number; track: IeltsTrackType }) {
  const safeValue = Math.max(0, Math.min(100, value))
  const radius = 22
  const circumference = 2 * Math.PI * radius
  const strokeOffset = circumference - (safeValue / 100) * circumference
  const ringColor = track === 'reading' ? '#e11d48' : '#0284c7'

  return (
    <div className="relative h-14 w-14 shrink-0">
      <svg className="h-14 w-14 -rotate-90" viewBox="0 0 56 56" aria-hidden="true">
        <circle cx="28" cy="28" r={radius} stroke="#e2e8f0" strokeWidth="6" fill="none" />
        <circle
          cx="28"
          cy="28"
          r={radius}
          stroke={ringColor}
          strokeWidth="6"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeOffset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-slate-800">
        {safeValue}%
      </span>
    </div>
  )
}

function RoadmapSkeleton({ theme }: { theme: TrackTheme }) {
  return (
    <div className="space-y-2 p-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="rounded-2xl border border-slate-200/70 bg-white px-4 py-3">
          <div className={`h-4 w-28 rounded-full bg-gradient-to-r ${theme.skeletonTint} bg-[length:180%_100%] animate-[accentGradientShift_1.8s_ease-in-out_infinite]`} />
          <div className={`mt-2 h-3 w-48 rounded-full bg-gradient-to-r ${theme.skeletonTint} bg-[length:180%_100%] animate-[accentGradientShift_1.8s_ease-in-out_infinite]`} />
          <div className={`mt-3 h-3 w-36 rounded-full bg-gradient-to-r ${theme.skeletonTint} bg-[length:180%_100%] animate-[accentGradientShift_1.8s_ease-in-out_infinite]`} />
        </div>
      ))}
    </div>
  )
}

export default function IELTSSectionTests() {
  const navigate = useNavigate()
  const location = useLocation()
  const { allowHoverMotion, minimalMotion } = useMotionPreferences()
  const { section } = useParams<{ section: string }>()

  const isValidTrack = section === 'reading' || section === 'listening'
  const track = (isValidTrack ? section : 'reading') as IeltsTrackType
  const trackTitle = track === 'reading' ? 'Reading' : 'Listening'
  const theme = TRACK_THEMES[track]

  const navigationState = location.state as { entry?: string; from?: string } | null
  const fromMock = navigationState?.entry === 'mock-ielts'
  const mockFrom = navigationState?.from ?? 'tests'

  const [activeFilter, setActiveFilter] = useState<CatalogFilter>('all-tests')
  const [searchTerm, setSearchTerm] = useState('')
  const deferredSearchTerm = useDeferredValue(searchTerm)
  const [roadmapBooting, setRoadmapBooting] = useState(true)
  const [celebrationRowId, setCelebrationRowId] = useState<string | null>(null)

  const [engagementStore, setEngagementStore] = useState<EngagementStore>(() => {
    if (typeof window === 'undefined') {
      return defaultEngagementStore()
    }
    try {
      const cached = window.localStorage.getItem(TRACK_ENGAGEMENT_STORAGE_KEY)
      return normalizeEngagementStore(cached ? JSON.parse(cached) : null)
    } catch {
      return defaultEngagementStore()
    }
  })

  const trackEngagement = engagementStore[track] ?? defaultTrackEngagement()
  const completedSet = useMemo(() => new Set(trackEngagement.completedIds), [trackEngagement.completedIds])

  const passages = useMemo(() => getIeltsPassageCatalog(track), [track])
  const fullTests = useMemo(() => getIeltsFullTestCatalog(track), [track])

  const passageRows = useMemo<CatalogRow[]>(
    () =>
      passages.map((entry, index) => {
        const availableNow = isAvailableIeltsTrackTest(track, entry.testId)
        const questionCount =
          track === 'reading' && (entry.day - 1) % 3 === 2
            ? 14
            : 13
        return {
          id: entry.id,
          testId: entry.testId,
          title: entry.title,
          subtitle: `${trackTitle} single passage practice`,
          badge: 'passage',
          level: resolveLevel(index),
          durationMinutes: 20,
          questionCount,
          availableNow,
          comingSoon: !availableNow,
        }
      }),
    [passages, track, trackTitle],
  )

  const fullTestRows = useMemo<CatalogRow[]>(
    () =>
      fullTests.map((entry) => {
        const availableNow = isAvailableIeltsTrackTest(track, entry.testId)
        return {
          id: entry.id,
          testId: entry.testId,
          title: `${trackTitle} Full Test ${entry.index}`,
          subtitle:
            track === 'reading'
              ? '3 passages | 40 questions | Computer-delivered simulation'
              : '4 parts | 40 questions | CD-style listening simulation',
          badge: 'full-test',
          level: 'HARD' as const,
          durationMinutes: track === 'reading' ? 60 : 30,
          questionCount: 40,
          availableNow,
          comingSoon: !availableNow,
        }
      }),
    [fullTests, track, trackTitle],
  )

  const allRows = useMemo<CatalogRow[]>(() => [...passageRows, ...fullTestRows], [fullTestRows, passageRows])

  const filteredRows = useMemo(() => {
    if (activeFilter === 'passages') return passageRows
    if (activeFilter === 'full-tests') return fullTestRows
    return allRows
  }, [activeFilter, allRows, fullTestRows, passageRows])

  const visibleRows = useMemo(() => {
    const normalizedQuery = deferredSearchTerm.trim().toLowerCase()
    if (!normalizedQuery) return filteredRows
    return filteredRows.filter((row) => `${row.title} ${row.subtitle}`.toLowerCase().includes(normalizedQuery))
  }, [deferredSearchTerm, filteredRows])

  const counts = useMemo(
    () => ({
      all: allRows.length,
      passages: passageRows.length,
      fullTests: fullTestRows.length,
      available: allRows.filter((row) => row.availableNow).length,
      comingSoon: allRows.filter((row) => row.comingSoon).length,
    }),
    [allRows, fullTestRows.length, passageRows.length],
  )

  const completedLiveCount = useMemo(
    () => allRows.filter((row) => row.availableNow && completedSet.has(row.id)).length,
    [allRows, completedSet],
  )
  const completionRate = counts.available === 0 ? 0 : Math.round((completedLiveCount / counts.available) * 100)
  const isSearchPending = searchTerm !== deferredSearchTerm
  const nextMilestone = MILESTONES.find((value) => completedLiveCount < value) ?? null
  const remainingToMilestone = nextMilestone ? nextMilestone - completedLiveCount : 0
  const earliestUnlock = allRows
    .filter((row) => row.comingSoon)
    .reduce((min, row) => Math.min(min, resolveUnlockDays(row)), Number.POSITIVE_INFINITY)
  const nextUnlockIn = Number.isFinite(earliestUnlock) ? earliestUnlock : null

  const recommendedRowId = useMemo(() => {
    const liveUnfinished = allRows.find((row) => row.availableNow && !completedSet.has(row.id))
    if (liveUnfinished) return liveUnfinished.id
    return allRows.find((row) => row.availableNow)?.id ?? null
  }, [allRows, completedSet])

  const continueRow = useMemo(() => {
    if (!trackEngagement.lastVisitedTestId) return null
    return allRows.find((row) => row.id === trackEngagement.lastVisitedTestId) ?? null
  }, [allRows, trackEngagement.lastVisitedTestId])

  const dailyCompleted = Math.min(DAILY_GOAL, completedLiveCount)

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(TRACK_ENGAGEMENT_STORAGE_KEY, JSON.stringify(engagementStore))
  }, [engagementStore])

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10)
    setEngagementStore((previous) => {
      const currentTrackData = previous[track] ?? defaultTrackEngagement()
      if (currentTrackData.lastActiveDate === today) {
        return previous
      }

      const distance = currentTrackData.lastActiveDate ? dayDistance(currentTrackData.lastActiveDate, today) : 0
      const nextStreak = distance === 1 ? currentTrackData.streakDays + 1 : 1

      return {
        ...previous,
        [track]: {
          ...currentTrackData,
          streakDays: nextStreak,
          lastActiveDate: today,
        },
      }
    })
  }, [track])

  useEffect(() => {
    setRoadmapBooting(true)
    const timeout = window.setTimeout(() => setRoadmapBooting(false), minimalMotion ? 80 : 240)
    return () => window.clearTimeout(timeout)
  }, [activeFilter, minimalMotion, track])

  useEffect(() => {
    if (!celebrationRowId) return
    const timeout = window.setTimeout(() => setCelebrationRowId(null), 1100)
    return () => window.clearTimeout(timeout)
  }, [celebrationRowId])

  if (!isValidTrack) {
    return <Navigate to="/ielts" replace />
  }

  const filterCards: {
    id: CatalogFilter
    title: string
    description: string
    count: number
    icon: LucideIcon
  }[] = [
    {
      id: 'all-tests',
      title: 'All tests',
      description: 'Complete roadmap overview',
      count: counts.all,
      icon: Layers3,
    },
    {
      id: 'passages',
      title: 'Passages',
      description: 'Daily precision practice',
      count: counts.passages,
      icon: BookOpenText,
    },
    {
      id: 'full-tests',
      title: 'Full tests',
      description: 'Exam simulation mode',
      count: counts.fullTests,
      icon: Headphones,
    },
  ]

  const updateTrackEngagement = (updater: (current: TrackEngagement) => TrackEngagement) => {
    setEngagementStore((previous) => {
      const currentTrackData = previous[track] ?? defaultTrackEngagement()
      return {
        ...previous,
        [track]: updater(currentTrackData),
      }
    })
  }

  const handleRowLaunch = (row: CatalogRow) => {
    updateTrackEngagement((current) => ({
      ...current,
      lastVisitedTestId: row.id,
    }))
    navigate(`/test/${track}/${row.testId}`, {
      state: fromMock ? { entry: 'mock-ielts', from: mockFrom } : { entry: 'ielts-catalog' },
    })
  }

  const handleToggleComplete = (row: CatalogRow) => {
    const currentlyCompleted = completedSet.has(row.id)
    updateTrackEngagement((current) => {
      const completedIds = currentlyCompleted
        ? current.completedIds.filter((id) => id !== row.id)
        : [...current.completedIds, row.id]

      return {
        ...current,
        completedIds,
        lastVisitedTestId: row.id,
      }
    })

    if (!currentlyCompleted) {
      setCelebrationRowId(row.id)
    } else if (celebrationRowId === row.id) {
      setCelebrationRowId(null)
    }
  }

  return (
    <motion.div
      initial={minimalMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={minimalMotion ? { duration: 0.14 } : { duration: 0.34, ease: CARD_EASE }}
      className="w-full px-4 py-6 sm:px-6 lg:px-8"
    >
      <section className={`relative overflow-hidden rounded-[1.9rem] border p-5 sm:p-6 ${theme.heroPanel}`}>
        <div className="pointer-events-none absolute inset-0">
          <div className={`absolute -left-16 -top-16 h-44 w-44 rounded-full blur-3xl ${theme.heroGlowPrimary}`} />
          <div className={`absolute -bottom-20 -right-16 h-48 w-48 rounded-full blur-3xl ${theme.heroGlowSecondary}`} />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/95 to-transparent" />
        </div>

        <div className="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (fromMock) {
                    navigate('/mock/ielts', { state: { from: mockFrom } })
                    return
                  }
                  navigate('/ielts')
                }}
                className={`inline-flex min-h-[38px] items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition ${theme.backButton}`}
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </button>
              <span className={`inline-flex min-h-[38px] items-center rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${theme.chip}`}>
                IELTS {trackTitle} Section
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight text-[#0F172A] sm:text-4xl">
              IELTS <span className={theme.accentTitle}>{trackTitle} Studio</span>
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
              Premium focus mode for daily passages and full test simulation roadmap.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 xl:w-[34rem] xl:grid-cols-4">
            <DashboardMetric
              icon={Layers3}
              label="Tests"
              value={counts.all}
              helper="Total catalog"
              allowHoverMotion={allowHoverMotion}
              minimalMotion={minimalMotion}
              className={theme.metricCard}
              labelClassName={theme.metricLabel}
            />
            <DashboardMetric
              icon={PlayCircle}
              label="Live now"
              value={counts.available}
              helper="Ready to launch"
              allowHoverMotion={allowHoverMotion}
              minimalMotion={minimalMotion}
              className={theme.metricCard}
              labelClassName={theme.metricLabel}
            />
            <DashboardMetric
              icon={CheckCircle2}
              label="Completed"
              value={completedLiveCount}
              helper="Marked done"
              allowHoverMotion={allowHoverMotion}
              minimalMotion={minimalMotion}
              className={theme.metricCard}
              labelClassName={theme.metricLabel}
            />
            <DashboardMetric
              icon={Flame}
              label="Streak"
              value={Math.max(trackEngagement.streakDays, 1)}
              helper="Daily momentum"
              allowHoverMotion={allowHoverMotion}
              minimalMotion={minimalMotion}
              className={theme.metricCard}
              labelClassName={theme.metricLabel}
            />
          </div>
        </div>
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className={`h-fit rounded-3xl border p-4 lg:sticky lg:top-5 ${theme.sidebarPanel}`}>
          <div className={`mb-4 grid grid-cols-2 gap-2 rounded-2xl border p-1.5 ${theme.sidebarSwitchWrap}`}>
            <button
              type="button"
              onClick={() =>
                navigate('/ielts/reading/tests', {
                  state: fromMock ? { entry: 'mock-ielts', from: mockFrom } : { entry: 'ielts-catalog' },
                })
              }
              className={`rounded-xl px-3 py-2 text-sm font-bold transition ${
                track === 'reading'
                  ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-[0_10px_20px_rgba(225,29,72,0.25)]'
                  : 'bg-white text-slate-700 hover:bg-rose-50'
              }`}
            >
              Reading
            </button>
            <button
              type="button"
              onClick={() =>
                navigate('/ielts/listening/tests', {
                  state: fromMock ? { entry: 'mock-ielts', from: mockFrom } : { entry: 'ielts-catalog' },
                })
              }
              className={`rounded-xl px-3 py-2 text-sm font-bold transition ${
                track === 'listening'
                  ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-[0_10px_20px_rgba(14,116,144,0.25)]'
                  : 'bg-white text-slate-700 hover:bg-sky-50'
              }`}
            >
              Listening
            </button>
          </div>

          <p className={`text-xs font-black uppercase tracking-[0.16em] ${theme.filterHeading}`}>Filter tests</p>
          <div className="mt-3 space-y-2">
            {filterCards.map((item) => {
              const isActive = activeFilter === item.id
              const Icon = item.icon
              return (
                <motion.button
                  key={item.id}
                  type="button"
                  whileHover={allowHoverMotion ? { scale: 1.02, y: -1 } : undefined}
                  whileTap={minimalMotion ? undefined : { scale: 0.99 }}
                  transition={minimalMotion ? { duration: 0.1 } : { duration: 0.22, ease: CARD_EASE }}
                  onClick={() => setActiveFilter(item.id)}
                  className={`w-full rounded-2xl border px-3 py-3 text-left ${isActive ? theme.filterActive : theme.filterInactive}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-xl border ${
                          isActive ? 'border-white/40 bg-white/20 text-white' : theme.filterIconInactive
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-base font-bold leading-tight">{item.title}</p>
                        <p className={`text-xs ${isActive ? 'text-white/90' : 'text-slate-500'}`}>{item.description}</p>
                      </div>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-sm font-black ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      {item.count}
                    </span>
                  </div>
                </motion.button>
              )
            })}
          </div>

          <div className={`mt-4 rounded-2xl border p-3 ${theme.progressCard}`}>
            <div className="flex items-center justify-between">
              <p className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${theme.accentText}`}>Daily progress</p>
              <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700">
                {dailyCompleted}/{DAILY_GOAL}
              </span>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <ProgressRing value={completionRate} track={track} />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800">{completionRate}% live completion</p>
                <p className="text-xs text-slate-500">
                  {nextMilestone
                    ? `${remainingToMilestone} more to milestone ${nextMilestone}`
                    : 'All current milestones completed'}
                </p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <span className="inline-flex items-center gap-1 rounded-xl border border-orange-200 bg-orange-50 px-2.5 py-1.5 font-semibold text-orange-700">
                <Flame className="h-3.5 w-3.5" />
                {Math.max(trackEngagement.streakDays, 1)} day streak
              </span>
              <span className="inline-flex items-center gap-1 rounded-xl border border-violet-200 bg-violet-50 px-2.5 py-1.5 font-semibold text-violet-700">
                <Target className="h-3.5 w-3.5" />
                Focus mode
              </span>
            </div>
          </div>
        </aside>

        <div className={`rounded-3xl border p-4 ${theme.roadmapPanel}`}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Test Roadmap</h2>
              <p className="text-sm text-slate-500">
                {activeFilter === 'passages'
                  ? 'Single-passage lineup'
                  : activeFilter === 'full-tests'
                    ? 'Full simulation lineup'
                    : 'Complete lineup'}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
              <span className="rounded-full border border-emerald-200 bg-emerald-100 px-2.5 py-1 text-emerald-700">
                Live: {counts.available}
              </span>
              <span className="rounded-full border border-sky-200 bg-sky-100 px-2.5 py-1 text-sky-700">
                Done: {completedLiveCount}
              </span>
              <span className="rounded-full border border-amber-200 bg-amber-100 px-2.5 py-1 text-amber-700">
                Next unlock: {nextUnlockIn ? `${nextUnlockIn}d` : '--'}
              </span>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <motion.button
              type="button"
              whileHover={allowHoverMotion ? { y: -2, scale: 1.015 } : undefined}
              whileTap={minimalMotion ? undefined : { scale: 0.995 }}
              transition={minimalMotion ? { duration: 0.1 } : { duration: 0.22, ease: CARD_EASE }}
              onClick={() => {
                const targetRow = continueRow ?? allRows.find((row) => row.id === recommendedRowId) ?? null
                if (!targetRow) return
                handleRowLaunch(targetRow)
              }}
              className={`group rounded-2xl border px-4 py-3 text-left ${theme.continueCard}`}
            >
              <p className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${theme.accentText}`}>Continue where you left off</p>
              <p className="mt-1 text-sm font-bold text-slate-900">
                {continueRow ? continueRow.title : 'Start next recommended test'}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {continueRow ? continueRow.subtitle : 'One tap to jump back into your momentum.'}
              </p>
              <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-slate-700">
                Continue
                <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </motion.button>

            <div className={`rounded-2xl border px-4 py-3 ${theme.progressCard}`}>
              <p className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${theme.accentText}`}>Reward loop</p>
              <p className="mt-1 text-sm font-bold text-slate-900">
                {nextMilestone ? `Reach milestone ${nextMilestone}` : 'Milestone complete'}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {nextMilestone
                  ? `Complete ${remainingToMilestone} more live ${nextMilestone === 1 ? 'test' : 'tests'} for your next streak badge.`
                  : 'All currently available live tests are completed. Great consistency.'}
              </p>
              <span className="mt-2 inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700">
                <Trophy className="h-3.5 w-3.5" />
                Reward ready
              </span>
            </div>
          </div>

          <label className="relative mt-4 block">
            <Search className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${theme.searchIcon}`} />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search day or test number..."
              className={`h-11 w-full rounded-xl border bg-white pl-9 pr-3 text-sm text-slate-800 outline-none focus:ring-2 ${theme.searchInput}`}
            />
            <AnimatePresence>
              {isSearchPending ? (
                <motion.span
                  initial={{ opacity: 0, y: -3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-slate-500"
                >
                  Filtering...
                </motion.span>
              ) : null}
            </AnimatePresence>
          </label>

          <div className="mt-3 max-h-[68vh] divide-y divide-slate-200/80 overflow-y-auto rounded-2xl border border-slate-200/80 bg-white">
            {roadmapBooting ? (
              <RoadmapSkeleton theme={theme} />
            ) : visibleRows.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <p className="text-sm font-semibold text-slate-700">No tests found</p>
                <p className="mt-1 text-xs text-slate-500">Try a different keyword or filter.</p>
              </div>
            ) : (
              <AnimatePresence initial={false} mode="popLayout">
                {visibleRows.map((row) => {
                  const isCompleted = completedSet.has(row.id)
                  const isRecommended = row.id === recommendedRowId
                  const isNew = row.availableNow && row.badge === 'full-test' && row.title.endsWith('1')
                  const unlockDays = resolveUnlockDays(row)
                  const actionDisabled = row.comingSoon
                  const actionLabel = row.comingSoon ? `Unlock in ${unlockDays}d` : isCompleted ? 'Review test' : 'Start test'

                  return (
                    <motion.article
                      key={row.id}
                      layout
                      initial={minimalMotion ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={minimalMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                      whileHover={allowHoverMotion ? { scale: 1.01 } : undefined}
                      whileTap={minimalMotion ? undefined : { scale: 0.998 }}
                      transition={minimalMotion ? { duration: 0.12 } : { duration: 0.24, ease: CARD_EASE }}
                      className={`relative px-3 py-3 sm:px-4 ${theme.rowHover} ${isCompleted ? 'bg-emerald-50/30' : ''}`}
                    >
                      <div className="absolute left-3 top-0 bottom-0 w-px">
                        <span className={`block h-full w-px ${theme.timelineRail}`} />
                      </div>
                      <span
                        className={`absolute left-[6px] top-5 inline-flex h-5 w-5 items-center justify-center rounded-full border ${
                          isCompleted ? theme.timelineNodeDone : theme.timelineNode
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="h-3.5 w-3.5" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                      </span>

                      <div className="flex flex-wrap items-center justify-between gap-3 pl-8">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="truncate text-base font-bold text-slate-900">{row.title}</h3>
                            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${theme.neutralBadge}`}>
                              {row.badge === 'passage' ? 'Passage' : 'Full test'}
                            </span>
                            {row.availableNow ? (
                              <span className="rounded-full border border-emerald-200 bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-emerald-700">
                                Live
                              </span>
                            ) : null}
                            {isRecommended ? (
                              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${theme.recommendedBadge}`}>
                                Recommended
                              </span>
                            ) : null}
                            {isNew ? (
                              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${theme.newBadge}`}>
                                New
                              </span>
                            ) : null}
                            {isCompleted ? (
                              <span className="rounded-full border border-emerald-200 bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-emerald-700">
                                Completed
                              </span>
                            ) : null}
                          </div>

                          <div className="mt-1 flex items-center gap-1">
                            <p className="text-sm text-slate-500">{row.subtitle}</p>
                            <AnimatePresence>
                              {celebrationRowId === row.id ? (
                                <motion.span
                                  initial={{ opacity: 0, scale: 0.8, y: 6 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.8, y: -4 }}
                                  className="inline-flex items-center gap-1 rounded-full border border-fuchsia-200 bg-fuchsia-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-fuchsia-700"
                                >
                                  <Sparkles className="h-3 w-3" />
                                  Nice
                                </motion.span>
                              ) : null}
                            </AnimatePresence>
                          </div>

                          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                            <span className={`rounded-full border px-2 py-0.5 font-semibold ${levelTone(row.level, track)}`}>
                              {row.level}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Clock3 className="h-3.5 w-3.5" />
                              {row.durationMinutes} min
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <BookOpenText className="h-3.5 w-3.5" />
                              {row.questionCount} questions
                            </span>
                            {row.comingSoon ? (
                              <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-100 px-2 py-0.5 font-semibold text-amber-800">
                                <CalendarClock className="h-3.5 w-3.5" />
                                Unlock in {unlockDays}d
                              </span>
                            ) : null}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {row.availableNow ? (
                            <motion.button
                              type="button"
                              whileTap={minimalMotion ? undefined : { scale: 0.94 }}
                              onClick={(event) => {
                                event.stopPropagation()
                                handleToggleComplete(row)
                              }}
                              className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border transition ${
                                isCompleted
                                  ? 'border-emerald-300 bg-emerald-100 text-emerald-700'
                                  : 'border-slate-200 bg-white text-slate-500 hover:border-emerald-300 hover:text-emerald-700'
                              }`}
                              aria-label={isCompleted ? 'Mark as not completed' : 'Mark as completed'}
                            >
                              <motion.span
                                animate={isCompleted ? { scale: [1, 1.18, 1] } : { scale: 1 }}
                                transition={{ duration: 0.24 }}
                              >
                                {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                              </motion.span>
                            </motion.button>
                          ) : (
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-amber-300 bg-amber-100 text-amber-700">
                              <Lock className="h-4 w-4" />
                            </span>
                          )}

                          <motion.button
                            type="button"
                            whileTap={minimalMotion ? undefined : { scale: 0.98 }}
                            disabled={actionDisabled}
                            onClick={() => handleRowLaunch(row)}
                            className={`inline-flex min-w-[9.5rem] items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold transition ${
                              actionDisabled ? theme.actionDisabled : theme.actionReady
                            } ${actionDisabled ? 'cursor-not-allowed' : ''}`}
                          >
                            {row.availableNow ? <PlayCircle className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                            {actionLabel}
                          </motion.button>
                        </div>
                      </div>
                    </motion.article>
                  )
                })}
              </AnimatePresence>
            )}
          </div>
        </div>
      </section>
    </motion.div>
  )
}
