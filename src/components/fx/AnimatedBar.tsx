import { motion } from 'framer-motion'
import { useMotionPreferences } from '@/hooks/useMotionPreferences'

interface AnimatedBarProps {
  /** 0 – 100 */
  value: number
  height?: number
  from?: string
  to?: string
  track?: string
  shimmer?: boolean
  className?: string
}

/**
 * Linear progress bar with an animated gradient fill and an optional shimmer
 * sweep. Fills from 0 → value on scroll-in; reduced-motion fills instantly.
 */
export default function AnimatedBar({
  value,
  height = 8,
  from = '#EF4444',
  to = '#B91C1C',
  track = 'rgba(248,113,113,0.14)',
  shimmer = true,
  className = '',
}: AnimatedBarProps) {
  const { minimalMotion } = useMotionPreferences()
  const clamped = Math.max(0, Math.min(100, value))

  return (
    <div
      className={`relative w-full overflow-hidden rounded-full ${className}`}
      style={{ height, background: track }}
    >
      <motion.div
        className="relative h-full overflow-hidden rounded-full"
        style={{ backgroundImage: `linear-gradient(90deg, ${from}, ${to})` }}
        initial={{ width: minimalMotion ? `${clamped}%` : 0 }}
        whileInView={{ width: `${clamped}%` }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={minimalMotion ? { duration: 0 } : { duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        {shimmer && !minimalMotion ? <span className="fx-shimmer absolute inset-0" aria-hidden /> : null}
      </motion.div>
    </div>
  )
}
