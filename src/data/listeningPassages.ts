import { IELTSTest, Section, Question } from '../types/ieltsTypes'

const AUDIO_BASE = '/audio/ielts-listening'
const IMAGE_BASE = '/images/ielts-listening'

function createQuestion(
  id: string,
  number: number,
  text: string,
  type: Question['type'],
  correctAnswer: string | string[],
  options?: string[],
): Question {
  return {
    id,
    number,
    text,
    type,
    options,
    correctAnswer,
  }
}

const listeningPart1: Section = {
  id: 'ielts-listening-test1-part1',
  title: 'Part 1: Cycling Holiday in Austria',
  audioUrl: `${AUDIO_BASE}/test1-part1.mp3`,
  visualAidUrl: `${IMAGE_BASE}/test1-part1.png`,
  duration: 380,
  content:
    'Questions 1-10. Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
  questions: [
    createQuestion('ls1-q1', 1, 'Holiday begins on', 'note-completion', 'Saturday'),
    createQuestion('ls1-q2', 2, 'No more than ____ people in cycling group', 'note-completion', '12'),
    createQuestion('ls1-q3', 3, 'Each day, group cycles ____ on average', 'note-completion', '35 km'),
    createQuestion('ls1-q4', 4, 'Some of the hotels have a', 'note-completion', 'swimming pool'),
    createQuestion('ls1-q5', 5, 'Holiday costs GBP ____ per person without flights', 'note-completion', '760'),
    createQuestion('ls1-q6', 6, 'All food included except', 'note-completion', 'lunch'),
    createQuestion('ls1-q7', 7, 'Essential to bring a', 'note-completion', 'waterproof jacket'),
    createQuestion('ls1-q8', 8, 'Discount possible on equipment at www.____.com', 'note-completion', 'bikeplus'),
    createQuestion('ls1-q9', 9, 'Possible that the ____ may change', 'note-completion', 'route'),
    createQuestion('ls1-q10', 10, 'Guided tour of a ____ is arranged', 'note-completion', 'castle'),
  ],
}

const listeningPart2: Section = {
  id: 'ielts-listening-test1-part2',
  title: 'Part 2: Harbour Area and Restaurants',
  audioUrl: `${AUDIO_BASE}/test1-part2.mp3`,
  visualAidUrl: `${IMAGE_BASE}/test1-part2.png`,
  duration: 420,
  content:
    'Questions 11-14: choose the correct letter A, B or C. Questions 15-20: choose SIX answers from the box and write the correct letter A-H.',
  questions: [
    createQuestion(
      'ls1-q11',
      11,
      'The market is now situated',
      'multiple-choice',
      '2',
      ['A. under a car park.', 'B. beside the cathedral.', 'C. near the river.'],
    ),
    createQuestion(
      'ls1-q12',
      12,
      'On only one day a week the market sells',
      'multiple-choice',
      '2',
      ['A. antique furniture.', 'B. local produce.', 'C. hand-made items.'],
    ),
    createQuestion(
      'ls1-q13',
      13,
      'The area is well known for',
      'multiple-choice',
      '1',
      ['A. ice cream.', 'B. a cake.', 'C. a fish dish.'],
    ),
    createQuestion(
      'ls1-q14',
      14,
      'What change has taken place in the harbour area?',
      'multiple-choice',
      '1',
      [
        'A. Fish can now be bought from the fishermen.',
        'B. The restaurants have moved to a different part.',
        'C. There are fewer restaurants than there used to be.',
      ],
    ),
    createQuestion(
      'ls1-q15',
      15,
      'Merrivales - advantage letter (A-H)',
      'short-answer',
      '2',
    ),
    createQuestion('ls1-q16', 16, 'The Lobster Pot - advantage letter (A-H)', 'short-answer', '5'),
    createQuestion(
      'ls1-q17',
      17,
      'Elliots - advantage letter (A-H)',
      'short-answer',
      '1',
    ),
    createQuestion('ls1-q18', 18, 'The Cabin - advantage letter (A-H)', 'short-answer', '6'),
    createQuestion('ls1-q19', 19, 'The Olive Tree - advantage letter (A-H)', 'short-answer', '7'),
    createQuestion(
      'ls1-q20',
      20,
      'The Old School Restaurant - advantage letter (A-H)',
      'short-answer',
      '0',
    ),
  ],
}

const listeningPart3: Section = {
  id: 'ielts-listening-test1-part3',
  title: 'Part 3: Film Project and Old Water-mill Map',
  audioUrl: `${AUDIO_BASE}/test1-part3.mp3`,
  visualAidUrl: `${IMAGE_BASE}/test1-part3.png`,
  duration: 470,
  content:
    'Questions 21-26: choose SIX answers from the box A-I. Questions 27-30: choose four answers from the box A-G for the map.',
  questions: [
    createQuestion('ls1-q21', 21, 'Visit locations and discuss', 'short-answer', '4'),
    createQuestion('ls1-q22', 22, 'Contact the ____ about roadworks', 'short-answer', '5'),
    createQuestion('ls1-q23', 23, 'Plan the', 'short-answer', '7'),
    createQuestion('ls1-q24', 24, 'Hold auditions and recheck availability of the', 'short-answer', '1'),
    createQuestion('ls1-q25', 25, 'Choose the ____ from the volunteers', 'short-answer', '8'),
    createQuestion('ls1-q26', 26, 'Collect ____ and organise food and transport', 'short-answer', '9'),
    createQuestion('ls1-q27', 27, 'Map label 27 (A-G)', 'short-answer', '1'),
    createQuestion('ls1-q28', 28, 'Map label 28 (A-G)', 'short-answer', '5'),
    createQuestion('ls1-q29', 29, 'Map label 29 (A-G)', 'short-answer', '4'),
    createQuestion('ls1-q30', 30, 'Map label 30 (A-G)', 'short-answer', '7'),
  ],
}

const listeningPart4: Section = {
  id: 'ielts-listening-test1-part4',
  title: 'Part 4: Exotic Pests Table Completion',
  audioUrl: `${AUDIO_BASE}/test1-part4.mp3`,
  visualAidUrl: `${IMAGE_BASE}/test1-part4.png`,
  duration: 520,
  content:
    'Questions 31-40. Complete the table below. Write NO MORE THAN TWO WORDS for each answer.',
  questions: [
    createQuestion('ls1-q31', 31, 'Even on island in middle of', 'note-completion', 'Pacific'),
    createQuestion('ls1-q32', 32, 'Imported into England to be used for', 'note-completion', 'food'),
    createQuestion('ls1-q33', 33, 'New habitat: ____ in Brisbane', 'note-completion', 'parks'),
    createQuestion('ls1-q34', 34, 'Origin: Australia. Name:', 'note-completion', 'cane toad'),
    createQuestion('ls1-q35', 35, 'Introduced to improve', 'note-completion', 'sugar cane'),
    createQuestion('ls1-q36', 36, 'New habitat: ____ Europe', 'note-completion', 'north-west'),
    createQuestion('ls1-q37', 37, 'Accidental introduction inside imported', 'note-completion', 'plants'),
    createQuestion('ls1-q38', 38, 'Origin: Japan. Name:', 'note-completion', 'starfish'),
    createQuestion('ls1-q39', 39, 'Budgerigar new habitat: urban areas of south-east', 'note-completion', 'England'),
    createQuestion('ls1-q40', 40, 'Smaller flocks because of arrival of', 'note-completion', 'cats'),
  ],
}

const listeningFullTest1Sections: Section[] = [
  listeningPart1,
  listeningPart2,
  listeningPart3,
  listeningPart4,
]

function cloneSection(section: Section, suffix: string): Section {
  return {
    ...section,
    id: `${section.id}-${suffix}`,
    questions: section.questions.map((question) => ({
      ...question,
      id: `${question.id}-${suffix}`,
      correctAnswer: Array.isArray(question.correctAnswer)
        ? [...question.correctAnswer]
        : question.correctAnswer,
      options: question.options ? [...question.options] : undefined,
    })),
  }
}

const listeningFullTest2Sections = listeningFullTest1Sections.map((section) => cloneSection(section, 't2'))

export const mockListeningTests: IELTSTest[] = [
  {
    id: 'ielts-listening-1',
    title: 'IELTS Listening Full Test 1',
    type: 'Academic',
    module: 'Listening',
    duration: 30,
    totalQuestions: 40,
    sections: listeningFullTest1Sections,
  },
  {
    id: 'ielts-listening-2',
    title: 'IELTS Listening Full Test 2',
    type: 'General Training',
    module: 'Listening',
    duration: 30,
    totalQuestions: 40,
    sections: listeningFullTest2Sections,
  },
]
