/**
 * One-shot "flash" toast that survives a full page reload.
 *
 * Used by flows that intentionally hard-navigate (logout, post-OAuth redirect)
 * to guarantee a clean slate. A soft React-Router navigation under
 * `AnimatePresence mode="wait"` can leave the destination route blank until a
 * manual refresh, so those flows reload the page instead — and stash the toast
 * here so it can be shown once the fresh page boots.
 */
export type FlashToast = {
  type: 'success' | 'error' | 'info'
  title: string
  message?: string
}

const STORAGE_KEY = 'profai:flash-toast'

/** Stash a toast to be shown after the next full page load. */
export function setFlashToast(toast: FlashToast) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(toast))
  } catch {
    // sessionStorage unavailable (private mode / SSR) — silently skip.
  }
}

/** Read and clear the stashed toast (returns null when there is none). */
export function takeFlashToast(): FlashToast | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    sessionStorage.removeItem(STORAGE_KEY)
    return JSON.parse(raw) as FlashToast
  } catch {
    return null
  }
}
