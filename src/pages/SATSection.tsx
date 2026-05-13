import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, Calculator, CheckCircle2, Sparkles, Target, Timer } from 'lucide-react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useMotionPreferences } from '@/hooks/useMotionPreferences'

type SATSectionKey = 'math' | 'reading-writing'

type SectionConfig = {
  title: string
  subtitle: string
  chip: string
  metricLabel: string
  metricValue: string
  modeLabel: string
  modeValue: string
  modules: Array<{
    title: string
    detail: string
    icon: 'math' | 'rw'
  }>
}

const sectionConfig: Record<SATSectionKey, SectionConfig> = {
  math: {
    title: 'SAT Math Studio',
    subtitle: 'Equation control, calculator/non-calculator pacing, and precision under timer pressure.',
    chip: 'SAT Math Section',
    metricLabel: 'Focus',
    metricValue: 'Math',
    modeLabel: 'Pacing',
    modeValue: 'Timed',
    modules: [
      { title: 'Algebra Core', detail: 'Linear, quadratic, and systems practice with structured mistake logs.', icon: 'math' },
      { title: 'Advanced Problem Solving', detail: 'Functions, expressions, and contextual data interpretation drills.', icon: 'math' },
      { title: 'Speed Blocks', detail: 'Short timed rounds to optimize speed without accuracy drop.', icon: 'math' },
    ],
  },
  'reading-writing': {
    title: 'SAT Reading/Writing Studio',
    subtitle: 'Evidence pairing, grammar correction, and transition logic with section-by-section analytics.',
    chip: 'SAT Reading/Writing Section',
    metricLabel: 'Focus',
    metricValue: 'Verbal',
    modeLabel: 'Pacing',
    modeValue: 'Adaptive',
    modules: [
      { title: 'Evidence & Inference', detail: 'Claim-evidence alignment and nuanced reasoning task flow.', icon: 'rw' },
      { title: 'Grammar & Usage', detail: 'Sentence-level correction and style consistency controls.', icon: 'rw' },
      { title: 'Revision Strategy', detail: 'Paragraph structure and rhetorical purpose optimization drills.', icon: 'rw' },
    ],
  },
}

function moduleIcon(type: 'math' | 'rw') {
  if (type === 'math') return Calculator
  return BookOpen
}

export default function SATSection() {
  const navigate = useNavigate()
  const location = useLocation()
  const { section } = useParams<{ section: string }>()
  const { allowHoverMotion } = useMotionPreferences()
  const navigationState = (location.state as { entry?: string; from?: string } | null)
  const fromMock = navigationState?.entry === 'mock-sat'
  const mockFrom = navigationState?.from ?? 'tests'

  if (!section || !(section in sectionConfig)) {
    return <Navigate to="/sat" replace />
  }

  const content = sectionConfig[section as SATSectionKey]
  const satTitleSuffix = content.title.startsWith('SAT ') ? content.title.slice(4) : content.title

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="premium-hero premium-hero-blue p-6 sm:p-9">
        <div className="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="premium-top-controls">
              <button
                onClick={() =>
                  fromMock
                    ? navigate('/mock/sat', { state: { from: mockFrom } })
                    : navigate('/sat')
                }
                className="premium-back-btn-blue"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {fromMock ? 'Back to Mock SAT' : 'Back'}
              </button>
              <span className="premium-top-chip-blue">
                {content.chip}
              </span>
            </div>
            <h1 className="premium-section-title mt-4">
              SAT <span className="arena-title-accent-blue">{satTitleSuffix}</span>
            </h1>
            <p className="premium-section-subtitle">{content.subtitle}</p>
          </div>

          <div className="grid gap-2 sm:grid-cols-3 xl:w-[28rem]">
            <div className="premium-stat-blue">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-700">{content.metricLabel}</p>
              <p className="mt-1 text-2xl font-black text-slate-900">{content.metricValue}</p>
            </div>
            <div className="premium-stat-blue">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-700">{content.modeLabel}</p>
              <p className="mt-1 text-2xl font-black text-slate-900">{content.modeValue}</p>
            </div>
            <div className="premium-stat-blue">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-700">Coaching</p>
              <p className="mt-1 text-2xl font-black text-slate-900">AI</p>
            </div>
          </div>
        </div>

        <div className="relative mt-6 flex flex-wrap gap-2">
          <button className="arena-primary-btn-blue">
            Open Section Session <Sparkles className="ml-2 h-4 w-4" />
          </button>
          <button className="arena-secondary-btn-blue">
            <Timer className="mr-2 h-4 w-4 text-blue-600" />
            Start Timer
          </button>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {content.modules.map((module) => {
          const Icon = moduleIcon(module.icon)
          return (
            <motion.article
              key={module.title}
              whileHover={allowHoverMotion ? { y: -4, scale: 1.015 } : undefined}
              className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-white via-blue-50/70 to-indigo-100/65 p-5 shadow-[0_16px_30px_rgba(37,99,235,0.12)]"
            >
              <div className="mb-3 inline-flex rounded-xl bg-blue-100 p-2 text-blue-700">
                <Icon className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">{module.title}</h2>
              <p className="mt-2 text-sm text-slate-700">{module.detail}</p>
            </motion.article>
          )
        })}
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-white via-blue-50/55 to-indigo-100/55 p-5 shadow-[0_14px_28px_rgba(37,99,235,0.1)]">
          <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Section Workflow
          </h3>
          <p className="mt-2 text-sm text-slate-700">Question pacing, review loops, and score calibration are active in this section.</p>
          <div className="mt-3 inline-flex items-center text-xs font-semibold text-emerald-600">
            <CheckCircle2 className="mr-1 h-4 w-4" />
            Workflow active
          </div>
        </div>
        <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-white via-blue-50/55 to-indigo-100/55 p-5 shadow-[0_14px_28px_rgba(37,99,235,0.1)]">
          <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900">
            <Target className="h-4 w-4 text-blue-700" />
            Precision Insights
          </h3>
          <p className="mt-2 text-sm text-slate-700">Accuracy bands, timing deltas, and weak-cluster mapping are shown per session.</p>
          <div className="mt-3 inline-flex items-center text-xs font-semibold text-blue-700">
            <Sparkles className="mr-1 h-4 w-4" />
            Analytics channel active
          </div>
        </div>
      </section>
    </div>
  )
}

