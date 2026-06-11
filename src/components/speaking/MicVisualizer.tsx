import { useEffect, useRef, useState } from 'react'

// Live microphone activity bars driven by a real AnalyserNode. When `active` and a
// `stream` are provided it animates with the user's voice; otherwise it shows a calm
// idle state. Pure visual feedback so the speaker knows the mic is hearing them.

export default function MicVisualizer({
  stream,
  active,
  bars = 28,
}: {
  stream: MediaStream | null
  active: boolean
  bars?: number
}) {
  const [levels, setLevels] = useState<number[]>(() => Array.from({ length: bars }, () => 0.08))
  const rafRef = useRef<number | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)

  useEffect(() => {
    if (!active || !stream) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      setLevels(Array.from({ length: bars }, () => 0.08))
      return
    }

    const AudioCtx =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioCtx) return

    const ctx = new AudioCtx()
    audioCtxRef.current = ctx
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 64
    analyser.smoothingTimeConstant = 0.8
    analyserRef.current = analyser
    const source = ctx.createMediaStreamSource(stream)
    source.connect(analyser)
    sourceRef.current = source

    const data = new Uint8Array(analyser.frequencyBinCount)

    const tick = () => {
      analyser.getByteFrequencyData(data)
      const next: number[] = []
      for (let i = 0; i < bars; i++) {
        const idx = Math.floor((i / bars) * data.length)
        const v = data[idx] / 255
        next.push(Math.max(0.08, v))
      }
      setLevels(next)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      try {
        source.disconnect()
        analyser.disconnect()
      } catch {
        // ignore
      }
      void ctx.close().catch(() => {})
      audioCtxRef.current = null
    }
  }, [active, stream, bars])

  return (
    <div className="flex h-14 items-center justify-center gap-[3px]" aria-hidden>
      {levels.map((level, i) => (
        <span
          key={i}
          className={`w-[3px] rounded-full transition-[height,background-color] duration-75 ${
            active ? 'bg-gradient-to-t from-red-500 to-rose-400' : 'bg-slate-300'
          }`}
          style={{ height: `${Math.round(level * 100)}%`, minHeight: 4 }}
        />
      ))}
    </div>
  )
}
