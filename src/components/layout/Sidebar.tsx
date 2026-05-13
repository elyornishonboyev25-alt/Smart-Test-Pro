import { useLocation, useNavigate } from 'react-router-dom'
import { BarChart3, BookMarked, BookOpen, GraduationCap, Headset, Home, ShieldCheck, Trophy, TriangleAlert } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../ui/utils'
import { useMotionPreferences } from '@/hooks/useMotionPreferences'
import { BrandLockup } from '@/components/brand/BrandLogo'

export function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { minimalMotion, allowHoverMotion } = useMotionPreferences()

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
    { id: 'tests', label: 'Test Library', icon: BookOpen, path: '/tests' },
    { id: 'analyze-mistakes', label: 'Analyze Mistakes', icon: TriangleAlert, path: '/analyze-mistakes' },
    { id: 'profile', label: 'Performance', icon: BarChart3, path: '/profile', aliases: [] },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, path: '/leaderboard' },
    { id: 'sat', label: 'SAT Prep', icon: GraduationCap, path: '/sat' },
    { id: 'ielts', label: 'IELTS Prep', icon: BookOpen, path: '/ielts' },
  ]

  const labItems = [
    { id: 'vocabulary', label: 'Vocabulary Lab', icon: BookMarked, path: '/vocabulary' },
    { id: 'mock', label: 'Mock Arena', icon: ShieldCheck, path: '/mock' },
    { id: 'speaking-community', label: 'Speaking Community', icon: Headset, path: '/speaking-community' },
  ]

  const handleNavigate = (path: string) => {
    if (path === '/mock') {
      navigate(path, { state: { from: location.pathname } })
      return
    }

    navigate(path)
  }

  const isActive = (path: string, aliases: string[] = []) => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard'
    }

    if (location.pathname.startsWith(path)) return true
    return aliases.some((alias) => location.pathname.startsWith(alias))
  }

  return (
    <motion.aside
      initial={minimalMotion ? false : { x: -220, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={minimalMotion ? { opacity: 0 } : { x: -140, opacity: 0 }}
      transition={{ duration: minimalMotion ? 0.16 : 0.26, ease: [0.22, 1, 0.36, 1] }}
      className="app-panel fixed bottom-0 left-0 top-0 z-40 hidden w-64 overflow-y-auto border-r border-red-200/80 px-6 pb-6 pt-6 lg:block"
    >
      <div className="sidebar-brand-card mb-5">
        <BrandLockup
          className="relative z-10 gap-2.5"
          iconSize={38}
          iconClassName="rounded-xl shadow-[0_10px_20px_rgba(220,38,38,0.28)]"
          titleClassName="text-sm font-bold tracking-tight text-slate-900"
          subtitleClassName="text-[11px] font-medium text-slate-600"
        />
      </div>

      <div className="sidebar-heading-chip">Main Navigation</div>
      <nav className="space-y-2">
        {navItems.map((item) => {
          const active = isActive(item.path, item.aliases)
          const Icon = item.icon
          const hoverMotionProps = allowHoverMotion
            ? { whileHover: { x: 3 }, whileTap: { scale: 0.985 } }
            : {}

          return (
            <motion.button
              key={item.id}
              onClick={() => handleNavigate(item.path)}
              className={cn(
                'interactive-lift group relative flex w-full items-center gap-3 overflow-hidden rounded-xl border px-3 py-2.5 text-sm font-semibold',
                active
                  ? 'border-red-300 bg-gradient-to-r from-red-200/80 to-rose-200/70 text-red-900 shadow-[0_12px_24px_rgba(185,28,28,0.2)]'
                  : 'border-red-100/40 bg-white/80 text-slate-800 hover:border-red-200 hover:bg-red-50 hover:text-slate-900',
              )}
              {...hoverMotionProps}
            >
              {active ? <span className="absolute inset-y-1 left-0.5 w-1 rounded-full bg-red-600/80" /> : null}
              <Icon className={cn('relative z-10 h-4 w-4', active ? 'text-red-800' : 'text-slate-600')} />
              <span className="relative z-10 min-w-0 flex-1 truncate pr-1">{item.label}</span>
            </motion.button>
          )
        })}
      </nav>

      <div className="my-6 h-px bg-gradient-to-r from-transparent via-red-300/65 to-transparent" />

      <div className="sidebar-heading-chip">Labs</div>
      <nav className="space-y-2 pb-10">
        {labItems.map((item) => {
          const active = isActive(item.path)
          const Icon = item.icon
          const hoverMotionProps = allowHoverMotion
            ? { whileHover: { x: 3 }, whileTap: { scale: 0.985 } }
            : {}
          const iconToneClass = 'text-slate-600 bg-white border-red-100'

          return (
            <motion.button
              key={item.id}
              onClick={() => handleNavigate(item.path)}
              className={cn(
                'interactive-lift group relative flex w-full items-center gap-3 overflow-hidden rounded-xl border px-3 py-2.5 text-sm font-semibold',
                active
                  ? 'border-red-300 bg-gradient-to-r from-red-200/80 to-rose-200/70 text-red-900 shadow-[0_12px_24px_rgba(185,28,28,0.2)]'
                  : 'border-red-100/40 bg-white/80 text-slate-800 hover:border-red-200 hover:bg-red-50 hover:text-slate-900',
              )}
              {...hoverMotionProps}
            >
              {active ? <span className="absolute inset-y-1 left-0.5 w-1 rounded-full bg-red-600/80" /> : null}
              <span
                className={cn(
                  'relative z-10 inline-flex h-7 w-7 items-center justify-center rounded-lg border',
                  active ? 'border-red-200 bg-red-100 text-red-800' : iconToneClass,
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="relative z-10 min-w-0 flex-1 truncate pr-1">{item.label}</span>
            </motion.button>
          )
        })}
      </nav>
    </motion.aside>
  )
}
