import { ArrowLeft, ArrowRight, BookOpen, Headphones, Mic2, PenSquare } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AmbientBackdrop, BrandIcon, CountUp, Reveal, Stagger, StaggerItem, Tilt3D } from '@/components/fx'

const sections = [
  {
    id: 'reading',
    title: 'Reading',
    description: 'Passage navigation, inference precision, and time management with AI support.',
    icon: BookOpen,
    chips: ['3 passages', 'timed drills', 'AI review'],
  },
  {
    id: 'listening',
    title: 'Listening',
    description: 'Audio concentration, distractor control, and answer transfer accuracy workflows.',
    icon: Headphones,
    chips: ['4 sections', 'audio mode', 'mistake map'],
  },
  {
    id: 'writing',
    title: 'Writing',
    description: 'Task 1 and Task 2 structured writing studio with premium draft analytics.',
    icon: PenSquare,
    chips: ['task studio', 'band hints', 'timed mode'],
  },
  {
    id: 'speaking',
    title: 'Speaking',
    description: 'Part-by-part speaking flow with recording, replay, and fluency analysis.',
    icon: Mic2,
    chips: ['3 parts', 'voice mode', 'AI feedback'],
  },
] as const

const heroMetrics = [
  { label: 'IELTS Sections', value: 4, note: 'Independent premium pages' },
  { label: 'Workflow', text: 'Exam', note: 'Reading to Speaking flow' },
  { label: 'Coaching', text: 'AI', note: 'Per-section analysis' },
] as const

export default function IELTS() {
  const navigate = useNavigate()
  const location = useLocation()
  const navigationState = location.state as { entry?: string; from?: string } | null
  const fromMock = navigationState?.entry === 'mock-ielts'
  const mockFrom = navigationState?.from ?? 'tests'

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-10">
      <AmbientBackdrop variant="red" />

      <div className="relative mx-auto w-full max-w-6xl space-y-6">
        {/* ── Hero ──────────────────────────────────────────── */}
        <Reveal>
          <section className="premium-hero p-6 sm:p-10">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="premium-top-controls">
                  <button
                    onClick={() => (fromMock ? navigate('/mock/ielts', { state: { from: mockFrom } }) : navigate('/tests'))}
                    className="premium-back-btn"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    {fromMock ? 'Back to Mock IELTS' : 'Back'}
                  </button>
                  <span className="premium-top-chip">IELTS Master Track</span>
                </div>
                <h1 className="premium-section-title mt-4">
                  Choose your <span className="arena-title-accent-red">IELTS Arena</span>
                </h1>
                <p className="premium-section-subtitle">
                  Reading, Listening, Writing, and Speaking now open as independent premium sections with their own pages.
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-3 xl:w-[31rem]">
                {heroMetrics.map((metric) => (
                  <div key={metric.label} className="hero-metric-card interactive-lift">
                    <p className="hero-metric-label">{metric.label}</p>
                    <p className={`hero-metric-value-sm ${'text' in metric ? 'hero-metric-value-compact' : ''}`}>
                      {'value' in metric ? <CountUp value={metric.value} /> : metric.text}
                    </p>
                    <p className="hero-metric-note">{metric.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        {/* ── Section cards ─────────────────────────────────── */}
        <Stagger className="grid gap-5 md:grid-cols-2">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <StaggerItem key={section.id} className="h-full">
                <Tilt3D className="h-full rounded-[1.8rem]" max={7}>
                  <button
                    onClick={() =>
                      navigate(`/ielts/${section.id}`, {
                        state: fromMock ? { entry: 'mock-ielts', from: mockFrom } : { entry: 'ielts-hub' },
                      })
                    }
                    className="group relative h-full w-full overflow-hidden rounded-[1.8rem] border border-slate-100 bg-white p-6 text-left shadow-[0_16px_40px_rgba(15,23,42,0.06)] transition hover:border-red-200 hover:shadow-[0_26px_52px_rgba(220,38,38,0.13)]"
                  >
                    <span className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-red-400/55 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <span className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-red-100/0 blur-2xl transition-colors duration-300 group-hover:bg-red-100/60" />

                    <div className="relative flex items-center justify-between">
                      <BrandIcon icon={Icon} size="lg" soft />
                      <span className="rounded-full border border-red-100 bg-red-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-red-700">
                        IELTS Section
                      </span>
                    </div>

                    <h2 className="relative mt-4 text-2xl font-black tracking-tight text-slate-900">{section.title}</h2>
                    <p className="relative mt-2 text-sm leading-6 text-slate-600">{section.description}</p>

                    <div className="relative mt-4 flex flex-wrap gap-2">
                      {section.chips.map((chip) => (
                        <span key={chip} className="soft-chip">
                          {chip}
                        </span>
                      ))}
                    </div>

                    <span className="cta-sheen relative mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#DC2626] via-[#EF4444] to-[#B91C1C] px-4 py-2.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(220,38,38,0.28)]">
                      Start practice
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </button>
                </Tilt3D>
              </StaggerItem>
            )
          })}
        </Stagger>
      </div>
    </div>
  )
}
