// Strongest free transcript path: youtubei.js driven by a BotGuard proof-of-origin
// token (poToken) generated locally with bgutils-js + jsdom. The poToken defeats
// YouTube's "Sign in to confirm you're not a bot" wall, which makes video
// metadata + caption-track discovery reliable from a server, and lets us pull the
// caption text on servers where YouTube allows it. No API key and no cookie
// required. The token is cached and reused for hours.
import { Innertube } from 'youtubei.js'
import { BG } from 'bgutils-js'
import { JSDOM } from 'jsdom'

export type InnertubeCue = { start: number; end: number; text: string }

export type InnertubeResult = {
  title: string
  author: string | null
  durationSec: number
  thumbnailUrl: string | null
  hasEnglishCaptions: boolean
  captionKind: 'manual' | 'auto'
  language: string
  cues: InnertubeCue[]
}

// BotGuard needs a DOM. We install jsdom globals once; nothing else in the API
// touches window/document, so this is safe for the Node process.
let domReady = false
function ensureDom() {
  if (domReady) return
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', { url: 'https://www.youtube.com/' })
  Object.assign(globalThis, {
    window: dom.window,
    document: dom.window.document,
    location: dom.window.location,
    origin: dom.window.origin,
  })
  domReady = true
}

const POT_TTL_MS = 5 * 60 * 60 * 1000
let cached: { yt: Innertube; ts: number } | null = null
let inflight: Promise<Innertube | null> | null = null

async function generatePoToken(): Promise<{ pot: string; visitorData: string } | null> {
  try {
    const tmp = await Innertube.create({ retrieve_player: false })
    const visitorData = tmp.session.context.client.visitorData as string
    if (!visitorData) return null
    ensureDom()
    const bgConfig = {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => fetch(input, init),
      globalObj: globalThis,
      identifier: visitorData,
      requestKey: 'O43z0dpjhgX20SCx4KAo',
    }
    const challenge = await BG.Challenge.create(bgConfig as never)
    if (!challenge) return null
    const interpreter = challenge.interpreterJavascript?.privateDoNotAccessOrElseSafeScriptWrappedValue
    if (interpreter) {
      // Runs YouTube's own BotGuard VM to mint the token. eslint-disable-next-line @typescript-eslint/no-implied-eval
      new Function(interpreter)()
    }
    const result = await BG.PoToken.generate({
      program: challenge.program,
      globalName: challenge.globalName,
      bgConfig: bgConfig as never,
    })
    if (!result?.poToken) return null
    return { pot: result.poToken, visitorData }
  } catch {
    return null
  }
}

async function getClient(): Promise<Innertube | null> {
  if (cached && Date.now() - cached.ts < POT_TTL_MS) return cached.yt
  if (inflight) return inflight
  inflight = (async () => {
    try {
      const tokens = await generatePoToken()
      if (!tokens) return null
      const yt = await Innertube.create({ po_token: tokens.pot, visitor_data: tokens.visitorData })
      cached = { yt, ts: Date.now() }
      return yt
    } catch {
      return null
    } finally {
      inflight = null
    }
  })()
  return inflight
}

function decode(input: string): string {
  return input
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
}

function parseJson3(text: string): InnertubeCue[] {
  let json: any
  try {
    json = JSON.parse(text)
  } catch {
    return []
  }
  const events: any[] = json?.events ?? []
  const cues: InnertubeCue[] = []
  for (const ev of events) {
    if (!Array.isArray(ev?.segs)) continue
    const t = decode(ev.segs.map((s: any) => s?.utf8 ?? '').join(''))
    if (!t) continue
    const start = (ev.tStartMs ?? 0) / 1000
    const dur = (ev.dDurationMs ?? 0) / 1000
    cues.push({ start, end: start + (dur || 0), text: t })
  }
  return cues
}

function bestThumb(basic: any, videoId: string): string | null {
  const thumbs = basic?.thumbnail
  if (Array.isArray(thumbs) && thumbs.length) return thumbs[thumbs.length - 1]?.url ?? null
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
}

/** Returns reliable metadata + (where YouTube allows) the caption text, or null
 *  if the bot-token path is unavailable on this server. Never throws. */
export async function fetchViaInnertube(videoId: string): Promise<InnertubeResult | null> {
  const yt = await getClient()
  if (!yt) return null

  let info: any
  try {
    info = await yt.getInfo(videoId)
  } catch {
    cached = null // token may have expired; force a fresh one next time
    return null
  }

  const basic = info?.basic_info ?? {}
  const tracks: any[] = info?.captions?.caption_tracks ?? []
  const en =
    tracks.find((t) => /^en/i.test(t.language_code) && t.kind !== 'asr') ||
    tracks.find((t) => /^en/i.test(t.language_code))

  let cues: InnertubeCue[] = []
  let captionKind: 'manual' | 'auto' = 'auto'
  let language = 'en'

  if (en) {
    captionKind = en.kind === 'asr' ? 'auto' : 'manual'
    language = en.language_code || 'en'

    const sessionFetch =
      ((yt.session as any)?.http?.fetch_function as ((u: string, o?: RequestInit) => Promise<Response>) | undefined) ??
      ((u: string, o?: RequestInit) => fetch(u, o))

    for (const url of [`${en.base_url}&fmt=json3`, en.base_url as string]) {
      try {
        const res = await sessionFetch(url, { method: 'GET' })
        const txt = await res.text()
        if (txt && txt.length > 10) {
          const parsed = parseJson3(txt)
          if (parsed.length) {
            cues = parsed
            break
          }
        }
      } catch {
        // try the next URL form
      }
    }

    // Native transcript panel as a last resort.
    if (cues.length === 0) {
      try {
        const tr: any = await info.getTranscript()
        const segs: any[] = tr?.transcript?.content?.body?.initial_segments ?? []
        cues = segs
          .map((s) => {
            const start = Number(s.start_ms ?? 0) / 1000
            const end = Number(s.end_ms ?? 0) / 1000
            return { start, end: end || start + 2, text: decode(String(s.snippet?.text ?? '')) }
          })
          .filter((c) => c.text)
      } catch {
        // no transcript panel
      }
    }
  }

  return {
    title: basic.title ?? '',
    author: basic.author ?? basic.channel?.name ?? null,
    durationSec: Number(basic.duration ?? 0) || 0,
    thumbnailUrl: bestThumb(basic, videoId),
    hasEnglishCaptions: !!en,
    captionKind,
    language,
    cues,
  }
}
