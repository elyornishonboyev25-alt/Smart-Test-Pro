import { useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Loader2, Lock, Mail, ShieldCheck } from 'lucide-react'
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
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          initial={minimalMotion ? false : { opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-[14%] top-[16%] h-52 w-52 rounded-full bg-red-300/25 blur-3xl"
        />
        <motion.div
          initial={minimalMotion ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.08, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-[14%] right-[14%] h-60 w-60 rounded-full bg-orange-200/30 blur-3xl"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(248,113,113,0.05)_1px,transparent_1px),linear-gradient(180deg,rgba(248,113,113,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <motion.div
        initial={minimalMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: minimalMotion ? 0.14 : 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="panel-surface relative w-full max-w-[400px] rounded-[1.75rem] border border-red-100/90 bg-white/95 p-7 shadow-[0_26px_70px_rgba(127,29,29,0.18)]"
      >
        <div className="mb-6 text-center">
          <BrandMark size={48} className="mx-auto shadow-[0_14px_26px_rgba(220,38,38,0.32)]" />
          <h1 className="mt-3.5 text-[1.6rem] font-bold tracking-tight text-[#1F2937]">Sign in to SmartTest Pro</h1>
          <p className="mt-1.5 text-[13px] leading-5 text-[#6B7280]">
            Continue your saved study plan, XP, and streak.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5" aria-label="Login form">
          <div>
            <label htmlFor="email" className="mb-1 block text-[13px] font-semibold text-slate-700">
              Gmail address
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-red-400" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="input h-11 rounded-xl border-red-100 bg-white/90 pl-11 text-sm font-medium shadow-[0_8px_20px_rgba(15,23,42,0.04)]"
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
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-red-400" />
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="input h-11 rounded-xl border-red-100 bg-white/90 pl-11 text-sm font-medium shadow-[0_8px_20px_rgba(15,23,42,0.04)]"
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
            className="interactive-lift cta-sheen mt-1 flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#DC2626] via-[#EF4444] to-[#B91C1C] px-4 text-sm font-bold text-white shadow-[0_14px_28px_rgba(220,38,38,0.34)] transition hover:shadow-[0_18px_36px_rgba(220,38,38,0.42)] disabled:cursor-not-allowed disabled:opacity-60"
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

        <div className="my-4 flex items-center gap-3">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-red-100 to-red-200/70" />
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            or continue with
          </span>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent via-red-100 to-red-200/70" />
        </div>

        <GoogleAuthButton mode="signin" onCredential={handleGoogleCredential} />

        <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5 text-red-400" />
          Use your existing Google account — no password needed.
        </p>

        <p className="mt-5 text-center text-[13px] text-[#6B7280]">
          New account?{' '}
          <Link to="/register" className="font-bold text-red-600 transition-colors hover:text-red-700">
            Create one now
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
