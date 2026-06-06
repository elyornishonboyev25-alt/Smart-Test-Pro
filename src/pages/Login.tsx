import { useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Flame, Loader2, Lock, Mail, ShieldCheck, Sparkles, Star } from 'lucide-react'
import { apiClient } from '@/lib/apiClient'
import { useAuthStore, type AuthState } from '@/store/authStore'
import { useToastStore, type ToastState } from '@/store/toastStore'
import { useMotionPreferences } from '@/hooks/useMotionPreferences'
import { BrandMark } from '@/components/brand/BrandLogo'
import GoogleAuthButton from '@/components/auth/GoogleAuthButton'

const loginSchema = z.object({
  email: z
    .string()
    .email('Valid Gmail address is required')
    .refine((value) => value.toLowerCase().endsWith('@gmail.com'), 'Use your Gmail address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

type AuthSessionPayload = {
  user: {
    id: string
    fullName: string
    email: string
    role: 'USER' | 'ADMIN'
    premium: boolean
    xp: number
    level: number
    currentStreak: number
  }
  accessToken: string
  refreshToken: string
}

const TRUST_CHIPS = [
  { icon: Flame, label: 'Daily streaks' },
  { icon: Star, label: 'XP & levels' },
  { icon: Sparkles, label: 'AI coach' },
] as const

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const setSession = useAuthStore((state: AuthState) => state.setSession)
  const pushToast = useToastStore((state: ToastState) => state.pushToast)
  const { minimalMotion } = useMotionPreferences()

  const redirectPath = useMemo(() => {
    const state = location.state as { from?: { pathname?: string } } | null
    return state?.from?.pathname ?? '/dashboard'
  }, [location.state])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const payload = await apiClient.post<AuthSessionPayload>(
        '/auth/login',
        {
          email: values.email.trim().toLowerCase(),
          password: values.password,
        },
        { auth: false },
      )

      setSession(payload)
      pushToast({
        type: 'success',
        title: 'Signed in successfully',
        message: 'Welcome back to SmartTest Pro.',
      })
      navigate(redirectPath, { replace: true })
    } catch (error) {
      pushToast({
        type: 'error',
        title: 'Sign in failed',
        message: error instanceof Error ? error.message : 'Unable to sign in',
      })
    }
  }

  const handleGoogleCredential = async (idToken: string) => {
    try {
      const payload = await apiClient.post<AuthSessionPayload>(
        '/auth/google',
        { idToken },
        { auth: false },
      )

      setSession(payload)
      pushToast({
        type: 'success',
        title: 'Signed in with Google',
        message: 'Welcome to SmartTest Pro.',
      })
      // Full reload guarantees the persisted session is hydrated and the
      // destination route renders immediately (fixes the blank-until-refresh
      // behaviour after the Google popup closes).
      window.location.assign(redirectPath)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Google sign-in failed'
      pushToast({
        type: 'error',
        title: 'Google sign in failed',
        message,
      })
      throw new Error(message)
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden px-4 py-10">
      {/* Ambient backdrop */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          initial={minimalMotion ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-[12%] top-[12%] h-56 w-56 rounded-full bg-red-400/20 blur-3xl"
        />
        <motion.div
          initial={minimalMotion ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-[12%] right-[12%] h-64 w-64 rounded-full bg-orange-300/20 blur-3xl"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(248,113,113,0.045)_1px,transparent_1px),linear-gradient(180deg,rgba(248,113,113,0.045)_1px,transparent_1px)] bg-[size:42px_42px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />
      </div>

      <motion.div
        initial={minimalMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: minimalMotion ? 0.14 : 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[410px]"
      >
        {/* Soft glow halo behind the card */}
        <div className="pointer-events-none absolute -inset-[1.5px] -z-10 rounded-[1.95rem] bg-gradient-to-br from-red-300/45 via-rose-200/25 to-orange-200/40 blur-md" />

        <div className="panel-surface relative overflow-hidden rounded-[1.85rem] border border-red-100/90 bg-white/95 px-7 pb-7 pt-8 shadow-[0_30px_80px_rgba(127,29,29,0.2)]">
          {/* Top accent line */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-red-500/70 to-transparent" />

          {/* Brand + heading */}
          <div className="mb-6 text-center">
            <div className="relative mx-auto inline-flex">
              <motion.span
                aria-hidden
                initial={minimalMotion ? false : { opacity: 0.5, scale: 0.92 }}
                animate={minimalMotion ? undefined : { opacity: [0.45, 0.75, 0.45], scale: [0.96, 1.06, 0.96] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 -z-10 rounded-2xl bg-red-500/25 blur-xl"
              />
              <BrandMark size={52} className="shadow-[0_16px_30px_rgba(220,38,38,0.35)]" />
            </div>

            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-red-100 bg-red-50/80 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-red-700">
              <Sparkles className="h-3 w-3" />
              AI-powered IELTS &amp; SAT prep
            </span>

            <h1 className="mt-3 text-[1.65rem] font-black leading-tight tracking-tight text-[#1F2937]">
              Welcome back
            </h1>
            <p className="mt-1.5 text-[13px] leading-5 text-[#6B7280]">
              Continue your saved study plan, XP, and streak.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5" aria-label="Login form">
            <div>
              <label htmlFor="email" className="mb-1 block text-[13px] font-semibold text-slate-700">
                Gmail address
              </label>
              <div className="group relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-red-400 transition-colors group-focus-within:text-red-500" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="input h-11 rounded-xl border-red-100 bg-white/95 pl-11 text-sm font-medium shadow-[0_8px_20px_rgba(15,23,42,0.04)] transition focus:shadow-[0_10px_26px_rgba(220,38,38,0.12)]"
                  placeholder="name@gmail.com"
                  {...register('email')}
                />
              </div>
              {errors.email ? <p className="mt-1 text-xs font-medium text-red-600">{errors.email.message}</p> : null}
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-[13px] font-semibold text-slate-700">
                Password
              </label>
              <div className="group relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-red-400 transition-colors group-focus-within:text-red-500" />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className="input h-11 rounded-xl border-red-100 bg-white/95 pl-11 text-sm font-medium shadow-[0_8px_20px_rgba(15,23,42,0.04)] transition focus:shadow-[0_10px_26px_rgba(220,38,38,0.12)]"
                  placeholder="Enter your password"
                  {...register('password')}
                />
              </div>
              {errors.password ? <p className="mt-1 text-xs font-medium text-red-600">{errors.password.message}</p> : null}
            </div>

            <motion.button
              whileHover={minimalMotion ? undefined : { y: -1 }}
              whileTap={minimalMotion ? undefined : { scale: 0.985 }}
              disabled={isSubmitting}
              type="submit"
              className="interactive-lift cta-sheen mt-1 flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#DC2626] via-[#EF4444] to-[#B91C1C] px-4 text-sm font-bold text-white shadow-[0_14px_28px_rgba(220,38,38,0.34)] transition hover:shadow-[0_18px_36px_rgba(220,38,38,0.44)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="my-4 flex items-center gap-3">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-red-100 to-red-200/70" />
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
              or continue with
            </span>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent via-red-100 to-red-200/70" />
          </div>

          {/* Google */}
          <GoogleAuthButton mode="signin" onCredential={handleGoogleCredential} />

          <p className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-red-400" />
            Use your existing Google account — no password needed.
          </p>

          {/* Gamified trust chips */}
          <div className="mt-5 flex items-center justify-center gap-2 border-t border-red-50 pt-4">
            {TRUST_CHIPS.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full bg-red-50/70 px-2.5 py-1 text-[10.5px] font-bold text-red-700/90"
              >
                <Icon className="h-3 w-3" />
                {label}
              </span>
            ))}
          </div>

          <p className="mt-4 text-center text-[13px] text-[#6B7280]">
            New account?{' '}
            <Link to="/register" className="font-bold text-red-600 transition-colors hover:text-red-700">
              Create one now
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
