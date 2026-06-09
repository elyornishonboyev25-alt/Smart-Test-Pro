import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Clock,
  BookmarkIcon,
  RotateCcw,
  Send,
  Timer,
  TimerOff,
  AlertTriangle,
  CheckCircle2,
  PenLine,
} from 'lucide-react'
import type { WritingTask, LineChartData, ChartSeries } from '@/data/writingTestData'

type Props = {
  task: WritingTask
  onExit: () => void
}

function LineChart({ chart }: { chart: LineChartData }) {
  const padding = { top: 40, right: 30, bottom: 50, left: 60 }
  const width = 520
  const height = 340
  const plotW = width - padding.left - padding.right
  const plotH = height - padding.top - padding.bottom

  const allYears = chart.series[0]?.data.map((d) => d.year) ?? []
  const allValues = chart.series.flatMap((s) => s.data.map((d) => d.value))
  const minYear = Math.min(...allYears)
  const maxYear = Math.max(...allYears)
  const maxVal = Math.ceil(Math.max(...allValues) / 1000) * 1000

  const xScale = (year: number) => padding.left + ((year - minYear) / (maxYear - minYear)) * plotW
  const yScale = (val: number) => padding.top + plotH - (val / maxVal) * plotH

  const yTicks: number[] = []
  for (let v = 0; v <= maxVal; v += 1000) yTicks.push(v)

  function buildPath(series: ChartSeries) {
    return series.data
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(d.year)} ${yScale(d.value)}`)
      .join(' ')
  }

  return (
    <div className="flex flex-col items-center">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[520px]">
        <text
          x={width / 2}
          y={18}
          textAnchor="middle"
          className="fill-slate-800 text-[13px] font-bold"
        >
          {chart.title}
        </text>

        <g className="legend" transform={`translate(${width / 2 - 100}, 28)`}>
          <line x1="0" y1="4" x2="24" y2="4" stroke="#1e293b" strokeWidth="2" />
          <circle cx="12" cy="4" r="3" fill="#1e293b" />
          <text x="30" y="8" className="fill-slate-700 text-[10px]">Closures</text>
          <line x1="100" y1="4" x2="124" y2="4" stroke="#1e293b" strokeWidth="2" strokeDasharray="6 4" />
          <circle cx="112" cy="4" r="3" fill="#1e293b" />
          <text x="130" y="8" className="fill-slate-700 text-[10px]">Openings</text>
        </g>

        {yTicks.map((v) => (
          <g key={v}>
            <line
              x1={padding.left}
              y1={yScale(v)}
              x2={padding.left + plotW}
              y2={yScale(v)}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
            <text
              x={padding.left - 8}
              y={yScale(v) + 4}
              textAnchor="end"
              className="fill-slate-500 text-[10px]"
            >
              {v === 0 ? '0' : v.toLocaleString()}
            </text>
          </g>
        ))}

        {allYears.map((year) => (
          <text
            key={year}
            x={xScale(year)}
            y={height - 10}
            textAnchor="middle"
            className="fill-slate-600 text-[10px]"
          >
            {year}
          </text>
        ))}

        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={padding.top + plotH}
          stroke="#94a3b8"
          strokeWidth="1"
        />
        <line
          x1={padding.left}
          y1={padding.top + plotH}
          x2={padding.left + plotW}
          y2={padding.top + plotH}
          stroke="#94a3b8"
          strokeWidth="1"
        />

        {chart.series.map((series, idx) => (
          <g key={series.label}>
            <path
              d={buildPath(series)}
              fill="none"
              stroke="#1e293b"
              strokeWidth="2"
              strokeDasharray={series.style === 'dashed' ? '8 5' : 'none'}
            />
            {series.data.map((d) => (
              <circle
                key={`${idx}-${d.year}`}
                cx={xScale(d.year)}
                cy={yScale(d.value)}
                r="4"
                fill={idx === 0 ? '#1e293b' : '#fff'}
                stroke="#1e293b"
                strokeWidth="2"
              />
            ))}
          </g>
        ))}
      </svg>
    </div>
  )
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function countWords(text: string): number {
  const trimmed = text.trim()
  if (!trimmed) return 0
  return trimmed.split(/\s+/).length
}

export default function IELTSWritingTestInterface({ task, onExit }: Props) {
  const [phase, setPhase] = useState<'landing' | 'writing' | 'submitted'>('landing')
  const [timerEnabled, setTimerEnabled] = useState(true)
  const [timeRemaining, setTimeRemaining] = useState(task.durationMinutes * 60)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [answer, setAnswer] = useState('')
  const [bookmarked, setBookmarked] = useState(false)
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const wordCount = countWords(answer)
  const { min: minWords, max: maxWords } = task.suggestedWordCount

  useEffect(() => {
    if (!isTimerRunning || !timerEnabled) return
    if (timeRemaining <= 0) {
      setIsTimerRunning(false)
      return
    }
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsTimerRunning(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [isTimerRunning, timerEnabled, timeRemaining])

  const handleStart = useCallback(
    (withTimer: boolean) => {
      setTimerEnabled(withTimer)
      setTimeRemaining(task.durationMinutes * 60)
      setIsTimerRunning(withTimer)
      setPhase('writing')
      setTimeout(() => textareaRef.current?.focus(), 100)
    },
    [task.durationMinutes],
  )

  const handleReset = useCallback(() => {
    setTimeRemaining(task.durationMinutes * 60)
    setIsTimerRunning(timerEnabled)
  }, [task.durationMinutes, timerEnabled])

  const handleSubmit = useCallback(() => {
    setIsTimerRunning(false)
    setPhase('submitted')
    setShowSubmitConfirm(false)
  }, [])

  const handleExitConfirm = useCallback(() => {
    setShowExitConfirm(false)
    onExit()
  }, [onExit])

  if (phase === 'landing') {
    return (
      <div className="min-h-screen bg-[linear-gradient(160deg,#fff7f7_0%,#fee2e2_52%,#fff_100%)] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-rose-200/40 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-orange-200/30 blur-3xl" />
        </div>

        <div className="max-w-4xl w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl lg:text-5xl font-black mb-4 tracking-tight bg-gradient-to-r from-red-600 via-rose-500 to-orange-400 bg-clip-text text-transparent">
              IELTS Writing {task.taskType === 'task1' ? 'Task 1' : 'Task 2'}
            </h1>
            <p className="text-slate-500 text-base font-light max-w-xl mx-auto">
              {task.taskType === 'task1'
                ? 'Summarise visual information in at least 150 words. Choose your preferred mode below.'
                : 'Write an essay of at least 250 words in response to a point of view, argument, or problem.'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleStart(true)}
              className="group relative overflow-hidden rounded-3xl border border-red-100 bg-white/95 p-8 text-left shadow-[0_24px_55px_-36px_rgba(239,68,68,0.45)] backdrop-blur-xl transition-all cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-rose-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:scale-110 transition-transform">
                    <Timer className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Timed Mode</h3>
                    <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
                      Exam Simulation
                    </span>
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 italic">
                  Practice under real exam conditions with a {task.durationMinutes}-minute countdown timer.
                  Build your time management skills.
                </p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-2 text-xs font-semibold text-rose-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    Strict {task.durationMinutes}-minute limit
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    Real-time word counter
                  </div>
                </div>
                <div className="w-full py-3.5 bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-red-500/25 group-hover:from-red-500 group-hover:to-rose-500 transition-all">
                  Start with Timer
                </div>
              </div>
            </motion.button>

            <motion.button
              type="button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleStart(false)}
              className="group relative overflow-hidden rounded-3xl border border-red-100 bg-white/95 p-8 text-left shadow-[0_24px_55px_-36px_rgba(239,68,68,0.35)] backdrop-blur-xl transition-all cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
                    <TimerOff className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Free Mode</h3>
                    <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">
                      No Time Limit
                    </span>
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 italic">
                  Write at your own pace without time pressure. Perfect for learning structure and
                  vocabulary.
                </p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    Unlimited writing time
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Focus on quality and structure
                  </div>
                </div>
                <div className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-orange-500/25 group-hover:from-orange-400 group-hover:to-amber-400 transition-all">
                  Start Without Timer
                </div>
              </div>
            </motion.button>
          </div>

          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <button
              type="button"
              onClick={onExit}
              className="text-sm text-slate-500 hover:text-red-600 transition-colors flex items-center gap-2 mx-auto px-6 py-2 rounded-full border border-slate-200 hover:border-red-200 hover:bg-red-50/30"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Writing Tests
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  if (phase === 'submitted') {
    return (
      <div className="min-h-screen bg-[linear-gradient(160deg,#fff7f7_0%,#fee2e2_52%,#fff_100%)] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-green-200/20 blur-3xl" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="relative z-10 w-full max-w-2xl rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-[0_30px_60px_rgba(16,185,129,0.15)]"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/25">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="mt-5 text-3xl font-black text-slate-900">Response Submitted</h2>
          <p className="mt-2 text-slate-600">
            You wrote <strong className="text-emerald-700">{wordCount} words</strong>
            {timerEnabled && (
              <>
                {' '}
                in{' '}
                <strong className="text-emerald-700">
                  {formatTime(task.durationMinutes * 60 - timeRemaining)}
                </strong>
              </>
            )}
          </p>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-left">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
              Your Response
            </p>
            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
              {answer || '(empty)'}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={onExit}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tests
            </button>
            <button
              type="button"
              onClick={() => {
                setAnswer('')
                setTimeRemaining(task.durationMinutes * 60)
                setPhase('landing')
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-500/20 hover:brightness-105 transition"
            >
              <RotateCcw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  const timerColor =
    timerEnabled && timeRemaining < 120
      ? 'text-red-600'
      : timerEnabled && timeRemaining < 300
        ? 'text-amber-600'
        : 'text-slate-700'

  const wordCountColor =
    wordCount >= minWords && wordCount <= maxWords
      ? 'text-emerald-600'
      : wordCount > maxWords
        ? 'text-amber-600'
        : 'text-slate-500'

  return (
    <div className="flex h-screen flex-col bg-white">
      <AnimatePresence>
        {showExitConfirm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/50 backdrop-blur-md"
              onClick={() => setShowExitConfirm(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              className="relative w-full max-w-md rounded-3xl border border-red-100 bg-white p-6 text-center shadow-[0_30px_70px_rgba(220,38,38,0.22)]"
            >
              <div className="absolute inset-x-0 top-0 h-1.5 rounded-t-3xl bg-gradient-to-r from-red-600 via-rose-500 to-orange-400" />
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <AlertTriangle className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-xl font-black text-slate-900">Leave this test?</h3>
              <p className="mt-2 text-sm text-slate-600">
                Your response will be lost. Are you sure you want to exit?
              </p>
              <div className="mt-5 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowExitConfirm(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  Continue Writing
                </button>
                <button
                  type="button"
                  onClick={handleExitConfirm}
                  className="rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-500/20 hover:brightness-105"
                >
                  Exit Test
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSubmitConfirm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/50 backdrop-blur-md"
              onClick={() => setShowSubmitConfirm(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              className="relative w-full max-w-md rounded-3xl border border-emerald-100 bg-white p-6 text-center shadow-[0_30px_70px_rgba(16,185,129,0.2)]"
            >
              <div className="absolute inset-x-0 top-0 h-1.5 rounded-t-3xl bg-gradient-to-r from-emerald-500 to-green-500" />
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <Send className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-xl font-black text-slate-900">Submit your response?</h3>
              <p className="mt-2 text-sm text-slate-600">
                You've written <strong>{wordCount}</strong> words.
                {wordCount < minWords && (
                  <span className="text-amber-600">
                    {' '}
                    The suggested minimum is {minWords} words.
                  </span>
                )}
              </p>
              <div className="mt-5 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitConfirm(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  Keep Writing
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 hover:brightness-105"
                >
                  Submit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <header className="flex items-center justify-between border-b border-red-100 bg-gradient-to-r from-white via-red-50/30 to-white px-4 py-2.5 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => (answer.trim() ? setShowExitConfirm(true) : onExit())}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 bg-white text-slate-600 shadow-sm hover:bg-red-50 hover:text-red-600 transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-sm font-bold text-slate-900">
              {task.title} · {task.taskType === 'task1' ? 'Task 1' : 'Task 2'}
            </h1>
            <p className="text-[11px] text-slate-500">{task.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {timerEnabled && (
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-3 py-1.5 font-mono text-base font-black ${timerColor} shadow-sm`}
              >
                <Clock className="h-4 w-4" />
                {formatTime(timeRemaining)}
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex h-9 items-center gap-1 rounded-xl border border-red-200 bg-white px-2.5 text-xs font-semibold text-red-600 shadow-sm hover:bg-red-50 transition"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={() => setBookmarked(!bookmarked)}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border shadow-sm transition ${
              bookmarked
                ? 'border-amber-300 bg-amber-100 text-amber-700'
                : 'border-red-200 bg-white text-slate-500 hover:text-amber-600 hover:border-amber-300'
            }`}
          >
            <BookmarkIcon className="h-4 w-4" fill={bookmarked ? 'currentColor' : 'none'} />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 overflow-y-auto border-r border-red-100 bg-gradient-to-b from-white via-red-50/20 to-white p-5 sm:p-6 lg:p-8">
          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
            <p className="text-[15px] leading-relaxed text-slate-800 whitespace-pre-line">
              {task.prompt}
            </p>
          </div>

          {task.chart && task.chart.type === 'line' && (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <LineChart chart={task.chart} />
            </div>
          )}
        </div>

        <div className="flex w-1/2 flex-col bg-gradient-to-b from-white via-slate-50/30 to-white">
          <div className="flex-1 overflow-hidden p-5 sm:p-6 lg:p-8">
            <div className="relative flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <textarea
                ref={textareaRef}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Write your response here..."
                className="flex-1 resize-none p-5 text-[15px] leading-relaxed text-slate-800 placeholder:text-slate-400 outline-none"
              />
              <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2.5">
                <span className="text-xs text-slate-500">
                  Suggested word count: {minWords}–{maxWords}
                </span>
                <span className={`text-xs font-bold ${wordCountColor}`}>
                  {wordCount}/{task.maxWordCount}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 sm:px-6">
            <div className="flex items-center gap-2">
              <PenLine className="h-4 w-4 text-slate-400" />
              <span className={`text-sm font-semibold ${wordCountColor}`}>
                {wordCount} {wordCount === 1 ? 'word' : 'words'}
              </span>
              {wordCount >= minWords && wordCount <= maxWords && (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  <CheckCircle2 className="h-3 w-3" />
                  Good range
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setShowSubmitConfirm(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-500/20 hover:brightness-105 transition"
            >
              <Send className="h-4 w-4" />
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
