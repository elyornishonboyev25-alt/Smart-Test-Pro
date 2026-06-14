import { useCallback, useState } from 'react'
import { useAuthStore, type AuthState } from '@/store/authStore'
import { isPremiumUser } from '@/utils/premiumAccess'
import {
  COMMUNITY_TRIAL_SECONDS,
  TRIAL_LIMITS,
  addCommunitySeconds,
  consumeTrial,
  getCommunitySecondsUsed,
  getTrialUsed,
  type TrialFeature,
} from '@/utils/freeTrial'

export type FeatureTrial = {
  /** Genuine premium owner — unlimited, never gated. */
  isPremium: boolean
  used: number
  limit: number
  /** Remaining free uses (Infinity for premium). */
  remaining: number
  /** True when a non-premium account has spent its allowance. */
  locked: boolean
  /** Spend one use (no-op for premium). Returns true if a use was counted. */
  consume: () => boolean
}

/**
 * Access state for a trial-gated feature. Non-premium accounts get
 * {@link TRIAL_LIMITS} free uses, then `locked` flips true so the caller can
 * render the premium gate.
 */
export function useFeatureTrial(feature: TrialFeature): FeatureTrial {
  const user = useAuthStore((state: AuthState) => state.user)
  const isPremium = isPremiumUser(user)
  const [used, setUsed] = useState(() => getTrialUsed(feature, user?.id))

  const limit = TRIAL_LIMITS[feature]
  const remaining = isPremium ? Number.POSITIVE_INFINITY : Math.max(0, limit - used)
  const locked = !isPremium && used >= limit

  const consume = useCallback(() => {
    if (isPremium) return true
    if (getTrialUsed(feature, user?.id) >= limit) return false
    setUsed(consumeTrial(feature, user?.id))
    return true
  }, [feature, isPremium, limit, user?.id])

  return { isPremium, used, limit, remaining, locked, consume }
}

export type CommunityTrial = {
  isPremium: boolean
  secondsUsed: number
  secondsLimit: number
  secondsRemaining: number
  locked: boolean
  /** Record elapsed community seconds. */
  addSeconds: (seconds: number) => void
}

/** Access state for the Speaking-community time budget (debate + partner). */
export function useCommunityTrial(): CommunityTrial {
  const user = useAuthStore((state: AuthState) => state.user)
  const isPremium = isPremiumUser(user)
  const [secondsUsed, setSecondsUsed] = useState(() => getCommunitySecondsUsed(user?.id))

  const secondsLimit = COMMUNITY_TRIAL_SECONDS
  const secondsRemaining = isPremium ? Number.POSITIVE_INFINITY : Math.max(0, secondsLimit - secondsUsed)
  const locked = !isPremium && secondsUsed >= secondsLimit

  // Stable identity (no secondsUsed dep) so a 1-second interval doesn't tear
  // down and rebuild every tick. addCommunitySeconds reads the latest stored
  // value, so the running total stays correct.
  const addSeconds = useCallback(
    (seconds: number) => {
      if (isPremium) return
      setSecondsUsed(addCommunitySeconds(seconds, user?.id))
    },
    [isPremium, user?.id],
  )

  return { isPremium, secondsUsed, secondsLimit, secondsRemaining, locked, addSeconds }
}
