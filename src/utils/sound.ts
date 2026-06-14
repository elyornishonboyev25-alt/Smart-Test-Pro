// Synthesized celebration sound via the Web Audio API — no audio files, so it adds
// nothing to the bundle and works offline. Honours a persisted mute preference.

const MUTE_KEY = 'smarttest-sound-muted'

export function isSoundMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === '1'
  } catch {
    return false
  }
}

export function setSoundMuted(muted: boolean): void {
  try {
    localStorage.setItem(MUTE_KEY, muted ? '1' : '0')
  } catch {
    // ignore — preference is best-effort
  }
}

let audioCtx: AudioContext | null = null

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  if (!audioCtx) {
    try {
      audioCtx = new Ctor()
    } catch {
      return null
    }
  }
  return audioCtx
}

/** A short, triumphant fanfare: rising triad arpeggio resolving into a bright chord. */
export function playAchievementFanfare(): void {
  if (isSoundMuted()) return
  const ctx = getContext()
  if (!ctx) return
  if (ctx.state === 'suspended') void ctx.resume().catch(() => {})

  const now = ctx.currentTime
  const master = ctx.createGain()
  master.gain.value = 0.5
  master.connect(ctx.destination)

  const playNote = (freq: number, start: number, duration: number, type: OscillatorType = 'triangle', peak = 0.3) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(peak, start + 0.03)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
    osc.connect(gain)
    gain.connect(master)
    osc.start(start)
    osc.stop(start + duration + 0.05)
  }

  // Rising arpeggio C5 E5 G5 C6
  const arp = [523.25, 659.25, 783.99, 1046.5]
  arp.forEach((freq, i) => playNote(freq, now + i * 0.11, 0.45))

  // Final sustained major chord
  const chordStart = now + arp.length * 0.11
  ;[523.25, 659.25, 783.99].forEach((freq) => playNote(freq, chordStart, 1.1, 'sine', 0.22))

  // High shimmer
  playNote(1568, chordStart + 0.04, 0.7, 'triangle', 0.12)
  playNote(2093, chordStart + 0.12, 0.6, 'sine', 0.08)
}
