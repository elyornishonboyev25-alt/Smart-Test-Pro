import type { ComponentProps, ComponentType } from 'react'
import type { LucideIcon } from 'lucide-react'

/** Accepts both lucide icons and plain inline SVG components. */
type IconLike = LucideIcon | ComponentType<ComponentProps<'svg'>>

type Size = 'sm' | 'md' | 'lg'
type Tone = 'red' | 'rose' | 'deep' | 'blue'

const sizes: Record<Size, { box: string; icon: string }> = {
  sm: { box: 'h-8 w-8 rounded-lg', icon: 'h-4 w-4' },
  md: { box: 'h-10 w-10 rounded-xl', icon: 'h-5 w-5' },
  lg: { box: 'h-12 w-12 rounded-2xl', icon: 'h-6 w-6' },
}

const tones: Record<Tone, string> = {
  red: 'from-[#DC2626] to-[#B91C1C]',
  rose: 'from-[#FB7185] to-[#E11D48]',
  deep: 'from-[#B91C1C] to-[#7F1D1D]',
  blue: 'from-[#2563EB] to-[#1D4ED8]',
}

interface BrandIconProps {
  icon: IconLike
  size?: Size
  tone?: Tone
  /** Filled gradient chip (default) vs. soft tinted chip */
  soft?: boolean
  glow?: boolean
  className?: string
}

/**
 * The single, on-brand icon chip used across the app. Replaces the old
 * rainbow per-feature gradients with one cohesive red/white treatment
 * (optional blue tone for the SAT track, soft variant for inline use).
 */
export default function BrandIcon({ icon: Icon, size = 'md', tone = 'red', soft = false, glow = true, className = '' }: BrandIconProps) {
  const s = sizes[size]

  if (soft) {
    const softCls =
      tone === 'blue'
        ? 'from-white to-blue-50 text-blue-600 ring-blue-100'
        : 'from-white to-red-50 text-red-600 ring-red-100'
    return (
      <span
        className={`inline-flex items-center justify-center ${s.box} bg-gradient-to-br ${softCls} ring-1 shadow-[0_6px_14px_rgba(15,23,42,0.06)] ${className}`}
      >
        <Icon className={s.icon} />
      </span>
    )
  }

  const shadow = glow
    ? tone === 'blue'
      ? 'shadow-[0_10px_22px_rgba(37,99,235,0.32)]'
      : 'shadow-[0_10px_22px_rgba(220,38,38,0.32)]'
    : 'shadow-sm'

  return (
    <span className={`inline-flex items-center justify-center ${s.box} bg-gradient-to-br ${tones[tone]} text-white ${shadow} ${className}`}>
      <Icon className={s.icon} />
    </span>
  )
}
