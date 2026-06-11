import { createVoiceConnection, type VoiceConnection } from '@/lib/webrtcVoice'
import type { DebateMember, DebateTransport } from '@/lib/debateSignaling'

// WebRTC mesh for a debate room: one peer connection per other member. The newest
// member dials everyone already present (isCaller=true via the 'room' event), while
// existing members answer the newcomer (isCaller=false via 'peer_joined'). Audio is
// fully peer-to-peer; the transport only relays SDP/ICE.

export type DebatePeerState = {
  id: string
  name: string
  userId: string
  stream: MediaStream | null
  connected: boolean
}

export type DebateMeshState = { topic: string; peers: DebatePeerState[] }

type PeerEntry = {
  member: DebateMember
  voice: VoiceConnection
  stream: MediaStream | null
  connected: boolean
}

export function createDebateMesh(opts: {
  transport: DebateTransport
  localStream: MediaStream
  onChange: (state: DebateMeshState) => void
  onError?: (message: string) => void
}) {
  const peers = new Map<string, PeerEntry>()
  const pending = new Map<string, unknown[]>()
  let topic = ''

  const emit = () => {
    opts.onChange({
      topic,
      peers: [...peers.values()].map((p) => ({
        id: p.member.id,
        name: p.member.name,
        userId: p.member.userId,
        stream: p.stream,
        connected: p.connected,
      })),
    })
  }

  const addPeer = (member: DebateMember, isCaller: boolean) => {
    if (peers.has(member.id)) return
    const entry: PeerEntry = { member, voice: null as unknown as VoiceConnection, stream: null, connected: false }
    const voice = createVoiceConnection({
      isCaller,
      sendSignal: (data) => opts.transport.sendSignal(member.id, data),
      onRemoteStream: (stream) => {
        entry.stream = stream
        emit()
      },
      onStateChange: (state) => {
        entry.connected = state === 'connected'
        emit()
      },
    })
    entry.voice = voice
    peers.set(member.id, entry)
    void voice.start(opts.localStream).then(() => {
      const buffered = pending.get(member.id)
      if (buffered) {
        pending.delete(member.id)
        buffered.forEach((data) => void voice.handleSignal(data))
      }
    })
    emit()
  }

  opts.transport.on((event) => {
    if (event.type === 'room') {
      topic = event.topic
      event.members.forEach((m) => addPeer(m, true))
      emit()
    } else if (event.type === 'peer_joined') {
      addPeer(event.peer, false)
    } else if (event.type === 'signal') {
      const peer = peers.get(event.from)
      if (peer) {
        void peer.voice.handleSignal(event.data)
      } else {
        const arr = pending.get(event.from) ?? []
        arr.push(event.data)
        pending.set(event.from, arr)
      }
    } else if (event.type === 'peer_left') {
      const peer = peers.get(event.peerId)
      peer?.voice.close()
      peers.delete(event.peerId)
      emit()
    } else if (event.type === 'error') {
      opts.onError?.(event.message)
    }
  })

  return {
    start: () => opts.transport.join(),
    leave: () => {
      opts.transport.leave()
      peers.forEach((p) => p.voice.close())
      peers.clear()
      pending.clear()
      opts.transport.close()
    },
  }
}
