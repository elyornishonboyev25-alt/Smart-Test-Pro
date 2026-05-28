import { LogIn, UserPlus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore, type AuthState } from '@/store/authStore'
import { useRegisterModalStore, type RegisterModalState } from '@/store/registerModalStore'
import { useMotionPreferences } from '@/hooks/useMotionPreferences'

type PremiumRouteProps = {
  children: React.ReactNode
  showGuestBanner?: boolean
}

export default function PremiumRoute({ children, showGuestBanner = false }: PremiumRouteProps) {
  const navigate = useNavigate()
  const { minimalMotion } = useMotionPreferences()
  const user = useAuthStore((state: AuthState) => state.user)
  const openRegisterModal = useRegisterModalStore((state: RegisterModalState) => state.openRegisterModal)

  if (!user && showGuestBanner) {
    return (
      <>
        <motion.section
          initial={minimalMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={minimalMotion ? { duration: 0.12 } : { duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="sticky top-0 z-[45] border-b border-red-200/70 bg-[linear-gradient(92deg,rgba(254,226,226,0.9),rgba(255,244,245,0.92),rgba(254,226,226,0.9))] shadow-[0_8px_20px_rgba(220,38,38,0.12)]"
        >
          <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-red-700">Guest Preview</p>
              <p className="text-sm font-medium text-slate-700">
                Explore all sections freely. Create an account to save progress across devices.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => openRegisterModal()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#DC2626] via-[#EF4444] to-[#B91C1C] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(220,38,38,0.3)] transition hover:opacity-95"
              >
                <UserPlus className="h-4 w-4" />
                Register
              </button>
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center gap-1.5 rounded-xl border border-red-300 bg-white/95 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </button>
            </div>
          </div>
        </motion.section>
        {children}
      </>
    )
  }

  return <>{children}</>
}


