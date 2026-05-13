import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, AudioLines, CheckCircle2, Clock3, Copy, Ear, Headphones, Mic, MicOff, RefreshCcw, Search, ShieldCheck, Users, Volume2, Wifi } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useMotionPreferences } from '@/hooks/useMotionPreferences'

type SpeakingPart = 1 | 2 | 3

type VoiceRoom = {
  id: string
  name: string
  part: SpeakingPart
  level: 'beginner' | 'intermediate' | 'advanced'
  queue: number
  activePairs: number
}

type LivePartner = {
  id: string
  name: string
  level: VoiceRoom['level']
  country: string
  accentFocus: string
}

const partTimers: Record<SpeakingPart, number> = {
  1: 5 * 60,
  2: 2 * 60,
  3: 6 * 60,
}

const speakingPrompts: Record<SpeakingPart, string[]> = {
  1: [
    'Describe your daily study routine and how you manage distractions.',
    'What kind of books or podcasts do you usually use for English improvement?',
    'Do you prefer studying alone or with a partner? Why?',
    'What is the most difficult part of preparing for IELTS speaking?',
  ],
  2: [
    'Describe a skill you learned recently that improved your confidence.',
    'Describe a memorable conversation you had in English.',
    'Describe a place that helps you focus and study effectively.',
    'Describe a challenge you faced and how you solved it.',
  ],
  3: [
    'How can schools improve students speaking confidence in real life?',
    'Is technology making communication better or weaker? Explain with examples.',
    'Should language exams test communication more than grammar accuracy?',
    'How important is pronunciation compared to vocabulary range?',
  ],
}

const voiceRooms: VoiceRoom[] = [
  { id: 'room-a', name: 'Fluency Room A', part: 1, level: 'beginner', queue: 2, activePairs: 4 },
  { id: 'room-b', name: 'Cue Card Room', part: 2, level: 'intermediate', queue: 3, activePairs: 3 },
  { id: 'room-c', name: 'Discussion Room', part: 3, level: 'advanced', queue: 1, activePairs: 5 },
  { id: 'room-d', name: 'Mixed Rotation', part: 1, level: 'intermediate', queue: 4, activePairs: 6 },
] as const

const livePartners: LivePartner[] = [
  { id: 'lp-1', name: 'Noah', level: 'beginner', country: 'Turkey', accentFocus: 'fluency basics' },
  { id: 'lp-2', name: 'Aisha', level: 'intermediate', country: 'UAE', accentFocus: 'Part 2 coherence' },
  { id: 'lp-3', name: 'Mateo', level: 'advanced', country: 'Spain', accentFocus: 'Part 3 argument depth' },
  { id: 'lp-4', name: 'Lina', level: 'intermediate', country: 'Uzbekistan', accentFocus: 'linking and stress' },
  { id: 'lp-5', name: 'Kenji', level: 'advanced', country: 'Japan', accentFocus: 'pronunciation precision' },
] as const

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function ToggleRow({
  label,
  detail,
  enabled,
  onToggle,
}: {
  label: string
  detail: string
  enabled: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-start justify-between gap-3 rounded-xl border border-red-200 bg-white/90 px-3 py-2.5 text-left"
    >
      <div>
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        <p className="mt-0.5 text-xs leading-5 text-slate-600">{detail}</p>
      </div>
      <span
        className={`mt-0.5 inline-flex h-6 min-w-[2.7rem] items-center rounded-full border px-1 transition ${
          enabled ? 'justify-end border-red-300 bg-red-100' : 'justify-start border-slate-300 bg-slate-100'
        }`}
      >
        <span className="h-4 w-4 rounded-full bg-white shadow-sm" />
      </span>
    </button>
  )
}

export default function SpeakingCommunity() {
  const navigate = useNavigate()
  const { allowHoverMotion, minimalMotion } = useMotionPreferences()
  const matchingTimeoutRef = useRef<number | null>(null)

  const [selectedPart, setSelectedPart] = useState<SpeakingPart>(1)
  const [promptIndex, setPromptIndex] = useState(0)
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null)
  const [timerRunning, setTimerRunning] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(partTimers[1])
  const [micEnabled, setMicEnabled] = useState(true)
  const [pushToTalk, setPushToTalk] = useState(true)
  const [noiseSuppression, setNoiseSuppression] = useState(true)
  const [echoCancellation, setEchoCancellation] = useState(true)
  const [transcriptionHints, setTranscriptionHints] = useState(false)
  const [micState, setMicState] = useState<'idle' | 'testing' | 'ready' | 'blocked'>('idle')
  const [micMessage, setMicMessage] = useState('Microphone not tested yet.')
  const [matchStatus, setMatchStatus] = useState<'idle' | 'searching' | 'matched'>('idle')
  const [queueSeconds, setQueueSeconds] = useState(0)
  const [matchedPartner, setMatchedPartner] = useState<LivePartner | null>(null)
  const [joinHint, setJoinHint] = useState('Choose a room, pass mic check, and start partner search.')
  const [sessionLink, setSessionLink] = useState('')

  const prompts = speakingPrompts[selectedPart]
  const currentPrompt = prompts[promptIndex] ?? prompts[0]
  const filteredRooms = useMemo(() => voiceRooms.filter((room) => room.part === selectedPart), [selectedPart])

  useEffect(() => {
    if (matchingTimeoutRef.current) {
      window.clearTimeout(matchingTimeoutRef.current)
      matchingTimeoutRef.current = null
    }
    setPromptIndex(0)
    setSecondsLeft(partTimers[selectedPart])
    setTimerRunning(false)
    setActiveRoomId(null)
    setMatchStatus('idle')
    setMatchedPartner(null)
    setSessionLink('')
    setQueueSeconds(0)
  }, [selectedPart])

  useEffect(() => {
    if (!timerRunning) return
    if (secondsLeft <= 0) {
      setTimerRunning(false)
      return
    }

    const intervalId = window.setInterval(() => {
      setSecondsLeft((previous) => Math.max(0, previous - 1))
    }, 1000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [secondsLeft, timerRunning])

  useEffect(() => {
    return () => {
      if (matchingTimeoutRef.current) {
        window.clearTimeout(matchingTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (matchStatus !== 'searching') return

    const intervalId = window.setInterval(() => {
      setQueueSeconds((prev) => prev + 1)
    }, 1000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [matchStatus])

  const testMicrophone = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setMicState('blocked')
      setMicMessage('Audio device API is not available in this browser.')
      return
    }

    setMicState('testing')
    setMicMessage('Testing microphone access...')

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      stream.getTracks().forEach((track) => track.stop())
      setMicState('ready')
      setMicMessage('Microphone is ready. Voice-only mode confirmed.')
    } catch {
      setMicState('blocked')
      setMicMessage('Microphone permission denied. Please allow audio access and retry.')
    }
  }

  const rotatePrompt = () => {
    setPromptIndex((previous) => (previous + 1) % prompts.length)
  }

  const activeRoom = voiceRooms.find((room) => room.id === activeRoomId) ?? null

  const startPartnerSearch = () => {
    if (!activeRoom) {
      setJoinHint('Choose a room first to start matching.')
      return
    }

    if (micState !== 'ready') {
      setJoinHint('Run microphone test first. Matchmaking unlocks after mic check.')
      return
    }

    setMatchStatus('searching')
    setQueueSeconds(0)
    setMatchedPartner(null)
    setSessionLink('')
    setJoinHint('Searching live queue for a compatible speaking partner...')

    const matchingDelay = 1800 + Math.round(Math.random() * 1400)
    if (matchingTimeoutRef.current) {
      window.clearTimeout(matchingTimeoutRef.current)
    }
    matchingTimeoutRef.current = window.setTimeout(() => {
      const candidates = livePartners.filter((partner) => partner.level === activeRoom.level)
      const fallbackPool = candidates.length > 0 ? candidates : livePartners
      const partner = fallbackPool[Math.floor(Math.random() * fallbackPool.length)]
      const roomSlug = activeRoom.id
      const token = `${roomSlug}-${partner.id}-${Date.now()}`
      const url = `${window.location.origin}/speaking-community?session=${encodeURIComponent(token)}`

      setMatchedPartner(partner)
      setMatchStatus('matched')
      setSessionLink(url)
      setJoinHint(`Partner matched: ${partner.name} (${partner.country}). Open voice session now.`)
      matchingTimeoutRef.current = null
    }, matchingDelay)
  }

  const cancelPartnerSearch = () => {
    if (matchingTimeoutRef.current) {
      window.clearTimeout(matchingTimeoutRef.current)
      matchingTimeoutRef.current = null
    }
    setMatchStatus('idle')
    setQueueSeconds(0)
    setMatchedPartner(null)
    setSessionLink('')
    setJoinHint('Search cancelled. You can restart matchmaking anytime.')
  }

  const copySessionLink = async () => {
    if (!sessionLink) return
    try {
      await navigator.clipboard.writeText(sessionLink)
      setJoinHint('Session link copied. Share it with your partner or teacher.')
    } catch {
      setJoinHint('Copy failed in this browser. You can copy the link manually.')
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#fde8e8] via-[#fceaea] to-[#f9dede] px-4 py-8 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="ambient-mesh" />
        <div className="ambient-grid" />
        <div className="ambient-noise" />
        <div className="absolute -left-20 top-8 h-72 w-72 rounded-full bg-red-200/45 blur-3xl" />
        <div className="absolute -right-16 top-20 h-80 w-80 rounded-full bg-rose-200/35 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl space-y-6">
        <motion.section
          initial={minimalMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={minimalMotion ? { duration: 0.14 } : { duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          className="premium-hero p-6 sm:p-10"
        >
          <div className="relative grid gap-4 xl:grid-cols-[minmax(0,1fr)_25rem] xl:items-start">
            <div>
              <div className="premium-top-controls">
                <button
                  onClick={() => navigate('/tests')}
                  className="premium-back-btn"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to Test Library
                </button>
                <span className="premium-top-chip">
                  <AudioLines className="h-3.5 w-3.5" />
                  IELTS Speaking Community
                </span>
              </div>
              <h1 className="premium-section-title mt-4">
                Voice-Only <span className="arena-title-accent-red">Speaking Arena</span>
              </h1>
              <p className="premium-section-subtitle max-w-3xl">
                Partner-to-partner IELTS speaking practice with microphone-only communication, timer discipline, and part-based question flow.
              </p>
              <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-red-700">
                <Mic className="h-3.5 w-3.5" />
                Camera is disabled by design
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-3 xl:w-full">
              <div className="hero-metric-card interactive-lift">
                <p className="hero-metric-label">Live Rooms</p>
                <p className="hero-metric-value-sm">4</p>
                <p className="hero-metric-note">Voice channels</p>
              </div>
              <div className="hero-metric-card interactive-lift">
                <p className="hero-metric-label">Avg Wait</p>
                <p className="hero-metric-value-sm">00:45</p>
                <p className="hero-metric-note">Queue to pair</p>
              </div>
              <div className="hero-metric-card interactive-lift">
                <p className="hero-metric-label">Audio Mode</p>
                <p className="hero-metric-value-sm hero-metric-value-compact">Mic Only</p>
                <p className="hero-metric-note">No video stream</p>
              </div>
            </div>
          </div>
        </motion.section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <article className="surface-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="inline-flex items-center gap-2 text-xl font-semibold text-slate-900">
                  <Ear className="h-5 w-5 text-red-600" />
                  Speaking Parts
                </h2>
                <span className="soft-chip">IELTS part-based queue</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {[1, 2, 3].map((part) => {
                  const active = selectedPart === part
                  return (
                    <button
                      key={part}
                      onClick={() => setSelectedPart(part as SpeakingPart)}
                      className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                        active
                          ? 'border-red-300 bg-gradient-to-r from-red-600 to-red-500 text-white shadow-[0_8px_20px_rgba(220,38,38,0.28)]'
                          : 'border-red-200 bg-white text-slate-700 hover:border-red-300 hover:text-red-700'
                      }`}
                    >
                      Part {part}
                    </button>
                  )
                })}
              </div>
            </article>

            <article className="surface-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="inline-flex items-center gap-2 text-xl font-semibold text-slate-900">
                  <Headphones className="h-5 w-5 text-red-600" />
                  Current Prompt
                </h2>
                <button
                  onClick={rotatePrompt}
                  className="inline-flex items-center gap-1 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700"
                >
                  <RefreshCcw className="h-3.5 w-3.5" />
                  Next Prompt
                </button>
              </div>
              <p className="mt-3 rounded-2xl border border-red-100 bg-red-50/60 p-4 text-sm leading-7 text-slate-800">
                {currentPrompt}
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-red-100 bg-white/90 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-red-700">Timer</p>
                  <p className="mt-1 text-3xl font-black text-slate-900">{formatTime(secondsLeft)}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => setTimerRunning(true)}
                      className="arena-primary-btn px-4 py-2 text-sm"
                    >
                      Start
                    </button>
                    <button
                      onClick={() => setTimerRunning(false)}
                      className="arena-secondary-btn px-4 py-2 text-sm"
                    >
                      Pause
                    </button>
                    <button
                      onClick={() => {
                        setTimerRunning(false)
                        setSecondsLeft(partTimers[selectedPart])
                      }}
                      className="arena-secondary-btn px-4 py-2 text-sm"
                    >
                      Reset
                    </button>
                  </div>
                </div>
                <div className="rounded-2xl border border-red-100 bg-white/90 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-red-700">Guideline</p>
                  <ul className="mt-1 space-y-1 text-xs leading-5 text-slate-600">
                    <li>Answer directly in first 10 seconds.</li>
                    <li>Keep ideas structured: point, reason, example.</li>
                    <li>Do not over-pause longer than 3 seconds.</li>
                  </ul>
                </div>
              </div>
            </article>

            <article className="surface-card p-6">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Voice Rooms</h2>
                <span className="soft-chip">Part {selectedPart} rooms</span>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {filteredRooms.map((room) => {
                  const selected = activeRoomId === room.id
                  return (
                    <motion.button
                      key={room.id}
                      whileHover={allowHoverMotion ? { y: -2 } : undefined}
                      onClick={() => setActiveRoomId(room.id)}
                      className={`rounded-2xl border p-4 text-left ${
                        selected
                          ? 'border-red-300 bg-gradient-to-br from-red-50 to-rose-100/70'
                          : 'border-red-100 bg-white'
                      }`}
                    >
                      <p className="text-sm font-bold text-slate-900">{room.name}</p>
                      <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-red-700">{room.level}</p>
                      <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
                        <span>Queue: {room.queue}</span>
                        <span>Active pairs: {room.activePairs}</span>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </article>
          </div>

          <div className="space-y-6">
            <article className="surface-card p-6">
              <h2 className="inline-flex items-center gap-2 text-xl font-semibold text-slate-900">
                <ShieldCheck className="h-5 w-5 text-red-600" />
                Audio Controls
              </h2>
              <div className="mt-4 space-y-2.5">
                <ToggleRow
                  label="Push-to-talk"
                  detail="Reduces overlap and improves turn discipline."
                  enabled={pushToTalk}
                  onToggle={() => setPushToTalk((value) => !value)}
                />
                <ToggleRow
                  label="Noise suppression"
                  detail="Cuts background fan and room noise."
                  enabled={noiseSuppression}
                  onToggle={() => setNoiseSuppression((value) => !value)}
                />
                <ToggleRow
                  label="Echo cancellation"
                  detail="Prevents speaker loop and feedback noise."
                  enabled={echoCancellation}
                  onToggle={() => setEchoCancellation((value) => !value)}
                />
                <ToggleRow
                  label="Live transcript hints"
                  detail="Shows quick keyword hints, not full subtitles."
                  enabled={transcriptionHints}
                  onToggle={() => setTranscriptionHints((value) => !value)}
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => setMicEnabled((value) => !value)}
                  className={`${micEnabled ? 'arena-secondary-btn' : 'arena-primary-btn'} px-4 py-2 text-sm`}
                >
                  {micEnabled ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
                  {micEnabled ? 'Mute Mic' : 'Unmute Mic'}
                </button>
                <button
                  onClick={() => void testMicrophone()}
                  className="arena-primary-btn px-4 py-2 text-sm"
                >
                  <Volume2 className="mr-2 h-4 w-4" />
                  Test Microphone
                </button>
              </div>
              <p className="mt-3 text-xs text-slate-600">{micMessage}</p>
              {micState === 'ready' ? (
                <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Audio permission granted
                </p>
              ) : null}
            </article>

            <article className="surface-card p-6">
              <h2 className="inline-flex items-center gap-2 text-xl font-semibold text-slate-900">
                <Clock3 className="h-5 w-5 text-red-600" />
                Session Queue
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {activeRoom
                  ? `${activeRoom.name} selected. Estimated waiting time: ${Math.max(1, activeRoom.queue)} minute(s).`
                  : 'Select a room to join voice queue.'}
              </p>
              <div className="mt-4 rounded-2xl border border-red-100 bg-red-50/60 p-3">
                <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-red-700">
                  <Wifi className="h-3.5 w-3.5" />
                  Live Matchmaking
                </p>
                <p className="mt-1 text-xs leading-6 text-slate-600">{joinHint}</p>
                <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-red-700">
                  <Search className="h-3.5 w-3.5" />
                  Queue time: {formatTime(queueSeconds)}
                </p>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={startPartnerSearch}
                  disabled={matchStatus === 'searching'}
                  className="arena-primary-btn flex-1 justify-center px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-55"
                >
                  <Users className="mr-2 h-4 w-4" />
                  {matchStatus === 'searching' ? 'Searching...' : 'Find Partner'}
                </button>
                <button
                  onClick={cancelPartnerSearch}
                  className="arena-secondary-btn px-4 py-2 text-sm"
                >
                  Cancel
                </button>
              </div>

              {matchedPartner ? (
                <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50/75 p-3">
                  <p className="text-sm font-semibold text-emerald-900">
                    Matched with {matchedPartner.name} ({matchedPartner.country})
                  </p>
                  <p className="mt-1 text-xs text-emerald-800">
                    Level: {matchedPartner.level} | Focus: {matchedPartner.accentFocus}
                  </p>
                  {sessionLink ? (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <input
                        readOnly
                        value={sessionLink}
                        className="input h-9 flex-1 border-emerald-200 bg-white/90 text-xs"
                      />
                      <button
                        onClick={() => void copySessionLink()}
                        className="arena-secondary-btn h-9 px-3 py-1.5 text-xs"
                      >
                        <Copy className="mr-1.5 h-3.5 w-3.5" />
                        Copy Link
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : null}

              <p className="mt-2 text-xs text-slate-500">
                Match starts only after microphone check. Voice chat is audio-only; camera is disabled.
              </p>
            </article>
          </div>
        </section>
      </div>
    </div>
  )
}

