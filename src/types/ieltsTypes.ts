export type IELTSTestType = 'Academic' | 'General Training'

export interface Question {
    id: string
    number: number
    text: string
    type:
    | 'multiple-choice'
    | 'true-false-not-given'
    | 'yes-no-not-given'
    | 'matching-headings'
    | 'matching-information'
    | 'summary-completion'
    | 'note-completion'
    | 'short-answer'
    | 'five-true-statements'
    | 'drag-drop-summary'
    options?: string[]
    correctAnswer: string | string[] // string[] for multi-slot questions
    explanation?: string
    location?: string // For Reading/Listening (paragraph or timestamp)
    evidence?: string // Exact verbatim quote from the passage that justifies the answer (for inline Q(n) answer-location highlighting in review mode)
    userAnswer?: string | string[]
    groupTitle?: string // e.g., "Questions 1-4"
    instruction?: string // e.g., "Which paragraph contains..."
}

export interface Section {
    id: string
    title: string
    content?: string // For Reading (full text)
    paragraphs?: { label: string; content: string }[] // For structured Reading passages
    audioUrl?: string // For Listening
    visualAidUrl?: string // Optional prompt/diagram image for Listening
    audioTranscript?: string // Optional transcript for practice mode review
    duration?: number // Audio duration in seconds
    questions: Question[]
}

export interface IELTSTest {
    id: string
    title: string
    type: IELTSTestType
    module: 'Listening' | 'Reading' | 'Writing' | 'Speaking'
    duration: number // Total minutes
    sections: Section[]
    totalQuestions: number
}

// Writing Specific Types
export interface WritingTask {
    id: string
    taskType: 'Task 1' | 'Task 2'
    question: string
    image?: string // For Task 1 graphs/charts
    minWords: number
    suggestedTime: number
    modelAnswer?: string
    markingCriteria?: {
        coherence: string
        lexical: string
        grammatical: string
        taskAchievement: string
    }
}

export interface WritingTest extends Omit<IELTSTest, 'sections' | 'totalQuestions' | 'module'> {
    module: 'Writing'
    tasks: WritingTask[]
}

// Speaking Specific Types
export interface SpeakingPart {
    id: string
    partNumber: 1 | 2 | 3
    title: string
    questions: string[]
    cueCard?: {
        topic: string
        bulletPoints: string[]
    }
    preparationTime?: number // For Part 2
}

export interface SpeakingTest extends Omit<IELTSTest, 'sections' | 'totalQuestions' | 'module'> {
    module: 'Speaking'
    parts: SpeakingPart[]
}

// Results
export interface TestResult {
    testId: string
    date: string
    score: number // Band score
    correctAnswers: number
    totalQuestions: number
    timeSpent: number
    answers: Record<string, any>
    detailedBreakdown?: TestResultBreakdown
    isPartial?: boolean
    leaderboardEligible?: boolean
}

export type QuestionReviewStatus = 'correct' | 'incorrect' | 'skipped'

export interface ReadingQuestionResult {
    questionId: string
    questionType: Question['type']
    sectionId: string
    sectionTitle: string
    partNumber: number
    questionNumbers: number[]
    displayNumber: string
    prompt: string
    location?: string
    paragraphLabel?: string
    userAnswer: string | number | string[] | undefined
    correctAnswer: string | string[]
    score: number
    maxScore: number
    status: QuestionReviewStatus
}

export interface ReadingSectionSummary {
    sectionId: string
    sectionTitle: string
    partNumber: number
    totalQuestions: number
    correctAnswers: number
    incorrectAnswers: number
    skippedAnswers: number
    accuracy: number
    questions: ReadingQuestionResult[]
}

export interface ReadingLocationInsight {
    sectionId: string
    sectionTitle: string
    partNumber: number
    paragraphLabel: string
    questionNumbers: number[]
    correctQuestionNumbers: number[]
    incorrectQuestionNumbers: number[]
    skippedQuestionNumbers: number[]
}

export interface ReadingTypeInsight {
    type: Question['type']
    label: string
    totalQuestions: number
    correctAnswers: number
    incorrectAnswers: number
    skippedAnswers: number
    accuracy: number
}

export interface ReadingAnalysisSummary {
    totalQuestions: number
    correctAnswers: number
    incorrectAnswers: number
    skippedAnswers: number
    accuracy: number
}

export interface ReadingAnalysisReport {
    generatedAt: string
    summary: ReadingAnalysisSummary
    sectionSummaries: ReadingSectionSummary[]
    questionResults: ReadingQuestionResult[]
    locationInsights: ReadingLocationInsight[]
    typeInsights: ReadingTypeInsight[]
}

export interface TestResultBreakdown {
    activeSectionIds: string[]
    readingAnalysis?: ReadingAnalysisReport
}

