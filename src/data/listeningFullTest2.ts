import type { IELTSTest, Question, Section } from '../types/ieltsTypes'

// =============================================================================
// IELTS Listening Full Test 2  (IELTSXpress practice recordings)
//   Part 1 – Car Rental Inquiry               (Q1-10  note completion)
//   Part 2 – Harvesting & Processing Cocoa     (Q11-16 flow chart, Q17-20 matching)
//   Part 3 – Moa Dinosaur                      (Q21-26 multiple choice, Q27-30 matching)
//   Part 4 – History of Time-measurement       (Q31-35 notes, Q36-40 table)
// Audio + answer keys supplied by the user. Blanks accept "/"-separated variants.
// =============================================================================

const AUDIO_BASE = '/audio/ielts-listening'

function q(
  number: number,
  type: Question['type'],
  text: string,
  correctAnswer: string | string[],
  options?: string[],
): Question {
  return { id: `lt2-q${number}`, number, type, text, correctAnswer, options }
}

/* ============================== PART 1 ================================== */

const part1Questions: Question[] = [
  q(1, 'note-completion', 'Contact number', '04196570156'),
  q(2, 'note-completion', 'Send written quote by', 'post'),
  q(3, 'note-completion', 'Price for renting (daily)', '39 dollars/$39/39'),
  q(4, 'note-completion', 'Special requirement – an extra', 'bed'),
  q(5, 'note-completion', 'Most important facility', 'kitchen'),
  q(6, 'note-completion', 'Extra equipment – they should have a', 'heater'),
  q(7, 'note-completion', 'Extra equipment – as well as a', 'microwave'),
  q(8, 'note-completion', 'Pick them up from the', 'airport'),
  q(9, 'note-completion', "The caravan driver's age", '49'),
  q(10, 'note-completion', 'Country where licence will be registered', 'Australia'),
]

const part1: Section = {
  id: 'lt2-part1',
  title: 'Car Rental Inquiry',
  audioUrl: `${AUDIO_BASE}/test2-part1-car-rental.mp3`,
  partLabel: 'Part 1',
  partInstruction: 'Listen and answer questions 1 - 10.',
  groups: [
    {
      range: 'Questions 1 - 10',
      instruction: 'Complete the notes. Write ONE WORD ONLY/OR A NUMBER for each answer.',
      blocks: [
        { kind: 'title', text: 'Car Rental Inquiry' },
        { kind: 'example', segments: ['Nationality: ', 'American'] },
        { kind: 'note', segments: ['Contact number: ', { blank: 1, width: 'md' }] },
        { kind: 'note', segments: ['Send written quote by: ', { blank: 2, width: 'md' }] },
        { kind: 'note', segments: ['Price for renting: $', { blank: 3, width: 'md', after: ' daily' }] },
        { kind: 'space' },
        { kind: 'subhead', text: 'Special requirements for the room:' },
        { kind: 'note', bullet: true, segments: ['an extra ', { blank: 4, width: 'md' }] },
        { kind: 'note', bullet: true, segments: ['most important facility: ', { blank: 5, width: 'md' }] },
        { kind: 'space' },
        { kind: 'subhead', text: 'Extra equipment:' },
        { kind: 'note', bullet: true, segments: ['they should have a ', { blank: 6, width: 'md' }] },
        { kind: 'note', bullet: true, segments: ['as well as a ', { blank: 7, width: 'md' }] },
        { kind: 'note', segments: ['Pick them up from the ', { blank: 8, width: 'md' }] },
        { kind: 'note', segments: ["The caravan driver's age: ", { blank: 9, width: 'md' }] },
        { kind: 'note', segments: ['Country where licence will be registered: ', { blank: 10, width: 'md' }] },
      ],
    },
  ],
  questions: part1Questions,
}

/* ============================== PART 2 ================================== */

const cocoaTasteOptions = [
  { letter: 'A', text: 'intense' },
  { letter: 'B', text: 'mild' },
  { letter: 'C', text: 'chocolaty' },
  { letter: 'D', text: 'smoky' },
]

const part2Questions: Question[] = [
  q(11, 'note-completion', 'Chocolate beans are ___ and then bags are shipped.', 'harvested'),
  q(12, 'note-completion', 'Bags are then ___ and weighed by machines.', 'opened'),
  q(13, 'note-completion', 'Next chocolate beans are ___ in a hopper.', 'cleaned'),
  q(14, 'note-completion', 'Boiled chocolate beans are ___ and cracked.', 'expanded'),
  q(15, 'note-completion', 'Roasted beans needs to be ___', 'cooled'),
  q(16, 'note-completion', 'Roasted beans are ___ in the pocket.', 'sealed'),
  q(17, 'matching-information', 'First Crack', 'B', ['intense', 'mild', 'chocolaty', 'smoky']),
  q(18, 'matching-information', 'Green Beans', 'D', ['intense', 'mild', 'chocolaty', 'smoky']),
  q(19, 'matching-information', 'French Roast', 'C', ['intense', 'mild', 'chocolaty', 'smoky']),
  q(20, 'matching-information', 'Espresso Smoky', 'A', ['intense', 'mild', 'chocolaty', 'smoky']),
]

const part2: Section = {
  id: 'lt2-part2',
  title: 'Harvesting and Processing Cocoa Beans',
  audioUrl: `${AUDIO_BASE}/test2-part2-cocoa-beans.mp3`,
  partLabel: 'Part 2',
  partInstruction: 'Listen and answer questions 11 - 20.',
  groups: [
    {
      range: 'Questions 11 - 16',
      instruction: 'Complete the flow chart below. Write ONE WORD ONLY for each answer.',
      blocks: [
        { kind: 'title', text: 'Harvesting and Processing Cocoa Beans' },
        {
          kind: 'flow',
          boxes: [
            { segments: ['Chocolate beans are ', { blank: 11, width: 'md' }, ' and then bags are shipped.'] },
            { segments: ['Bags are then ', { blank: 12, width: 'md' }, ' and weighed by machines.'] },
            { segments: ['Next chocolate beans are ', { blank: 13, width: 'md' }, ' in a hopper.'] },
            { segments: ['After being roasted at a high temperature'] },
            { segments: ['Boiled chocolate beans are ', { blank: 14, width: 'md' }, ' and cracked.'] },
            { segments: ['Roasted beans needs to be ', { blank: 15, width: 'md' }] },
            { segments: ['Roasted beans are ', { blank: 16, width: 'md' }, ' in the pocket.'] },
          ],
        },
      ],
    },
    {
      range: 'Questions 17 - 20',
      instruction: 'What does each type of coffee taste like? Choose the correct group A-D for each item.',
      blocks: [
        {
          kind: 'grid',
          columns: ['A', 'B', 'C', 'D'],
          rows: [
            { blank: 17, label: 'First Crack' },
            { blank: 18, label: 'Green Beans' },
            { blank: 19, label: 'French Roast' },
            { blank: 20, label: 'Espresso Smoky' },
          ],
          options: cocoaTasteOptions,
        },
      ],
    },
  ],
  questions: part2Questions,
}

/* ============================== PART 3 ================================== */

const moaFeatureOptions = [
  { letter: 'A', text: 'the much taller female' },
  { letter: 'B', text: 'less fossils left' },
  { letter: 'C', text: 'the biggest eggs' },
  { letter: 'D', text: 'feeding at night' },
  { letter: 'E', text: 'better vocal sound' },
  { letter: 'F', text: 'poor eyesight' },
]

const part3Questions: Question[] = [
  q(21, 'multiple-choice', 'What is the thing that makes the Moa similar to dinosaur?', 'A', [
    'Both are of interest to the public.',
    'Both are extinct at similar time.',
    'Both left lots of fossil remains',
  ]),
  q(22, 'multiple-choice', 'What is the difference between Moa and other birds?', 'A', [
    'no wing bones',
    'a long tail',
    'a smaller head',
  ]),
  q(23, 'multiple-choice', "What's the special feature of their chicks?", 'C', [
    'They never return to the nests.',
    'Most of them die within two months after birth.',
    'They can find food by themselves.',
  ]),
  q(24, 'multiple-choice', "What is the tutor's opinion on male hatching the eggs?", 'B', [
    'He doubts whether it is true or possible.',
    'He thinks it may be true.',
    'He can say with certainty that it is true.',
  ]),
  q(25, 'multiple-choice', "What is the male student's response after hearing some people see a Moa recently?", 'C', [
    'He is surprised.',
    'He is worried.',
    'He is amused.',
  ]),
  q(26, 'multiple-choice', 'Why did the Moa become extinct?', 'B', [
    'climate change',
    'human interference',
    'competitions with other animals',
  ]),
  q(27, 'matching-information', 'the North Island Giant Moa', 'A'),
  q(28, 'matching-information', 'the Crested Moa', 'B'),
  q(29, 'matching-information', 'the Stout-legged Moa', 'F'),
  q(30, 'matching-information', 'the Eastern Moa', 'E'),
]

const part3: Section = {
  id: 'lt2-part3',
  title: 'Moa Dinosaur',
  audioUrl: `${AUDIO_BASE}/test2-part3-moa-dinosaur.mp3`,
  partLabel: 'Part 3',
  partInstruction: 'Listen and answer questions 21 - 30.',
  groups: [
    {
      range: 'Questions 21 - 26',
      instruction: 'Choose the correct answer.',
      blocks: [
        { kind: 'mcq', blank: 21, prompt: 'What is the thing that makes the Moa similar to dinosaur?', options: ['Both are of interest to the public.', 'Both are extinct at similar time.', 'Both left lots of fossil remains'] },
        { kind: 'mcq', blank: 22, prompt: 'What is the difference between Moa and other birds?', options: ['no wing bones', 'a long tail', 'a smaller head'] },
        { kind: 'mcq', blank: 23, prompt: "What's the special feature of their chicks?", options: ['They never return to the nests.', 'Most of them die within two months after birth.', 'They can find food by themselves.'] },
        { kind: 'mcq', blank: 24, prompt: "What is the tutor's opinion on male hatching the eggs?", options: ['He doubts whether it is true or possible.', 'He thinks it may be true.', 'He can say with certainty that it is true.'] },
        { kind: 'mcq', blank: 25, prompt: 'What is the male student’s response after hearing some people see a Moa recently?', options: ['He is surprised.', 'He is worried.', 'He is amused.'] },
        { kind: 'mcq', blank: 26, prompt: 'Why did the Moa become extinct?', options: ['climate change', 'human interference', 'competitions with other animals'] },
      ],
    },
    {
      range: 'Questions 27 - 30',
      instruction: 'Which feature is associated with each type of Moa? Choose the correct group A-F for each item.',
      blocks: [
        {
          kind: 'grid',
          columns: ['A', 'B', 'C', 'D', 'E', 'F'],
          rows: [
            { blank: 27, label: 'the North Island Giant Moa' },
            { blank: 28, label: 'the Crested Moa' },
            { blank: 29, label: 'the Stout-legged Moa' },
            { blank: 30, label: 'the Eastern Moa' },
          ],
          options: moaFeatureOptions,
        },
      ],
    },
  ],
  questions: part3Questions,
}

/* ============================== PART 4 ================================== */

const part4Questions: Question[] = [
  q(31, 'note-completion', 'One of the two time keepers: The ___', "sun's position/suns position/sun position"),
  q(32, 'note-completion', 'Natural events ... and the ___ behaviour.', 'animals/animal'),
  q(33, 'note-completion', 'Precise measurements important for organising activities for ___', 'religions/religion'),
  q(34, 'note-completion', 'Precise measurements important for organising activities for ___', 'government/the government'),
  q(35, 'note-completion', 'The oldest time keepers were discovered in Mesopotamia and ___', 'North Africa'),
  q(36, 'note-completion', 'The sundial – the time for day ___', 'varied'),
  q(37, 'note-completion', 'The clepsydra – changing pressure and ___', 'temperature'),
  q(38, 'note-completion', 'Time keeper: The ___', 'sandglasses/sandglass'),
  q(39, 'note-completion', 'The sandglasses – time duration was ___', 'limited'),
  q(40, 'note-completion', 'Fire candle clock – the burning ___ or rate of burning', 'time'),
]

const part4: Section = {
  id: 'lt2-part4',
  title: 'History of Time-measurement',
  audioUrl: `${AUDIO_BASE}/test2-part4-time-measurement.mp3`,
  partLabel: 'Part 4',
  partInstruction: 'Listen and answer questions 31 - 40.',
  groups: [
    {
      range: 'Questions 31 - 35',
      instruction: 'Complete the notes. Write NO MORE THAN TWO WORDS for each answer.',
      blocks: [
        { kind: 'title', text: 'History of time-measurement' },
        { kind: 'subhead', text: 'Primitive measurements by observing' },
        { kind: 'text', text: 'Two time keepers:' },
        { kind: 'note', bullet: true, segments: ['The ', { blank: 31, width: 'lg' }] },
        {
          kind: 'note',
          bullet: true,
          segments: [
            'Natural events, such as winds and rains, rivers flooding, plants flowering, and the ',
            { blank: 32, width: 'lg' },
            ' behaviour.',
          ],
        },
        { kind: 'space' },
        { kind: 'subhead', text: 'Precise measurements' },
        { kind: 'text', text: 'They became important for organising activities for:' },
        { kind: 'note', bullet: true, segments: [{ blank: 33, width: 'lg' }] },
        { kind: 'note', bullet: true, segments: [{ blank: 34, width: 'lg' }] },
        {
          kind: 'note',
          segments: ['The oldest time keepers were discovered in Mesopotamia and ', { blank: 35, width: 'lg' }, ' .'],
        },
      ],
    },
    {
      range: 'Questions 36 - 40',
      instruction: 'Complete the table below. Write ONE WORD ONLY for each answer.',
      blocks: [
        {
          kind: 'table',
          columns: ['Time Keeper', 'Disadvantages'],
          rows: [
            [
              { segments: ['The sundial'] },
              { segments: ['In different parts of the year, the time for day ', { blank: 36, width: 'md' }] },
            ],
            [
              { segments: ['The clepsydra (Water clock)'] },
              { segments: ['The changing pressure and ', { blank: 37, width: 'md' }, ' were what the flow of water still relied on.'] },
            ],
            [
              { segments: ['The ', { blank: 38, width: 'md' }] },
              { segments: ['The time duration was ', { blank: 39, width: 'md' }] },
            ],
            [
              { segments: ['Fire candle clock'] },
              { segments: ['The burning ', { blank: 40, width: 'md' }, ' or the rate of burning, was subject to the candles wax.'] },
            ],
          ],
        },
      ],
    },
  ],
  questions: part4Questions,
}

/* ============================== TEST ================================== */

export const listeningFullTest2: IELTSTest = {
  id: 'ielts-listening-2',
  title: 'IELTS Listening Full Test 2',
  type: 'Academic',
  module: 'Listening',
  duration: 32,
  totalQuestions: 40,
  sections: [part1, part2, part3, part4],
}
