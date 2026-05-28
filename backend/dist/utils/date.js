export function startOfUtcDay(date) {
    const copy = new Date(date);
    copy.setUTCHours(0, 0, 0, 0);
    return copy;
}
export function endOfUtcDay(date) {
    const copy = new Date(date);
    copy.setUTCHours(23, 59, 59, 999);
    return copy;
}
export function addUtcDays(date, days) {
    const copy = new Date(date);
    copy.setUTCDate(copy.getUTCDate() + days);
    return copy;
}
export function isSameUtcDay(first, second) {
    return startOfUtcDay(first).getTime() === startOfUtcDay(second).getTime();
}
export function getPeriodStart(period, now = new Date()) {
    if (period === 'all') {
        return null;
    }
    const base = startOfUtcDay(now);
    if (period === 'today') {
        return base;
    }
    if (period === 'week') {
        return addUtcDays(base, -6);
    }
    return addUtcDays(base, -29);
}
