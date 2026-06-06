import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useMotionPreferences } from '@/hooks/useMotionPreferences'

const COLORS = ['#DC2626', '#EF4444', '#FB7185', '#F97316', '#FBBF24']

interface BurstProps {
  count?: number
  play?: boolean
  className?: string
}

/**
 * Lightweight celebration confetti burst, centered in its container.
 * Render conditionally (e.g. on a high score or a successful match).
 * Renders nothing under reduced-motion.
 */
export default function Burst({ count = 18, play = true, className = '' }: BurstProps) {
  const { reducedMotion } = useMotionPreferences()
  const bits = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        angle: (i / count) * Math.PI * 2,
        dist: 60 + Math.random() * 80,
        color: COLORS[i % COLORS.length],
        size: 6 + Math.random() * 6,
        rot: Math.random() * 360,
        dur: 1.1 + Math.random() * 0.5,
      })),
    [count],
  )

  if (reducedMotion || !play) return null

  return (
    <div className={`pointer-events-none absolute inset-0 z-20 flex items-center justify-center ${className}`} aria-hidden>
      {bits.map((b) => (
        <motion.span
          key={b.id}
          className="absolute rounded-[2px]"
          style={{ width: b.size, height: b.size * 0.5, backgroundColor: b.color }}
          initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
          animate={{
            opacity: 0,
            x: Math.cos(b.angle) * b.dist,
            y: Math.sin(b.angle) * b.dist - 20,
            rotate: b.rot,
            scale: 0.5,
          }}
          transition={{ duration: b.dur, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}
