import type { Server } from 'http'
import { WebSocketServer, WebSocket } from 'ws'

// Live-partner matchmaking + WebRTC signaling relay.
// The server never touches audio — it only pairs two learners who are searching in
// the same bucket (`part:level`) and forwards their SDP/ICE messages to each other.
// Audio flows peer-to-peer over WebRTC. Attaches to the existing HTTP server so it
// shares the same origin/port (works behind Railway's TLS as wss://.../ws/speaking).

type Client = {
  id: string
  userId: string
  name: string
  ws: WebSocket
  bucket: string | null
  peer: Client | null
}

const waiting = new Map<string, Client[]>()

function genId() {
  return `c-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function send(client: Client, payload: unknown) {
  if (client.ws.readyState === WebSocket.OPEN) {
    client.ws.send(JSON.stringify(payload))
  }
}

function removeFromQueue(client: Client) {
  if (!client.bucket) return
  const list = waiting.get(client.bucket)
  if (!list) return
  const next = list.filter((c) => c.id !== client.id)
  if (next.length > 0) waiting.set(client.bucket, next)
  else waiting.delete(client.bucket)
}

function pair(a: Client, b: Client) {
  a.peer = b
  b.peer = a
  // `a` was already waiting → make it the caller (it initiates the WebRTC offer).
  send(a, { type: 'matched', isCaller: true, peerId: b.id, peerUserId: b.userId, peerName: b.name })
  send(b, { type: 'matched', isCaller: false, peerId: a.id, peerUserId: a.userId, peerName: a.name })
}

function enqueue(client: Client, part: number, level: string) {
  // Leaving any previous state first.
  removeFromQueue(client)
  unpair(client, false)

  const bucket = `${part}:${level}`
  client.bucket = bucket

  const list = waiting.get(bucket) ?? []
  // Find the first still-connected waiting peer that isn't this client.
  let match: Client | null = null
  while (list.length > 0) {
    const candidate = list.shift()!
    if (candidate.id !== client.id && candidate.ws.readyState === WebSocket.OPEN) {
      match = candidate
      break
    }
  }
  if (list.length > 0) waiting.set(bucket, list)
  else waiting.delete(bucket)

  if (match) {
    pair(match, client)
  } else {
    const current = waiting.get(bucket) ?? []
    current.push(client)
    waiting.set(bucket, current)
    send(client, { type: 'queued' })
  }
}

function unpair(client: Client, notify: boolean) {
  const peer = client.peer
  if (peer) {
    peer.peer = null
    if (notify) send(peer, { type: 'peer_left' })
  }
  client.peer = null
}

function attach(server: Server) {
  const wss = new WebSocketServer({ server, path: '/ws/speaking' })

  wss.on('connection', (ws: WebSocket) => {
    const client: Client = {
      id: genId(),
      userId: 'anon',
      name: 'Guest',
      ws,
      bucket: null,
      peer: null,
    }

    ws.on('message', (raw) => {
      let msg: { type?: string; userId?: string; name?: string; part?: number; level?: string; data?: unknown }
      try {
        msg = JSON.parse(raw.toString())
      } catch {
        return
      }

      switch (msg.type) {
        case 'hello':
          client.userId = typeof msg.userId === 'string' ? msg.userId.slice(0, 120) : 'anon'
          client.name = typeof msg.name === 'string' ? msg.name.slice(0, 80) : 'Guest'
          break
        case 'queue':
          if (typeof msg.part === 'number' && typeof msg.level === 'string') {
            enqueue(client, msg.part, msg.level.slice(0, 24))
          }
          break
        case 'signal':
          if (client.peer) send(client.peer, { type: 'signal', data: msg.data })
          break
        case 'leave':
          removeFromQueue(client)
          unpair(client, true)
          client.bucket = null
          break
        default:
          break
      }
    })

    ws.on('close', () => {
      removeFromQueue(client)
      unpair(client, true)
    })
    ws.on('error', () => {
      removeFromQueue(client)
      unpair(client, true)
    })
  })

  return wss
}

export const attachSpeakingSignaling = attach
