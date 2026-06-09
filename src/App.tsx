import { Suspense, lazy, useEffect, type ReactNode } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import { TopNavigation } from '@/components/layout/TopNavigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { AnimatedBackground } from '@/components/AnimatedBackground'
import Footer from '@/components/Footer'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import PremiumRoute from '@/components/auth/PremiumRoute'
import { ToastViewport } from '@/components/common/ToastViewport'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import RegisterModal from '@/components/auth/RegisterModal'
import FloatingAIAssistant from '@/components/ai/FloatingAIAssistant'
import { useMotionPreferences } from '@/hooks/useMotionPreferences'
import { useAuthStore, type AuthState } from '@/store/authStore'
import { addTrackedMinutes, routeToActivityKey } from '@/utils/weeklyPlanner'

const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Tests = lazy(() => import('@/pages/Tests'))
const SAT = lazy(() => import('@/pages/SAT'))
const SATSection = lazy(() => import('@/pages/SATSection'))
const SATCalculator = lazy(() => import('@/pages/SATCalculator'))
const IELTS = lazy(() => import('@/pages/IELTS'))
const IELTSSection = lazy(() => import('@/pages/IELTSSection'))
const IELTSSectionTests = lazy(() => import('@/pages/IELTSSectionTests'))
const Vocabulary = lazy(() => import('@/pages/Vocabulary'))
const VocabularyActivity = lazy(() => import('@/pages/VocabularyActivity'))
const WritingLab = lazy(() => import('@/pages/WritingLab'))
const SpeakingLab = lazy(() => import('@/pages/SpeakingLab'))
const SpeakingCommunity = lazy(() => import('@/pages/SpeakingCommunity'))
const Mock = lazy(() => import('@/pages/Mock'))
const MockIELTS = lazy(() => import('@/pages/MockIELTS'))
const MockSAT = lazy(() => import('@/pages/MockSAT'))
const TestInterface = lazy(() => import('@/pages/TestInterface'))
const Results = lazy(() => import('@/pages/Results'))
const ResultsReview = lazy(() => import('@/pages/ResultsReview'))
const Profile = lazy(() => import('@/pages/Profile'))
const AnalyzeMistakes = lazy(() => import('@/pages/AnalyzeMistakes'))
const AccountProfile = lazy(() => import('@/pages/AccountProfile'))
const Login = lazy(() => import('@/pages/Login'))
const Register = lazy(() => import('@/pages/Register'))
const Premium = lazy(() => import('@/pages/Premium'))
const Leaderboard = lazy(() => import('@/pages/Leaderboard'))
const IELTSWritingTests = lazy(() => import('@/pages/IELTSWritingTests'))
const IELTSWritingTest = lazy(() => import('@/pages/IELTSWritingTest'))
const TestRunner = lazy(() => import('@/pages/TestRunner'))
const Articles = lazy(() => import('@/pages/Articles'))
const ShadowingLab = lazy(() => import('@/pages/ShadowingLab'))
const NotFound = lazy(() => import('@/pages/NotFound'))

const prefetchHighTrafficRoutes = () =>
  Promise.allSettled([
    import('@/pages/Tests'),
    import('@/pages/Leaderboard'),
    import('@/pages/SpeakingCommunity'),
    import('@/pages/Mock'),
    import('@/pages/AccountProfile'),
    import('@/pages/Profile'),
    import('@/pages/IELTS'),
    import('@/pages/SAT'),
  ])

function toDateISO(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function RouteLoader() {
  return (
    <div className="p-8">
      <div className="h-10 w-56 animate-pulse rounded-xl bg-slate-200/70" />
      <div className="mt-3 h-5 w-72 animate-pulse rounded-xl bg-slate-200/70" />
      <div className="mt-6 h-72 w-full animate-pulse rounded-2xl bg-slate-200/70" />
    </div>
  )
}

function AnimatedRoute({ children }: { children: ReactNode }) {
  const { minimalMotion } = useMotionPreferences()

  if (minimalMotion) {
    return <div className="h-full">{children}</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      {children}
    </motion.div>
  )
}

function App() {
  const location = useLocation()
  const pathname = location.pathname
  const user = useAuthStore((state: AuthState) => state.user)

  const isAuthPage = pathname === '/login' || pathname === '/register'
  const isLanding = pathname === '/' || pathname === '/dashboard' || pathname === '/about'
  const isVocabularyMode = pathname === '/vocabulary' || pathname.startsWith('/vocabulary/')
  const isProfileStandalone = pathname === '/profile'
  const isStandaloneMode = pathname === '/account'
  const isTrackMode =
    isStandaloneMode ||
    pathname.startsWith('/mock') ||
    pathname === '/speaking-community' ||
    pathname.startsWith('/sat') ||
    pathname.startsWith('/ielts') ||
    pathname === '/writing-lab' ||
    pathname === '/speaking-lab' ||
    pathname === '/shadowing-lab' ||
    pathname === '/articles'
  const isCustomTestMode = /^\/tests\/[^/]+\/attempt$/.test(pathname)
  const isClassicTestMode = pathname.startsWith('/test/') || pathname.startsWith('/results/')
  const isTestMode = isCustomTestMode || isClassicTestMode

  const showTopNavigation = !isAuthPage && isLanding
  const showSidebar =
    !isAuthPage &&
    !isLanding &&
    !isTestMode &&
    !isVocabularyMode &&
    !isTrackMode &&
    !isProfileStandalone

  useEffect(() => {
    const connection = navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
    const slowConnection =
      connection.connection?.saveData === true ||
      connection.connection?.effectiveType === 'slow-2g' ||
      connection.connection?.effectiveType === '2g'

    if (slowConnection) return

    const runPrefetch = () => {
      void prefetchHighTrafficRoutes()
    }

    if (typeof window.requestIdleCallback === 'function') {
      const callbackId = window.requestIdleCallback(runPrefetch, { timeout: 2500 })
      return () => window.cancelIdleCallback(callbackId)
    }

    const timeoutId = window.setTimeout(runPrefetch, 600)
    return () => window.clearTimeout(timeoutId)
  }, [])

  useEffect(() => {
    const activityKey = routeToActivityKey(pathname)
    if (!activityKey) return

    const intervalId = window.setInterval(() => {
      if (document.hidden) return
      addTrackedMinutes(user?.id, toDateISO(new Date()), activityKey, 1)
    }, 60000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [pathname, user?.id])

  return (
    <div className="app-shell relative min-h-screen text-[#1E293B] selection:bg-red-100">
      <AnimatedBackground />
      <ToastViewport />
      <RegisterModal />
      <FloatingAIAssistant />

      <div className="relative z-10 flex min-h-screen flex-col">
        {showTopNavigation && <TopNavigation />}

        <div className="flex flex-1">
          {showSidebar && <Sidebar />}

          <main
            className={`w-full flex-1 transition-[margin] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              showSidebar ? 'lg:ml-64' : 'ml-0'
            }`}
          >
            <div
              className={`flex min-h-full flex-col ${
                isTestMode
                  ? location.pathname.startsWith('/results/')
                    ? 'min-h-screen overflow-y-auto'
                    : 'min-h-[calc(100vh-80px)]'
                  : isVocabularyMode
                    ? 'min-h-screen'
                    : isProfileStandalone
                      ? 'min-h-screen'
                    : isTrackMode
                      ? 'min-h-screen'
                    : showSidebar
                      ? 'min-h-screen p-4 lg:p-8'
                      : showTopNavigation
                        ? 'min-h-[calc(100vh-80px)]'
                        : 'min-h-screen'
              }`}
            >
              <ErrorBoundary>
                <Suspense fallback={<RouteLoader />}>
                  <AnimatePresence mode="wait" initial={false}>
                    <Routes location={location} key={location.pathname}>
                      <Route path="/" element={<AnimatedRoute><Dashboard /></AnimatedRoute>} />
                      <Route path="/dashboard" element={<AnimatedRoute><Dashboard /></AnimatedRoute>} />
                      <Route path="/about" element={<AnimatedRoute><Dashboard /></AnimatedRoute>} />
                      <Route path="/tests" element={<AnimatedRoute><Tests /></AnimatedRoute>} />
                      <Route
                        path="/tests/:id/attempt"
                        element={
                          <ProtectedRoute>
                            <AnimatedRoute>
                              <TestRunner />
                            </AnimatedRoute>
                          </ProtectedRoute>
                        }
                      />
                      <Route path="/leaderboard" element={<AnimatedRoute><Leaderboard /></AnimatedRoute>} />
                      <Route
                        path="/mock"
                        element={
                          <PremiumRoute showGuestBanner>
                            <AnimatedRoute>
                              <Mock />
                            </AnimatedRoute>
                          </PremiumRoute>
                        }
                      />
                      <Route
                        path="/mock/ielts"
                        element={
                          <PremiumRoute showGuestBanner>
                            <AnimatedRoute>
                              <MockIELTS />
                            </AnimatedRoute>
                          </PremiumRoute>
                        }
                      />
                      <Route
                        path="/mock/sat"
                        element={
                          <PremiumRoute showGuestBanner>
                            <AnimatedRoute>
                              <MockSAT />
                            </AnimatedRoute>
                          </PremiumRoute>
                        }
                      />
                      <Route path="/sat" element={<AnimatedRoute><SAT /></AnimatedRoute>} />
                      <Route path="/sat/:section" element={<AnimatedRoute><SATSection /></AnimatedRoute>} />
                      <Route path="/sat/calculator" element={<AnimatedRoute><SATCalculator /></AnimatedRoute>} />
                      <Route path="/ielts" element={<AnimatedRoute><IELTS /></AnimatedRoute>} />
                      <Route path="/ielts/writing/tests" element={<AnimatedRoute><IELTSWritingTests /></AnimatedRoute>} />
                      <Route path="/ielts/writing/test/:id" element={<AnimatedRoute><IELTSWritingTest /></AnimatedRoute>} />
                      <Route path="/ielts/:section/tests" element={<AnimatedRoute><IELTSSectionTests /></AnimatedRoute>} />
                      <Route path="/ielts/:section" element={<AnimatedRoute><IELTSSection /></AnimatedRoute>} />
                      <Route
                        path="/vocabulary"
                        element={
                          <PremiumRoute showGuestBanner>
                            <AnimatedRoute>
                              <Vocabulary />
                            </AnimatedRoute>
                          </PremiumRoute>
                        }
                      />
                      <Route
                        path="/vocabulary/:track"
                        element={
                          <PremiumRoute showGuestBanner>
                            <AnimatedRoute>
                              <Vocabulary />
                            </AnimatedRoute>
                          </PremiumRoute>
                        }
                      />
                      <Route
                        path="/vocabulary/ielts/:bookId/:testId/:sectionId"
                        element={
                          <PremiumRoute showGuestBanner>
                            <AnimatedRoute>
                              <VocabularyActivity />
                            </AnimatedRoute>
                          </PremiumRoute>
                        }
                      />
                      <Route
                        path="/vocabulary/ielts/:bookId/:testId/:sectionId/:activity"
                        element={
                          <PremiumRoute showGuestBanner>
                            <AnimatedRoute>
                              <VocabularyActivity />
                            </AnimatedRoute>
                          </PremiumRoute>
                        }
                      />
                      <Route
                        path="/vocabulary/sat/:packId/:sectionId"
                        element={
                          <PremiumRoute showGuestBanner>
                            <AnimatedRoute>
                              <VocabularyActivity />
                            </AnimatedRoute>
                          </PremiumRoute>
                        }
                      />
                      <Route
                        path="/vocabulary/sat/:packId/:sectionId/:activity"
                        element={
                          <PremiumRoute showGuestBanner>
                            <AnimatedRoute>
                              <VocabularyActivity />
                            </AnimatedRoute>
                          </PremiumRoute>
                        }
                      />
                      <Route path="/writing-lab" element={<AnimatedRoute><WritingLab /></AnimatedRoute>} />
                      <Route path="/speaking-lab" element={<AnimatedRoute><SpeakingLab /></AnimatedRoute>} />
                      <Route
                        path="/speaking-community"
                        element={
                          <PremiumRoute showGuestBanner>
                            <AnimatedRoute>
                              <SpeakingCommunity />
                            </AnimatedRoute>
                          </PremiumRoute>
                        }
                      />
                      <Route
                        path="/test/:type/:id"
                        element={
                          <ProtectedRoute>
                            <AnimatedRoute>
                              <TestInterface />
                            </AnimatedRoute>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/results/:testId"
                        element={
                          <ProtectedRoute>
                            <AnimatedRoute>
                              <Results />
                            </AnimatedRoute>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/results/:testId/review"
                        element={
                          <ProtectedRoute>
                            <AnimatedRoute>
                              <ResultsReview />
                            </AnimatedRoute>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/analyze-mistakes"
                        element={
                          <PremiumRoute>
                            <AnimatedRoute>
                              <AnalyzeMistakes />
                            </AnimatedRoute>
                          </PremiumRoute>
                        }
                      />
                      <Route
                        path="/profile"
                        element={
                          <PremiumRoute>
                            <AnimatedRoute>
                              <Profile />
                            </AnimatedRoute>
                          </PremiumRoute>
                        }
                      />

                      <Route
                        path="/account"
                        element={
                          <ProtectedRoute>
                            <AnimatedRoute>
                              <AccountProfile />
                            </AnimatedRoute>
                          </ProtectedRoute>
                        }
                      />
                      <Route path="/articles" element={<AnimatedRoute><Articles /></AnimatedRoute>} />
                      <Route path="/shadowing-lab" element={<AnimatedRoute><ShadowingLab /></AnimatedRoute>} />
                      <Route path="/premium" element={<AnimatedRoute><Premium /></AnimatedRoute>} />
                      <Route path="/login" element={<AnimatedRoute><Login /></AnimatedRoute>} />
                      <Route path="/register" element={<AnimatedRoute><Register /></AnimatedRoute>} />
                      <Route path="*" element={<AnimatedRoute><NotFound /></AnimatedRoute>} />
                    </Routes>
                  </AnimatePresence>
                </Suspense>
              </ErrorBoundary>

              {!isAuthPage && !isTestMode && !isVocabularyMode && !isTrackMode && !isProfileStandalone && (
                <div className="mt-14">
                  <Footer />
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default App








