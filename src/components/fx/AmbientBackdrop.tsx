import { motion } from 'framer-motion'
import { useMotionPreferences } from '@/hooks/useMotionPreferences'

interface AmbientBackdropProps {
  variant?: 'red' | 'blue'
  grid?: boolean
  className?: string
}

/**
 * Reusable per-section ambient layer: a faint grid plus two slowly drifting
 * blurred orbs in the brand palette. Drop inside any `relative` container.
 * Drifting pauses for reduced-motion / low-power devices.
 */
export default function AmbientBackdrop({ variant = 'red', grid = true, className = '' }: AmbientBackdropProps) {
  const { minimalMotion } = useMotionPreferences()
  const orbA = variant === 'blue' ? 'bg-blue-300/40' : 'bg-rose-300/40'
  const orbB = variant === 'blue' ? 'bg-indigo-300/35' : 'bg-red-300/35'

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {grid ? <div className="ambient-grid" /> : null}
      <motion.div
        className={`absolute -left-24 -top-24 h-72 w-72 rounded-full ${orbA} blur-3xl`}
        animate={minimalMotion ? undefined : { x: [0, 20, 0], y: [0, -14, 0], scale: [1, 1.05, 1] }}
        transition={minimalMotion ? undefined : { duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className={`absolute -bottom-24 -right-20 h-80 w-80 rounded-full ${orbB} blur-3xl`}
        animate={minimalMotion ? undefined : { x: [0, -18, 0], y: [0, 16, 0], scale: [1, 1.06, 1] }}
        transition={minimalMotion ? undefined : { duration: 19, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
