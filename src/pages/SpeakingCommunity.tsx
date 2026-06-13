import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, BarChart3, MessagesSquare, Mic, Users, Wand2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, type AuthState } from '@/store/authStore'
import { computeSummary, selectUserSessions, useSpeakingStore } from '@/store/speakingStore'
import { Reveal } from '@/components/fx'
import AiCoach from '@/components/speaking/sections/AiCoach'
import Debate from '@/components/speaking/sections/Debate'
import Partner from '@/components/speaking/sections/Partner'
import Progress from '@/components/speaking/sections/Progress'
import Community from '@/components/speaking/sections/Community'

type Section = 'ai' | 'debate' | 'partner' | 'progress' | 'community'

const SECTIONS: Array<{ id: Section; label: string; icon: typeof Wand2; tag: string }> = [
  { id: 'ai', label: 'AI Coach', icon: Wand2, tag: 'Full Mock & Free Talk' },
  { id: 'debate', label: 'Debate', icon: MessagesSquare, tag: 'Group rooms' },
  { id: 'partner', label: 'Partner', icon: Users, tag: '1-on-1 voice' },
  { id: 'progress', label: 'My Progress', icon: BarChart3, tag: 'Charts & rank' },
  { id: 'community', label: 'Community', icon: Mic, tag: 'Speakers' },
]

export default function SpeakingCommunity() {
  const navigate = useNavigate()
  const user = useAuthStore((state: AuthState) => state.user)
  const sessions = useSpeakingStore((s) => s.sessions)
  const [section, setSection] = useState<Section>('ai')
  const [partnerKey, setPartnerKey] = useState(0)

  const summary = useMemo(
    () => computeSummary(selectUserSessions(sessions, user?.id ?? null)),
    [sessions, user?.id],
  )

  const active = SECTIONS.find((s) => s.id === section) ?? SECTIONS[0]

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#fde8e8] via-[#fceaea] to-[#f9dede] px-4 py-8 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="ambient-mesh" />
        <div className="ambient-grid" />
        <div className="absolute -left-20 top-8 h-72 w-72 rounded-full bg-red-200/45 blur-3xl" />
        <div className="absolute -right-16 top-20 h-80 w-80 rounded-full bg-rose-200/35 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl space-y-6">
        {/* Hero */}
        <Reveal>
          <section className="premium-hero p-6 sm:p-8">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_26rem] xl:items-center">
              <div>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="mb-4 inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-white/85 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.1em] text-red-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-red-50 hover:shadow-[0_8px_18px_rgba(220,38,38,0.18)]"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </button>
                <span className="premium-top-chip">
                  <Mic className="h-3.5 w-3.5" /> Speaking Studio
                </span>
                <h1 className="premium-section-title mt-4">
                  Master <span className="arena-title-accent-red">English Speaking</span>
                </h1>
                <p className="premium-section-subtitle max-w-3xl">
                  Practise with an AI examiner, study real questions with model answers, debate in groups, or talk live
                  with real partners — all in one professional studio.
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-3 xl:w-full">
                <HeroStat label="Avg Band" value={summary.averageBand ? summary.averageBand.toFixed(1) : '—'} note="Across sessions" />
                <HeroStat label="Speaking Time" value={`${summary.totalMinutes}m`} note="Total practised" />
                <HeroStat label="Day Streak" value={String(summary.currentStreak)} note="Keep it alive" />
              </div>
            </div>
          </section>
        </Reveal>

        {/* Section nav */}
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {SECTIONS.map((s) => {
            const Icon = s.icon
            const isActive = section === s.id
            return (
              <motion.button
                key={s.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSection(s.id)}
                className={`flex shrink-0 items-center gap-2 rounded-2xl border px-4 py-3 text-left transition ${
                  isActive
                    ? 'border-red-300 bg-gradient-to-br from-red-600 to-rose-600 text-white shadow-[0_12px_26px_rgba(220,38,38,0.3)]'
                    : 'border-red-100 bg-white/90 text-slate-700 hover:border-red-300'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-red-600'}`} />
                <span>
                  <span className="block text-sm font-bold leading-tight">{s.label}</span>
                  <span className={`block text-[10px] font-medium ${isActive ? 'text-white/80' : 'text-slate-400'}`}>{s.tag}</span>
                </span>
              </motion.button>
            )
          })}
        </div>

        {/* Active section */}
        <div className="min-h-[40vh]">
          <p className="mb-3 inline-flex items-center gap-2 text-lg font-black text-slate-900">
            <active.icon className="h-5 w-5 text-red-600" /> {active.label}
          </p>
          {section === 'ai' ? <AiCoach /> : null}
          {section === 'debate' ? <Debate /> : null}
          {section === 'partner' ? <Partner key={partnerKey} onExit={() => setPartnerKey((k) => k + 1)} /> : null}
          {section === 'progress' ? <Progress onStart={() => setSection('ai')} /> : null}
          {section === 'community' ? <Community /> : null}
        </div>
      </div>
    </div>
  )
}

function HeroStat({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="hero-metric-card interactive-lift">
      <p className="hero-metric-label">{label}</p>
      <p className="hero-metric-value-sm hero-metric-value-compact">{value}</p>
      <p className="hero-metric-note">{note}</p>
    </div>
  )
}
