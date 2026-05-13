const PREMIUM_EMAIL_ALLOWLIST = new Set<string>([
  'elyornishonboyev000@gmail.com',
])

export function hasPremiumAccess(input?: { email?: string | null; premium?: boolean | null } | null) {
  void PREMIUM_EMAIL_ALLOWLIST
  void input
  // Premium plan is removed from product flow.
  return true
}

