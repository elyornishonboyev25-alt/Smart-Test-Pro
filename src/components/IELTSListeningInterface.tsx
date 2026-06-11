import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle,
  ChevronRight,
  Headphones,
  Maximize2,
  Menu,
  Minimize2,
  PencilLine,
  Play,
  Send,
  Volume2,
  Wifi,
  X,
} from 'lucide-react'
import {
  IELTSTest,
  Question,
  Section,
  TestResult,
  ListeningBlock,
  ListeningSegment,
} from '../types/ieltsTypes'
import { BrandMark } from './brand/BrandLogo'
import { calculateBandScore, checkAnswer } from '../utils/ieltsUtils'

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

const WIDTHS: Record<string, string> = {
  sm: 'w-16',
  md: 'w-28',
  lg: 'w-44',
  xl: 'w-60',
}

function isAnswered(value: string | number | string[] | undefined): boolean {
  if (value === undefined || value === null) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.some((entry) => String(entry ?? '').trim().length > 0)
  return true
}

function evaluate(question: Question, answer: string | number | string[] | undefined): boolean {
  const checked = checkAnswer(answer, question.correctAnswer, question.options)
  if (typeof checked === 'number') return checked > 0
  return checked
}

export default function IELTSListeningInterface({
  test,
  onComplete,
  onExit,
  launchPreset,
}: IELTSListeningInterfaceProps) {
  const sections = test.sections
  const durationMinutes = launchPreset?.durationMinutes ?? test.duration ?? 32

  const initialPart = useMemo(() => {
    const candidate = (launchPreset?.partIndex ?? 1) - 1
    return Math.min(Math.max(0, candidate), Math.max(0, sections.length - 1))
  }, [launchPreset?.partIndex, sections.length])

  const [started, setStarted] = useState(false)
  const [currentPartIndex, setCurrentPartIndex] = useState(initialPart)
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioDone, setAudioDone] = useState(false)
  const [audioFailed, setAudioFailed] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(durationMinutes * 60)
  const [answers, setAnswers] = useState<Record<string, string | number | string[]>>({})
  const [activeNumber, setActiveNumber] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmSubmit, setConfirmSubmit] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [notesOpen, setNotesOpen] = useState(false)
  const [notesText, setNotesText] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const startedAtRef = useRef<number | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement | null>(null)

  const audioSources = useMemo(() => sections.map((section) => section.audioUrl ?? ''), [sections])

  // number -> question and number -> part lookups
  const questionByNumber = useMemo(() => {
    const map = new Map<number, Question>()
    sections.forEach((section) => section.questions.forEach((question) => map.set(question.number, question)))
    return map
  }, [sections])

  const partByNumber = useMemo(() => {
    const map = new Map<number, number>()
    sections.forEach((section, index) => section.questions.forEach((question) => map.set(question.number, index)))
    return map
  }, [sections])

  const partNumbers = useMemo(
    () => sections.map((section) => section.questions.map((question) => question.number).sort((a, b) => a - b)),
    [sections],
  )

  const totalQuestions = useMemo(
    () => sections.reduce((sum, section) => sum + section.questions.length, 0),
    [sections],
  )

  const answeredPerPart = useMemo(
    () =>
      sections.map((section) =>
        section.questions.reduce((sum, question) => sum + (isAnswered(answers[question.id]) ? 1 : 0), 0),
      ),
    [answers, sections],
  )

  const answeredTotal = useMemo(() => answeredPerPart.reduce((a, b) => a + b, 0), [answeredPerPart])

  const currentSection = sections[currentPartIndex] ?? sections[0]
  const isLastPart = currentPartIndex >= sections.length - 1

  // ----- audio playback (continuous playlist, no user controls) -----
  useEffect(() => {
    if (!started) return
    const audio = audioRef.current
    if (!audio) return
    audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
  }, [started, currentAudioIndex])

  const handleAudioEnded = () => {
    setIsPlaying(false)
    const next = currentAudioIndex + 1
    if (next < audioSources.length && audioSources[next]) {
      // Audio plays through continuously in the background. We never move the
      // user's view automatically — navigation stays manual (Next Section / nav),
      // exactly like a real CD listening exam.
      setCurrentAudioIndex(next)
    } else {
      setAudioDone(true)
    }
  }

  // ----- master countdown -----
  useEffect(() => {
    if (!started || isSubmitting) return
    const id = window.setInterval(() => {
      setTimeRemaining((value) => (value <= 1 ? 0 : value - 1))
    }, 1000)
    return () => window.clearInterval(id)
  }, [started, isSubmitting])

  const handleSubmit = useCallback(() => {
    if (isSubmitting) return
    setIsSubmitting(true)
    setConfirmSubmit(false)

    const correctAnswers = sections.reduce((sum, section) => {
      return (
        sum +
        section.questions.reduce((inner, question) => inner + (evaluate(question, answers[question.id]) ? 1 : 0), 0)
      )
    }, 0)

    const timeSpent =
      startedAtRef.current !== null
        ? Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000))
        : Math.max(1, durationMinutes * 60 - Math.max(0, timeRemaining))

    const result: TestResult = {
      testId: test.id,
      date: new Date().toISOString(),
      score: calculateBandScore(correctAnswers),
      correctAnswers,
      totalQuestions,
      timeSpent,
      answers,
      detailedBreakdown: { activeSectionIds: sections.map((section) => section.id) },
    }

    const audio = audioRef.current
    if (audio) {
      audio.pause()
    }
    onComplete(result)
  }, [answers, durationMinutes, isSubmitting, onComplete, sections, test.id, timeRemaining, totalQuestions])

  useEffect(() => {
    if (started && timeRemaining === 0 && !isSubmitting) {
      handleSubmit()
    }
  }, [handleSubmit, isSubmitting, started, timeRemaining])

  // ----- fullscreen -----
  const toggleFullscreen = useCallback(() => {
    if (typeof document === 'undefined') return
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => undefined)
    } else {
      document.exitFullscreen?.().catch(() => undefined)
    }
  }, [])

  useEffect(() => {
    const handler = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  // ----- answer helpers -----
  const setAnswerForNumber = useCallback(
    (number: number, value: string) => {
      const question = questionByNumber.get(number)
      if (!question) return
      setAnswers((prev) => ({ ...prev, [question.id]: value }))
    },
    [questionByNumber],
  )

  const getAnswerForNumber = useCallback(
    (number: number): string => {
      const question = questionByNumber.get(number)
      if (!question) return ''
      const value = answers[question.id]
      return typeof value === 'string' ? value : value === undefined ? '' : String(value)
    },
    [answers, questionByNumber],
  )

  const scrollToNumber = useCallback(
    (number: number) => {
      const targetPart = partByNumber.get(number)
      if (targetPart !== undefined && targetPart !== currentPartIndex) {
        setCurrentPartIndex(targetPart)
      }
      setActiveNumber(number)
      window.setTimeout(() => {
        const el = document.getElementById(`blank-${number}`)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          if (el instanceof HTMLInputElement) el.focus()
        }
      }, targetPart !== currentPartIndex ? 80 : 0)
    },
    [currentPartIndex, partByNumber],
  )

  const goToPart = useCallback(
    (index: number) => {
      const bounded = Math.min(Math.max(0, index), sections.length - 1)
      setCurrentPartIndex(bounded)
      if (scrollAreaRef.current) scrollAreaRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [sections.length],
  )

  const startTest = useCallback(() => {
    startedAtRef.current = Date.now()
    setStarted(true)
  }, [])

  // ----- segment + block renderers -----
  const renderSegments = (segments: ListeningSegment[]) =>
    segments.map((segment, index) => {
      if (typeof segment === 'string') {
        return <span key={index}>{segment}</span>
      }
      const number = segment.blank
      const active = activeNumber === number
      return (
        <Fragment key={index}>
          {segment.before ? <span>{segment.before}</span> : null}
          <span className="relative mx-1 inline-flex align-middle">
            <input
              id={`blank-${number}`}
              data-qnum={number}
              value={getAnswerForNumber(number)}
              disabled={isSubmitting}
              onChange={(event) => setAnswerForNumber(number, event.target.value)}
              onFocus={() => setActiveNumber(number)}
              placeholder={String(number)}
              autoComplete="off"
              spellCheck={false}
              className={`${WIDTHS[segment.width ?? 'md']} h-9 rounded-[3px] border px-2 text-center text-[15px] font-medium text-slate-900 outline-none transition placeholder:font-semibold placeholder:text-slate-300 ${
                active
                  ? 'border-red-500 bg-red-50/50 ring-2 ring-red-200'
                  : 'border-slate-400 bg-white hover:border-slate-500'
              } focus:border-red-500 focus:ring-2 focus:ring-red-200`}
            />
          </span>
          {segment.after ? <span>{segment.after}</span> : null}
        </Fragment>
      )
    })

  const renderGridRadio = (number: number, letter: string) => {
    const selected = getAnswerForNumber(number) === letter
    return (
      <button
        key={letter}
        type="button"
        disabled={isSubmitting}
        onClick={() => {
          setAnswerForNumber(number, letter)
          setActiveNumber(number)
        }}
        aria-label={`Question ${number} option ${letter}`}
        className="flex items-center justify-center py-2"
      >
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition ${
            selected ? 'border-red-600 bg-red-600' : 'border-slate-400 bg-white hover:border-red-400'
          }`}
        >
          {selected ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
        </span>
      </button>
    )
  }

  const renderBlock = (block: ListeningBlock, key: number) => {
    switch (block.kind) {
      case 'title':
        return (
          <h3 key={key} className="my-3 text-center text-lg font-bold text-slate-900">
            {block.text}
          </h3>
        )
      case 'subhead':
        return (
          <p key={key} className="mt-4 mb-1 text-[15px] font-bold text-slate-900">
            {block.text}
          </p>
        )
      case 'text':
        return (
          <p key={key} className="mt-2 text-[15px] text-slate-800">
            {block.text}
          </p>
        )
      case 'example':
        return (
          <div key={key} className="mt-1 mb-2">
            <p className="text-[13px] italic text-slate-500">Example</p>
            <p className="text-[15px] italic text-slate-700">
              {block.segments.map((segment, index) =>
                typeof segment === 'string' ? (
                  index === block.segments.length - 1 ? (
                    <span key={index} className="font-bold underline underline-offset-2">
                      {segment}
                    </span>
                  ) : (
                    <span key={index}>{segment}</span>
                  )
                ) : null,
              )}
            </p>
          </div>
        )
      case 'note':
        return (
          <div
            key={key}
            id={typeof block.segments[0] !== 'string' ? `blank-anchor-${(block.segments[0] as { blank: number }).blank}` : undefined}
            className={`flex flex-wrap items-center gap-y-2 text-[15px] leading-9 text-slate-800 ${
              block.bullet ? 'ml-6' : ''
            }`}
          >
            {block.bullet ? <span className="mr-2 text-slate-500">•</span> : null}
            {renderSegments(block.segments)}
          </div>
        )
      case 'flow':
        return (
          <div key={key} className="mx-auto my-2 flex max-w-2xl flex-col items-center">
            {block.boxes.map((box, index) => (
              <Fragment key={index}>
                <div className="flex w-full flex-wrap items-center justify-center gap-y-2 rounded-md border border-slate-400 bg-white px-4 py-4 text-center text-[15px] text-slate-800">
                  {renderSegments(box.segments)}
                </div>
                {index < block.boxes.length - 1 ? (
                  <span className="my-1 text-2xl leading-none text-slate-500">↓</span>
                ) : null}
              </Fragment>
            ))}
          </div>
        )
      case 'grid':
        return (
          <div key={key} className="my-3">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[15px]">
                <thead>
                  <tr>
                    <th className="border border-slate-300 bg-slate-50 px-3 py-2 text-left" />
                    {block.columns.map((col) => (
                      <th key={col} className="border border-slate-300 bg-slate-50 px-3 py-2 text-center font-bold text-slate-800">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row) => (
                    <tr key={row.blank} id={`blank-${row.blank}`} className={activeNumber === row.blank ? 'bg-red-50/60' : ''}>
                      <td className="border border-slate-300 px-3 py-2 text-slate-800">
                        <span className="font-bold">{row.blank}</span>
                        <span className="ml-2">{row.label}</span>
                      </td>
                      {block.columns.map((col) => (
                        <td key={col} className="border border-slate-300 text-center">
                          {renderGridRadio(row.blank, col)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {block.options && block.options.length > 0 ? (
              <div className="mt-3 inline-block rounded-md border border-slate-300">
                <table className="text-[14px]">
                  <tbody>
                    {block.options.map((option) => (
                      <tr key={option.letter}>
                        <td className="border-b border-slate-200 px-3 py-1.5 font-bold text-slate-800">{option.letter}</td>
                        <td className="border-b border-l border-slate-200 px-3 py-1.5 text-slate-700">{option.text}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </div>
        )
      case 'mcq': {
        const selected = getAnswerForNumber(block.blank)
        return (
          <div key={key} id={`blank-${block.blank}`} className={`mt-4 rounded-md p-2 ${activeNumber === block.blank ? 'bg-red-50/60' : ''}`}>
            <p className="text-[15px] font-semibold text-slate-900">
              <span className="mr-2 font-bold">{block.blank}</span>
              {block.prompt}
            </p>
            <div className="mt-2 space-y-1.5">
              {block.options.map((option, index) => {
                const letter = String.fromCharCode(65 + index)
                const isSel = selected === letter
                return (
                  <button
                    key={letter}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => {
                      setAnswerForNumber(block.blank, letter)
                      setActiveNumber(block.blank)
                    }}
                    className="flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left transition hover:bg-slate-50"
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
                        isSel ? 'border-red-600 bg-red-600' : 'border-slate-400 bg-white'
                      }`}
                    >
                      {isSel ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
                    </span>
                    <span className="text-[15px] text-slate-800">{option}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )
      }
      case 'table':
        return (
          <div key={key} className="my-3 overflow-x-auto">
            <table className="w-full border-collapse text-[15px]">
              <thead>
                <tr>
                  {block.columns.map((col) => (
                    <th key={col} className="border border-slate-300 bg-slate-50 px-3 py-2 text-center font-bold text-slate-800">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        id={typeof cell.segments[0] !== 'string' ? `blank-${(cell.segments[0] as { blank: number }).blank}` : undefined}
                        className="border border-slate-300 px-3 py-3 align-top text-slate-800"
                      >
                        <span className="inline-flex flex-wrap items-center gap-y-1 leading-9">{renderSegments(cell.segments)}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      case 'space':
        return <div key={key} className="h-3" />
      default:
        return null
    }
  }

  // ----- fallback rendering for sections without rich layout -----
  const renderFallback = (section: Section) => (
    <div className="space-y-4">
      {section.content ? (
        <p className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-[15px] text-slate-700">{section.content}</p>
      ) : null}
      {section.questions.map((question) => {
        const selected = getAnswerForNumber(question.number)
        return (
          <div key={question.id} id={`blank-${question.number}`} className="rounded-md border border-slate-200 p-3">
            <p className="text-[15px] font-semibold text-slate-900">
              <span className="mr-2 font-bold text-red-600">{question.number}</span>
              {question.text}
            </p>
            {question.type === 'multiple-choice' && question.options ? (
              <div className="mt-2 space-y-1.5">
                {question.options.map((option, index) => {
                  const letter = String.fromCharCode(65 + index)
                  const isSel = selected === letter
                  return (
                    <button
                      key={letter}
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setAnswerForNumber(question.number, letter)}
                      className="flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left hover:bg-slate-50"
                    >
                      <span className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${isSel ? 'border-red-600 bg-red-600' : 'border-slate-400'}`}>
                        {isSel ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
                      </span>
                      <span className="text-[15px] text-slate-800">{option}</span>
                    </button>
                  )
                })}
              </div>
            ) : (
              <input
                value={selected}
                disabled={isSubmitting}
                onChange={(event) => setAnswerForNumber(question.number, event.target.value)}
                placeholder="Type your answer"
                className="mt-2 h-9 w-full max-w-xs rounded-[3px] border border-slate-400 px-2 text-[15px] outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
              />
            )}
          </div>
        )
      })}
    </div>
  )

  if (!currentSection) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow">
          <h2 className="text-xl font-black text-slate-900">Listening content not ready</h2>
          <p className="mt-2 text-sm text-slate-600">No sections are attached to this test.</p>
          <button onClick={onExit} className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Back
          </button>
        </div>
      </div>
    )
  }

  const minutesLabel =
    timeRemaining >= 60
      ? `${Math.ceil(timeRemaining / 60)} minutes remaining`
      : `${Math.max(0, timeRemaining)} seconds remaining`

  return (
    <div className="flex h-screen flex-col bg-white text-slate-900">
      <audio
        ref={audioRef}
        src={audioSources[currentAudioIndex] || undefined}
        preload="auto"
        onEnded={handleAudioEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => {
          if (started) setAudioFailed(true)
        }}
      />

      {/* ---------------- Top bar ---------------- */}
      <header className="z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2.5 shadow-sm">
        <div className="flex items-center gap-3">
          <BrandMark size={36} />
          <div className="leading-tight">
            <p className="text-[15px] font-black tracking-tight text-slate-900">
              Prof<span className="text-red-600">AI</span>
            </p>
            <p className="text-[11px] font-semibold text-slate-500">IELTS Listening</p>
          </div>
          <div className="ml-4 hidden border-l border-slate-200 pl-4 sm:block">
            <p className="text-[15px] font-bold text-slate-900">{test.title}</p>
            <p className="flex items-center gap-2 text-[12px] font-medium text-slate-500">
              {minutesLabel}
              {started && isPlaying ? (
                <span className="inline-flex items-center gap-1 text-red-600">
                  <Volume2 className="h-3.5 w-3.5" />
                  Audio is playing
                </span>
              ) : null}
              {started && audioDone ? <span className="text-emerald-600">Audio finished</span> : null}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Wifi className="hidden h-5 w-5 text-slate-400 sm:block" />
          <button
            type="button"
            onClick={() => setNotesOpen((value) => !value)}
            className={`rounded-md p-2 transition hover:bg-slate-100 ${notesOpen ? 'text-red-600' : 'text-slate-600'}`}
            title="Notes"
          >
            <PencilLine className="h-5 w-5" />
          </button>
          <button type="button" onClick={toggleFullscreen} className="rounded-md p-2 text-slate-600 transition hover:bg-slate-100" title="Fullscreen">
            {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </button>
          <div className="relative">
            <button type="button" onClick={() => setMenuOpen((value) => !value)} className="rounded-md p-2 text-slate-600 transition hover:bg-slate-100" title="Menu">
              <Menu className="h-5 w-5" />
            </button>
            <AnimatePresence>
              {menuOpen ? (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="absolute right-0 top-full z-40 mt-1 w-44 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false)
                      setConfirmSubmit(true)
                    }}
                    className="block w-full px-4 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Submit test
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false)
                      onExit()
                    }}
                    className="block w-full px-4 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    Exit test
                  </button>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
          <button
            type="button"
            onClick={() => (isLastPart ? setConfirmSubmit(true) : goToPart(currentPartIndex + 1))}
            className="ml-1 inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-red-600 to-rose-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:from-red-500 hover:to-rose-500"
          >
            {isLastPart ? (
              <>
                <Send className="h-4 w-4" />
                Submit
              </>
            ) : (
              <>
                Next Section
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </header>

      {/* ---------------- Body ---------------- */}
      <div ref={scrollAreaRef} className="relative flex-1 overflow-y-auto">
        {/* Part band */}
        <div className="border-b border-slate-200 bg-slate-100 px-5 py-3">
          <p className="text-[15px] font-bold text-slate-900">{currentSection.partLabel ?? `Part ${currentPartIndex + 1}`}</p>
          <p className="text-[13px] text-slate-600">
            {currentSection.partInstruction ?? currentSection.title}
          </p>
        </div>

        <div className="mx-auto max-w-4xl px-5 py-5">
          {currentSection.groups && currentSection.groups.length > 0 ? (
            currentSection.groups.map((group, groupIndex) => (
              <section key={groupIndex} className="mb-8">
                <p className="text-[15px] font-bold text-slate-900">{group.range}</p>
                <p className="mb-3 text-[14px] text-slate-700">{group.instruction}</p>
                <div>{group.blocks.map((block, blockIndex) => renderBlock(block, blockIndex))}</div>
              </section>
            ))
          ) : (
            renderFallback(currentSection)
          )}
        </div>

        {audioFailed ? (
          <div className="mx-auto max-w-4xl px-5 pb-6">
            <p className="flex items-center gap-2 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
              <AlertTriangle className="h-4 w-4" />
              Audio yuklanmadi. Iltimos internetni tekshiring yoki audio fayllarni qayta yuklang.
            </p>
          </div>
        ) : null}
      </div>

      {/* ---------------- Bottom navigation ---------------- */}
      <nav className="z-30 flex items-stretch gap-1 overflow-x-auto border-t border-slate-200 bg-white px-3 py-2 shadow-[0_-4px_12px_rgba(15,23,42,0.06)]">
        {sections.map((section, index) => {
          const isActive = index === currentPartIndex
          const numbers = partNumbers[index] ?? []
          return (
            <div key={section.id} className={`flex items-center gap-2 rounded-md px-2 ${isActive ? '' : 'cursor-pointer hover:bg-slate-50'} ${index < sections.length - 1 ? 'border-r border-slate-200' : ''}`} onClick={isActive ? undefined : () => goToPart(index)}>
              <span className={`whitespace-nowrap text-[13px] font-bold ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                Part {index + 1}
              </span>
              {isActive ? (
                <div className="flex items-center gap-1">
                  {numbers.map((number) => {
                    const answered = isAnswered(answers[questionByNumber.get(number)?.id ?? ''])
                    const current = activeNumber === number
                    return (
                      <button
                        key={number}
                        type="button"
                        onClick={() => scrollToNumber(number)}
                        className={`h-7 w-7 rounded-[4px] border text-[12px] font-bold transition ${
                          current
                            ? 'border-red-600 bg-red-600 text-white'
                            : answered
                              ? 'border-red-300 bg-red-100 text-red-700'
                              : 'border-slate-300 bg-white text-slate-600 hover:border-red-400'
                        }`}
                      >
                        {number}
                      </button>
                    )
                  })}
                </div>
              ) : (
                <span className="whitespace-nowrap text-[12px] font-medium text-slate-400">
                  {answeredPerPart[index]} of {numbers.length}
                </span>
              )}
            </div>
          )
        })}
        <div className="ml-auto flex items-center gap-2 pl-2">
          <span className="hidden whitespace-nowrap text-[12px] font-semibold text-slate-500 sm:block">
            {answeredTotal}/{totalQuestions} answered
          </span>
        </div>
      </nav>

      {/* ---------------- Intro / Play overlay ---------------- */}
      <AnimatePresence>
        {!started ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 px-4 backdrop-blur-[1px]"
          >
            <motion.div
              initial={{ scale: 0.94, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 10 }}
              className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-900 text-white">
                <Headphones className="h-10 w-10" />
              </div>
              <p className="mt-5 text-[15px] leading-relaxed text-slate-700">
                You will be listening to an audio clip during this test. You will not be permitted to pause or rewind the
                audio while answering the questions.
              </p>
              <p className="mt-4 text-[15px] font-semibold text-slate-900">To continue, click Play.</p>
              <button
                type="button"
                onClick={startTest}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-3 text-base font-bold text-white shadow-lg transition hover:bg-slate-800"
              >
                <Play className="h-5 w-5 fill-white" />
                Play
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* ---------------- Submit confirm ---------------- */}
      <AnimatePresence>
        {confirmSubmit ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4"
            onClick={() => setConfirmSubmit(false)}
          >
            <motion.div
              initial={{ scale: 0.94 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.94 }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl"
            >
              <h3 className="text-lg font-black text-slate-900">Submit your test?</h3>
              <p className="mt-2 text-sm text-slate-600">
                You have answered <span className="font-bold text-slate-900">{answeredTotal}</span> of {totalQuestions}{' '}
                questions. You can&apos;t change answers after submitting.
              </p>
              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmSubmit(false)}
                  className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  Keep working
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 px-4 py-2.5 text-sm font-bold text-white hover:from-red-500 hover:to-rose-500"
                >
                  Submit now
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* ---------------- Notes scratchpad ---------------- */}
      <AnimatePresence>
        {notesOpen ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed bottom-20 right-4 z-40 w-72 rounded-xl border border-slate-200 bg-white p-3 shadow-xl"
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-bold text-slate-800">Notes</p>
              <button type="button" onClick={() => setNotesOpen(false)} className="rounded p-1 text-slate-400 hover:bg-slate-100">
                <X className="h-4 w-4" />
              </button>
            </div>
            <textarea
              value={notesText}
              onChange={(event) => setNotesText(event.target.value)}
              placeholder="Scratch notes (not graded)…"
              className="h-40 w-full resize-none rounded-md border border-slate-200 p-2 text-sm outline-none focus:border-red-400"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
