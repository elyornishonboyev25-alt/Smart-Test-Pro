import { create } from 'zustand'

export type ToastType = 'success' | 'error' | 'info'

export type ToastItem = {
  id: string
  title: string
  message?: string
  type: ToastType
}

export type ToastState = {
  toasts: ToastItem[]
  pushToast: (toast: Omit<ToastItem, 'id'>) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastState>((
  set: (
    partial:
      | Partial<ToastState>
      | ((state: ToastState) => Partial<ToastState>),
  ) => void,
) => ({
  toasts: [],
  pushToast: (toast: Omit<ToastItem, 'id'>) =>
    set((state: ToastState) => {
      const sameToastExists = state.toasts.some(
        (existing) => existing.title === toast.title && existing.message === toast.message && existing.type === toast.type,
      )

      if (sameToastExists) {
        return state
      }

      const id = crypto.randomUUID()
      const nextToasts = [...state.toasts, { id, ...toast }]
      return { toasts: nextToasts.slice(-4) }
    }),
  removeToast: (id: string) =>
    set((state: ToastState) => ({
      toasts: state.toasts.filter((toast: ToastItem) => toast.id !== id),
    })),
}))

