import { useId } from 'react'
import { cn } from '@/components/ui/utils'

type BrandMarkProps = {
  size?: number
  className?: string
}

type BrandLockupProps = {
  className?: string
  iconClassName?: string
  titleClassName?: string
  subtitleClassName?: string
  subtitle?: string
  iconSize?: number
}

export function BrandMark({ size = 44, className }: BrandMarkProps) {
  const id = useId().replace(/:/g, '')
  const bgGradientId = `brand-bg-${id}`
  const shineGradientId = `brand-shine-${id}`
  const blueAccentId = `brand-blue-${id}`
  const sparkGradientId = `brand-spark-${id}`

  return (
    <span
      className={cn('relative inline-flex shrink-0 items-center justify-center', className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <defs>
          <linearGradient id={bgGradientId} x1="7" y1="5" x2="49" y2="50" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="58%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#B91C1C" />
          </linearGradient>
          <linearGradient id={shineGradientId} x1="7" y1="6" x2="45" y2="46" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.15)" />
          </linearGradient>
          <linearGradient id={blueAccentId} x1="35" y1="33" x2="41" y2="39" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#93C5FD" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <linearGradient id={sparkGradientId} x1="37" y1="9" x2="49" y2="21" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#BFDBFE" />
          </linearGradient>
        </defs>

        <rect x="2" y="2" width="52" height="52" rx="16" fill={`url(#${bgGradientId})`} />
        <rect x="2.8" y="2.8" width="50.4" height="50.4" rx="15.2" stroke={`url(#${shineGradientId})`} strokeOpacity="0.7" />
        <circle cx="28" cy="28" r="15.8" fill="white" fillOpacity="0.14" stroke="white" strokeOpacity="0.3" />

        <path d="M18.5 25.8 28 20 37.5 25.8 28 31.6 18.5 25.8Z" fill="white" fillOpacity="0.96" />
        <path
          d="M22.6 28.9v4.8c0 2.6 3 4.8 5.4 4.8s5.4-2.2 5.4-4.8v-4.8"
          stroke="white"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M37.4 26.4v7.2" stroke="white" strokeWidth="2.1" strokeLinecap="round" />
        <circle cx="37.4" cy="35.9" r="2.1" fill={`url(#${blueAccentId})`} />
        <path d="M17.4 39.9c3 2.7 6.4 4.1 10.6 4.1 4.2 0 7.7-1.4 10.6-4.1" stroke="white" strokeOpacity="0.82" strokeWidth="2.1" strokeLinecap="round" />

        <path d="M42 8.4 43.2 12.6 47.4 13.8 43.2 15 42 19.2 40.8 15 36.6 13.8 40.8 12.6Z" fill={`url(#${sparkGradientId})`} />
        <path d="M48 17.6 48.6 19.5 50.5 20.1 48.6 20.7 48 22.6 47.4 20.7 45.5 20.1 47.4 19.5Z" fill={`url(#${sparkGradientId})`} fillOpacity="0.9" />
      </svg>
    </span>
  )
}

export function BrandLockup({
  className,
  iconClassName,
  titleClassName,
  subtitleClassName,
  subtitle = 'Competitive Learning Platform',
  iconSize = 42,
}: BrandLockupProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <BrandMark size={iconSize} className={iconClassName} />
      <div>
        <p className={cn('text-sm font-black tracking-tight text-slate-900', titleClassName)}>Prof<span className="text-red-600">AI</span></p>
        <p className={cn('text-xs font-medium text-slate-700', subtitleClassName)}>{subtitle}</p>
      </div>
    </div>
  )
}

