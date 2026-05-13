import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { LogOut, Menu, UserRound, Zap } from 'lucide-react'
import Button from '../Button'
import { useAuthStore, type AuthState } from '@/store/authStore'
import { apiClient } from '@/lib/apiClient'
import { useToastStore, type ToastState } from '@/store/toastStore'
import { useRegisterModalStore, type RegisterModalState } from '@/store/registerModalStore'
import { useMotionPreferences } from '@/hooks/useMotionPreferences'
import { BrandLockup } from '@/components/brand/BrandLogo'

export function TopNavigation({ withSidebar = false }: { withSidebar?: boolean }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { minimalMotion } = useMotionPreferences()

  const user = useAuthStore((state: AuthState) => state.user)
  const refreshToken = useAuthStore((state: AuthState) => state.refreshToken)
  const clearSession = useAuthStore((state: AuthState) => state.clearSession)
  const pushToast = useToastStore((state: ToastState) => state.pushToast)
  const openRegisterModal = useRegisterModalStore((state: RegisterModalState) => state.openRegisterModal)

  const xpValue = useMemo(() => (user ? Math.max(0, user.xp) : 0), [user])
  const onLanding = location.pathname === '/' || location.pathname === '/dashboard' || location.pathname === '/about'

  const isActive = (path: string) => {
    if (path === '/dashboard') return onLanding
    return location.pathname.startsWith(path)
  }

  const handleNavigate = (path: string) => {
    navigate(path)
    setMobileOpen(false)
  }

  const openMockFromLanding = () => {
    navigate('/mock', { state: { from: 'home' } })
    setMobileOpen(false)
  }

  const goToSection = (sectionId: string) => {
    setMobileOpen(false)

    if (!onLanding) {
      navigate('/dashboard')
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 120)
      return
    }

    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const signOut = async () => {
    try {
      if (refreshToken) {
        await apiClient.post('/auth/logout', { refreshToken })
      }
    } catch {
      // Ignore network errors during logout.
    } finally {
      clearSession()
      pushToast({
        type: 'info',
        title: 'Signed out',
      })
      navigate('/login')
    }
  }

  return (
    <motion.nav
      initial={minimalMotion ? false : { y: -36, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={minimalMotion ? { opacity: 0 } : { y: -18, opacity: 0 }}
      transition={{ duration: minimalMotion ? 0.16 : 0.28, ease: [0.22, 1, 0.36, 1] }}
      className={`app-panel relative z-50 h-20 backdrop-blur-xl ${
        withSidebar
          ? 'sticky top-0 border-b border-red-200/90 lg:fixed lg:left-0 lg:right-0 lg:top-0 lg:border-b-0'
          : 'sticky top-0 border-b border-red-200/90'
      }`}
    >
      {withSidebar ? (
        <>
          <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(140deg,rgba(255,255,255,0.97),rgba(255,247,247,0.92))] lg:block" />
          <div className="pointer-events-none absolute left-64 top-0 hidden h-full w-px bg-gradient-to-b from-red-200/20 via-red-200/80 to-red-200/20 lg:block" />
          <div className="pointer-events-none absolute bottom-0 left-64 right-0 hidden h-px bg-gradient-to-r from-red-200/70 via-red-200/95 to-red-200/70 lg:block" />
        </>
      ) : null}

      <div
        className={`mx-auto flex h-full w-full items-center justify-between px-4 sm:px-6 ${
          withSidebar ? 'max-w-none lg:pl-[17rem] lg:pr-8' : 'max-w-7xl lg:px-8'
        }`}
      >
        <button
          onClick={() => handleNavigate('/dashboard')}
          className="interactive-lift flex items-center gap-3 rounded-2xl px-2 py-1.5 hover:bg-red-50/90"
        >
          <BrandLockup
            iconSize={42}
            iconClassName="glow-ring-red rounded-xl shadow-[0_10px_20px_rgba(220,38,38,0.35)]"
            titleClassName="text-sm font-black tracking-tight text-slate-900 sm:text-base"
            subtitleClassName="text-xs font-medium text-slate-700"
          />
        </button>

        <div className="hidden items-center gap-2 rounded-2xl border border-red-300/75 bg-white/95 p-1.5 text-sm font-semibold text-slate-700 shadow-[0_10px_26px_rgba(15,23,42,0.09)] lg:flex">
          <button
            onClick={() => handleNavigate('/dashboard')}
            className={`rounded-xl px-3 py-2 transition-colors ${
              isActive('/dashboard')
                ? 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 shadow-[0_8px_16px_rgba(185,28,28,0.16)]'
                : 'text-slate-700 hover:bg-red-50 hover:text-red-800'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavigate('/tests')}
            className={`rounded-xl px-3 py-2 transition-colors ${
              isActive('/tests')
                ? 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 shadow-[0_8px_16px_rgba(185,28,28,0.16)]'
                : 'text-slate-700 hover:bg-red-50 hover:text-red-800'
            }`}
          >
            Tests
          </button>
          <button
            onClick={openMockFromLanding}
            className={`rounded-xl px-3 py-2 transition-colors ${
              isActive('/mock')
                ? 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 shadow-[0_8px_16px_rgba(185,28,28,0.16)]'
                : 'text-slate-700 hover:bg-red-50 hover:text-red-800'
            }`}
          >
            Mock
          </button>
          <button
            onClick={() => handleNavigate('/leaderboard')}
            className={`rounded-xl px-3 py-2 transition-colors ${
              isActive('/leaderboard')
                ? 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 shadow-[0_8px_16px_rgba(185,28,28,0.16)]'
                : 'text-slate-700 hover:bg-red-50 hover:text-red-800'
            }`}
          >
            Leaderboard
          </button>
          <button
            onClick={() => goToSection('about')}
            className="rounded-xl px-3 py-2 text-slate-700 transition-colors hover:bg-red-50 hover:text-red-800"
          >
            About
          </button>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          {user ? (
            <div className="inline-flex items-center gap-1 rounded-xl border border-red-300/75 bg-gradient-to-br from-red-50 to-rose-100 px-3 py-2 text-sm font-semibold text-red-800 shadow-[0_10px_22px_rgba(185,28,28,0.18)]">
              <Zap className="h-4 w-4" />
              {xpValue} XP
            </div>
          ) : null}

          {!user ? (
            <>
              <Button
                variant="outline"
                className="interactive-lift rounded-xl border-red-300 bg-white px-4 py-2 text-red-800 hover:bg-red-50"
                onClick={() => handleNavigate('/login')}
              >
                Sign In
              </Button>
              <Button
                variant="primary"
                className="interactive-lift rounded-xl bg-gradient-to-r from-[#DC2626] via-[#EF4444] to-[#B91C1C] px-4 py-2 text-white hover:opacity-95"
                onClick={() => openRegisterModal()}
              >
                Get Started
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                className="interactive-lift rounded-xl border border-red-200 bg-white/90 px-3 py-2 text-slate-800 hover:bg-red-50 hover:text-red-800"
                onClick={() => handleNavigate('/account')}
              >
                <UserRound className="mr-1 h-4 w-4" /> Profile
              </Button>
              <Button
                variant="ghost"
                className="interactive-lift rounded-xl border border-red-200 bg-white/90 px-3 py-2 text-slate-800 hover:bg-red-50 hover:text-red-800"
                onClick={() => void signOut()}
              >
                <LogOut className="mr-1 h-4 w-4" /> Sign Out
              </Button>
            </>
          )}
        </div>

        <button
          className="rounded-xl border border-red-200 bg-white p-2 text-slate-800 shadow-sm transition-colors hover:bg-red-50 lg:hidden"
          onClick={() => setMobileOpen((value) => !value)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {mobileOpen ? (
          <motion.div
            initial={minimalMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={minimalMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
            exit={minimalMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: minimalMotion ? 0.15 : 0.24, ease: 'easeOut' }}
            className="overflow-hidden border-t border-red-100 bg-white/95 lg:hidden"
          >
            <div className="px-4 py-3">
              <div className="mb-3">
                {user ? (
                  <span className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
                    <Zap className="h-4 w-4" /> {xpValue} XP
                  </span>
                ) : null}
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <button className="rounded-lg px-3 py-2 text-left text-slate-800 transition-colors hover:bg-red-50 hover:text-red-800" onClick={() => handleNavigate('/dashboard')}>Home</button>
                <button className="rounded-lg px-3 py-2 text-left text-slate-800 transition-colors hover:bg-red-50 hover:text-red-800" onClick={() => handleNavigate('/tests')}>Tests</button>
                <button className="rounded-lg px-3 py-2 text-left text-slate-800 transition-colors hover:bg-red-50 hover:text-red-800" onClick={openMockFromLanding}>Mock</button>
                <button className="rounded-lg px-3 py-2 text-left text-slate-800 transition-colors hover:bg-red-50 hover:text-red-800" onClick={() => handleNavigate('/leaderboard')}>Leaderboard</button>
                {!user ? (
                  <>
                    <button className="rounded-lg px-3 py-2 text-left text-slate-800 transition-colors hover:bg-red-50 hover:text-red-800" onClick={() => handleNavigate('/login')}>Sign In</button>
                    <button
                      className="rounded-lg px-3 py-2 text-left text-slate-800 transition-colors hover:bg-red-50 hover:text-red-800"
                      onClick={() => {
                        setMobileOpen(false)
                        openRegisterModal()
                      }}
                    >
                      Get Started
                    </button>
                  </>
                ) : (
                  <>
                    <button className="rounded-lg px-3 py-2 text-left text-slate-800 transition-colors hover:bg-red-50 hover:text-red-800" onClick={() => handleNavigate('/account')}>Profile</button>
                    <button className="rounded-lg px-3 py-2 text-left text-slate-800 transition-colors hover:bg-red-50 hover:text-red-800" onClick={() => void signOut()}>Sign Out</button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.nav>
  )
}
