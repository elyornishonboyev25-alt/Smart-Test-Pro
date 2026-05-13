export type SubtitleCue = {
  start: number
  end: number
  text: string
}

function toSeconds(raw: string) {
  const cleaned = raw.trim().replace(',', '.')
  const [hh, mm, ss] = cleaned.split(':')
  const hours = Number(hh)
  const minutes = Number(mm)
  const seconds = Number(ss)

  if (!Number.isFinite(hours) || !Number.isFinite(minutes) || !Number.isFinite(seconds)) {
    return null
  }

  return (hours * 3600) + (minutes * 60) + seconds
}

export function parseSrtToCues(raw: string) {
  const blocks = raw.replace(/\r/g, '').trim().split('\n\n')
  const cues: SubtitleCue[] = []

  for (const block of blocks) {
    const lines = block.split('\n').map((line) => line.trim()).filter(Boolean)
    if (lines.length < 2) continue

    const timeLineIndex = lines[0].includes('-->') ? 0 : 1
    const timeLine = lines[timeLineIndex]
    if (!timeLine || !timeLine.includes('-->')) continue

    const [startRaw, endRaw] = timeLine.split('-->').map((part) => part.trim())
    const start = toSeconds(startRaw)
    const end = toSeconds(endRaw)
    if (start === null || end === null || end <= start) continue

    const text = lines
      .slice(timeLineIndex + 1)
      .join(' ')
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim()

    if (!text) continue
    cues.push({ start, end, text })
  }

  return cues
}

export function buildPracticeSegments(
  cues: SubtitleCue[],
  options?: {
    minDuration?: number
    maxDuration?: number
    minWords?: number
    maxSegments?: number
  },
) {
  const minDuration = options?.minDuration ?? 10
  const maxDuration = options?.maxDuration ?? 20
  const minWords = options?.minWords ?? 5
  const maxSegments = options?.maxSegments ?? 8

  const segments: SubtitleCue[] = []
  let i = 0

  while (i < cues.length && segments.length < maxSegments) {
    const start = cues[i].start
    let end = cues[i].end
    let text = cues[i].text
    let j = i + 1

    while (j < cues.length && end - start < minDuration) {
      const next = cues[j]
      if (next.start - end > 2.5) break

      end = next.end
      text = `${text} ${next.text}`
      j += 1
    }

    const duration = end - start
    const words = text.trim().split(/\s+/).length
    if (duration >= minDuration && duration <= maxDuration && words >= minWords) {
      segments.push({
        start,
        end,
        text: text.replace(/\s+/g, ' ').trim(),
      })
    }

    i = j
  }

  return segments
}

