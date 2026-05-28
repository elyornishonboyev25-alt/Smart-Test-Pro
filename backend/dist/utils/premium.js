const PREMIUM_EMAIL_ALLOWLIST = new Set([
    'elyornishonboyev000@gmail.com',
]);
export function isPremiumUser(input) {
    if (input.role === 'ADMIN')
        return true;
    const normalized = input.email.trim().toLowerCase();
    return PREMIUM_EMAIL_ALLOWLIST.has(normalized);
}
