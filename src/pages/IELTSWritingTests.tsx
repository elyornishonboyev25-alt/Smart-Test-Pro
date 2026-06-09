import { useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  BookOpenText,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileEdit,
  Flame,
  Layers3,
  Lock,
  PenLine,
  PlayCircle,
  Search,
  Sparkles,
  Target,
  Trophy,
} from 'lucide-react'

import {
  getWritingDayCatalog,
  getWritingFullTestCatalog,
  type WritingTask,
  type WritingFullTest,
} from '@/data/writingTestData'
import { useMotionPreferences } from '@/hooks/useMotionPreferences'

type CatalogFilter = 'all' | 'daily' | 'full-tests'

type CatalogRow = {
  id: string
  title: string
  subtitle: string
  badge: 'task1' | 'task2' | 'full-test'
  durationMinutes: number
  available: boolean
  isDay: boolean
}

const CARD_EASE = [0.22, 1, 0.36, 1] as const

export default function IELTSWritingTests() {
  const navigate = useNavigate()
  const location = useLocation()
  const { allowHoverMotion, minimalMotion } = useMotionPreferences()
  const navigationState = location.state as { entry?: string; from?: string } | null
  const fromMock = navigationState?.entry === 'mock-ielts'

  const [activeFilter, setActiveFilter] = useState<CatalogFilter>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const dayCatalog = useMemo(() => getWritingDayCatalog(), [])
  const fullTestCatalog = useMemo(() => getWritingFullTestCatalog(), [])

  const dayRows = useMemo<CatalogRow[]>(
    () =>
      dayCatalog.map((task) => ({
        id: task.id,
        title: task.title,
        subtitle: task.subtitle,
        badge: task.taskType,
        durationMinutes: task.durationMinutes,
        available: task.available,
        isDay: true,
      })),
    [dayCatalog],
  )

  const fullTestRows = useMemo<CatalogRow[]>(
    () =>
      fullTestCatalog.map((test) => ({
        id: test.id,
        title: test.title,
        subtitle: 'Task 1 + Task 2 · 60 minutes · Full exam simulation',
        badge: 'full-test' as const,
        durationMinutes: 60,
        available: test.available,
        isDay: false,
      })),
    [fullTestCatalog],
  )

  const allRows = useMemo(() => [...dayRows, ...fullTestRows], [dayRows, fullTestRows])

  const filteredRows = useMemo(() => {
    if (activeFilter === 'daily') return dayRows
    if (activeFilter === 'full-tests') return fullTestRows
    return allRows
  }, [activeFilter, allRows, dayRows, fullTestRows])

  const visibleRows = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return filteredRows
    return filteredRows.filter(
      (row) => `${row.title} ${row.subtitle}`.toLowerCase().includes(query),
    )
  }, [filteredRows, searchTerm])

  const counts = useMemo(
    () => ({
      all: allRows.length,
      daily: dayRows.length,
      fullTests: fullTestRows.length,
      available: allRows.filter((r) => r.available).length,
    }),
    [allRows, dayRows, fullTestRows],
  )

  const handleLaunch = (row: CatalogRow) => {
    if (!row.available) return
    navigate(`/ielts/writing/test/${row.id}`)
  }

  const filterCards: {
    id: CatalogFilter
    title: string
    desc: string
    count: number
    icon: typeof Layers3
  }[] = [
    { id: 'all', title: 'All tests', desc: 'Complete overview', count: counts.all, icon: Layers3 },
    {
      id: 'daily',
      title: 'Day 1–30',
      desc: 'Daily writing practice',
      count: counts.daily,
      icon: CalendarDays,
    },
    {
      id: 'full-tests',
      title: 'Full mocks',
      desc: 'Exam simulation',
      count: counts.fullTests,
      icon: FileEdit,
    },
  ]

  return (
    <motion.div
      initial={minimalMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={minimalMotion ? { duration: 0.14 } : { duration: 0.34, ease: CARD_EASE }}
      className="w-full px-4 py-6 sm:px-6 lg:px-8"
    >
      <section className="relative overflow-hidden rounded-[1.9rem] border border-rose-100/85 bg-[linear-gradient(142deg,rgba(255,255,255,0.99),rgba(255,244,247,0.95))] p-5 shadow-[0_24px_56px_rgba(190,24,93,0.14)] sm:p-6">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-16 -top-16 h-44 w-44 rounded-full bg-rose-200/55 blur-3xl" />
          <div className="absolute -bottom-20 -right-16 h-48 w-48 rounded-full bg-orange-200/45 blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/95 to-transparent" />
        </div>

        <div className="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => navigate(fromMock ? '/mock/ielts' : '/ielts')}
                className="inline-flex min-h-[38px] items-center gap-2 rounded-full border border-rose-200 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-rose-700 shadow-[0_8px_18px_rgba(190,24,93,0.14)] transition hover:border-rose-300 hover:bg-rose-50"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </button>
              <span className="inline-flex min-h-[38px] items-center rounded-full border border-rose-200 bg-rose-50/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-rose-700">
                IELTS Writing Section
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight text-[#0F172A] sm:text-4xl">
              IELTS <span className="arena-title-accent-red">Writing Studio</span>
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
              Daily writing practice with Task 1 visual reports and Task 2 essays. Full mock
              simulations included.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 xl:w-[28rem] xl:grid-cols-4">
            {[
              { label: 'Tests', value: counts.all, helper: 'Total catalog' },
              { label: 'Live now', value: counts.available, helper: 'Ready to launch' },
              { label: 'Daily', value: counts.daily, helper: 'Day practice' },
              { label: 'Full Mock', value: counts.fullTests, helper: 'Exam sim' },
            ].map((m) => (
              <motion.article
                key={m.label}
                whileHover={allowHoverMotion ? { y: -2, scale: 1.02 } : undefined}
                transition={minimalMotion ? { duration: 0.12 } : { duration: 0.24, ease: CARD_EASE }}
                className="relative overflow-hidden rounded-2xl border border-rose-100/85 bg-white/90 px-4 py-3 shadow-[0_12px_28px_rgba(190,24,93,0.11)]"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-600">
                  {m.label}
                </p>
                <p className="mt-1 text-[1.8rem] font-black leading-none text-slate-900">
                  {m.value}
                </p>
                <p className="mt-1 text-xs text-slate-500">{m.helper}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="h-fit rounded-3xl border border-rose-100/85 bg-white/95 p-4 shadow-[0_18px_42px_rgba(190,24,93,0.1)] lg:sticky lg:top-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-rose-600">
            Filter tests
          </p>
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
                  transition={
                    minimalMotion ? { duration: 0.1 } : { duration: 0.22, ease: CARD_EASE }
                  }
                  onClick={() => setActiveFilter(item.id)}
                  className={`w-full rounded-2xl border px-3 py-3 text-left ${
                    isActive
                      ? 'border-rose-500 bg-gradient-to-r from-rose-600 via-red-500 to-orange-500 text-white shadow-[0_16px_30px_rgba(190,24,93,0.24)]'
                      : 'border-rose-100 text-slate-700 hover:border-rose-300 hover:bg-rose-50/45'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-xl border ${
                          isActive
                            ? 'border-white/40 bg-white/20 text-white'
                            : 'border-rose-100 bg-rose-50 text-rose-700'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-base font-bold leading-tight">{item.title}</p>
                        <p className={`text-xs ${isActive ? 'text-white/90' : 'text-slate-500'}`}>
                          {item.desc}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-black ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.count}
                    </span>
                  </div>
                </motion.button>
              )
            })}
          </div>

          <div className="mt-4 rounded-2xl border border-rose-200/80 bg-gradient-to-br from-white to-rose-50/75 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-700">
              Day Pattern
            </p>
            <div className="mt-2 space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-rose-200 bg-rose-100 text-[10px] font-black text-rose-700">
                  1
                </span>
                <span>Task 1 — Visual Report</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-violet-200 bg-violet-100 text-[10px] font-black text-violet-700">
                  2
                </span>
                <span>Task 2 — Essay</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-violet-200 bg-violet-100 text-[10px] font-black text-violet-700">
                  3
                </span>
                <span>Task 2 — Essay</span>
              </div>
              <p className="mt-1 text-[10px] italic text-slate-500">
                This cycle repeats through Day 30
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-rose-200/80 bg-gradient-to-br from-white to-rose-50/75 p-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-rose-600" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-700">
                Writing Tips
              </p>
            </div>
            <ul className="mt-2 space-y-1 text-xs text-slate-600">
              <li className="flex items-start gap-1.5">
                <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-rose-500" />
                Task 1: 150+ words, 20 minutes
              </li>
              <li className="flex items-start gap-1.5">
                <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-rose-500" />
                Task 2: 250+ words, 40 minutes
              </li>
              <li className="flex items-start gap-1.5">
                <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-rose-500" />
                Task 2 is worth 2x Task 1 score
              </li>
            </ul>
          </div>
        </aside>

        <div className="rounded-3xl border border-rose-100/85 bg-white/95 p-4 shadow-[0_20px_46px_rgba(15,23,42,0.08)]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Writing Roadmap</h2>
              <p className="text-sm text-slate-500">
                {activeFilter === 'daily'
                  ? 'Daily practice lineup'
                  : activeFilter === 'full-tests'
                    ? 'Full mock test lineup'
                    : 'Complete writing lineup'}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
              <span className="rounded-full border border-emerald-200 bg-emerald-100 px-2.5 py-1 text-emerald-700">
                Live: {counts.available}
              </span>
              <span className="rounded-full border border-amber-200 bg-amber-100 px-2.5 py-1 text-amber-700">
                Coming: {counts.all - counts.available}
              </span>
            </div>
          </div>

          <label className="relative mt-4 block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-rose-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search day or test number..."
              className="h-11 w-full rounded-xl border border-rose-100 bg-white pl-9 pr-3 text-sm text-slate-800 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
            />
          </label>

          <div className="mt-3 max-h-[68vh] divide-y divide-slate-200/70 overflow-y-auto rounded-2xl border border-slate-200/80 bg-white">
            {visibleRows.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <p className="text-sm font-semibold text-slate-700">No tests found</p>
                <p className="mt-1 text-xs text-slate-500">Try a different keyword or filter.</p>
              </div>
            ) : (
              <AnimatePresence initial={false} mode="popLayout">
                {visibleRows.map((row) => {
                  const badgeLabel =
                    row.badge === 'task1'
                      ? 'Task 1'
                      : row.badge === 'task2'
                        ? 'Task 2'
                        : 'Full Test'
                  const badgeColor =
                    row.badge === 'task1'
                      ? 'border-rose-200 bg-rose-100 text-rose-700'
                      : row.badge === 'task2'
                        ? 'border-violet-200 bg-violet-100 text-violet-700'
                        : 'border-sky-200 bg-sky-100 text-sky-700'

                  return (
                    <motion.article
                      key={row.id}
                      layout
                      initial={minimalMotion ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={minimalMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                      whileHover={allowHoverMotion ? { scale: 1.01 } : undefined}
                      transition={
                        minimalMotion ? { duration: 0.12 } : { duration: 0.24, ease: CARD_EASE }
                      }
                      className="relative px-3 py-2 hover:bg-rose-50/45 sm:px-4"
                    >
                      <div className="absolute bottom-0 left-3 top-0 w-px">
                        <span className="block h-full w-px bg-gradient-to-b from-rose-200 via-rose-100 to-transparent" />
                      </div>
                      <span
                        className={`absolute left-[6px] top-4 inline-flex h-5 w-5 items-center justify-center rounded-full border ${
                          row.available
                            ? 'border-rose-300 bg-white text-rose-600 shadow-[0_0_0_4px_rgba(255,241,242,1)]'
                            : 'border-slate-300 bg-slate-100 text-slate-400'
                        }`}
                      >
                        {row.available ? (
                          <PenLine className="h-2.5 w-2.5" />
                        ) : (
                          <Lock className="h-2.5 w-2.5" />
                        )}
                      </span>

                      <div className="flex flex-wrap items-center justify-between gap-2 pl-8">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="truncate text-base font-bold text-slate-900">
                              {row.title}
                            </h3>
                            <span
                              className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${badgeColor}`}
                            >
                              {badgeLabel}
                            </span>
                            {row.available && (
                              <span className="rounded-full border border-emerald-200 bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-emerald-700">
                                Live
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-sm text-slate-500">{row.subtitle}</p>
                          <div className="mt-1.5 flex flex-wrap items-center gap-2.5 text-xs text-slate-600">
                            <span className="inline-flex items-center gap-1">
                              <Clock3 className="h-3.5 w-3.5" />
                              {row.durationMinutes} min
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <BookOpenText className="h-3.5 w-3.5" />
                              {row.badge === 'task1'
                                ? '150+ words'
                                : row.badge === 'task2'
                                  ? '250+ words'
                                  : '400+ words'}
                            </span>
                          </div>
                        </div>

                        <motion.button
                          type="button"
                          whileTap={minimalMotion ? undefined : { scale: 0.98 }}
                          disabled={!row.available}
                          onClick={() => handleLaunch(row)}
                          className={`inline-flex min-w-[9.5rem] items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold transition ${
                            row.available
                              ? 'border-rose-600 bg-gradient-to-r from-rose-600 via-red-500 to-red-600 text-white hover:brightness-105'
                              : 'cursor-not-allowed border-amber-300 bg-amber-100 text-amber-900'
                          }`}
                        >
                          {row.available ? (
                            <>
                              <PlayCircle className="h-4 w-4" />
                              Start writing
                            </>
                          ) : (
                            <>
                              <Lock className="h-4 w-4" />
                              Coming soon
                            </>
                          )}
                        </motion.button>
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
