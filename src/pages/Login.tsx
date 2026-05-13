import { useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { apiClient } from '@/lib/apiClient'
import { useAuthStore, type AuthState } from '@/store/authStore'
import { useToastStore, type ToastState } from '@/store/toastStore'
import { useMotionPreferences } from '@/hooks/useMotionPreferences'
import { BrandMark } from '@/components/brand/BrandLogo'
import GoogleAuthButton from '@/components/auth/GoogleAuthButton'

const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
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
      const payload = await apiClient.post<AuthSessionPayload>('/auth/login', values, { auth: false })

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

  const onGoogleSignIn = async (idToken: string) => {
    try {
      const payload = await apiClient.post<AuthSessionPayload>(
        '/auth/google',
        { idToken },
        { auth: false },
      )

      setSession(payload)
      pushToast({
        type: 'success',
        title: 'Google sign-in completed',
        message: 'Welcome back to SmartTest Pro.',
      })
      navigate(redirectPath, { replace: true })
    } catch (error) {
      pushToast({
        type: 'error',
        title: 'Google sign-in failed',
        message: error instanceof Error ? error.message : 'Unable to continue with Google',
      })
      throw error
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
          <p className="mt-2 text-sm text-[#6B7280]">Access AI testing, leaderboard, and performance analytics.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" aria-label="Login form">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="input"
              placeholder="student@example.com"
              {...register('email')}
            />
            {errors.email ? <p className="mt-1 text-xs text-red-600">{errors.email.message}</p> : null}
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="input"
              placeholder="Enter your password"
              {...register('password')}
            />
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

        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-slate-200" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">or continue with</span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <GoogleAuthButton mode="signin" disabled={isSubmitting} onCredential={onGoogleSignIn} />

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
