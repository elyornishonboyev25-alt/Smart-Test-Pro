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
      {/* Globe (study abroad) wearing a graduation cap (education) with an AI spark. */}
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
          <linearGradient id={blueAccentId} x1="30" y1="28" x2="38" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#93C5FD" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <linearGradient id={sparkGradientId} x1="39" y1="3" x2="49" y2="14" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#BFDBFE" />
          </linearGradient>
        </defs>

        {/* Badge */}
        <rect x="2" y="2" width="52" height="52" rx="16" fill={`url(#${bgGradientId})`} />
        <rect x="2.8" y="2.8" width="50.4" height="50.4" rx="15.2" stroke={`url(#${shineGradientId})`} strokeOpacity="0.7" />

        {/* Globe */}
        <circle cx="28" cy="35" r="11" fill="white" fillOpacity="0.16" stroke="white" strokeWidth="2.1" />
        <ellipse cx="28" cy="35" rx="11" ry="4.1" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.9" />
        <ellipse cx="28" cy="35" rx="4.1" ry="11" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.9" />
        {/* Destination marker abroad */}
        <circle cx="32.4" cy="31.2" r="2.1" fill={`url(#${blueAccentId})`} stroke="white" strokeWidth="0.9" />

        {/* Graduation cap */}
        <path d="M28 9.4 42 15.4 28 21.4 14 15.4Z" fill="white" />
        <circle cx="28" cy="15.4" r="1.45" fill={`url(#${blueAccentId})`} />
        <path d="M42 15.4c1.7 0.9 2.1 3 1.5 5.3" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="43.5" cy="22" r="1.7" fill={`url(#${blueAccentId})`} />

        {/* AI sparks */}
        <path d="M44 3.4 45.4 6.6 48.6 8 45.4 9.4 44 12.6 42.6 9.4 39.4 8 42.6 6.6Z" fill={`url(#${sparkGradientId})`} />
        <path d="M49.4 12.4 50 14 51.6 14.6 50 15.2 49.4 16.8 48.8 15.2 47.2 14.6 48.8 14Z" fill={`url(#${sparkGradientId})`} fillOpacity="0.9" />
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

