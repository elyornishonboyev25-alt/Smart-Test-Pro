import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Bell, CalendarClock, CheckCircle2, Crown, Gem, Globe, Lock, Mail, Phone, Save, ShieldCheck, SlidersHorizontal, Sparkles, Target, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, type AuthState } from '@/store/authStore'
import { useSpeakerSocialStore, speakerHandle } from '@/store/speakerSocialStore'
import { useToastStore, type ToastState } from '@/store/toastStore'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useMotionPreferences } from '@/hooks/useMotionPreferences'
import { CountUp, Reveal } from '@/components/fx'

type ExamTarget = 'IELTS' | 'SAT' | 'BOTH'

type ProfileDraft = {
  fullName: string
  email: string
  phone: string
  country: string
  timezone: string
  targetExam: ExamTarget
  targetScore: string
  examDate: string
  bio: string
}

type PreferenceDraft = {
  twoFactor: boolean
  loginAlerts: boolean
  weeklyReport: boolean
  speakingSessionReminders: boolean
  marketingUpdates: boolean
  compactView: boolean
}

const DEFAULT_PREFERENCES: PreferenceDraft = {
  twoFactor: true,
  loginAlerts: true,
  weeklyReport: true,
  speakingSessionReminders: true,
  marketingUpdates: false,
  compactView: false,
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function safeText(value: unknown, fallback = '') {
  if (typeof value === 'string') return value
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  return fallback
}

function safeBoolean(value: unknown, fallback: boolean) {
  return typeof value === 'boolean' ? value : fallback
}

function safeExamTarget(value: unknown): ExamTarget {
  return value === 'IELTS' || value === 'SAT' || value === 'BOTH' ? value : 'BOTH'
}

function normalizeProfileDraft(value: unknown, fallback: ProfileDraft): ProfileDraft {
  const source = isRecord(value) ? value : {}

  return {
    fullName: safeText(source.fullName, fallback.fullName),
    email: safeText(source.email, fallback.email),
    phone: safeText(source.phone, fallback.phone),
    country: safeText(source.country, fallback.country),
    timezone: safeText(source.timezone, fallback.timezone),
    targetExam: safeExamTarget(source.targetExam),
    targetScore: safeText(source.targetScore, fallback.targetScore),
    examDate: safeText(source.examDate, fallback.examDate),
    bio: safeText(source.bio, fallback.bio),
  }
}

function normalizePreferenceDraft(value: unknown): PreferenceDraft {
  const source = isRecord(value) ? value : {}

  return {
    twoFactor: safeBoolean(source.twoFactor, DEFAULT_PREFERENCES.twoFactor),
    loginAlerts: safeBoolean(source.loginAlerts, DEFAULT_PREFERENCES.loginAlerts),
    weeklyReport: safeBoolean(source.weeklyReport, DEFAULT_PREFERENCES.weeklyReport),
    speakingSessionReminders: safeBoolean(source.speakingSessionReminders, DEFAULT_PREFERENCES.speakingSessionReminders),
    marketingUpdates: safeBoolean(source.marketingUpdates, DEFAULT_PREFERENCES.marketingUpdates),
    compactView: safeBoolean(source.compactView, DEFAULT_PREFERENCES.compactView),
  }
}

function ToggleRow({
  label,
  detail,
  enabled,
  onToggle,
}: {
  label: string
  detail: string
  enabled: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-start justify-between gap-3 rounded-xl border border-red-200 bg-white/90 px-3 py-2.5 text-left"
    >
      <div>
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        <p className="mt-0.5 text-xs leading-5 text-slate-600">{detail}</p>
      </div>
      <span
        className={`mt-0.5 inline-flex h-6 min-w-[2.7rem] items-center rounded-full border px-1 transition ${
          enabled
            ? 'justify-end border-red-300 bg-red-100'
            : 'justify-start border-slate-300 bg-slate-100'
        }`}
      >
        <span className="h-4 w-4 rounded-full bg-white shadow-sm" />
      </span>
    </button>
  )
}

export default function AccountProfile() {
  const navigate = useNavigate()
  const user = useAuthStore((state: AuthState) => state.user)
  const pushToast = useToastStore((state: ToastState) => state.pushToast)
  const { allowHoverMotion, minimalMotion } = useMotionPreferences()

  const nicknames = useSpeakerSocialStore((state) => state.nicknames)
  const setNickname = useSpeakerSocialStore((state) => state.setNickname)
  const savedNickname = user?.id ? nicknames[user.id] ?? '' : ''
  const [nicknameDraft, setNicknameDraft] = useState(savedNickname)
  useEffect(() => {
    setNicknameDraft(savedNickname)
  }, [savedNickname])

  const saveNickname = () => {
    if (!user?.id) return
    setNickname(user.id, nicknameDraft || user.fullName)
    pushToast({ type: 'success', title: 'Nickname saved', message: 'Your public speaking handle has been updated.' })
  }

  const initialProfile = useMemo<ProfileDraft>(
    () => ({
      fullName: user?.fullName ?? '',
      email: user?.email ?? '',
      phone: '',
      country: 'Uzbekistan',
      timezone: 'Asia/Tashkent',
      targetExam: 'BOTH',
      targetScore: '',
      examDate: '',
      bio: '',
    }),
    [user?.email, user?.fullName],
  )

  const [savedProfile, setSavedProfile] = useLocalStorage<ProfileDraft>('smarttest-account-profile-v1', initialProfile)
  const [savedPreferences, setSavedPreferences] = useLocalStorage<PreferenceDraft>('smarttest-account-preferences-v1', DEFAULT_PREFERENCES)
  const normalizedSavedProfile = useMemo(
    () => normalizeProfileDraft(savedProfile, initialProfile),
    [initialProfile, savedProfile],
  )
  const preferences = useMemo(
    () => normalizePreferenceDraft(savedPreferences),
    [savedPreferences],
  )

  const [form, setForm] = useState<ProfileDraft>(() => normalizedSavedProfile)

  useEffect(() => {
    setForm(normalizedSavedProfile)
  }, [normalizedSavedProfile])

  useEffect(() => {
    if (!normalizedSavedProfile.fullName && user?.fullName) {
      setForm((prev) => ({ ...prev, fullName: user.fullName, email: user.email ?? prev.email }))
    }
  }, [normalizedSavedProfile.fullName, user?.email, user?.fullName])

  const completion = useMemo(() => {
    const requiredFields = [form.fullName, form.email, form.phone, form.country, form.timezone, form.targetScore, form.examDate]
    const filled = requiredFields.filter((entry) => safeText(entry).trim().length > 0).length
    return Math.round((filled / requiredFields.length) * 100)
  }, [form])

  const securityLevel = useMemo(() => {
    const score =
      (preferences.twoFactor ? 40 : 0) +
      (preferences.loginAlerts ? 30 : 0) +
      (preferences.weeklyReport ? 15 : 0) +
      (preferences.speakingSessionReminders ? 15 : 0)

    if (score >= 80) return { label: 'High', score }
    if (score >= 50) return { label: 'Medium', score }
    return { label: 'Basic', score }
  }, [preferences.loginAlerts, preferences.speakingSessionReminders, preferences.twoFactor, preferences.weeklyReport])

  const updateField = <K extends keyof ProfileDraft>(field: K, value: ProfileDraft[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const togglePreference = (field: keyof PreferenceDraft) => {
    setSavedPreferences((prev) => {
      const safePrevious = normalizePreferenceDraft(prev)
      return { ...safePrevious, [field]: !safePrevious[field] }
    })
  }

  const saveProfile = () => {
    const normalizedForm = normalizeProfileDraft(form, initialProfile)
    setForm(normalizedForm)
    setSavedProfile(normalizedForm)
    pushToast({
      type: 'success',
      title: 'Profile saved',
      message: 'Your profile has been saved successfully.',
    })
  }

  const resetProfile = () => {
    const cleanProfile = normalizeProfileDraft(initialProfile, initialProfile)
    setForm(cleanProfile)
    pushToast({
      type: 'info',
      title: 'Draft reset',
      message: 'Profile fields were reset to default values.',
    })
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Reveal>
        <motion.section
          initial={minimalMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={minimalMotion ? { duration: 0.14 } : { duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          className="premium-hero p-6 sm:p-9"
        >
        <div className="relative grid gap-4 xl:grid-cols-[minmax(0,1fr)_25rem] xl:items-start">
          <div className="xl:pr-2">
            <div className="premium-top-controls">
              <button
                onClick={() => navigate('/dashboard')}
                className="premium-back-btn"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Home
              </button>
              <span className="premium-top-chip">
                <Sparkles className="h-3.5 w-3.5" />
                Account Center
              </span>
            </div>
            <h1 className="premium-section-title mt-4">
              Personal <span className="arena-title-accent-red">Profile Studio</span>
            </h1>
            <p className="premium-section-subtitle">
              Manage your identity, exam targets, privacy, and learning preferences in one professional account workspace.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-3 xl:w-full">
            <div className="hero-metric-card interactive-lift">
              <p className="hero-metric-label">Profile Complete</p>
              <p className="hero-metric-value-sm">
                <CountUp value={completion} suffix="%" />
              </p>
              <p className="hero-metric-note">Personal setup</p>
            </div>
            <div className="hero-metric-card interactive-lift">
              <p className="hero-metric-label">Security</p>
              <p className="hero-metric-value-sm hero-metric-value-compact">{securityLevel.label}</p>
              <p className="hero-metric-note">Score {securityLevel.score}/100</p>
            </div>
            <div className="hero-metric-card interactive-lift">
              <p className="hero-metric-label">Target Track</p>
              <p className="hero-metric-value-sm hero-metric-value-compact">{form.targetExam}</p>
              <p className="hero-metric-note">Main exam focus</p>
            </div>
          </div>
        </div>
        </motion.section>
      </Reveal>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="surface-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="inline-flex items-center gap-2 text-xl font-semibold text-slate-900">
              <UserRound className="h-5 w-5 text-red-600" />
              Personal Information
            </h2>
            <span className="soft-chip">Required for account verification</span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Full Name
              <input
                value={form.fullName}
                onChange={(event) => updateField('fullName', event.target.value)}
                className="input mt-1"
                placeholder="Your full name"
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Email
              <input
                type="email"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                className="input mt-1"
                placeholder="name@example.com"
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Phone
              <input
                value={form.phone}
                onChange={(event) => updateField('phone', event.target.value)}
                className="input mt-1"
                placeholder="+998 ..."
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Country
              <input
                value={form.country}
                onChange={(event) => updateField('country', event.target.value)}
                className="input mt-1"
                placeholder="Country"
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Timezone
              <input
                value={form.timezone}
                onChange={(event) => updateField('timezone', event.target.value)}
                className="input mt-1"
                placeholder="Asia/Tashkent"
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Target Exam
              <select
                value={form.targetExam}
                onChange={(event) => updateField('targetExam', event.target.value as ExamTarget)}
                className="input mt-1"
              >
                <option value="BOTH">IELTS + SAT</option>
                <option value="IELTS">IELTS</option>
                <option value="SAT">SAT</option>
              </select>
            </label>

            <label className="text-sm font-medium text-slate-700">
              Target Score
              <input
                value={form.targetScore}
                onChange={(event) => updateField('targetScore', event.target.value)}
                className="input mt-1"
                placeholder="IELTS 7.5 / SAT 1450"
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Exam Date
              <input
                type="date"
                value={form.examDate}
                onChange={(event) => updateField('examDate', event.target.value)}
                className="input mt-1"
              />
            </label>
          </div>

          <label className="mt-3 block text-sm font-medium text-slate-700">
            Bio
            <textarea
              value={form.bio}
              onChange={(event) => updateField('bio', event.target.value)}
              className="input mt-1 min-h-[92px] resize-y"
              placeholder="Short introduction, study goals, preferred pace..."
            />
          </label>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={saveProfile}
              className="arena-primary-btn"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Profile
            </button>
            <button
              type="button"
              onClick={resetProfile}
              className="arena-secondary-btn"
            >
              Reset Draft
            </button>
          </div>
        </article>

        <div className="space-y-6">
          <article className="surface-card p-6">
            <h2 className="inline-flex items-center gap-2 text-xl font-semibold text-slate-900">
              <ShieldCheck className="h-5 w-5 text-red-600" />
              Security & Privacy
            </h2>
            <div className="mt-4 space-y-2.5">
              <ToggleRow
                label="Two-factor authentication"
                detail="Second verification step for account login."
                enabled={preferences.twoFactor}
                onToggle={() => togglePreference('twoFactor')}
              />
              <ToggleRow
                label="Login alerts"
                detail="Receive notification for new device access."
                enabled={preferences.loginAlerts}
                onToggle={() => togglePreference('loginAlerts')}
              />
              <ToggleRow
                label="Compact dashboard view"
                detail="Reduce visual density for focused workflow."
                enabled={preferences.compactView}
                onToggle={() => togglePreference('compactView')}
              />
            </div>
          </article>

          <article className="surface-card p-6">
            <h2 className="inline-flex items-center gap-2 text-xl font-semibold text-slate-900">
              <SlidersHorizontal className="h-5 w-5 text-red-600" />
              Notifications
            </h2>
            <div className="mt-4 space-y-2.5">
              <ToggleRow
                label="Weekly performance report"
                detail="Summary of score trends and weaknesses."
                enabled={preferences.weeklyReport}
                onToggle={() => togglePreference('weeklyReport')}
              />
              <ToggleRow
                label="Speaking session reminders"
                detail="Reminder before booked voice speaking sessions."
                enabled={preferences.speakingSessionReminders}
                onToggle={() => togglePreference('speakingSessionReminders')}
              />
              <ToggleRow
                label="Product updates"
                detail="Receive feature and platform release notices."
                enabled={preferences.marketingUpdates}
                onToggle={() => togglePreference('marketingUpdates')}
              />
            </div>
          </article>
        </div>
      </section>

      <section className="mt-6 surface-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="inline-flex items-center gap-2 text-xl font-semibold text-slate-900">
            <Sparkles className="h-5 w-5 text-red-600" />
            Public Speaking Identity
          </h2>
          <span className="soft-chip">Shown on your speaker profile</span>
        </div>
        <p className="mt-2 text-sm text-slate-600">
          Choose a nickname other learners see when they find you in the Speaking Community. This is your public handle —
          no messaging, speaking practice only.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex-1 text-sm font-medium text-slate-700">
            Nickname / handle
            <input
              value={nicknameDraft}
              onChange={(event) => setNicknameDraft(event.target.value)}
              className="input mt-1"
              placeholder={user?.fullName ? speakerHandle(user.id, user.fullName, nicknames) : 'your_handle'}
              maxLength={24}
            />
          </label>
          <button type="button" onClick={saveNickname} disabled={!user} className="arena-primary-btn justify-center disabled:opacity-50">
            <Save className="mr-2 h-4 w-4" />
            Save nickname
          </button>
          <button type="button" onClick={() => navigate('/speaker/me')} className="arena-secondary-btn justify-center">
            View my profile
          </button>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-red-100 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Crown className="h-4 w-4 text-red-600" />
              Access Plan
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Analyze Mistakes, Performance Dashboard, Vocabulary Arena, and Mock Arena are open for every user.
            </p>
          </div>
          <span
            className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
          >
            Open Access
          </span>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <motion.article
          whileHover={allowHoverMotion ? { y: -3 } : undefined}
          className="surface-card p-4"
        >
          <p className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-red-700">
            <Mail className="h-3.5 w-3.5" />
            Primary Email
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-800">{form.email || 'Not set'}</p>
        </motion.article>

        <motion.article
          whileHover={allowHoverMotion ? { y: -3 } : undefined}
          className="surface-card p-4"
        >
          <p className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-red-700">
            <Target className="h-3.5 w-3.5" />
            Target Score
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-800">{form.targetScore || 'Not set'}</p>
        </motion.article>

        <motion.article
          whileHover={allowHoverMotion ? { y: -3 } : undefined}
          className="surface-card p-4"
        >
          <p className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-red-700">
            <Gem className="h-3.5 w-3.5" />
            Account Level
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-800">
            {user ? `Level ${user.level} | ${user.xp} XP` : 'Sign in required'}
          </p>
        </motion.article>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="surface-card p-4">
          <p className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-red-700">
            <CalendarClock className="h-3.5 w-3.5" />
            Exam Date
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-800">{form.examDate || 'Not selected'}</p>
        </div>
        <div className="surface-card p-4">
          <p className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-red-700">
            <Globe className="h-3.5 w-3.5" />
            Timezone
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-800">{form.timezone || 'Not selected'}</p>
        </div>
        <div className="surface-card p-4">
          <p className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-red-700">
            <Phone className="h-3.5 w-3.5" />
            Contact
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-800">{form.phone || 'Not provided'}</p>
        </div>
        <div className="surface-card p-4">
          <p className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-red-700">
            <Lock className="h-3.5 w-3.5" />
            Security Check
          </p>
          <p className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-slate-800">
            <CheckCircle2 className="h-4 w-4 text-red-600" />
            {securityLevel.label}
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-red-100 bg-gradient-to-r from-red-50/55 via-white to-red-50/45 px-4 py-3">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-red-700">
          <Bell className="h-4 w-4" />
          Profile settings are stored on this device and ready for backend sync integration.
        </p>
      </section>
    </div>
  )
}

