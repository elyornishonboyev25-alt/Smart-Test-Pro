import type { UniversityBrand } from '@/data/admission'
import { getUniversityLogo } from './universityLogos'

// Renders a university's real, brand-accurate logo on a clean white tile — the way
// these institutions present themselves. The logo is inline SVG (see universityLogos),
// so it loads instantly and never breaks. If an id has no logo yet, we fall back to a
// branded monogram crest so a profile is never left blank.
export default function UniversityLogo({
  id,
  brand,
  size = 64,
  className = '',
  rounded = '1.1rem',
}: {
  id?: string
  brand: UniversityBrand
  size?: number
  className?: string
  rounded?: string
}) {
  const logo = id ? getUniversityLogo(id) : undefined

  if (logo) {
    return (
      <span
        className={`relative inline-flex flex-shrink-0 items-center justify-center overflow-hidden bg-white ${className}`}
        style={{
          width: size,
          height: size,
          borderRadius: rounded,
          padding: size * 0.16,
          boxShadow: '0 6px 18px rgba(15,23,42,0.12), inset 0 0 0 1px rgba(15,23,42,0.06)',
        }}
      >
        {logo}
      </span>
    )
  }

  // Fallback: branded monogram crest.
  const len = brand.monogram.length
  const fontSize = len <= 1 ? size * 0.5 : len === 2 ? size * 0.4 : len === 3 ? size * 0.3 : size * 0.24

  return (
    <span
      className={`relative inline-flex flex-shrink-0 items-center justify-center overflow-hidden ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: rounded,
        background: brand.gradient,
        boxShadow: `0 10px 26px ${brand.accent}40, inset 0 1px 0 rgba(255,255,255,0.28)`,
      }}
      aria-hidden
    >
      <span
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(circle at 26% 18%, rgba(255,255,255,0.32), transparent 58%)' }}
      />
      <span
        className="relative font-black leading-none tracking-tight"
        style={{
          color: brand.ink,
          fontSize,
          fontFamily: 'Georgia, "Times New Roman", serif',
          textShadow: '0 1px 2px rgba(0,0,0,0.28)',
        }}
      >
        {brand.monogram}
      </span>
    </span>
  )
}
