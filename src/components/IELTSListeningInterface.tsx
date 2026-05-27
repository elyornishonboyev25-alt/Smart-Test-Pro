import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  CheckCircle2,
  CirclePause,
  CirclePlay,
  Clock3,
  Headphones,
  Lock,
  RotateCcw,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { IELTSTest, Question, Section, TestResult } from '../types/ieltsTypes'
import { AnimatedBackground } from './AnimatedBackground'
import Timer from './Timer'
import QuestionNavigation from './QuestionNavigation'
import { calculateBandScore, checkAnswer, formatQuestionTypeLabel } from '../utils/ieltsUtils'

type ListeningMode = 'practice' | 'full-test'

interface IELTSListeningInterfaceProps {
  test: IELTSTest
  onComplete: (results: TestResult) => void
  onExit: () => void
  launchPreset?: {
    mode?: 'practice' | 'full-test'
    partIndex?: number
    durationMinutes?: number
  }
}

const SESSION_VERSION = 2
const PRACTICE_TIME_PRESETS = [15, 20, 30, 40, -1]

function sanitizeSelectedParts(value: number[] | undefined, sectionCount: number): number[] {
  if (sectionCount <= 0) return []
  const fallback = [0]
  if (!value || value.length === 0) return fallback

  const normalized = Array.from(new Set(value))
    .filter((entry) => Number.isInteger(entry) && entry >= 0 && entry < sectionCount)
    .sort((left, right) => left - right)

  return normalized.length > 0 ? normalized : fallback
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '00:00'
  const minutes = Math.floor(seconds / 60)
  const rest = Math.floor(seconds % 60)
  return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`
}

function evaluateQuestion(question: Question, answer: string | number | string[] | undefined): boolean {
  const checked = checkAnswer(answer, question.correctAnswer, question.options)
  if (typeof checked === 'number') return checked > 0
  return checked
}

function getTotalQuestionCount(sections: Section[]) {
  return sections.reduce((sum, section) => sum + section.questions.length, 0)
}

function hasAnswer(answer: string | number | string[] | undefined): boolean {
  if (answer === undefined || answer === null) return false
  if (typeof answer === 'string') return answer.trim().length > 0
  if (Array.isArray(answer)) return answer.some((entry) => String(entry ?? '').trim().length > 0)
  return true
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export default function IELTSListeningInterface({
  test,
  onComplete,
  onExit,
  launchPreset,
}: IELTSListeningInterfaceProps) {
  const [mode, setMode] = useState<ListeningMode>('full-test')
  const [selectedParts, setSelectedParts] = useState<number[]>(() =>
    sanitizeSelectedParts([0], test.sections.length),
  )
  const [customTimeMinutes, setCustomTimeMinutes] = useState(20)
  const [isTestActive, setIsTestActive] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(test.duration * 60)
  const [answers, setAnswers] = useState<Record<string, string | number | string[]>>({})
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [lockedSections, setLockedSections] = useState<Record<string, boolean>>({})
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [audioFailed, setAudioFailed] = useState(false)
  const [visualFailed, setVisualFailed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const startedAtRef = useRef<number | null>(null)
  const launchPresetAppliedRef = useRef(false)
  const listeningSessionKey = `ielts-listening-session-${test.id}`

  const isFullTestMode = mode === 'full-test'
  const activeSections = useMemo(() => {
    if (isFullTestMode) return test.sections
    return test.sections.filter((_, index) => selectedParts.includes(index))
  }, [isFullTestMode, selectedParts, test.sections])
  const totalQuestions = useMemo(() => getTotalQuestionCount(activeSections), [activeSections])

  const sectionMeta = useMemo(() => {
    let globalIndex = 0
    return activeSections.map((section) => {
      const startIndex = globalIndex
      const questionIds = section.questions.map((question) => question.id)
      const questionNumbers = section.questions.map((question) => question.number)
      globalIndex += questionIds.length
      return {
        id: section.id,
        title: section.title,
        startIndex,
        questionCount: questionIds.length,
        questionIds,
        questionNumbers,
      }
    })
  }, [activeSections])

  const currentSection = activeSections[currentSectionIndex] ?? activeSections[0]
  const currentSectionLocked = Boolean(currentSection && lockedSections[currentSection.id])
  const allQuestions = useMemo(() => activeSections.flatMap((section) => section.questions), [activeSections])
  const currentQuestion = allQuestions[currentQuestionIndex]
  const answeredCount = useMemo(
    () =>
      allQuestions.reduce((count, question) => {
        return count + (hasAnswer(answers[question.id]) ? 1 : 0)
      }, 0),
    [allQuestions, answers],
  )
  const progressPercent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0
  const sectionStartIndex = sectionMeta[currentSectionIndex]?.startIndex ?? 0

  useEffect(() => {
    const saved = localStorage.getItem(listeningSessionKey)
    if (!saved) return

    try {
      const parsed = JSON.parse(saved) as {
        version?: number
        mode?: ListeningMode
        selectedParts?: number[]
        customTimeMinutes?: number
        isTestActive?: boolean
        timeRemaining?: number
        answers?: Record<string, string | number | string[]>
        currentSectionIndex?: number
        currentQuestionIndex?: number
        lockedSections?: Record<string, boolean>
        startedAt?: number
        volume?: number
        isMuted?: boolean
      }

      if (parsed.version !== SESSION_VERSION) return

      const restoredMode = parsed.mode ?? 'full-test'
      setMode(restoredMode)
      setSelectedParts(sanitizeSelectedParts(parsed.selectedParts, test.sections.length))
      setCustomTimeMinutes(parsed.customTimeMinutes ?? 20)
      setIsTestActive(Boolean(parsed.isTestActive))
      setTimeRemaining(parsed.timeRemaining ?? test.duration * 60)
      setAnswers(parsed.answers ?? {})
      setCurrentSectionIndex(parsed.currentSectionIndex ?? 0)
      setCurrentQuestionIndex(parsed.currentQuestionIndex ?? 0)
      setLockedSections(parsed.lockedSections ?? {})
      setVolume(typeof parsed.volume === 'number' ? Math.min(1, Math.max(0, parsed.volume)) : 1)
      setIsMuted(Boolean(parsed.isMuted))
      startedAtRef.current = typeof parsed.startedAt === 'number' ? parsed.startedAt : null
    } catch {
      // Ignore corrupted session payload.
    }
  }, [listeningSessionKey, test.duration, test.sections.length])

  useEffect(() => {
    if (!isTestActive) {
      setTimeRemaining(isFullTestMode ? test.duration * 60 : customTimeMinutes === -1 ? -1 : customTimeMinutes * 60)
    }
  }, [customTimeMinutes, isFullTestMode, isTestActive, test.duration])

  useEffect(() => {
    setSelectedParts((current) => sanitizeSelectedParts(current, test.sections.length))
  }, [test.sections.length])

  useEffect(() => {
    if (!isTestActive) return

    const payload = {
      version: SESSION_VERSION,
      mode,
      selectedParts,
      customTimeMinutes,
      isTestActive,
      timeRemaining,
      answers,
      currentSectionIndex,
      currentQuestionIndex,
      lockedSections,
      startedAt: startedAtRef.current,
      volume,
      isMuted,
    }
    localStorage.setItem(listeningSessionKey, JSON.stringify(payload))
  }, [
    answers,
    currentQuestionIndex,
    currentSectionIndex,
    customTimeMinutes,
    isMuted,
    isTestActive,
    listeningSessionKey,
    lockedSections,
    mode,
    selectedParts,
    timeRemaining,
    volume,
  ])

  useEffect(() => {
    if (activeSections.length === 0) {
      setCurrentSectionIndex(0)
      setCurrentQuestionIndex(0)
      return
    }

    if (currentSectionIndex >= activeSections.length) {
      setCurrentSectionIndex(0)
    }
  }, [activeSections.length, currentSectionIndex])

  useEffect(() => {
    if (totalQuestions <= 0) {
      setCurrentQuestionIndex(0)
      return
    }
    if (currentQuestionIndex >= totalQuestions) {
      setCurrentQuestionIndex(totalQuestions - 1)
    }
  }, [currentQuestionIndex, totalQuestions])

  useEffect(() => {
    if (!currentSection) return
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
    setAudioFailed(false)
    setVisualFailed(false)
    setPlaybackSpeed(1)
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    audio.currentTime = 0
    audio.playbackRate = 1
  }, [currentSection?.id])

  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.volume = volume
  }, [volume])

  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.muted = isMuted
  }, [isMuted])

  const clearSession = useCallback(() => {
    localStorage.removeItem(listeningSessionKey)
    startedAtRef.current = null
  }, [listeningSessionKey])

  const togglePartSelection = useCallback(
    (partIndex: number) => {
      setSelectedParts((previous) => {
        const exists = previous.includes(partIndex)
        if (exists) {
          if (previous.length === 1) return previous
          return previous.filter((entry) => entry !== partIndex)
        }
        return [...previous, partIndex].sort((left, right) => left - right)
      })
    },
    [],
  )

  const startTest = useCallback(
    (preset?: {
      mode?: ListeningMode
      selectedParts?: number[]
      customTimeMinutes?: number
    }) => {
      const effectiveMode = preset?.mode ?? mode
      const effectiveParts = sanitizeSelectedParts(
        preset?.selectedParts ?? selectedParts,
        test.sections.length,
      )
      const effectiveCustomTime = preset?.customTimeMinutes ?? customTimeMinutes
      const startingTime =
        effectiveMode === 'full-test' ? test.duration * 60 : effectiveCustomTime === -1 ? -1 : effectiveCustomTime * 60

      setMode(effectiveMode)
      setCustomTimeMinutes(effectiveCustomTime)
      setSelectedParts(effectiveParts)
      setTimeRemaining(startingTime)
      setAnswers({})
      setCurrentSectionIndex(0)
      setCurrentQuestionIndex(0)
      setLockedSections({})
      setAudioFailed(false)
      setVisualFailed(false)
      setIsTestActive(true)
      setIsSubmitting(false)
      startedAtRef.current = Date.now()
    },
    [customTimeMinutes, mode, selectedParts, test.duration, test.sections.length],
  )

  useEffect(() => {
    if (isTestActive || launchPresetAppliedRef.current || !launchPreset) return

    const desiredMode: ListeningMode = launchPreset.mode === 'practice' ? 'practice' : 'full-test'
    const desiredPart =
      typeof launchPreset.partIndex === 'number'
        ? clamp(Math.round(launchPreset.partIndex), 1, test.sections.length)
        : undefined
    const desiredDuration =
      typeof launchPreset.durationMinutes === 'number'
        ? clamp(Math.round(launchPreset.durationMinutes), 5, 180)
        : undefined

    launchPresetAppliedRef.current = true
    startTest({
      mode: desiredMode,
      selectedParts: desiredMode === 'practice' && desiredPart ? [desiredPart - 1] : undefined,
      customTimeMinutes: desiredMode === 'practice' && desiredDuration ? desiredDuration : undefined,
    })
  }, [isTestActive, launchPreset, startTest, test.sections.length])

  const onAudioEnded = useCallback(() => {
    setIsPlaying(false)
    if (!currentSection) return
    if (isFullTestMode) {
      setLockedSections((previous) => ({ ...previous, [currentSection.id]: true }))
    }
  }, [currentSection, isFullTestMode])

  const togglePlay = useCallback(async () => {
    if (!audioRef.current || !currentSection?.audioUrl) return
    if (isFullTestMode && currentSectionLocked) return

    try {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        if (!isFullTestMode) {
          audioRef.current.playbackRate = playbackSpeed
        }
        await audioRef.current.play()
        setIsPlaying(true)
      }
    } catch {
      setAudioFailed(true)
      setIsPlaying(false)
    }
  }, [currentSection?.audioUrl, currentSectionLocked, isFullTestMode, isPlaying, playbackSpeed])

  const restartAudio = useCallback(() => {
    if (!audioRef.current || isFullTestMode) return
    audioRef.current.currentTime = 0
    setCurrentTime(0)
  }, [isFullTestMode])

  const handleSeek = useCallback(
    (value: number) => {
      if (!audioRef.current || isFullTestMode) return
      audioRef.current.currentTime = value
      setCurrentTime(value)
    },
    [isFullTestMode],
  )

  const toggleMute = useCallback(() => {
    setIsMuted((previous) => !previous)
  }, [])

  const setVolumeValue = useCallback((value: number) => {
    const normalized = Math.min(1, Math.max(0, value))
    setVolume(normalized)
    if (normalized > 0) {
      setIsMuted(false)
    }
  }, [])

  const cycleSpeed = useCallback(() => {
    if (!audioRef.current || isFullTestMode) return
    const speeds = [0.75, 1, 1.25, 1.5]
    const currentIndex = speeds.indexOf(playbackSpeed)
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length]
    audioRef.current.playbackRate = nextSpeed
    setPlaybackSpeed(nextSpeed)
  }, [isFullTestMode, playbackSpeed])

  const handleQuestionNavigate = useCallback(
    (index: number) => {
      const boundedIndex = Math.max(0, Math.min(totalQuestions - 1, index))
      setCurrentQuestionIndex(boundedIndex)
      const sectionIndex = sectionMeta.findIndex(
        (section) => boundedIndex >= section.startIndex && boundedIndex < section.startIndex + section.questionCount,
      )
      if (sectionIndex >= 0 && sectionIndex !== currentSectionIndex) {
        setCurrentSectionIndex(sectionIndex)
      }
    },
    [currentSectionIndex, sectionMeta, totalQuestions],
  )

  const handleSectionChange = useCallback(
    (index: number) => {
      if (index < 0 || index >= sectionMeta.length) return
      setCurrentSectionIndex(index)
      const startIndex = sectionMeta[index]?.startIndex ?? 0
      setCurrentQuestionIndex(startIndex)
    },
    [sectionMeta],
  )

  const handleAnswerChange = useCallback((questionId: string, value: string | number | string[]) => {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: value,
    }))
  }, [])

  const handleSubmit = useCallback(() => {
    if (isSubmitting) return
    setIsSubmitting(true)

    const correctAnswers = activeSections.reduce((sum, section) => {
      const sectionCorrect = section.questions.reduce((sectionSum, question) => {
        return sectionSum + (evaluateQuestion(question, answers[question.id]) ? 1 : 0)
      }, 0)
      return sum + sectionCorrect
    }, 0)

    const score = calculateBandScore(correctAnswers)
    const timeSpent =
      startedAtRef.current !== null
        ? Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000))
        : Math.max(1, test.duration * 60 - Math.max(0, timeRemaining))

    const result: TestResult = {
      testId: test.id,
      date: new Date().toISOString(),
      score,
      correctAnswers,
      totalQuestions,
      timeSpent,
      answers,
      detailedBreakdown: {
        activeSectionIds: activeSections.map((section) => section.id),
      },
    }

    clearSession()
    onComplete(result)
  }, [
    activeSections,
    answers,
    clearSession,
    isSubmitting,
    onComplete,
    test.duration,
    test.id,
    timeRemaining,
    totalQuestions,
  ])

  if (!currentSection) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,#ffe4e6_0%,#fff_45%,#fff6ed_100%)] px-4">
        <AnimatedBackground />
        <div className="relative z-10 max-w-md rounded-3xl border border-red-200 bg-white/90 p-8 text-center shadow-[0_24px_60px_rgba(220,38,38,0.18)] backdrop-blur-xl">
          <h2 className="text-2xl font-black text-slate-900">Listening content not ready</h2>
          <p className="mt-2 text-sm text-slate-600">No sections are currently attached to this listening test.</p>
          <button
            type="button"
            onClick={onExit}
            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-red-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>
      </div>
    )
  }

  if (!isTestActive) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#ffe4e6_0%,#fff_45%,#fff6ed_100%)] px-4 py-6 sm:px-6 lg:px-8">
        <AnimatedBackground />
        <div className="relative z-10 mx-auto max-w-6xl space-y-5">
          <div className="rounded-3xl border border-red-200/70 bg-white/80 p-4 shadow-[0_30px_80px_-45px_rgba(220,38,38,0.6)] backdrop-blur-xl sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <button
                  type="button"
                  onClick={onExit}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-slate-700 hover:bg-red-50"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back
                </button>
                <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-red-200 bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-red-600">
                  <Sparkles className="h-3.5 w-3.5" />
                  IELTS Listening Premium Console
                </p>
                <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                  Listening Full Test 1
                </h1>
                <p className="mt-2 max-w-3xl text-sm text-slate-600 sm:text-base">
                  Reading flowiga o&apos;xshash ikki rejim: Practice va Full Test. Full Test rejimida audio qaytarish
                  bloklanadi, faqat real exam kabi progressiv tinglash qoladi.
                </p>
              </div>
              <div className="grid gap-2 sm:min-w-[240px]">
                <div className="rounded-2xl border border-red-100 bg-white px-4 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-red-600">Sections</p>
                  <p className="mt-1 text-2xl font-black text-slate-900">{test.sections.length}</p>
                </div>
                <div className="rounded-2xl border border-red-100 bg-white px-4 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-red-600">Questions</p>
                  <p className="mt-1 text-2xl font-black text-slate-900">{test.totalQuestions}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
            <div className="rounded-3xl border border-red-200/70 bg-white/85 p-4 shadow-[0_20px_48px_-30px_rgba(220,38,38,0.55)] backdrop-blur-xl sm:p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Mode</p>
              <div className="mt-3 space-y-2">
                <button
                  type="button"
                  onClick={() => setMode('practice')}
                  className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                    mode === 'practice'
                      ? 'border-red-500 bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-[0_18px_30px_-18px_rgba(220,38,38,0.7)]'
                      : 'border-red-100 bg-white text-slate-700 hover:border-red-300 hover:bg-red-50/60'
                  }`}
                >
                  <p className="text-base font-black">Practice Mode</p>
                  <p className={`text-xs ${mode === 'practice' ? 'text-red-50' : 'text-slate-500'}`}>
                    O&apos;zingiz time va part tanlaysiz.
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('full-test')}
                  className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                    mode === 'full-test'
                      ? 'border-red-500 bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-[0_18px_30px_-18px_rgba(220,38,38,0.7)]'
                      : 'border-red-100 bg-white text-slate-700 hover:border-red-300 hover:bg-red-50/60'
                  }`}
                >
                  <p className="text-base font-black">Full Test Mode</p>
                  <p className={`text-xs ${mode === 'full-test' ? 'text-red-50' : 'text-slate-500'}`}>
                    IELTS CD style: no rewind, no seek.
                  </p>
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-red-200/70 bg-white/85 p-4 shadow-[0_20px_48px_-30px_rgba(220,38,38,0.55)] backdrop-blur-xl sm:p-5">
              <AnimatePresence mode="wait">
                {mode === 'practice' ? (
                  <motion.div
                    key="practice"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-5"
                  >
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Select parts</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {test.sections.map((section, index) => {
                          const active = selectedParts.includes(index)
                          return (
                            <button
                              key={section.id}
                              type="button"
                              onClick={() => togglePartSelection(index)}
                              className={`rounded-xl border px-4 py-2 text-sm font-bold transition ${
                                active
                                  ? 'border-red-500 bg-red-600 text-white shadow-[0_12px_20px_-14px_rgba(220,38,38,0.9)]'
                                  : 'border-red-100 bg-white text-slate-700 hover:border-red-300 hover:bg-red-50'
                              }`}
                            >
                              Part {index + 1}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Time target</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {PRACTICE_TIME_PRESETS.map((preset) => {
                          const active = customTimeMinutes === preset
                          const label = preset === -1 ? 'Unlimited' : `${preset} min`
                          return (
                            <button
                              key={label}
                              type="button"
                              onClick={() => setCustomTimeMinutes(preset)}
                              className={`rounded-xl border px-4 py-2 text-sm font-bold transition ${
                                active
                                  ? 'border-red-500 bg-red-600 text-white shadow-[0_12px_20px_-14px_rgba(220,38,38,0.9)]'
                                  : 'border-red-100 bg-white text-slate-700 hover:border-red-300 hover:bg-red-50'
                              }`}
                            >
                              {label}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-emerald-700">Preview</p>
                      <p className="mt-1 text-sm font-semibold text-emerald-900">
                        Parts: {sanitizeSelectedParts(selectedParts, test.sections.length).map((entry) => entry + 1).join(', ')}
                        {' '}| Time: {customTimeMinutes === -1 ? 'Unlimited' : `${customTimeMinutes} minutes`}
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="full-test"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Full test policy</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="rounded-2xl border border-red-100 bg-white px-4 py-3">
                        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-red-600">Timer</p>
                        <p className="mt-1 text-xl font-black text-slate-900">{test.duration} min</p>
                      </div>
                      <div className="rounded-2xl border border-red-100 bg-white px-4 py-3">
                        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-red-600">Questions</p>
                        <p className="mt-1 text-xl font-black text-slate-900">{test.totalQuestions}</p>
                      </div>
                    </div>
                    <ul className="space-y-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                      <li className="flex items-start gap-2">
                        <Lock className="mt-0.5 h-4 w-4 shrink-0" />
                        Audio rewind va seek bloklangan.
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                        Har bir part yakunlangach replay yopiladi.
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="button"
                onClick={() => startTest()}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-red-600 bg-gradient-to-r from-red-600 via-rose-600 to-orange-500 px-4 py-3 text-sm font-black text-white shadow-[0_20px_30px_-18px_rgba(220,38,38,0.7)] transition hover:from-red-500 hover:via-rose-500 hover:to-orange-400"
              >
                <Headphones className="h-4 w-4" />
                Start {mode === 'practice' ? 'Practice Session' : 'Full Test'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#ffe4e6_0%,#fff_45%,#fff6ed_100%)] px-3 pb-24 pt-3 sm:px-4 lg:px-6">
      <AnimatedBackground />
      <audio
        ref={audioRef}
        src={currentSection.audioUrl}
        preload="metadata"
        onLoadedMetadata={(event) => setDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onEnded={onAudioEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => setAudioFailed(true)}
      />

      <div className="relative z-10 mx-auto max-w-7xl space-y-4">
        <header className="rounded-3xl border border-red-200/70 bg-white/85 p-4 shadow-[0_24px_52px_-32px_rgba(220,38,38,0.6)] backdrop-blur-xl sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-[220px] flex-col">
              <button
                type="button"
                onClick={onExit}
                className="inline-flex w-fit items-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-slate-700 hover:bg-red-50"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Exit
              </button>
              <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">IELTS Listening</h1>
              <p className="mt-1 text-sm text-slate-600">
                {isFullTestMode ? 'Full Test Simulation' : 'Practice Mode'} | Part {currentSectionIndex + 1}
              </p>
            </div>

            <div className="grid w-full gap-2 sm:w-auto sm:grid-cols-3">
              <div className="rounded-2xl border border-red-100 bg-white px-4 py-2.5">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-red-600">Timer</p>
                <div className="mt-1 flex items-center gap-2 text-lg font-black text-slate-900">
                  <Clock3 className="h-4 w-4 text-red-500" />
                  <Timer
                    duration={isFullTestMode ? test.duration * 60 : customTimeMinutes === -1 ? -1 : customTimeMinutes * 60}
                    timeLeft={timeRemaining}
                    setTimeLeft={setTimeRemaining}
                    onTimeUp={handleSubmit}
                    isActive={isTestActive && !isSubmitting && timeRemaining !== -1}
                    showWarning
                    variant="readingCompact"
                  />
                </div>
              </div>
              <div className="rounded-2xl border border-red-100 bg-white px-4 py-2.5">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-red-600">Progress</p>
                <p className="mt-1 text-lg font-black text-slate-900">{answeredCount}/{totalQuestions}</p>
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`rounded-2xl border px-4 py-2.5 text-left transition ${
                  isSubmitting
                    ? 'cursor-not-allowed border-red-200 bg-red-100 text-red-800'
                    : 'border-red-600 bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-[0_16px_25px_-16px_rgba(220,38,38,0.75)] hover:from-red-500 hover:to-rose-500'
                }`}
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.12em]">Submit</p>
                <p className="mt-1 inline-flex items-center gap-2 text-sm font-black">
                  <Send className="h-4 w-4" />
                  Finish Test
                </p>
              </button>
            </div>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-red-100">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-red-600 via-rose-500 to-orange-400"
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            />
          </div>
        </header>

        <section className="rounded-3xl border border-red-200/70 bg-white/85 p-4 shadow-[0_20px_45px_-30px_rgba(220,38,38,0.55)] backdrop-blur-xl sm:p-5">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {activeSections.map((section, index) => {
              const active = index === currentSectionIndex
              const sectionLocked = Boolean(lockedSections[section.id])
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => handleSectionChange(index)}
                  className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold transition ${
                    active
                      ? 'border-red-500 bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-[0_12px_20px_-14px_rgba(220,38,38,0.85)]'
                      : 'border-red-100 bg-white text-slate-700 hover:border-red-300 hover:bg-red-50'
                  }`}
                >
                  Part {index + 1}
                  {sectionLocked ? <Lock className="h-3.5 w-3.5" /> : null}
                </button>
              )
            })}
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
            <div className="rounded-2xl border border-red-100 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-red-600">Audio console</p>
                  <h3 className="mt-1 text-lg font-black text-slate-900">{currentSection.title}</h3>
                </div>
                {isFullTestMode ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-amber-800">
                    <Lock className="h-3 w-3" />
                    Rewind locked
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-emerald-800">
                    Practice controls
                  </span>
                )}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={togglePlay}
                  disabled={!currentSection.audioUrl || (isFullTestMode && currentSectionLocked)}
                  className={`inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-black transition ${
                    !currentSection.audioUrl || (isFullTestMode && currentSectionLocked)
                      ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
                      : 'border-red-600 bg-red-600 text-white hover:bg-red-500'
                  }`}
                >
                  {isPlaying ? <CirclePause className="h-4 w-4" /> : <CirclePlay className="h-4 w-4" />}
                  {isPlaying ? 'Pause' : 'Play'}
                </button>

                {!isFullTestMode ? (
                  <>
                    <button
                      type="button"
                      onClick={restartAudio}
                      disabled={!currentSection.audioUrl}
                      className="inline-flex h-11 items-center gap-2 rounded-xl border border-red-200 bg-white px-3 text-sm font-bold text-slate-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Restart
                    </button>
                    <button
                      type="button"
                      onClick={cycleSpeed}
                      disabled={!currentSection.audioUrl}
                      className="inline-flex h-11 items-center rounded-xl border border-red-200 bg-white px-3 text-sm font-bold text-slate-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {playbackSpeed}x
                    </button>
                  </>
                ) : null}
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={duration > 0 ? duration : 100}
                  step={0.1}
                  value={duration > 0 ? Math.min(currentTime, duration) : 0}
                  onChange={(event) => handleSeek(Number(event.target.value))}
                  disabled={isFullTestMode || duration <= 0 || !currentSection.audioUrl}
                  className={`h-2 w-full cursor-pointer appearance-none rounded-full ${
                    isFullTestMode ? 'bg-slate-200' : 'bg-red-100'
                  }`}
                />
              </div>

              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-white text-slate-700 hover:bg-red-50"
                >
                  {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={isMuted ? 0 : volume}
                  onChange={(event) => setVolumeValue(Number(event.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-red-100"
                />
              </div>

              {audioFailed ? (
                <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                  Audio topilmadi. `public/audio/ielts-listening/...` papkasiga fayllarni joylang.
                </p>
              ) : null}

              {isFullTestMode && currentSectionLocked ? (
                <p className="mt-3 inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-100 px-3 py-2 text-xs font-semibold text-amber-900">
                  <Lock className="h-4 w-4" />
                  This section audio is locked after completion.
                </p>
              ) : null}
            </div>

            <div className="rounded-2xl border border-red-100 bg-white p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-red-600">Visual aid</p>
              {currentSection.visualAidUrl && !visualFailed ? (
                <img
                  src={currentSection.visualAidUrl}
                  alt={`${currentSection.title} visual prompt`}
                  onError={() => setVisualFailed(true)}
                  className="mt-3 h-[260px] w-full rounded-2xl border border-red-100 object-cover"
                />
              ) : (
                <div className="mt-3 flex h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-red-200 bg-red-50/60 px-4 text-center">
                  <Headphones className="h-8 w-8 text-red-500" />
                  <p className="mt-2 text-sm font-bold text-slate-800">Listening prompt image</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Part screenshot/image shu yerda ko&apos;rinadi.
                  </p>
                </div>
              )}

              <div className="mt-3 rounded-xl border border-red-100 bg-red-50/60 px-3 py-2 text-xs text-slate-600">
                {isFullTestMode
                  ? 'Exam mode: audio controls are limited to play/pause only.'
                  : 'Practice mode: restart, speed, and seek are enabled.'}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-red-200/70 bg-white/85 p-4 shadow-[0_20px_45px_-30px_rgba(220,38,38,0.55)] backdrop-blur-xl sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-red-600">Questions</p>
              <h2 className="mt-1 text-xl font-black text-slate-900">{currentSection.title}</h2>
            </div>
            <div className="rounded-xl border border-red-100 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
              Current: #{currentQuestion?.number ?? sectionStartIndex + 1}
            </div>
          </div>

          {currentSection.content ? (
            <div className="mb-4 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-semibold text-slate-700">
              {currentSection.content}
            </div>
          ) : null}

          <div className="space-y-3">
            {currentSection.questions.map((question, localIndex) => {
              const globalIndex = sectionStartIndex + localIndex
              const active = globalIndex === currentQuestionIndex
              const answerValue = answers[question.id]
              const answered = hasAnswer(answerValue)

              return (
                <motion.article
                  key={question.id}
                  layout
                  onClick={() => handleQuestionNavigate(globalIndex)}
                  className={`rounded-2xl border p-4 transition ${
                    active
                      ? 'border-red-500 bg-red-50/70 shadow-[0_18px_34px_-26px_rgba(220,38,38,0.75)]'
                      : 'border-red-100 bg-white hover:border-red-300 hover:bg-red-50/50'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.12em] text-red-600">Question {question.number}</p>
                      <p className="mt-1 text-base font-bold text-slate-900">{question.text}</p>
                    </div>
                    <span
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${
                        answered
                          ? 'border-emerald-300 bg-emerald-100 text-emerald-800'
                          : 'border-slate-200 bg-slate-100 text-slate-600'
                      }`}
                    >
                      {answered ? 'Answered' : 'Pending'}
                    </span>
                  </div>

                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                    {formatQuestionTypeLabel(question.type)}
                  </p>

                  {question.type === 'multiple-choice' && question.options ? (
                    <div className="mt-3 grid gap-2">
                      {question.options.map((option, optionIndex) => {
                        const optionValue = String(optionIndex)
                        const selected = String(answerValue ?? '') === optionValue
                        return (
                          <button
                            key={`${question.id}-${option}`}
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation()
                              handleAnswerChange(question.id, optionValue)
                            }}
                            className={`rounded-xl border px-3 py-2 text-left text-sm font-semibold transition ${
                              selected
                                ? 'border-red-500 bg-red-600 text-white shadow-[0_14px_24px_-16px_rgba(220,38,38,0.85)]'
                                : 'border-red-100 bg-white text-slate-700 hover:border-red-300 hover:bg-red-50'
                            }`}
                          >
                            {option}
                          </button>
                        )
                      })}
                    </div>
                  ) : (
                    <input
                      value={typeof answerValue === 'string' || typeof answerValue === 'number' ? String(answerValue) : ''}
                      onChange={(event) => handleAnswerChange(question.id, event.target.value)}
                      onClick={(event) => event.stopPropagation()}
                      placeholder="Write your answer here..."
                      className="mt-3 h-11 w-full rounded-xl border border-red-100 bg-white px-3 text-sm font-medium text-slate-800 outline-none transition focus:border-red-300 focus:ring-2 focus:ring-red-100"
                    />
                  )}
                </motion.article>
              )
            })}
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-20">
        <QuestionNavigation
          sections={sectionMeta}
          currentSectionIndex={currentSectionIndex}
          currentQuestionIndex={currentQuestionIndex}
          answers={answers}
          onNavigate={handleQuestionNavigate}
          onSectionChange={handleSectionChange}
        />
      </div>
    </div>
  )
}
