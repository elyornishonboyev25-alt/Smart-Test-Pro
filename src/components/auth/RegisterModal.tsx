import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, ShieldCheck, X } from 'lucide-react'
import { apiClient } from '@/lib/apiClient'
import { useAuthStore, type AuthState } from '@/store/authStore'
import { useToastStore, type ToastState } from '@/store/toastStore'
import { useRegisterModalStore, type RegisterModalState } from '@/store/registerModalStore'
import { useMotionPreferences } from '@/hooks/useMotionPreferences'
import { BrandMark } from '@/components/brand/BrandLogo'
import GoogleAuthButton from '@/components/auth/GoogleAuthButton'

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Full name is required'),
    email: z.string().email('Valid email is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm your password'),
  })
  .refine((values: { password: string; confirmPassword: string }) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

type RegisterFormValues = z.infer<typeof registerSchema>

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

export default function RegisterModal() {
  const navigate = useNavigate()
  const setSession = useAuthStore((state: AuthState) => state.setSession)
  const pushToast = useToastStore((state: ToastState) => state.pushToast)
  const isOpen = useRegisterModalStore((state: RegisterModalState) => state.isOpen)
  const closeRegisterModal = useRegisterModalStore((state: RegisterModalState) => state.closeRegisterModal)
  const { minimalMotion } = useMotionPreferences()

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      const payload = await apiClient.post<AuthSessionPayload>(
        '/auth/register',
        {
          fullName: values.fullName,
          email: values.email,
          password: values.password,
        },
        { auth: false },
      )

      setSession(payload)
      pushToast({
        type: 'success',
        title: 'Account created',
        message: 'Welcome to SmartTest Pro.',
      })
      reset()
      closeRegisterModal()
      navigate('/dashboard', { replace: true })
    } catch (error) {
      pushToast({
        type: 'error',
        title: 'Registration failed',
        message: error instanceof Error ? error.message : 'Unable to create account',
      })
    }
  }

  const onGoogleSignUp = async (idToken: string) => {
    try {
      const payload = await apiClient.post<AuthSessionPayload>(
        '/auth/google',
        { idToken },
        { auth: false },
      )

      setSession(payload)
      pushToast({
        type: 'success',
        title: 'Google account linked',
        message: 'Your SmartTest Pro account is ready.',
      })
      reset()
      closeRegisterModal()
      navigate('/dashboard', { replace: true })
    } catch (error) {
      pushToast({
        type: 'error',
        title: 'Google registration failed',
        message: error instanceof Error ? error.message : 'Unable to create account with Google',
      })
      throw error
    }
  }

  const handleClose = () => {
    reset()
    closeRegisterModal()
  }

  const handleLoginRedirect = () => {
    reset()
    closeRegisterModal()
    navigate('/login')
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              initial={minimalMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: minimalMotion ? 0.12 : 0.2 }}
              className="fixed inset-0 bg-[rgba(15,23,42,0.45)] backdrop-blur-[2px]"
              onClick={handleClose}
            />

            <motion.div
              initial={minimalMotion ? false : { opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: minimalMotion ? 0.14 : 0.24, ease: 'easeOut' }}
              className="panel-surface relative w-full max-w-2xl rounded-[2rem] border border-red-100/90 bg-white/95 p-7 shadow-[0_30px_85px_rgba(127,29,29,0.2)] sm:p-8"
            >
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 rounded-xl p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-700"
                aria-label="Close registration"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-7 text-center">
                <BrandMark size={56} className="mx-auto shadow-[0_14px_26px_rgba(220,38,38,0.32)]" />
                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#1F2937]">Continue with Google</h1>
                <p className="mt-2 text-sm text-[#6B7280]">
                  Register by selecting your Google account in popup chooser. No manual nickname/password step required.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="sr-only" aria-hidden="true">
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                </button>
              </form>

              <div className="my-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-slate-200" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">or continue with</span>
                <span className="h-px flex-1 bg-slate-200" />
              </div>

              <GoogleAuthButton mode="signup" disabled={isSubmitting} onCredential={onGoogleSignUp} />

              <div className="mt-5 rounded-xl border border-red-100 bg-red-50/50 px-3 py-2 text-xs text-slate-700">
                <p className="inline-flex items-center gap-1 font-semibold text-red-700">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Secure sign-up
                </p>
                <p className="mt-1">
                  Account chooser opens from Google Identity Services and signs you in directly after verification.
                </p>
              </div>

              <p className="mt-6 text-center text-sm text-[#6B7280]">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={handleLoginRedirect}
                  className="font-semibold text-red-600 transition-colors hover:text-red-700"
                >
                  Sign in
                </button>
              </p>
            </motion.div>
          </div>
        </div>
      ) : null}
    </AnimatePresence>
  )
}

