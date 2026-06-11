import { MessagesSquare, Mic, Trophy, Users } from 'lucide-react'
import { Reveal } from '@/components/fx'

// "Debate" section. The full 5-person group-voice rooms ship in the next update
// (they require the room-based signaling server). This is the polished intro.
export default function Debate() {
  return (
    <Reveal>
      <section className="surface-card p-6 sm:p-10">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-rose-600 text-white shadow-[0_12px_24px_rgba(220,38,38,0.28)]">
            <MessagesSquare className="h-6 w-6" />
          </span>
          <div>
            <h2 className="text-2xl font-black text-slate-900">Group Debate Rooms</h2>
            <p className="text-xs font-semibold uppercase tracking-wide text-red-600">Up to 5 speakers · launching next</p>
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
          Join a live voice debate with up to four other learners. Rooms fill automatically — when five people are
          searching, a new room opens; if someone leaves, the next person waiting takes their place. You’ll get a motion
          to argue, a turn-based timer, and the chance to sharpen your spontaneous speaking under friendly pressure. No
          chat — pure speaking.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            { icon: <Users className="h-5 w-5" />, t: '5-person rooms', d: 'Auto-filled, auto-balanced debate groups.' },
            { icon: <Mic className="h-5 w-5" />, t: 'Voice only', d: 'Microphone-only, camera disabled by design.' },
            { icon: <Trophy className="h-5 w-5" />, t: 'Motions & timers', d: 'A topic to argue and structured turns.' },
          ].map((f) => (
            <div key={f.t} className="rounded-2xl border border-red-100 bg-red-50/40 p-4">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-red-600">{f.icon}</span>
              <p className="mt-2 text-sm font-bold text-slate-900">{f.t}</p>
              <p className="text-xs text-slate-600">{f.d}</p>
            </div>
          ))}
        </div>
      </section>
    </Reveal>
  )
}
