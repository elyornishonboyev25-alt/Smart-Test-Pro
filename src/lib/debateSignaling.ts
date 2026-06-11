// Signaling for group debate rooms. Same two-transport idea as the 1-1 partner
// layer: a BroadcastChannel transport for local cross-tab testing and a WebSocket
// transport for real cross-device rooms. Mesh role is simple — the member who joins
// LAST dials everyone already in the room, so no id comparison is needed.

export type DebateMember = { id: string; userId: string; name: string }

export type DebateEvent =
  | { type: 'room'; roomId: string; topic: string; members: DebateMember[] }
  | { type: 'peer_joined'; peer: DebateMember }
  | { type: 'peer_left'; peerId: string }
  | { type: 'signal'; from: string; data: unknown }
  | { type: 'error'; message: string }

export interface DebateTransport {
  join(): void
  sendSignal(to: string, data: unknown): void
  leave(): void
  on(listener: (event: DebateEvent) => void): void
  close(): void
}

const DEBATE_MOTIONS = [
  'Social media does more harm than good.',
  'University education should be free for everyone.',
  'Working from home is better than working in an office.',
  'Technology is making people less social.',
  'Online learning is as effective as classroom learning.',
  'A four-day working week should be the standard.',
]

// ── BroadcastChannel (local, cross-tab) ─────────────────────────────────────
type BCMsg =
  | { kind: 'hello'; from: string; userId: string; name: string }
  | { kind: 'here'; from: string; userId: string; name: string; to: string; topic: string }
  | { kind: 'signal'; from: string; to: string; data: unknown }
  | { kind: 'bye'; from: string }

export class BroadcastChannelDebateTransport implements DebateTransport {
  private channel: BroadcastChannel
  private selfId = `bd-${Math.random().toString(36).slice(2, 10)}`
  private identity: { userId: string; name: string }
  private listener: ((e: DebateEvent) => void) | null = null
  private phase: 'idle' | 'joining' | 'in' = 'idle'
  private members = new Map<string, DebateMember>()
  private topic = ''

  constructor(identity: { userId: string; name: string }) {
    this.identity = identity
    this.channel = new BroadcastChannel('smarttest-debate-signaling')
    this.channel.onmessage = (ev: MessageEvent<BCMsg>) => this.handle(ev.data)
  }

  join() {
    this.phase = 'joining'
    this.members.clear()
    this.topic = DEBATE_MOTIONS[Math.floor(Math.random() * DEBATE_MOTIONS.length)]
    this.post({ kind: 'hello', from: this.selfId, userId: this.identity.userId, name: this.identity.name })
    // Collect "here" replies briefly, then finalise the room.
    window.setTimeout(() => {
      if (this.phase !== 'joining') return
      this.phase = 'in'
      this.listener?.({
        type: 'room',
        roomId: 'local-room',
        topic: this.topic,
        members: [...this.members.values()],
      })
    }, 700)
  }

  private handle(msg: BCMsg) {
    if (!msg || (msg as { from?: string }).from === this.selfId) return

    if (msg.kind === 'hello') {
      if (this.phase === 'idle') return
      // Announce myself to the newcomer and adopt them as a peer (I'm the callee).
      this.post({ kind: 'here', from: this.selfId, userId: this.identity.userId, name: this.identity.name, to: msg.from, topic: this.topic })
      if (this.phase === 'in') {
        this.listener?.({ type: 'peer_joined', peer: { id: msg.from, userId: msg.userId, name: msg.name } })
      }
      return
    }

    if (msg.kind === 'here' && msg.to === this.selfId) {
      if (this.phase === 'joining') {
        this.topic = msg.topic || this.topic
        this.members.set(msg.from, { id: msg.from, userId: msg.userId, name: msg.name })
      } else if (this.phase === 'in') {
        this.listener?.({ type: 'peer_joined', peer: { id: msg.from, userId: msg.userId, name: msg.name } })
      }
      return
    }

    if (msg.kind === 'signal' && msg.to === this.selfId) {
      this.listener?.({ type: 'signal', from: msg.from, data: msg.data })
      return
    }

    if (msg.kind === 'bye') {
      this.listener?.({ type: 'peer_left', peerId: msg.from })
    }
  }

  sendSignal(to: string, data: unknown) {
    this.post({ kind: 'signal', from: this.selfId, to, data })
  }

  leave() {
    if (this.phase !== 'idle') this.post({ kind: 'bye', from: this.selfId })
    this.phase = 'idle'
    this.members.clear()
  }

  on(listener: (e: DebateEvent) => void) {
    this.listener = listener
  }

  close() {
    this.leave()
    try {
      this.channel.close()
    } catch {
      // ignore
    }
  }

  private post(msg: BCMsg) {
    this.channel.postMessage(msg)
  }
}

// ── WebSocket (production, cross-device) ────────────────────────────────────
export class WebSocketDebateTransport implements DebateTransport {
  private ws: WebSocket | null = null
  private url: string
  private identity: { userId: string; name: string }
  private listener: ((e: DebateEvent) => void) | null = null
  private joined = false
  private settled = false

  constructor(url: string, identity: { userId: string; name: string }) {
    this.url = url
    this.identity = identity
  }

  join() {
    this.joined = true
    if (this.ws) return
    let ws: WebSocket
    try {
      ws = new WebSocket(this.url)
    } catch {
      this.listener?.({ type: 'error', message: 'Could not reach the debate server.' })
      return
    }
    this.ws = ws
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'hello', userId: this.identity.userId, name: this.identity.name }))
      ws.send(JSON.stringify({ type: 'joinDebate' }))
    }
    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data)
        switch (msg.type) {
          case 'debateRoom':
            this.settled = true
            this.listener?.({ type: 'room', roomId: msg.roomId, topic: msg.topic, members: msg.members ?? [] })
            break
          case 'debatePeerJoined':
            this.listener?.({ type: 'peer_joined', peer: msg.peer })
            break
          case 'debatePeerLeft':
            this.listener?.({ type: 'peer_left', peerId: msg.peerId })
            break
          case 'debateSignal':
            this.listener?.({ type: 'signal', from: msg.from, data: msg.data })
            break
          default:
            break
        }
      } catch {
        // ignore malformed
      }
    }
    ws.onerror = () => {}
    ws.onclose = () => {
      const wasSettled = this.settled
      this.ws = null
      if (!wasSettled && this.joined) {
        this.listener?.({ type: 'error', message: 'Couldn’t reach the debate server. Please try again shortly.' })
      }
    }
  }

  sendSignal(to: string, data: unknown) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'debateSignal', to, data }))
    }
  }

  leave() {
    if (this.ws?.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify({ type: 'leaveDebate' }))
    this.joined = false
  }

  on(listener: (e: DebateEvent) => void) {
    this.listener = listener
  }

  close() {
    try {
      this.ws?.close()
    } catch {
      // ignore
    }
    this.ws = null
  }
}

export function createDebateTransport(identity: { userId: string; name: string }): DebateTransport {
  const explicit = (import.meta.env as Record<string, string | undefined>).VITE_SPEAKING_WS_URL
  if (explicit) return new WebSocketDebateTransport(explicit, identity)
  if (import.meta.env.PROD && typeof window !== 'undefined') {
    const scheme = window.location.protocol === 'https:' ? 'wss' : 'ws'
    return new WebSocketDebateTransport(`${scheme}://${window.location.host}/ws/speaking`, identity)
  }
  return new BroadcastChannelDebateTransport(identity)
}
