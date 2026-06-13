import { ArrowLeft, BookOpen, Calculator } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CountUp, Reveal, Stagger, StaggerItem, Tilt3D } from '@/components/fx'

const sections = [
  {
    id: 'math',
    title: 'SAT Math',
    description: '150 full-length, digital-SAT-style Math mocks — adaptive modules with speed-pressure pacing.',
    icon: Calculator,
    chips: ['150 full mocks', 'algebra', 'advanced math'],
  },
  {
    id: 'reading-writing',
    title: 'SAT English',
    description: '150 full-length Reading & Writing mocks — evidence, grammar, transitions and rhetoric.',
    icon: BookOpen,
    chips: ['150 full mocks', 'grammar', 'critical reading'],
  },
] as const

export default function SAT() {
  const navigate = useNavigate()
  const location = useLocation()
  const navigationState = location.state as { entry?: string; from?: string } | null
  const fromMock = navigationState?.entry === 'mock-sat'
  const mockFrom = navigationState?.from ?? 'tests'

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#eaf2ff] via-[#edf4ff] to-[#e5edff] px-4 py-8 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 top-10 h-72 w-72 rounded-full bg-blue-200/45 blur-3xl" />
        <div className="absolute bottom-[-8rem] right-0 h-96 w-96 rounded-full bg-indigo-200/35 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-sky-200/30 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl space-y-6">
        <Reveal>
          <section className="premium-hero premium-hero-blue p-6 sm:p-10">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="premium-top-controls">
                  <button
                    onClick={() =>
                      fromMock
                        ? navigate('/mock/sat', { state: { from: mockFrom } })
                        : navigate('/tests')
                    }
                    className="premium-back-btn-blue"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    {fromMock ? 'Back to Mock SAT' : 'Back'}
                  </button>
                  <span className="premium-top-chip-blue">SAT Advanced Track</span>
                </div>
                <h1 className="premium-section-title mt-4">
                  Choose your <span className="arena-title-accent-blue">SAT Arena</span>
                </h1>
                <p className="premium-section-subtitle">
                  Two full-mock arenas — 150 Math and 150 English digital-SAT mocks, unlocking on a rolling roadmap.
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-3 xl:w-[31rem]">
                <div className="premium-stat-blue p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-700">Full Mocks</p>
                  <p className="mt-1 text-3xl font-black text-slate-900">
                    <CountUp value={300} />
                  </p>
                  <p className="mt-1 text-xs text-slate-600">150 Math · 150 English</p>
                </div>
                <div className="premium-stat-blue p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-700">Workflow</p>
                  <p className="mt-1 text-3xl font-black text-slate-900">Exam</p>
                  <p className="mt-1 text-xs text-slate-600">Adaptive module structure</p>
                </div>
                <div className="premium-stat-blue p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-700">Coaching</p>
                  <p className="mt-1 text-3xl font-black text-slate-900">AI</p>
                  <p className="mt-1 text-xs text-slate-600">Per-module diagnostics</p>
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        <Stagger className="grid gap-5 md:grid-cols-2">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <StaggerItem key={section.id} className="h-full">
                <Tilt3D className="h-full rounded-[1.8rem]" max={6}>
                  <button
                    onClick={() =>
                      navigate(`/sat/${section.id}`, {
                        state: fromMock
                          ? { entry: 'mock-sat', from: mockFrom }
                          : { entry: 'sat-hub' },
                      })
                    }
                    className="interactive-lift group h-full w-full rounded-[1.8rem] border border-blue-200 bg-gradient-to-br from-white via-blue-50 to-indigo-100/75 p-6 text-left shadow-[0_18px_36px_rgba(37,99,235,0.16)]"
                  >
                    <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-semibold text-blue-700">
                      <Icon className="h-3.5 w-3.5" />
                      SAT Section
                    </div>
                    <h2 className="mt-4 text-3xl font-black text-slate-900">{section.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{section.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                      {section.chips.map((chip) => (
                        <span key={chip} className="rounded-full bg-white px-3 py-1 text-slate-700">
                          {chip}
                        </span>
                      ))}
                    </div>
                    <p className="mt-6 text-sm font-semibold text-blue-700 transition group-hover:translate-x-1">Open {section.title} -&gt;</p>
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
