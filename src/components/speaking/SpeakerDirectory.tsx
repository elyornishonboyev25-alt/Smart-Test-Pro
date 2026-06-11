import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Flame, Search, Trophy, UserRound, Zap } from 'lucide-react'
import { apiClient } from '@/lib/apiClient'
import type { LeaderboardResponse, LeaderboardRow } from '@/types/platform'
import { useAuthStore, type AuthState } from '@/store/authStore'
import { initialsOf } from '@/store/speakerSocialStore'

// Real, searchable speaker directory sourced from the live leaderboard. Each card
// opens that speaker's public profile. No messaging — discovery and speaking only.
export default function SpeakerDirectory() {
  const navigate = useNavigate()
  const user = useAuthStore((state: AuthState) => state.user)
  const [rows, setRows] = useState<LeaderboardRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (!user) return
    let active = true
    setLoading(true)
    apiClient
      .get<LeaderboardResponse>('/leaderboard?period=all', { auth: true })
      .then((data) => active && setRows(data.rows ?? []))
      .catch((e) => active && setError(e instanceof Error ? e.message : 'Failed to load speakers.'))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [user])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = q ? rows.filter((r) => r.fullName.toLowerCase().includes(q)) : rows
    return list.slice(0, 24)
  }, [rows, query])

  if (!user) {
    return (
      <div className="surface-card flex flex-col items-center p-8 text-center">
        <UserRound className="h-10 w-10 text-red-300" />
        <h3 className="mt-3 text-lg font-black text-slate-900">Discover speakers</h3>
        <p className="mt-1 max-w-sm text-sm text-slate-600">Sign in to search the community, view other learners’ profiles and see how you rank.</p>
        <button onClick={() => navigate('/login')} className="arena-primary-btn mt-4">Sign in</button>
      </div>
    )
  }

  return (
    <div className="surface-card p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="inline-flex items-center gap-2 text-xl font-black text-slate-900">
          <UserRound className="h-5 w-5 text-red-600" /> Community Speakers
        </h2>
        <button onClick={() => navigate('/speaker/me')} className="arena-secondary-btn text-sm">My profile</button>
      </div>

      <div className="relative mt-4">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search speakers by name…"
          className="input w-full pl-9"
        />
      </div>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      {loading ? <p className="mt-4 text-sm text-slate-500">Loading speakers…</p> : null}

      <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((row) => (
          <button
            key={row.userId}
            onClick={() => navigate(`/speaker/${row.userId}`)}
            className="flex items-center gap-3 rounded-2xl border border-red-50 bg-white p-3 text-left transition hover:border-red-200 hover:shadow-[0_10px_24px_rgba(220,38,38,0.1)]"
          >
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-50 to-rose-100 text-sm font-bold text-red-700">
              {initialsOf(row.fullName)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-900">
                {row.fullName}
                {row.isCurrentUser ? <span className="ml-1.5 rounded-full bg-red-100 px-1.5 py-0.5 text-[9px] font-bold text-red-700">YOU</span> : null}
              </p>
              <p className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                <span className="inline-flex items-center gap-0.5"><Trophy className="h-3 w-3 text-amber-500" />#{row.rank}</span>
                <span className="inline-flex items-center gap-0.5"><Zap className="h-3 w-3 text-amber-400" />{row.totalXp}</span>
                {row.streak > 0 ? <span className="inline-flex items-center gap-0.5"><Flame className="h-3 w-3 text-orange-500" />{row.streak}d</span> : null}
              </p>
            </div>
          </button>
        ))}
        {!loading && filtered.length === 0 ? (
          <p className="col-span-full py-6 text-center text-sm text-slate-500">
            {query ? 'No speakers match your search.' : 'No speakers found yet.'}
          </p>
        ) : null}
      </div>
    </div>
  )
}
