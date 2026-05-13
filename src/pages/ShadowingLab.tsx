import { motion } from 'framer-motion'
import {
  ArrowLeft,
  AudioLines,
  CheckCircle2,
  Clock3,
  Film,
  Mic,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useMotionPreferences } from '@/hooks/useMotionPreferences'

const placeholderPlaylist = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  title: `Interview Clip ${String(index + 1).padStart(2, '0')}`,
  subtitle: 'Content block prepared. Media will be added later.',
}))

export default function SpeakingDrillLab() {
  const navigate = useNavigate()
  const { minimalMotion } = useMotionPreferences()

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#06070f] px-4 py-8 text-slate-100 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute right-[-10rem] top-12 h-[28rem] w-[28rem] rounded-full bg-sky-500/16 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl space-y-6">
        <motion.section
          initial={minimalMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={minimalMotion ? { duration: 0.12 } : { duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-[linear-gradient(135deg,rgba(17,11,35,0.96),rgba(10,24,42,0.9))] p-6 shadow-[0_30px_70px_rgba(0,0,0,0.5)] sm:p-9"
        >
          <div className="relative grid gap-5 xl:grid-cols-[minmax(0,1fr)_26rem] xl:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => navigate('/tests')}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/90 backdrop-blur"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to Test Library
                </button>
                <span className="inline-flex items-center gap-2 rounded-full border border-fuchsia-300/35 bg-fuchsia-300/10 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-fuchsia-100">
                  <AudioLines className="h-3.5 w-3.5" />
                  Speaking Performance Lab
                </span>
              </div>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
                Interview <span className="bg-gradient-to-r from-fuchsia-300 via-sky-300 to-emerald-300 bg-clip-text text-transparent">Speaking Studio</span>
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-200/90 sm:text-base">
                Video content is temporarily disabled. The layout is kept ready for future media and recording modules.
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-3 xl:w-full">
              <article className="rounded-2xl border border-white/20 bg-white/10 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-300">Interview Clips</p>
                <p className="mt-2 text-4xl font-black text-white">0</p>
                <p className="text-xs text-slate-400">Media hidden</p>
              </article>
              <article className="rounded-2xl border border-white/20 bg-white/10 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-300">Takes</p>
                <p className="mt-2 text-4xl font-black text-white">0</p>
                <p className="text-xs text-slate-400">Recording off</p>
              </article>
              <article className="rounded-2xl border border-white/20 bg-white/10 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-300">Self Score</p>
                <p className="mt-2 text-4xl font-black text-white">0%</p>
                <p className="text-xs text-slate-400">Checklist waiting</p>
              </article>
            </div>
          </div>
        </motion.section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <article className="rounded-3xl border border-white/15 bg-white/5 p-5 backdrop-blur-md">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="inline-flex items-center gap-2 text-xl font-semibold text-white">
                <Film className="h-5 w-5 text-sky-300" />
                Interview Playlist
              </h2>
              <span className="rounded-full border border-amber-300/50 bg-amber-300/10 px-3 py-1 text-xs font-semibold text-amber-200">
                Coming soon
              </span>
            </div>

            <div className="space-y-2">
              {placeholderPlaylist.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3"
                >
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-300">{item.subtitle}</p>
                </article>
              ))}
            </div>
          </article>

          <div className="space-y-4">
            <article className="rounded-3xl border border-white/15 bg-white/5 p-5 backdrop-blur-md">
              <h3 className="inline-flex items-center gap-2 text-lg font-semibold text-white">
                <Mic className="h-4.5 w-4.5 text-fuchsia-300" />
                Recording Panel
              </h3>
              <p className="mt-2 text-sm text-slate-300">Recording controls will be activated in the next phase.</p>
              <div className="mt-3 rounded-2xl border border-amber-300/40 bg-amber-300/10 px-3 py-2 text-xs font-semibold text-amber-100">
                Voice capture modules are intentionally disabled for now.
              </div>
            </article>

            <article className="rounded-3xl border border-white/15 bg-white/5 p-5 backdrop-blur-md">
              <h3 className="inline-flex items-center gap-2 text-lg font-semibold text-white">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-300" />
                Checklist Panel
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li className="rounded-xl border border-white/15 bg-white/5 px-3 py-2">Pronunciation clarity</li>
                <li className="rounded-xl border border-white/15 bg-white/5 px-3 py-2">Word stress accuracy</li>
                <li className="rounded-xl border border-white/15 bg-white/5 px-3 py-2">Sentence rhythm</li>
                <li className="rounded-xl border border-white/15 bg-white/5 px-3 py-2">Natural intonation</li>
              </ul>
            </article>

            <article className="rounded-3xl border border-white/15 bg-white/5 p-5 backdrop-blur-md">
              <h3 className="inline-flex items-center gap-2 text-lg font-semibold text-white">
                <Clock3 className="h-4.5 w-4.5 text-sky-300" />
                Future Sync
              </h3>
              <p className="mt-2 text-sm text-slate-300">This page is now design-only and ready for future media integration.</p>
              <span className="mt-3 inline-flex items-center gap-2 rounded-full border border-fuchsia-300/45 bg-fuchsia-300/10 px-3 py-1 text-xs font-semibold text-fuchsia-100">
                <ShieldCheck className="h-3.5 w-3.5" />
                Premium layout prepared
              </span>
            </article>
          </div>
        </section>

        <section className="rounded-3xl border border-white/15 bg-white/5 p-4 text-sm text-slate-300 backdrop-blur-md">
          <p className="inline-flex items-center gap-2 font-semibold text-slate-100">
            <Sparkles className="h-4 w-4 text-fuchsia-300" />
            Design preserved, media removed completely.
          </p>
        </section>
      </div>
    </div>
  )
}

