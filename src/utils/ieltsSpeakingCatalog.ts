// Speaking Day catalog (Day 1–30) + Full Mock catalog (1–20). Days cycle through
// Part 1 → Part 2 (cue card) → Part 3, then repeat from Part 1 — so Day 1 is Part
// 1, Day 2 is Part 2, Day 3 is Part 3, Day 4 is Part 1 again, and so on.
// Each Day pulls from the original IELTS bank, so when the bank grows the catalog
// grows automatically.

import {
  CUE_CARDS,
  PART1_TOPICS,
  PART3_THEMES,
  type Part1Topic,
  type Part2Card,
  type Part3Theme,
} from '@/data/ieltsSpeakingBank'

export type SpeakingPart = 1 | 2 | 3

export type SpeakingDayPart1 = {
  kind: 'part1'
  topic: Part1Topic
}

export type SpeakingDayPart2 = {
  kind: 'part2'
  card: Part2Card
}

export type SpeakingDayPart3 = {
  kind: 'part3'
  theme: Part3Theme
}

export type SpeakingDayContent = SpeakingDayPart1 | SpeakingDayPart2 | SpeakingDayPart3

export type SpeakingDayEntry = {
  id: string
  day: number
  part: SpeakingPart
  title: string
  subtitle: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  durationMinutes: number
  available: boolean
  premiumOnly: boolean
  content: SpeakingDayContent
}

export type SpeakingFullMockEntry = {
  id: string
  index: number
  title: string
  subtitle: string
  durationMinutes: number
  available: boolean
  premiumOnly: boolean
  /** One Part 1 topic + one Part 2 cue card + one Part 3 theme. */
  parts: {
    part1: Part1Topic
    part2: Part2Card
    part3: Part3Theme
  }
}

const TOTAL_DAYS = 30
const TOTAL_FULL_MOCKS = 20

/** Cycle position: 1 (Part 1), 2 (Part 2), or 3 (Part 3). */
export function partForDay(day: number): SpeakingPart {
  return (((day - 1) % 3) + 1) as SpeakingPart
}

/** Slot inside its own part-rotation (0-based): how many times we've seen this part already. */
function slotForDay(day: number): number {
  return Math.floor((day - 1) / 3)
}

function difficultyForDay(day: number): 'Easy' | 'Medium' | 'Hard' {
  if (day <= 10) return 'Easy'
  if (day <= 20) return 'Medium'
  return 'Hard'
}

function buildDayContent(day: number): SpeakingDayContent {
  const part = partForDay(day)
  const slot = slotForDay(day)
  if (part === 1) {
    return { kind: 'part1', topic: PART1_TOPICS[slot % PART1_TOPICS.length] }
  }
  if (part === 2) {
    return { kind: 'part2', card: CUE_CARDS[slot % CUE_CARDS.length] }
  }
  return { kind: 'part3', theme: PART3_THEMES[slot % PART3_THEMES.length] }
}

function dayTitle(day: number): string {
  return `Day ${day}`
}

function daySubtitle(content: SpeakingDayContent): string {
  if (content.kind === 'part1') return `Part 1 · ${content.topic.topic}`
  if (content.kind === 'part2') return `Part 2 · ${content.card.title.replace(/^Describe /, '')}`
  return `Part 3 · ${content.theme.theme}`
}

function dayDuration(part: SpeakingPart): number {
  if (part === 1) return 5
  if (part === 2) return 4
  return 8
}

export function getIeltsSpeakingDayCatalog(): SpeakingDayEntry[] {
  return Array.from({ length: TOTAL_DAYS }, (_, index) => {
    const day = index + 1
    const part = partForDay(day)
    const content = buildDayContent(day)
    return {
      id: `speaking-day-${day}`,
      day,
      part,
      title: dayTitle(day),
      subtitle: daySubtitle(content),
      difficulty: difficultyForDay(day),
      durationMinutes: dayDuration(part),
      available: true,
      premiumOnly: false,
      content,
    }
  })
}

export function getIeltsSpeakingFullMockCatalog(): SpeakingFullMockEntry[] {
  return Array.from({ length: TOTAL_FULL_MOCKS }, (_, index) => {
    const i = index + 1
    return {
      id: `speaking-full-${i}`,
      index: i,
      title: `Speaking Full Mock ${i}`,
      subtitle: 'Part 1 → 2 → 3 · graded by the AI examiner',
      durationMinutes: 14,
      available: true,
      premiumOnly: false,
      parts: {
        part1: PART1_TOPICS[(i - 1) % PART1_TOPICS.length],
        part2: CUE_CARDS[(i - 1) % CUE_CARDS.length],
        part3: PART3_THEMES[(i - 1) % PART3_THEMES.length],
      },
    }
  })
}

export function findIeltsSpeakingDay(id: string): SpeakingDayEntry | null {
  return getIeltsSpeakingDayCatalog().find((d) => d.id === id) ?? null
}

export function findIeltsSpeakingFullMock(id: string): SpeakingFullMockEntry | null {
  return getIeltsSpeakingFullMockCatalog().find((m) => m.id === id) ?? null
}
