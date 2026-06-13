import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Captions,
  CaptionsOff,
  Ear,
  Gauge,
  Headphones,
  Languages,
  ListMusic,
  Pause,
  Play,
  Repeat,
  RotateCcw,
  RotateCw,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { useMotionPreferences } from '@/hooks/useMotionPreferences'
import { PODCAST_EPISODES, getPodcastEpisode, type PodcastEpisode } from '@/data/podcasts'

/* ── Minimal YouTube IFrame API typings ─────────────────────────── */
type YTPlayer = {
  playVideo: () => void
  pauseVideo: () => void
  seekTo: (seconds: number, allowSeekAhead: boolean) => void
  getCurrentTime: () => number
  getDuration: () => number
  setPlaybackRate: (rate: number) => void
  setVolume: (volume: number) => void
  mute: () => void
  unMute: () => void
  loadModule: (module: string) => void
  unloadModule: (module: string) => void
  setOption: (module: string, option: string, value: unknown) => void
  destroy: () => void
}

type YTNamespace = {
  Player: new (
    el: HTMLElement | string,
    options: {
      videoId: string
      playerVars?: Record<string, unknown>
      events?: {
        onReady?: (event: { target: YTPlayer }) => void
        onStateChange?: (event: { data: number; target: YTPlayer }) => void
      }
    },
  ) => YTPlayer
  PlayerState: { PLAYING: number; PAUSED: number; ENDED: number; BUFFERING: number; CUED: number }
}

declare global {
  interface Window {
    YT?: YTNamespace
    onYouTubeIframeAPIReady?: () => void
  }
}

let ytApiPromise: Promise<void> | null = null

function loadYouTubeApi(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if (window.YT?.Player) return Promise.resolve()
  if (ytApiPromise) return ytApiPromise

  ytApiPromise = new Promise<void>((resolve) => {
    const previous = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      previous?.()
      resolve()
    }
    if (!document.getElementById('youtube-iframe-api')) {
      const tag = document.createElement('script')
      tag.id = 'youtube-iframe-api'
      tag.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(tag)
    }
  })
  return ytApiPromise
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const total = Math.floor(seconds)
  const mm = Math.floor(total / 60)
  const ss = total % 60
  return `${mm}:${ss.toString().padStart(2, '0')}`
}

const SPEEDS = [0.75, 1, 1.25, 1.5] as const

function levelBadge(level: PodcastEpisode['level']) {
  if (level === 'Beginner') return 'border-emerald-200 bg-emerald-50 text-emerald-700'
  if (level === 'Advanced') return 'border-rose-200 bg-rose-50 text-rose-700'
  return 'border-amber-200 bg-amber-50 text-amber-700'
}

const LISTEN_STEPS = [
  { icon: Ear, title: 'Listen once', detail: 'Play through and catch the gist — no captions yet.' },
  { icon: Captions, title: 'Turn on CC', detail: 'Replay with English captions and read along.' },
  { icon: Gauge, title: 'Slow it down', detail: 'Drop to 0.75× on fast or tricky sections.' },
  { icon: Repeat, title: 'Loop & repeat', detail: 'Set an A–B loop and replay until it’s clear.' },
]

export default function Podcast() {
  const navigate = useNavigate()
  const { minimalMotion } = useMotionPreferences()

  const episode = getPodcastEpisode()
  const playerRef = useRef<YTPlayer | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const pollRef = useRef<number | null>(null)

  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(episode.startSeconds)
  const [speed, setSpeed] = useState<number>(1)
  const [muted, setMuted] = useState(false)
  const [captionsOn, setCaptionsOn] = useState(true)
  const [loopA, setLoopA] = useState<number | null>(null)
  const [loopB, setLoopB] = useState<number | null>(null)

  const loopRef = useRef<{ a: number | null; b: number | null }>({ a: null, b: null })
  useEffect(() => {
    loopRef.current = { a: loopA, b: loopB }
  }, [loopA, loopB])

  // Build the player once the API + container are ready.
  useEffect(() => {
    let cancelled = false
    void loadYouTubeApi().then(() => {
      if (cancelled || !containerRef.current || !window.YT) return
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: episode.youtubeId,
        playerVars: {
          start: episode.startSeconds,
          autoplay: 0,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          cc_load_policy: 1,
          cc_lang_pref: 'en',
          iv_load_policy: 3,
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            if (cancelled) return
            setReady(true)
            setDuration(event.target.getDuration())
          },
          onStateChange: (event) => {
            const state = event.data
            const YTState = window.YT?.PlayerState
            if (!YTState) return
            setPlaying(state === YTState.PLAYING)
            if (state === YTState.PLAYING && duration === 0) {
              setDuration(event.target.getDuration())
            }
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
        // player already gone
      }
      playerRef.current = null
    }
    // Episode is fixed for this page instance; deps intentionally minimal.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episode.youtubeId, episode.startSeconds])

  // Poll current time + enforce A–B loop while playing.
  useEffect(() => {
    if (!ready) return
    if (pollRef.current) window.clearInterval(pollRef.current)
    pollRef.current = window.setInterval(() => {
      const player = playerRef.current
      if (!player) return
      const time = player.getCurrentTime()
      setCurrentTime(time)
      if (!duration) {
        const total = player.getDuration()
        if (total) setDuration(total)
      }
      const { a, b } = loopRef.current
      if (a !== null && b !== null && b > a && time >= b) {
        player.seekTo(a, true)
      }
    }, 250)

    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current)
    }
  }, [ready, duration])

  const togglePlay = useCallback(() => {
    const player = playerRef.current
    if (!player) return
    if (playing) player.pauseVideo()
    else player.playVideo()
  }, [playing])

  const seekTo = useCallback((seconds: number) => {
    const player = playerRef.current
    if (!player) return
    const clamped = Math.max(0, seconds)
    player.seekTo(clamped, true)
    setCurrentTime(clamped)
  }, [])

  const skip = useCallback(
    (delta: number) => {
      const player = playerRef.current
      if (!player) return
      seekTo(player.getCurrentTime() + delta)
    },
    [seekTo],
  )

  const changeSpeed = useCallback((rate: number) => {
    playerRef.current?.setPlaybackRate(rate)
    setSpeed(rate)
  }, [])

  const toggleMute = useCallback(() => {
    const player = playerRef.current
    if (!player) return
    if (muted) {
      player.unMute()
      player.setVolume(100)
    } else {
      player.mute()
    }
    setMuted((value) => !value)
  }, [muted])

  const toggleCaptions = useCallback(() => {
    const player = playerRef.current
    if (!player) return
    try {
      if (captionsOn) {
        player.unloadModule('captions')
        player.unloadModule('cc')
      } else {
        player.loadModule('captions')
        player.setOption('captions', 'track', { languageCode: 'en' })
      }
    } catch {
      // Caption module may not be available on every video; state still flips.
    }
    setCaptionsOn((value) => !value)
  }, [captionsOn])

  const setLoopPoint = useCallback(
    (point: 'a' | 'b') => {
      const time = Math.floor(currentTime)
      if (point === 'a') setLoopA(time)
      else setLoopB(time)
    },
    [currentTime],
  )

  const clearLoop = useCallback(() => {
    setLoopA(null)
    setLoopB(null)
  }, [])

  const progress = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0
  const loopActive = loopA !== null && loopB !== null && loopB > loopA

  const transcriptCues = episode.transcript ?? []
  const activeCueIndex = useMemo(() => {
    if (transcriptCues.length === 0) return -1
    return transcriptCues.findIndex((cue) => currentTime >= cue.start && currentTime < cue.end)
  }, [transcriptCues, currentTime])

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#eef2ff] via-[#eef4ff] to-[#e8eeff] px-4 py-8 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-6 h-80 w-80 rounded-full bg-indigo-300/30 blur-3xl" />
        <div className="absolute bottom-[-6rem] right-[-3rem] h-96 w-96 rounded-full bg-sky-300/25 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-violet-200/25 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl">
        {/* Hero */}
        <section className="overflow-hidden rounded-[1.9rem] border border-indigo-100 bg-white/85 p-6 shadow-[0_24px_56px_rgba(79,70,229,0.14)] backdrop-blur sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex min-h-[38px] items-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-indigo-700 transition hover:bg-indigo-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </button>
            <span className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-indigo-700">
              <Headphones className="h-3.5 w-3.5" />
              English Podcast · Listening
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Train your ear with <span className="bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent">English Podcasts</span>
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Real spoken English with subtitles, adjustable speed and loop-to-repeat — the fastest way to level up
                your IELTS &amp; everyday listening.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className={`rounded-full border px-3 py-1 text-xs font-bold ${levelBadge(episode.level)}`}>{episode.level}</span>
              <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs font-semibold text-indigo-700">
                <Languages className="h-3.5 w-3.5" />
                English captions
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                <ListMusic className="h-3.5 w-3.5" />
                {PODCAST_EPISODES.length} episode{PODCAST_EPISODES.length === 1 ? '' : 's'}
              </span>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.55fr_1fr]">
          {/* Player column */}
          <div>
            <div className="overflow-hidden rounded-[1.6rem] border border-slate-800/40 bg-slate-950 shadow-[0_30px_70px_rgba(15,23,42,0.4)]">
              {/* Video */}
              <div className="relative aspect-video w-full bg-black">
                <div ref={containerRef} className="absolute inset-0 h-full w-full" />
                {!ready ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
                    <div className="flex flex-col items-center gap-3 text-slate-300">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 text-white shadow-lg">
                        <Headphones className="h-6 w-6 animate-pulse" />
                      </span>
                      <p className="text-sm font-semibold">Loading player…</p>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Control bar */}
              <div className="space-y-3 bg-gradient-to-b from-slate-900 to-slate-950 p-4">
                {/* Seek bar */}
                <div className="flex items-center gap-3">
                  <span className="w-12 shrink-0 text-right font-mono text-xs text-slate-300">{formatTime(currentTime)}</span>
                  <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    step={0.1}
                    value={Math.min(currentTime, duration || 0)}
                    onChange={(event) => seekTo(Number(event.target.value))}
                    className="podcast-range h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-slate-700"
                    style={{ background: `linear-gradient(90deg,#6366F1 ${progress}%, #334155 ${progress}%)` }}
                    aria-label="Seek"
                  />
                  <span className="w-12 shrink-0 font-mono text-xs text-slate-400">{formatTime(duration)}</span>
                </div>

                {/* Transport */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => skip(-10)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-200 transition hover:bg-slate-700"
                      aria-label="Back 10 seconds"
                      title="Back 10s"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 text-white shadow-[0_12px_24px_rgba(79,70,229,0.45)] transition hover:brightness-110"
                      aria-label={playing ? 'Pause' : 'Play'}
                    >
                      {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 translate-x-0.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => skip(10)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-200 transition hover:bg-slate-700"
                      aria-label="Forward 10 seconds"
                      title="Forward 10s"
                    >
                      <RotateCw className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-200 transition hover:bg-slate-700"
                      aria-label={muted ? 'Unmute' : 'Mute'}
                    >
                      {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Captions */}
                    <button
                      type="button"
                      onClick={toggleCaptions}
                      className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition ${
                        captionsOn
                          ? 'border-indigo-400 bg-indigo-500/20 text-indigo-200'
                          : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                      aria-pressed={captionsOn}
                    >
                      {captionsOn ? <Captions className="h-4 w-4" /> : <CaptionsOff className="h-4 w-4" />}
                      CC
                    </button>

                    {/* Speed */}
                    <div className="inline-flex items-center gap-0.5 rounded-xl border border-slate-700 bg-slate-800 p-0.5">
                      {SPEEDS.map((rate) => (
                        <button
                          key={rate}
                          type="button"
                          onClick={() => changeSpeed(rate)}
                          className={`rounded-lg px-2 py-1.5 text-[11px] font-bold transition ${
                            speed === rate ? 'bg-gradient-to-r from-indigo-500 to-sky-500 text-white' : 'text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {rate}×
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* A–B loop */}
                <div className="flex flex-wrap items-center gap-2 border-t border-slate-800 pt-3">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    <Repeat className="h-3.5 w-3.5" />
                    A–B repeat
                  </span>
                  <button
                    type="button"
                    onClick={() => setLoopPoint('a')}
                    className={`rounded-lg border px-2.5 py-1.5 text-[11px] font-bold transition ${
                      loopA !== null ? 'border-indigo-400 bg-indigo-500/20 text-indigo-200' : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Set A {loopA !== null ? `· ${formatTime(loopA)}` : ''}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoopPoint('b')}
                    className={`rounded-lg border px-2.5 py-1.5 text-[11px] font-bold transition ${
                      loopB !== null ? 'border-indigo-400 bg-indigo-500/20 text-indigo-200' : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Set B {loopB !== null ? `· ${formatTime(loopB)}` : ''}
                  </button>
                  {loopActive ? (
                    <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-400/40 bg-emerald-500/15 px-2.5 py-1.5 text-[11px] font-bold text-emerald-300">
                      <Repeat className="h-3 w-3" />
                      Looping
                    </span>
                  ) : null}
                  {loopA !== null || loopB !== null ? (
                    <button
                      type="button"
                      onClick={clearLoop}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-[11px] font-bold text-slate-300 transition hover:bg-slate-700"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Clear
                    </button>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Episode meta */}
            <div className="mt-4 rounded-2xl border border-indigo-100 bg-white/90 p-5 shadow-[0_14px_30px_rgba(79,70,229,0.08)]">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${levelBadge(episode.level)}`}>
                  {episode.level}
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-600">
                  {episode.topic}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">Source: {episode.source}</span>
              </div>
              <h2 className="mt-2.5 text-xl font-black text-slate-900">{episode.title}</h2>
              <p className="mt-1.5 text-sm leading-6 text-slate-600">{episode.description}</p>
            </div>
          </div>

          {/* Side column: transcript + how-to + playlist */}
          <div className="space-y-6">
            {/* Transcript / captions */}
            <article className="rounded-2xl border border-indigo-100 bg-white/90 p-5 shadow-[0_14px_30px_rgba(79,70,229,0.08)]">
              <h3 className="inline-flex items-center gap-2 text-base font-black text-slate-900">
                <Captions className="h-4 w-4 text-indigo-600" />
                Transcript &amp; subtitles
              </h3>

              {transcriptCues.length > 0 ? (
                <div className="mt-3 max-h-[22rem] space-y-1.5 overflow-y-auto pr-1">
                  {transcriptCues.map((cue, index) => {
                    const active = index === activeCueIndex
                    return (
                      <button
                        key={`${cue.start}-${index}`}
                        type="button"
                        onClick={() => seekTo(cue.start)}
                        className={`block w-full rounded-xl border px-3 py-2 text-left text-sm leading-6 transition ${
                          active
                            ? 'border-indigo-300 bg-indigo-50 font-semibold text-indigo-900 shadow-sm'
                            : 'border-transparent text-slate-600 hover:border-indigo-100 hover:bg-indigo-50/50'
                        }`}
                      >
                        <span className="mr-2 font-mono text-[11px] text-indigo-400">{formatTime(cue.start)}</span>
                        {cue.text}
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="mt-3 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/50 p-4">
                  <p className="text-sm font-bold text-slate-700">Subtitles are on the player</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Use the <span className="font-bold text-indigo-700">CC</span> button on the player to show or hide
                    English captions while you listen. A click-to-jump transcript is added per episode over time.
                  </p>
                </div>
              )}
            </article>

            {/* How to use */}
            <article className="rounded-2xl border border-indigo-100 bg-white/90 p-5 shadow-[0_14px_30px_rgba(79,70,229,0.08)]">
              <h3 className="inline-flex items-center gap-2 text-base font-black text-slate-900">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                How to practise listening
              </h3>
              <div className="mt-3 space-y-2.5">
                {LISTEN_STEPS.map((step, index) => {
                  const Icon = step.icon
                  return (
                    <div key={step.title} className="flex items-start gap-3 rounded-xl border border-indigo-100 bg-indigo-50/40 p-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-sky-500 text-white">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          <span className="mr-1 text-indigo-500">{index + 1}.</span>
                          {step.title}
                        </p>
                        <p className="mt-0.5 text-xs leading-5 text-slate-500">{step.detail}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </article>

            {/* Playlist */}
            <article className="rounded-2xl border border-indigo-100 bg-white/90 p-5 shadow-[0_14px_30px_rgba(79,70,229,0.08)]">
              <h3 className="inline-flex items-center gap-2 text-base font-black text-slate-900">
                <ListMusic className="h-4 w-4 text-indigo-600" />
                Episodes
              </h3>
              <div className="mt-3 space-y-2">
                {PODCAST_EPISODES.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${
                      item.id === episode.id ? 'border-indigo-300 bg-indigo-50' : 'border-slate-100 bg-white'
                    }`}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-sky-500 text-white">
                      <Headphones className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900">{item.title}</p>
                      <p className="text-[11px] text-slate-500">{item.level} · {item.topic}</p>
                    </div>
                    {item.id === episode.id ? (
                      <span className="ml-auto rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white">Now</span>
                    ) : null}
                  </div>
                ))}
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-3 py-3 text-center text-xs font-medium text-slate-400">
                  More episodes coming soon
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  )
}
