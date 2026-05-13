import { useCallback, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Bot, Lock } from 'lucide-react'
import { apiClient } from '@/lib/apiClient'
import { useAuthStore, type AuthState } from '@/store/authStore'
import { useAiAssistantStore } from '@/store/aiAssistantStore'
import { hasPremiumAccess } from '@/utils/premiumAccess'
import type { AiReportResponse } from '@/types/platform'
import AIChatWindow from '@/components/ai/AIChatWindow'

const ATTEMPT_SUBMITTED_EVENT = 'smarttest:attempt-submitted'

function isLegacyExamPath(pathname: string) {
  const isCustomTestMode = /^\/tests\/[^/]+\/attempt$/.test(pathname)
  const isClassicTestMode = pathname.startsWith('/test/') || pathname.startsWith('/results/')
  return isCustomTestMode || isClassicTestMode
}

function shouldBlockAssistant(pathname: string, search: string) {
  const isCustomTestMode = /^\/tests\/[^/]+\/attempt$/.test(pathname)
  if (isCustomTestMode || pathname.startsWith('/results/')) {
    return true
  }

  if (pathname.startsWith('/test/')) {
    const mode = new URLSearchParams(search).get('mode')
    if (mode === 'simulation' || mode === 'full-test') {
      return true
    }
  }

  return false
}

export function FloatingAIAssistant() {
  const location = useLocation()
  const user = useAuthStore((state: AuthState) => state.user)
  const hasPremium = hasPremiumAccess(user)
  const isOpen = useAiAssistantStore((state) => state.isOpen)
  const open = useAiAssistantStore((state) => state.open)
  const close = useAiAssistantStore((state) => state.close)
  const setReportSnapshot = useAiAssistantStore((state) => state.setReportSnapshot)

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'
  const isAiAnalysisStandalone = location.pathname === '/ai-coach' || location.pathname === '/profile'
  const isLegacyTestMode = useMemo(() => isLegacyExamPath(location.pathname), [location.pathname])
  const assistantBlocked = useMemo(
    () => shouldBlockAssistant(location.pathname, location.search),
    [location.pathname, location.search],
  )

  const refreshContext = useCallback(
    async (refresh: boolean) => {
      if (!user || !hasPremium) return
      try {
        const report = await apiClient.post<AiReportResponse>('/profile/ai-report', { refresh })
        setReportSnapshot(report)
      } catch {
        // background refresh is best-effort
      }
    },
    [hasPremium, setReportSnapshot, user],
  )

  useEffect(() => {
    if (!assistantBlocked && !isAiAnalysisStandalone) return
    close()
  }, [assistantBlocked, close, isAiAnalysisStandalone])

  useEffect(() => {
    if (isAuthPage) return
    void refreshContext(false)

    const onAttemptSubmitted = () => {
      void refreshContext(true)
    }

    const onWindowFocus = () => {
      void refreshContext(false)
    }

    window.addEventListener(ATTEMPT_SUBMITTED_EVENT, onAttemptSubmitted as EventListener)
    window.addEventListener('focus', onWindowFocus)

    return () => {
      window.removeEventListener(ATTEMPT_SUBMITTED_EVENT, onAttemptSubmitted as EventListener)
      window.removeEventListener('focus', onWindowFocus)
    }
  }, [isAuthPage, refreshContext])

  if (isAuthPage || isAiAnalysisStandalone || assistantBlocked) return null

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[120] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {isOpen && !assistantBlocked ? (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto w-[min(92vw,24rem)]"
          >
            <AIChatWindow variant="floating" onClose={close} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => {
          if (assistantBlocked) return
          if (isOpen) {
            close()
            return
          }
          open()
        }}
        aria-label="Open AI assistant"
        className={`pointer-events-auto relative inline-flex h-12 w-12 items-center justify-center rounded-full border shadow-[0_18px_32px_rgba(2,6,23,0.32)] ${
          isLegacyTestMode
            ? 'border-slate-700 bg-slate-900 text-slate-200'
            : 'border-red-300 bg-gradient-to-r from-red-500 to-rose-500 text-white'
        }`}
      >
        <Bot className="h-5 w-5" />
        {!hasPremium && !assistantBlocked ? (
          <span className="absolute -right-1 -top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-slate-100">
            <Lock className="h-3 w-3" />
          </span>
        ) : null}
      </button>
    </div>
  )
}

export default FloatingAIAssistant
