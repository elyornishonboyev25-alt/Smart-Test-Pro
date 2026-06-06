import { Suspense, lazy } from 'react'
import { useMotionPreferences } from '@/hooks/useMotionPreferences'

const Hero3D = lazy(() => import('./Hero3D'))

/** Static, dependency-free stand-in for the 3D crystal. */
function Hero3DFallback({ className = '' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} aria-hidden>
      <div className="relative h-40 w-40">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#F87171] via-[#EF4444] to-[#B91C1C] shadow-[0_30px_60px_rgba(220,38,38,0.4)]" />
        <div className="absolute left-6 top-5 h-12 w-12 rounded-full bg-white/45 blur-md" />
        <div className="absolute inset-0 rounded-full ring-1 ring-white/40" />
      </div>
    </div>
  )
}

interface Hero3DStageProps {
  className?: string
}

/**
 * Mounts the lazy 3D crystal only when motion is allowed. Reduced-motion /
 * low-power devices get a lightweight static orb instead, and the heavy
 * three.js bundle is never downloaded for them.
 */
export default function Hero3DStage({ className = '' }: Hero3DStageProps) {
  const { minimalMotion } = useMotionPreferences()

  if (minimalMotion) return <Hero3DFallback className={className} />

  return (
    <div className={className}>
      <Suspense fallback={<Hero3DFallback className="h-full w-full" />}>
        <Hero3D />
      </Suspense>
    </div>
  )
}
