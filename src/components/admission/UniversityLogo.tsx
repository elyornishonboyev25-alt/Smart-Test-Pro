import type { UniversityBrand } from '@/data/admission'

// A self-contained, watermark-free crest rendered from the school's brand colours.
// No external image, so it always loads instantly and can never break. The monogram
// sits on the brand gradient with a subtle ring + gloss to read as a premium emblem.
export default function UniversityLogo({
  brand,
  size = 64,
  className = '',
  rounded = '1.1rem',
}: {
  brand: UniversityBrand
  size?: number
  className?: string
  rounded?: string
}) {
  // Scale the monogram down as the string gets longer so 1–4 letters all fit cleanly.
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
      {/* corner glow */}
      <span
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(circle at 26% 18%, rgba(255,255,255,0.32), transparent 58%)' }}
      />
      {/* hairline inner ring, like an embossed crest edge */}
      <span
        className="pointer-events-none absolute inset-[6%]"
        style={{ borderRadius: 'inherit', border: '1px solid rgba(255,255,255,0.22)' }}
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
