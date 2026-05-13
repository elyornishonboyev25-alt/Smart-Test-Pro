import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'
import { apiClient } from '@/lib/apiClient'
import { useAuthStore, type AuthState } from '@/store/authStore'
import { useToastStore, type ToastState } from '@/store/toastStore'
import { useMotionPreferences } from '@/hooks/useMotionPreferences'
import { BrandMark } from '@/components/brand/BrandLogo'
import GoogleAuthButton from '@/components/auth/GoogleAuthButton'

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

export default function Register() {
  const navigate = useNavigate()
  const setSession = useAuthStore((state: AuthState) => state.setSession)
  const pushToast = useToastStore((state: ToastState) => state.pushToast)
  const { minimalMotion } = useMotionPreferences()

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

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
      <motion.div
        initial={minimalMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: minimalMotion ? 0.14 : 0.24, ease: 'easeOut' }}
        className="panel-surface w-full max-w-2xl rounded-[2rem] border border-red-100/90 bg-white/95 p-8 shadow-[0_24px_68px_rgba(127,29,29,0.17)]"
      >
        <div className="mb-7 text-center">
          <BrandMark size={56} className="mx-auto shadow-[0_14px_26px_rgba(220,38,38,0.32)]" />
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#1F2937]">Continue with Google</h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            Register by selecting your Google account in popup chooser. No manual nickname/password step required.
          </p>
        </div>

        <GoogleAuthButton mode="signup" onCredential={onGoogleSignUp} />

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
          <Link to="/login" className="font-semibold text-red-600 transition-colors hover:text-red-700">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
