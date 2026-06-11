// Thin wrappers around the free browser Speech APIs.
//  - Speech-to-Text via the Web Speech API (SpeechRecognition / webkitSpeechRecognition)
//  - Text-to-Speech via speechSynthesis
// Both are free, need no API key, and work in Chrome/Edge (desktop + Android).
// Where the API is missing (e.g. Firefox/iOS Safari STT) the UI falls back to typing.

import { useCallback, useEffect, useRef, useState } from 'react'

// ── Minimal typings (not in the default DOM lib) ────────────────────────────
interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}
interface SpeechRecognitionResult {
  readonly isFinal: boolean
  readonly length: number
  [index: number]: SpeechRecognitionAlternative
}
interface SpeechRecognitionResultList {
  readonly length: number
  [index: number]: SpeechRecognitionResult
}
interface SpeechRecognitionEventLike extends Event {
  readonly resultIndex: number
  readonly results: SpeechRecognitionResultList
}
interface SpeechRecognitionErrorEventLike extends Event {
  readonly error: string
}
interface SpeechRecognitionLike extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  start: () => void
  stop: () => void
  abort: () => void
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null
  onend: (() => void) | null
  onstart: (() => void) | null
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike

function getRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor
    webkitSpeechRecognition?: SpeechRecognitionCtor
  }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

export const isSpeechRecognitionSupported = (): boolean => getRecognitionCtor() !== null
export const isSpeechSynthesisSupported = (): boolean =>
  typeof window !== 'undefined' && 'speechSynthesis' in window

// ── Speech-to-Text hook ─────────────────────────────────────────────────────
export type UseSpeechRecognitionResult = {
  supported: boolean
  listening: boolean
  /** Words that are still being recognised (greyed-out preview). */
  interimTranscript: string
  /** Everything finalised so far in the current capture. */
  finalTranscript: string
  error: string | null
  start: () => void
  stop: () => void
  reset: () => void
}

export function useSpeechRecognition(lang = 'en-US'): UseSpeechRecognitionResult {
  const supported = isSpeechRecognitionSupported()
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  const finalRef = useRef('')
  // Set when the user asks to stop so the auto-restart loop knows to halt.
  const stoppingRef = useRef(false)

  const [listening, setListening] = useState(false)
  const [interimTranscript, setInterimTranscript] = useState('')
  const [finalTranscript, setFinalTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)

  const ensureRecognition = useCallback((): SpeechRecognitionLike | null => {
    if (!supported) return null
    if (recognitionRef.current) return recognitionRef.current

    const Ctor = getRecognitionCtor()
    if (!Ctor) return null
    const recognition = new Ctor()
    recognition.lang = lang
    recognition.continuous = true
    recognition.interimResults = true
    recognition.maxAlternatives = 1

    recognition.onresult = (event) => {
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const transcript = result[0]?.transcript ?? ''
        if (result.isFinal) {
          finalRef.current = `${finalRef.current} ${transcript}`.replace(/\s+/g, ' ').trim()
        } else {
          interim += transcript
        }
      }
      setFinalTranscript(finalRef.current)
      setInterimTranscript(interim)
    }

    recognition.onerror = (event) => {
      // "no-speech" / "aborted" are routine; surface only real problems.
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setError('Microphone permission was blocked. Allow audio access and try again.')
        stoppingRef.current = true
        setListening(false)
      } else if (event.error === 'audio-capture') {
        setError('No microphone was found. Connect one and try again.')
        stoppingRef.current = true
        setListening(false)
      }
    }

    recognition.onend = () => {
      // Chrome ends recognition every ~minute; restart unless the user stopped.
      if (!stoppingRef.current) {
        try {
          recognition.start()
          return
        } catch {
          // fall through to stopped state
        }
      }
      setListening(false)
      setInterimTranscript('')
    }

    recognitionRef.current = recognition
    return recognition
  }, [lang, supported])

  const start = useCallback(() => {
    const recognition = ensureRecognition()
    if (!recognition) {
      setError('Speech recognition is not supported in this browser. You can type your answer instead.')
      return
    }
    setError(null)
    stoppingRef.current = false
    finalRef.current = ''
    setFinalTranscript('')
    setInterimTranscript('')
    try {
      recognition.start()
      setListening(true)
    } catch {
      // start() throws if already running — treat as already listening.
      setListening(true)
    }
  }, [ensureRecognition])

  const stop = useCallback(() => {
    stoppingRef.current = true
    const recognition = recognitionRef.current
    if (recognition) {
      try {
        recognition.stop()
      } catch {
        // ignore
      }
    }
    setListening(false)
    setInterimTranscript('')
  }, [])

  const reset = useCallback(() => {
    finalRef.current = ''
    setFinalTranscript('')
    setInterimTranscript('')
    setError(null)
  }, [])

  useEffect(() => {
    return () => {
      stoppingRef.current = true
      const recognition = recognitionRef.current
      if (recognition) {
        try {
          recognition.abort()
        } catch {
          // ignore
        }
      }
    }
  }, [])

  return { supported, listening, interimTranscript, finalTranscript, error, start, stop, reset }
}

// ── Text-to-Speech ──────────────────────────────────────────────────────────
let cachedVoices: SpeechSynthesisVoice[] = []

function loadVoices(): SpeechSynthesisVoice[] {
  if (!isSpeechSynthesisSupported()) return []
  const voices = window.speechSynthesis.getVoices()
  if (voices.length > 0) cachedVoices = voices
  return cachedVoices
}

// Voices load asynchronously in some browsers — warm the cache early.
if (isSpeechSynthesisSupported()) {
  loadVoices()
  window.speechSynthesis.onvoiceschanged = () => loadVoices()
}

/** Prefer a natural English (UK first) voice for the examiner. */
export function getExaminerVoice(): SpeechSynthesisVoice | null {
  const voices = cachedVoices.length ? cachedVoices : loadVoices()
  if (voices.length === 0) return null
  const byName = (needles: string[]) =>
    voices.find((v) => needles.some((n) => v.name.toLowerCase().includes(n)))
  return (
    byName(['google uk english female', 'libby', 'sonia', 'hazel']) ??
    voices.find((v) => v.lang === 'en-GB') ??
    byName(['google us english', 'samantha', 'jenny', 'aria']) ??
    voices.find((v) => v.lang?.startsWith('en')) ??
    voices[0] ??
    null
  )
}

export type SpeakOptions = {
  onStart?: () => void
  onEnd?: () => void
  rate?: number
  pitch?: number
}

/** Speak `text` aloud. Cancels any in-flight utterance first. Returns a stop fn. */
export function speak(text: string, options: SpeakOptions = {}): () => void {
  if (!isSpeechSynthesisSupported() || !text.trim()) {
    options.onStart?.()
    options.onEnd?.()
    return () => {}
  }
  const synth = window.speechSynthesis
  synth.cancel()

  // Guard so onEnd fires exactly once, whether via onend, onerror or the watchdog.
  let finished = false
  let watchdog = 0
  const finish = () => {
    if (finished) return
    finished = true
    window.clearTimeout(watchdog)
    options.onEnd?.()
  }

  const utterance = new SpeechSynthesisUtterance(text)
  const voice = getExaminerVoice()
  if (voice) {
    utterance.voice = voice
    utterance.lang = voice.lang
  } else {
    utterance.lang = 'en-GB'
  }
  utterance.rate = options.rate ?? 0.96
  utterance.pitch = options.pitch ?? 1
  utterance.onstart = () => options.onStart?.()
  utterance.onend = finish
  utterance.onerror = finish

  // Watchdog: some environments (headless, missing audio device) never fire
  // onend. Estimate the spoken duration and finish anyway so the flow never stalls.
  const estimateMs = Math.min(22000, Math.max(3500, (text.length / 11) * 1000 + 1800))
  watchdog = window.setTimeout(finish, estimateMs)

  // Chrome occasionally needs a tick after cancel() before speak() takes.
  window.setTimeout(() => synth.speak(utterance), 60)

  return () => {
    finished = true
    window.clearTimeout(watchdog)
    synth.cancel()
  }
}

export function cancelSpeech(): void {
  if (isSpeechSynthesisSupported()) window.speechSynthesis.cancel()
}
