// Curated IELTS Speaking question banks + mock-interview sets.
// These seed the AI examiner: the AI still generates adaptive follow-ups,
// but the opening questions / cue cards come from real exam-style material so
// every session feels authentic even before the AI adds its own twist.

export type SpeakingPart = 1 | 2 | 3

export type Part1Topic = {
  id: string
  topic: string
  questions: string[]
}

export type CueCard = {
  id: string
  title: string
  bullets: string[]
  followUp: string
  theme: string
}

export type Part3Theme = {
  id: string
  theme: string
  questions: string[]
}

/** What the user picks on the hub. `full_mock` runs Part 1 → 2 → 3 back to back. */
export type ExaminerMode = 'part1' | 'part2' | 'part3' | 'full_mock' | 'interview'

/** Mock-interview personas beyond IELTS (PRD Feature 9). */
export type InterviewKind = 'university' | 'scholarship' | 'job'

export type InterviewPack = {
  id: InterviewKind
  title: string
  persona: string
  description: string
  openers: string[]
}

// ── PART 1 ─────────────────────────────────────────────────────────────────
export const PART1_TOPICS: Part1Topic[] = [
  {
    id: 'hometown',
    topic: 'Hometown',
    questions: [
      'Let’s talk about your hometown. Where is your hometown, and what is it like?',
      'What do you like most about the place where you grew up?',
      'Has your hometown changed much in recent years?',
      'Would you like to live there in the future? Why or why not?',
    ],
  },
  {
    id: 'studies-work',
    topic: 'Studies & Work',
    questions: [
      'Do you work, or are you a student at the moment?',
      'What subject are you studying, or what is your job?',
      'Why did you choose that subject or career?',
      'What would you like to do in the future?',
    ],
  },
  {
    id: 'daily-routine',
    topic: 'Daily Life',
    questions: [
      'Can you describe a typical day in your life?',
      'What part of the day do you enjoy the most?',
      'Do you prefer mornings or evenings? Why?',
      'How do you usually relax after a busy day?',
    ],
  },
  {
    id: 'hobbies',
    topic: 'Hobbies & Free Time',
    questions: [
      'What do you like to do in your free time?',
      'How did you first become interested in that?',
      'Do you prefer doing activities alone or with other people?',
      'Is there a new hobby you would like to try? Why?',
    ],
  },
  {
    id: 'technology',
    topic: 'Technology',
    questions: [
      'How often do you use a smartphone or computer?',
      'What apps or websites do you use the most?',
      'Do you think you spend too much time online?',
      'How has technology changed the way you study or work?',
    ],
  },
  {
    id: 'food',
    topic: 'Food',
    questions: [
      'What kind of food do you usually eat?',
      'Do you prefer eating at home or in restaurants?',
      'Is there a dish from your country that you would recommend to a visitor?',
      'Have your eating habits changed over the years?',
    ],
  },
]

// ── PART 2 (Cue Cards) ──────────────────────────────────────────────────────
export const CUE_CARDS: CueCard[] = [
  {
    id: 'person-inspired',
    title: 'Describe a person who has inspired you',
    bullets: ['who this person is', 'how you know them', 'what they did that inspired you', 'and explain why they inspired you'],
    followUp: 'Do you think people today have enough good role models?',
    theme: 'people',
  },
  {
    id: 'skill-learned',
    title: 'Describe a skill you learned recently',
    bullets: ['what the skill is', 'how you learned it', 'how long it took you', 'and explain how it has helped you'],
    followUp: 'Is it better to learn a skill alone or with a teacher?',
    theme: 'learning',
  },
  {
    id: 'memorable-place',
    title: 'Describe a place you like to spend your time',
    bullets: ['where it is', 'how often you go there', 'what you do there', 'and explain why you like it'],
    followUp: 'Why do people need quiet places in busy cities?',
    theme: 'places',
  },
  {
    id: 'challenge',
    title: 'Describe a difficult challenge you completed',
    bullets: ['what the challenge was', 'why it was difficult', 'how you dealt with it', 'and explain how you felt afterwards'],
    followUp: 'Do difficult experiences make people stronger?',
    theme: 'experiences',
  },
  {
    id: 'goal',
    title: 'Describe an important goal you want to achieve',
    bullets: ['what the goal is', 'when you want to achieve it', 'what steps you need to take', 'and explain why it matters to you'],
    followUp: 'Are short-term or long-term goals more important?',
    theme: 'ambition',
  },
]

// ── PART 3 (Discussion) ─────────────────────────────────────────────────────
export const PART3_THEMES: Part3Theme[] = [
  {
    id: 'education',
    theme: 'Education & Learning',
    questions: [
      'How has the way people learn changed compared with the past?',
      'Should schools focus more on practical skills or academic knowledge?',
      'Do you think online learning will replace traditional classrooms?',
      'What role should parents play in a child’s education?',
    ],
  },
  {
    id: 'technology-society',
    theme: 'Technology & Society',
    questions: [
      'Is technology making communication between people better or weaker?',
      'How might artificial intelligence change the job market in the future?',
      'Do you think people rely too much on technology today?',
      'What are the risks of children using social media from a young age?',
    ],
  },
  {
    id: 'work-success',
    theme: 'Work & Success',
    questions: [
      'What does it mean to be successful in your culture?',
      'Is a high salary more important than enjoying your job?',
      'How important is teamwork in the modern workplace?',
      'Should governments do more to reduce unemployment?',
    ],
  },
  {
    id: 'environment',
    theme: 'Environment',
    questions: [
      'Whose responsibility is it to protect the environment — individuals or governments?',
      'How can cities be designed to be more environmentally friendly?',
      'Do you think people are willing to change their lifestyle to help the planet?',
      'What is the most serious environmental problem in your country?',
    ],
  },
]

// ── Mock interview packs (non-IELTS personas) ───────────────────────────────
export const INTERVIEW_PACKS: InterviewPack[] = [
  {
    id: 'university',
    title: 'University Admission',
    persona: 'a warm but probing university admissions officer',
    description: 'Motivation, fit, strengths and goals — like a real admissions interview.',
    openers: [
      'Thank you for joining us today. To start, could you tell me a little about yourself and why you applied to this programme?',
      'What is it about this field of study that excites you the most?',
    ],
  },
  {
    id: 'scholarship',
    title: 'Scholarship Interview',
    persona: 'a thoughtful scholarship committee member',
    description: 'Achievements, leadership, financial need and impact.',
    openers: [
      'Welcome. Let’s begin — why do you believe you are a strong candidate for this scholarship?',
      'Tell me about a time you overcame a significant obstacle in your studies.',
    ],
  },
  {
    id: 'job',
    title: 'Job Interview',
    persona: 'a friendly but rigorous hiring manager',
    description: 'Experience, problem-solving, strengths and weaknesses.',
    openers: [
      'Thanks for coming in. Could you walk me through your background and what brought you here?',
      'Tell me about a challenge you faced at work or in a project and how you handled it.',
    ],
  },
]

export const PART_LABELS: Record<SpeakingPart, string> = {
  1: 'Part 1 — Introduction & Interview',
  2: 'Part 2 — Individual Long Turn',
  3: 'Part 3 — Two-way Discussion',
}

/** Question-count budget per part before the examiner moves on. */
export const PART_QUESTION_BUDGET: Record<SpeakingPart, number> = {
  1: 5,
  2: 1,
  3: 5,
}

export function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}
