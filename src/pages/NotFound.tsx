import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, SearchX } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] px-4 py-12">
      <div className="mx-auto flex max-w-2xl flex-col items-center rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-[0_20px_40px_rgba(31,41,55,0.08)]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600"
        >
          <SearchX className="h-9 w-9" />
        </motion.div>

        <h1 className="mt-6 text-5xl font-bold text-[#1F2937]">404</h1>
        <h2 className="mt-2 text-2xl font-semibold text-[#1F2937]">Page Not Found</h2>
        <p className="mt-2 text-sm text-[#6B7280]">The page you are looking for does not exist or was moved.</p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] px-4 py-2 text-sm font-semibold text-white"
          >
            <Home className="mr-2 h-4 w-4" />
            Go to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}

