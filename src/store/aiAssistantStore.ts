import { create } from 'zustand'
import type { AiReportResponse } from '@/types/platform'

export type AiAssistantMessageRole = 'user' | 'assistant'

export type AiAssistantMessage = {
  id: string
  role: AiAssistantMessageRole
  content: string
  createdAt: string
}

type AiAssistantState = {
  isOpen: boolean
  isSending: boolean
  error: string | null
  messages: AiAssistantMessage[]
  reportSnapshot: AiReportResponse | null
  reportUpdatedAt: string | null
  open: () => void
  close: () => void
  toggle: () => void
  setSending: (value: boolean) => void
  setError: (value: string | null) => void
  pushMessage: (message: AiAssistantMessage) => void
  clearMessages: () => void
  setReportSnapshot: (report: AiReportResponse | null) => void
}

export const useAiAssistantStore = create<AiAssistantState>((set) => ({
  isOpen: false,
  isSending: false,
  error: null,
  messages: [],
  reportSnapshot: null,
  reportUpdatedAt: null,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setSending: (value: boolean) => set({ isSending: value }),
  setError: (value: string | null) => set({ error: value }),
  pushMessage: (message: AiAssistantMessage) =>
    set((state) => ({
      messages: [...state.messages, message].slice(-40),
    })),
  clearMessages: () => set({ messages: [], error: null }),
  setReportSnapshot: (report: AiReportResponse | null) =>
    set({
      reportSnapshot: report,
      reportUpdatedAt: report ? new Date().toISOString() : null,
    }),
}))

