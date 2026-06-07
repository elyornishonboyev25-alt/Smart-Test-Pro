import type { Question, Section } from '../types/ieltsTypes'

// Source: mini-ielts.com — "The dingo debate" (verbatim passage text).
// NOTE: The source contains a few original OCR typos (e.g. "adaption", "Johnsons",
// "Lee Alien", "Westers Australia", "fixes", "on prescription"). Kept verbatim on purpose.

const dingoSectionOptions = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

const dingoPeopleOptions = [
  'A. Stuart McKechnie',
  'B. Chris Johnson',
  'C. Lee Allen',
  'D. Mark Clifford',
]

const day25Questions: Question[] = [
  {
    id: 'day25-q1',
    number: 1,
    type: 'matching-information',
    groupTitle: 'Questions 1-7',
    instruction:
      'Reading Passage has eight sections, A-H. Which section contains the following information? Write the correct letter, A-H. NB You may use any letter more than once.',
    text: 'a description of a barrier designed to stop dingoes, which also divides two kinds of non-native animals',
    options: dingoSectionOptions,
    correctAnswer: 'E',
    location: 'Paragraph E',
    evidence:
      'the fence separates the main types of livestock found in Australia. To the northwest of the fence, cattle predominate; to the southwest, sheep fill the landscape.',
  },
  {
    id: 'day25-q2',
    number: 2,
    type: 'matching-information',
    text: 'how dingoes ensure that rival species do not dominate',
    options: dingoSectionOptions,
    correctAnswer: 'D',
    location: 'Paragraph D',
    evidence:
      'Johnson says dingoes are the solution to this problem because they keep cat and fox populations under control.',
  },
  {
    id: 'day25-q3',
    number: 3,
    type: 'matching-information',
    text: 'a reference to a widespread non-native species that other animals feed on',
    options: dingoSectionOptions,
    correctAnswer: 'C',
    location: 'Paragraph C',
    evidence:
      'Rabbits provide huge prey base for two other introduced species: the feral (wild) cat and the red fox.',
  },
  {
    id: 'day25-q4',
    number: 4,
    type: 'matching-information',
    text: "a mention of the dingo's arrival in Australia",
    options: dingoSectionOptions,
    correctAnswer: 'B',
    location: 'Paragraph B',
    evidence: 'About 4,000 years ago, Asian sailors introduced dingoes to Australia.',
  },
  {
    id: 'day25-q5',
    number: 5,
    type: 'matching-information',
    text: 'research which has proved that dingoes have resorted to eating young livestock',
    options: dingoSectionOptions,
    correctAnswer: 'F',
    location: 'Paragraph F',
    evidence:
      'some of the highest rates of calf predation occurred in areas that had been baited.',
  },
  {
    id: 'day25-q6',
    number: 6,
    type: 'matching-information',
    text: 'a description of a method used to kill dingoes',
    options: dingoSectionOptions,
    correctAnswer: 'A',
    location: 'Paragraph A',
    evidence:
      'those aboard drop 1,000 small pieces of meat, one by one, onto the scrubland below, each piece laced with poison; this practice is known as baiting.',
  },
  {
    id: 'day25-q7',
    number: 7,
    type: 'matching-information',
    text: 'the way that the structure of dingo groups affects how quickly their numbers grow',
    options: dingoSectionOptions,
    correctAnswer: 'D',
    location: 'Paragraph D',
    evidence:
      'Dingo packs live in large, stable territories and generally have only one fertile, which limits their rate of increase.',
  },
  {
    id: 'day25-q8',
    number: 8,
    type: 'matching-information',
    groupTitle: 'Questions 8-10',
    instruction:
      'Look at the following statements (Questions 8-10) and the list of people below. Match each statement with the correct person, A, B, C or D.',
    text: 'Dingoes tend to hunt native animals rather than hunting other non-native predators.',
    options: dingoPeopleOptions,
    correctAnswer: 'D',
    location: 'Paragraph G',
    evidence: 'they are more likely to catch small native animals instead.',
  },
  {
    id: 'day25-q9',
    number: 9,
    type: 'matching-information',
    text: 'The presence of dingoes puts the income of some people at risk.',
    options: dingoPeopleOptions,
    correctAnswer: 'A',
    location: 'Paragraph A',
    evidence:
      "Stuart McKechnie, manager of Carlton Hill, complains that graziers' livelihoods are threatened when dingoes prey on cattle.",
  },
  {
    id: 'day25-q10',
    number: 10,
    type: 'matching-information',
    text: 'Dingoes have had little impact on the dying out of animal species in Australia.',
    options: dingoPeopleOptions,
    correctAnswer: 'B',
    location: 'Paragraph D',
    evidence: 'they have contributed to few, if any, extinctions',
  },
  {
    id: 'day25-q11',
    number: 11,
    type: 'summary-completion',
    groupTitle: 'Questions 11-13',
    instruction:
      'Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.',
    text: 'The dingo replaced the ______ as the main predatory animal in Australia.',
    correctAnswer: 'Tasmanian tiger',
    location: 'Paragraph B',
    evidence:
      "as the Tasmanian tiger disappeared completely from Australia, dingoes became Australia's top predators.",
  },
  {
    id: 'day25-q12',
    number: 12,
    type: 'summary-completion',
    text: 'Foxes and cats are more likely to hunt native animals when there are fewer ______.',
    correctAnswer: 'rabbits',
    location: 'Paragraph C',
    evidence:
      'the dwindling but still large fox and cat populations are left with little to eat besides native mammals.',
  },
  {
    id: 'day25-q13',
    number: 13,
    type: 'summary-completion',
    text: 'Australian animals reproduce at a slow rate as a natural way of avoiding ______.',
    correctAnswer: 'overpopulation',
    location: 'Paragraph D',
    evidence:
      'Australian mammals generally reproduce much more slowly than rabbits, cats and foxes',
  },
]

export const readingDaySectionDay25: Section = {
  id: 'day25-dingo-debate-p2',
  title: 'Day 25 Passage 2: The Dingo Debate',
  paragraphs: [
    {
      label: 'A',
      content:
        'A plane flies a slow pattern over Carlton Hill station, a 3,600 square kilometre ranch in the Kimberley region in northwest Australia. As the plane circles, those aboard drop 1,000 small pieces of meat, one by one, onto the scrubland below, each piece laced with poison; this practice is known as baiting.',
    },
    {
      label: '',
      content:
        "Besides 50,000 head of cattle, Carlton Hill is home to the dingo, Australia's largest mammalian predator and the bane of a grazier's (cattle farmer's) life. Stuart McKechnie, manager of Carlton Hill, complains that graziers' livelihoods are threatened when dingoes prey on cattle. But one man wants the baiting to end, and for dingoes to once again roam Australia's wide-open spaces. According to Chris Johnson of James Cook University, 'Australia needs more dingoes to protect our biodiversity.'",
    },
    {
      label: 'B',
      content:
        "About 4,000 years ago, Asian sailors introduced dingoes to Australia. Throughout the ensuing millennia, these descendants of the wolf spread across the continent and, as the Tasmanian tiger disappeared completely from Australia, dingoes became Australia's top predators. As agricultural development took place, the European settlers found that they could not safely keep their livestock where dingoes roamed. So began one of the most sustained efforts at pest control in Australia's history. Over the last 150 years, dingoes have been shot and poisoned, and fences have been used in an attempt to keep them away from livestock. But at the same time, as the European settlers tried to eliminate one native pest from Australia, they introduced more of their own.",
    },
    {
      label: 'C',
      content:
        'In 1860, the rabbit was unleashed on Australia by a wealthy landowner and by 1980 rabbits had covered most of the mainland. Rabbits provide huge prey base for two other introduced species: the feral (wild) cat and the red fox.',
    },
    {
      label: '',
      content:
        'The Interaction between foxes, cats and rabbits is a huge problem for native mammals. In good years, rabbit numbers increase dramatically, and fox and cat populations grow quickly in response to the abundance of this prey. When bad seasons follow, rabbit numbers are significantly reduced - and the dwindling but still large fox and cat populations are left with little to eat besides native mammals.',
    },
    {
      label: 'D',
      content:
        "Australian mammals generally reproduce much more slowly than rabbits, cats and foxes - and adaption to prevent overpopulation in the arid environment, where food can be scarce and unreliable - and populations decline because they can't grow fast enough to replace animals killed by the predators. Johnson says dingoes are the solution to this problem because they keep cat and fox populations under control. Besides regularly eating the smaller predators, dingoes will kill them simply to lessen competition.",
    },
    {
      label: '',
      content:
        'Dingo packs live in large, stable territories and generally have only one fertile, which limits their rate of increase. In the 4,000 years that dingoes have been Australia, they have contributed to few, if any, extinctions, Johnsons says.',
    },
    {
      label: 'E',
      content:
        "Reaching out from a desolate spot where three states meet, for 2,500 km in either direction, is the world's longest fence, two metres high and stretching from the coast in Queensland to the Great Australian Bight in South Australia; it is there to keep dingoes out of southeast, the fence separates the main types of livestock found in Australia. To the northwest of the fence, cattle predominate; to the southwest, sheep fill the landscape. In fact, Australia is a land dominated by these animals - 25 million cattle, 100 million sheep and just over 20 million people.",
    },
    {
      label: 'F',
      content:
        'While there is no argument that dingoes will prey on sheep if given the chance, they don\'t hunt cattle once the calves are much past two or three weeks old, according to McKechnie. And a study in Queensland suggests that dingoes don\'t even prey heavily on the newborn calves unless their staple prey disappears due to deteriorating conditions like drought.',
    },
    {
      label: '',
      content:
        'This study, co-authored by Lee Alien of the Robert Wicks Research Centre in Queensland, suggests that the aggressive baiting programs used against dingoes may actually be counter-productive for graziers. When dingoes are removed from an area by baiting m the area is recolonized by younger, more solitary dingoes. These animals aren\'t capable of going after the large prey like kangaroos, so they turn to calves. In their study, some of the highest rates of calf predation occurred in areas that had been baited.',
    },
    {
      label: 'G',
      content:
        "Mark Clifford, general manager of a firm that manages over 200,000 head of cattle, is not convinced by Allen's assertion. Clifford says, 'It's obvious if we drop or loosen control on dingoes, we are going to lose more calves.' He doesn't believe that dingoes will go after kangaroos when calves are around. Nor is he persuaded of dingoes' supposed ecological benefits, saying he is not convinced that they manage to catch cats that often, believing they are more likely to catch small native animals instead.",
    },
    {
      label: 'H',
      content:
        "McKechnie agrees that dingoes kill the wallabies (small native animals) that compete with his cattle for food, but points out that in parts of Westers Australia, there are no fixes, and not very many cats. He doesn't see how relaxing controls on dingoes in his area will improve the ecological balance.",
    },
    {
      label: '',
      content:
        "Johnson sees a need for a change in philosophy on the part of graziers. 'There might be a number of different ways of thinking through dingo management in cattle country,' he says. 'At the moment, though, that hasn't got through to graziers. There's still just on prescription, and that is to bait as widely as possible.'",
    },
  ],
  questions: day25Questions,
}
