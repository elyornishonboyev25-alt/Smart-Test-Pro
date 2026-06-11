import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { AtSign, Check, Loader2, X } from 'lucide-react'
import { useAuthStore, type AuthState } from '@/store/authStore'
import { checkNicknameAvailable, setNickname as apiSetNickname } from '@/lib/speakingApi'

const NICKNAME_RE = /^[A-Za-z][A-Za-z0-9_]{2,19}$/
const DEFER_KEY = 'smarttest-nickname-deferred'

// Mandatory-feeling onboarding gate: any signed-in user without a unique public
// nickname is prompted to choose one (checked live for availability). Other learners
// only ever see this handle — never the email-derived name.
export default function NicknameGate() {
  const user = useAuthStore((state: AuthState) => state.user)
  const hydrated = useAuthStore((state: AuthState) => state.hydrated)
  const setUserNickname = useAuthStore((state: AuthState) => state.setUserNickname)

  const [value, setValue] = useState('')
  const [status, setStatus] = useState<'idle' | 'invalid' | 'checking' | 'available' | 'taken'>('idle')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deferred, setDeferred] = useState(() => sessionStorage.getItem(DEFER_KEY) === '1')
  const debounceRef = useRef<number | null>(null)

  const needsNickname = hydrated && !!user && !user.nickname && !deferred

  // Live availability check (debounced).
  useEffect(() => {
    if (!needsNickname) return
    if (debounceRef.current) window.clearTimeout(debounceRef.current)
    const v = value.trim()
    if (!v) {
      setStatus('idle')
      return
    }
    if (!NICKNAME_RE.test(v)) {
      setStatus('invalid')
      return
    }
    setStatus('checking')
    debounceRef.current = window.setTimeout(async () => {
      const ok = await checkNicknameAvailable(v)
      setStatus(ok ? 'available' : 'taken')
    }, 450)
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current)
    }
  }, [value, needsNickname])

  if (!needsNickname) return null

  const submit = async () => {
    const v = value.trim()
    if (!NICKNAME_RE.test(v) || status !== 'available') return
    setSaving(true)
    setError(null)
    try {
      await apiSetNickname(v)
      setUserNickname(v)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save nickname. Try another one.')
      setStatus('taken')
    } finally {
      setSaving(false)
    }
  }

  const defer = () => {
    sessionStorage.setItem(DEFER_KEY, '1')
    setDeferred(true)
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/55 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-6 shadow-[0_30px_70px_rgba(15,23,42,0.3)] sm:p-7"
      >
        <button onClick={defer} className="ml-auto block text-slate-300 hover:text-slate-500" aria-label="Later">
          <X className="h-5 w-5" />
        </button>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-rose-600 text-white shadow-[0_12px_24px_rgba(220,38,38,0.3)]">
          <AtSign className="h-7 w-7" />
        </div>
        <h2 className="mt-4 text-center text-2xl font-black text-slate-900">Choose your nickname</h2>
        <p className="mt-2 text-center text-sm leading-6 text-slate-600">
          This is your public handle in the Speaking community. It must be unique, and other learners will only ever see
          this — never your email.
        </p>

        <div className="mt-5">
          <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50/40 px-3 focus-within:border-red-400">
            <span className="text-lg font-bold text-red-500">@</span>
            <input
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value.replace(/\s/g, ''))}
              placeholder="your_handle"
              maxLength={20}
              className="w-full bg-transparent py-3 text-sm font-semibold text-slate-900 outline-none"
            />
            {status === 'checking' ? <Loader2 className="h-4 w-4 animate-spin text-slate-400" /> : null}
            {status === 'available' ? <Check className="h-4 w-4 text-emerald-500" /> : null}
          </div>
          <p className={`mt-1.5 text-xs font-medium ${statusColor(status)}`}>{statusText(status)}</p>
        </div>

        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}

        <button
          onClick={() => void submit()}
          disabled={status !== 'available' || saving}
          className="arena-primary-btn cta-sheen mt-5 w-full justify-center py-3 disabled:opacity-50"
        >
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Claim this nickname
        </button>
        <button onClick={defer} className="mt-2 w-full text-center text-xs font-medium text-slate-400 hover:text-red-600">
          I’ll do it later
        </button>
      </motion.div>
    </div>
  )
}

function statusText(status: string): string {
  switch (status) {
    case 'invalid':
      return '3–20 characters: letters, numbers or underscore, starting with a letter.'
    case 'checking':
      return 'Checking availability…'
    case 'available':
      return '✓ Available — it’s yours!'
    case 'taken':
      return 'Already taken — try another.'
    default:
      return 'Pick something memorable.'
  }
}
function statusColor(status: string): string {
  if (status === 'available') return 'text-emerald-600'
  if (status === 'taken' || status === 'invalid') return 'text-red-600'
  return 'text-slate-400'
}
