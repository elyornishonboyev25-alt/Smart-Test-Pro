import { useCallback, useEffect, useState } from 'react'

// Cross-browser fullscreen helpers (Chromium/Firefox + Safari `webkit` prefix).

type FullscreenDoc = Document & {
  webkitFullscreenElement?: Element | null
  webkitExitFullscreen?: () => Promise<void> | void
}

type FullscreenEl = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void
}

function getFsElement(): Element | null {
  if (typeof document === 'undefined') return null
  const d = document as FullscreenDoc
  return document.fullscreenElement ?? d.webkitFullscreenElement ?? null
}

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(() => Boolean(getFsElement()))

  const supported =
    typeof document !== 'undefined' &&
    (Boolean(document.documentElement.requestFullscreen) ||
      Boolean((document.documentElement as FullscreenEl).webkitRequestFullscreen))

  useEffect(() => {
    const sync = () => setIsFullscreen(Boolean(getFsElement()))
    document.addEventListener('fullscreenchange', sync)
    document.addEventListener('webkitfullscreenchange', sync)
    return () => {
      document.removeEventListener('fullscreenchange', sync)
      document.removeEventListener('webkitfullscreenchange', sync)
    }
  }, [])

  const enter = useCallback(async () => {
    if (getFsElement()) return
    try {
      const el = document.documentElement as FullscreenEl
      if (el.requestFullscreen) await el.requestFullscreen()
      else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen()
    } catch {
      /* Fullscreen needs a user gesture / may be blocked — ignore. */
    }
  }, [])

  const exit = useCallback(async () => {
    if (!getFsElement()) return
    try {
      const d = document as FullscreenDoc
      if (document.exitFullscreen) await document.exitFullscreen()
      else if (d.webkitExitFullscreen) await d.webkitExitFullscreen()
    } catch {
      /* ignore */
    }
  }, [])

  const toggle = useCallback(() => {
    if (getFsElement()) void exit()
    else void enter()
  }, [enter, exit])

  return { isFullscreen, supported, enter, exit, toggle }
}

export default useFullscreen
