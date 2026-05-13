import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { createPortal } from 'react-dom'
import { CalendarRange, CheckCircle2, ClipboardPlus, Clock3, Lock, Sparkles } from 'lucide-react'
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

export default function WeeklyPlannerLab() {
  const user = useAuthStore((state: AuthState) => state.user)

  const [profile, setProfile] = useState<OnboardingProfile | null>(null)
  const [plan, setPlan] = useState<WeeklyPlan | null>(null)
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardingStep, setOnboardingStep] = useState<1 | 2>(1)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [targetExam, setTargetExam] = useState<ExamTarget>('IELTS')
  const [daysToExam, setDaysToExam] = useState(30)
  const [dailyHours, setDailyHours] = useState(3)

  const [customTitle, setCustomTitle] = useState('')
  const [customDuration, setCustomDuration] = useState(30)
  const [customDayId, setCustomDayId] = useState<string>('')

  const [activityRefreshToken, setActivityRefreshToken] = useState(0)

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
    const timerId = window.setInterval(() => {
      setActivityRefreshToken((value) => value + 1)
    }, 60000)

    return () => {
      window.clearInterval(timerId)
    }
  }, [])

  useEffect(() => {
    if (!showOnboarding || typeof document === 'undefined') return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [showOnboarding])

  const activityLog = useMemo(() => loadActivityLog(user?.id), [user?.id, activityRefreshToken])

  const selectedDay = useMemo(() => {
    if (!plan) return null
    return plan.days.find((day) => day.id === selectedDayId) ?? plan.days[0] ?? null
  }, [plan, selectedDayId])

  const generatedCompletedCount = useMemo(() => {
    if (!selectedDay) return 0
    return selectedDay.generatedTasks.filter((task) => taskAutoCompleted(task, selectedDay.dateISO, activityLog)).length
  }, [activityLog, selectedDay])

  const createOnboarding = () => {
    const safeFirst = firstName.trim()
    const safeLast = lastName.trim()

    if (!safeFirst || !safeLast) return

    const nextProfile: OnboardingProfile = {
      firstName: safeFirst,
      lastName: safeLast,
      targetExam,
      daysToExam: Math.max(1, daysToExam),
      dailyHours: Math.max(3, dailyHours),
      createdAt: new Date().toISOString(),
    }

    const nextPlan = generateWeeklyPlan(nextProfile, new Date())
    const defaultDayId = resolveDefaultDayId(nextPlan)

    saveOnboardingProfile(nextProfile, user?.id)
    saveWeeklyPlan(nextPlan, user?.id)

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

  const onboardingModal = showOnboarding ? (
    <div className="fixed inset-0 z-[280] bg-slate-950/70 px-4 py-6" onClick={() => {}}>
      <div className="flex min-h-full items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-3xl rounded-[2rem] border border-red-200/80 bg-[linear-gradient(145deg,#ffffff_0%,#fff4f5_48%,#fffefe_100%)] p-6 shadow-[0_40px_90px_rgba(15,23,42,0.32)] sm:p-8"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-red-700">
                <Sparkles className="h-3.5 w-3.5" />
                First-Time Setup
              </p>
              <h2 className="mt-3 text-3xl font-black text-slate-900">Build Your Weekly Study Plan</h2>
              <p className="mt-2 text-sm text-slate-600">We need your profile to generate a personalized 7-day lab plan.</p>
            </div>
            <span className="rounded-xl border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
              Step {onboardingStep} / 2
            </span>
          </div>

          {onboardingStep === 1 ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700">
                First Name
                <input
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  placeholder="Enter first name"
                  className="mt-1 h-11 w-full rounded-xl border border-red-100 bg-white px-3 text-sm text-slate-800 outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Last Name
                <input
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  placeholder="Enter last name"
                  className="mt-1 h-11 w-full rounded-xl border border-red-100 bg-white px-3 text-sm text-slate-800 outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100"
                />
              </label>

              <div className="sm:col-span-2">
                <p className="text-sm font-semibold text-slate-700">Target Exam</p>
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  {([
                    { key: 'IELTS', label: 'IELTS' },
                    { key: 'SAT', label: 'SAT' },
                    { key: 'BOTH', label: 'Both' },
                  ] as const).map((entry) => (
                    <button
                      key={entry.key}
                      type="button"
                      onClick={() => setTargetExam(entry.key)}
                      className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                        targetExam === entry.key
                          ? 'border-red-300 bg-gradient-to-r from-red-600 to-rose-600 text-white'
                          : 'border-red-100 bg-white text-slate-700 hover:border-red-200 hover:bg-red-50'
                      }`}
                    >
                      {entry.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700">
                Days Until Exam
                <input
                  type="number"
                  min={1}
                  value={daysToExam}
                  onChange={(event) => setDaysToExam(Number(event.target.value) || 1)}
                  className="mt-1 h-11 w-full rounded-xl border border-red-100 bg-white px-3 text-sm text-slate-800 outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100"
                />
              </label>

              <label className="text-sm font-semibold text-slate-700">
                Daily Study Hours (min 3)
                <input
                  type="number"
                  min={3}
                  step={0.5}
                  value={dailyHours}
                  onChange={(event) => setDailyHours(Number(event.target.value) || 3)}
                  className="mt-1 h-11 w-full rounded-xl border border-red-100 bg-white px-3 text-sm text-slate-800 outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100"
                />
              </label>

              <div className="sm:col-span-2 rounded-2xl border border-red-100 bg-red-50/55 p-4 text-sm text-slate-700">
                The planner will auto-generate one rolling week (Monday-Sunday), keep generated tasks locked, and auto-complete them after 30 active minutes in relevant modules.
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap justify-between gap-2">
            <div>
              {onboardingStep === 2 ? (
                <button
                  type="button"
                  onClick={() => setOnboardingStep(1)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Back
                </button>
              ) : null}
            </div>

            <div className="flex gap-2">
              {onboardingStep === 1 ? (
                <button
                  type="button"
                  onClick={() => setOnboardingStep(2)}
                  disabled={!firstName.trim() || !lastName.trim()}
                  className="rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(220,38,38,0.3)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  onClick={createOnboarding}
                  className="rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(220,38,38,0.3)]"
                >
                  Generate Plan
                </button>
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
          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            <div className="rounded-2xl border border-red-100 bg-white p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-red-600">Learner</p>
              <p className="mt-1 text-lg font-black text-slate-900">{profile.firstName} {profile.lastName}</p>
            </div>
            <div className="rounded-2xl border border-red-100 bg-white p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-red-600">Target Exam</p>
              <p className="mt-1 text-lg font-black text-slate-900">{profile.targetExam}</p>
            </div>
            <div className="rounded-2xl border border-red-100 bg-white p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-red-600">Daily Hours</p>
              <p className="mt-1 text-lg font-black text-slate-900">{profile.dailyHours}h</p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-red-100 bg-white p-4">
            <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-red-600">
              <ClipboardPlus className="h-3.5 w-3.5" />
              Add Custom Task
            </p>
            <div className="mt-2 grid gap-2 lg:grid-cols-[220px_minmax(0,1fr)_120px_auto]">
              <select
                value={customDayId || selectedDay?.id || ''}
                onChange={(event) => setCustomDayId(event.target.value)}
                className="h-11 rounded-xl border border-red-100 bg-white px-3 text-sm text-slate-800 outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100"
              >
                {plan.days.map((day) => (
                  <option key={day.id} value={day.id}>{day.weekdayLabel}</option>
                ))}
              </select>
              <input
                value={customTitle}
                onChange={(event) => setCustomTitle(event.target.value)}
                placeholder="New custom task title"
                className="h-11 rounded-xl border border-red-100 bg-white px-3 text-sm text-slate-800 outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100"
              />
              <input
                type="number"
                min={10}
                value={customDuration}
                onChange={(event) => setCustomDuration(Number(event.target.value) || 10)}
                className="h-11 rounded-xl border border-red-100 bg-white px-3 text-sm text-slate-800 outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100"
              />
              <button
                type="button"
                onClick={addCustomTask}
                className="h-11 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-4 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(220,38,38,0.3)]"
              >
                Add
              </button>
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[220px_1fr]">
            <aside className="space-y-2">
              {plan.days.map((day) => {
                const selected = selectedDay?.id === day.id
                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => {
                      setSelectedDayId(day.id)
                      setCustomDayId(day.id)
                    }}
                    className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                      selected
                        ? 'border-red-300 bg-gradient-to-r from-red-600 to-rose-600 text-white'
                        : 'border-red-100 bg-white text-slate-700 hover:border-red-200 hover:bg-red-50'
                    }`}
                  >
                    <p className="text-sm font-bold">{day.weekdayLabel}</p>
                    <p className={`text-xs ${selected ? 'text-red-100' : 'text-slate-500'}`}>{day.dateISO}</p>
                  </button>
                )
              })}
            </aside>

            <div className="rounded-2xl border border-red-100 bg-white p-4">
              {selectedDay ? (
                <>
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-xl font-black text-slate-900">{selectedDay.weekdayLabel} Plan</h3>
                    <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                      Auto complete: {generatedCompletedCount}/{selectedDay.generatedTasks.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {selectedDay.generatedTasks.map((task) => {
                      const completed = taskAutoCompleted(task, selectedDay.dateISO, activityLog)
                      return (
                        <div
                          key={task.id}
                          className={`rounded-xl border px-3 py-3 ${
                            completed
                              ? 'border-emerald-200 bg-emerald-50/55'
                              : 'border-red-100 bg-red-50/40'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{task.title}</p>
                              <p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-600">
                                <Clock3 className="h-3.5 w-3.5" />
                                {task.durationMinutes} min planned | {task.requiredMinutes} min required
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {completed ? (
                                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  Auto Completed
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">
                                  <Lock className="h-3.5 w-3.5" />
                                  System Controlled
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {selectedDay.customTasks.length > 0 ? (
                    <div className="mt-4">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-red-600">Custom Tasks</p>
                      <div className="space-y-2">
                        {selectedDay.customTasks.map((task) => (
                          <button
                            key={task.id}
                            type="button"
                            onClick={() => toggleCustom(selectedDay.id, task.id)}
                            className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left transition ${
                              task.completed
                                ? 'border-emerald-200 bg-emerald-50/60 text-emerald-800'
                                : 'border-red-100 bg-white text-slate-700 hover:bg-red-50'
                            }`}
                          >
                            <span className="text-sm font-semibold">{task.title}</span>
                            <span className="text-xs font-semibold">
                              {task.completed ? 'Completed' : `${task.durationMinutes} min`}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </>
              ) : (
                <p className="text-sm text-slate-600">No selected day.</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="mt-4 rounded-2xl border border-red-100 bg-white p-4 text-sm text-slate-600">
          Planner setup is required before using this section.
        </div>
      )}

      {typeof document !== 'undefined' && onboardingModal ? createPortal(onboardingModal, document.body) : onboardingModal}
    </section>
  )
}
