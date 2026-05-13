import { PrismaClient, Difficulty, TestCategory } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

type SeedOption = {
  text: string
  isCorrect: boolean
}

type SeedQuestion = {
  text: string
  explanation: string
  weight: number
  options: SeedOption[]
}

type SeedTest = {
  slug: string
  title: string
  description: string
  category: TestCategory
  difficulty: Difficulty
  durationSec: number
  premium: boolean
  xpReward: number
  subjects: string[]
  questions: SeedQuestion[]
}

const achievements = [
  {
    slug: 'first_attempt',
    title: 'First Milestone',
    description: 'Complete your first full test attempt.',
    icon: 'Flag',
    xpReward: 50,
    criteria: { type: 'attempt_count', min: 1 },
  },
  {
    slug: 'precision_90',
    title: 'Precision 90+',
    description: 'Score 90% or above in any test.',
    icon: 'Target',
    xpReward: 120,
    criteria: { type: 'best_score', min: 90 },
  },
  {
    slug: 'streak_7',
    title: '7-Day Discipline',
    description: 'Maintain a 7 day activity streak.',
    icon: 'Flame',
    xpReward: 200,
    criteria: { type: 'streak', min: 7 },
  },
  {
    slug: 'xp_1000',
    title: 'XP Builder',
    description: 'Reach 1000 total XP.',
    icon: 'Rocket',
    xpReward: 250,
    criteria: { type: 'xp', min: 1000 },
  },
  {
    slug: 'olympiad_master',
    title: 'Olympiad Master',
    description: 'Score at least 85% on an Olympiad test.',
    icon: 'Crown',
    xpReward: 300,
    criteria: { type: 'olympiad_score', min: 85 },
  },
]

const tests: SeedTest[] = [
  {
    slug: 'sat-reading-precision-01',
    title: 'SAT Reading Precision Test 01',
    description: 'Focused SAT reading comprehension test covering inference and evidence pairing.',
    category: TestCategory.SAT,
    difficulty: Difficulty.MEDIUM,
    durationSec: 2700,
    premium: false,
    xpReward: 95,
    subjects: ['Reading', 'Critical Thinking'],
    questions: [
      {
        text: 'The author most likely includes paragraph 3 to establish which point?',
        explanation: 'Paragraph 3 introduces historical data to support the main argument.',
        weight: 1.2,
        options: [
          { text: 'To refute the reliability of modern surveys', isCorrect: false },
          { text: 'To provide historical context for the claim', isCorrect: true },
          { text: 'To introduce an opposing researcher', isCorrect: false },
          { text: 'To summarize the article conclusion', isCorrect: false },
        ],
      },
      {
        text: 'Which choice best describes the relationship between lines 18вЂ“24 and lines 25вЂ“31?',
        explanation: 'The second segment provides evidence that supports the assertion in the first segment.',
        weight: 1,
        options: [
          { text: 'A hypothesis followed by supporting evidence', isCorrect: true },
          { text: 'A contradiction followed by correction', isCorrect: false },
          { text: 'A summary followed by unrelated detail', isCorrect: false },
          { text: 'A problem followed by a policy proposal', isCorrect: false },
        ],
      },
      {
        text: 'The phrase "structural constraint" in line 42 most nearly means:',
        explanation: 'The context indicates a limitation imposed by the system design.',
        weight: 0.8,
        options: [
          { text: 'temporary challenge', isCorrect: false },
          { text: 'design-based limitation', isCorrect: true },
          { text: 'financial liability', isCorrect: false },
          { text: 'random occurrence', isCorrect: false },
        ],
      },
      {
        text: 'Which evidence from the passage best supports the answer to the previous question?',
        explanation: 'The sentence explicitly references limitations inherited from architecture.',
        weight: 1.3,
        options: [
          { text: 'Lines 4вЂ“6 (introduction of topic)', isCorrect: false },
          { text: 'Lines 19вЂ“21 (description of constraints)', isCorrect: true },
          { text: 'Lines 34вЂ“35 (author biography)', isCorrect: false },
          { text: 'Lines 47вЂ“48 (future recommendations)', isCorrect: false },
        ],
      },
      {
        text: 'The chart most directly supports which claim made in the passage?',
        explanation: 'The chart confirms that improvement was strongest in the intervention cohort.',
        weight: 1.1,
        options: [
          { text: 'Participation declined over three years', isCorrect: false },
          { text: 'Intervention group showed the highest gains', isCorrect: true },
          { text: 'Control group had identical performance', isCorrect: false },
          { text: 'Sample size was insufficient', isCorrect: false },
        ],
      },
    ],
  },
  {
    slug: 'ielts-reading-academic-01',
    title: 'IELTS Academic Reading Band Builder 01',
    description: 'Academic passage analysis with vocabulary-in-context and inference tasks.',
    category: TestCategory.IELTS,
    difficulty: Difficulty.HARD,
    durationSec: 3600,
    premium: true,
    xpReward: 120,
    subjects: ['Reading', 'Academic Vocabulary'],
    questions: [
      {
        text: 'The writerвЂ™s attitude toward early industrial policies can best be described as:',
        explanation: 'The text acknowledges effectiveness but highlights social costs.',
        weight: 1.1,
        options: [
          { text: 'completely supportive', isCorrect: false },
          { text: 'balanced but critical', isCorrect: true },
          { text: 'indifferent', isCorrect: false },
          { text: 'strongly dismissive', isCorrect: false },
        ],
      },
      {
        text: 'According to the passage, what was the primary driver of adoption in year two?',
        explanation: 'The author links adoption to measurable productivity gains.',
        weight: 1,
        options: [
          { text: 'regulatory penalties', isCorrect: false },
          { text: 'public campaign messaging', isCorrect: false },
          { text: 'documented efficiency improvements', isCorrect: true },
          { text: 'seasonal demand shifts', isCorrect: false },
        ],
      },
      {
        text: 'In paragraph 5, "scalable" most nearly means:',
        explanation: 'Scalable indicates the ability to expand without loss of performance.',
        weight: 0.9,
        options: [
          { text: 'profitable', isCorrect: false },
          { text: 'expandable', isCorrect: true },
          { text: 'temporary', isCorrect: false },
          { text: 'regulated', isCorrect: false },
        ],
      },
      {
        text: 'Which statement is TRUE according to the passage?',
        explanation: 'The passage states that pilot schools outperformed controls by year three.',
        weight: 1.2,
        options: [
          { text: 'Pilot schools underperformed controls', isCorrect: false },
          { text: 'No statistical difference was observed', isCorrect: false },
          { text: 'Pilot schools showed stronger year-three outcomes', isCorrect: true },
          { text: 'The trial ended after six months', isCorrect: false },
        ],
      },
      {
        text: 'The final paragraph suggests future research should prioritize:',
        explanation: 'The article recommends longitudinal tracking beyond initial implementation.',
        weight: 1.1,
        options: [
          { text: 'short-term pilot funding', isCorrect: false },
          { text: 'long-term impact measurement', isCorrect: true },
          { text: 'marketing strategy redesign', isCorrect: false },
          { text: 'equipment procurement only', isCorrect: false },
        ],
      },
    ],
  },
  {
    slug: 'olympiad-algebra-theory-01',
    title: 'Olympiad Algebra and Number Theory Challenge 01',
    description: 'Competition-level problem set focused on proof strategies and advanced transformations.',
    category: TestCategory.OLYMPIAD,
    difficulty: Difficulty.OLYMPIAD,
    durationSec: 5400,
    premium: true,
    xpReward: 180,
    subjects: ['Algebra', 'Number Theory', 'Proof'],
    questions: [
      {
        text: 'If a, b, c are positive reals with abc = 1, which inequality is always true?',
        explanation: 'Applying AM-GM directly yields the correct lower bound.',
        weight: 1.4,
        options: [
          { text: 'a+b+c < 2', isCorrect: false },
          { text: 'a+b+c >= 3', isCorrect: true },
          { text: 'ab+bc+ca <= 1', isCorrect: false },
          { text: 'a^2+b^2+c^2 <= 1', isCorrect: false },
        ],
      },
      {
        text: 'For integer n, n^2+n is always divisible by:',
        explanation: 'n(n+1) is product of consecutive integers, one of which is even.',
        weight: 1,
        options: [
          { text: '2', isCorrect: true },
          { text: '3', isCorrect: false },
          { text: '5', isCorrect: false },
          { text: '7', isCorrect: false },
        ],
      },
      {
        text: 'The sequence a_n = 2a_{n-1}+1 with a_1=1 has closed form:',
        explanation: 'Solve recurrence to get a_n = 2^n - 1.',
        weight: 1.1,
        options: [
          { text: '2^n + 1', isCorrect: false },
          { text: '2^n - 1', isCorrect: true },
          { text: 'n^2 + 1', isCorrect: false },
          { text: 'n(n+1)/2', isCorrect: false },
        ],
      },
      {
        text: 'Which method is most suitable to prove irrationality of sqrt(2)?',
        explanation: 'Classical contradiction proof based on parity is standard.',
        weight: 1,
        options: [
          { text: 'Proof by contradiction', isCorrect: true },
          { text: 'Mathematical induction', isCorrect: false },
          { text: 'Direct computation only', isCorrect: false },
          { text: 'Exhaustive enumeration', isCorrect: false },
        ],
      },
      {
        text: 'In modular arithmetic, if a в‰Ў b (mod m), then:',
        explanation: 'Congruence implies m divides a-b.',
        weight: 1,
        options: [
          { text: 'm divides a+b', isCorrect: false },
          { text: 'm divides a-b', isCorrect: true },
          { text: 'a=b necessarily', isCorrect: false },
          { text: 'a and b are prime', isCorrect: false },
        ],
      },
    ],
  },
  {
    slug: 'school-math-foundation-01',
    title: 'School Mathematics Foundation 01',
    description: 'Core arithmetic and algebra assessment for school students.',
    category: TestCategory.SCHOOL,
    difficulty: Difficulty.EASY,
    durationSec: 1800,
    premium: false,
    xpReward: 60,
    subjects: ['Mathematics', 'Reasoning'],
    questions: [
      {
        text: 'Solve: 3x + 5 = 20',
        explanation: 'Subtract 5 and divide by 3.',
        weight: 1,
        options: [
          { text: 'x = 4', isCorrect: false },
          { text: 'x = 5', isCorrect: true },
          { text: 'x = 6', isCorrect: false },
          { text: 'x = 7', isCorrect: false },
        ],
      },
      {
        text: 'What is 25% of 200?',
        explanation: 'Quarter of 200 equals 50.',
        weight: 1,
        options: [
          { text: '40', isCorrect: false },
          { text: '45', isCorrect: false },
          { text: '50', isCorrect: true },
          { text: '60', isCorrect: false },
        ],
      },
      {
        text: 'Simplify: 2(3a - 4)',
        explanation: 'Distribute 2 across both terms.',
        weight: 0.9,
        options: [
          { text: '6a - 8', isCorrect: true },
          { text: '6a - 4', isCorrect: false },
          { text: '3a - 8', isCorrect: false },
          { text: '5a - 4', isCorrect: false },
        ],
      },
      {
        text: 'If a triangle has angles 50В° and 60В°, the third angle is:',
        explanation: 'Triangle angles sum to 180В°.',
        weight: 1,
        options: [
          { text: '60В°', isCorrect: false },
          { text: '65В°', isCorrect: false },
          { text: '70В°', isCorrect: true },
          { text: '80В°', isCorrect: false },
        ],
      },
    ],
  },
]

async function upsertTest(test: SeedTest, authorId: string) {
  const existing = await prisma.test.findUnique({
    where: { slug: test.slug },
    select: { id: true },
  })

  const testData = {
    title: test.title,
    description: test.description,
    category: test.category,
    difficulty: test.difficulty,
    durationSec: test.durationSec,
    premium: test.premium,
    xpReward: test.xpReward,
    subjects: test.subjects,
    published: true,
    createdById: authorId,
  }

  if (!existing) {
    await prisma.test.create({
      data: {
        slug: test.slug,
        ...testData,
        questions: {
          create: test.questions.map((question, questionIndex) => ({
            text: question.text,
            explanation: question.explanation,
            order: questionIndex + 1,
            weight: question.weight,
            options: {
              create: question.options.map((option, optionIndex) => ({
                text: option.text,
                isCorrect: option.isCorrect,
                order: optionIndex + 1,
              })),
            },
          })),
        },
      },
    })
    return
  }

  const attemptsCount = await prisma.testAttempt.count({
    where: { testId: existing.id },
  })

  if (attemptsCount > 0) {
    await prisma.test.update({
      where: { slug: test.slug },
      data: testData,
    })
    return
  }

  await prisma.testQuestion.deleteMany({ where: { testId: existing.id } })

  await prisma.test.update({
    where: { slug: test.slug },
    data: {
      ...testData,
      questions: {
        create: test.questions.map((question, questionIndex) => ({
          text: question.text,
          explanation: question.explanation,
          order: questionIndex + 1,
          weight: question.weight,
          options: {
            create: question.options.map((option, optionIndex) => ({
              text: option.text,
              isCorrect: option.isCorrect,
              order: optionIndex + 1,
            })),
          },
        })),
      },
    },
  })
}

async function main() {
  const adminPasswordHash = await bcrypt.hash('Admin@12345', 12)
  const studentPasswordHash = await bcrypt.hash('Student@12345', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@smarttestpro.com' },
    update: {
      fullName: 'Smart Test Admin',
      role: 'ADMIN',
      passwordHash: adminPasswordHash,
    },
    create: {
      email: 'admin@smarttestpro.com',
      fullName: 'Smart Test Admin',
      role: 'ADMIN',
      passwordHash: adminPasswordHash,
    },
  })

  await prisma.user.upsert({
    where: { email: 'student@smarttestpro.com' },
    update: {
      fullName: 'Demo Student',
      role: 'USER',
      passwordHash: studentPasswordHash,
    },
    create: {
      email: 'student@smarttestpro.com',
      fullName: 'Demo Student',
      role: 'USER',
      passwordHash: studentPasswordHash,
    },
  })

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { slug: achievement.slug },
      update: achievement,
      create: achievement,
    })
  }

  for (const test of tests) {
    await upsertTest(test, admin.id)
  }

  console.log('Seed complete: users, achievements, and test bank have been initialized.')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

