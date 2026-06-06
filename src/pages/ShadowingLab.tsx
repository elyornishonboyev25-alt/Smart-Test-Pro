import { ArrowLeft, AudioLines, CheckCircle2, Ear, Mic, Repeat, Sparkles, Volume2, Waves } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AmbientBackdrop, BrandIcon, CountUp, Reveal, Stagger, StaggerItem, Tilt3D } from '@/components/fx'

type Step = { title: string; detail: string; icon: LucideIcon }

const steps: Step[] = [
  { title: 'Listen', detail: 'Play the clip once and focus only on the rhythm and intonation.', icon: Ear },
  { title: 'Mimic', detail: 'Repeat in real time, copying stress and connected speech.', icon: Repeat },
  { title: 'Record', detail: 'Record yourself shadowing the same line out loud.', icon: Mic },
  { title: 'Compare', detail: 'Play both back and mark the words that drifted.', icon: Volume2 },
]

type Drill = {
  id: string
  title: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: string
  focus: string
}

const drills: Drill[] = [
  { id: 'd1', title: 'Everyday Conversation', level: 'Beginner', duration: '2 min', focus: 'Linking & natural pace' },
  { id: 'd2', title: 'News Anchor Clip', level: 'Intermediate', duration: '3 min', focus: 'Clarity & word stress' },
  { id: 'd3', title: 'TED-Style Talk', level: 'Intermediate', duration: '4 min', focus: 'Intonation & emphasis' },
  { id: 'd4', title: 'Academic Lecture', level: 'Advanced', duration: '5 min', focus: 'Rhythm under speed' },
  { id: 'd5', title: 'Interview Answer', level: 'Advanced', duration: '3 min', focus: 'Confidence & flow' },
  { id: 'd6', title: 'Podcast Segment', level: 'Intermediate', duration: '4 min', focus: 'Reductions & tone' },
]

const checklist = ['Pronunciation clarity', 'Word stress accuracy', 'Sentence rhythm', 'Natural intonation']

function levelBadge(level: Drill['level']) {
  if (level === 'Beginner') return 'border-emerald-200 bg-emerald-50 text-emerald-700'
  if (level === 'Advanced') return 'border-red-200 bg-red-50 text-red-700'
  return 'border-amber-200 bg-amber-50 text-amber-700'
}

export default function ShadowingLab() {
  const navigate = useNavigate()

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#fde8e8] via-[#fceaea] to-[#f9dede] px-4 py-8 sm:px-6 lg:px-10">
      <AmbientBackdrop variant="red" />

      <div className="relative mx-auto w-full max-w-6xl space-y-6">
        <Reveal>
          <section className="premium-hero p-6 sm:p-9">
            <div className="relative grid gap-5 xl:grid-cols-[minmax(0,1fr)_26rem] xl:items-start">
              <div>
                <div className="premium-top-controls">
                  <button onClick={() => navigate('/tests')} className="premium-back-btn">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to Test Library
                  </button>
                  <span className="premium-top-chip">
                    <AudioLines className="h-3.5 w-3.5" />
                    Shadowing Lab
                  </span>
                </div>
                <h1 className="premium-section-title mt-4">
                  Audio <span className="arena-title-accent-red">Shadowing Practice</span>
                </h1>
                <p className="premium-section-subtitle max-w-3xl">
                  Train fluency and pronunciation by shadowing native audio — listen, mimic in real time, record, and compare. Build natural rhythm one clip at a time.
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-3 xl:w-full">
                <div className="hero-metric-card interactive-lift">
                  <p className="hero-metric-label">Drills</p>
                  <p className="hero-metric-value-sm">
                    <CountUp value={drills.length} />
                  </p>
                  <p className="hero-metric-note">Shadowing clips</p>
                </div>
                <div className="hero-metric-card interactive-lift">
                  <p className="hero-metric-label">Method</p>
                  <p className="hero-metric-value-sm hero-metric-value-compact">4-Step</p>
                  <p className="hero-metric-note">Listen to compare</p>
                </div>
                <div className="hero-metric-card interactive-lift">
                  <p className="hero-metric-label">Focus</p>
                  <p className="hero-metric-value-sm hero-metric-value-compact">Fluency</p>
                  <p className="hero-metric-note">Rhythm &amp; stress</p>
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        {/* 4-step method */}
        <Stagger className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <StaggerItem key={step.title} className="h-full">
                <Tilt3D className="h-full rounded-3xl" max={6}>
                  <article className="surface-card h-full p-5">
                    <div className="flex items-center justify-between">
                      <BrandIcon icon={Icon} soft />
                      <span className="text-2xl font-black text-red-200">{index + 1}</span>
                    </div>
                    <h2 className="mt-3 text-lg font-bold text-slate-900">{step.title}</h2>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{step.detail}</p>
                  </article>
                </Tilt3D>
              </StaggerItem>
            )
          })}
        </Stagger>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          {/* Drill playlist */}
          <Reveal className="surface-card p-6">
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="inline-flex items-center gap-2 text-xl font-semibold text-slate-900">
                <Waves className="h-5 w-5 text-red-600" />
                Shadowing Drills
              </h2>
              <span className="soft-chip">Pick a clip to start</span>
            </div>
            <Stagger className="grid gap-3 sm:grid-cols-2">
              {drills.map((drill) => (
                <StaggerItem key={drill.id} className="h-full">
                  <Tilt3D className="h-full rounded-2xl" max={5}>
                    <article className="group h-full rounded-2xl border border-red-100 bg-gradient-to-br from-white to-red-50/50 p-4 transition hover:border-red-200 hover:shadow-[0_12px_26px_rgba(220,38,38,0.1)]">
                      <div className="flex items-center justify-between">
                        <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${levelBadge(drill.level)}`}>
                          {drill.level}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500">{drill.duration}</span>
                      </div>
                      <h3 className="mt-3 text-base font-bold text-slate-900">{drill.title}</h3>
                      <p className="mt-1 text-xs text-slate-600">{drill.focus}</p>
                      <span className="cta-sheen mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#DC2626] via-[#EF4444] to-[#B91C1C] px-3.5 py-2 text-xs font-bold text-white shadow-[0_8px_20px_rgba(220,38,38,0.26)]">
                        <Mic className="h-3.5 w-3.5" />
                        Start shadowing
                      </span>
                    </article>
                  </Tilt3D>
                </StaggerItem>
              ))}
            </Stagger>
          </Reveal>

          {/* Self-check */}
          <Reveal delay={0.1} className="space-y-4">
            <article className="surface-card p-5">
              <h3 className="inline-flex items-center gap-2 text-base font-semibold text-slate-900">
                <CheckCircle2 className="h-4 w-4 text-red-600" />
                Self-Check
              </h3>
              <ul className="mt-3 space-y-2">
                {checklist.map((item) => (
                  <li key={item} className="flex items-center gap-2 rounded-xl border border-red-100 bg-white px-3 py-2 text-sm text-slate-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            <article className="surface-card p-5">
              <h3 className="inline-flex items-center gap-2 text-base font-semibold text-slate-900">
                <Sparkles className="h-4 w-4 text-red-600" />
                Pro Tip
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Shadow the same clip 3 times. By the third pass your mouth remembers the rhythm — that muscle memory is what makes speech sound natural.
              </p>
            </article>
          </Reveal>
        </section>
      </div>
    </div>
  )
}
