import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useMotionPreferences } from '@/hooks/useMotionPreferences'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  blur?: boolean
  once?: boolean
}

/**
 * Entrance wrapper — fades/slides/unblurs its children when they scroll into
 * view. No-op under reduced-motion.
 */
export default function Reveal({ children, className, delay = 0, y = 16, blur = true, once = true }: RevealProps) {
  const { reducedMotion } = useMotionPreferences()

  if (reducedMotion) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: blur ? 'blur(6px)' : 'blur(0px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once, margin: '-8% 0px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
