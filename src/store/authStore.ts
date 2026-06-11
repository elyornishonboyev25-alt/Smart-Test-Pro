import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthUser } from '@/types/platform'
import { hasPremiumAccess } from '@/utils/premiumAccess'

export type AuthState = {
  user: AuthUser | null
  accessToken: string | null
  refreshToken: string | null
  hydrated: boolean
  setSession: (payload: { user: AuthUser; accessToken: string; refreshToken: string }) => void
  updateUserProgress: (payload: { xp?: number; level?: number; currentStreak?: number }) => void
  setUserNickname: (nickname: string) => void
  clearSession: () => void
  setHydrated: (value: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (
      set: (
        partial:
          | Partial<AuthState>
          | ((state: AuthState) => Partial<AuthState>),
      ) => void,
    ) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      hydrated: false,
      setSession: ({ user, accessToken, refreshToken }: { user: AuthUser; accessToken: string; refreshToken: string }) =>
        set({
          user: {
            ...user,
            premium: hasPremiumAccess(user),
          },
          accessToken,
          refreshToken,
        }),
      updateUserProgress: ({ xp, level, currentStreak }: { xp?: number; level?: number; currentStreak?: number }) =>
        set((state) => {
          if (!state.user) return {}
          return {
            user: {
              ...state.user,
              xp: xp ?? state.user.xp,
              level: level ?? state.user.level,
              currentStreak: currentStreak ?? state.user.currentStreak,
            },
          }
        }),
      setUserNickname: (nickname: string) =>
        set((state) => (state.user ? { user: { ...state.user, nickname } } : {})),
      clearSession: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
        }),
      setHydrated: (value: boolean) => set({ hydrated: value }),
    }),
    {
      name: 'smart-test-pro-auth',
      partialize: (state: AuthState) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => (state?: AuthState) => {
        if (state?.user) {
          state.user = {
            ...state.user,
            premium: hasPremiumAccess(state.user),
          }
        }
        state?.setHydrated(true)
      },
    },
  ),
)

