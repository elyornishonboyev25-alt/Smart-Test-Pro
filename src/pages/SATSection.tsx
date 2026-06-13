import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  BookOpen,
  Calculator,
  CheckCircle2,
  Clock3,
  ListChecks,
  Lock,
  Search,
  Sparkles,
} from 'lucide-react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useMotionPreferences } from '@/hooks/useMotionPreferences'

type SATSectionKey = 'math' | 'reading-writing'

type SectionConfig = {
  /** Public-facing label (the route id stays 'reading-writing' for compatibility). */
  label: string
  title: string
  subtitle: string
  chip: string
  noun: string
  durationMinutes: number
  questionCount: number
  icon: typeof Calculator
}

/** How many full mocks are seeded per section. Content is added over time. */
const MOCKS_PER_SECTION = 150
/** Number currently unlocked. Bump this as real mocks are published. */
const AVAILABLE_COUNT = 0

const sectionConfig: Record<SATSectionKey, SectionConfig> = {
  math: {
    label: 'Math',
    title: 'SAT Math Mock Arena',
    subtitle: 'Full-length, digital-SAT-style Math mocks — module 1 & 2 adaptive pacing under real timer pressure.',
    chip: 'SAT Math · Full Mocks',
    noun: 'Math',
    durationMinutes: 70,
    questionCount: 44,
    icon: Calculator,
  },
  'reading-writing': {
    label: 'English',
    title: 'SAT English Mock Arena',
    subtitle: 'Full-length Reading & Writing mocks — evidence, grammar, transitions and rhetoric in exam conditions.',
    chip: 'SAT English · Full Mocks',
    noun: 'English',
    durationMinutes: 64,
    questionCount: 54,
    icon: BookOpen,
  },
}

type MockRow = {
  id: number
  title: string
  available: boolean
}

export default function SATSection() {
  const navigate = useNavigate()
  const location = useLocation()
  const { section } = useParams<{ section: string }>()
  const { allowHoverMotion, minimalMotion } = useMotionPreferences()
  const navigationState = location.state as { entry?: string; from?: string } | null
  const fromMock = navigationState?.entry === 'mock-sat'
  const mockFrom = navigationState?.from ?? 'tests'

  const [search, setSearch] = useState('')

  const isValid = section === 'math' || section === 'reading-writing'
  const activeKey = (isValid ? section : 'math') as SATSectionKey
  const content = sectionConfig[activeKey]

  const mocks = useMemo<MockRow[]>(
    () =>
      Array.from({ length: MOCKS_PER_SECTION }, (_, index) => ({
        id: index + 1,
        title: `${content.noun} Full Mock ${index + 1}`,
        available: index < AVAILABLE_COUNT,
      })),
    [content.noun],
  )

  const visibleMocks = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return mocks
    return mocks.filter((mock) => mock.title.toLowerCase().includes(query) || String(mock.id) === query)
  }, [mocks, search])

  if (!isValid) {
    return <Navigate to="/sat" replace />
  }

  const Icon = content.icon
  const liveCount = mocks.filter((mock) => mock.available).length
  const lockedCount = mocks.length - liveCount

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#eef4ff] via-[#eaf1ff] to-[#e4ecff] px-4 py-8 sm:px-6 lg:px-10">
      {/* Blue ambient — covers the global red backdrop so SAT stays fully blue */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-4 h-80 w-80 rounded-full bg-blue-200/45 blur-3xl" />
        <div className="absolute bottom-[-8rem] right-[-4rem] h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-sky-200/30 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl">
        {/* Hero */}
        <section className="premium-hero premium-hero-blue p-6 sm:p-9">
          <div className="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="premium-top-controls">
                <button
                  onClick={() => (fromMock ? navigate('/mock/sat', { state: { from: mockFrom } }) : navigate('/sat'))}
                  className="premium-back-btn-blue"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  {fromMock ? 'Back to Mock SAT' : 'Back to SAT'}
                </button>
                <span className="premium-top-chip-blue">{content.chip}</span>
              </div>
              <h1 className="premium-section-title mt-4">
                SAT <span className="arena-title-accent-blue">{content.label} Mocks</span>
              </h1>
              <p className="premium-section-subtitle">{content.subtitle}</p>
            </div>

            <div className="grid gap-2 sm:grid-cols-3 xl:w-[30rem]">
              <div className="premium-stat-blue p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-700">Full Mocks</p>
                <p className="mt-1 text-3xl font-black text-slate-900">{mocks.length}</p>
                <p className="mt-1 text-xs text-slate-600">Seeded in this arena</p>
              </div>
              <div className="premium-stat-blue p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-700">Live now</p>
                <p className="mt-1 text-3xl font-black text-slate-900">{liveCount}</p>
                <p className="mt-1 text-xs text-slate-600">Ready to launch</p>
              </div>
              <div className="premium-stat-blue p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-700">Coming soon</p>
                <p className="mt-1 text-3xl font-black text-slate-900">{lockedCount}</p>
                <p className="mt-1 text-xs text-slate-600">Unlocking gradually</p>
              </div>
            </div>
          </div>

          {/* Section switch */}
          <div className="relative mt-6 inline-grid grid-cols-2 gap-1.5 rounded-2xl border border-blue-200/70 bg-white/80 p-1.5">
            {(['math', 'reading-writing'] as const).map((key) => {
              const cfg = sectionConfig[key]
              const active = key === activeKey
              const KeyIcon = cfg.icon
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() =>
                    navigate(`/sat/${key}`, {
                      state: fromMock ? { entry: 'mock-sat', from: mockFrom } : { entry: 'sat-hub' },
                    })
                  }
                  className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${
                    active
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_10px_20px_rgba(37,99,235,0.28)]'
                      : 'text-slate-600 hover:bg-blue-50'
                  }`}
                >
                  <KeyIcon className="h-4 w-4" />
                  {cfg.label}
                </button>
              )
            })}
          </div>
        </section>

        {/* Roadmap panel */}
        <section className="mt-6 rounded-[1.8rem] border border-blue-100 bg-white/90 p-4 shadow-[0_18px_40px_rgba(37,99,235,0.12)] sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-[0_12px_24px_rgba(37,99,235,0.3)]">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-xl font-black text-slate-900">{content.noun} Full Mock Roadmap</h2>
                <p className="text-sm text-slate-500">
                  {content.questionCount} questions · {content.durationMinutes} min · digital-SAT simulation
                </p>
              </div>
            </div>

            <label className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search mock number..."
                className="h-11 w-full rounded-xl border border-blue-100 bg-white pl-9 pr-3 text-sm text-slate-800 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
              />
            </label>
          </div>

          {/* "Coming soon" notice */}
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-3.5">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
            <p className="text-xs leading-relaxed text-slate-600">
              {liveCount === 0
                ? `All ${mocks.length} ${content.noun} full mocks are reserved and unlocking soon — full question sets are being added on a rolling basis, exactly like the IELTS roadmap.`
                : `${liveCount} live now · ${lockedCount} unlocking soon. New ${content.noun} full mocks are added on a rolling basis.`}
            </p>
          </div>

          {/* Mock grid */}
          <div className="mt-4 max-h-[64vh] overflow-y-auto rounded-2xl border border-slate-200/70 bg-white/60 p-3">
            {visibleMocks.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <p className="text-sm font-semibold text-slate-700">No mocks found</p>
                <p className="mt-1 text-xs text-slate-500">Try a different number.</p>
              </div>
            ) : (
              <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
                {visibleMocks.map((mock) => (
                  <motion.article
                    key={mock.id}
                    whileHover={allowHoverMotion && mock.available ? { y: -3 } : undefined}
                    whileTap={minimalMotion || !mock.available ? undefined : { scale: 0.99 }}
                    className={`relative overflow-hidden rounded-2xl border p-4 ${
                      mock.available
                        ? 'border-blue-200 bg-gradient-to-br from-white via-blue-50/70 to-indigo-100/60 shadow-[0_12px_24px_rgba(37,99,235,0.12)]'
                        : 'border-slate-200 bg-slate-50/70'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${
                          mock.available ? 'bg-blue-100 text-blue-700' : 'bg-slate-200/70 text-slate-500'
                        }`}
                      >
                        {mock.available ? <Icon className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                      </span>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] ${
                          mock.available
                            ? 'border-emerald-200 bg-emerald-100 text-emerald-700'
                            : 'border-amber-200 bg-amber-100 text-amber-700'
                        }`}
                      >
                        {mock.available ? 'Live' : 'Soon'}
                      </span>
                    </div>

                    <h3 className="mt-3 text-base font-black text-slate-900">{mock.title}</h3>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Clock3 className="h-3.5 w-3.5" />
                        {content.durationMinutes} min
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <ListChecks className="h-3.5 w-3.5" />
                        {content.questionCount} Q
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={!mock.available}
                      className={`mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold transition ${
                        mock.available
                          ? 'border-blue-600 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:brightness-105'
                          : 'cursor-not-allowed border-slate-200 bg-white text-slate-400'
                      }`}
                    >
                      {mock.available ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          Start mock
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4" />
                          Coming soon
                        </>
                      )}
                    </button>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
