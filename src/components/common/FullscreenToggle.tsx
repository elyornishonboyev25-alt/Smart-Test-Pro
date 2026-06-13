import { useEffect, useRef } from 'react'
import { Maximize2, Minimize2 } from 'lucide-react'
import { useFullscreen } from '@/hooks/useFullscreen'

// Persisted "the user deliberately left fullscreen" flag, so we don't keep forcing
// it on every visit once they've turned it off.
const OPT_OUT_KEY = 'smarttest_fullscreen_optout_v1'

/**
 * Site-wide fullscreen control.
 *  - Auto-enters fullscreen on the first click/tap after load (browsers forbid it on
 *    bare page load — a user gesture is required), unless the user opted out.
 *  - A floating button lets the user toggle it any time; exiting via the button
 *    remembers the choice so the auto-enter won't fight them next visit.
 */
export default function FullscreenToggle() {
  const { isFullscreen, supported, enter, toggle } = useFullscreen()
  const autoTried = useRef(false)

  useEffect(() => {
    if (!supported || typeof window === 'undefined') return
    if (window.localStorage.getItem(OPT_OUT_KEY) === '1') return

    const onFirstGesture = () => {
      if (autoTried.current) return
      autoTried.current = true
      cleanup()
      if (!document.fullscreenElement) void enter()
    }
    const cleanup = () => {
      window.removeEventListener('pointerdown', onFirstGesture)
      window.removeEventListener('touchstart', onFirstGesture)
    }

    window.addEventListener('pointerdown', onFirstGesture)
    window.addEventListener('touchstart', onFirstGesture)
    return cleanup
  }, [supported, enter])

  if (!supported) return null

  const handleClick = () => {
    try {
      if (isFullscreen) window.localStorage.setItem(OPT_OUT_KEY, '1')
      else window.localStorage.removeItem(OPT_OUT_KEY)
    } catch {
      /* storage may be unavailable — toggling still works */
    }
    toggle()
  }

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-[120] print:hidden">
      <button
        type="button"
        onClick={handleClick}
        title={isFullscreen ? "To'liq ekrandan chiqish" : "To'liq ekran rejimi"}
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-red-200/80 bg-white/90 text-red-600 shadow-[0_12px_28px_rgba(220,38,38,0.18)] backdrop-blur-md transition hover:-translate-y-0.5 hover:border-red-300 hover:bg-white hover:text-red-700"
      >
        {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
      </button>
    </div>
  )
}
