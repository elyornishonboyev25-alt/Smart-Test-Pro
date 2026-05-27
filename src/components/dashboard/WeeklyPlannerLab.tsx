import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { createPortal } from 'react-dom'
import {
  BookOpen,
  Calculator,
  CalendarRange,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardPlus,
  Clock3,
  Lock,
  Sparkles,
  Trophy,
  User,
} from 'lucide-react'
import { useAuthStore, type AuthState } from '@/store/authStore'
import {
  addCustomTaskToDay,
  ensureRollingWeek,
  generateWeeklyPlan,
  loadActivityLog,
  loadOnboardingProfile,
  loadWeeklyPlan,
  saveOnboardingProfile,
  saveWeeklyPlan,
  taskAutoCompleted,
  toggleCustomTask,
  type ExamTarget,
  type OnboardingProfile,
  type WeeklyPlan,
} from '@/utils/weeklyPlanner'

function toDateISO(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function resolveDefaultDayId(weeklyPlan: WeeklyPlan) {
  const todayISO = toDateISO(new Date())
  return weeklyPlan.days.find((day) => day.dateISO === todayISO)?.id ?? weeklyPlan.days[0]?.id ?? null
}

function saveToAccountProfile(firstName: string, lastName: string, targetExam: ExamTarget) {
  try {
    const key = 'smarttest-account-profile-v1'
    const existing = localStorage.getItem(key)
    const prev = existing ? JSON.parse(existing) : {}
    const updated = { ...prev, fullName: `${firstName} ${lastName}`.trim(), targetExam }
    localStorage.setItem(key, JSON.stringify(updated))
  } catch {
    // ignore
  }
}

const EXAM_CARDS = [
  {
    key: 'IELTS' as ExamTarget,
    label: 'IELTS',
    subtitle: 'Academic & General Training',
    modules: ['Reading', 'Listening', 'Writing', 'Speaking'],
  },
  {
    key: 'SAT' as ExamTarget,
    label: 'SAT',
    subtitle: 'Scholastic Assessment Test',
    modules: ['Math', 'Reading & Writing'],
  },
  {
    key: 'BOTH' as ExamTarget,
    label: 'Both',
    subtitle: 'Complete Preparation',
    modules: ['IELTS', 'SAT', 'All 6 Modules'],
  },
]

const DAY_PRESETS = [
  { label: '21 days', value: 21, badge: 'Intensive', badgeColor: 'bg-red-100 text-red-700' },
  { label: '30 days', value: 30, badge: 'Focused', badgeColor: 'bg-orange-100 text-orange-700' },
  { label: '60 days', value: 60, badge: 'Standard', badgeColor: 'bg-amber-100 text-amber-700' },
  { label: '90 days', value: 90, badge: 'Comfortable', badgeColor: 'bg-green-100 text-green-700' },
  { label: '180+ days', value: 180, badge: 'Long-term', badgeColor: 'bg-blue-100 text-blue-700' },
]

const HOURS_OPTIONS = [3, 4, 5, 6]

const STEP_LABELS = ['Profile', 'Timeline', 'Generate']

const slideVariants = {
  enterRight: { x: 60, opacity: 0 },
  enterLeft: { x: -60, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exitLeft: { x: -60, opacity: 0 },
  exitRight: { x: 60, opacity: 0 },
}

export default function WeeklyPlannerLab() {
  const user = useAuthStore((state: AuthState) => state.user)

  const [profile, setProfile] = useState<OnboardingProfile | null>(null)
  const [plan, setPlan] = useState<WeeklyPlan | null>(null)
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardingStep, setOnboardingStep] = useState<1 | 2 | 3>(1)
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [targetExam, setTargetExam] = useState<ExamTarget>('IELTS')
  const [daysToExam, setDaysToExam] = useState(60)
  const [customDays, setCustomDays] = useState('')
  const [useCustomDays, setUseCustomDays] = useState(false)
  const [dailyHours, setDailyHours] = useState(3)

  const [customTitle, setCustomTitle] = useState('')
  const [customDuration, setCustomDuration] = useState(30)
  const [customDayId, setCustomDayId] = useState<string>('')
  const [activityRefreshToken, setActivityRefreshToken] = useState(0)

  const firstNameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const storedProfile = loadOnboardingProfile(user?.id)
    if (!storedProfile) {
      setProfile(null)
      setPlan(null)
      setShowOnboarding(true)
      return
    }
    const storedPlan = loadWeeklyPlan(user?.id)
    const rollingPlan = ensureRollingWeek(storedProfile, storedPlan, new Date())
    const defaultDayId = resolveDefaultDayId(rollingPlan)
    setProfile(storedProfile)
    setPlan(rollingPlan)
    setSelectedDayId(defaultDayId)
    setCustomDayId(defaultDayId ?? '')
    saveWeeklyPlan(rollingPlan, user?.id)
    setShowOnboarding(false)
  }, [user?.id])

  useEffect(() => {
    const timerId = window.setInterval(() => setActivityRefreshToken((v) => v + 1), 60000)
    return () => window.clearInterval(timerId)
  }, [])

  useEffect(() => {
    if (!showOnboarding || typeof document === 'undefined') return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [showOnboarding])

  useEffect(() => {
    if (showOnboarding && onboardingStep === 1) {
      setTimeout(() => firstNameRef.current?.focus(), 200)
    }
  }, [showOnboarding, onboardingStep])

  const activityLog = useMemo(() => loadActivityLog(user?.id), [user?.id, activityRefreshToken])

  const selectedDay = useMemo(() => {
    if (!plan) return null
    return plan.days.find((d) => d.id === selectedDayId) ?? plan.days[0] ?? null
  }, [plan, selectedDayId])

  const generatedCompletedCount = useMemo(() => {
    if (!selectedDay) return 0
    return selectedDay.generatedTasks.filter((t) => taskAutoCompleted(t, selectedDay.dateISO, activityLog)).length
  }, [activityLog, selectedDay])

  const resolvedDays = useCustomDays ? Math.max(1, Number(customDays) || 1) : daysToExam

  const planIntensity = resolvedDays <= 21
    ? { label: 'Intensive', color: 'text-red-700 bg-red-50' }
    : resolvedDays <= 60
    ? { label: 'Focused', color: 'text-orange-700 bg-orange-50' }
    : { label: 'Standard', color: 'text-green-700 bg-green-50' }

  const goToStep = (next: 1 | 2 | 3, dir: 'forward' | 'back') => {
    setDirection(dir)
    setOnboardingStep(next)
  }

  const createOnboarding = () => {
    const safeFirst = firstName.trim()
    const safeLast = lastName.trim()
    if (!safeFirst || !safeLast) return

    const nextProfile: OnboardingProfile = {
      firstName: safeFirst,
      lastName: safeLast,
      targetExam,
      daysToExam: Math.max(1, resolvedDays),
      dailyHours: Math.max(3, dailyHours),
      createdAt: new Date().toISOString(),
    }

    const nextPlan = generateWeeklyPlan(nextProfile, new Date())
    const defaultDayId = resolveDefaultDayId(nextPlan)

    saveOnboardingProfile(nextProfile, user?.id)
    saveWeeklyPlan(nextPlan, user?.id)
    saveToAccountProfile(safeFirst, safeLast, targetExam)

    setProfile(nextProfile)
    setPlan(nextPlan)
    setSelectedDayId(defaultDayId)
    setCustomDayId(defaultDayId ?? '')
    setShowOnboarding(false)
    setOnboardingStep(1)
  }

  const addCustomTask = () => {
    if (!plan || !customTitle.trim()) return
    const dayId = customDayId || selectedDay?.id
    if (!dayId) return
    const nextPlan = addCustomTaskToDay(plan, dayId, {
      title: customTitle,
      durationMinutes: Math.max(10, customDuration),
    })
    setPlan(nextPlan)
    saveWeeklyPlan(nextPlan, user?.id)
    setCustomTitle('')
    setCustomDuration(30)
  }

  const toggleCustom = (dayId: string, taskId: string) => {
    if (!plan) return
    const nextPlan = toggleCustomTask(plan, dayId, taskId)
    setPlan(nextPlan)
    saveWeeklyPlan(nextPlan, user?.id)
  }

  const selectedExamCard = EXAM_CARDS.find((c) => c.key === targetExam)!

  const onboardingModal = showOnboarding ? (
    <div className="fixed inset-0 z-[280] overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm"
      />

      <div className="relative flex min-h-full items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-[0_48px_100px_rgba(15,23,42,0.38)]"
        >
          {/* Top gradient strip */}
          <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-rose-500 to-red-600" />

          {/* Header */}
          <div className="relative px-7 pt-7 pb-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-red-700">
                  <Sparkles className="h-3 w-3" />
                  First-Time Setup
                </span>
                <h2 className="mt-3 text-[1.75rem] font-black leading-tight text-slate-900">
                  {onboardingStep === 1 && 'Build Your Study Profile'}
                  {onboardingStep === 2 && 'Set Your Study Timeline'}
                  {onboardingStep === 3 && 'Your Plan is Ready'}
                </h2>
                <p className="mt-1.5 text-sm text-slate-500">
                  {onboardingStep === 1 && "Tell us about yourself so we can tailor your 7-day study plan."}
                  {onboardingStep === 2 && "Set your exam deadline and daily study capacity."}
                  {onboardingStep === 3 && "Review your personalized plan before we generate it."}
                </p>
              </div>

              {/* Step indicator */}
              <div className="flex shrink-0 flex-col items-end gap-2">
                <div className="flex items-center gap-1.5">
                  {([1, 2, 3] as const).map((step) => (
                    <div
                      key={step}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        step === onboardingStep
                          ? 'w-6 bg-red-600'
                          : step < onboardingStep
                          ? 'w-2 bg-red-300'
                          : 'w-2 bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-slate-400">
                  Step {onboardingStep} of 3
                </span>
              </div>
            </div>
          </div>

          {/* Step content with slide animation */}
          <div className="overflow-hidden px-7 pb-7 pt-6">
            <AnimatePresence mode="wait" initial={false}>
              {onboardingStep === 1 && (
                <motion.div
                  key="step1"
                  variants={slideVariants}
                  initial={direction === 'forward' ? 'enterRight' : 'enterLeft'}
                  animate="center"
                  exit={direction === 'forward' ? 'exitLeft' : 'exitRight'}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Name inputs */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-[0.1em] text-slate-500 mb-1.5">
                        First Name
                      </label>
                      <div className="relative">
                        <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          ref={firstNameRef}
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Enter first name"
                          className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm font-medium text-slate-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-[0.1em] text-slate-500 mb-1.5">
                        Last Name
                      </label>
                      <input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Enter last name"
                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                      />
                    </div>
                  </div>

                  {/* Exam target */}
                  <div className="mt-6">
                    <label className="block text-xs font-bold uppercase tracking-[0.1em] text-slate-500 mb-3">
                      What are you preparing for?
                    </label>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {EXAM_CARDS.map((card) => {
                        const selected = targetExam === card.key
                        return (
                          <button
                            key={card.key}
                            type="button"
                            onClick={() => setTargetExam(card.key)}
                            className={`group relative overflow-hidden rounded-2xl border-2 p-4 text-left transition-all duration-200 ${
                              selected
                                ? 'border-red-500 bg-gradient-to-br from-red-600 to-rose-600 shadow-[0_8px_24px_rgba(220,38,38,0.32)]'
                                : 'border-slate-200 bg-white hover:border-red-200 hover:shadow-md'
                            }`}
                          >
                            {selected && (
                              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_60%)]" />
                            )}
                            <div className={`mb-2.5 inline-flex h-9 w-9 items-center justify-center rounded-xl ${
                              selected ? 'bg-white/20' : 'bg-red-50'
                            }`}>
                              {card.key === 'IELTS' && <BookOpen className={`h-4.5 w-4.5 ${selected ? 'text-white' : 'text-red-600'}`} />}
                              {card.key === 'SAT' && <Calculator className={`h-4.5 w-4.5 ${selected ? 'text-white' : 'text-red-600'}`} />}
                              {card.key === 'BOTH' && <Trophy className={`h-4.5 w-4.5 ${selected ? 'text-white' : 'text-red-600'}`} />}
                            </div>
                            <p className={`text-base font-black ${selected ? 'text-white' : 'text-slate-900'}`}>
                              {card.label}
                            </p>
                            <p className={`mt-0.5 text-[11px] font-medium leading-tight ${selected ? 'text-red-100' : 'text-slate-500'}`}>
                              {card.subtitle}
                            </p>
                            <div className="mt-2.5 flex flex-wrap gap-1">
                              {card.modules.map((mod) => (
                                <span
                                  key={mod}
                                  className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
                                    selected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                                  }`}
                                >
                                  {mod}
                                </span>
                              ))}
                            </div>
                            {selected && (
                              <div className="absolute right-3 top-3">
                                <CheckCircle2 className="h-4 w-4 text-white/80" />
                              </div>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {onboardingStep === 2 && (
                <motion.div
                  key="step2"
                  variants={slideVariants}
                  initial={direction === 'forward' ? 'enterRight' : 'enterLeft'}
                  animate="center"
                  exit={direction === 'forward' ? 'exitLeft' : 'exitRight'}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Days to exam */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-[0.1em] text-slate-500 mb-3">
                      How many days until your exam?
                    </label>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                      {DAY_PRESETS.map((preset) => (
                        <button
                          key={preset.value}
                          type="button"
                          onClick={() => { setDaysToExam(preset.value); setUseCustomDays(false) }}
                          className={`flex flex-col items-center rounded-xl border-2 px-2 py-3 transition-all duration-150 ${
                            !useCustomDays && daysToExam === preset.value
                              ? 'border-red-500 bg-red-600 shadow-[0_6px_16px_rgba(220,38,38,0.28)]'
                              : 'border-slate-200 bg-white hover:border-red-200'
                          }`}
                        >
                          <span className={`text-sm font-black ${!useCustomDays && daysToExam === preset.value ? 'text-white' : 'text-slate-800'}`}>
                            {preset.label}
                          </span>
                          <span className={`mt-1 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
                            !useCustomDays && daysToExam === preset.value ? 'bg-white/25 text-white' : preset.badgeColor
                          }`}>
                            {preset.badge}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Custom days input */}
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setUseCustomDays(!useCustomDays)}
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition ${
                          useCustomDays ? 'border-red-500 bg-red-600' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {useCustomDays && <CheckCircle2 className="h-3 w-3 text-white" />}
                      </button>
                      <span className="text-xs font-semibold text-slate-600">Custom:</span>
                      <input
                        type="number"
                        min={1}
                        placeholder="e.g. 45"
                        value={customDays}
                        onFocus={() => setUseCustomDays(true)}
                        onChange={(e) => { setCustomDays(e.target.value); setUseCustomDays(true) }}
                        className="h-9 w-24 rounded-lg border border-slate-200 bg-white px-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                      />
                      <span className="text-xs text-slate-500">days</span>
                    </div>
                  </div>

                  {/* Daily hours */}
                  <div className="mt-6">
                    <label className="block text-xs font-bold uppercase tracking-[0.1em] text-slate-500 mb-3">
                      How many hours can you study daily? <span className="normal-case font-normal text-slate-400">(min 3h)</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {HOURS_OPTIONS.map((h) => (
                        <button
                          key={h}
                          type="button"
                          onClick={() => setDailyHours(h)}
                          className={`flex h-14 w-16 flex-col items-center justify-center rounded-xl border-2 transition-all duration-150 ${
                            dailyHours === h
                              ? 'border-red-500 bg-red-600 shadow-[0_6px_16px_rgba(220,38,38,0.28)]'
                              : 'border-slate-200 bg-white hover:border-red-200'
                          }`}
                        >
                          <span className={`text-lg font-black ${dailyHours === h ? 'text-white' : 'text-slate-800'}`}>{h}h</span>
                          <span className={`text-[9px] font-semibold uppercase ${dailyHours === h ? 'text-red-100' : 'text-slate-400'}`}>
                            {h === 3 ? 'min' : h === 4 ? 'good' : h === 5 ? 'great' : 'max'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Info box */}
                  <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50/60 p-3.5">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100">
                      <Sparkles className="h-3.5 w-3.5 text-red-600" />
                    </div>
                    <p className="text-xs leading-relaxed text-slate-600">
                      Your rolling week plan auto-updates every Monday. System tasks are marked complete after 30 active minutes in the relevant module.
                    </p>
                  </div>
                </motion.div>
              )}

              {onboardingStep === 3 && (
                <motion.div
                  key="step3"
                  variants={slideVariants}
                  initial={direction === 'forward' ? 'enterRight' : 'enterLeft'}
                  animate="center"
                  exit={direction === 'forward' ? 'exitLeft' : 'exitRight'}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Summary card */}
                  <div className="overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white shadow-sm">
                    <div className="h-1 w-full bg-gradient-to-r from-red-600 to-rose-500" />
                    <div className="p-5">
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400 mb-4">Your Study Plan Summary</p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Learner</p>
                          <p className="mt-1 text-base font-black text-slate-900">{firstName} {lastName}</p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Target Exam</p>
                          <p className="mt-1 text-base font-black text-slate-900">{selectedExamCard.label}</p>
                          <p className="text-[11px] text-slate-500">{selectedExamCard.subtitle}</p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Days to Exam</p>
                          <p className="mt-1 text-base font-black text-slate-900">{resolvedDays} days</p>
                          <span className={`inline-block mt-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${planIntensity.color}`}>
                            {planIntensity.label} Plan
                          </span>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Daily Study</p>
                          <p className="mt-1 text-base font-black text-slate-900">{dailyHours} hours/day</p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {selectedExamCard.modules.map((mod) => (
                          <span key={mod} className="rounded-lg border border-red-100 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                            {mod}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-center text-sm text-slate-500">
                    Your 7-day rolling plan will be generated with daily tasks for each module.
                    Tasks auto-complete as you study.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between border-t border-slate-100 px-7 py-4">
            <div>
              {onboardingStep > 1 ? (
                <button
                  type="button"
                  onClick={() => goToStep((onboardingStep - 1) as 1 | 2 | 3, 'back')}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>
              ) : (
                <div />
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Step dots */}
              <div className="hidden sm:flex items-center gap-1.5 mr-1">
                {STEP_LABELS.map((label, i) => (
                  <div key={label} className="flex items-center gap-1">
                    <div className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black transition-all ${
                      i + 1 === onboardingStep
                        ? 'bg-red-600 text-white shadow-[0_4px_10px_rgba(220,38,38,0.4)]'
                        : i + 1 < onboardingStep
                        ? 'bg-red-100 text-red-600'
                        : 'bg-slate-100 text-slate-400'
                    }`}>
                      {i + 1 < onboardingStep ? <CheckCircle2 className="h-3 w-3" /> : i + 1}
                    </div>
                    {i < 2 && <div className={`h-px w-5 ${i + 1 < onboardingStep ? 'bg-red-300' : 'bg-slate-200'}`} />}
                  </div>
                ))}
              </div>

              {onboardingStep < 3 ? (
                <button
                  type="button"
                  onClick={() => goToStep((onboardingStep + 1) as 2 | 3, 'forward')}
                  disabled={onboardingStep === 1 && (!firstName.trim() || !lastName.trim())}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(220,38,38,0.32)] transition hover:shadow-[0_10px_24px_rgba(220,38,38,0.42)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Continue
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <motion.button
                  type="button"
                  onClick={createOnboarding}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-6 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(220,38,38,0.36)] transition hover:shadow-[0_12px_28px_rgba(220,38,38,0.46)]"
                >
                  <Sparkles className="h-4 w-4" />
                  Generate My Plan
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  ) : null

  return (
    <section className="panel-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Weekly Planner Lab</h2>
          <p className="mt-1 text-sm text-slate-600">
            Generated tasks are system-controlled. Custom tasks are editable and manually checkable.
          </p>
        </div>
        <div className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
          <CalendarRange className="h-3.5 w-3.5" />
          Rolling 7-Day Window
        </div>
      </div>

      {profile && plan ? (
        <>
          {/* Profile summary */}
          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            <div className="rounded-2xl border border-red-100 bg-white p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-red-600">Learner</p>
              <p className="mt-1 text-lg font-black text-slate-900">{profile.firstName} {profile.lastName}</p>
            </div>
            <div className="rounded-2xl border border-red-100 bg-white p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-red-600">Target Exam</p>
              <p className="mt-1 text-lg font-black text-slate-900">{profile.targetExam}</p>
            </div>
            <div className="rounded-2xl border border-red-100 bg-white p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-red-600">Daily Hours</p>
              <p className="mt-1 text-lg font-black text-slate-900">{profile.dailyHours}h</p>
            </div>
          </div>

          {/* Custom task adder */}
          <div className="mt-4 rounded-2xl border border-red-100 bg-white p-4">
            <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-red-600">
              <ClipboardPlus className="h-3.5 w-3.5" />
              Add Custom Task
            </p>
            <div className="mt-2.5 grid gap-2 lg:grid-cols-[200px_minmax(0,1fr)_110px_auto]">
              <select
                value={customDayId || selectedDay?.id || ''}
                onChange={(e) => setCustomDayId(e.target.value)}
                className="h-11 rounded-xl border border-red-100 bg-white px-3 text-sm text-slate-800 outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100"
              >
                {plan.days.map((day) => (
                  <option key={day.id} value={day.id}>{day.weekdayLabel}</option>
                ))}
              </select>
              <input
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="New custom task title"
                onKeyDown={(e) => e.key === 'Enter' && addCustomTask()}
                className="h-11 rounded-xl border border-red-100 bg-white px-3 text-sm text-slate-800 outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100"
              />
              <input
                type="number"
                min={10}
                value={customDuration}
                onChange={(e) => setCustomDuration(Number(e.target.value) || 10)}
                className="h-11 rounded-xl border border-red-100 bg-white px-3 text-sm text-slate-800 outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100"
              />
              <button
                type="button"
                onClick={addCustomTask}
                className="h-11 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-4 text-sm font-bold text-white shadow-[0_6px_16px_rgba(220,38,38,0.28)] transition hover:shadow-[0_8px_20px_rgba(220,38,38,0.38)]"
              >
                Add
              </button>
            </div>
          </div>

          {/* Day selector + tasks */}
          <div className="mt-4 grid gap-4 lg:grid-cols-[200px_1fr]">
            <aside className="space-y-2">
              {plan.days.map((day) => {
                const selected = selectedDay?.id === day.id
                const dayCompleted = day.generatedTasks.filter((t) => taskAutoCompleted(t, day.dateISO, activityLog)).length
                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => { setSelectedDayId(day.id); setCustomDayId(day.id) }}
                    className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                      selected
                        ? 'border-red-300 bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-[0_4px_12px_rgba(220,38,38,0.28)]'
                        : 'border-red-100 bg-white text-slate-700 hover:border-red-200 hover:bg-red-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-sm font-bold">{day.weekdayLabel}</p>
                      {dayCompleted > 0 && (
                        <span className={`text-[10px] font-semibold rounded-full px-1.5 py-0.5 ${selected ? 'bg-white/25 text-white' : 'bg-emerald-100 text-emerald-700'}`}>
                          {dayCompleted}/{day.generatedTasks.length}
                        </span>
                      )}
                    </div>
                    <p className={`text-xs ${selected ? 'text-red-100' : 'text-slate-500'}`}>{day.dateISO}</p>
                  </button>
                )
              })}
            </aside>

            <div className="rounded-2xl border border-red-100 bg-white p-5">
              {selectedDay ? (
                <>
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-xl font-black text-slate-900">{selectedDay.weekdayLabel} Plan</h3>
                    <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                      Auto complete: {generatedCompletedCount}/{selectedDay.generatedTasks.length}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {selectedDay.generatedTasks.map((task) => {
                      const completed = taskAutoCompleted(task, selectedDay.dateISO, activityLog)
                      return (
                        <motion.div
                          key={task.id}
                          layout
                          className={`rounded-xl border px-4 py-3.5 transition-colors ${
                            completed
                              ? 'border-emerald-200 bg-emerald-50/60'
                              : 'border-slate-200 bg-slate-50/60'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{task.title}</p>
                              <p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500">
                                <Clock3 className="h-3.5 w-3.5" />
                                {task.durationMinutes} min planned · {task.requiredMinutes} min required
                              </p>
                            </div>
                            {completed ? (
                              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Auto Completed
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-500">
                                <Lock className="h-3.5 w-3.5" />
                                System Controlled
                              </span>
                            )}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>

                  {selectedDay.customTasks.length > 0 && (
                    <div className="mt-5">
                      <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.12em] text-red-600">
                        Custom Tasks
                      </p>
                      <div className="space-y-2">
                        {selectedDay.customTasks.map((task) => (
                          <button
                            key={task.id}
                            type="button"
                            onClick={() => toggleCustom(selectedDay.id, task.id)}
                            className={`flex w-full items-center justify-between rounded-xl border px-4 py-2.5 text-left transition ${
                              task.completed
                                ? 'border-emerald-200 bg-emerald-50/60 text-emerald-800'
                                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className={`flex h-4.5 w-4.5 items-center justify-center rounded-full border-2 ${
                                task.completed ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300'
                              }`}>
                                {task.completed && <CheckCircle2 className="h-2.5 w-2.5 text-white" />}
                              </div>
                              <span className={`text-sm font-semibold ${task.completed ? 'line-through opacity-70' : ''}`}>
                                {task.title}
                              </span>
                            </div>
                            <span className="text-xs font-semibold text-slate-500">
                              {task.completed ? '✓ Done' : `${task.durationMinutes} min`}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-slate-500">No day selected.</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="mt-4 rounded-2xl border border-red-100 bg-white p-4 text-sm text-slate-500">
          Planner setup is required before using this section.
        </div>
      )}

      {typeof document !== 'undefined' && onboardingModal
        ? createPortal(onboardingModal, document.body)
        : onboardingModal}
    </section>
  )
}
