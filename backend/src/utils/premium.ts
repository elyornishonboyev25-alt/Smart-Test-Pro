const PREMIUM_EMAIL_ALLOWLIST = new Set<string>([
  'elyornishonboyev000@gmail.com',
  'nishonboyv7@gmail.com',
])

export function isPremiumUser(input: { role: 'USER' | 'ADMIN'; email: string }) {
  if (input.role === 'ADMIN') return true
  const normalized = input.email.trim().toLowerCase()
  return PREMIUM_EMAIL_ALLOWLIST.has(normalized)
}
