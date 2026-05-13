import type { Question, Section } from '../types/ieltsTypes'

const paragraphOptionsAtoG = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

const day14PagodaTypeOptions = [
  'A. both Chinese and Japanese pagodas',
  'B. only Chinese pagodas',
  'C. only Japanese pagodas',
]

const day16HeadingOptions = [
  'A. MIRTP as a future model',
  'B. Identifying the main transport problems',
  'C. Preference for motorised vehicles',
  "D. Government authorities' instructions",
  'E. Initial improvements in mobility and transport modes',
  'F. Request for improved transport in Makete',
  'G. Transport improvements in the northern part of the district',
  'H. Improvements in the rail network',
  'I. Effects of initial MIRTP measures',
  'J. Co-operation of district officials',
  'K. Role of wheelbarrows and donkeys',
]

const day16SentenceEndingOptions = [
  'A. provided the people of Makete with experience in running bus and truck services.',
  'B. was especially successful in the northern part of the district.',
  'C. differed from earlier phases in that the community became less actively involved.',
  'D. improved paths used for transport up and down hillsides.',
  'E. was no longer a problem once the roads had been improved.',
  'F. cost less than locally made wheelbarrows.',
  'G. was done only at the request of local people who were willing to lend a hand.',
  'H. was at first considered by MIRTP to be affordable for the people of the district.',
  'I. hindered attempts to make the existing transport services more efficient.',
  'J. was thought to be the most important objective of Phase III.',
]

const day18SentenceEndingOptions = [
  'A. be discouraged by difficulties.',
  'B. travel on open land where they can look out for predators.',
  'C. eat more than they need for immediate purposes.',
  'D. be repeated daily.',
  'E. ignore distractions.',
  'F. be governed by the availability of water.',
  'G. follow a straight line.',
]

const day22HeadingOptions = [
  'A. The areas and artefacts within the pyramid itself',
  'B. A difficult task for those involved',
  'C. A king who saved his people',
  'D. A single certainty among other less definite facts',
  'E. An overview of the external buildings and areas',
  'F. A pyramid design that others copied',
  'G. An idea for changing the design of burial structures',
  'H. An incredible experience despite the few remains',
  'I. The answers to some unexpected questions',
]

const day22KingOptions = [
  'A. Initially he had to be persuaded to build in stone rather than clay.',
  'B. There is disagreement concerning the length of his reign.',
  "C. He failed to appreciate Imhotep's part in the design of the Step Pyramid.",
  'D. A few of his possessions were still in his tomb when archaeologists found it.',
  'E. He criticised the design and construction of other pyramids in Egypt.',
]

const day23SummaryOptions = [
  'pressure',
  'satisfaction',
  'intuition',
  'promotion',
  'reliance',
  'confidence',
  'information',
]

const day23PeopleOptions = ['A Stella Pachidi', 'B Hamish Low', 'C Ewan McGaughey']

const day14Questions: Question[] = [
  {
    id: 'day14-q1',
    number: 1,
    type: 'yes-no-not-given',
    groupTitle: 'Questions 1-4',
    instruction:
      'Choose YES if the statement agrees with the information in the text, choose NO if the statement contradicts the information, or choose NOT GIVEN if there is no information on this.',
    text: 'Only two Japanese pagodas have collapsed in 1400 years.',
    correctAnswer: 'YES',
    location: 'Paragraph A',
  },
  {
    id: 'day14-q2',
    number: 2,
    type: 'yes-no-not-given',
    text: 'The Hanshin earthquake of 1995 destroyed the pagoda at the Toji temple.',
    correctAnswer: 'NO',
    location: 'Paragraph A',
  },
  {
    id: 'day14-q3',
    number: 3,
    type: 'yes-no-not-given',
    text: 'The other buildings near the Toji pagoda had been built in the last 30 years.',
    correctAnswer: 'NOT GIVEN',
    location: 'Paragraph A',
  },
  {
    id: 'day14-q4',
    number: 4,
    type: 'yes-no-not-given',
    text: 'The builders of pagodas knew how to absorb some of the power produced by severe weather conditions.',
    correctAnswer: 'YES',
    location: 'Paragraphs E-F',
  },
  {
    id: 'day14-q5',
    number: 5,
    type: 'matching-information',
    groupTitle: 'Questions 5-10',
    instruction: 'Classify the following as typical of A, B or C.',
    text: 'easy interior access to top',
    options: day14PagodaTypeOptions,
    correctAnswer: 'B',
    location: 'Paragraph C',
  },
  {
    id: 'day14-q6',
    number: 6,
    type: 'matching-information',
    text: 'tiles on eaves',
    options: day14PagodaTypeOptions,
    correctAnswer: 'A',
    location: 'Paragraph D',
  },
  {
    id: 'day14-q7',
    number: 7,
    type: 'matching-information',
    text: 'use as observation post',
    options: day14PagodaTypeOptions,
    correctAnswer: 'B',
    location: 'Paragraph C',
  },
  {
    id: 'day14-q8',
    number: 8,
    type: 'matching-information',
    text: "size of eaves up to half the width of the building",
    options: day14PagodaTypeOptions,
    correctAnswer: 'C',
    location: 'Paragraph D',
  },
  {
    id: 'day14-q9',
    number: 9,
    type: 'matching-information',
    text: 'original religious purpose',
    options: day14PagodaTypeOptions,
    correctAnswer: 'A',
    location: 'Paragraph C',
  },
  {
    id: 'day14-q10',
    number: 10,
    type: 'matching-information',
    text: 'floors fitting loosely over each other',
    options: day14PagodaTypeOptions,
    correctAnswer: 'C',
    location: 'Paragraph F',
  },
  {
    id: 'day14-q11',
    number: 11,
    type: 'multiple-choice',
    groupTitle: 'Question 11',
    instruction: 'Choose the correct answer.',
    text: 'In a Japanese pagoda, the shinbashira',
    options: [
      'bears the full weight of the building.',
      'bends under pressure like a tree.',
      'connects the floors with the foundations.',
      'stops the floors moving too far.',
    ],
    correctAnswer: 'D',
    location: 'Paragraph F',
  },
  {
    id: 'day14-q12',
    number: 12,
    type: 'multiple-choice',
    groupTitle: 'Question 12',
    instruction: 'Choose the correct answer.',
    text: 'Shuzo Ishida performs experiments in order to',
    options: [
      'improve skyscraper design.',
      'be able to build new pagodas.',
      'learn about the dynamics of pagodas.',
      'understand ancient mathematics.',
    ],
    correctAnswer: 'C',
    location: 'Paragraph F',
  },
  {
    id: 'day14-q13',
    number: 13,
    type: 'multiple-choice',
    groupTitle: 'Question 13',
    instruction: 'Choose the correct answer.',
    text: 'The storeys of a Japanese pagoda are',
    options: [
      'linked only by wood.',
      'fastened only to the central pillar.',
      'fitted loosely on top of each other.',
      'joined by special weights.',
    ],
    correctAnswer: 'C',
    location: 'Paragraph G',
  },
]

const day15Questions: Question[] = [
  {
    id: 'day15-q14',
    number: 14,
    type: 'matching-information',
    groupTitle: 'Questions 14-17',
    instruction:
      'Reading Passage 2 has seven paragraphs. Which paragraph contains the following information? NB You may use any letter more than once.',
    text: 'a cost involved in purifying domestic water',
    options: paragraphOptionsAtoG,
    correctAnswer: 'E',
    location: 'Paragraph E',
  },
  {
    id: 'day15-q15',
    number: 15,
    type: 'matching-information',
    text: 'the stages in the development of the farming industry',
    options: paragraphOptionsAtoG,
    correctAnswer: 'B',
    location: 'Paragraph B',
  },
  {
    id: 'day15-q16',
    number: 16,
    type: 'matching-information',
    text: 'the term used to describe hidden costs',
    options: paragraphOptionsAtoG,
    correctAnswer: 'C',
    location: 'Paragraph C',
  },
  {
    id: 'day15-q17',
    number: 17,
    type: 'matching-information',
    text: 'one effect of chemicals on water sources',
    options: paragraphOptionsAtoG,
    correctAnswer: 'B',
    location: 'Paragraph B',
  },
  {
    id: 'day15-q18',
    number: 18,
    type: 'yes-no-not-given',
    groupTitle: 'Questions 18-21',
    instruction:
      'Choose YES if the statement agrees with the information in the text, choose NO if the statement contradicts the information, or choose NOT GIVEN if there is no information on this.',
    text: 'Several species of wildlife in the British countryside are declining.',
    correctAnswer: 'YES',
    location: 'Paragraph B',
  },
  {
    id: 'day15-q19',
    number: 19,
    type: 'yes-no-not-given',
    text: 'The taste of food has deteriorated in recent years.',
    correctAnswer: 'NOT GIVEN',
    location: 'Paragraphs A-G',
  },
  {
    id: 'day15-q20',
    number: 20,
    type: 'yes-no-not-given',
    text: 'The financial costs of environmental damage are widely recognised.',
    correctAnswer: 'NO',
    location: 'Paragraph C',
  },
  {
    id: 'day15-q21',
    number: 21,
    type: 'yes-no-not-given',
    text: 'One of the costs calculated by Professor Pretty was illness caused by food.',
    correctAnswer: 'YES',
    location: 'Paragraph E',
  },
  {
    id: 'day15-q22',
    number: 22,
    type: 'summary-completion',
    groupTitle: 'Questions 22-26',
    instruction: 'Complete the summary below. Choose NO MORE THAN THREE WORDS from the passage for each answer.',
    text: 'Professor Pretty concludes that our ______ are higher than most people realise, because we make three different types of payment.',
    correctAnswer: 'food bills',
    location: 'Paragraph E',
  },
  {
    id: 'day15-q23',
    number: 23,
    type: 'summary-completion',
    text: 'He feels it is realistic to suggest that Britain should reduce its reliance on ______.',
    correctAnswer: 'intensive farming',
    location: 'Paragraph F',
  },
  {
    id: 'day15-q24',
    number: 24,
    type: 'summary-completion',
    text: 'Although most farmers would be unable to adapt to ______, Professor Pretty wants the government to initiate change.',
    correctAnswer: 'organic farming',
    location: 'Paragraph G',
  },
  {
    id: 'day15-q25',
    number: 25,
    type: 'summary-completion',
    text: "He recommends establishing what he refers to as a ______.",
    correctAnswer: 'Greener Food Standard',
    location: 'Paragraph G',
  },
  {
    id: 'day15-q26',
    number: 26,
    type: 'summary-completion',
    text: 'He feels this would help to change the attitudes of both farmers and ______.',
    correctAnswer: 'consumers',
    location: 'Paragraph G',
  },
]

const day16Questions: Question[] = [
  {
    id: 'day16-q27',
    number: 27,
    type: 'matching-headings',
    groupTitle: 'Questions 27-30',
    instruction: 'Reading Passage 3 has six sections. Choose the correct heading for each section from the list of headings below.',
    text: 'Section B',
    options: day16HeadingOptions,
    correctAnswer: 'B',
    location: 'Section B',
  },
  {
    id: 'day16-q28',
    number: 28,
    type: 'matching-headings',
    text: 'Section C',
    options: day16HeadingOptions,
    correctAnswer: 'E',
    location: 'Section C',
  },
  {
    id: 'day16-q29',
    number: 29,
    type: 'matching-headings',
    text: 'Section E',
    options: day16HeadingOptions,
    correctAnswer: 'J',
    location: 'Section E',
  },
  {
    id: 'day16-q30',
    number: 30,
    type: 'matching-headings',
    text: 'Section F',
    options: day16HeadingOptions,
    correctAnswer: 'A',
    location: 'Section F',
  },
  {
    id: 'day16-q31',
    number: 31,
    type: 'yes-no-not-given',
    groupTitle: 'Questions 31-35',
    instruction:
      'Choose YES if the statement agrees with the information in the text, choose NO if the statement contradicts the information, or choose NOT GIVEN if there is no information on this.',
    text: 'MIRTP was divided into five phases.',
    correctAnswer: 'NO',
    location: 'Sections A-D',
  },
  {
    id: 'day16-q32',
    number: 32,
    type: 'yes-no-not-given',
    text: 'Prior to the start of MIRTP the Makete district was almost inaccessible during the rainy season.',
    correctAnswer: 'YES',
    location: 'Section B',
  },
  {
    id: 'day16-q33',
    number: 33,
    type: 'yes-no-not-given',
    text: 'Phase I of MIRTP consisted of a survey of household expenditure on transport.',
    correctAnswer: 'NO',
    location: 'Section B',
  },
  {
    id: 'day16-q34',
    number: 34,
    type: 'yes-no-not-given',
    text: 'The survey concluded that one-fifth or 20% of the household transport requirement was outside the local area.',
    correctAnswer: 'YES',
    location: 'Section B',
  },
  {
    id: 'day16-q35',
    number: 35,
    type: 'yes-no-not-given',
    text: "MIRTP hoped to improve the movement of goods from Makete district to the country's capital.",
    correctAnswer: 'NOT GIVEN',
    location: 'Sections A-F',
  },
  {
    id: 'day16-q36',
    number: 36,
    type: 'matching-information',
    groupTitle: 'Questions 36-39',
    instruction: 'Complete each sentence with the correct ending, A-J, below.',
    text: 'Construction of footbridges, steps and handrails',
    options: day16SentenceEndingOptions,
    correctAnswer: 'D',
    location: 'Section C',
  },
  {
    id: 'day16-q37',
    number: 37,
    type: 'matching-information',
    text: 'Frequent breakdown of buses and trucks in Makete',
    options: day16SentenceEndingOptions,
    correctAnswer: 'I',
    location: 'Section D',
  },
  {
    id: 'day16-q38',
    number: 38,
    type: 'matching-information',
    text: 'The improvement of secondary roads and paths',
    options: day16SentenceEndingOptions,
    correctAnswer: 'G',
    location: 'Section D',
  },
  {
    id: 'day16-q39',
    number: 39,
    type: 'matching-information',
    text: 'The isolation of Makete for part of year',
    options: day16SentenceEndingOptions,
    correctAnswer: 'E',
    location: 'Section D',
  },
  {
    id: 'day16-q40',
    number: 40,
    type: 'multiple-choice',
    groupTitle: 'Question 40',
    instruction: 'Choose the correct answer.',
    text: 'Which of the following phrases best describes the main aim of Reading Passage 3?',
    options: [
      'to suggest that projects such as MIRTP are needed in other countries',
      'to describe how MIRTP was implemented and how successful it was',
      'to examine how MIRTP promoted the use of donkeys',
      'to warn that projects such as MIRTP are likely to have serious problems',
    ],
    correctAnswer: 'B',
    location: 'Whole passage',
  },
]

const day17Questions: Question[] = [
  {
    id: 'day17-q1',
    number: 1,
    type: 'note-completion',
    groupTitle: 'Questions 1-9',
    instruction: 'Complete the notes below. Choose ONE WORD ONLY from the passage for each answer.',
    text: "Silkworm cocoon fell into emperor's wife's ______.",
    correctAnswer: 'tea',
    location: 'Paragraph A',
  },
  {
    id: 'day17-q2',
    number: 2,
    type: 'note-completion',
    text: "Emperor's wife invented a ______ to pull out silk fibres.",
    correctAnswer: 'reel',
    location: 'Paragraph A',
  },
  {
    id: 'day17-q3',
    number: 3,
    type: 'note-completion',
    text: 'Only ______ were allowed to produce silk.',
    correctAnswer: 'women',
    location: 'Paragraph B',
  },
  {
    id: 'day17-q4',
    number: 4,
    type: 'note-completion',
    text: 'Only ______ were allowed to wear silk.',
    correctAnswer: 'royalty',
    location: 'Paragraph B',
  },
  {
    id: 'day17-q5',
    number: 5,
    type: 'note-completion',
    text: 'Silk was used as a form of ______.',
    correctAnswer: 'currency',
    location: 'Paragraph B',
  },
  {
    id: 'day17-q6',
    number: 6,
    type: 'note-completion',
    text: 'Evidence found of ______ made from silk around 168 AD.',
    correctAnswer: 'paper',
    location: 'Paragraph B',
  },
  {
    id: 'day17-q7',
    number: 7,
    type: 'note-completion',
    text: 'Merchants used the Silk Road to take silk westward and bring back ______ and precious metals.',
    correctAnswer: 'wool',
    location: 'Paragraph C',
  },
  {
    id: 'day17-q8',
    number: 8,
    type: 'note-completion',
    text: '550 AD: ______ hid silkworm eggs in canes and took them to Constantinople.',
    correctAnswer: 'monks',
    location: 'Paragraph D',
  },
  {
    id: 'day17-q9',
    number: 9,
    type: 'note-completion',
    text: '20th century: ______ and other manmade fibres caused decline in silk production.',
    correctAnswer: 'nylon',
    location: 'Paragraph F',
  },
  {
    id: 'day17-q10',
    number: 10,
    type: 'true-false-not-given',
    groupTitle: 'Questions 10-13',
    instruction:
      'Choose TRUE if the statement agrees with the information in the text, choose FALSE if the statement contradicts the information, or choose NOT GIVEN if there is no information on this.',
    text: 'Gold was the most valuable material transported along the Silk Road.',
    correctAnswer: 'FALSE',
    location: 'Paragraph C',
  },
  {
    id: 'day17-q11',
    number: 11,
    type: 'true-false-not-given',
    text: 'Most tradesmen only went along certain sections of the Silk Road.',
    correctAnswer: 'TRUE',
    location: 'Paragraph C',
  },
  {
    id: 'day17-q12',
    number: 12,
    type: 'true-false-not-given',
    text: 'The Byzantines spread the practice of silk production across the West.',
    correctAnswer: 'FALSE',
    location: 'Paragraph D',
  },
  {
    id: 'day17-q13',
    number: 13,
    type: 'true-false-not-given',
    text: 'Silk yarn makes up the majority of silk currently exported from China.',
    correctAnswer: 'NOT GIVEN',
    location: 'Paragraph F',
  },
]

const day18Questions: Question[] = [
  {
    id: 'day18-q14',
    number: 14,
    type: 'true-false-not-given',
    groupTitle: 'Questions 14-18',
    instruction:
      'Choose TRUE if the statement agrees with the information in the text, choose FALSE if the statement contradicts the information, or choose NOT GIVEN if there is no information on this.',
    text: 'Local gulls and migrating arctic terns behave in the same way when offered food.',
    correctAnswer: 'FALSE',
    location: 'Paragraph B',
  },
  {
    id: 'day18-q15',
    number: 15,
    type: 'true-false-not-given',
    text: "Experts' definitions of migration tend to vary according to their area of study.",
    correctAnswer: 'TRUE',
    location: 'Paragraph D',
  },
  {
    id: 'day18-q16',
    number: 16,
    type: 'true-false-not-given',
    text: 'Very few experts agree that the movement of aphids can be considered migration.',
    correctAnswer: 'NOT GIVEN',
    location: 'Paragraph E',
  },
  {
    id: 'day18-q17',
    number: 17,
    type: 'true-false-not-given',
    text: "Aphids' journeys are affected by changes in the light that they perceive.",
    correctAnswer: 'TRUE',
    location: 'Paragraph F',
  },
  {
    id: 'day18-q18',
    number: 18,
    type: 'true-false-not-given',
    text: "Dingle's aim is to distinguish between the migratory behaviours of different species.",
    correctAnswer: 'FALSE',
    location: 'Paragraph F',
  },
  {
    id: 'day18-q19',
    number: 19,
    type: 'matching-information',
    groupTitle: 'Questions 19-22',
    instruction: 'Complete each sentence with the correct ending, A-G, below.',
    text: 'According to Dingle, migratory routes are likely to',
    options: day18SentenceEndingOptions,
    correctAnswer: 'G',
    location: 'Paragraph A',
  },
  {
    id: 'day18-q20',
    number: 20,
    type: 'matching-information',
    text: 'To prepare for migration, animals are likely to',
    options: day18SentenceEndingOptions,
    correctAnswer: 'C',
    location: 'Paragraph F',
  },
  {
    id: 'day18-q21',
    number: 21,
    type: 'matching-information',
    text: 'During migration, animals are unlikely to',
    options: day18SentenceEndingOptions,
    correctAnswer: 'A',
    location: 'Paragraph A',
  },
  {
    id: 'day18-q22',
    number: 22,
    type: 'matching-information',
    text: "Arctic terns illustrate migrating animals' ability to",
    options: day18SentenceEndingOptions,
    correctAnswer: 'E',
    location: 'Paragraph B',
  },
  {
    id: 'day18-q23',
    number: 23,
    type: 'summary-completion',
    groupTitle: 'Questions 23-26',
    instruction: 'Complete the summary below. Choose ONE WORD ONLY from the passage for each answer.',
    text: 'Pronghorns rely on their eyesight and ______ to avoid predators.',
    correctAnswer: 'speed',
    location: 'Paragraph G',
  },
  {
    id: 'day18-q24',
    number: 24,
    type: 'summary-completion',
    text: 'Their winter home is on the ______, where they avoid deep snow.',
    correctAnswer: 'plains',
    location: 'Paragraph G',
  },
  {
    id: 'day18-q25',
    number: 25,
    type: 'summary-completion',
    text: 'Their route between the two homes contains three ______.',
    correctAnswer: 'bottlenecks',
    location: 'Paragraph G',
  },
  {
    id: 'day18-q26',
    number: 26,
    type: 'summary-completion',
    text: 'One problem is construction of new homes in a narrow ______ of land on the route.',
    correctAnswer: 'corridor',
    location: 'Paragraph G',
  },
]

const day19Questions: Question[] = [
  {
    id: 'day19-q27',
    number: 27,
    type: 'matching-information',
    groupTitle: 'Questions 27-34',
    instruction: 'Reading Passage 3 has seven sections. Which section contains the following information? NB You may use any letter more than once.',
    text: 'a reference to books that assume a lack of mathematical knowledge',
    options: paragraphOptionsAtoG,
    correctAnswer: 'D',
    location: 'Section D',
  },
  {
    id: 'day19-q28',
    number: 28,
    type: 'matching-information',
    text: 'the way in which this is not a typical book about mathematics',
    options: paragraphOptionsAtoG,
    correctAnswer: 'B',
    location: 'Section B',
  },
  {
    id: 'day19-q29',
    number: 29,
    type: 'matching-information',
    text: 'personal examples of being helped by mathematics',
    options: paragraphOptionsAtoG,
    correctAnswer: 'G',
    location: 'Section G',
  },
  {
    id: 'day19-q30',
    number: 30,
    type: 'matching-information',
    text: 'examples of people who each had abilities that seemed incompatible',
    options: paragraphOptionsAtoG,
    correctAnswer: 'C',
    location: 'Section C',
  },
  {
    id: 'day19-q31',
    number: 31,
    type: 'matching-information',
    text: 'mention of different focuses of books about mathematics',
    options: paragraphOptionsAtoG,
    correctAnswer: 'B',
    location: 'Section B',
  },
  {
    id: 'day19-q32',
    number: 32,
    type: 'matching-information',
    text: 'a contrast between reading this book and reading other kinds of publication',
    options: paragraphOptionsAtoG,
    correctAnswer: 'E',
    location: 'Section E',
  },
  {
    id: 'day19-q33',
    number: 33,
    type: 'matching-information',
    text: 'a claim that the whole of the book is accessible to everybody',
    options: paragraphOptionsAtoG,
    correctAnswer: 'A',
    location: 'Section A',
  },
  {
    id: 'day19-q34',
    number: 34,
    type: 'matching-information',
    text: 'a reference to different categories of intended readers of this book',
    options: paragraphOptionsAtoG,
    correctAnswer: 'F',
    location: 'Section F',
  },
  {
    id: 'day19-q35',
    number: 35,
    type: 'summary-completion',
    groupTitle: 'Questions 35-40',
    instruction: 'Complete the sentences below. Choose ONE WORD ONLY from the passage for each answer.',
    text: 'Some areas of both music and mathematics are suitable for someone who is a ______.',
    correctAnswer: 'beginner',
    location: 'Section A',
  },
  {
    id: 'day19-q36',
    number: 36,
    type: 'summary-completion',
    text: 'It is sometimes possible to understand advanced mathematics using no more than a limited knowledge of ______.',
    correctAnswer: 'arithmetic',
    location: 'Section A',
  },
  {
    id: 'day19-q37',
    number: 37,
    type: 'summary-completion',
    text: 'The writer intends to show that mathematics requires ______ thinking, as well as analytical skills.',
    correctAnswer: 'intuitive',
    location: 'Section C',
  },
  {
    id: 'day19-q38',
    number: 38,
    type: 'summary-completion',
    text: 'Some books written by ______ have had to leave out the mathematics that is central to their theories.',
    correctAnswer: 'scientists',
    location: 'Section D',
  },
  {
    id: 'day19-q39',
    number: 39,
    type: 'summary-completion',
    text: 'The writer advises non-mathematical readers to perform ______ while reading the book.',
    correctAnswer: 'experiments',
    location: 'Section E',
  },
  {
    id: 'day19-q40',
    number: 40,
    type: 'summary-completion',
    text: 'A lawyer found that studying ______ helped even more than other areas of mathematics in the study of law.',
    correctAnswer: 'theorems',
    location: 'Section G',
  },
]

const day21Questions: Question[] = [
  {
    id: 'day21-q1',
    number: 1,
    type: 'true-false-not-given',
    groupTitle: 'Questions 1-7',
    instruction:
      'Choose TRUE if the statement agrees with the information in the text, choose FALSE if the statement contradicts the information, or choose NOT GIVEN if there is no information on this.',
    text: 'Polar bears suffer from various health problems due to the build-up of fat under their skin.',
    correctAnswer: 'FALSE',
    location: 'Paragraph A',
  },
  {
    id: 'day21-q2',
    number: 2,
    type: 'true-false-not-given',
    text: 'The study done by Liu and his colleagues compared different groups of polar bears.',
    correctAnswer: 'FALSE',
    location: 'Paragraph B',
  },
  {
    id: 'day21-q3',
    number: 3,
    type: 'true-false-not-given',
    text: 'Liu and colleagues were the first researchers to compare polar bears and brown bears genetically.',
    correctAnswer: 'NOT GIVEN',
    location: 'Paragraph B',
  },
  {
    id: 'day21-q4',
    number: 4,
    type: 'true-false-not-given',
    text: "Polar bears are able to control their levels of 'bad' cholesterol by genetic means.",
    correctAnswer: 'TRUE',
    location: 'Paragraph B',
  },
  {
    id: 'day21-q5',
    number: 5,
    type: 'true-false-not-given',
    text: 'Female polar bears are able to survive for about six months without food.',
    correctAnswer: 'TRUE',
    location: 'Paragraph C',
  },
  {
    id: 'day21-q6',
    number: 6,
    type: 'true-false-not-given',
    text: 'It was found that the bones of female polar bears were very weak when they came out of their dens in spring.',
    correctAnswer: 'FALSE',
    location: 'Paragraph D',
  },
  {
    id: 'day21-q7',
    number: 7,
    type: 'true-false-not-given',
    text: "The polar bear's mechanism for increasing bone density could also be used by people one day.",
    correctAnswer: 'FALSE',
    location: 'Paragraph D',
  },
  {
    id: 'day21-q8',
    number: 8,
    type: 'summary-completion',
    groupTitle: 'Questions 8-13',
    instruction: 'Complete the notes below. Choose ONE WORD ONLY from the passage for each answer.',
    text: 'People think of bears as unintelligent and ______.',
    correctAnswer: 'violent',
    location: 'Paragraph E',
  },
  {
    id: 'day21-q9',
    number: 9,
    type: 'summary-completion',
    text: 'In Tennoji Zoo, a bear has been seen using a branch as a ______.',
    correctAnswer: 'tool',
    location: 'Paragraph E',
  },
  {
    id: 'day21-q10',
    number: 10,
    type: 'summary-completion',
    text: 'This allowed him to knock down some ______.',
    correctAnswer: 'meat',
    location: 'Paragraph E',
  },
  {
    id: 'day21-q11',
    number: 11,
    type: 'summary-completion',
    text: 'A wild polar bear worked out a method of reaching a platform where a ______ was located.',
    correctAnswer: 'photographer',
    location: 'Paragraph E',
  },
  {
    id: 'day21-q12',
    number: 12,
    type: 'summary-completion',
    text: 'Polar bears have displayed behaviour such as conscious manipulation of objects and activity similar to a ______.',
    correctAnswer: 'game',
    location: 'Paragraph F',
  },
  {
    id: 'day21-q13',
    number: 13,
    type: 'summary-completion',
    text: 'They may make movements suggesting ______ if disappointed when hunting.',
    correctAnswer: 'frustration',
    location: 'Paragraph G',
  },
]

const day22Questions: Question[] = [
  {
    id: 'day22-q14',
    number: 14,
    type: 'matching-headings',
    groupTitle: 'Questions 14-20',
    instruction: 'Reading Passage 2 has seven paragraphs. Choose the correct heading for each paragraph from the list of headings below.',
    text: 'Paragraph 1',
    options: day22HeadingOptions,
    correctAnswer: 'D',
    location: 'Paragraph 1',
  },
  {
    id: 'day22-q15',
    number: 15,
    type: 'matching-headings',
    text: 'Paragraph 2',
    options: day22HeadingOptions,
    correctAnswer: 'G',
    location: 'Paragraph 2',
  },
  {
    id: 'day22-q16',
    number: 16,
    type: 'matching-headings',
    text: 'Paragraph 3',
    options: day22HeadingOptions,
    correctAnswer: 'B',
    location: 'Paragraph 3',
  },
  {
    id: 'day22-q17',
    number: 17,
    type: 'matching-headings',
    text: 'Paragraph 4',
    options: day22HeadingOptions,
    correctAnswer: 'E',
    location: 'Paragraph 4',
  },
  {
    id: 'day22-q18',
    number: 18,
    type: 'matching-headings',
    text: 'Paragraph 5',
    options: day22HeadingOptions,
    correctAnswer: 'A',
    location: 'Paragraph 5',
  },
  {
    id: 'day22-q19',
    number: 19,
    type: 'matching-headings',
    text: 'Paragraph 6',
    options: day22HeadingOptions,
    correctAnswer: 'H',
    location: 'Paragraph 6',
  },
  {
    id: 'day22-q20',
    number: 20,
    type: 'matching-headings',
    text: 'Paragraph 7',
    options: day22HeadingOptions,
    correctAnswer: 'F',
    location: 'Paragraph 7',
  },
  {
    id: 'day22-q21',
    number: 21,
    type: 'summary-completion',
    groupTitle: 'Questions 21-24',
    instruction: 'Complete the notes below. Choose ONE WORD ONLY from the passage for each answer.',
    text: 'The complex that included the Step Pyramid and its surroundings is considered to be as big as an Egyptian ______ of the past.',
    correctAnswer: 'city',
    location: 'Paragraph 4',
  },
  {
    id: 'day22-q22',
    number: 22,
    type: 'summary-completion',
    text: 'The area outside the pyramid included accommodation occupied by ______.',
    correctAnswer: 'priests',
    location: 'Paragraph 4',
  },
  {
    id: 'day22-q23',
    number: 23,
    type: 'summary-completion',
    text: 'A long ______ encircled the wall.',
    correctAnswer: 'trench',
    location: 'Paragraph 4',
  },
  {
    id: 'day22-q24',
    number: 24,
    type: 'summary-completion',
    text: 'Visitors could only enter the pyramid grounds if they knew the ______ of the real entrance.',
    correctAnswer: 'location',
    location: 'Paragraph 4',
  },
  {
    id: 'day22-q25',
    number: 25,
    type: 'five-true-statements',
    groupTitle: 'Questions 25-26',
    instruction: 'Choose TWO correct answers.',
    text: 'Which TWO of the following points does the writer make about King Djoser?',
    options: day22KingOptions,
    correctAnswer: ['B', 'D'],
    location: 'Paragraphs 2 and 6',
  },
]

const day23Questions: Question[] = [
  {
    id: 'day23-q27',
    number: 27,
    type: 'multiple-choice',
    groupTitle: 'Question 27',
    instruction: 'Choose the correct answer.',
    text: 'The first paragraph tells us about',
    options: [
      'the kinds of jobs that will be most affected by the growth of AI.',
      'the extent to which AI will alter the nature of the work that people do.',
      "the proportion of the world's labour force who will have jobs in AI in the future.",
      'the difference between ways that embodied and disembodied AI will impact on workers.',
    ],
    correctAnswer: 'B',
    location: 'Paragraph A',
  },
  {
    id: 'day23-q28',
    number: 28,
    type: 'multiple-choice',
    groupTitle: 'Question 28',
    instruction: 'Choose the correct answer.',
    text: "According to the second paragraph, what is Stella Pachidi's view of the 'knowledge economy'?",
    options: [
      'It is having an influence on the number of jobs available.',
      "It is changing people's attitudes towards their occupations.",
      'It is the main reason why the production sector is declining.',
      'It is a key factor driving current developments in the workplace.',
    ],
    correctAnswer: 'D',
    location: 'Paragraph B',
  },
  {
    id: 'day23-q29',
    number: 29,
    type: 'multiple-choice',
    groupTitle: 'Question 29',
    instruction: 'Choose the correct answer.',
    text: 'What did Pachidi observe at the telecommunications company?',
    options: [
      'staff disagreeing with the recommendations of AI',
      'staff feeling resentful about the intrusion of AI in their work',
      'staff making sure that AI produces the results that they want',
      'staff allowing AI to carry out tasks they ought to do themselves',
    ],
    correctAnswer: 'C',
    location: 'Paragraph F',
  },
  {
    id: 'day23-q30',
    number: 30,
    type: 'multiple-choice',
    groupTitle: 'Question 30',
    instruction: 'Choose the correct answer.',
    text: 'In his recently published research, Ewan McGaughey',
    options: [
      'challenges the idea that redundancy is a negative thing.',
      'shows the profound effect of mass unemployment on society.',
      'highlights some differences between past and future job losses.',
      'illustrates how changes in the job market can be successfully handled.',
    ],
    correctAnswer: 'D',
    location: 'Paragraphs J-K',
  },
  {
    id: 'day23-q31',
    number: 31,
    type: 'drag-drop-summary',
    groupTitle: 'Questions 31-34',
    instruction: 'Complete the summary by dragging the correct words into the gaps.',
    text:
      "Stella Pachidi has been focusing on the 'algorithmication' of jobs which rely not on production but on ______.\n" +
      'While monitoring a telecommunications company, she observed a growing ______ on recommendations made by AI.\n' +
      'Meanwhile, staff are deterred from experimenting and using their own ______.\n' +
      "Researchers are trying to make AI's decision-making easier to comprehend, and to increase users' ______ with regard to the technology.",
    options: day23SummaryOptions,
    correctAnswer: ['information', 'reliance', 'intuition', 'confidence'],
    location: 'Paragraphs B-H',
  },
  {
    id: 'day23-q35',
    number: 35,
    type: 'matching-information',
    groupTitle: 'Questions 35-40',
    instruction: 'Match each statement with the correct person. NB You may use any letter more than once.',
    text: 'Greater levels of automation will not result in lower employment.',
    options: day23PeopleOptions,
    correctAnswer: 'B',
    location: 'Paragraph I',
  },
  {
    id: 'day23-q36',
    number: 36,
    type: 'matching-information',
    text: 'There are several reasons why AI is appealing to businesses.',
    options: day23PeopleOptions,
    correctAnswer: 'A',
    location: 'Paragraph C',
  },
  {
    id: 'day23-q37',
    number: 37,
    type: 'matching-information',
    text: "AI's potential to transform people's lives has parallels with major cultural shifts which occurred in previous eras.",
    options: day23PeopleOptions,
    correctAnswer: 'C',
    location: 'Paragraph L',
  },
  {
    id: 'day23-q38',
    number: 38,
    type: 'matching-information',
    text: 'It is important to be aware of the range of problems that AI causes.',
    options: day23PeopleOptions,
    correctAnswer: 'A',
    location: 'Paragraph H',
  },
  {
    id: 'day23-q39',
    number: 39,
    type: 'matching-information',
    text: 'People are going to follow a less conventional career path than in the past.',
    options: day23PeopleOptions,
    correctAnswer: 'B',
    location: 'Paragraph I',
  },
  {
    id: 'day23-q40',
    number: 40,
    type: 'matching-information',
    text: 'Authorities should take measures to ensure that there will be adequately paid work for everyone.',
    options: day23PeopleOptions,
    correctAnswer: 'C',
    location: 'Paragraph K',
  },
]

const day14Section: Section = {
  id: 'day14-pagodas-p1',
  title: "Day 14 Passage 1: Why pagodas don't fall down",
  paragraphs: [
    {
      label: 'A',
      content:
        "In a land swept by typhoons and shaken by earthquakes, how has Japan's tallest and seemingly flimsiest old buildings - 500 or so wooden pagodas - remained standing for centuries? Records show that only two have collapsed during the past 1400 years. Those that have disappeared were destroyed by fire as a result of lightning or civil war. The disastrous Hanshin earthquake in 1995 killed 6,400 people, toppled elevated highways, flattened office blocks and devastated the port area of Kobe. Yet it left the magnificent five-storey pagoda at the Toji temple in nearby Kyoto unscathed, though it levelled a number of buildings in the neighbourhood.",
    },
    {
      label: 'B',
      content:
        "Japanese scholars have been mystified for ages about why these tall, slender buildings are so stable. It was only thirty years ago that the building industry felt confident enough to erect office blocks of steel and reinforced concrete that had more than a dozen floors. With its special shock absorbers to dampen the effect of sudden sideways movements from an earthquake, the thirty-six-storey Kasumigaseki building in central Tokyo - Japan's first skyscraper - was considered a masterpiece of modern engineering when it was built in 1968. Yet in 826, with only pegs and wedges to keep his wooden structure upright, the master builder Kobodaishi had no hesitation in sending his majestic Toji pagoda soaring fifty-five meters into the sky - nearly half as high as the Kasumigaseki skyscraper built some eleven centuries later. Clearly, Japanese carpenters of the day knew a few tricks about allowing a building to sway and settle itself rather than fight nature's forces. But what sort of tricks?",
    },
    {
      label: 'C',
      content:
        "The multi-storey pagoda came to Japan from China in the sixth century. As in China, they were first introduced with Buddhism and were attached to important temples. The Chinese built their pagodas in brick or stone, with inner staircases, and used them in later centuries mainly as watchtowers. When the pagoda reached Japan, however, its architecture was freely adapted to local conditions - they were built less high, typically five rather than nine storeys, made mainly of wood and the staircase was dispensed with because the Japanese pagoda did not have any practical use but became more of an art object. Because of the typhoons that batter Japan in the summer, Japanese builders learned to extend the eaves of buildings further beyond the walls. This prevents rainwater gushing down the walls.",
    },
    {
      label: 'D',
      content:
        "Pagodas in China and Korea have nothing like the overhang that is found on pagodas in Japan. The roof of a Japanese temple building can be made to overhang the sides of the structure by fifty percent or more of the building's overall width. For the same reason, the builders of Japanese pagodas seem to have further increased their weight by choosing to cover these extended eaves not with the porcelain tiles of many Chinese pagodas but with much heavier earthenware tiles.",
    },
    {
      label: 'E',
      content:
        "But this does not totally explain the great resilience of Japanese pagodas. Is the answer that, like a tall pine tree, the Japanese pagoda - with its massive trunk-like central pillar known as shinbashira - simply flexes and sways during a typhoon or earthquake? For centuries, many thought so. But the answer is not so simple because the startling thing is that the shinbashira actually carries no load at all. In fact, in some pagoda designs, it does not even rest on the ground, but is suspended from the top of the pagoda - hanging loosely down through the middle of the building. The weight of the building is supported entirely by twelve outer and four inner columns.",
    },
    {
      label: 'F',
      content:
        "And what is the role of the shinbashira, the central pillar? The best way to understand the shinbashira's role is to watch a video made by Shuzo Ishida, a structural engineer at Kyoto Institute of Technology. Mr Ishida, known to his students as 'Professor Pagoda' because of his passion to understand the pagoda, has built a series of models and tested them on a shake-table in his laboratory. In short, the shinbashira was acting like an enormous stationary pendulum. The ancient craftsmen, apparently without the assistance of very advanced mathematics, seemed to grasp the principles that were, more than a thousand years later, applied in the construction of Japan's first skyscraper. What those early craftsmen had found by trial and error was that under pressure a pagoda's loose stack of floors could be made to slither to and fro independent of one another. Viewed from the side, the pagoda seemed to be doing a snake dance - with each consecutive floor moving in the opposite direction to its neighbours above and below. The shinbashira, running up through a hole in the centre of the building, constrained individual storeys from moving too far because, after moving a certain distance, they banged into it, transmitting energy away along the column.",
    },
    {
      label: 'G',
      content:
        'Another strange feature of the Japanese pagoda is that, because the building tapers, with each successive floor plan being smaller than the one below, none of the vertical pillars that carry the weight of the building is connected to its corresponding pillar above. In other words, a five-storey pagoda contains not even one pillar that travels right up through the building to carry the structural loads from the top to the bottom. More surprising is the fact that the individual storeys of a Japanese pagoda, unlike their counterparts elsewhere, are not actually connected to each other. They are simply stacked one on top of another like a pile of hats. Interestingly, such a design would not be permitted under current Japanese building regulations. And the extra-wide eaves? Think of them as a tightrope walker\'s balancing pole. The bigger the mass at each end of the pole, the easier it is for the tightrope walker to maintain his or her balance. The same holds true for a pagoda. "With the eaves extending out on all sides like balancing poles," says Mr Ishida, "the building responds to even the most powerful jolt of an earthquake with a graceful swaying, never an abrupt shaking." Here again, Japanese master builders of a thousand years ago anticipated concepts of modern structural engineering.',
    },
  ],
  questions: day14Questions,
}

const day15Section: Section = {
  id: 'day15-true-cost-food-p2',
  title: 'Day 15 Passage 2: The True Cost of Food',
  paragraphs: [
    {
      label: 'A',
      content:
        'For more than forty years, concern over the cost of food has intensified. Although food may appear cheaper to buy in many developed countries than in 1960, the real cost includes hidden damage linked to industrial agriculture.',
    },
    {
      label: 'B',
      content:
        'Over recent decades, farming progressed through mechanisation, heavy fertiliser and pesticide use, monocultures, intensive livestock systems, and genetic engineering. While yields rose, major ecological damage followed: declines in birds, flowers and insects, disappearance of hedgerows and ponds, and worsening water quality due to agricultural runoff.',
    },
    {
      label: 'C',
      content:
        "Consumers often fail to connect these effects to what they buy because many costs are 'externalities' - hidden costs outside normal market transactions, borne by society rather than directly by buyers or producers.",
    },
    {
      label: 'D',
      content:
        'Professor Jules Pretty and colleagues at the University of Essex quantified these externalities for British agriculture and found that total annual costs were extremely high, even on conservative estimates.',
    },
    {
      label: 'E',
      content:
        'The estimated costs included water purification, habitat damage, greenhouse gas emissions, soil erosion, food poisoning, and livestock disease. Pretty concluded that people pay three times: at the shop, through taxes supporting intensive farming, and through funding cleanup and repair of environmental damage.',
    },
    {
      label: 'F',
      content:
        'In Britain, moving away from industrial agriculture may be feasible because immediate food scarcity pressures are lower and long-term environmental harms are clearer.',
    },
    {
      label: 'G',
      content:
        "Pretty proposes a pragmatic middle path rather than an immediate universal shift to full organic farming: a 'Greener Food Standard' to improve agrochemical use, soil and water management, energy efficiency, food safety, and animal health while remaining accessible to consumers.",
    },
  ],
  questions: day15Questions,
}

const day16Section: Section = {
  id: 'day16-makete-transport-p3',
  title: 'Day 16 Passage 3: Makete Integrated Rural Transport Project',
  paragraphs: [
    {
      label: 'A',
      content:
        'Poor outcomes from conventional African road projects led to a new strategy in the 1980s. In remote Makete District, Tanzania, planners adopted an integrated rural transport model aimed at reducing time and effort needed to access goods and services. MIRTP began in 1985 with support from the Swiss Development Corporation and the Tanzanian government.',
    },
    {
      label: 'B',
      content:
        'At the start, Makete was nearly cut off during rainy months. A Phase I survey of over 400 households showed very high daily transport burdens: most travel was on foot, most movement remained local, and much effort went into collecting water and firewood and reaching grinding mills.',
    },
    {
      label: 'C',
      content:
        'During Phase II, solutions were implemented: roads were improved through labour-intensive methods, training was provided for workshops and transport services, paths were upgraded with steps, handrails and footbridges, and lower-cost local transport options were explored, including donkeys and locally manufacturable wheelbarrows.',
    },
    {
      label: 'D',
      content:
        'Phase III focused on refinement and institutionalisation. Road access improved year-round and market supplies became more stable. Community-requested path upgrades were popular. However, motorised services remained unreliable due to frequent vehicle breakdowns and limited repair resources. Even low-cost transport options remained expensive for many households.',
    },
    {
      label: 'E',
      content:
        "The project's early top-down style could be criticised, but district-level governmental support was necessary to respond to rural needs and sustain implementation.",
    },
    {
      label: 'F',
      content:
        'After sustained community development work, awareness of improved paths and affordable transport increased. The integrated rural transport concept became established in Tanzania, and Makete was seen as a reference model for broader national initiatives.',
    },
  ],
  questions: day16Questions,
}

const day17Section: Section = {
  id: 'day17-story-of-silk-p1',
  title: 'Day 17 Passage 1: The Story of Silk',
  paragraphs: [
    {
      label: 'A',
      content:
        "Silk, one of the world's most luxurious fabrics, was first produced from silkworm cocoons in China. According to legend, around 3000 BC Lei Tzu discovered silk when a cocoon dropped into her hot tea and unravelled into a fine thread. She later developed a reel to draw out strong fibres for weaving.",
    },
    {
      label: 'B',
      content:
        'Originally, silk production was mainly a female activity and silk use was restricted to royalty. Over time restrictions loosened. During the Han Dynasty, silk functioned not only as a textile but also as currency, tax payment, and diplomatic gift. Early silk paper dates to around 168 AD.',
    },
    {
      label: 'C',
      content:
        'Demand for silk drove the Silk Road, a lucrative route stretching from eastern China to the Mediterranean. Silk moved westward while wool, gold and silver moved eastward. Few merchants travelled the full route; goods often changed hands through middlemen.',
    },
    {
      label: 'D',
      content:
        'China held a long monopoly, but eventually silk production knowledge spread. One account says Byzantine monks smuggled silkworm eggs to Constantinople in hollow canes around 550 AD. Production later spread through regions linked to Arab expansion and then further into Europe.',
    },
    {
      label: 'E',
      content:
        'By the medieval period, areas such as Italy developed significant silk industries and reputations for high-quality silk processing.',
    },
    {
      label: 'F',
      content:
        'In modern times, industrialisation, world wars and manmade fibres such as nylon disrupted traditional silk production patterns. China later re-established itself as the leading producer and exporter of raw silk and silk yarn.',
    },
  ],
  questions: day17Questions,
}

const day18Section: Section = {
  id: 'day18-great-migrations-p2',
  title: 'Day 18 Passage 2: Great Migrations',
  paragraphs: [
    {
      label: 'A',
      content:
        'Animal migration is more than simple movement. It often follows regular cycles, involves prolonged and purposeful travel, demands special energy allocation, and is maintained despite distractions or challenges.',
    },
    {
      label: 'B',
      content:
        'An arctic tern may fly around 20,000 km from South America to the Arctic while ignoring easy feeding opportunities that local gulls seize. The tern remains focused on arrival and breeding goals.',
    },
    {
      label: 'C',
      content:
        'Arrival at Arctic breeding grounds serves an evolutionary purpose: finding suitable conditions to hatch and rear offspring.',
    },
    {
      label: 'D',
      content:
        'Definitions of migration vary among biologists. Joel Berger, studying terrestrial mammals like pronghorn, defines migration as seasonal round trips between separate home areas for resources.',
    },
    {
      label: 'E',
      content:
        'Other movements can also qualify, such as daily vertical movement of zooplankton and multi-generational movement of aphids to new host plants.',
    },
    {
      label: 'F',
      content:
        'Hugh Dingle offers a broader evolutionary framework with defining characteristics shared across species, highlighting common migration principles rather than focusing on a single animal group.',
    },
    {
      label: 'G',
      content:
        'Human development increasingly threatens migration routes. Pronghorn in North America face bottlenecks where movement corridors narrow due to natural and human barriers, including fencing and housing expansion.',
    },
    {
      label: 'H',
      content:
        'Conservation agencies are working to protect migration corridors, but long-distance routes crossing jurisdictions remain difficult to secure without coordinated policy and sustained commitment.',
    },
  ],
  questions: day18Questions,
}

const day19Section: Section = {
  id: 'day19-math-reasoning-preface-p3',
  title: "Day 19 Passage 3: Preface to 'How the other half thinks: Adventures in mathematical reasoning'",
  paragraphs: [
    {
      label: 'A',
      content:
        'The author argues that some advanced mathematical discoveries can be understood with only elementary arithmetic. The book presents each chapter step by step so readers can participate in mathematical reasoning.',
    },
    {
      label: 'B',
      content:
        'A main goal is to reveal the reasoning behind discoveries. The author contrasts this book with many popular mathematics books that either focus on biographies, applications, or procedures requiring prior algebra expertise.',
    },
    {
      label: 'C',
      content:
        'The book aims to bridge the divide between humanities and sciences, emphasizing that intuition matters alongside analytical thinking. The author cites people whose mixed talents challenge stereotypes.',
    },
    {
      label: 'D',
      content:
        'Other science writers often omit mathematics when addressing non-specialists, even though mathematics is foundational to their fields.',
    },
    {
      label: 'E',
      content:
        'Non-mathematical readers can still progress, but the reading requires sustained attention. The author recommends working slowly with pencil and paper and checking claims through experiments.',
    },
    {
      label: 'F',
      content:
        'The book targets multiple reader groups, including former maths enthusiasts and those seeking stronger analytical skills for professional fields.',
    },
    {
      label: 'G',
      content:
        'Testimonials from a physician and a lawyer claim that mathematical training improved their problem-solving and professional performance.',
    },
  ],
  questions: day19Questions,
}

const day21Section: Section = {
  id: 'day21-polar-bears-p1',
  title: 'Day 21 Passage 1: Why we need to protect polar bears',
  paragraphs: [
    {
      label: 'A',
      content:
        'Polar bears are increasingly threatened by climate change, yet they survive extreme Arctic conditions with very high body fat levels that would usually cause severe health problems in humans.',
    },
    {
      label: 'B',
      content:
        'A 2014 study by Shi Ping Liu and colleagues compared polar bears with brown bears and identified genes linked to survival, including a gene affecting low-density lipoproteins (LDL). In humans, mutations in this gene are associated with heart disease risk.',
    },
    {
      label: 'C',
      content:
        'The polar bear genome may also provide insights into osteoporosis. Female polar bears endure lengthy fasting during maternity denning while still maintaining strong bones despite calcium depletion.',
    },
    {
      label: 'D',
      content:
        'Research by Alanda Lennox and Allen Goodship found that pregnant females increased bone density before denning and did not show major loss after emergence, suggesting unusual bone remodelling mechanisms with possible medical relevance.',
    },
    {
      label: 'E',
      content:
        'Conservation arguments are not only medical. Anecdotal evidence challenges stereotypes of bears as unintelligent and violent. Examples include tool-like branch use to dislodge food and calculated problem-solving behaviours in the wild.',
    },
    {
      label: 'F',
      content:
        'Other observations describe deliberate manipulation and behaviour resembling play, suggesting creativity and focused action beyond earlier assumptions.',
    },
    {
      label: 'G',
      content:
        'Reports also suggest emotional responses and unusual cross-species social relationships in some bears, reinforcing the argument that their extinction would be a major biological and moral loss.',
    },
  ],
  questions: day21Questions,
}

const day22Section: Section = {
  id: 'day22-step-pyramid-p2',
  title: 'Day 22 Passage 2: The Step Pyramid of Djoser',
  paragraphs: [
    {
      label: 'A',
      content:
        'The Step Pyramid of Djoser at Saqqara is widely seen as the starting point of pyramid architecture in Egypt, despite ongoing debate over many details of early pyramid evolution.',
    },
    {
      label: 'B',
      content:
        "Before Djoser, tombs were rectangular mud-brick mastabas. Imhotep conceived a new design by stacking progressively smaller stone slabs, creating the stepped form. The exact reasons remain uncertain, and even Djoser's reign length is debated.",
    },
    {
      label: 'C',
      content:
        'Modern investigation indicates multiple design stages and extensive experimentation before the final six-level structure emerged. Managing the enormous weight required careful engineering choices.',
    },
    {
      label: 'D',
      content:
        'The surrounding complex was vast, including temples, courtyards, shrines, housing for priests, and defensive-style features such as false doors and a trench to deter intruders.',
    },
    {
      label: 'E',
      content:
        'Beneath the pyramid lay the burial chamber and a large network of passages and chambers. Thousands of inscribed stone vessels were discovered, but their exact purpose remains contested.',
    },
    {
      label: 'F',
      content:
        'Despite precautions, robbers still reached the tomb and removed major valuables. Nevertheless, sufficient finds remained to astonish archaeologists.',
    },
    {
      label: 'G',
      content:
        'Scholars regard the Step Pyramid as a major architectural milestone and an archetype for later pyramid builders in Egypt.',
    },
  ],
  questions: day22Questions,
}

const day23Section: Section = {
  id: 'day23-future-work-p3',
  title: 'Day 23 Passage 3: The future of work',
  paragraphs: [
    {
      label: 'A',
      content:
        'Forecasts suggest substantial workforce transition over coming years as occupations evolve alongside both embodied and disembodied AI systems.',
    },
    {
      label: 'B',
      content:
        "Stella Pachidi argues that major changes are occurring in data-dependent parts of the knowledge economy, where algorithms now handle tasks once requiring human judgement.",
    },
    {
      label: 'C',
      content:
        'Businesses are drawn to algorithms for speed, perceived informational quality, reduced costs, and productivity gains, including cases where AI outperforms humans in specific routine cognitive tasks.',
    },
    {
      label: 'D',
      content:
        'Pachidi warns that over-automation may weaken learning pathways for novices who traditionally acquire expertise through observation and guided participation.',
    },
    {
      label: 'E',
      content:
        'Her fieldwork in telecommunications showed increasing algorithmic control of customer-contact decisions, displacing professional judgement built through practical experience.',
    },
    {
      label: 'F',
      content:
        'She also observed workers becoming dependent on algorithmic instruction and, in some cases, gaming systems by feeding misleading data to achieve targets.',
    },
    {
      label: 'G',
      content:
        'Researchers are therefore working on more trustworthy and transparent AI systems to improve comprehension and user confidence in automated decisions.',
    },
    {
      label: 'H',
      content:
        'Hamish Low predicts more varied and multi-stage career paths with retraining across life, while rejecting simplistic fixed-job assumptions in automation forecasts.',
    },
    {
      label: 'I',
      content:
        'Ewan McGaughey argues that unemployment outcomes depend heavily on policy and law. He proposes proactive reforms to ensure secure employment, fair income, and broad-based economic participation.',
    },
    {
      label: 'J',
      content:
        'He frames current AI change in historical perspective, comparing it with earlier social and industrial transformations and arguing that the next revolution should be social as well as technological.',
    },
  ],
  questions: day23Questions,
}

export const readingDaySectionsDay14To23: Record<number, Section> = {
  14: day14Section,
  15: day15Section,
  16: day16Section,
  17: day17Section,
  18: day18Section,
  19: day19Section,
  21: day21Section,
  22: day22Section,
  23: day23Section,
}
