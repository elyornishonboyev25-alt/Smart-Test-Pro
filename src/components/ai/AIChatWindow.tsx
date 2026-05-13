import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Bot, Lock, Send, Sparkles, Trash2, X } from 'lucide-react'
import { apiClient } from '@/lib/apiClient'
import { useAuthStore, type AuthState } from '@/store/authStore'
import { useAiAssistantStore } from '@/store/aiAssistantStore'
import { hasPremiumAccess } from '@/utils/premiumAccess'
import type {
  AiChatRequest,
  AiChatResponse,
  AiContextMode,
  AiPreferences,
  ChatLocale,
  OpenTestMode,
  RouteTargetId,
  SpeakingPartMode,
} from '@/types/platform'

type ChatWindowVariant = 'floating' | 'panel' | 'analysis'

type AIChatWindowProps = {
  variant?: ChatWindowVariant
  onClose?: () => void
  contextMode?: AiContextMode
}

const ROUTE_TARGET_MAP: Record<RouteTargetId, string> = {
  DASHBOARD: '/dashboard',
  TEST_LIBRARY: '/tests',
  SAT_PREP: '/sat',
  IELTS_PREP: '/ielts',
  VOCABULARY: '/vocabulary',
  MOCK: '/mock',
  LEADERBOARD: '/leaderboard',
  AI_ANALYSIS: '/ai-coach',
  ACCOUNT: '/account',
}

const QUICK_CHIPS: Record<'default' | 'analysis', string[]> = {
  default: ['Open IELTS', 'Open SAT', 'Open Test Library', 'Study abroad checklist'],
  analysis: [
    'Open Reading Full Test 2',
    'Open Reading Full Test 2 Passage 2 for 20 min',
    'Open Listening Full Test 2 Part 3',
    'Show my weak IELTS track',
  ],
}

function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `msg-${Date.now()}-${Math.round(Math.random() * 1000)}`
}

function createMessage(role: 'user' | 'assistant', content: string) {
  return {
    id: createId(),
    role,
    content,
    createdAt: new Date().toISOString(),
  }
}

function containsAny(input: string, tokens: string[]) {
  return tokens.some((token) => input.includes(token))
}

function detectLocaleFromMessage(message: string, fallback: ChatLocale): ChatLocale {
  const normalized = message.toLowerCase()
  if (
    containsAny(normalized, [
      'salom',
      'rahmat',
      'iltimos',
      'ochib ber',
      'menga',
      'savol',
      'lugat',
      'imtihon',
      'yozing',
      'ochildi',
      'oquv',
      'gaplash',
    ])
  ) {
    return 'uz'
  }
  if (containsAny(normalized, ['hello', 'open', 'reading', 'listening', 'practice', 'exam'])) {
    return 'en'
  }
  return fallback
}

function resolveContextMode(pathname: string, search: string, forced?: AiContextMode): AiContextMode {
  if (forced) return forced
  if (pathname === '/ai-coach') return 'analysis'
  if (pathname.startsWith('/test/reading/')) {
    const mode = new URLSearchParams(search).get('mode')
    if (mode === 'simulation') return 'exam'
    return 'training_reading'
  }
  if (pathname.startsWith('/test/listening/')) {
    const mode = new URLSearchParams(search).get('mode')
    if (mode === 'full-test' || mode === 'simulation') return 'exam'
    return 'training_listening'
  }
  return 'general'
}

function buildRequestPayload(params: {
  message: string
  history: Array<{ role: 'user' | 'assistant'; content: string }>
  pathname: string
  locale: ChatLocale
  contextMode: AiContextMode
}): AiChatRequest {
  return {
    message: params.message,
    history: params.history,
    locale: params.locale,
    contextMode: params.contextMode,
    uiContext: { pathname: params.pathname },
  }
}

function resolveTestMode(mode: OpenTestMode): OpenTestMode {
  if (mode === 'simulation' || mode === 'practice' || mode === 'full-test') return mode
  return 'practice'
}

export function AIChatWindow({ variant = 'panel', onClose, contextMode }: AIChatWindowProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const user = useAuthStore((state: AuthState) => state.user)
  const hasPremium = hasPremiumAccess(user)
  const messages = useAiAssistantStore((state) => state.messages)
  const isSending = useAiAssistantStore((state) => state.isSending)
  const error = useAiAssistantStore((state) => state.error)
  const reportUpdatedAt = useAiAssistantStore((state) => state.reportUpdatedAt)
  const setSending = useAiAssistantStore((state) => state.setSending)
  const setError = useAiAssistantStore((state) => state.setError)
  const pushMessage = useAiAssistantStore((state) => state.pushMessage)
  const clearMessages = useAiAssistantStore((state) => state.clearMessages)

  const [draft, setDraft] = useState('')
  const [preferredLocale, setPreferredLocale] = useState<ChatLocale>('en')
  const [preferredName, setPreferredName] = useState<string | null>(null)

  const isFloating = variant === 'floating'
  const isAnalysis = variant === 'analysis'

  const welcomeMessage = useMemo(() => {
    const greeting = preferredName ? `Hi ${preferredName}. ` : 'Hi. '
    return createMessage(
      'assistant',
      preferredLocale === 'uz'
        ? `${greeting}SAT/IELTS bo'yicha yordam bera olaman: testlarni ochish, vocabulary, speaking feedback va study analytics.`
      : `${greeting}I can help with SAT/IELTS study, open tests, vocabulary, speaking feedback, and analytics.`,
    )
  }, [preferredLocale, preferredName])

  const showAnalysisHero = isAnalysis && messages.length === 0
  const viewMessages = showAnalysisHero ? [] : messages.length > 0 ? messages : [welcomeMessage]

  useEffect(() => {
    if (!user || !hasPremium) return
    let mounted = true

    void apiClient
      .get<AiPreferences>('/profile/ai-preferences')
      .then((preferences) => {
        if (!mounted) return
        const normalizedLocale = preferences.preferredLocale.toLowerCase().startsWith('uz') ? 'uz' : 'en'
        setPreferredLocale(normalizedLocale)
        if (preferences.preferredName) setPreferredName(preferences.preferredName)
      })
      .catch(() => {
        // Best-effort prefetch.
      })

    return () => {
      mounted = false
    }
  }, [hasPremium, user])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [viewMessages, isSending])

  const dispatchNavigationAction = (target: RouteTargetId) => {
    const path = ROUTE_TARGET_MAP[target]
    if (!path) return
    navigate(path)
  }

  const dispatchOpenTestAction = (payload: {
    track: 'reading' | 'listening'
    testId: string
    mode: OpenTestMode
    partIndex?: number
    durationMinutes?: number
  }) => {
    const params = new URLSearchParams()
    params.set('mode', resolveTestMode(payload.mode))
    if (payload.partIndex) params.set('part', String(payload.partIndex))
    if (payload.durationMinutes) params.set('minutes', String(payload.durationMinutes))
    params.set('source', 'ai')

    navigate(`/test/${payload.track}/${payload.testId}?${params.toString()}`, {
      state: {
        entry: 'ai-analysis',
        from: location.pathname,
      },
    })
  }

  const dispatchSpeakingModeAction = (payload: {
    mode: 'conversation' | 'mock'
    part?: SpeakingPartMode
    englishOnly: boolean
  }) => {
    const params = new URLSearchParams()
    params.set('panel', 'speaking')
    params.set('mode', payload.mode)
    if (payload.part) params.set('part', payload.part)
    if (payload.englishOnly) params.set('lang', 'en')
    params.set('source', 'ai')

    navigate(`/ai-coach?${params.toString()}`, {
      state: {
        entry: 'ai-speaking',
        from: location.pathname,
      },
    })
  }

  const sendMessage = async (rawText: string) => {
    const trimmed = rawText.trim()
    if (!trimmed || isSending) return

    setDraft('')
    setError(null)
    setSending(true)

    const userMessage = createMessage('user', trimmed)
    pushMessage(userMessage)

    const history = [...messages, userMessage]
      .filter((message) => message.role === 'user' || message.role === 'assistant')
      .slice(-12)
      .map((message) => ({
        role: message.role,
        content: message.content,
      }))

    const currentLocale = detectLocaleFromMessage(trimmed, preferredLocale)
    setPreferredLocale(currentLocale)
    const currentContextMode = resolveContextMode(location.pathname, location.search, contextMode)

    try {
      const payload = await apiClient.post<AiChatResponse>(
        '/profile/ai-chat',
        buildRequestPayload({
          message: trimmed,
          history,
          pathname: location.pathname,
          locale: currentLocale,
          contextMode: currentContextMode,
        }),
      )

      pushMessage(createMessage('assistant', payload.reply))

      for (const action of payload.actions) {
        if (action.type === 'navigate') {
          dispatchNavigationAction(action.target)
          continue
        }

        if (action.type === 'open_test') {
          dispatchOpenTestAction(action.payload)
          continue
        }

        if (action.type === 'speaking_mode') {
          dispatchSpeakingModeAction(action.payload)
        }
      }
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : 'Unable to process your request.'
      setError(message)
      pushMessage(
        createMessage(
          'assistant',
          preferredLocale === 'uz'
            ? "Hozir AI'ga ulanishda muammo bor. Qayta urinib ko'ring yoki testni ochish uchun aniq buyruq yuboring."
            : 'I could not reach the AI provider right now. Retry or ask me to open a test directly.',
        ),
      )
    } finally {
      setSending(false)
    }
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void sendMessage(draft)
  }

  if (!user) {
    return (
      <section
        className={`rounded-2xl border p-4 ${
          isFloating || isAnalysis
            ? 'border-slate-700 bg-slate-900 text-slate-100'
            : 'border-red-100 bg-white text-slate-900'
        }`}
      >
        <h3 className="text-sm font-semibold">AI Copilot</h3>
        <p className={`mt-1 text-xs ${isFloating || isAnalysis ? 'text-slate-300' : 'text-slate-600'}`}>
          Sign in to use AI Copilot.
        </p>
      </section>
    )
  }

  if (!hasPremium) {
    return (
      <section
        className={`rounded-2xl border p-4 ${
          isFloating || isAnalysis
            ? 'border-slate-700 bg-slate-900 text-slate-100'
            : 'border-red-100 bg-white text-slate-900'
        }`}
      >
        <div className="flex items-center gap-2">
          <Lock className={`h-4 w-4 ${isFloating || isAnalysis ? 'text-rose-300' : 'text-red-600'}`} />
          <h3 className="text-sm font-semibold">Premium AI Copilot</h3>
        </div>
        <p className={`mt-2 text-xs leading-5 ${isFloating || isAnalysis ? 'text-slate-300' : 'text-slate-600'}`}>
          AI chat is available for Premium users only.
        </p>
      </section>
    )
  }

  const quickChips = isAnalysis ? QUICK_CHIPS.analysis : QUICK_CHIPS.default

  return (
    <section
      className={`overflow-hidden rounded-2xl border ${
        isAnalysis
          ? 'border-slate-700/80 bg-[radial-gradient(circle_at_0%_0%,rgba(255,255,255,0.11),transparent_45%),linear-gradient(155deg,#06080f_0%,#0d111b_58%,#141926_100%)] text-slate-100 shadow-[0_34px_80px_rgba(2,6,23,0.62)]'
          : isFloating
            ? 'border-slate-700 bg-[radial-gradient(circle_at_8%_0%,rgba(248,113,113,0.22),transparent_48%),linear-gradient(155deg,#0b1020_0%,#101828_52%,#111827_100%)] text-slate-100 shadow-[0_18px_36px_rgba(2,6,23,0.45)]'
            : 'border-red-100 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.08)]'
      }`}
    >
      <header
        className={`flex items-center justify-between px-4 py-3 ${
          isAnalysis || isFloating ? 'border-b border-slate-700' : 'border-b border-red-100'
        }`}
      >
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex h-8 w-8 items-center justify-center rounded-xl ${
              isAnalysis || isFloating ? 'bg-rose-500/20 text-rose-200' : 'bg-red-50 text-red-700'
            }`}
          >
            <Bot className="h-4 w-4" />
          </span>
          <div>
            <p className={`${isAnalysis ? 'text-base font-semibold' : 'text-sm font-semibold'}`}>AI Copilot</p>
            <p className={`text-[11px] ${isAnalysis || isFloating ? 'text-slate-300' : 'text-slate-500'}`}>
              {reportUpdatedAt ? 'Context synced' : 'Live coaching + navigation'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={clearMessages}
            className={`rounded-lg p-2 ${
              isAnalysis || isFloating ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100'
            }`}
            aria-label="Clear chat"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className={`rounded-lg p-2 ${
                isAnalysis || isFloating ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100'
              }`}
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </header>

      <div
        className={`overflow-y-auto px-4 py-3 ${
          isAnalysis
            ? 'min-h-[16rem] max-h-[30rem] bg-slate-950/25'
            : isFloating
              ? 'max-h-[20rem] bg-slate-950/25'
              : 'max-h-[20rem] bg-white'
        }`}
      >
        {showAnalysisHero ? (
          <div className="rounded-3xl border border-slate-700/80 bg-[radial-gradient(circle_at_0%_0%,rgba(255,255,255,0.08),transparent_35%),linear-gradient(155deg,rgba(3,7,18,0.94)_0%,rgba(15,23,42,0.92)_55%,rgba(6,10,20,0.96)_100%)] p-6 shadow-[0_30px_80px_rgba(2,6,23,0.55)]">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-rose-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-rose-200">
              <Sparkles className="h-3.5 w-3.5" />
              Study Copilot
            </div>
            <h3 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl">
              {preferredName ? `Hi ${preferredName},` : 'Hi Learner,'} where should we start?
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-300">
              Ask naturally. I can discuss any topic, open SAT/IELTS tests, start speaking mode, and support vocabulary with training-safe rules.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {quickChips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => void sendMessage(chip)}
                  disabled={isSending}
                  className="rounded-full border border-slate-600 bg-slate-900/70 px-3 py-1.5 text-xs font-semibold text-slate-100 transition hover:bg-slate-800"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        ) : null}
        <div className="space-y-3">
          {viewMessages.map((message) => (
            <article
              key={message.id}
              className={`rounded-xl border px-3 py-2 text-sm leading-6 ${
                message.role === 'assistant'
                  ? isAnalysis || isFloating
                    ? 'border-slate-700 bg-slate-900/70 text-slate-100'
                    : 'border-red-100 bg-red-50/50 text-slate-800'
                  : isAnalysis || isFloating
                    ? 'ml-auto border-rose-400/30 bg-rose-500/20 text-rose-50'
                    : 'ml-auto border-red-200 bg-red-100 text-red-900'
              }`}
            >
              {message.content}
            </article>
          ))}
          {isSending ? (
            <div
              className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs ${
                isAnalysis || isFloating
                  ? 'border-slate-700 bg-slate-900 text-slate-300'
                  : 'border-red-100 bg-red-50 text-slate-600'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              Thinking...
            </div>
          ) : null}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div
        className={`border-t px-4 py-3 ${
          isAnalysis || isFloating ? 'border-slate-700 bg-slate-950/20' : 'border-red-100 bg-white'
        }`}
      >
        <div className={`${isAnalysis ? 'rounded-3xl border border-slate-700/80 bg-slate-900/65 p-2.5' : ''}`}>
          <div className={`mb-2 flex flex-wrap gap-1.5 ${isAnalysis ? 'px-1' : ''}`}>
            {quickChips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => void sendMessage(chip)}
                disabled={isSending}
                className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                  isAnalysis || isFloating
                    ? 'border-slate-600 bg-slate-900/70 text-slate-100 hover:bg-slate-800'
                    : 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit} className="flex items-center gap-2">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={
                preferredLocale === 'uz'
                  ? "Menga erkin yozing: suhbat, test ochish, speaking yoki lug'at..."
                  : 'Type naturally: chat, open tests, speaking mode, or vocabulary help...'
              }
              className={`${isAnalysis ? 'h-14 rounded-2xl' : 'h-10 rounded-xl'} flex-1 border px-3 text-sm outline-none focus:ring-2 ${
                isAnalysis || isFloating
                  ? 'border-slate-600 bg-slate-900/70 text-slate-100 placeholder:text-slate-400 focus:border-rose-400 focus:ring-rose-500/20'
                  : 'border-red-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-red-400 focus:ring-red-200'
              }`}
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={isSending || !draft.trim()}
              className={`inline-flex ${isAnalysis ? 'h-14 w-14 rounded-2xl' : 'h-10 rounded-xl px-3'} items-center justify-center text-sm font-semibold ${
                isAnalysis || isFloating
                  ? 'bg-gradient-to-r from-rose-500 to-red-500 text-white disabled:opacity-50'
                  : 'bg-gradient-to-r from-red-600 to-red-700 text-white disabled:opacity-50'
              }`}
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

        {isAnalysis ? (
          <p className="mt-2 px-1 text-[11px] text-slate-400">
            Study-first policy: training mode supports vocabulary only, exam mode blocks tutoring.
          </p>
        ) : null}

        {error ? (
          <p
            className={`mt-2 text-xs ${isAnalysis || isFloating ? 'text-rose-200' : 'text-red-700'}`}
            role="status"
            aria-live="polite"
          >
            {error}
          </p>
        ) : null}
      </div>
    </section>
  )
}

export default AIChatWindow
