import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Award,
  Building2,
  CalendarDays,
  CircleDollarSign,
  ExternalLink,
  GraduationCap,
  Leaf,
  MapPin,
  Sparkles,
  Star,
  Trophy,
  Users,
} from 'lucide-react'
import { AmbientBackdrop, CountUp, Reveal } from '@/components/fx'
import UniversityLogo from '@/components/admission/UniversityLogo'
import { getUniversityBySlug, presentIndicators, QS_EDITION } from '@/data/admission'
import type { CostOfLiving } from '@/data/admission'

function money(value: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value)
}

const COST_LABELS: { key: keyof Omit<CostOfLiving, 'currency'>; label: string; icon: typeof Building2 }[] = [
  { key: 'accommodation', label: 'Accommodation', icon: Building2 },
  { key: 'food', label: 'Food', icon: CircleDollarSign },
  { key: 'transport', label: 'Transport', icon: MapPin },
  { key: 'utilities', label: 'Utilities', icon: Sparkles },
]

export default function AdmissionUniversity() {
  const navigate = useNavigate()
  const { slug } = useParams<{ slug: string }>()
  const university = slug ? getUniversityBySlug(slug) : undefined

  if (!university) {
    return (
      <div className="relative min-h-screen overflow-hidden px-4 py-10 sm:px-6 lg:px-10">
        <AmbientBackdrop variant="red" />
        <div className="relative mx-auto max-w-3xl rounded-2xl border border-red-100 bg-white p-10 text-center">
          <h1 className="text-2xl font-black text-slate-900">University not found</h1>
          <p className="mt-2 text-slate-500">This profile doesn’t exist or hasn’t been added yet.</p>
          <button onClick={() => navigate('/admission/universities')} className="premium-back-btn mt-6">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to rankings
          </button>
        </div>
      </div>
    )
  }

  const u = university
  const accent = u.brand.accent
  const indicators = presentIndicators(u.indicators)
  const students = u.students
  const cost = u.costOfLiving
  const totalCost = cost ? cost.accommodation + cost.food + cost.transport + cost.utilities : 0
  const hasDetailedStudents = students && typeof students.undergraduate === 'number'

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-10">
      <AmbientBackdrop variant="red" />

      <div className="relative mx-auto w-full max-w-5xl space-y-6">
        {/* ----------------------------- Hero ----------------------------- */}
        <Reveal>
          <section
            className="relative overflow-hidden rounded-[2rem] border border-white/10 p-6 text-white shadow-[0_30px_70px_rgba(15,23,42,0.28)] sm:p-9"
            style={{ background: u.brand.gradient }}
          >
            <div
              className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full opacity-40 blur-3xl"
              style={{ background: `radial-gradient(circle, ${accent}, transparent 70%)` }}
            />
            <div className="relative">
              <button
                onClick={() => navigate('/admission/universities')}
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/90 backdrop-blur transition hover:bg-white/20"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to rankings
              </button>

              <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
                <UniversityLogo brand={u.brand} size={96} rounded="1.5rem" className="ring-1 ring-white/20" />
                <div className="min-w-0">
                  <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl">{u.name}</h1>
                  <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-white/80">
                    <MapPin className="h-4 w-4" />
                    {u.countryEmoji} {u.city}, {u.country}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-white/15 px-3 py-1 text-[12px] font-semibold text-white/90">
                      {u.type}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-[12px] font-semibold text-white/90">
                      <CalendarDays className="h-3.5 w-3.5" />
                      Founded {u.founded}
                    </span>
                    <a
                      href={u.website}
                      target="_blank"
                      rel="noreferrer noopener"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-[12px] font-bold text-slate-900 transition hover:bg-white/90"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Visit website
                    </a>
                  </div>
                </div>
              </div>

              {/* Highlight stat cards */}
              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/70">QS World Ranking</p>
                  <p className="mt-1 text-3xl font-black">#{u.rank}</p>
                  <p className="text-[12px] font-medium text-white/70">{QS_EDITION}</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/70">Overall Score</p>
                  <p className="mt-1 text-3xl font-black">
                    <CountUp value={u.overallScore} />
                  </p>
                  <p className="text-[12px] font-medium text-white/70">out of 100</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/70">
                    {typeof u.subjectRank === 'number' ? 'Subject Ranking' : 'Students'}
                  </p>
                  <p className="mt-1 text-3xl font-black">
                    {typeof u.subjectRank === 'number'
                      ? `#${u.subjectRank}`
                      : students
                        ? `${(students.total / 1000).toFixed(students.total >= 10000 ? 0 : 1)}k`
                        : '—'}
                  </p>
                  <p className="text-[12px] font-medium text-white/70">
                    {typeof u.subjectRank === 'number' ? 'QS WUR by Subject' : 'Enrolled'}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        {/* ----------------------------- About ----------------------------- */}
        <Reveal delay={0.04}>
          <section className="rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)] sm:p-8">
            <h2 className="flex items-center gap-2 text-xl font-black tracking-tight text-slate-900">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white" style={{ background: accent }}>
                <GraduationCap className="h-4 w-4" />
              </span>
              About {u.shortName}
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-slate-600">{u.about}</p>
            <p className="mt-3 text-[14px] font-semibold italic text-slate-500">{u.tagline}</p>
          </section>
        </Reveal>

        {/* ----------------------- Rankings & Ratings ----------------------- */}
        <Reveal delay={0.04}>
          <section className="rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)] sm:p-8">
            <h2 className="flex items-center gap-2 text-xl font-black tracking-tight text-slate-900">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white" style={{ background: accent }}>
                <Trophy className="h-4 w-4" />
              </span>
              Rankings &amp; Ratings
            </h2>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <RankCard icon={Trophy} label="QS World University Rankings" value={`#${u.rank}`} accent={accent} />
              {typeof u.subjectRank === 'number' ? (
                <RankCard icon={Star} label="QS WUR Ranking by Subject" value={`#${u.subjectRank}`} accent={accent} />
              ) : null}
              {typeof u.sustainabilityRank === 'number' ? (
                <RankCard icon={Leaf} label="QS Sustainability Ranking" value={`#${u.sustainabilityRank}`} accent={accent} />
              ) : null}
            </div>

            {/* Indicator breakdown */}
            <h3 className="mt-7 text-sm font-bold uppercase tracking-[0.12em] text-slate-400">Ranking criteria</h3>
            <div className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {indicators.map(({ meta, value }) => (
                <div key={meta.key}>
                  <div className="flex items-center justify-between text-[13px] font-semibold text-slate-700">
                    <span>{meta.label}</span>
                    <span className="font-black text-slate-900">{value}</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full" style={{ width: `${value}%`, background: accent }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Rank history timeline */}
            {u.rankHistory && u.rankHistory.length > 1 ? (
              <div className="mt-8">
                <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-slate-400">Rank over time</h3>
                <div className="mt-4 flex flex-wrap items-end gap-x-3 gap-y-4">
                  {u.rankHistory.map((point) => (
                    <div key={point.year} className="flex flex-col items-center gap-1.5">
                      <span
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[13px] font-black text-white"
                        style={{ background: accent }}
                      >
                        {point.rank}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">{point.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        </Reveal>

        {/* ----------------------- Admission requirements ----------------------- */}
        {u.admission?.bachelor && u.admission.bachelor.length > 0 ? (
          <Reveal delay={0.04}>
            <section className="rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)] sm:p-8">
              <h2 className="flex items-center gap-2 text-xl font-black tracking-tight text-slate-900">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white" style={{ background: accent }}>
                  <Award className="h-4 w-4" />
                </span>
                Admission · Bachelor
              </h2>
              <p className="mt-2 text-[13px] text-slate-500">{u.admission.note}</p>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {u.admission.bachelor.map((req) => (
                  <div
                    key={req.label}
                    className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-center"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">{req.label}</p>
                    <p className="mt-1.5 text-xl font-black text-slate-900">{req.value}</p>
                  </div>
                ))}
              </div>
            </section>
          </Reveal>
        ) : null}

        {/* ----------------------- Students & Staff ----------------------- */}
        {students ? (
          <Reveal delay={0.04}>
            <section className="rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)] sm:p-8">
              <h2 className="flex items-center gap-2 text-xl font-black tracking-tight text-slate-900">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white" style={{ background: accent }}>
                  <Users className="h-4 w-4" />
                </span>
                Students &amp; Staff
              </h2>

              {hasDetailedStudents ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <StudentStat
                    label="Total students"
                    total={students.total}
                    parts={[
                      { label: 'Undergraduate', value: students.undergraduate ?? 0, color: accent },
                      { label: 'Postgraduate', value: students.postgraduate ?? 0, color: '#94a3b8' },
                    ]}
                  />
                  <StudentStat
                    label="International students"
                    total={students.international ?? 0}
                    parts={[
                      { label: 'Undergraduate', value: students.internationalUndergraduate ?? 0, color: accent },
                      { label: 'Postgraduate', value: students.internationalPostgraduate ?? 0, color: '#94a3b8' },
                    ]}
                  />
                  <StudentStat
                    label="Total faculty staff"
                    total={students.facultyStaff ?? 0}
                    parts={[
                      {
                        label: 'Domestic',
                        value: students.domesticStaffPct ?? 0,
                        color: accent,
                        isPct: true,
                      },
                      {
                        label: 'International',
                        value: students.internationalStaffPct ?? 0,
                        color: '#94a3b8',
                        isPct: true,
                      },
                    ]}
                  />
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">Total students</p>
                  <p className="mt-1 text-3xl font-black text-slate-900">≈ {students.total.toLocaleString()}</p>
                  <p className="mt-1 text-[12px] text-slate-500">Approximate enrolment across all levels.</p>
                </div>
              )}
            </section>
          </Reveal>
        ) : null}

        {/* ----------------------- Cost of Living ----------------------- */}
        {cost ? (
          <Reveal delay={0.04}>
            <section className="rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)] sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-xl font-black tracking-tight text-slate-900">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white" style={{ background: accent }}>
                    <CircleDollarSign className="h-4 w-4" />
                  </span>
                  Cost of Living
                </h2>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-[12px] font-bold text-slate-700">
                  ≈ {money(totalCost, cost.currency)} / year
                </span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {COST_LABELS.map(({ key, label, icon: Icon }) => (
                  <div key={key} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                    <Icon className="h-5 w-5" style={{ color: accent }} />
                    <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">{label}</p>
                    <p className="mt-0.5 text-lg font-black text-slate-900">{money(cost[key], cost.currency)}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[12px] text-slate-400">Approximate annual amounts for an international student.</p>
            </section>
          </Reveal>
        ) : null}

        {/* ----------------------- Campus ----------------------- */}
        {u.campus ? (
          <Reveal delay={0.04}>
            <section className="rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)] sm:p-8">
              <h2 className="flex items-center gap-2 text-xl font-black tracking-tight text-slate-900">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white" style={{ background: accent }}>
                  <Building2 className="h-4 w-4" />
                </span>
                Campus location
              </h2>
              <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-base font-black text-slate-900">{u.campus.name}</p>
                  <p className="mt-1 text-[13px] text-slate-500">{u.campus.address}</p>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(u.campus.mapsQuery)}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 self-start rounded-full px-4 py-2 text-[13px] font-bold text-white sm:self-center"
                  style={{ background: accent }}
                >
                  <MapPin className="h-4 w-4" />
                  Open in Maps
                </a>
              </div>
            </section>
          </Reveal>
        ) : null}

        <Reveal delay={0.04}>
          <p className="flex items-center justify-center gap-2 pb-2 text-center text-[12px] font-medium text-slate-400">
            <Sparkles className="h-3.5 w-3.5" />
            Profile data from the {QS_EDITION}.
          </p>
        </Reveal>
      </div>
    </div>
  )
}

/* --------------------------- small presentational helpers --------------------------- */

function RankCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Trophy
  label: string
  value: string
  accent: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
      <Icon className="h-5 w-5" style={{ color: accent }} />
      <p className="mt-2 text-2xl font-black text-slate-900">{value}</p>
      <p className="mt-0.5 text-[12px] font-semibold leading-snug text-slate-500">{label}</p>
    </div>
  )
}

function StudentStat({
  label,
  total,
  parts,
}: {
  label: string
  total: number
  parts: { label: string; value: number; color: string; isPct?: boolean }[]
}) {
  const sum = parts.reduce((s, p) => s + p.value, 0) || 1
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className="mt-1 text-3xl font-black text-slate-900">{total.toLocaleString()}</p>
      <div className="mt-3 flex h-2 w-full overflow-hidden rounded-full bg-slate-200">
        {parts.map((p) => (
          <div key={p.label} style={{ width: `${(p.value / sum) * 100}%`, background: p.color }} />
        ))}
      </div>
      <div className="mt-2.5 space-y-1">
        {parts.map((p) => (
          <div key={p.label} className="flex items-center justify-between text-[12px]">
            <span className="inline-flex items-center gap-1.5 font-medium text-slate-500">
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: p.color }} />
              {p.label}
            </span>
            <span className="font-bold text-slate-800">{p.isPct ? `${p.value}%` : p.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
