import { useMemo, useState } from 'react'
import { ArrowLeft, Award, BookOpen, Calculator, Clock3, GraduationCap, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AmbientBackdrop, BrandIcon, CountUp, Reveal, Stagger, StaggerItem, Tilt3D } from '@/components/fx'

type Category = 'University' | 'Scholarship' | 'IELTS' | 'SAT'

type Article = {
  id: string
  category: Category
  title: string
  excerpt: string
  readMin: number
  icon: LucideIcon
  tips: string[]
}

const articles: Article[] = [
  {
    id: 'app-standout',
    category: 'University',
    title: 'Build a Standout University Application',
    excerpt: 'A clear roadmap from shortlisting universities to submitting a memorable application.',
    readMin: 6,
    icon: GraduationCap,
    tips: [
      'Start 12 months early and track every deadline in one calendar.',
      'Write a personal statement around one specific, honest story.',
      'Request recommendations from teachers who know your growth, not just your grades.',
      'Show fit: connect each university to your concrete goals.',
    ],
  },
  {
    id: 'app-essay',
    category: 'University',
    title: 'The Personal Essay That Gets Remembered',
    excerpt: 'Turn an ordinary moment into a compelling narrative admissions officers remember.',
    readMin: 5,
    icon: GraduationCap,
    tips: [
      'Open in the middle of a scene, not with a definition.',
      'Show reflection: what changed in how you think?',
      'Cut adjectives, keep specifics. Detail beats drama.',
      'Read it aloud — if it sounds like you, keep it.',
    ],
  },
  {
    id: 'scholarship-playbook',
    category: 'Scholarship',
    title: 'Win Scholarships: A Strategic Playbook',
    excerpt: 'Apply smarter, not just more. A repeatable system for funding your studies.',
    readMin: 7,
    icon: Award,
    tips: [
      'Apply broadly to small + large awards — small ones have less competition.',
      'Reuse one strong essay core, then tailor the hook per scholarship.',
      'Quantify impact: numbers make your story credible.',
      'Never miss a deadline — set reminders one week early.',
    ],
  },
  {
    id: 'scholarship-essay',
    category: 'Scholarship',
    title: 'Scholarship Essays That Convert',
    excerpt: 'What reviewers actually look for, and how to give it to them fast.',
    readMin: 4,
    icon: Award,
    tips: [
      'Answer the exact prompt in the first two sentences.',
      'Tie your goals to the sponsor’s mission.',
      'Show momentum: what you have already done about your goal.',
      'End with a forward-looking, specific commitment.',
    ],
  },
  {
    id: 'ielts-band7',
    category: 'IELTS',
    title: 'IELTS Band 7+ Tactics',
    excerpt: 'Section-by-section habits that move you from a solid 6.5 to a confident 7+.',
    readMin: 8,
    icon: BookOpen,
    tips: [
      'Reading: skim for structure first, then locate keywords precisely.',
      'Listening: predict answers before the audio plays.',
      'Writing Task 2: one clear idea per paragraph, fully developed.',
      'Speaking: extend every answer with a reason and an example.',
    ],
  },
  {
    id: 'sat-boost',
    category: 'SAT',
    title: 'SAT Score-Boost Strategy',
    excerpt: 'Work the digital SAT format instead of fighting it — and protect your pacing.',
    readMin: 6,
    icon: Calculator,
    tips: [
      'Learn the adaptive module structure so module 1 effort pays off.',
      'Eliminate two wrong options before committing on hard questions.',
      'Pace: ~1.2 minutes per question, flag and move on.',
      'Review every mistake by type, not just by question.',
    ],
  },
]

const categories: Array<Category | 'All'> = ['All', 'University', 'Scholarship', 'IELTS', 'SAT']

function categoryTone(category: Category) {
  if (category === 'SAT') return 'blue' as const
  if (category === 'Scholarship') return 'deep' as const
  if (category === 'University') return 'rose' as const
  return 'red' as const
}

function categoryBadge(category: Category) {
  if (category === 'SAT') return 'border-blue-200 bg-blue-50 text-blue-700'
  return 'border-red-200 bg-red-50 text-red-700'
}

export default function Articles() {
  const navigate = useNavigate()
  const [active, setActive] = useState<Category | 'All'>('All')

  const filtered = useMemo(
    () => (active === 'All' ? articles : articles.filter((article) => article.category === active)),
    [active],
  )

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-10">
      <AmbientBackdrop variant="red" />

      <div className="relative mx-auto w-full max-w-6xl space-y-6">
        <Reveal>
          <section className="premium-hero p-6 sm:p-9">
            <div className="relative grid gap-4 xl:grid-cols-[minmax(0,1fr)_25rem] xl:items-start">
              <div>
                <div className="premium-top-controls">
                  <button onClick={() => navigate('/dashboard')} className="premium-back-btn">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to Home
                  </button>
                  <span className="premium-top-chip">
                    <Sparkles className="h-3.5 w-3.5" />
                    Guides &amp; Articles
                  </span>
                </div>
                <h1 className="premium-section-title mt-4">
                  Study <span className="arena-title-accent-red">Knowledge Hub</span>
                </h1>
                <p className="premium-section-subtitle max-w-3xl">
                  University application guides, scholarship strategy, and IELTS/SAT tips — short, actionable reads to move your score and your admissions chances.
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-3 xl:w-full">
                <div className="hero-metric-card interactive-lift">
                  <p className="hero-metric-label">Articles</p>
                  <p className="hero-metric-value-sm">
                    <CountUp value={articles.length} />
                  </p>
                  <p className="hero-metric-note">Curated reads</p>
                </div>
                <div className="hero-metric-card interactive-lift">
                  <p className="hero-metric-label">Tracks</p>
                  <p className="hero-metric-value-sm">
                    <CountUp value={4} />
                  </p>
                  <p className="hero-metric-note">Topics covered</p>
                </div>
                <div className="hero-metric-card interactive-lift">
                  <p className="hero-metric-label">Format</p>
                  <p className="hero-metric-value-sm hero-metric-value-compact">Quick</p>
                  <p className="hero-metric-note">4-8 min reads</p>
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const isActive = active === category
              return (
                <button
                  key={category}
                  onClick={() => setActive(category)}
                  className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? 'border-red-300 bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-[0_10px_22px_rgba(220,38,38,0.28)]'
                      : 'border-red-200 bg-white text-slate-700 hover:border-red-300 hover:text-red-700'
                  }`}
                >
                  {category}
                </button>
              )
            })}
          </div>
        </Reveal>

        <Stagger key={active} className="grid gap-5 md:grid-cols-2">
          {filtered.map((article) => {
            const Icon = article.icon
            return (
              <StaggerItem key={article.id} className="h-full">
                <Tilt3D className="h-full rounded-[1.6rem]" max={6}>
                  <article className="group relative h-full overflow-hidden rounded-[1.6rem] border border-slate-100 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] transition hover:border-red-200 hover:shadow-[0_24px_50px_rgba(220,38,38,0.12)]">
                    <div className="flex items-center justify-between">
                      <BrandIcon icon={Icon} size="lg" soft tone={categoryTone(article.category)} />
                      <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] ${categoryBadge(article.category)}`}>
                        {article.category}
                      </span>
                    </div>
                    <h2 className="mt-4 text-xl font-black tracking-tight text-slate-900">{article.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{article.excerpt}</p>
                    <ul className="mt-4 space-y-1.5">
                      {article.tips.map((tip) => (
                        <li key={tip} className="flex gap-2 text-[13px] leading-6 text-slate-700">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                      <Clock3 className="h-3.5 w-3.5 text-red-500" />
                      {article.readMin} min read
                    </p>
                  </article>
                </Tilt3D>
              </StaggerItem>
            )
          })}
        </Stagger>
      </div>
    </div>
  )
}
