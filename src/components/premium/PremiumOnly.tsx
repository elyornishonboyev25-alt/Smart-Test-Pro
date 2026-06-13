import type { ReactNode } from 'react'
import { useAuthStore, type AuthState } from '@/store/authStore'
import { ENFORCE_CONTENT_PREMIUM, isPremiumUser } from '@/utils/premiumAccess'
import PremiumGate from './PremiumGate'

type PremiumOnlyProps = {
  title?: string
  description?: string
  perks?: string[]
  children: ReactNode
}

/**
 * Route-level wrapper for premium-only content sections. Non-premium accounts
 * see the real page blurred behind a Subscribe overlay; premium owners (and
 * everyone, if {@link ENFORCE_CONTENT_PREMIUM} is off) see it normally.
 */
export default function PremiumOnly({ title, description, perks, children }: PremiumOnlyProps) {
  const user = useAuthStore((state: AuthState) => state.user)
  const locked = ENFORCE_CONTENT_PREMIUM && !isPremiumUser(user)

  return (
    <PremiumGate fullBleed locked={locked} title={title} description={description} perks={perks}>
      {children}
    </PremiumGate>
  )
}
