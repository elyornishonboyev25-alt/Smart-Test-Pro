import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  ArrowLeft,
  Clock3,
  Crown,
  Layers3,
  Mic2,
  PlayCircle,
  Search,
  Sparkles,
  Trophy,
} from 'lucide-react'
import {
  getIeltsSpeakingDayCatalog,
  getIeltsSpeakingFullMockCatalog,
} from '@/utils/ieltsSpeakingCatalog'
import { useMotionPreferences } from '@/hooks/useMotionPreferences'
import { useFeatureTrial } from '@/hooks/useFeatureTrial'

type Filter = 'all' | 'days' | 'full-mocks'

type Row = {
  id: string
  testId: string
  title: string
  subtitle: string
  badge: 'day' | 'full'
  badgeLabel: string
  durationMinutes: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  available: boolean
}

const CARD_EASE = [0.22, 1, 0.36, 1] as const

function levelTone(level: Row['difficulty']) {
  if (level === 'Easy') return 'text-emerald-700 bg-emerald-100 border-emerald-200'
  if (level === 'Medium') return 'text-amber-700 bg-amber-100 border-amber-200'
  return 'text-rose-700 bg-rose-100 border-rose-200'
}

function partTone(part: 'day' | 'full', badgeLabel: string) {
  if (part === 'full') return 'border-violet-200 bg-violet-50 text-violet-700'
  if (badgeLabel.includes('Part 1')) return 'border-rose-200 bg-rose-50 text-rose-700'
  if (badgeLabel.includes('Part 2')) return 'border-amber-200 bg-amber-50 text-amber-700'
  return 'border-sky-200 bg-sky-50 text-sky-700'
}

export default function IELTSSpeakingTests() {
  const navigate = useNavigate()
  const location = useLocation()
  const { allowHoverMotion, minimalMotion } = useMotionPreferences()
  const navigationState = location.state as { entry?: string; from?: string } | null
  const fromMock = navigationState?.entry === 'mock-ielts'

  const [activeFilter, setActiveFilter] = useState<Filter>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const speakingTrial = useFeatureTrial('speakingDaily')
  const [showTrialGate, setShowTrialGate] = useState(false)

  const days = useMemo(() => getIeltsSpeakingDayCatalog(), [])
  const mocks = useMemo(() => getIeltsSpeakingFullMockCatalog(), [])

  const dayRows = useMemo<Row[]>(
    () =>
      days.map((d) => ({
        id: d.id,
        testId: d.id,
        title: d.title,
        subtitle: d.subtitle,
        badge: 'day' as const,
        badgeLabel: `Part ${d.part}`,
        durationMinutes: d.durationMinutes,
        difficulty: d.difficulty,
        available: d.available,
      })),
    [days],
  )

  const mockRows = useMemo<Row[]>(
    () =>
      mocks.map((m) => ({
        id: m.id,
        testId: m.id,
        title: m.title,
        subtitle: m.subtitle,
        badge: 'full' as const,
        badgeLabel: 'Full mock',
        durationMinutes: m.durationMinutes,
        difficulty: 'Hard' as const,
        available: m.available,
      })),
    [mocks],
  )

  const allRows = useMemo<Row[]>(() => [...dayRows, ...mockRows], [dayRows, mockRows])

  const filteredRows = useMemo(() => {
    if (activeFilter === 'days') return dayRows
    if (activeFilter === 'full-mocks') return mockRows
    return allRows
  }, [activeFilter, allRows, dayRows, mockRows])

  const visibleRows = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    if (!q) return filteredRows
    return filteredRows.filter((row) => `${row.title} ${row.subtitle}`.toLowerCase().includes(q))
  }, [filteredRows, searchTerm])

  const counts = {
    all: allRows.length,
    days: dayRows.length,
    mocks: mockRows.length,
    available: allRows.filter((r) => r.available).length,
  }

  const handleLaunch = (row: Row) => {
    // Non-premium learners get a limited number of free AI-checked speaking
    // sessions. Once spent, show the premium gate instead of launching.
    if (speakingTrial.locked) {
      setShowTrialGate(true)
      return
    }
    speakingTrial.consume()
    navigate(`/ielts/speaking/test/${row.testId}`, {
      state: fromMock ? { entry: 'mock-ielts', from: navigationState?.from ?? 'tests' } : { entry: 'ielts-speaking' },
    })
  }

  return (
    <motion.div
      initial={minimalMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={minimalMotion ? { duration: 0.14 } : { duration: 0.34, ease: CARD_EASE }}
      className="w-full px-4 py-6 sm:px-6 lg:px-8"
    >
      <AnimatePresence>
        {showTrialGate ? (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/55 backdrop-blur-md"
              onClick={() => setShowTrialGate(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              transition={{ duration: 0.3, ease: CARD_EASE }}
              className="relative w-full max-w-md overflow-hidden rounded-[1.6rem] border border-amber-200 bg-white p-7 text-center shadow-[0_34px_78px_rgba(127,29,29,0.28)]"
            >
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-amber-400 via-red-500 to-rose-500" />
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 text-white shadow-[0_16px_32px_rgba(245,158,11,0.4)]">
                <Crown className="h-8 w-8" />
              </div>
              <span className="premium-top-chip mt-5 inline-flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Premium only
              </span>
              <h3 className="mt-3 text-2xl font-black tracking-tight text-slate-900">Free speaking sessions used up</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                You&apos;ve used your {speakingTrial.limit} free AI-checked speaking sessions. Subscribe to Premium for
                unlimited daily questions, full mocks and instant band analysis.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/premium')}
                  className="cta-sheen inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#DC2626] via-[#EF4444] to-[#B91C1C] px-5 py-2.5 text-sm font-bold text-white shadow-[0_12px_28px_rgba(220,38,38,0.34)]"
                >
                  <Crown className="h-4 w-4" />
                  Subscribe to Premium
                </button>
                <button
                  type="button"
                  onClick={() => setShowTrialGate(false)}
                  className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  Maybe later
                </button>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      {/* Hero */}
      <section className="relative overflow-hidden rounded-[1.9rem] border border-rose-100/85 bg-[linear-gradient(142deg,rgba(255,255,255,0.99),rgba(255,244,247,0.95))] p-5 shadow-[0_24px_56px_rgba(190,24,93,0.14)] sm:p-6">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-16 -top-16 h-44 w-44 rounded-full bg-rose-200/55 blur-3xl" />
          <div className="absolute -bottom-20 -right-16 h-48 w-48 rounded-full bg-orange-200/45 blur-3xl" />
        </div>

        <div className="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => navigate(fromMock ? '/mock/ielts' : '/ielts')}
                className="inline-flex min-h-[38px] items-center gap-2 rounded-full border border-rose-200 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-rose-700 shadow-[0_8px_18px_rgba(190,24,93,0.14)] transition hover:border-rose-300 hover:bg-rose-50"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </button>
              <span className="inline-flex min-h-[38px] items-center rounded-full border border-rose-200 bg-rose-50/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-rose-700">
                IELTS Speaking Section
              </span>
              {!speakingTrial.isPremium && Number.isFinite(speakingTrial.remaining) ? (
                <span className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs font-bold text-amber-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  {Math.max(0, speakingTrial.remaining)}/{speakingTrial.limit} free sessions left
                </span>
              ) : null}
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight text-[#0F172A] sm:text-4xl">
              IELTS <span className="arena-title-accent-red">Speaking Studio</span>
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
              Daily practice roadmap with Day 1–30 questions, plus full mocks with AI examiner. Record each answer and
              get instant grammar analysis, a corrected version, and a Band 8+ model rewrite.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 xl:w-[26rem] xl:grid-cols-3">
            <HeroMetric icon={<Layers3 className="h-4 w-4" />} label="Days" value={String(counts.days)} helper="Curated roadmap" />
            <HeroMetric icon={<Mic2 className="h-4 w-4" />} label="Full Mocks" value={String(counts.mocks)} helper="Graded by AI" />
            <HeroMetric icon={<PlayCircle className="h-4 w-4" />} label="Live now" value={String(counts.available)} helper="Ready to launch" />
          </div>
        </div>
      </section>

      {/* Layout */}
      <section className="mt-5 grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="h-fit rounded-3xl border border-rose-100/85 bg-white/95 p-4 shadow-[0_18px_42px_rgba(190,24,93,0.1)] lg:sticky lg:top-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-rose-600">Filter</p>
          <div className="mt-3 space-y-2">
            {(
              [
                { id: 'all' as Filter, title: 'All', helper: 'Full roadmap', count: counts.all },
                { id: 'days' as Filter, title: 'Daily practice', helper: 'Day 1 → 30 cycle', count: counts.days },
                { id: 'full-mocks' as Filter, title: 'Full mocks', helper: 'Exam simulation', count: counts.mocks },
              ] as const
            ).map((item) => {
              const isActive = activeFilter === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveFilter(item.id)}
                  className={`w-full rounded-2xl border px-3 py-3 text-left transition ${
                    isActive
                      ? 'border-rose-500 bg-gradient-to-r from-rose-600 via-red-500 to-orange-500 text-white shadow-[0_16px_30px_rgba(190,24,93,0.24)]'
                      : 'border-rose-100 text-slate-700 hover:border-rose-300 hover:bg-rose-50/45'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-base font-bold leading-tight">{item.title}</p>
                      <p className={`text-xs ${isActive ? 'text-white/90' : 'text-slate-500'}`}>{item.helper}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-black ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.count}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="mt-4 rounded-2xl border border-rose-200/80 bg-gradient-to-br from-white to-rose-50/75 p-3 text-xs">
            <p className="font-semibold uppercase tracking-[0.14em] text-rose-600">How the cycle works</p>
            <p className="mt-2 text-slate-600">
              Day 1 = Part 1 · Day 2 = Part 2 · Day 3 = Part 3. The cycle repeats — Day 4 is Part 1 again — across the
              full 30-day roadmap.
            </p>
          </div>
        </aside>

        <div className="rounded-3xl border border-rose-100/85 bg-white/95 p-4 shadow-[0_20px_46px_rgba(15,23,42,0.08)]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Speaking Roadmap</h2>
              <p className="text-sm text-slate-500">
                {activeFilter === 'days' ? 'Day-by-day question lineup' : activeFilter === 'full-mocks' ? 'Full mock simulation' : 'Daily questions + full mocks'}
              </p>
            </div>
            <span className="rounded-full border border-emerald-200 bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
              Live: {counts.available}
            </span>
          </div>

          <label className="relative mt-4 block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-rose-400" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search day, part, or topic..."
              className="h-11 w-full rounded-xl border border-rose-100 bg-white pl-9 pr-3 text-sm text-slate-800 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
            />
          </label>

          <div className="mt-3 max-h-[68vh] divide-y divide-slate-200/70 overflow-y-auto rounded-2xl border border-slate-200/80 bg-white">
            {visibleRows.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <p className="text-sm font-semibold text-slate-700">No tests match</p>
                <p className="mt-1 text-xs text-slate-500">Try a different keyword or filter.</p>
              </div>
            ) : (
              <AnimatePresence initial={false} mode="popLayout">
                {visibleRows.map((row) => (
                  <motion.article
                    key={row.id}
                    layout
                    initial={minimalMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={minimalMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                    whileHover={allowHoverMotion ? { scale: 1.01 } : undefined}
                    transition={minimalMotion ? { duration: 0.12 } : { duration: 0.24, ease: CARD_EASE }}
                    className="relative px-3 py-2 hover:bg-rose-50/45 sm:px-4"
                  >
                    <div className="absolute left-3 top-0 bottom-0 w-px">
                      <span className="block h-full w-px bg-gradient-to-b from-rose-200 via-rose-100 to-transparent" />
                    </div>
                    <span className="absolute left-[6px] top-4 inline-flex h-5 w-5 items-center justify-center rounded-full border border-rose-300 bg-white text-rose-600 shadow-[0_0_0_4px_rgba(255,241,242,1)]">
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    </span>

                    <div className="flex flex-wrap items-center justify-between gap-2 pl-8">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-base font-bold text-slate-900">{row.title}</h3>
                          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${partTone(row.badge, row.badgeLabel)}`}>
                            {row.badgeLabel}
                          </span>
                          {row.badge === 'full' ? (
                            <span className="rounded-full border border-violet-200 bg-violet-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-violet-700">
                              <Trophy className="mr-0.5 inline h-3 w-3" /> Graded
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-0.5 text-sm text-slate-500">{row.subtitle}</p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2.5 text-xs text-slate-600">
                          <span className={`rounded-full border px-2 py-0.5 font-semibold ${levelTone(row.difficulty)}`}>
                            {row.difficulty}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock3 className="h-3.5 w-3.5" />
                            {row.durationMinutes} min
                          </span>
                          <span className="inline-flex items-center gap-1 text-rose-700">
                            <Sparkles className="h-3.5 w-3.5" />
                            AI feedback
                          </span>
                        </div>
                      </div>

                      <motion.button
                        type="button"
                        whileTap={minimalMotion ? undefined : { scale: 0.98 }}
                        onClick={() => handleLaunch(row)}
                        className="inline-flex min-w-[9.5rem] items-center justify-center gap-2 rounded-xl border border-rose-600 bg-gradient-to-r from-rose-600 via-red-500 to-red-600 px-4 py-2 text-sm font-bold text-white transition hover:brightness-105"
                      >
                        <PlayCircle className="h-4 w-4" />
                        {row.badge === 'full' ? 'Start mock' : 'Start day'}
                      </motion.button>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </section>
    </motion.div>
  )
}

function HeroMetric({ icon, label, value, helper }: { icon: React.ReactNode; label: string; value: string; helper: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-rose-100/85 bg-white/90 px-4 py-3 shadow-[0_12px_28px_rgba(190,24,93,0.11)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent" />
      <div className="relative flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-600">{label}</p>
          <p className="mt-1 text-[1.8rem] font-black leading-none text-slate-900">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{helper}</p>
        </div>
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/70 bg-white/85 text-slate-600">
          {icon}
        </span>
      </div>
    </div>
  )
}
