export function startOfUtcDay(date: Date): Date {
  const copy = new Date(date)
  copy.setUTCHours(0, 0, 0, 0)
  return copy
}

export function endOfUtcDay(date: Date): Date {
  const copy = new Date(date)
  copy.setUTCHours(23, 59, 59, 999)
  return copy
}

export function addUtcDays(date: Date, days: number): Date {
  const copy = new Date(date)
  copy.setUTCDate(copy.getUTCDate() + days)
  return copy
}

export function isSameUtcDay(first: Date, second: Date): boolean {
  return startOfUtcDay(first).getTime() === startOfUtcDay(second).getTime()
}

export function getPeriodStart(period: 'today' | 'week' | 'month' | 'all', now = new Date()): Date | null {
  if (period === 'all') {
    return null
  }

  const base = startOfUtcDay(now)

  if (period === 'today') {
    return base
  }

  if (period === 'week') {
    return addUtcDays(base, -6)
  }

  return addUtcDays(base, -29)
}
