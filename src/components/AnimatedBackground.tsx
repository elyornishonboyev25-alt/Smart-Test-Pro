import { motion } from 'framer-motion'
import { memo } from 'react'
import { useMotionPreferences } from '@/hooks/useMotionPreferences'

export const AnimatedBackground = memo(function AnimatedBackground() {
  const { minimalMotion } = useMotionPreferences()

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div className="ambient-mesh" />
      <div className="ambient-noise" />
      <motion.div
        className="absolute inset-y-0 left-1/2 hidden w-[28rem] -translate-x-1/2 bg-[linear-gradient(120deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.52)_44%,rgba(255,255,255,0)_100%)] md:block"
        animate={minimalMotion ? undefined : { x: [-120, 140, -120], opacity: [0.12, 0.32, 0.12] }}
        transition={minimalMotion ? undefined : { duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="ambient-orb ambient-orb-left"
        animate={minimalMotion ? undefined : { x: [0, 24, 0], y: [0, -16, 0], scale: [1, 1.03, 1] }}
        transition={minimalMotion ? undefined : { duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="ambient-orb ambient-orb-right"
        animate={minimalMotion ? undefined : { x: [0, -20, 0], y: [0, 20, 0], scale: [1, 1.04, 1] }}
        transition={minimalMotion ? undefined : { duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="ambient-orb absolute left-[46%] top-[18%] h-52 w-52 rounded-full bg-rose-200/45"
        animate={minimalMotion ? undefined : { x: [0, 14, -10, 0], y: [0, -16, 8, 0], scale: [1, 1.06, 1] }}
        transition={minimalMotion ? undefined : { duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="ambient-grid" />
    </div>
  )
})
