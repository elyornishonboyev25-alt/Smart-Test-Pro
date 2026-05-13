import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, CheckCircle2, Headphones, Mic2, PenSquare, ShieldCheck, Timer } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMotionPreferences } from '@/hooks/useMotionPreferences'

const examSections = [
  {
    id: 'reading',
    title: 'IELTS Reading',
    duration: '60 min',
    detail: '3 passages, strict flow, no pause during section.',
    icon: BookOpen,
    path: '/ielts/reading',
  },
  {
    id: 'listening',
    title: 'IELTS Listening',
    duration: '30 min',
    detail: 'Audio-first mode with one-pass concentration.',
    icon: Headphones,
    path: '/ielts/listening',
  },
  {
    id: 'writing',
    title: 'IELTS Writing',
    duration: '60 min',
    detail: 'Task split with timed draft and score focus.',
    icon: PenSquare,
    path: '/ielts/writing',
  },
  {
    id: 'speaking',
    title: 'IELTS Speaking',
    duration: '14 min',
    detail: '3-part sequence with recording discipline.',
    icon: Mic2,
    path: '/ielts/speaking',
  },
] as const

function ModeToggle({
  label,
  detail,
  checked,
  onToggle,
}: {
  label: string
  detail: string
  checked: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className="flex w-full items-start justify-between gap-3 rounded-xl border border-red-200 bg-white/85 px-3 py-2.5 text-left"
    >
      <div>
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        <p className="mt-0.5 text-xs text-slate-600">{detail}</p>
      </div>
      <span
        className={`mt-0.5 inline-flex h-6 min-w-[2.6rem] items-center rounded-full border px-1 transition ${
          checked
            ? 'border-red-300 bg-red-100 justify-end'
            : 'border-slate-300 bg-slate-100 justify-start'
        }`}
      >
        <span className="h-4 w-4 rounded-full bg-white shadow-sm" />
      </span>
    </button>
  )
}

export default function MockIELTS() {
  const navigate = useNavigate()
  const location = useLocation()
  const { minimalMotion, allowHoverMotion } = useMotionPreferences()
  const from = (location.state as { from?: string } | null)?.from
  const [strictTimer, setStrictTimer] = useState(true)
  const [autoSubmit, setAutoSubmit] = useState(true)
  const [focusMode, setFocusMode] = useState(true)

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#fde8e8] via-[#fceaea] to-[#f9dede] px-4 py-8 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="ambient-mesh" />
        <div className="ambient-grid" />
        <div className="ambient-noise" />
        <div className="absolute -left-16 top-10 h-72 w-72 rounded-full bg-red-200/45 blur-3xl" />
        <div className="absolute bottom-[-8rem] right-0 h-96 w-96 rounded-full bg-rose-200/35 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl space-y-6">
        <motion.section
          initial={minimalMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={minimalMotion ? { duration: 0.14 } : { duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          className="premium-hero p-6 sm:p-10"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="premium-top-controls">
                <button
                  onClick={() => navigate('/mock', { state: { from: from ?? 'home' } })}
                  className="premium-back-btn"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back
                </button>
                <span className="premium-top-chip">IELTS Mock Suite</span>
              </div>
              <h1 className="premium-section-title mt-4">
                Real <span className="arena-title-accent-red">IELTS Exam Mode</span>
              </h1>
              <p className="premium-section-subtitle max-w-3xl">
                Full-sequence IELTS simulation with timer discipline and section-by-section pressure control.
              </p>
            </div>

            <div className="premium-stat rounded-3xl bg-gradient-to-br from-white via-rose-50/70 to-red-100/65 px-5 py-4 text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600">Total Session</p>
              <p className="mt-1 text-4xl font-black text-slate-900">2h 45m</p>
              <p className="mt-2 text-xs font-semibold text-red-700">4 connected sections</p>
            </div>
          </div>
        </motion.section>

        <section className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            {examSections.map((section) => {
              const Icon = section.icon
              return (
                <motion.article
                  key={section.id}
                  whileHover={allowHoverMotion ? { y: -4, scale: 1.01 } : undefined}
                  className="surface-card p-5"
                >
                  <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                    <Icon className="h-3.5 w-3.5" />
                    {section.duration}
                  </div>
                  <h2 className="mt-3 text-2xl font-black text-slate-900">{section.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{section.detail}</p>
                  <button
                    onClick={() => navigate(section.path, { state: { entry: 'mock-ielts', from: from ?? 'tests' } })}
                    className="arena-primary-btn mt-4"
                  >
                    Start Section
                  </button>
                </motion.article>
              )
            })}
          </div>

          <div className="space-y-4">
            <article className="surface-card p-5">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-red-700">
                <ShieldCheck className="h-4 w-4" />
                Mock Environment Controls
              </p>
              <div className="mt-3 space-y-2">
                <ModeToggle
                  label="Strict Timer"
                  detail="Section auto-completes when time ends."
                  checked={strictTimer}
                  onToggle={() => setStrictTimer((value) => !value)}
                />
                <ModeToggle
                  label="Auto Submit"
                  detail="Answers lock at section finish."
                  checked={autoSubmit}
                  onToggle={() => setAutoSubmit((value) => !value)}
                />
                <ModeToggle
                  label="Focus Mode"
                  detail="Minimal distractions, exam-only view."
                  checked={focusMode}
                  onToggle={() => setFocusMode((value) => !value)}
                />
              </div>
            </article>

            <article className="surface-card p-5">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-red-700">
                <Timer className="h-4 w-4" />
                Full Mock Run
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Start from IELTS hub and run all sections in official order: Listening, Reading, Writing, Speaking.
              </p>
              <button
                onClick={() => navigate('/ielts', { state: { entry: 'mock-ielts', from: from ?? 'tests' } })}
                className="arena-primary-btn mt-4"
              >
                Launch Full IELTS Mock
              </button>
              <p className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-slate-500">
                <CheckCircle2 className="h-3.5 w-3.5 text-red-600" />
                Recommended: keep strict timer ON for realistic training.
              </p>
            </article>
          </div>
        </section>
      </div>
    </div>
  )
}

