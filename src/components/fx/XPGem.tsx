interface XPGemProps {
  size?: number
  className?: string
  float?: boolean
  title?: string
}

/**
 * Lightweight isometric "crystal" gem rendered as a single inline SVG (no
 * three.js canvas) — a polished, delightful brand accent for XP / level.
 * Optional gentle float via the CSS `.fx-float` keyframe.
 */
export default function XPGem({ size = 56, className = '', float = true, title = 'XP gem' }: XPGemProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label={title}
      className={`${float ? 'fx-float' : ''} ${className}`}
    >
      <defs>
        <linearGradient id="xpgem-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFE4E6" />
          <stop offset="100%" stopColor="#FB7185" />
        </linearGradient>
        <linearGradient id="xpgem-right" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F87171" />
          <stop offset="100%" stopColor="#DC2626" />
        </linearGradient>
        <linearGradient id="xpgem-left" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#7F1D1D" />
        </linearGradient>
      </defs>
      {/* soft contact shadow */}
      <ellipse cx="32" cy="60" rx="15" ry="3" fill="rgba(190,18,60,0.18)" />
      {/* isometric crystal faces */}
      <polygon points="32,5 55,18 32,31 9,18" fill="url(#xpgem-top)" />
      <polygon points="9,18 32,31 32,57 9,44" fill="url(#xpgem-left)" />
      <polygon points="55,18 32,31 32,57 55,44" fill="url(#xpgem-right)" />
      {/* crisp top edges + facet shine */}
      <polygon points="32,5 55,18 32,31 9,18" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="0.7" />
      <polygon points="32,10 46,18 32,26 18,18" fill="rgba(255,255,255,0.38)" />
      <line x1="32" y1="31" x2="32" y2="57" stroke="rgba(255,255,255,0.22)" strokeWidth="0.7" />
    </svg>
  )
}
