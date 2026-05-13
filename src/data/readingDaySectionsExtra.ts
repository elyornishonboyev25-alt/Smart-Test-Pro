import type { Question, Section } from '../types/ieltsTypes'
import { readingDaySectionsDay14To23 } from './readingDaySectionsDay14To23'

const paragraphOptionsAtoG = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
const paragraphOptionsAtoI = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']

const maryRoseDateOptions = ['A 1836', 'B 1840', 'C 1965', 'D 1967', 'E 1971', 'F 1979', 'G 1982']

const stadiumDrawbackOptions = [
  'A. They are less imaginatively designed.',
  'B. They are less spacious.',
  'C. They are in less convenient locations.',
  'D. They are less versatile.',
  'E. They are made of less durable materials.',
]

const stadiumAdvantageOptions = [
  'A. offering improved amenities for the enjoyment of sports events',
  'B. bringing community life back into the city environment',
  'C. facilitating research into solar and wind energy solutions',
  'D. enabling local residents to reduce their consumption of electricity',
  'E. providing a suitable site for the installation of renewable power generators',
]

const toCatchSummaryOptions = [
  'military innovation',
  'large reward',
  'widespread conspiracy',
  'relative safety',
  'new government',
  'decisive victory',
  'political debate',
  'strategic alliance',
  'popular solution',
  'religious conviction',
]

const easterIslandHeadingOptions = [
  'A. Evidence of innovative environment management practices',
  'B. An undisputed answer to a question about the moai',
  'C. The future of the moai statues',
  'D. A theory which supports a local belief',
  'E. The future of Easter Island',
  'F. Two opposing views about the Rapanui people',
  "G. Destruction outside the inhabitants' control",
  'H. How the statues made a situation worse',
  'I. Diminishing food resources',
]

const easterIslandDisagreementOptions = [
  'A. the period when the moai were created',
  'B. how the moai were transported',
  'C. the impact of the moai on Rapanui society',
  'D. how the moai were carved',
  'E. the origins of the people who made the moai',
]

const neuroBrainSummaryOptions = [
  'interpretation',
  'complexity',
  'emotions',
  'movements',
  'skill',
  'layout',
  'concern',
  'images',
]

const day7Questions: Question[] = [
  {
    id: 'day7-q1',
    number: 1,
    type: 'note-completion',
    groupTitle: 'Questions 1-6',
    instruction: 'Complete the notes below. Choose ONE WORD ONLY from the passage for each answer.',
    text: 'The ______ of London increased rapidly between 1800 and 1850.',
    correctAnswer: 'population',
    location: 'Paragraph A',
  },
  {
    id: 'day7-q2',
    number: 2,
    type: 'note-completion',
    text: "Building the railway would make it possible to move people to better housing in the ______.",
    correctAnswer: 'suburbs',
    location: 'Paragraph B',
  },
  {
    id: 'day7-q3',
    number: 3,
    type: 'note-completion',
    text: "A number of ______ agreed with Pearson's idea.",
    correctAnswer: 'businessmen',
    location: 'Paragraph B',
  },
  {
    id: 'day7-q4',
    number: 4,
    type: 'note-completion',
    text: 'The company initially had problems getting the ______ needed for the project.',
    correctAnswer: 'funding',
    location: 'Paragraph C',
  },
  {
    id: 'day7-q5',
    number: 5,
    type: 'note-completion',
    text: 'Negative articles about the project appeared in the ______.',
    correctAnswer: 'press',
    location: 'Paragraph C',
  },
  {
    id: 'day7-q6',
    number: 6,
    type: 'note-completion',
    text: 'With the completion of the brick arch, the tunnel was covered with ______.',
    correctAnswer: 'soil',
    location: 'Paragraph D',
  },
  {
    id: 'day7-q7',
    number: 7,
    type: 'true-false-not-given',
    groupTitle: 'Questions 7-13',
    instruction:
      'Choose TRUE if the statement agrees with the information in the text, choose FALSE if the statement contradicts the information, or choose NOT GIVEN if there is no information on this.',
    text: 'Other countries had built underground railways before the Metropolitan line opened.',
    correctAnswer: 'FALSE',
    location: 'Paragraph E',
  },
  {
    id: 'day7-q8',
    number: 8,
    type: 'true-false-not-given',
    text: 'More people than predicted travelled on the Metropolitan line on the first day.',
    correctAnswer: 'NOT GIVEN',
    location: 'Paragraph E',
  },
  {
    id: 'day7-q9',
    number: 9,
    type: 'true-false-not-given',
    text: 'The use of ventilation shafts failed to prevent pollution in the tunnels.',
    correctAnswer: 'TRUE',
    location: 'Paragraph E',
  },
  {
    id: 'day7-q10',
    number: 10,
    type: 'true-false-not-given',
    text: "A different approach from the 'cut and cover' technique was required in London's central area.",
    correctAnswer: 'TRUE',
    location: 'Paragraph F',
  },
  {
    id: 'day7-q11',
    number: 11,
    type: 'true-false-not-given',
    text: 'The windows on City & South London trains were at eye level.',
    correctAnswer: 'FALSE',
    location: 'Paragraph G',
  },
  {
    id: 'day7-q12',
    number: 12,
    type: 'true-false-not-given',
    text: 'The City & South London Railway was a financial success.',
    correctAnswer: 'FALSE',
    location: 'Paragraph G',
  },
  {
    id: 'day7-q13',
    number: 13,
    type: 'true-false-not-given',
    text: "Trains on the 'Tuppenny Tube' nearly always ran on time.",
    correctAnswer: 'NOT GIVEN',
    location: 'Paragraph H',
  },
]

const day8Questions: Question[] = [
  {
    id: 'day8-q14',
    number: 14,
    type: 'matching-information',
    groupTitle: 'Questions 14-17',
    instruction: 'Match the information to the correct paragraph, A-G.',
    text: 'mention of negative attitudes towards stadium building projects',
    options: paragraphOptionsAtoG,
    correctAnswer: 'A',
    location: 'Paragraph A',
  },
  {
    id: 'day8-q15',
    number: 15,
    type: 'matching-information',
    text: 'figures demonstrating the environmental benefits of a certain stadium',
    options: paragraphOptionsAtoG,
    correctAnswer: 'F',
    location: 'Paragraph F',
  },
  {
    id: 'day8-q16',
    number: 16,
    type: 'matching-information',
    text: 'examples of the wide range of facilities available at some new stadiums',
    options: paragraphOptionsAtoG,
    correctAnswer: 'E',
    location: 'Paragraph E',
  },
  {
    id: 'day8-q17',
    number: 17,
    type: 'matching-information',
    text: 'reference to the disadvantages of the stadiums built during a certain era',
    options: paragraphOptionsAtoG,
    correctAnswer: 'D',
    location: 'Paragraph D',
  },
  {
    id: 'day8-q18',
    number: 18,
    type: 'summary-completion',
    groupTitle: 'Questions 18-22',
    instruction: 'Complete the summary below. Choose ONE WORD ONLY from the passage for each answer.',
    text: 'The amphitheatre of Arles was converted first into a ______, then into a residential area and finally into an arena where spectators could watch bullfights.',
    correctAnswer: 'fortress',
    location: 'Paragraph B',
  },
  {
    id: 'day8-q19',
    number: 19,
    type: 'summary-completion',
    text: 'At Arles, the structure eventually returned to being a venue where ______ were staged.',
    correctAnswer: 'bullfights',
    location: 'Paragraph B',
  },
  {
    id: 'day8-q20',
    number: 20,
    type: 'summary-completion',
    text: 'The arena in Verona is now famous as a venue where ______ is performed.',
    correctAnswer: 'opera',
    location: 'Paragraph B',
  },
  {
    id: 'day8-q21',
    number: 21,
    type: 'summary-completion',
    text: "The site in Lucca had various uses over time, including storage of ______.",
    correctAnswer: 'salt',
    location: 'Paragraph C',
  },
  {
    id: 'day8-q22',
    number: 22,
    type: 'summary-completion',
    text: "Today, Lucca's market square includes ______ and homes incorporated into the old structure.",
    correctAnswer: 'shops',
    location: 'Paragraph C',
  },
  {
    id: 'day8-q23',
    number: 23,
    type: 'five-true-statements',
    groupTitle: 'Questions 23-24',
    instruction: 'Choose TWO letters, A-E.',
    text: 'When comparing twentieth-century stadiums to ancient amphitheatres in Section D, which TWO negative features does the writer mention?',
    options: stadiumDrawbackOptions,
    correctAnswer: ['C', 'D'],
    location: 'Paragraph D',
  },
  {
    id: 'day8-q25',
    number: 25,
    type: 'five-true-statements',
    groupTitle: 'Questions 25-26',
    instruction: 'Choose TWO letters, A-E.',
    text: 'Which TWO advantages of modern stadium design does the writer mention?',
    options: stadiumAdvantageOptions,
    correctAnswer: ['B', 'E'],
    location: 'Paragraphs E-F',
  },
]

const day9Questions: Question[] = [
  {
    id: 'day9-q27',
    number: 27,
    type: 'drag-drop-summary',
    groupTitle: 'Questions 27-31',
    instruction: 'Complete the summary by dragging the correct words into the gaps.',
    text:
      "Charles II then formed a ______ with the Scots.\n" +
      "In order to become King of Scots, he abandoned an important ______ held by his father.\n" +
      'The battle outside Worcester in 1651 led to a ______ for the Parliamentarians.\n' +
      "A ______ was offered for Charles's capture.\n" +
      'After six weeks in hiding, he eventually reached the ______ of continental Europe.',
    options: toCatchSummaryOptions,
    correctAnswer: [
      'strategic alliance',
      'religious conviction',
      'decisive victory',
      'large reward',
      'relative safety',
    ],
    location: 'Paragraph A',
  },
  {
    id: 'day9-q32',
    number: 32,
    type: 'yes-no-not-given',
    groupTitle: 'Questions 32-35',
    instruction:
      'Choose YES if the statement agrees with the claims of the writer, NO if it contradicts the claims, or NOT GIVEN if there is no information on this.',
    text: 'Charles chose Pepys for this task because he considered him trustworthy.',
    correctAnswer: 'NOT GIVEN',
    location: 'Paragraph B',
  },
  {
    id: 'day9-q33',
    number: 33,
    type: 'yes-no-not-given',
    text: "Charles's personal recollection of the escape lacked sufficient detail.",
    correctAnswer: 'NO',
    location: 'Paragraph B',
  },
  {
    id: 'day9-q34',
    number: 34,
    type: 'yes-no-not-given',
    text: 'Charles indicated to Pepys that he had planned his escape before the battle.',
    correctAnswer: 'NO',
    location: 'Paragraph B',
  },
  {
    id: 'day9-q35',
    number: 35,
    type: 'yes-no-not-given',
    text: "The inclusion of Charles's account is a positive aspect of the book.",
    correctAnswer: 'YES',
    location: 'Paragraph C',
  },
  {
    id: 'day9-q36',
    number: 36,
    type: 'multiple-choice',
    groupTitle: 'Questions 36-40',
    instruction: 'Choose the correct answer.',
    text: "What is the reviewer's main purpose in the first paragraph?",
    options: [
      'to describe what happened during the Battle of Worcester',
      "to give an account of the circumstances leading to Charles II's escape",
      "to compare Charles II's beliefs with those of his father",
      "to provide details of the Parliamentarians' political views",
    ],
    correctAnswer: 'B',
    location: 'Paragraph A',
  },
  {
    id: 'day9-q37',
    number: 37,
    type: 'multiple-choice',
    text: "Why does the reviewer include examples of the fugitives' behaviour in the third paragraph?",
    options: [
      "to explain how close Charles II came to losing his life",
      "to suggest that Charles II's supporters were badly prepared",
      'to illustrate how the events of the six weeks are brought to life',
      'to argue that certain aspects are not as well known as they should be',
    ],
    correctAnswer: 'C',
    location: 'Paragraph C',
  },
  {
    id: 'day9-q38',
    number: 38,
    type: 'multiple-choice',
    text: 'What point does the reviewer make about Charles II in the fourth paragraph?',
    options: [
      'He chose to celebrate what was essentially a defeat.',
      'He misunderstood the motives of his opponents.',
      "He aimed to restore people's faith in the monarchy.",
      'He was driven by a desire to be popular.',
    ],
    correctAnswer: 'A',
    location: 'Paragraph D',
  },
  {
    id: 'day9-q39',
    number: 39,
    type: 'multiple-choice',
    text: 'What does the reviewer say about Charles Spencer in the fifth paragraph?',
    options: [
      'His decision to write the book comes as a surprise.',
      'He takes an unbiased approach to the subject matter.',
      'His descriptions of events would be better if they included more detail.',
      'He chooses language that is suitable for a twenty-first-century audience.',
    ],
    correctAnswer: 'B',
    location: 'Paragraph E',
  },
  {
    id: 'day9-q40',
    number: 40,
    type: 'multiple-choice',
    text: "When the reviewer says the book 'doesn't quite hit the mark', she is making the point that",
    options: [
      'it overlooks the impact of events on ordinary people.',
      'it lacks an analysis of prevalent views on monarchy.',
      'it omits any references to the deceit practised by Charles II during his time in hiding.',
      "it fails to address whether Charles II's experiences had a lasting influence on him.",
    ],
    correctAnswer: 'D',
    location: 'Paragraph F',
  },
]

const day11Questions: Question[] = [
  {
    id: 'day11-q1',
    number: 1,
    type: 'true-false-not-given',
    groupTitle: 'Questions 1-4',
    instruction:
      'Choose TRUE if the statement agrees with the information in the text, choose FALSE if the statement contradicts the information, or choose NOT GIVEN if there is no information on this.',
    text: 'There is some doubt about what caused the Mary Rose to sink.',
    correctAnswer: 'TRUE',
    location: 'Paragraph A',
  },
  {
    id: 'day11-q2',
    number: 2,
    type: 'true-false-not-given',
    text: 'The Mary Rose was the only ship to sink in the battle of 19 July 1545.',
    correctAnswer: 'NOT GIVEN',
    location: 'Paragraph A',
  },
  {
    id: 'day11-q3',
    number: 3,
    type: 'true-false-not-given',
    text: 'Most of one side of the Mary Rose lay undamaged under the sea.',
    correctAnswer: 'TRUE',
    location: 'Paragraph B',
  },
  {
    id: 'day11-q4',
    number: 4,
    type: 'true-false-not-given',
    text: 'Alexander McKee knew that the wreck would contain many valuable historical objects.',
    correctAnswer: 'FALSE',
    location: 'Paragraph E',
  },
  {
    id: 'day11-q5',
    number: 5,
    type: 'matching-information',
    groupTitle: 'Questions 5-8',
    instruction: 'Match each statement with the correct date, A-G.',
    text: 'A search for the Mary Rose was launched.',
    options: maryRoseDateOptions,
    correctAnswer: 'C',
    location: 'Paragraph D',
  },
  {
    id: 'day11-q6',
    number: 6,
    type: 'matching-information',
    text: "One person's exploration of the Mary Rose site stopped.",
    options: maryRoseDateOptions,
    correctAnswer: 'B',
    location: 'Paragraph C',
  },
  {
    id: 'day11-q7',
    number: 7,
    type: 'matching-information',
    text: 'It was agreed that the hull of the Mary Rose should be raised.',
    options: maryRoseDateOptions,
    correctAnswer: 'G',
    location: 'Paragraph E',
  },
  {
    id: 'day11-q8',
    number: 8,
    type: 'matching-information',
    text: 'The site of the Mary Rose was found by chance.',
    options: maryRoseDateOptions,
    correctAnswer: 'A',
    location: 'Paragraph C',
  },
  {
    id: 'day11-q9',
    number: 9,
    type: 'short-answer',
    groupTitle: 'Questions 9-13',
    instruction: 'Choose NO MORE THAN TWO WORDS from the passage for each answer.',
    text: '______ attached to hull by wires',
    correctAnswer: 'lifting frame',
    location: 'Paragraph F',
  },
  {
    id: 'day11-q10',
    number: 10,
    type: 'short-answer',
    text: '______ to prevent hull being sucked into mud',
    correctAnswer: 'hydraulic jacks',
    location: 'Paragraph F',
  },
  {
    id: 'day11-q11',
    number: 11,
    type: 'short-answer',
    text: 'legs are placed into ______',
    correctAnswer: 'stabbing guides',
    location: 'Paragraph G',
  },
  {
    id: 'day11-q12',
    number: 12,
    type: 'short-answer',
    text: 'hull is lowered into ______',
    correctAnswer: 'lifting cradle',
    location: 'Paragraph G',
  },
  {
    id: 'day11-q13',
    number: 13,
    type: 'short-answer',
    text: '______ used as extra protection for the hull',
    correctAnswer: 'air bags',
    location: 'Paragraph G',
  },
]

const day12Questions: Question[] = [
  {
    id: 'day12-q14',
    number: 14,
    type: 'matching-headings',
    groupTitle: 'Questions 14-20',
    instruction: 'Choose the correct heading for each paragraph from the list of headings below.',
    text: 'Paragraph A',
    options: easterIslandHeadingOptions,
    correctAnswer: 'B',
    location: 'Paragraph A',
  },
  {
    id: 'day12-q15',
    number: 15,
    type: 'matching-headings',
    text: 'Paragraph B',
    options: paragraphOptionsAtoI,
    correctAnswer: 'I',
    location: 'Paragraph B',
  },
  {
    id: 'day12-q16',
    number: 16,
    type: 'matching-headings',
    text: 'Paragraph C',
    options: paragraphOptionsAtoI,
    correctAnswer: 'H',
    location: 'Paragraph C',
  },
  {
    id: 'day12-q17',
    number: 17,
    type: 'matching-headings',
    text: 'Paragraph D',
    options: paragraphOptionsAtoI,
    correctAnswer: 'A',
    location: 'Paragraph D',
  },
  {
    id: 'day12-q18',
    number: 18,
    type: 'matching-headings',
    text: 'Paragraph E',
    options: paragraphOptionsAtoI,
    correctAnswer: 'D',
    location: 'Paragraph E',
  },
  {
    id: 'day12-q19',
    number: 19,
    type: 'matching-headings',
    text: 'Paragraph F',
    options: paragraphOptionsAtoI,
    correctAnswer: 'G',
    location: 'Paragraph F',
  },
  {
    id: 'day12-q20',
    number: 20,
    type: 'matching-headings',
    text: 'Paragraph G',
    options: paragraphOptionsAtoI,
    correctAnswer: 'F',
    location: 'Paragraph G',
  },
  {
    id: 'day12-q21',
    number: 21,
    type: 'summary-completion',
    groupTitle: 'Questions 21-24',
    instruction: 'Complete the summary below. Choose ONE WORD ONLY from the passage for each answer.',
    text: 'The Polynesian settlers cleared land for ______.',
    correctAnswer: 'farming',
    location: 'Paragraph B',
  },
  {
    id: 'day12-q22',
    number: 22,
    type: 'summary-completion',
    text: 'Without trees, islanders could no longer build ______ for fishing.',
    correctAnswer: 'canoes',
    location: 'Paragraph B',
  },
  {
    id: 'day12-q23',
    number: 23,
    type: 'summary-completion',
    text: 'They began using the island\'s ______ as a food source, according to Diamond.',
    correctAnswer: 'birds',
    location: 'Paragraph B',
  },
  {
    id: 'day12-q24',
    number: 24,
    type: 'summary-completion',
    text: 'Diamond says moving the statues required a great deal of ______.',
    correctAnswer: 'wood',
    location: 'Paragraph C',
  },
  {
    id: 'day12-q25',
    number: 25,
    type: 'five-true-statements',
    groupTitle: 'Questions 25-26',
    instruction: 'Choose TWO letters, A-E.',
    text: 'On what points do Hunt and Lipo disagree with Diamond?',
    options: easterIslandDisagreementOptions,
    correctAnswer: ['B', 'C'],
    location: 'Paragraphs C-E',
  },
]

const day13Questions: Question[] = [
  {
    id: 'day13-q27',
    number: 27,
    type: 'multiple-choice',
    groupTitle: 'Questions 27-30',
    instruction: 'Choose the correct answer, A, B, C or D.',
    text: 'In the second paragraph, the writer refers to a shape-matching test in order to illustrate',
    options: [
      'the subjective nature of art appreciation.',
      'the reliance of modern art on abstract forms.',
      'our tendency to be influenced by the opinions of others.',
      'a common problem encountered when processing visual data.',
    ],
    correctAnswer: 'C',
    location: 'Paragraph B',
  },
  {
    id: 'day13-q28',
    number: 28,
    type: 'multiple-choice',
    text: "Angelina Hawley-Dolan's findings indicate that people",
    options: [
      'mostly favour works of art which they know well.',
      'hold fixed ideas about what makes a good work of art.',
      'are often misled by their initial expectations of a work of art.',
      'have the ability to perceive the intention behind works of art.',
    ],
    correctAnswer: 'D',
    location: 'Paragraph C',
  },
  {
    id: 'day13-q29',
    number: 29,
    type: 'multiple-choice',
    text: "Results of studies involving Robert Pepperell's pieces suggest that people",
    options: [
      'can appreciate a painting without fully understanding it.',
      'find it satisfying to work out what a painting represents.',
      'vary widely in the time they spend looking at paintings.',
      'generally prefer representational art to abstract art.',
    ],
    correctAnswer: 'B',
    location: 'Paragraph D',
  },
  {
    id: 'day13-q30',
    number: 30,
    type: 'multiple-choice',
    text: "What do the experiments described in the fifth paragraph suggest about the paintings of Mondrian?",
    options: [
      'They can be interpreted in a number of different ways.',
      'They challenge our assumptions about shape and colour.',
      'They are easier to appreciate than many other abstract works.',
      'They are more carefully put together than they appear.',
    ],
    correctAnswer: 'A',
    location: 'Paragraph E',
  },
  {
    id: 'day13-q31',
    number: 31,
    type: 'drag-drop-summary',
    groupTitle: 'Questions 31-33',
    instruction: 'Complete the summary by dragging the correct words into the gaps.',
    text:
      "Impressionist paintings seem to influence our ______.\n" +
      "Alex Forsythe suggests many artists use a key level of ______ to please the brain.\n" +
      "Appealing artworks often include repeated ______ that are common in nature.",
    options: neuroBrainSummaryOptions,
    correctAnswer: ['emotions', 'complexity', 'images'],
    location: 'Paragraphs A and G',
  },
  {
    id: 'day13-q34',
    number: 34,
    type: 'yes-no-not-given',
    groupTitle: 'Questions 34-39',
    instruction:
      'Choose YES if the statement agrees with the claims of the writer, NO if it contradicts the claims, or NOT GIVEN if there is no information on this.',
    text: 'Alex Forsythe was the first person to investigate the level of detail in paintings.',
    correctAnswer: 'NOT GIVEN',
    location: 'Paragraph G',
  },
  {
    id: 'day13-q35',
    number: 35,
    type: 'yes-no-not-given',
    text: "Certain ideas regarding the link between 'mirror neurons' and art appreciation require further verification.",
    correctAnswer: 'YES',
    location: 'Paragraph H',
  },
  {
    id: 'day13-q36',
    number: 36,
    type: 'yes-no-not-given',
    text: "People's taste in paintings depends entirely on the current artistic trends of the period.",
    correctAnswer: 'NO',
    location: 'Paragraph H',
  },
  {
    id: 'day13-q37',
    number: 37,
    type: 'yes-no-not-given',
    text: "Scientists should seek to define the precise rules which govern people's reactions to works of art.",
    correctAnswer: 'NO',
    location: 'Paragraph I',
  },
  {
    id: 'day13-q38',
    number: 38,
    type: 'yes-no-not-given',
    text: 'Art appreciation should always involve taking into consideration the cultural context in which an artist worked.',
    correctAnswer: 'YES',
    location: 'Paragraph I',
  },
  {
    id: 'day13-q39',
    number: 39,
    type: 'yes-no-not-given',
    text: 'It is easier to find meaning in the field of science than in that of art.',
    correctAnswer: 'NOT GIVEN',
    location: 'Paragraph I',
  },
  {
    id: 'day13-q40',
    number: 40,
    type: 'multiple-choice',
    groupTitle: 'Question 40',
    instruction: 'Choose the correct answer, A, B, C or D.',
    text: 'What would be the most appropriate subtitle for the article?',
    options: [
      'Some scientific insights into how the brain responds to abstract art',
      'Recent studies focusing on the neural activity of abstract artists',
      'A comparison of the neurological bases of abstract and representational art',
      'How brain research has altered public opinion about abstract art',
    ],
    correctAnswer: 'A',
    location: 'Paragraph I',
  },
]

const day7Section: Section = {
  id: 'day7-london-underground-p1',
  title: 'Day 7 Passage 1: The development of the London underground railway',
  paragraphs: [
    {
      label: 'A',
      content:
        "In the first half of the 1800s, London's population grew at an astonishing rate, and the central area became increasingly congested. In addition, the expansion of the overground railway network resulted in more and more passengers arriving in the capital. However, in 1846, a Royal Commission decided that the railways should not be allowed to enter the City, the capital's historic and business centre. The result was that the overground railway stations formed a ring around the City. The area within consisted of poorly built, overcrowded slums and the streets were full of horse-drawn traffic. Crossing the City became a nightmare. It could take an hour and a half to travel 8 km by horse-drawn carriage or bus. Numerous schemes were proposed to resolve these problems, but few succeeded.",
    },
    {
      label: 'B',
      content:
        "Amongst the most vocal advocates for a solution to London's traffic problems was Charles Pearson, who worked as a solicitor for the City of London. He saw both social and economic advantages in building an underground railway that would link the overground railway stations together and clear London slums at the same time. His idea was to relocate the poor workers who lived in the inner-city slums to newly constructed suburbs, and to provide cheap rail travel for them to get to work. Pearson's ideas gained support amongst some businessmen and in 1851 he submitted a plan to Parliament. It was rejected, but coincided with a proposal from another group for an underground connecting line, which Parliament passed. The two groups merged and established the Metropolitan Railway Company in August 1854.",
    },
    {
      label: 'C',
      content:
        "The company's plan was to construct an underground railway line from the Great Western Railway's station at Paddington to the edge of the City at Farringdon Street - a distance of almost 5 km. The organisation had difficulty in raising the funding for such a radical and expensive scheme, not least because of the critical articles printed by the press. Objectors argued that the tunnels would collapse under the weight of traffic overhead, buildings would be shaken and passengers would be poisoned by the emissions from the train engines. However, Pearson and his partners persisted.",
    },
    {
      label: 'D',
      content:
        "The GWR, aware that the new line would finally enable them to run trains into the heart of the City, invested almost £250,000 in the scheme. Eventually, over a five-year period, £1m was raised. The chosen route ran beneath existing main roads to minimise the expense of demolishing buildings. Originally scheduled to be completed in 21 months, the construction of the underground line took three years. It was built just below street level using a technique known as 'cut and cover'. A trench about ten metres wide and six metres deep was dug, and the sides temporarily held up with timber beams. Brick walls were then constructed, and finally a brick arch was added to create a tunnel. A two-metre-deep layer of soil was laid on top of the tunnel and the road above rebuilt.",
    },
    {
      label: 'E',
      content:
        "The Metropolitan line, which opened on 10 January 1863, was the world's first underground railway. On its first day, almost 40,000 passengers were carried between Paddington and Farringdon, the journey taking about 18 minutes. By the end of the Metropolitan's first year of operation, 9.5 million journeys had been made. Even as the Metropolitan began operation, the first extensions to the line were being authorised; these were built over the next five years, reaching Moorgate in the east of London and Hammersmith in the west. The original plan was to pull the trains with steam locomotives, using firebricks in the boilers to provide steam, but these engines were never introduced. Instead, the line used specially designed locomotives that were fitted with water tanks in which steam could be condensed. However, smoke and fumes remained a problem, even though ventilation shafts were added to the tunnels.",
    },
    {
      label: 'F',
      content:
        "Despite the extension of the underground railway, by the 1880s, congestion on London's streets had become worse. The problem was partly that the existing underground lines formed a circuit around the centre of London and extended to the suburbs, but did not cross the capital's centre. The 'cut and cover' method of construction was not an option in this part of the capital. The only alternative was to tunnel deep underground.",
    },
    {
      label: 'G',
      content:
        "Although the technology to create these tunnels existed, steam locomotives could not be used in such a confined space. It wasn't until the development of a reliable electric motor, and a means of transferring power from the generator to a moving train, that the world's first deep-level electric railway, the City & South London, became possible. The line opened in 1890, and ran from the City to Stockwell, south of the River Thames. The trains were made up of three carriages and driven by electric engines. The carriages were narrow and had tiny windows just below the roof because it was thought that passengers would not want to look out at the tunnel walls. The line was not without its problems, mainly caused by an unreliable power supply. Although the City & South London Railway was a great technical achievement, it did not make a profit.",
    },
    {
      label: 'H',
      content:
        "Then, in 1900, the Central London Railway, known as the 'Tuppenny Tube', began operation using new electric locomotives. It was very popular and soon afterwards new railways and extensions were added to the growing tube network. By 1907, the heart of today's Underground system was in place.",
    },
  ],
  questions: day7Questions,
}

const day8Section: Section = {
  id: 'day8-stadiums-p2',
  title: 'Day 8 Passage 2: Stadiums - past, present and future',
  paragraphs: [
    {
      label: 'A',
      content:
        'Stadiums are among the oldest forms of urban architecture: vast stadiums where the public could watch sporting events were at the centre of western city life as far back as the ancient Greek and Roman Empires, well before the construction of the great medieval cathedrals and the grand nineteenth- and twentieth-century railway stations which dominated urban skylines in later eras. Today, however, stadiums are regarded with growing scepticism. Construction costs can soar above £1 billion, and stadiums finished for major events such as the Olympic Games or the FIFA World Cup have notably fallen into disuse and disrepair. But this need not be the case. History shows that stadiums can drive urban development and adapt to the culture of every age. Even today, architects and planners are finding new ways to adapt the mono-functional sports arenas which became emblematic of modernisation during the twentieth century.',
    },
    {
      label: 'B',
      content:
        "The amphitheatre of Arles in southwest France, with a capacity of 25,000 spectators, is perhaps the best example of just how versatile stadiums can be. Built by the Romans in 90 AD, it became a fortress with four towers after the fifth century, and was then transformed into a village containing more than 200 houses. With the growing interest in conservation during the nineteenth century, it was converted back into an arena for the staging of bullfights, thereby returning the structure to its original use as a venue for public spectacles. Another example is the imposing arena of Verona in northern Italy, with space for 30,000 spectators, which was built 60 years before the Arles amphitheatre and 40 years before Rome's famous Colosseum. It has endured the centuries and is currently considered one of the world's prime sites for opera, thanks to its outstanding acoustics.",
    },
    {
      label: 'C',
      content:
        "The area in the centre of the Italian town of Lucca, known as the Piazza dell'Anfiteatro, is yet another impressive example of an amphitheatre becoming absorbed into the fabric of the city. The site evolved in a similar way to Arles and was progressively filled with buildings from the Middle Ages until the nineteenth century, variously used as houses, a salt depot and a prison. But rather than reverting to an arena, it became a market square, designed by Romanticist architect Lorenzo Nottolini. Today, the ruins of the amphitheatre remain embedded in the various shops and residences surrounding the public square.",
    },
    {
      label: 'D',
      content:
        'There are many similarities between modern stadiums and the ancient amphitheatres intended for games. But some of the flexibility was lost at the beginning of the twentieth century, as stadiums were developed using new products such as steel and reinforced concrete, and made use of bright lights for night-time matches. Many such stadiums are situated in suburban areas, designed for sporting use only and surrounded by parking lots. These factors mean that they may not be as accessible to the general public, require more energy to run and contribute to urban heat.',
    },
    {
      label: 'E',
      content:
        "But many of today's most innovative architects see scope for the stadium to help improve the city. Among the current strategies, two seem to be having particular success: the stadium as an urban hub, and as a power plant. There's a growing trend for stadiums to be equipped with public spaces and services that serve a function beyond sport, such as hotels, retail outlets, conference centres, restaurants and bars, children's playgrounds and green space. Creating mixed-use developments such as this reinforces compactness and multi-functionality, making more efficient use of land and helping to regenerate urban spaces. This opens the space up to families and a wider cross-section of society, instead of catering only to sportspeople and supporters. There have been many examples of this in the UK: the mixed-use facilities at Wembley and Old Trafford have become a blueprint for many other stadiums in the world.",
    },
    {
      label: 'F',
      content:
        'The phenomenon of stadiums as power stations has arisen from the idea that energy problems can be overcome by integrating interconnected buildings by means of a smart grid, which is an electricity supply network that uses digital communications technology to detect and react to local changes in usage, without significant energy losses. Stadiums are ideal for these purposes, because their canopies have a large surface area for fitting photovoltaic panels and rise high enough (more than 40 metres) to make use of micro wind turbines. Freiburg Mage Solar Stadium in Germany is the first of a new wave of stadiums as power plants, which also includes the Amsterdam Arena and the Kaohsiung Stadium. The latter, inaugurated in 2009, has 8,844 photovoltaic panels producing up to 1.14 GWh of electricity annually. This reduces the annual output of carbon dioxide by 660 tons and supplies up to 80 percent of the surrounding area when the stadium is not in use. This is proof that a stadium can serve its city, and have a decidedly positive impact in terms of reduction of CO2 emissions.',
    },
    {
      label: 'G',
      content:
        'Sporting arenas have always been central to the life and culture of cities. In every era, the stadium has acquired new value and uses: from military fortress to residential village, public space to theatre and most recently a field for experimentation in advanced engineering. The stadium of today now brings together multiple functions, thus helping cities to create a sustainable future.',
    },
  ],
  questions: day8Questions,
}

const day9Section: Section = {
  id: 'day9-to-catch-a-king-p3',
  title: 'Day 9 Passage 3: To Catch a King',
  paragraphs: [
    {
      label: 'A',
      content:
        "Charles Spencer's latest book, To Catch a King, tells the story of the hunt for King Charles II in the six weeks after his defeat at the Battle of Worcester in September 1651. After his father was executed by the Parliamentarians in 1649, the young Charles II made a deal with the Scots, accepting Presbyterianism as the national religion in return for being crowned King of Scots. His arrival in Edinburgh prompted the English Parliamentary army to invade Scotland in a pre-emptive strike. This was followed by a Scottish invasion of England. The two sides finally faced one another at Worcester in 1651. After being comprehensively defeated, the 21-year-old king became the subject of a national manhunt, with a huge sum offered for his capture. Over the following six weeks he managed, through a series of close escapes, to evade the Parliamentarians before seeking refuge in France.",
    },
    {
      label: 'B',
      content:
        'Years later, after his restoration, Charles II requested a meeting with the writer and diarist Samuel Pepys. He wanted Pepys to commit the episode to paper so it would never be forgotten. Over two three-hour sittings, the king related in detail his personal recollections of the six weeks he had spent as a fugitive. He began: "After the battle was so absolutely lost as to be beyond hope of recovery, I began to think of the best way of saving myself."',
    },
    {
      label: 'C',
      content:
        "One of the joys of Spencer's book, not least because it uses Charles II's own narrative alongside those of his supporters, is how close the reader gets to the action. The day-by-day retelling gives striking details: the cutting of the king's long hair with agricultural shears, the use of walnut leaves to dye his pale skin, and the day Charles spent lying on a branch of the great oak tree in Boscobel Wood while Parliamentary soldiers searched below. Spencer captures both humour and tension, including moments when the secret of the king's presence was cautiously revealed to supporters.",
    },
    {
      label: 'D',
      content:
        "Charles's adventures also reveal the uncomfortable truth that while many in England had been appalled by the execution of his father, they had not welcomed the arrival of his son with the Scots army. People feared another civil war. This makes it all the more interesting that Charles II later loved the story so much. He repeatedly retold it and launched initiatives to memorialise it, including a proposed order of chivalry and huge oil paintings depicting the escape. In 1660, he commissioned John Michael Wright to paint cherubs carrying an oak tree to the heavens on the ceiling of his bedchamber.",
    },
    {
      label: 'E',
      content:
        "Charles Spencer is well suited to pass the story to a new generation. His pacey prose avoids modern idiom and vividly brings the tale to life. He shows even-handed sympathy for both the fugitive king and the republican regime that hunted him, and he explores much more background than previous books on the subject.",
    },
    {
      label: 'F',
      content:
        "The tantalising question left at the end is what it all meant. Would Charles II have been a different king had these six weeks never happened? The reviewer suggests this is where the book does not quite hit the mark. Its depiction of Charles II in his final years as an ineffective, pleasure-loving monarch is seen as not fully accurate and not fully just to his complexity. Even so, the book remains an excellent read.",
    },
  ],
  questions: day9Questions,
}

const day11Section: Section = {
  id: 'day11-mary-rose-p1',
  title: 'Day 11 Passage 1: Raising the Mary Rose',
  paragraphs: [
    {
      label: 'A',
      content:
        'On 19 July 1545, English and French fleets were engaged in a sea battle in the Solent, between Portsmouth and the Isle of Wight. Among the English vessels was the Mary Rose. Built in Portsmouth about 35 years earlier, she had enjoyed a long and successful fighting career and was a favourite of Henry VIII. Accounts of her sinking vary: some suggest she was outdated, overladen and sailing too low, while others say she was mishandled by an undisciplined crew. What is undisputed is that she sank that day, taking at least 500 men with her. Attempts to recover her after the battle failed.',
    },
    {
      label: 'B',
      content:
        'The Mary Rose came to rest on her starboard side at an angle of about 60 degrees. The hull trapped sand and mud carried by currents, so the starboard side filled rapidly while the exposed port side was eroded by marine organisms and mechanical degradation. Because of the way the ship sank, nearly all of the starboard half survived intact. In later centuries, the site became covered with hard grey clay, which reduced further erosion.',
    },
    {
      label: 'C',
      content:
        'On 16 June 1836, fishermen in the Solent found their equipment snagged on an underwater obstruction, which turned out to be the Mary Rose. Diver John Deane was nearby exploring another wreck and was asked to free their gear. He dived down and found it caught on a timber protruding from the seabed. He then uncovered more timbers and a bronze gun, and continued intermittent dives until 1840, recovering guns, bows, timbers, part of a pump and other small finds.',
    },
    {
      label: 'D',
      content:
        "The wreck then faded into obscurity for another century. In 1965, military historian and amateur diver Alexander McKee, with the British Sub-Aqua Club, began the 'Solent Ships' project. Although officially aimed at several known wrecks, McKee hoped to find the Mary Rose. Ordinary search techniques proved unsatisfactory, so he collaborated with Harold E. Edgerton of MIT. In 1967, Edgerton's side-scan sonar detected a large unusual object, which McKee believed was the Mary Rose.",
    },
    {
      label: 'E',
      content:
        "Further work uncovered stray timbers and an iron gun. The major breakthrough came on 5 May 1971, when part of the ship's frame was found. McKee and his team knew they had found the wreck, though they did not yet realise its rich store of artefacts. Interest grew, and in 1979 The Mary Rose Trust was formed, with Prince Charles as President and Dr Margaret Rule as Archaeological Director. The decision to salvage the wreck was difficult. Although an excavation in 1978 suggested raising the hull might be possible, final approval came only in January 1982 once all necessary information was available.",
    },
    {
      label: 'F',
      content:
        'A key issue was that the remaining hull was an open shell. This led to the decision to lift it in three distinct stages. The hull was attached to a lifting frame via bolts and lifting wires. The danger of it being sucked back into mud was overcome by using 12 hydraulic jacks. Over several days they raised it a few centimetres as the frame rose slowly on four legs.',
    },
    {
      label: 'G',
      content:
        "Once the hull was hanging freely, the second stage began. The lifting frame was connected to a crane and the hull was lifted clear of the seabed and transferred underwater into a lifting cradle. This required precise positioning so the legs entered the stabbing guides of the cradle. The cradle, designed from archaeological survey drawings, included air bags for cushioning. In the final stage, the whole structure was lifted into the air with support from below. On 11 October 1982, the timber skeleton of the Mary Rose emerged from the water and returned to Portsmouth.",
    },
  ],
  questions: day11Questions,
}

const day12Section: Section = {
  id: 'day12-easter-island-p2',
  title: 'Day 12 Passage 2: What destroyed the civilisation of Easter Island?',
  paragraphs: [
    {
      label: 'A',
      content:
        'Easter Island, or Rapa Nui, is home to hundreds of ancient human statues called moai. After this remote Pacific island was settled by Polynesians, it remained isolated for centuries. The moai were carved with stone tools and moved for many kilometres to stone platforms without animals or wheels. The identity of the builders remained disputed until modern linguistic, archaeological and genetic evidence proved they were Polynesians. Yet debate remained about how the statues were moved. Local folklore says they walked, while many researchers assumed they were dragged with ropes and logs.',
    },
    {
      label: 'B',
      content:
        'When Europeans arrived in 1722, Rapa Nui was mostly grassland. Later pollen evidence showed that for thousands of years it had been covered in palm forests, which disappeared after Polynesian settlement. Jared Diamond argues that the Rapanui destroyed their own fragile environment by clearing forests for fuel and farming. Without trees, they could not build canoes, so they turned to birds for food. Soil erosion reduced crop yields, and he argues the society descended into civil war and cannibalism before Europeans arrived.',
    },
    {
      label: 'C',
      content:
        'Diamond also argues that the moai accelerated this self-destruction. He sees them as power displays by rival chiefs who competed by building larger and larger statues. He suggests the statues were moved on wooden sledges and log rails, which required huge amounts of wood and labour. Feeding that labour force drove even more deforestation. Once wood ran out and conflict grew, the islanders toppled the moai, and by the nineteenth century none were standing.',
    },
    {
      label: 'D',
      content:
        "Archaeologists Terry Hunt and Carl Lipo agree that Easter Island suffered ecological catastrophe, but they do not blame the islanders themselves, and they reject the claim that the moai caused the collapse. Excavations suggest the Rapanui made extraordinary efforts to protect scarce resources. They built thousands of circular stone windbreaks and cultivated crops inside them, and used broken volcanic rock to retain soil moisture. Hunt and Lipo describe them as pioneers of sustainable farming.",
    },
    {
      label: 'E',
      content:
        'Hunt and Lipo also argue that moai-building may have helped keep peace between groups, and that moving the statues required few people and no wood because they were walked upright. They say archaeological evidence supports local folklore. Experiments suggest that as few as 18 people, using three ropes, could manoeuvre a one-tonne replica. The statues\' shape and D-shaped base helped handlers rock them side to side.',
    },
    {
      label: 'F',
      content:
        "They further argue that settlers were not wholly responsible for forest loss. Nuts from the extinct Easter Island palm show grooves made by Polynesian rats, which arrived with settlers and multiplied quickly. The rats likely prevented reseeding of slow-growing palms and may have eaten birds' eggs. Hunt and Lipo also find no evidence that civilisation collapsed when the forest disappeared. They believe population remained relatively stable until Europeans brought deadly diseases, and nineteenth-century slave raids then devastated the island.",
    },
    {
      label: 'G',
      content:
        "Hunt and Lipo's view is therefore of a peaceful and ingenious society of moai builders and land stewards, not reckless destroyers. They call Rapa Nui an unlikely success story rather than an abject failure. Whichever interpretation is correct, the story offers important lessons for the wider world.",
    },
  ],
  questions: day12Questions,
}

const day13Section: Section = {
  id: 'day13-neuroaesthetics-p3',
  title: 'Day 13 Passage 3: Neuroaesthetics',
  paragraphs: [
    {
      label: 'A',
      content:
        "Neuroaesthetics is an emerging field that seeks to bring scientific objectivity to the study of art. It has already improved understanding of many masterpieces. For example, blurred imagery in Impressionist paintings appears to stimulate the amygdala, a brain region linked to feelings, which may explain why these works can be so moving.",
    },
    {
      label: 'B',
      content:
        'Researchers also ask whether this approach can explain reactions to abstract twentieth-century art, from Mondrian to Pollock. Sceptics argue that people may claim to like such works simply because they are famous. Humans are often influenced by others: in simple shape-matching tasks, people may choose clearly wrong answers if they see others doing so. This tendency could be even stronger in art, where there is no single correct answer.',
    },
    {
      label: 'C',
      content:
        "Angelina Hawley-Dolan tested this by showing volunteers pairs of paintings: either famous abstract works or doodles by children, chimps and elephants. Some images had no captions and others were deliberately mislabelled. Volunteers generally preferred the works of renowned artists, even when they believed the works were by animals or children. This suggests people can detect an artist's intention even if they cannot explain it.",
    },
    {
      label: 'D',
      content:
        "Artist Robert Pepperell creates ambiguous pieces that are neither fully abstract nor clearly representational. In one study, volunteers judged how powerful an artwork felt and whether they recognized anything familiar in it. The longer they took, the higher they rated the piece, and the greater their neural activity. The brain seems to treat such images as puzzles, and finding meaning can be rewarding.",
    },
    {
      label: 'E',
      content:
        "Mondrian's paintings of horizontal and vertical lines and colour blocks look simple, but eye-tracking studies show they are meticulously composed. Rotating the works changes viewing behaviour: with originals, viewers' eyes rest longer on certain areas; with altered versions, their gaze moves around more quickly. Viewers then rate altered versions as less pleasurable.",
    },
    {
      label: 'F',
      content:
        'Oshin Vartanian similarly compared original paintings with versions where elements had been rearranged. Most people preferred the originals, whether representational or abstract. Rearranged versions also produced less activation in brain areas linked to meaning and interpretation.',
    },
    {
      label: 'G',
      content:
        "Alex Forsythe analysed visual intricacy in art and found that many artists seem to use an optimal level of detail. Too little is boring; too much can cause perceptual overload. Appealing works, abstract and representational alike, often contain fractals - repeated motifs at different scales. Since such patterns are common in nature, our visual systems may process them more easily.",
    },
    {
      label: 'H',
      content:
        "Other research suggests the brain may process movement when viewing handwritten marks, as if replaying the creator's actions. This has prompted the idea that Pollock's paintings feel dynamic because viewers mentally reconstruct his gestures, perhaps through mirror neurons. The hypothesis still needs thorough testing. Neuroaesthetics may even help explain why some artworks endure: while fashions shape short-term popularity, works better adapted to our visual system may persist longer.",
    },
    {
      label: 'I',
      content:
        "The field is still young. Yet reducing art appreciation to fixed scientific laws would be unwise. Style, historical context and the artistic environment remain crucial. Abstract art offers both challenge and freedom of interpretation. In this sense, art is not entirely unlike science, where we also seek patterns and decode meaning to see the world differently.",
    },
  ],
  questions: day13Questions,
}

export const readingDaySectionsExtra: Record<number, Section> = {
  7: day7Section,
  8: day8Section,
  9: day9Section,
  11: day11Section,
  12: day12Section,
  13: day13Section,
  ...readingDaySectionsDay14To23,
}
