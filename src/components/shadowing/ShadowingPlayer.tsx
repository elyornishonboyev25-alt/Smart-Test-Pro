import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  Captions,
  CheckCircle2,
  Eye,
  EyeOff,
  Gauge,
  Mic,
  Pause,
  Play,
  Repeat,
  RotateCcw,
  SkipBack,
  SkipForward,
  Sparkles,
  Square,
  Volume2,
} from 'lucide-react'
import { loadYouTubeApi, formatClock, type YTPlayer } from '@/lib/youtube'
import type { ShadowingVideoDetail } from '@/services/shadowing'

const SPEEDS = [0.5, 0.75, 1] as const
// Repeat target for the active line: how many times it loops before stopping /
// advancing. 0 means loop forever until the user moves on.
const REPEAT_OPTIONS: Array<{ value: number; label: string }> = [
  { value: 1, label: '×1' },
  { value: 2, label: '×2' },
  { value: 3, label: '×3' },
  { value: 0, label: 'Loop' },
]

function levelBadge(level: string) {
  if (level === 'Beginner') return 'border-emerald-200 bg-emerald-50 text-emerald-700'
  if (level === 'Advanced') return 'border-rose-200 bg-rose-50 text-rose-700'
  return 'border-amber-200 bg-amber-50 text-amber-700'
}

type Props = {
  video: ShadowingVideoDetail
  onBack: () => void
}

export default function ShadowingPlayer({ video, onBack }: Props) {
  const segments = video.segments
  const lastIndex = segments.length - 1

  const playerRef = useRef<YTPlayer | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const pollRef = useRef<number | null>(null)
  const lineRefs = useRef<Array<HTMLButtonElement | null>>([])

  const [ready, setReady] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState<number>(0.75)
  const [repeatTarget, setRepeatTarget] = useState<number>(2)
  const [autoAdvance, setAutoAdvance] = useState(true)
  const [blindMode, setBlindMode] = useState(false)
  const [completed, setCompleted] = useState<Set<number>>(new Set())
  const [currentRepeat, setCurrentRepeat] = useState(0)

  // Voice recording (kept in-memory only, per segment, for instant compare).
  const [recording, setRecording] = useState(false)
  const [recordError, setRecordError] = useState<string | null>(null)
  const [, setRecordingsVersion] = useState(0)
  const recordingsRef = useRef<Map<number, string>>(new Map())
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<BlobPart[]>([])

  // The poll loop reads the latest control values through this ref so it never
  // closes over stale state.
  const ctrl = useRef({ activeIndex: 0, repeatTarget: 2, autoAdvance: true, repeats: 0, segmentActive: false })
  useEffect(() => {
    ctrl.current.activeIndex = activeIndex
    ctrl.current.repeatTarget = repeatTarget
    ctrl.current.autoAdvance = autoAdvance
  }, [activeIndex, repeatTarget, autoAdvance])

  /* Build the player once. */
  useEffect(() => {
    let cancelled = false
    void loadYouTubeApi().then(() => {
      if (cancelled || !containerRef.current || !window.YT) return
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: video.youtubeId,
        playerVars: {
          start: Math.floor(segments[0]?.startSec ?? 0),
          autoplay: 0,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          cc_load_policy: 0,
          iv_load_policy: 3,
          playsinline: 1,
          disablekb: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            if (cancelled) return
            event.target.setPlaybackRate(0.75)
            setReady(true)
          },
          onStateChange: (event) => {
            const YTState = window.YT?.PlayerState
            if (!YTState) return
            setPlaying(event.data === YTState.PLAYING)
          },
        },
      })
    })

    return () => {
      cancelled = true
      if (pollRef.current) window.clearInterval(pollRef.current)
      try {
        playerRef.current?.destroy()
      } catch {
        /* already gone */
      }
      playerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video.youtubeId])

  const goToSegment = useCallback(
    (index: number, autoplay = true) => {
      const seg = segments[index]
      if (!seg || !playerRef.current) return
      ctrl.current.activeIndex = index
      ctrl.current.repeats = 0
      ctrl.current.segmentActive = autoplay
      setActiveIndex(index)
      setCurrentRepeat(0)
      playerRef.current.seekTo(seg.startSec, true)
      if (autoplay) playerRef.current.playVideo()
      else playerRef.current.pauseVideo()
    },
    [segments],
  )

  /* Poll playback + enforce per-segment looping / advancing. */
  useEffect(() => {
    if (!ready) return
    if (pollRef.current) window.clearInterval(pollRef.current)
    pollRef.current = window.setInterval(() => {
      const player = playerRef.current
      if (!player) return
      const c = ctrl.current
      if (!c.segmentActive) return
      const seg = segments[c.activeIndex]
      if (!seg) return
      const time = player.getCurrentTime()

      // Reached the end of the active line.
      if (time >= seg.endSec - 0.06) {
        const target = c.repeatTarget
        c.repeats += 1
        setCurrentRepeat(c.repeats)

        const shouldRepeat = target === 0 || c.repeats < target
        if (shouldRepeat) {
          player.seekTo(seg.startSec, true)
          return
        }

        // Done repeating this line.
        setCompleted((prev) => {
          const next = new Set(prev)
          next.add(c.activeIndex)
          return next
        })

        if (c.autoAdvance && c.activeIndex < segments.length - 1) {
          const nextIndex = c.activeIndex + 1
          const nextSeg = segments[nextIndex]
          c.activeIndex = nextIndex
          c.repeats = 0
          setActiveIndex(nextIndex)
          setCurrentRepeat(0)
          player.seekTo(nextSeg.startSec, true)
        } else {
          c.segmentActive = false
          player.pauseVideo()
        }
      } else if (time < seg.startSec - 0.4) {
        // Drifted before the line (manual seek) — snap back.
        player.seekTo(seg.startSec, true)
      }
    }, 180)

    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current)
    }
  }, [ready, segments])

  // Keep the active line scrolled into view.
  useEffect(() => {
    lineRefs.current[activeIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [activeIndex])

  const togglePlay = useCallback(() => {
    const player = playerRef.current
    if (!player) return
    if (playing) {
      ctrl.current.segmentActive = false
      player.pauseVideo()
    } else {
      // Resume shadowing the active line from its start.
      goToSegment(ctrl.current.activeIndex, true)
    }
  }, [playing, goToSegment])

  const replaySegment = useCallback(() => {
    goToSegment(ctrl.current.activeIndex, true)
  }, [goToSegment])

  const prevSegment = useCallback(() => {
    goToSegment(Math.max(0, ctrl.current.activeIndex - 1), true)
  }, [goToSegment])

  const nextSegment = useCallback(() => {
    goToSegment(Math.min(lastIndex, ctrl.current.activeIndex + 1), true)
  }, [goToSegment, lastIndex])

  const changeSpeed = useCallback((rate: number) => {
    playerRef.current?.setPlaybackRate(rate)
    setSpeed(rate)
  }, [])

  /* ── Voice recording ─────────────────────────────────────────────── */
  const stopStream = useCallback(() => {
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop())
    mediaStreamRef.current = null
  }, [])

  const startRecording = useCallback(async () => {
    setRecordError(null)
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setRecordError('Recording is not supported in this browser.')
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaStreamRef.current = stream
      chunksRef.current = []
      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder
      const index = ctrl.current.activeIndex
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' })
        const url = URL.createObjectURL(blob)
        const prev = recordingsRef.current.get(index)
        if (prev) URL.revokeObjectURL(prev)
        recordingsRef.current.set(index, url)
        setRecordingsVersion((v) => v + 1)
        stopStream()
      }
      recorder.start()
      setRecording(true)
    } catch {
      setRecordError('Microphone permission was blocked. Allow it to record.')
      stopStream()
    }
  }, [stopStream])

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop()
    setRecording(false)
  }, [])

  useEffect(() => {
    return () => {
      // Clean up any object URLs + the mic stream on unmount.
      recordingsRef.current.forEach((url) => URL.revokeObjectURL(url))
      recordingsRef.current.clear()
      try {
        mediaRecorderRef.current?.stop()
      } catch {
        /* ignore */
      }
      mediaStreamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  const activeRecording = recordingsRef.current.get(activeIndex) ?? null
  const progressPct = segments.length > 0 ? (completed.size / segments.length) * 100 : 0
  const activeSegment = segments[activeIndex]

  const repeatLabel = useMemo(() => {
    if (repeatTarget === 0) return 'Looping'
    return `${currentRepeat}/${repeatTarget}`
  }, [repeatTarget, currentRepeat])

  return (
    <div className="relative mx-auto w-full max-w-6xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button onClick={onBack} className="premium-back-btn-sm">
          <ArrowLeft className="h-3.5 w-3.5" />
          Library
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${levelBadge(video.level)}`}>
            {video.level}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-white px-3 py-1 text-[11px] font-semibold text-red-700">
            <Captions className="h-3.5 w-3.5" />
            {video.captionKind === 'manual' ? 'Subtitles' : 'Auto captions'}
          </span>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-600">
            {segments.length} lines
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1.55fr_1fr]">
        {/* Player + controls */}
        <div>
          <div className="overflow-hidden rounded-[1.6rem] border border-slate-800/40 bg-slate-950 shadow-[0_30px_70px_rgba(15,23,42,0.4)]">
            <div className="relative aspect-video w-full bg-black">
              <div ref={containerRef} className="absolute inset-0 h-full w-full" />
              {!ready ? (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
                  <div className="flex flex-col items-center gap-3 text-slate-300">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-rose-500 text-white shadow-lg">
                      <Play className="h-6 w-6 animate-pulse" />
                    </span>
                    <p className="text-sm font-semibold">Loading player…</p>
                  </div>
                </div>
              ) : null}

              {/* Karaoke-style active line overlay */}
              {ready && activeSegment ? (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-5 pb-4 pt-10">
                  <p className={`text-center text-base font-semibold leading-7 text-white drop-shadow sm:text-lg ${blindMode ? 'blur-md' : ''}`}>
                    {activeSegment.text}
                  </p>
                </div>
              ) : null}
            </div>

            {/* Control bar */}
            <div className="space-y-3 bg-gradient-to-b from-slate-900 to-slate-950 p-4">
              {/* Transport */}
              <div className="flex items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={prevSegment}
                  disabled={activeIndex === 0}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-200 transition hover:bg-slate-700 disabled:opacity-40"
                  aria-label="Previous line"
                >
                  <SkipBack className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={replaySegment}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-200 transition hover:bg-slate-700"
                  aria-label="Replay line"
                  title="Replay this line"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={togglePlay}
                  className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-rose-500 text-white shadow-[0_12px_24px_rgba(225,29,72,0.45)] transition hover:brightness-110"
                  aria-label={playing ? 'Pause' : 'Play line'}
                >
                  {playing ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7 translate-x-0.5" />}
                </button>
                <button
                  type="button"
                  onClick={nextSegment}
                  disabled={activeIndex === lastIndex}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-200 transition hover:bg-slate-700 disabled:opacity-40"
                  aria-label="Next line"
                >
                  <SkipForward className="h-4 w-4" />
                </button>
              </div>

              {/* Line counter + repeat status */}
              <div className="flex items-center justify-center gap-3 text-[11px] font-semibold text-slate-400">
                <span>
                  Line <span className="text-slate-100">{activeIndex + 1}</span> / {segments.length}
                </span>
                <span className="inline-flex items-center gap-1 text-rose-300">
                  <Repeat className="h-3 w-3" />
                  {repeatLabel}
                </span>
                <span className="font-mono">{formatClock(activeSegment?.startSec ?? 0)}</span>
              </div>

              {/* Settings row */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 pt-3">
                {/* Speed */}
                <div className="inline-flex items-center gap-1.5">
                  <Gauge className="h-3.5 w-3.5 text-slate-400" />
                  <div className="inline-flex items-center gap-0.5 rounded-xl border border-slate-700 bg-slate-800 p-0.5">
                    {SPEEDS.map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => changeSpeed(rate)}
                        className={`rounded-lg px-2 py-1 text-[11px] font-bold transition ${
                          speed === rate ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white' : 'text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {rate}×
                      </button>
                    ))}
                  </div>
                </div>

                {/* Repeat target */}
                <div className="inline-flex items-center gap-1.5">
                  <Repeat className="h-3.5 w-3.5 text-slate-400" />
                  <div className="inline-flex items-center gap-0.5 rounded-xl border border-slate-700 bg-slate-800 p-0.5">
                    {REPEAT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setRepeatTarget(opt.value)}
                        className={`rounded-lg px-2 py-1 text-[11px] font-bold transition ${
                          repeatTarget === opt.value ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white' : 'text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Auto-advance */}
                <button
                  type="button"
                  onClick={() => setAutoAdvance((v) => !v)}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[11px] font-bold transition ${
                    autoAdvance ? 'border-emerald-400/50 bg-emerald-500/15 text-emerald-300' : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                  aria-pressed={autoAdvance}
                >
                  <SkipForward className="h-3.5 w-3.5" />
                  Auto-next
                </button>

                {/* Blind mode */}
                <button
                  type="button"
                  onClick={() => setBlindMode((v) => !v)}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[11px] font-bold transition ${
                    blindMode ? 'border-red-400/60 bg-red-500/20 text-red-200' : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                  aria-pressed={blindMode}
                  title="Hide the text and shadow by ear"
                >
                  {blindMode ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  Blind
                </button>
              </div>

              {/* Record + compare */}
              <div className="flex flex-wrap items-center gap-2 border-t border-slate-800 pt-3">
                {!recording ? (
                  <button
                    type="button"
                    onClick={startRecording}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-400/60 bg-red-500/15 px-3 py-2 text-xs font-bold text-red-200 transition hover:bg-red-500/25"
                  >
                    <Mic className="h-4 w-4" />
                    Record yourself
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="inline-flex items-center gap-2 rounded-xl border border-rose-400 bg-rose-500/25 px-3 py-2 text-xs font-bold text-white transition hover:bg-rose-500/40"
                  >
                    <Square className="h-3.5 w-3.5 fill-current" />
                    Stop · recording…
                  </button>
                )}

                {activeRecording ? (
                  <div className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-2.5 py-1.5">
                    <Volume2 className="h-3.5 w-3.5 text-slate-300" />
                    <audio src={activeRecording} controls className="h-7 w-44" />
                  </div>
                ) : (
                  <span className="text-[11px] font-medium text-slate-500">Record this line, then play it back to compare.</span>
                )}
              </div>
              {recordError ? <p className="text-[11px] font-semibold text-rose-300">{recordError}</p> : null}
            </div>
          </div>

          {/* Meta */}
          <div className="mt-4 rounded-2xl border border-red-100 bg-white/90 p-5 shadow-[0_14px_30px_rgba(225,29,72,0.08)]">
            <h2 className="text-lg font-black text-slate-900">{video.title}</h2>
            {video.author ? <p className="mt-0.5 text-xs font-semibold text-slate-500">{video.author}</p> : null}
            <div className="mt-3">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                <span>Lines shadowed</span>
                <span>
                  {completed.size}/{segments.length}
                </span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-red-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-500 transition-[width] duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Script / segment list */}
        <div className="space-y-4">
          <article className="rounded-2xl border border-red-100 bg-white/90 p-5 shadow-[0_14px_30px_rgba(225,29,72,0.08)]">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="inline-flex items-center gap-2 text-base font-black text-slate-900">
                <Captions className="h-4 w-4 text-red-600" />
                Shadowing script
              </h3>
              <span className="text-[11px] font-semibold text-slate-400">Tap a line to jump</span>
            </div>
            <div className="max-h-[30rem] space-y-1.5 overflow-y-auto pr-1">
              {segments.map((seg, index) => {
                const active = index === activeIndex
                const done = completed.has(index)
                return (
                  <button
                    key={seg.id}
                    ref={(el) => {
                      lineRefs.current[index] = el
                    }}
                    type="button"
                    onClick={() => goToSegment(index, true)}
                    className={`flex w-full items-start gap-2.5 rounded-xl border px-3 py-2 text-left text-sm leading-6 transition ${
                      active
                        ? 'border-red-300 bg-red-50 font-semibold text-red-900 shadow-sm'
                        : 'border-transparent text-slate-600 hover:border-red-100 hover:bg-red-50/50'
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                        done ? 'bg-emerald-500 text-white' : active ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : index + 1}
                    </span>
                    <span className={blindMode && !active ? 'select-none blur-sm' : ''}>{seg.text}</span>
                  </button>
                )
              })}
            </div>
          </article>

          <article className="rounded-2xl border border-red-100 bg-white/90 p-5 shadow-[0_14px_30px_rgba(225,29,72,0.08)]">
            <h3 className="inline-flex items-center gap-2 text-base font-black text-slate-900">
              <Sparkles className="h-4 w-4 text-red-600" />
              How to shadow
            </h3>
            <ol className="mt-3 space-y-2 text-xs leading-5 text-slate-600">
              <li><span className="font-bold text-red-600">1.</span> Listen to the line once at <b>0.75×</b>.</li>
              <li><span className="font-bold text-red-600">2.</span> Repeat out loud <b>together</b> with the audio — copy the rhythm.</li>
              <li><span className="font-bold text-red-600">3.</span> Turn on <b>Blind</b> mode and shadow by ear.</li>
              <li><span className="font-bold text-red-600">4.</span> <b>Record</b> yourself and compare with the original.</li>
            </ol>
          </article>
        </div>
      </div>
    </div>
  )
}
