import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, MessagesSquare, Mic, MicOff, PhoneOff, ThumbsDown, ThumbsUp, Users } from 'lucide-react'
import { useAuthStore, type AuthState } from '@/store/authStore'
import { createDebateTransport } from '@/lib/debateSignaling'
import { createDebateMesh, type DebateMeshState } from '@/lib/debateVoice'
import MicVisualizer from '@/components/speaking/MicVisualizer'

type Phase = 'setup' | 'searching' | 'in'

function getGuestId(): string {
  let id = localStorage.getItem('smarttest-guest-id')
  if (!id) {
    id = `guest-${Math.random().toString(36).slice(2, 10)}`
    localStorage.setItem('smarttest-guest-id', id)
  }
  return id
}

// "Debate" section — live group voice rooms of up to 5 speakers (WebRTC mesh).
export default function Debate() {
  const user = useAuthStore((state: AuthState) => state.user)

  const [phase, setPhase] = useState<Phase>('setup')
  const [muted, setMuted] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [mesh, setMesh] = useState<DebateMeshState>({ topic: '', peers: [] })

  const meshRef = useRef<ReturnType<typeof createDebateMesh> | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)

  const cleanup = useCallback(() => {
    meshRef.current?.leave()
    meshRef.current = null
    localStreamRef.current?.getTracks().forEach((t) => t.stop())
    localStreamRef.current = null
    setLocalStream(null)
    setMesh({ topic: '', peers: [] })
    setSeconds(0)
  }, [])

  useEffect(() => () => cleanup(), [cleanup])

  useEffect(() => {
    if (phase !== 'in') return
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => window.clearInterval(id)
  }, [phase])

  const join = useCallback(async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      localStreamRef.current = stream
      setLocalStream(stream)
    } catch {
      setError('Microphone access is required to join a debate. Please allow it and try again.')
      return
    }
    const identity = { userId: user?.id ?? getGuestId(), name: user?.nickname ?? user?.fullName ?? 'Guest Speaker' }
    const transport = createDebateTransport(identity)
    const controller = createDebateMesh({
      transport,
      localStream: localStreamRef.current,
      onChange: (state) => {
        setMesh(state)
        setPhase('in')
      },
      onError: (msg) => setError(msg),
    })
    meshRef.current = controller
    setPhase('searching')
    controller.start()
  }, [user])

  const toggleMute = useCallback(() => {
    const next = !muted
    setMuted(next)
    localStreamRef.current?.getAudioTracks().forEach((t) => (t.enabled = !next))
  }, [muted])

  const leave = useCallback(() => {
    cleanup()
    setPhase('setup')
  }, [cleanup])

  // ── Setup ─────────────────────────────────────────────────────────────────
  if (phase === 'setup') {
    return (
      <div className="surface-card p-6 sm:p-10">
        <audio className="hidden" />
        <div className="flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-rose-600 text-white shadow-[0_12px_24px_rgba(220,38,38,0.28)]">
            <MessagesSquare className="h-6 w-6" />
          </span>
          <div>
            <h2 className="text-2xl font-black text-slate-900">Group Debate</h2>
            <p className="text-xs font-semibold uppercase tracking-wide text-red-600">Up to 5 speakers · voice only</p>
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
          Join a live voice debate with up to four other learners. You’ll be dropped into a room with a motion to argue —
          rooms fill automatically, and when someone leaves, the next person waiting takes their place. No chat, just
          speaking under friendly pressure.
        </p>
        {error ? <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        <button onClick={() => void join()} className="arena-primary-btn cta-sheen mt-6 px-6 py-3">
          <Users className="mr-2 h-5 w-5" /> Join a debate room
        </button>
        <p className="mt-3 text-xs text-slate-500">Tip: open this page in a few tabs and join from each to see a room fill up.</p>
      </div>
    )
  }

  // ── Searching ─────────────────────────────────────────────────────────────
  if (phase === 'searching') {
    return (
      <div className="surface-card flex flex-col items-center p-10 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-red-500" />
        <h2 className="mt-4 text-xl font-black text-slate-900">Finding a debate room…</h2>
        <p className="mt-1 text-sm text-slate-600">You’ll join the next room with a free seat.</p>
        <button onClick={leave} className="arena-secondary-btn mt-6">Cancel</button>
      </div>
    )
  }

  // ── In room ───────────────────────────────────────────────────────────────
  const everyone = mesh.peers.length + 1
  return (
    <div className="space-y-4">
      {/* Audio sinks for each peer */}
      {mesh.peers.map((p) => (
        <PeerAudio key={p.id} stream={p.stream} />
      ))}

      <div className="surface-card p-5 text-center">
        <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-red-600">
          <MessagesSquare className="h-4 w-4" /> Debate motion
        </p>
        <p className="mt-2 text-lg font-black leading-7 text-slate-900">“{mesh.topic || 'Loading motion…'}”</p>
        <div className="mt-3 flex items-center justify-center gap-3 text-xs font-semibold">
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700"><ThumbsUp className="h-3.5 w-3.5" /> Argue FOR</span>
          <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-red-700"><ThumbsDown className="h-3.5 w-3.5" /> Argue AGAINST</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <SpeakerTile name={user?.nickname ?? user?.fullName ?? 'You'} stream={localStream} active={!muted} you muted={muted} connected />
        {mesh.peers.map((p) => (
          <SpeakerTile key={p.id} name={p.name} stream={p.stream} active={p.connected} connected={p.connected} />
        ))}
        {Array.from({ length: Math.max(0, 5 - everyone) }).map((_, i) => (
          <div key={`empty-${i}`} className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-red-100 bg-white/40 p-4 text-center">
            <Users className="h-6 w-6 text-red-200" />
            <p className="mt-2 text-[11px] font-semibold text-slate-400">Waiting…</p>
          </div>
        ))}
      </div>

      <div className="surface-card flex items-center justify-between p-4">
        <span className="inline-flex items-center gap-2 text-sm font-bold text-slate-700">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
          Live · {everyone}/5 · {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
        </span>
        <div className="flex gap-2">
          <button onClick={toggleMute} className={`${muted ? 'arena-primary-btn' : 'arena-secondary-btn'} px-4 py-2 text-sm`}>
            {muted ? <MicOff className="mr-1.5 h-4 w-4" /> : <Mic className="mr-1.5 h-4 w-4" />}
            {muted ? 'Unmute' : 'Mute'}
          </button>
          <button onClick={leave} className="arena-primary-btn bg-gradient-to-r from-slate-800 to-slate-700 px-4 py-2 text-sm">
            <PhoneOff className="mr-1.5 h-4 w-4" /> Leave
          </button>
        </div>
      </div>
      {error ? <p className="text-center text-sm text-red-600">{error}</p> : null}
    </div>
  )
}

function SpeakerTile({
  name,
  stream,
  active,
  connected,
  you,
  muted,
}: {
  name: string
  stream: MediaStream | null
  active: boolean
  connected: boolean
  you?: boolean
  muted?: boolean
}) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="surface-card flex flex-col items-center p-4">
      <div className="relative">
        <div className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${you ? 'from-red-600 to-rose-600' : 'from-amber-500 to-orange-600'} text-lg font-black text-white`}>
          {name.slice(0, 1).toUpperCase()}
        </div>
        {muted ? (
          <span className="absolute -bottom-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-700 text-white">
            <MicOff className="h-3 w-3" />
          </span>
        ) : null}
      </div>
      <p className="mt-2 max-w-full truncate text-xs font-bold text-slate-900">{name}{you ? ' (You)' : ''}</p>
      {connected ? (
        <MicVisualizer stream={stream} active={active} bars={14} />
      ) : (
        <p className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400"><Loader2 className="h-3 w-3 animate-spin" /> connecting</p>
      )}
    </motion.div>
  )
}

function PeerAudio({ stream }: { stream: MediaStream | null }) {
  const ref = useRef<HTMLAudioElement | null>(null)
  useEffect(() => {
    if (ref.current && stream) {
      ref.current.srcObject = stream
      void ref.current.play().catch(() => {})
    }
  }, [stream])
  return <audio ref={ref} autoPlay className="hidden" />
}
