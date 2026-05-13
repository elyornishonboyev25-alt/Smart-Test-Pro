import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowDownRight,
  ArrowUpRight,
  Flame,
  Minus,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trophy,
} from 'lucide-react'
import { apiClient } from '@/lib/apiClient'
import type { LeaderboardResponse, LeaderboardRow, TestCategory } from '@/types/platform'
import { Skeleton } from '@/components/common/Skeleton'
import { useAuthStore, type AuthState } from '@/store/authStore'
import { useMotionPreferences } from '@/hooks/useMotionPreferences'

type PeriodValue = 'today' | 'week' | 'month'

const periods: Array<{ label: string; value: PeriodValue }> = [
  { label: 'Daily', value: 'today' },
  { label: 'Weekly', value: 'week' },
  { label: 'Monthly', value: 'month' },
]

const categories: Array<{ label: string; value: TestCategory | 'ALL' }> = [
  { label: 'Combined', value: 'ALL' },
  { label: 'IELTS', value: 'IELTS' },
  { label: 'SAT', value: 'SAT' },
]

function getInitials(fullName: string) {
  const parts = fullName.split(' ').filter(Boolean)
  if (parts.length === 0) return 'PL'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase()
}

function getMovement(row: LeaderboardRow) {
  if (row.rankTrend === 'same') {
    return {
      icon: Minus,
      label: '0',
      className: 'border-slate-200 bg-white text-slate-500',
    }
  }

  const up = row.rankTrend === 'up'
  return {
    icon: up ? ArrowUpRight : ArrowDownRight,
    label: `${up ? '+' : '-'}${Math.abs(row.rankDelta)}`,
    className: up
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
      : 'border-red-200 bg-red-50 text-red-700',
  }
}

function integrityPill(score: number) {
  const verified = score >= 70
  return {
    verified,
    label: verified ? 'Verified' : 'Review',
    icon: verified ? ShieldCheck : ShieldAlert,
    className: verified
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
      : 'border-amber-200 bg-amber-50 text-amber-700',
  }
}

function podiumTone(rank: number) {
  if (rank === 1) return 'from-amber-100 via-white to-red-100 border-amber-200'
  if (rank === 2) return 'from-slate-100 via-white to-rose-100 border-slate-200'
  return 'from-orange-100 via-white to-red-100 border-orange-200'
}

export default function Leaderboard() {
  const user = useAuthStore((state: AuthState) => state.user)
  const { minimalMotion } = useMotionPreferences()

  const [period, setPeriod] = useState<PeriodValue>('week')
  const [category, setCategory] = useState<TestCategory | 'ALL'>('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<LeaderboardResponse | null>(null)

  useEffect(() => {
    let active = true

    const fetchData = async () => {
      if (!user) {
        setLoading(false)
        setData(null)
        setError('Sign in required to view leaderboard.')
        return
      }

      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams({ period })
        if (category !== 'ALL') params.set('category', category)

        const payload = await apiClient.get<LeaderboardResponse>(`/leaderboard?${params.toString()}`, { auth: true })
        if (!active) return
        setData(payload)
      } catch (fetchError) {
        if (!active) return
        setError(fetchError instanceof Error ? fetchError.message : 'Failed to load leaderboard.')
      } finally {
        if (active) setLoading(false)
      }
    }

    void fetchData()

    return () => {
      active = false
    }
  }, [period, category, user])

  const rows = data?.rows ?? []
  const podiumRows = useMemo(() => {
    if (data?.podium?.length) return data.podium.slice(0, 3)
    return rows.slice(0, 3)
  }, [data, rows])

  const summary = useMemo(() => {
    if (rows.length === 0) return null
    const totalXp = rows.reduce((sum, row) => sum + row.totalXp, 0)
    const avgAccuracy = rows.reduce((sum, row) => sum + row.accuracy, 0) / rows.length
    const avgConsistency = rows.reduce((sum, row) => sum + row.consistencyScore, 0) / rows.length
    const verifiedCount = rows.filter((row) => row.integrityScore >= 70).length

    return {
      totalXp,
      avgAccuracy,
      avgConsistency,
      verifiedCount,
    }
  }, [rows])

  const topTen = rows.slice(0, 10)

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-red-100 bg-[radial-gradient(circle_at_8%_12%,rgba(252,165,165,0.35),transparent_38%),radial-gradient(circle_at_90%_10%,rgba(251,113,133,0.25),transparent_42%),linear-gradient(150deg,#fff,#fff5f5)] p-6 shadow-[0_28px_70px_rgba(15,23,42,0.16)] sm:p-8">
        <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-red-700">
              <Sparkles className="h-3.5 w-3.5" />
              Premium Ranking Board
            </p>
            <h1 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">Global Leaderboard</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Verified SAT + IELTS performance standings with integrity checks, live XP race, and consistency metrics.
            </p>
          </div>

          <div className="grid w-full gap-2 sm:w-auto sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-red-200 bg-white px-3 py-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-red-600">Your Rank</p>
              <p className="mt-1 text-lg font-bold text-slate-900">{data?.currentUserRank ? `#${data.currentUserRank}` : '--'}</p>
            </div>
            <div className="rounded-xl border border-red-200 bg-white px-3 py-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-red-600">Your XP</p>
              <p className="mt-1 text-lg font-bold text-slate-900">{user ? Math.max(0, user.xp).toLocaleString() : '--'}</p>
            </div>
            <div className="rounded-xl border border-red-200 bg-white px-3 py-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-red-600">Avg Accuracy</p>
              <p className="mt-1 text-lg font-bold text-slate-900">{summary ? `${summary.avgAccuracy.toFixed(1)}%` : '--'}</p>
            </div>
            <div className="rounded-xl border border-red-200 bg-white px-3 py-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-red-600">Verified Users</p>
              <p className="mt-1 text-lg font-bold text-slate-900">{summary ? summary.verifiedCount : '--'}</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-5 grid gap-3 lg:grid-cols-2">
          <div className="rounded-2xl border border-red-100 bg-white p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-red-600">Period</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {periods.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setPeriod(item.value)}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    period === item.value
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-[0_10px_22px_rgba(220,38,38,0.28)]'
                      : 'border border-red-100 bg-white text-slate-600 hover:text-red-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-red-100 bg-white p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-red-600">Track</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {categories.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setCategory(item.value)}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    category === item.value
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-[0_10px_22px_rgba(220,38,38,0.28)]'
                      : 'border border-red-100 bg-white text-slate-600 hover:text-red-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {error ? (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      ) : null}

      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-red-600">Podium</h2>
        <div className="grid gap-3 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => <Skeleton key={`podium_${index}`} className="h-56 w-full rounded-2xl" />)
            : podiumRows.map((row) => {
                const integrity = integrityPill(row.integrityScore)
                const IntegrityIcon = integrity.icon
                const movement = getMovement(row)
                const MovementIcon = movement.icon

                return (
                  <motion.article
                    key={row.userId}
                    whileHover={minimalMotion ? undefined : { y: -4 }}
                    className={`rounded-2xl border bg-gradient-to-br p-4 shadow-[0_14px_28px_rgba(15,23,42,0.1)] ${podiumTone(row.rank)}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-white px-2.5 py-1 text-xs font-semibold text-red-700">
                        <Trophy className="h-3.5 w-3.5" />
                        Rank #{row.rank}
                      </span>
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${movement.className}`}>
                        <MovementIcon className="h-3.5 w-3.5" />
                        {movement.label}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-red-200 bg-white text-sm font-bold text-red-700">
                        {getInitials(row.fullName)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-base font-bold text-slate-900">{row.fullName}</p>
                        <p className="text-xs text-slate-600">{row.totalXp.toLocaleString()} XP</p>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="rounded-xl border border-red-100 bg-white px-3 py-2">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-red-600">Accuracy</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">{row.accuracy.toFixed(1)}%</p>
                      </div>
                      <div className="rounded-xl border border-red-100 bg-white px-3 py-2">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-red-600">Consistency</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">{row.consistencyScore.toFixed(1)}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                        <Flame className="h-3.5 w-3.5" />
                        {row.streak} day streak
                      </span>
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${integrity.className}`}>
                        <IntegrityIcon className="h-3.5 w-3.5" />
                        {integrity.label}
                      </span>
                    </div>
                  </motion.article>
                )
              })}
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
        <div className="rounded-2xl border border-red-100 bg-white p-4 shadow-[0_16px_32px_rgba(15,23,42,0.09)] sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-xl font-black text-slate-900">Top 10 Verified Rankings</h3>
            {summary ? (
              <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                Total board XP: {summary.totalXp.toLocaleString()}
              </span>
            ) : null}
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 10 }).map((_, index) => (
                <Skeleton key={`row_loader_${index}`} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : topTen.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-red-100">
              <div className="grid grid-cols-[74px_minmax(0,1.2fr)_0.8fr_0.7fr_0.7fr_0.7fr_0.7fr] bg-red-50/70 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-red-700">
                <p>Rank</p>
                <p>Player</p>
                <p>XP</p>
                <p>Tests</p>
                <p>Accuracy</p>
                <p>Consist.</p>
                <p>Trend</p>
              </div>

              {topTen.map((row) => {
                const movement = getMovement(row)
                const MovementIcon = movement.icon

                return (
                  <div
                    key={row.userId}
                    className={`grid grid-cols-[74px_minmax(0,1.2fr)_0.8fr_0.7fr_0.7fr_0.7fr_0.7fr] items-center gap-2 border-t border-red-100 px-3 py-2.5 text-sm ${
                      row.isCurrentUser ? 'bg-red-50/55' : 'bg-white'
                    }`}
                  >
                    <p className="font-semibold text-slate-900">#{row.rank}</p>
                    <div className="flex min-w-0 items-center gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-red-200 bg-red-50 text-[11px] font-semibold text-red-700">
                        {getInitials(row.fullName)}
                      </div>
                      <p className="truncate font-semibold text-slate-900">{row.fullName}</p>
                    </div>
                    <p className="font-semibold text-slate-800">{row.totalXp.toLocaleString()}</p>
                    <p className="text-slate-700">{row.testsCompleted}</p>
                    <p className="font-semibold text-slate-800">{row.accuracy.toFixed(1)}%</p>
                    <p className="text-slate-700">{row.consistencyScore.toFixed(1)}</p>
                    <span className={`inline-flex w-fit items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${movement.className}`}>
                      <MovementIcon className="h-3 w-3" />
                      {movement.label}
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-red-100 bg-white px-4 py-6 text-sm text-slate-600">
              No verified scores found for this filter.
            </div>
          )}
        </div>

        <div className="space-y-4">
          <article className="rounded-2xl border border-red-100 bg-white p-4 shadow-[0_14px_30px_rgba(15,23,42,0.09)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-red-600">Weekly Winner</p>
            {data?.weeklyPremiumWinner ? (
              <div className="mt-2">
                <p className="text-lg font-black text-slate-900">{data.weeklyPremiumWinner.fullName}</p>
                <p className="mt-1 text-sm text-slate-600">
                  {data.weeklyPremiumWinner.testsCompleted} tests | Score {data.weeklyPremiumWinner.rankingScore.toFixed(2)}
                </p>
              </div>
            ) : (
              <p className="mt-2 text-sm text-slate-600">No winner data available yet.</p>
            )}
          </article>

          <article className="rounded-2xl border border-red-100 bg-white p-4 shadow-[0_14px_30px_rgba(15,23,42,0.09)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-red-600">Integrity Rules</p>
            <div className="mt-2 space-y-2">
              {(data?.antiCheatRules ?? []).slice(0, 5).map((rule) => (
                <p key={rule} className="rounded-xl border border-red-100 bg-red-50/45 px-3 py-2 text-xs leading-5 text-slate-700">
                  {rule}
                </p>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-red-100 bg-white p-4 shadow-[0_14px_30px_rgba(15,23,42,0.09)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-red-600">Board Snapshot</p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-xl border border-red-100 bg-red-50/45 px-3 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-red-600">Average Accuracy</p>
                <p className="mt-1 font-bold text-slate-900">{summary ? `${summary.avgAccuracy.toFixed(1)}%` : '--'}</p>
              </div>
              <div className="rounded-xl border border-red-100 bg-red-50/45 px-3 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-red-600">Avg Consistency</p>
                <p className="mt-1 font-bold text-slate-900">{summary ? summary.avgConsistency.toFixed(1) : '--'}</p>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  )
}
