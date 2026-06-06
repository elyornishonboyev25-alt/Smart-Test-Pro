import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, SearchX, Sparkles } from 'lucide-react'
import { useMotionPreferences } from '@/hooks/useMotionPreferences'

export default function NotFound() {
  const { minimalMotion } = useMotionPreferences()

  return (
    <div className="relative min-h-[80vh] overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="ambient-mesh" />
        <div className="ambient-grid" />
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-red-200/45 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-rose-200/35 blur-3xl" />
      </div>

      <motion.div
        initial={minimalMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={minimalMotion ? { duration: 0.14 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="premium-hero relative mx-auto flex max-w-2xl flex-col items-center p-10 text-center"
      >
        <span className="premium-top-chip">
          <Sparkles className="h-3.5 w-3.5" />
          SmartTest Pro
        </span>

        <motion.div
          initial={minimalMotion ? false : { opacity: 0, scale: 0.85, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={minimalMotion ? { duration: 0.14 } : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className={`mt-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-[#DC2626] via-[#EF4444] to-[#B91C1C] text-white shadow-[0_18px_38px_rgba(220,38,38,0.36)] ${minimalMotion ? '' : 'fx-float'}`}
        >
          <SearchX className="h-10 w-10" />
        </motion.div>

        <motion.h1
          initial={minimalMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={minimalMotion ? { duration: 0.14 } : { duration: 0.55, delay: 0.08 }}
          className="mt-6 text-6xl font-black tracking-tight text-slate-900 sm:text-7xl"
        >
          <span className="arena-title-accent-red">404</span>
        </motion.h1>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">Page Not Found</h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
          The page you are looking for does not exist or was moved. Let&apos;s get you back to where the practice happens.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/dashboard"
            className="cta-sheen interactive-lift inline-flex items-center rounded-xl bg-gradient-to-r from-[#DC2626] via-[#EF4444] to-[#B91C1C] px-5 py-2.5 text-sm font-bold text-white shadow-[0_12px_28px_rgba(220,38,38,0.32)]"
          >
            <Home className="mr-2 h-4 w-4" />
            Go to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="interactive-lift inline-flex items-center rounded-xl border border-red-200 bg-white px-5 py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  )
}
