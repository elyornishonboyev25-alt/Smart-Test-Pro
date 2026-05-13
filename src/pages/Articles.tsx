import { motion } from 'framer-motion'
import { ArrowLeft, FileText, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useMotionPreferences } from '@/hooks/useMotionPreferences'

export default function ArchivedLabPage() {
  const navigate = useNavigate()
  const { minimalMotion } = useMotionPreferences()

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.section
        initial={minimalMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={minimalMotion ? { duration: 0.1 } : { duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
        className="premium-hero p-6 sm:p-8"
      >
        <div className="premium-top-controls">
          <button type="button" onClick={() => navigate('/tests')} className="premium-back-btn">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Test Library
          </button>
          <span className="premium-top-chip">
            <FileText className="h-3.5 w-3.5" />
            Reading Notes
          </span>
        </div>

        <h1 className="premium-section-title mt-4">
          Curated <span className="arena-title-accent-red">Notes Workspace</span>
        </h1>
        <p className="premium-section-subtitle max-w-3xl">
          The layout is ready. Reading note modules will be added in the next release.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <article className="hero-metric-card">
            <p className="hero-metric-label">Collections</p>
            <p className="hero-metric-value-sm">0</p>
            <p className="hero-metric-note">Waiting for content</p>
          </article>
          <article className="hero-metric-card">
            <p className="hero-metric-label">Reading Blocks</p>
            <p className="hero-metric-value-sm">0</p>
            <p className="hero-metric-note">Coming soon</p>
          </article>
          <article className="hero-metric-card">
            <p className="hero-metric-label">Status</p>
            <p className="hero-metric-value-sm hero-metric-value-compact">Prepared</p>
            <p className="hero-metric-note">Design complete</p>
          </article>
        </div>
      </motion.section>

      <section className="mt-6 surface-card p-6 sm:p-8">
        <div className="rounded-2xl border border-amber-300/80 bg-amber-100/80 p-5 text-amber-900">
          <p className="inline-flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="h-4 w-4" />
            Content area is intentionally empty for now. Modules will be connected later.
          </p>
        </div>
      </section>
    </div>
  )
}

