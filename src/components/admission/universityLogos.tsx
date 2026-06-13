import type { ReactNode } from 'react'

// Hand-built, brand-accurate SVG logos for each university. Inline SVG (no network)
// means they always render instantly, stay perfectly crisp at any size, and can never
// break — unlike hot-linked logo CDNs, which returned wildly inconsistent sizes
// (16px–256px), CORS errors and timeouts when tested. Each mark is designed to sit on
// a clean white tile, mirroring how these institutions present their real logos.
//
// Many of these institutions genuinely use a wordmark (Stanford, ETH, UCL, Caltech,
// Imperial, NUS); MIT uses its iconic red/grey bars; Harvard, Oxford and Cambridge use
// crests, rendered here as clean, recognisable interpretations in the official colours.

const SERIF = 'Georgia, "Times New Roman", serif'
const SANS = '"Segoe UI", Helvetica, Arial, sans-serif'

const shieldPath = 'M50 6 L86 6 L86 44 C86 70 68 84 50 94 C32 84 14 70 14 44 L14 6 Z'

const logos: Record<string, ReactNode> = {
  // MIT — the iconic red/grey bar logo.
  mit: (
    <svg viewBox="0 0 132 64" width="100%" height="100%" role="img" aria-label="MIT">
      <g>
        {/* M */}
        <rect x="2" y="6" width="9" height="52" fill="#8A8B8C" />
        <rect x="14" y="6" width="9" height="34" fill="#A31F34" />
        <rect x="26" y="6" width="9" height="52" fill="#8A8B8C" />
        {/* I */}
        <rect x="44" y="6" width="9" height="52" fill="#A31F34" />
        {/* T */}
        <rect x="62" y="6" width="40" height="9" fill="#8A8B8C" />
        <rect x="77" y="6" width="9" height="52" fill="#A31F34" />
        {/* trailing bar, as in the wordmark */}
        <rect x="112" y="6" width="9" height="52" fill="#8A8B8C" />
      </g>
    </svg>
  ),

  // Imperial College London — navy wordmark.
  'imperial-college-london': (
    <svg viewBox="0 0 200 64" width="100%" height="100%" role="img" aria-label="Imperial College London">
      <text x="100" y="30" textAnchor="middle" fontFamily={SERIF} fontSize="30" fontWeight="700" fill="#003E74">
        Imperial
      </text>
      <text x="100" y="50" textAnchor="middle" fontFamily={SANS} fontSize="12" letterSpacing="3" fill="#0072B8">
        COLLEGE LONDON
      </text>
    </svg>
  ),

  // Stanford — cardinal serif wordmark.
  'stanford-university': (
    <svg viewBox="0 0 200 64" width="100%" height="100%" role="img" aria-label="Stanford University">
      <text x="100" y="34" textAnchor="middle" fontFamily={SERIF} fontSize="34" fontWeight="700" fill="#8C1515">
        Stanford
      </text>
      <text x="100" y="52" textAnchor="middle" fontFamily={SANS} fontSize="11" letterSpacing="4" fill="#8C1515">
        UNIVERSITY
      </text>
    </svg>
  ),

  // Oxford — navy roundel with an open book.
  'university-of-oxford': (
    <svg viewBox="0 0 100 100" width="100%" height="100%" role="img" aria-label="University of Oxford">
      <circle cx="50" cy="50" r="44" fill="#002147" />
      <circle cx="50" cy="50" r="44" fill="none" stroke="#C8A951" strokeWidth="2" />
      {/* open book */}
      <path d="M50 38 C42 32 28 33 22 36 L22 64 C28 61 42 60 50 66 C58 60 72 61 78 64 L78 36 C72 33 58 32 50 38 Z" fill="#ffffff" />
      <path d="M50 38 L50 66" stroke="#002147" strokeWidth="2" />
      <path d="M28 42 H44 M28 49 H44 M56 42 H72 M56 49 H72" stroke="#002147" strokeWidth="1.6" />
    </svg>
  ),

  // Harvard — crimson shield with VE / RI / TAS books.
  'harvard-university': (
    <svg viewBox="0 0 100 100" width="100%" height="100%" role="img" aria-label="Harvard University">
      <path d={shieldPath} fill="#A51C30" />
      <path d={shieldPath} fill="none" stroke="#7a1020" strokeWidth="2" />
      <rect x="30" y="26" width="40" height="12" rx="2" fill="#fff" />
      <rect x="26" y="44" width="48" height="12" rx="2" fill="#fff" />
      <rect x="34" y="62" width="32" height="12" rx="2" fill="#fff" />
      <text x="50" y="35" textAnchor="middle" fontFamily={SERIF} fontSize="9" fontWeight="700" fill="#A51C30">VE</text>
      <text x="50" y="53" textAnchor="middle" fontFamily={SERIF} fontSize="9" fontWeight="700" fill="#A51C30">RI</text>
      <text x="50" y="71" textAnchor="middle" fontFamily={SERIF} fontSize="9" fontWeight="700" fill="#A51C30">TAS</text>
    </svg>
  ),

  // Cambridge — blue shield with cross and roundels.
  'university-of-cambridge': (
    <svg viewBox="0 0 100 100" width="100%" height="100%" role="img" aria-label="University of Cambridge">
      <path d={shieldPath} fill="#0072CE" />
      <path d={shieldPath} fill="none" stroke="#0a4f8a" strokeWidth="2" />
      {/* cross */}
      <rect x="45" y="16" width="10" height="62" fill="#fff" />
      <rect x="22" y="38" width="56" height="10" fill="#fff" />
      {/* roundels */}
      <circle cx="33" cy="28" r="4" fill="#fff" />
      <circle cx="67" cy="28" r="4" fill="#fff" />
      <circle cx="33" cy="60" r="4" fill="#fff" />
      <circle cx="67" cy="60" r="4" fill="#fff" />
    </svg>
  ),

  // ETH Zürich — wordmark.
  'eth-zurich': (
    <svg viewBox="0 0 160 64" width="100%" height="100%" role="img" aria-label="ETH Zürich">
      <text x="80" y="36" textAnchor="middle" fontFamily={SANS} fontSize="40" fontWeight="800" letterSpacing="2" fill="#1F407A">
        ETH
      </text>
      <text x="80" y="54" textAnchor="middle" fontFamily={SANS} fontSize="15" letterSpacing="2" fill="#1F407A">
        zürich
      </text>
    </svg>
  ),

  // NUS — blue wordmark with orange underline.
  'national-university-of-singapore': (
    <svg viewBox="0 0 140 64" width="100%" height="100%" role="img" aria-label="National University of Singapore">
      <text x="70" y="40" textAnchor="middle" fontFamily={SANS} fontSize="42" fontWeight="800" letterSpacing="1" fill="#003D7C">
        NUS
      </text>
      <rect x="34" y="48" width="72" height="5" rx="2.5" fill="#EF7C00" />
    </svg>
  ),

  // UCL — purple wordmark.
  ucl: (
    <svg viewBox="0 0 140 64" width="100%" height="100%" role="img" aria-label="UCL">
      <text x="70" y="44" textAnchor="middle" fontFamily={SANS} fontSize="46" fontWeight="800" letterSpacing="3" fill="#500778">
        UCL
      </text>
    </svg>
  ),

  // Caltech — navy wordmark with orange accent.
  caltech: (
    <svg viewBox="0 0 190 64" width="100%" height="100%" role="img" aria-label="Caltech">
      <text x="95" y="42" textAnchor="middle" fontFamily={SERIF} fontSize="36" fontWeight="700" fill="#003B6F">
        Caltech
      </text>
      <rect x="40" y="50" width="110" height="4" rx="2" fill="#FF6C0C" />
    </svg>
  ),
}

export function getUniversityLogo(id: string): ReactNode | undefined {
  return logos[id]
}
