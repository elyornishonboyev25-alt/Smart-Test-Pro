import { IELTSTest, Section } from '../types/ieltsTypes'

// Helper to calculate band score
export const calculateBandScore = (score: number): number => {
  if (score >= 39) return 9.0
  if (score >= 37) return 8.5
  if (score >= 35) return 8.0
  if (score >= 33) return 7.5
  if (score >= 30) return 7.0
  if (score >= 27) return 6.5
  if (score >= 23) return 6.0
  if (score >= 19) return 5.5
  if (score >= 15) return 5.0
  if (score >= 13) return 4.5
  if (score >= 10) return 4.0
  return 3.5
}

// Passage 1 Data
export const passage1Data: Section = {
  id: 'celebrity-study',
  title: 'A study of western celebrity',
  content: 'In our celebrity-obsessed culture...', // Fallback
  paragraphs: [
    {
      label: 'A',
      content: 'It seems that our current society cannot get enough information about the daily lives of celebrities. But how did celebrities become so much an important force in our culture? While people have always had shared a certain obsession for the fantastic and the famous, the notion of celebrity, as well as the types of people termed \'celebrities\', has evolved greatly throughout the ages. The word \'celebrity\' has its roots in the language of the ancient Roman civilization. The word we now know to mean \'a condition of being famous\' or \'a famous person\' is derived from the Latin word \'celeber\', meaning \'frequented or populous\'.'
    },
    {
      label: 'B',
      content: 'The celebrities of the ancient world were the powerful and awesome deities of Greece and Rome, and the citizens of these civilizations believed in a vast number of immortals who had a direct impact on their lives. It was, therefore, important to know about these figures\' personal lives. This need to know led to the creation of myths, which personalized the gods and involved them in ancient celebrity scandals that thrilled and excited the common people.'
    },
    {
      label: 'C',
      content: 'During ancient times, amateur and professional athletes also began to make an impact on the celebrity culture. Victors in the ancient Olympic Games were treated as heroes and were often elevated to god-like status. In the ancient Roman civilization, gladiators вЂ” the equivalent of today\'s professional athletes вЂ” were also revered by the common people for their heroics and seemingly superhuman strength.'
    },
    // Truncated for brevity but normally would include D, E, F, G...
    {
      label: 'D',
      content: 'As Europe moved into the Dark Ages...'
    }
  ],
  questions: [
    {
      id: 'q14',
      number: 14,
      text: 'Paragraph A',
      type: 'matching-headings',
      options: [
        'i Why it is necessary to explain the meaning of the word celebrity',
        'ii The influence of non-human celebrities on societies',
        'iii The impact of broadcasting on concepts of celebrity',
        'iv Creativity having greater value',
        'v Admiration for physical achievement',
        'vi The advantages of celebrity status in the ancient world',
        'vii A result of hardship',
        'viii Literacy and widespread celebrity',
        'ix Attitudes of celebrities towards the media',
        'x The original definition of celebrity'
      ],
      correctAnswer: '10', // Changed to string to match type
      explanation: 'Paragraph A discusses the origins...',
      location: 'Paragraph A'
    },
    {
      id: 'q15',
      number: 15,
      text: 'Paragraph B',
      type: 'matching-headings',
      options: [
        'i Why it is necessary to explain the meaning of the word celebrity',
        'ii The influence of non-human celebrities on societies',
        'iii The impact of broadcasting on concepts of celebrity'
      ],
      correctAnswer: '2',
      explanation: 'Paragraph B describes how deities...',
      location: 'Paragraph B'
    },
    {
      id: 'q16',
      number: 16,
      text: 'Paragraph C',
      type: 'matching-headings',
      options: [
        'v Admiration for physical achievement'
      ],
      correctAnswer: '5',
      explanation: 'Paragraph C focuses on athletes...',
      location: 'Paragraph C'
    }
  ]
}

export const passage2Data: Section = {
  id: 'ideal-homes',
  title: 'Ideal Homes',
  paragraphs: [
    {
      label: 'A',
      content: 'The concept of an ideal home has evolved significantly...'
    }
  ],
  questions: []
}

export const passage3Data: Section = {
  id: 'third-passage',
  title: 'Third Passage',
  paragraphs: [
    {
      label: 'A',
      content: 'Content for third passage...'
    }
  ],
  questions: []
}

// Mock Tests
export const mockReadingTests: IELTSTest[] = Array.from({ length: 5 }, (_, index) => ({
  id: `reading-test-${index + 1}`,
  title: `IELTS Academic Reading Test ${index + 1}`,
  type: 'Academic',
  module: 'Reading',
  duration: 60,
  sections: [passage1Data, passage2Data, passage3Data],
  totalQuestions: 40
}))

export const generateRandomReadingTest = (): IELTSTest => {
  return {
    id: `reading-test-${Date.now()}`,
    title: 'Random IELTS Academic Reading Test',
    type: 'Academic',
    module: 'Reading',
    duration: 60,
    sections: [passage1Data, passage2Data, passage3Data],
    totalQuestions: 40
  }
}

