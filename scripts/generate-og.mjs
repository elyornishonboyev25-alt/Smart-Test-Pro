// One-off generator for the social/Telegram link-preview image (Open Graph).
// Renders a branded 1200x630 card to public/og-image.png.
//
// Run with:  node scripts/generate-og.mjs
// Requires @resvg/resvg-js (installed on demand; not a runtime dependency).
import { Resvg } from '@resvg/resvg-js'
import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '../public/og-image.png')

const FONT = "'Segoe UI Variable Display','Segoe UI',Arial,'Helvetica Neue',sans-serif"

// Feature chips — flowed across rows with width estimated from label length.
const FEATURES = [
  'IELTS', 'SAT', 'Mock Arena', 'AI Writing Check', 'Speaking Studio',
  'Vocabulary Arena', 'Shadowing', 'Study Abroad', 'Reading Library', 'Leaderboard',
]

function buildChips({ startX, startY, maxX, rowGap = 16, colGap = 12, h = 50 }) {
  let x = startX
  let y = startY
  const out = []
  for (const label of FEATURES) {
    const w = Math.round(label.length * 11.2 + 58)
    if (x + w > maxX) {
      x = startX
      y += h + rowGap
    }
    out.push(`
      <g transform="translate(${x} ${y})">
        <rect width="${w}" height="${h}" rx="${h / 2}" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.34)" stroke-width="1.4"/>
        <circle cx="26" cy="${h / 2}" r="6" fill="#FFFFFF" fill-opacity="0.95"/>
        <text x="44" y="${h / 2 + 7}" font-family="${FONT}" font-size="21" font-weight="700" fill="#FFFFFF">${label}</text>
      </g>`)
    x += w + colGap
  }
  return out.join('')
}

const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#F0533B"/>
      <stop offset="52%" stop-color="#DC2626"/>
      <stop offset="100%" stop-color="#9F1118"/>
    </linearGradient>
    <linearGradient id="badge" x1="14" y1="10" x2="106" y2="108" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#EF4444"/>
      <stop offset="58%" stop-color="#DC2626"/>
      <stop offset="100%" stop-color="#B91C1C"/>
    </linearGradient>
    <linearGradient id="accent" x1="64" y1="60" x2="82" y2="82" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#93C5FD"/>
      <stop offset="100%" stop-color="#2563EB"/>
    </linearGradient>
    <linearGradient id="spark" x1="84" y1="6" x2="105" y2="30" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#BFDBFE"/>
    </linearGradient>
    <linearGradient id="headline" x1="64" y1="190" x2="64" y2="330" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#FFE7E1"/>
    </linearGradient>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="18" flood-color="#5B0A0E" flood-opacity="0.45"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="120" cy="70" r="320" fill="#FFFFFF" fill-opacity="0.10"/>
  <circle cx="1120" cy="600" r="360" fill="#7F0E12" fill-opacity="0.30"/>
  <circle cx="1040" cy="120" r="180" fill="#FFFFFF" fill-opacity="0.07"/>
  <!-- faint grid -->
  <g stroke="#FFFFFF" stroke-opacity="0.06" stroke-width="1">
    ${Array.from({ length: 13 }, (_, i) => `<line x1="${i * 100}" y1="0" x2="${i * 100}" y2="630"/>`).join('')}
    ${Array.from({ length: 7 }, (_, i) => `<line x1="0" y1="${i * 100}" x2="1200" y2="${i * 100}"/>`).join('')}
  </g>

  <!-- Brand badge (globe + graduation cap + AI spark) -->
  <g transform="translate(64 52) scale(0.82)" filter="url(#soft)">
    <rect x="5" y="5" width="110" height="110" rx="30" fill="url(#badge)"/>
    <rect x="6.2" y="6.2" width="107.6" height="107.6" rx="28.8" stroke="#FFFFFF" stroke-opacity="0.72"/>
    <circle cx="60" cy="75" r="23.6" fill="#FFFFFF" fill-opacity="0.16" stroke="#FFFFFF" stroke-width="4.4"/>
    <ellipse cx="60" cy="75" rx="23.6" ry="8.8" fill="none" stroke="#FFFFFF" stroke-width="3.1" stroke-opacity="0.9"/>
    <ellipse cx="60" cy="75" rx="8.8" ry="23.6" fill="none" stroke="#FFFFFF" stroke-width="3.1" stroke-opacity="0.9"/>
    <circle cx="69.4" cy="66.9" r="4.5" fill="url(#accent)" stroke="#FFFFFF" stroke-width="1.9"/>
    <path d="M60 20.1 90 33 60 45.9 30 33Z" fill="#FFFFFF"/>
    <circle cx="60" cy="33" r="3.1" fill="url(#accent)"/>
    <path d="M90 33c3.6 1.9 4.5 6.4 3.2 11.4" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
    <circle cx="93.2" cy="47.1" r="3.6" fill="url(#accent)"/>
    <path d="M94.3 7.3 97.3 14.1 104.1 17.1 97.3 20.1 94.3 27 91.3 20.1 84.4 17.1 91.3 14.1Z" fill="url(#spark)"/>
    <path d="M105.9 26.6 107.1 30 110.6 31.3 107.1 32.6 105.9 36 104.6 32.6 101.1 31.3 104.6 30Z" fill="url(#spark)" fill-opacity="0.9"/>
  </g>

  <!-- Wordmark -->
  <text x="180" y="92" font-family="${FONT}" font-size="44" font-weight="800" fill="#FFFFFF" letter-spacing="-1">ProfAI</text>
  <text x="182" y="124" font-family="${FONT}" font-size="20" font-weight="600" fill="#FFE2DC" letter-spacing="0.5">AI Tutor for IELTS &amp; SAT</text>

  <!-- Headline -->
  <text x="64" y="248" font-family="${FONT}" font-size="66" font-weight="800" fill="url(#headline)" letter-spacing="-1.6">Master IELTS &amp; SAT with</text>
  <text x="64" y="322" font-family="${FONT}" font-size="66" font-weight="800" fill="url(#headline)" letter-spacing="-1.6">your personal AI tutor</text>

  <!-- Subtext -->
  <text x="66" y="368" font-family="${FONT}" font-size="25" font-weight="500" fill="#FFEDE9">Real exam practice · instant AI feedback · a roadmap to your target score</text>

  <!-- Feature chips -->
  ${buildChips({ startX: 64, startY: 410, maxX: 1136 })}

  <!-- Footer -->
  <g transform="translate(64 588)">
    <circle cx="8" cy="-4" r="8" fill="#FFFFFF" fill-opacity="0.9"/>
    <text x="26" y="3" font-family="${FONT}" font-size="23" font-weight="700" fill="#FFFFFF">profai.up.railway.app</text>
  </g>
  <text x="1136" y="591" text-anchor="end" font-family="${FONT}" font-size="20" font-weight="600" fill="#FFE2DC">Used by learners worldwide 🌍</text>
</svg>`

mkdirSync(resolve(__dirname, '../public'), { recursive: true })
const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
  font: { loadSystemFonts: true },
  background: '#DC2626',
})
const png = resvg.render().asPng()
writeFileSync(OUT, png)
console.log('Wrote', OUT, `(${(png.length / 1024).toFixed(1)} KB)`)
