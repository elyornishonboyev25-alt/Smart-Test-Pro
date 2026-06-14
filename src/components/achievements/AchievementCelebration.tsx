import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Sparkles, X } from 'lucide-react'
import { useCelebrationStore } from '@/store/celebrationStore'
import { useToastStore, type ToastState } from '@/store/toastStore'
import { useMotionPreferences } from '@/hooks/useMotionPreferences'
import { playAchievementFanfare } from '@/utils/sound'
import { fetchBadges, pinBadge } from '@/lib/profileApi'
import { CountUp } from '@/components/fx'
import SkillBadge from './SkillBadge'
import { TIER_NAME, TRACK_META, formatBand, tierForBand } from './badgeMeta'

const CONFETTI_COLORS = ['#F59E0B', '#DC2626', '#22D3EE', '#A78BFA', '#34D399', '#FBBF24']

export default function AchievementCelebration() {
  const current = useCelebrationStore((s) => s.current)
  const dismiss = useCelebrationStore((s) => s.dismiss)
  const pushToast = useToastStore((s: ToastState) => s.pushToast)
  const { minimalMotion } = useMotionPreferences()

  const [pinned, setPinned] = useState(false)
  const [pinning, setPinning] = useState(false)

  // Reset per-celebration state + fire the fanfare whenever a new badge appears.
  useEffect(() => {
    if (!current) return
    setPinned(false)
    setPinning(false)
    playAchievementFanfare()
  }, [current?.id])

  const confetti = useMemo(
    () =>
      Array.from({ length: minimalMotion ? 0 : 26 }, (_, i) => ({
        id: i,
        x: Math.round((Math.random() - 0.5) * 460),
        rotate: Math.round(Math.random() * 720 - 360),
        delay: Math.random() * 0.5,
        duration: 1.6 + Math.random() * 1.4,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        size: 6 + Math.round(Math.random() * 8),
      })),
    [current?.id, minimalMotion],
  )

  if (!current) return null

  const meta = TRACK_META[current.track]
  const tier = tierForBand(current.band)
  const accent = meta?.group === 'SAT' ? '#2563EB' : '#DC2626'

  const addToProfile = async () => {
    setPinning(true)
    try {
      let id = current.serverBadgeId ?? null
      if (!id) {
        const list = await fetchBadges()
        id = list.find((b) => b.track === current.track && b.tier === tier)?.id ?? null
      }
      if (id) {
        await pinBadge(id, true)
        setPinned(true)
        pushToast({ type: 'success', title: 'Pinned to profile', message: 'This badge now shows on your public profile.' })
      } else {
        pushToast({ type: 'info', title: 'Saved', message: 'Badge saved — pin it from your profile any time.' })
      }
    } catch {
      pushToast({ type: 'info', title: 'Saved offline', message: 'Badge saved on this device; it will sync when you reconnect.' })
    } finally {
      setPinning(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        key={current.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md"
        onClick={dismiss}
      >
        {/* Confetti layer */}
        <div className="pointer-events-none absolute inset-0 flex items-start justify-center overflow-hidden">
          {confetti.map((c) => (
            <motion.span
              key={c.id}
              initial={{ y: -40, x: c.x, opacity: 0, rotate: 0 }}
              animate={{ y: '85vh', opacity: [0, 1, 1, 0], rotate: c.rotate }}
              transition={{ delay: c.delay, duration: c.duration, ease: 'easeIn' }}
              style={{ width: c.size, height: c.size * 0.5, backgroundColor: c.color, borderRadius: 2 }}
              className="absolute top-0"
            />
          ))}
        </div>

        <motion.div
          initial={minimalMotion ? { opacity: 0 } : { scale: 0.8, opacity: 0, y: 24 }}
          animate={minimalMotion ? { opacity: 1 } : { scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 18 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-sm overflow-hidden rounded-[2rem] border border-white/15 bg-gradient-to-b from-slate-900 to-slate-800 p-7 text-center shadow-[0_40px_90px_rgba(0,0,0,0.5)]"
        >
          <button onClick={dismiss} className="absolute right-4 top-4 text-slate-400 transition hover:text-white" aria-label="Close">
            <X className="h-5 w-5" />
          </button>

          {/* Glow ring behind badge */}
          <div
            className="pointer-events-none absolute left-1/2 top-16 h-56 w-56 -translate-x-1/2 rounded-full blur-3xl"
            style={{ background: accent, opacity: 0.35 }}
          />

          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="relative text-[11px] font-black uppercase tracking-[0.28em]"
            style={{ color: accent === '#2563EB' ? '#93C5FD' : '#FCA5A5' }}
          >
            Achievement Unlocked
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative mt-1 text-3xl font-black text-white"
          >
            You did it! 🎉
          </motion.h2>

          {/* The badge */}
          <motion.div
            initial={minimalMotion ? { opacity: 0 } : { scale: 0, rotate: -20, opacity: 0 }}
            animate={minimalMotion ? { opacity: 1 } : { scale: 1, rotate: 0, opacity: 1 }}
            transition={{ delay: 0.28, type: 'spring', stiffness: 200, damping: 14 }}
            className="relative mx-auto mt-5 flex justify-center"
          >
            <SkillBadge track={current.track} band={current.band} size={148} showBand={false} />
          </motion.div>

          <p className="relative mt-3 text-base font-bold text-white">{meta?.label}</p>
          <p className="relative text-xs font-bold uppercase tracking-[0.16em]" style={{ color: accent === '#2563EB' ? '#93C5FD' : '#FCA5A5' }}>
            {tier ? TIER_NAME[tier] : ''} Tier
          </p>

          {/* Band reveal */}
          <div className="relative mt-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Band Score</p>
            <p className="text-5xl font-black text-white">
              {minimalMotion ? formatBand(current.band) : <CountUp value={current.band} decimals={1} />}
            </p>
          </div>

          <div className="relative mt-6 flex flex-col gap-2">
            <button
              onClick={() => void addToProfile()}
              disabled={pinning || pinned}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-3 text-sm font-black text-slate-900 shadow-[0_12px_28px_rgba(245,158,11,0.4)] transition hover:brightness-105 disabled:opacity-60"
            >
              {pinned ? <Check className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
              {pinned ? 'Added to profile' : pinning ? 'Adding…' : 'Add to profile'}
            </button>
            <button onClick={dismiss} className="rounded-xl px-5 py-2 text-sm font-bold text-slate-300 transition hover:text-white">
              {pinned ? 'Done' : 'Maybe later'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
