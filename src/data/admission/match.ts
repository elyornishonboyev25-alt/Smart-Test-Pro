import type { University } from './types'
import { universities } from './universities'

// Profile-based university matching. The QS dataset only fully lists entry scores
// for the flagship (MIT); for the rest we estimate competitive requirements from
// the QS overall score (higher score → more selective). The result is a ranked,
// transparent "fit" with reach/match/safety classification and human reasons.

export type DegreeLevel = 'bachelor' | 'master' | 'phd'

export type MatchInput = {
  satTotal?: number | null // 400–1600
  ieltsOverall?: number | null // 0–9
  gpa?: number | null // 0–4
  fieldOfStudy?: string | null
  degreeLevel?: DegreeLevel
  budgetUsdPerYear?: number | null
  preferredCountry?: string | null
}

export type MatchClassification = 'reach' | 'match' | 'safety'

export type EstimatedRequirements = { sat: number; ielts: number; gpa: number; satExplicit: boolean; ieltsExplicit: boolean }

export type UniversityMatch = {
  university: University
  fitPercent: number
  classification: MatchClassification
  reasons: string[]
  requirements: EstimatedRequirements
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function parseFirstNumber(value: string): number | null {
  const match = value.match(/\d+(\.\d+)?/)
  return match ? Number(match[0]) : null
}

export function estimateRequirements(uni: University): EstimatedRequirements {
  const o = uni.overallScore
  let sat = Math.round(1380 + (o / 100) * 140) // ~1380–1520
  let ielts = Math.round((6.5 + (o / 100) * 1.0) * 2) / 2 // ~6.5–7.5, rounded to .5
  const gpa = Number((3.5 + (o / 100) * 0.5).toFixed(2)) // ~3.5–4.0
  let satExplicit = false
  let ieltsExplicit = false

  const bachelor = uni.admission?.bachelor ?? []
  for (const req of bachelor) {
    const label = req.label.toLowerCase()
    if (label.includes('sat')) {
      const n = parseFirstNumber(req.value)
      if (n && n >= 400) {
        sat = n
        satExplicit = true
      }
    }
    if (label.includes('ielts')) {
      const n = parseFirstNumber(req.value)
      if (n && n <= 9) {
        ielts = n
        ieltsExplicit = true
      }
    }
  }

  return { sat, ielts, gpa, satExplicit, ieltsExplicit }
}

function livingCost(uni: University): number | null {
  const c = uni.costOfLiving
  if (!c) return null
  return c.accommodation + c.food + c.transport + c.utilities
}

// metricScore: 0.5 means "meets requirement", 1 means "comfortably above",
// 0 means "well below". `spread` is how far above/below shifts the score fully.
function metricScore(user: number, req: number, spread: number) {
  return clamp(0.5 + (user - req) / (2 * spread), 0, 1)
}

export function scoreUniversity(uni: University, input: MatchInput): UniversityMatch {
  const req = estimateRequirements(uni)
  const reasons: string[] = []
  const scores: number[] = []

  if (typeof input.satTotal === 'number' && input.satTotal > 0) {
    const s = metricScore(input.satTotal, req.sat, 160)
    scores.push(s)
    const verb = input.satTotal >= req.sat ? 'meets' : input.satTotal >= req.sat - 80 ? 'is near' : 'is below'
    reasons.push(`SAT ${input.satTotal} ${verb} the ~${req.sat}${req.satExplicit ? '' : ' (est.)'} target`)
  }

  if (typeof input.ieltsOverall === 'number' && input.ieltsOverall > 0) {
    const s = metricScore(input.ieltsOverall, req.ielts, 1)
    scores.push(s)
    const verb = input.ieltsOverall >= req.ielts ? 'meets' : input.ieltsOverall >= req.ielts - 0.5 ? 'is near' : 'is below'
    reasons.push(`IELTS ${input.ieltsOverall.toFixed(1)} ${verb} the ~${req.ielts.toFixed(1)}${req.ieltsExplicit ? '' : ' (est.)'} target`)
  }

  if (typeof input.gpa === 'number' && input.gpa > 0) {
    const s = metricScore(input.gpa, req.gpa, 0.4)
    scores.push(s)
    const verb = input.gpa >= req.gpa ? 'meets' : input.gpa >= req.gpa - 0.2 ? 'is near' : 'is below'
    reasons.push(`GPA ${input.gpa.toFixed(2)} ${verb} the ~${req.gpa.toFixed(2)} (est.) target`)
  }

  let avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : clamp(0.5 + (50 - uni.rank) / 100, 0.2, 0.8)

  // Country preference
  if (input.preferredCountry) {
    if (uni.country === input.preferredCountry) {
      avg += 0.05
      reasons.push(`In your preferred country (${uni.country})`)
    } else {
      avg -= 0.04
    }
  }

  // Budget
  const cost = livingCost(uni)
  if (typeof input.budgetUsdPerYear === 'number' && input.budgetUsdPerYear > 0 && cost) {
    if (cost > input.budgetUsdPerYear) {
      avg -= 0.05
      reasons.push(`Living cost ~$${cost.toLocaleString('en-US')}/yr is above your budget`)
    } else {
      reasons.push(`Living cost ~$${cost.toLocaleString('en-US')}/yr fits your budget`)
    }
  }

  avg = clamp(avg, 0, 1)
  const classification: MatchClassification = avg >= 0.62 ? 'safety' : avg >= 0.42 ? 'match' : 'reach'

  if (scores.length === 0) {
    reasons.unshift('Add your scores for a precise fit — this is based on QS rank only')
  }

  return {
    university: uni,
    fitPercent: Math.round(avg * 100),
    classification,
    reasons,
    requirements: req,
  }
}

export function matchUniversities(input: MatchInput): UniversityMatch[] {
  return universities
    .map((uni) => scoreUniversity(uni, input))
    .sort((a, b) => b.fitPercent - a.fitPercent || a.university.rank - b.university.rank)
}
