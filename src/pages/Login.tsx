import { useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Loader2, Lock, Mail } from 'lucide-react'
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
      navigate(redirectPath, { replace: true })
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
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
      <motion.div
        initial={minimalMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: minimalMotion ? 0.14 : 0.24, ease: 'easeOut' }}
        className="panel-surface w-full max-w-xl rounded-[2rem] border border-red-100/90 bg-white/95 p-8 shadow-[0_24px_68px_rgba(127,29,29,0.17)]"
      >
        <div className="mb-7 text-center">
          <BrandMark size={56} className="mx-auto shadow-[0_14px_26px_rgba(220,38,38,0.32)]" />
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#1F2937]">Sign in to SmartTest Pro</h1>
          <p className="mt-2 text-sm text-[#6B7280]">Enter your Gmail and password to continue your saved study plan.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" aria-label="Login form">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
              Gmail address
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="input pl-10"
                placeholder="name@gmail.com"
                {...register('email')}
              />
            </div>
            {errors.email ? <p className="mt-1 text-xs text-red-600">{errors.email.message}</p> : null}
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
              Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="input pl-10"
                placeholder="Enter your password"
                {...register('password')}
              />
            </div>
            {errors.password ? <p className="mt-1 text-xs text-red-600">{errors.password.message}</p> : null}
          </div>

          <motion.button
            whileTap={minimalMotion ? undefined : { scale: 0.985 }}
            disabled={isSubmitting}
            type="submit"
            className="interactive-lift mt-2 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#DC2626] via-[#EF4444] to-[#B91C1C] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(220,38,38,0.34)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
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

        <div className="my-6 flex items-center gap-4">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-red-100 to-red-200/70" />
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            or continue with
          </span>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent via-red-100 to-red-200/70" />
        </div>

        <GoogleAuthButton mode="signin" onCredential={handleGoogleCredential} />

        <p className="mt-3 text-center text-[11px] leading-5 text-slate-400">
          Use your existing Google account — no password needed.
        </p>

        <p className="mt-6 text-center text-sm text-[#6B7280]">
          New account?{' '}
          <Link to="/register" className="font-semibold text-red-600 transition-colors hover:text-red-700">
            Create one now
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
