import { motion } from 'framer-motion'
import { ArrowLeft, Clock3, Headphones, ShieldCheck, Sparkles, Target } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMotionPreferences } from '@/hooks/useMotionPreferences'

const tracks = [
  {
    id: 'ielts',
    title: 'IELTS Mock Arena',
    subtitle: 'Full 4-section simulation',
    description:
      'Reading, Listening, Writing, and Speaking in exam-sequence order with strict timing behavior.',
    path: '/mock/ielts',
    tone: 'red',
    chips: ['2h 45m flow', '4 sections', 'exam pressure mode'],
  },
  {
    id: 'sat',
    title: 'SAT Mock Arena',
    subtitle: 'Digital SAT simulation',
    description:
      'Reading/Writing and Math modules inside one controlled environment with timer discipline and section gates.',
    path: '/mock/sat',
    tone: 'blue',
    chips: ['2h 14m flow', '4 modules', 'adaptive pacing'],
  },
] as const

function cardToneClass(tone: (typeof tracks)[number]['tone']) {
  if (tone === 'blue') {
    return 'border-blue-200 bg-gradient-to-br from-white via-blue-50 to-indigo-100/75 shadow-[0_20px_40px_rgba(37,99,235,0.16)]'
  }

  return 'border-red-200 bg-gradient-to-br from-white via-rose-50 to-red-100/70 shadow-[0_20px_40px_rgba(220,38,38,0.16)]'
}

function labelToneClass(tone: (typeof tracks)[number]['tone']) {
  if (tone === 'blue') {
    return 'border-blue-200 text-blue-700'
  }

  return 'border-red-200 text-red-700'
}

function linkToneClass(tone: (typeof tracks)[number]['tone']) {
  if (tone === 'blue') {
    return 'text-blue-700'
  }

  return 'text-red-700'
}

export default function Mock() {
  const navigate = useNavigate()
  const location = useLocation()
  const { minimalMotion, allowHoverMotion } = useMotionPreferences()
  const from = (location.state as { from?: string } | null)?.from

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#fde8e8] via-[#fceaea] to-[#f9dede] px-4 py-8 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="ambient-mesh" />
        <div className="ambient-grid" />
        <div className="ambient-noise" />
        <div className="absolute -left-20 top-8 h-72 w-72 rounded-full bg-red-200/45 blur-3xl" />
        <div className="absolute -right-16 top-20 h-80 w-80 rounded-full bg-indigo-200/35 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl space-y-6">
        <motion.section
          initial={minimalMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={minimalMotion ? { duration: 0.14 } : { duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          className="premium-hero p-6 sm:p-9"
        >
          <div className="relative grid gap-5 xl:grid-cols-[minmax(0,1fr)_28rem] xl:items-start">
            <div className="xl:pr-2">
              <div className="premium-top-controls">
                <button
                  onClick={() => navigate('/tests')}
                  className="premium-back-btn"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to Test Library
                </button>
                <span className="premium-top-chip">
                  <Sparkles className="h-3.5 w-3.5" />
                  Mock Exam Center
                </span>
              </div>
              <h1 className="premium-section-title mt-4">
                Choose your <span className="arena-title-accent-red">Mock Arena</span>
              </h1>
              <p className="premium-section-subtitle max-w-3xl">
                IELTS and SAT now open as dedicated mock exam spaces with structured timing, clean layout, and real test pressure.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-white px-3 py-1 text-xs font-semibold text-red-700">
                  <Clock3 className="h-3.5 w-3.5" />
                  Full-length timing
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-white px-3 py-1 text-xs font-semibold text-red-700">
                  <Target className="h-3.5 w-3.5" />
                  Real exam pressure
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-white px-3 py-1 text-xs font-semibold text-red-700">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Section lock flow
                </span>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 xl:w-full">
              <div className="hero-metric-card interactive-lift">
                <p className="hero-metric-label">Mock Tracks</p>
                <p className="hero-metric-value-sm">2</p>
                <p className="hero-metric-note">IELTS + SAT</p>
              </div>
              <div className="hero-metric-card interactive-lift">
                <p className="hero-metric-label">Session Style</p>
                <p className="hero-metric-value-sm hero-metric-value-compact">Locked</p>
                <p className="hero-metric-note">Exam-first sequence</p>
              </div>
              <div className="hero-metric-card interactive-lift">
                <p className="hero-metric-label">IELTS Flow</p>
                <p className="hero-metric-value-sm hero-metric-value-compact">2h 45m</p>
                <p className="hero-metric-note">4 sections</p>
              </div>
              <div className="hero-metric-card interactive-lift">
                <p className="hero-metric-label">SAT Flow</p>
                <p className="hero-metric-value-sm hero-metric-value-compact">2h 14m</p>
                <p className="hero-metric-note">4 modules</p>
              </div>
            </div>
          </div>
        </motion.section>

        <section className="grid gap-5 md:grid-cols-2">
          {tracks.map((track) => (
            <motion.button
              key={track.id}
              onClick={() => navigate(track.path, { state: { from: from ?? 'mock' } })}
              whileHover={allowHoverMotion ? { y: -5, scale: 1.012 } : undefined}
              whileTap={allowHoverMotion ? { scale: 0.996 } : undefined}
              className={`interactive-lift group rounded-[1.85rem] border p-6 text-left ${cardToneClass(track.tone)}`}
            >
              <div className={`inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs font-semibold ${labelToneClass(track.tone)}`}>
                <Headphones className="h-3.5 w-3.5" />
                {track.subtitle}
              </div>
              <h2 className="mt-4 text-3xl font-black text-slate-900">{track.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">{track.description}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                {track.chips.map((chip) => (
                  <span key={chip} className="rounded-full bg-white px-3 py-1 text-slate-700">
                    {chip}
                  </span>
                ))}
              </div>
              <p className={`mt-6 text-sm font-semibold transition group-hover:translate-x-1 ${linkToneClass(track.tone)}`}>
                Open {track.title} -&gt;
              </p>
            </motion.button>
          ))}
        </section>
      </div>
    </div>
  )
}

