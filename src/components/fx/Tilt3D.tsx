import { useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useMotionPreferences } from '@/hooks/useMotionPreferences'

interface Tilt3DProps {
  children: ReactNode
  className?: string
  /** Maximum tilt in degrees */
  max?: number
  /** How far the card lifts toward the viewer (translateZ px) */
  lift?: number
  /** Show a soft moving glare highlight */
  glare?: boolean
}

/**
 * Premium 3D hover tilt wrapper. Tracks the pointer and applies a subtle
 * perspective rotation + lift, plus an optional glare sweep. Fully disabled
 * for reduced-motion / touch / low-power devices via useMotionPreferences().
 */
export default function Tilt3D({ children, className = '', max = 9, lift = 10, glare = true }: Tilt3DProps) {
  const { allowHoverMotion } = useMotionPreferences()
  const ref = useRef<HTMLDivElement>(null)

  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 220, damping: 18 })
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 220, damping: 18 })
  const z = useSpring(0, { stiffness: 220, damping: 20 })
  const glareX = useTransform(px, [0, 1], ['0%', '100%'])
  const glareY = useTransform(py, [0, 1], ['0%', '100%'])
  const glareOpacity = useSpring(0, { stiffness: 200, damping: 22 })
  const glareBg = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.5), transparent 46%)`

  if (!allowHoverMotion) {
    return <div className={className}>{children}</div>
  }

  const handleMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    px.set((event.clientX - rect.left) / rect.width)
    py.set((event.clientY - rect.top) / rect.height)
  }

  const handleEnter = () => {
    z.set(lift)
    glareOpacity.set(0.16)
  }

  const handleLeave = () => {
    px.set(0.5)
    py.set(0.5)
    z.set(0)
    glareOpacity.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={`${className} [transform-style:preserve-3d]`}
      onPointerMove={handleMove}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
      style={{ rotateX, rotateY, z, transformPerspective: 1000 }}
    >
      {children}
      {glare ? (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
          style={{ opacity: glareOpacity, backgroundImage: glareBg }}
        />
      ) : null}
    </motion.div>
  )
}
