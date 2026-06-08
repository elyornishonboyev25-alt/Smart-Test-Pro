import type { IELTSTest, Question, Section } from '../types/ieltsTypes'

// IELTS Reading Full Test 4 — passage text supplied verbatim by the user.
// (Only stray webpage labels "Science"/"Physics"/"Animal predator info" were dropped.)
// Heading list uses roman numerals i-x exactly as on the source.

/* =============================== Passage 1 =============================== */

const gilbertHeadingOptions = [
  'i. Early years of Gilbert',
  'ii. What was new about his scientific research method',
  'iii. The development of chemistry',
  'iv. Questioning traditional astronomy',
  'v. Pioneers of the early science',
  'vi. Professional and social recognition',
  'vii. Becoming the president of the Royal Science Society',
  'viii. The great works of Gilbert',
  'ix. His discovery about magnetism',
  'x. His change of focus',
]

const gilbertDiscoveryOptions = [
  'A Metal can be transformed into another.',
  'B Garlic can remove magnetism.',
  'C Metals can be magnetised.',
  'D Stars are at different distances from the earth.',
  'E The earth wobbles on its axis.',
  'F There are two charges of electricity.',
]

const gilbertQuestions: Question[] = [
  {
    id: 'v4-q1',
    number: 1,
    type: 'matching-headings',
    groupTitle: 'Questions 1-7',
    instruction:
      'Reading Passage 1 has seven paragraphs A-G. Choose the correct heading for each paragraph from the list of headings below. Write the correct number i-x in boxes 1-7 on your answer sheet.',
    text: 'Paragraph A',
    options: gilbertHeadingOptions,
    correctAnswer: 'v',
    location: 'Paragraph A',
  },
  { id: 'v4-q2', number: 2, type: 'matching-headings', text: 'Paragraph B', options: gilbertHeadingOptions, correctAnswer: 'i', location: 'Paragraph B' },
  { id: 'v4-q3', number: 3, type: 'matching-headings', text: 'Paragraph C', options: gilbertHeadingOptions, correctAnswer: 'vi', location: 'Paragraph C' },
  { id: 'v4-q4', number: 4, type: 'matching-headings', text: 'Paragraph D', options: gilbertHeadingOptions, correctAnswer: 'x', location: 'Paragraph D' },
  { id: 'v4-q5', number: 5, type: 'matching-headings', text: 'Paragraph E', options: gilbertHeadingOptions, correctAnswer: 'ix', location: 'Paragraph E' },
  { id: 'v4-q6', number: 6, type: 'matching-headings', text: 'Paragraph F', options: gilbertHeadingOptions, correctAnswer: 'iv', location: 'Paragraph F' },
  { id: 'v4-q7', number: 7, type: 'matching-headings', text: 'Paragraph G', options: gilbertHeadingOptions, correctAnswer: 'ii', location: 'Paragraph G' },
  {
    id: 'v4-q8',
    number: 8,
    type: 'true-false-not-given',
    groupTitle: 'Questions 8-10',
    instruction:
      'Do the following statements agree with the information given in Reading Passage 1? In boxes 8-10 on your answer sheet, write TRUE if the statement agrees with the information, FALSE if the statement contradicts the information, or NOT GIVEN if there is no information on this.',
    text: 'He is less famous than he should be.',
    correctAnswer: 'TRUE',
    location: 'Paragraph A',
  },
  { id: 'v4-q9', number: 9, type: 'true-false-not-given', text: 'He was famous as a doctor before he was employed by the Queen.', correctAnswer: 'TRUE', location: 'Paragraph C' },
  { id: 'v4-q10', number: 10, type: 'true-false-not-given', text: 'He lost faith in the medical theories of his time.', correctAnswer: 'NOT GIVEN', location: 'Paragraph D' },
  {
    id: 'v4-q11',
    number: 11,
    type: 'five-true-statements',
    groupTitle: 'Questions 11-13',
    instruction:
      "Choose THREE letters A-F. Write your answers in boxes 11-13 on your answer sheet. Which THREE of the following are parts of Gilbert's discovery?",
    text: 'Select THREE options.',
    options: gilbertDiscoveryOptions,
    correctAnswer: ['C', 'D', 'E'],
    location: 'Paragraphs E-F',
  },
]

const passage1: Section = {
  id: 'gilbert-magnetism-p1-v4',
  title: 'Reading Passage 1: William Gilbert and Magnetism',
  paragraphs: [
    {
      label: 'A',
      content: `The 16th and 17th centuries saw two great pioneers of modern science: Galileo and Gilbert. The impact of their findings is eminent. Gilbert was the first modern scientist, also the accredited father of the science of electricity and magnetism, an Englishman of learning and a physician at the court of Elizabeth. Prior to him, all that was known of electricity and magnetism was what the ancients knew, nothing more than that the lodestone possessed magnetic properties and that amber and jet, when rubbed, would attract bits of paper or other substances of small specific gravity. However, he is less well known than he deserves.`,
    },
    {
      label: 'B',
      content: `Gilbert's birth pre-dated Galileo. Born in an eminent local family in Colchester County in the UK, on May 24, 1544, he went to grammar school, and then studied medicine at St John's College, Cambridge, graduating in 1573. Later he travelled in the continent and eventually settled down in London.`,
    },
    {
      label: 'C',
      content: `He was a very successful and eminent doctor. All this culminated in his election to the president of the Royal Science Society. He was also appointed personal physician to the Queen (Elizabeth I), and later knighted by the Queen. He faithfully served her until her death. However, he didn't outlive the Queen for long and died on November 30, 1603, only a few months after his appointment as personal physician to King James.`,
    },
    {
      label: 'D',
      content: `Gilbert was first interested in chemistry but later changed his focus due to the large portion of mysticism of alchemy involved (such as the transmutation of metal). He gradually developed his interest in physics after the great minds of the ancient, particularly about the knowledge the ancient Greeks had about lodestones, strange minerals with the power to attract iron. In the meantime, Britain became a major seafaring nation in 1588 when the Spanish Armada was defeated, opening the way to British settlement of America. British ships depended on the magnetic compass, yet no one understood why it worked. Did the Pole Star attract it, as Columbus once speculated; or was there a magnetic mountain at the pole, as described in Odyssey, which ships would never approach, because the sailors thought its pull would yank out all their iron nails and fittings? For nearly 20 years, William Gilbert conducted ingenious experiments to understand magnetism. His works include On the Magnet, Magnetic Bodies, and the Great Magnet of the Earth.`,
    },
    {
      label: 'E',
      content: `Gilbert's discovery was so important to modern physics. He investigated the nature of magnetism and electricity. He even coined the word "electric". Though the early beliefs of magnetism were also largely entangled with superstitions such as that rubbing garlic on lodestone can neutralise its magnetism, one example being that sailors even believed the smell of garlic would even interfere with the action of compass, which is why helmsmen were forbidden to eat it near a ship's compass. Gilbert also found that metals can be magnetised by rubbing materials such as fur, plastic or the like on them. He named the ends of a magnet "north pole" and "south pole". The magnetic poles can attract or repel, depending on polarity. In addition, however, ordinary iron is always attracted to a magnet. Though he started to study the relationship between magnetism and electricity, sadly he didn't complete it. His research of static electricity using amber and jet only demonstrated that objects with electrical charges can work like magnets attracting small pieces of paper and stuff. It is a French guy named du Fay that discovered that there are actually two electrical charges, positive and negative.`,
    },
    {
      label: 'F',
      content: `He also questioned the traditional astronomical beliefs. Though a Copernican, he didn't express in his quintessential beliefs whether the earth is at the centre of the universe or in orbit around the sun. However, he believed that stars are not equidistant from the earth but have their own earth-like planets orbiting around them. The earth itself is like a giant magnet, which is also why compasses always point north. They spin on an axis that is aligned with the earth's polarity. He even likened the polarity of the magnet to the polarity of the earth and built an entire magnetic philosophy on this analogy. In his explanation, magnetism is the soul of the earth. Thus a perfectly spherical lodestone, when aligned with the earth's poles, would wobble all by itself in 24 hours. Further, he also believed that the sun and other stars wobble just like the earth does around a crystal core, and speculated that the moon might also be a magnet caused to orbit by its magnetic attraction to the earth. This was perhaps the first proposal that a force might cause a heavenly orbit.`,
    },
    {
      label: 'G',
      content: `His research method was revolutionary in that he used experiments rather than pure logic and reasoning like the ancient Greek philosophers did. It was a new attitude towards scientific investigation. Until then, scientific experiments were not in fashion. It was because of this scientific attitude, together with his contribution to our knowledge of magnetism, that a unit of magneto motive force, also known as magnetic potential, was named Gilbert in his honour. His approach of careful observation and experimentation rather than the authoritative opinion or deductive philosophy of others had laid the very foundation for modern science.`,
    },
  ],
  questions: gilbertQuestions,
}

/* =============================== Passage 2 =============================== */

const pacificEndingOptions = [
  'A was the variety of experimental techniques used',
  'B was not of interest to young islanders today',
  'C was not conclusive evidence in support of a single theory',
  'D was being able to change their practices when necessary',
  'E was the first time humans intentionally crossed an ocean',
  'F was the speed with which it was conducted',
]

const pacificQuestions: Question[] = [
  {
    id: 'v4-q14',
    number: 14,
    type: 'yes-no-not-given',
    groupTitle: 'Questions 14-18',
    instruction:
      'Do the following statements agree with the claims of the writer in Reading Passage 2? In boxes 14-18 on your answer sheet, write YES if the statement agrees with the claims of the writer, NO if the statement contradicts the claims of the writer, or NOT GIVEN if it is impossible to say what the writer thinks about this.',
    text: 'The Pacific islands were uninhabited when migrants arrived by sea from Southeast Asia.',
    correctAnswer: 'YES',
    location: 'Paragraph 1',
  },
  { id: 'v4-q15', number: 15, type: 'yes-no-not-given', text: 'Andrew Sharp was the first person to write about the migrants to islanders.', correctAnswer: 'NO', location: 'Paragraph 2' },
  { id: 'v4-q16', number: 16, type: 'yes-no-not-given', text: 'Andrew Sharp believed migratory voyages were based on more on luck than skill.', correctAnswer: 'YES', location: 'Paragraph 2' },
  { id: 'v4-q17', number: 17, type: 'yes-no-not-given', text: "Despite being controversial, Andrew Sharp's research had positive results.", correctAnswer: 'YES', location: 'Paragraph 2' },
  { id: 'v4-q18', number: 18, type: 'yes-no-not-given', text: "Edwin Doran disagreed with the findings of Lewis's research.", correctAnswer: 'NOT GIVEN', location: 'Paragraph 5' },
  {
    id: 'v4-q19',
    number: 19,
    type: 'multiple-choice',
    groupTitle: 'Questions 19-23',
    instruction: 'Choose the correct letter, A, B, C or D. Write the correct letter in boxes 19-23 on your answer sheet.',
    text: "David Lewis's research was different because",
    options: [
      'he observed traditional navigators at work',
      'he conducted test voyages using his own yacht',
      'he carried no modern instruments on test voyages',
      'he spoke the same language as the islanders he sailed with',
    ],
    correctAnswer: 'A',
    location: 'Paragraph 4',
  },
  {
    id: 'v4-q20',
    number: 20,
    type: 'multiple-choice',
    text: "What did David Lewis's research discover about traditional navigators?",
    options: [
      'They used the sun and moon to find their position',
      'They could not sail further than about 1,000 nautical miles',
      'They knew which direction they were sailing in',
      'They were able to drift for long distances',
    ],
    correctAnswer: 'C',
    location: 'Paragraph 4',
  },
  {
    id: 'v4-q21',
    number: 21,
    type: 'multiple-choice',
    text: "What are we told about Edwin Doran's research?",
    options: [
      'Data were collected after the canoes had returned to land',
      'Canoe characteristics were recorded using modern instruments',
      'Research was conducted in the most densely populated regions',
      'Navigators were not allowed to see the instruments Doran used',
    ],
    correctAnswer: 'B',
    location: 'Paragraph 5',
  },
  {
    id: 'v4-q22',
    number: 22,
    type: 'multiple-choice',
    text: 'Which of the following did Steven Horvath discover during his research?',
    options: [
      'Canoe design was less important than human strength',
      'New research methods had to be developed for use in canoes',
      'Navigators became very tired on the longest voyages',
      'Human energy may have been used to assist sailing canoes',
    ],
    correctAnswer: 'D',
    location: 'Paragraph 6',
  },
  {
    id: 'v4-q23',
    number: 23,
    type: 'multiple-choice',
    text: "What is the writer's opinion of p Wall Garrard's research?",
    options: [
      'He is disappointed it was conducted in the laboratory',
      'He is impressed by the originality of the techniques used',
      'He is surprised it was used to help linguists with their research',
      'He is concerned that the islands studied are long distances apart',
    ],
    correctAnswer: 'B',
    location: 'Paragraph 7',
  },
  {
    id: 'v4-q24',
    number: 24,
    type: 'matching-information',
    groupTitle: 'Questions 24-27',
    instruction:
      'Complete each sentence with the correct ending, A-F, below. Write the correct letter, A-F, in boxes 24-27 on your answer sheet.',
    text: 'One limitation in the information produced by all of this research is that it',
    options: pacificEndingOptions,
    correctAnswer: 'C',
    location: 'Paragraph 8',
  },
  { id: 'v4-q25', number: 25, type: 'matching-information', text: 'The best thing about this type of research', options: pacificEndingOptions, correctAnswer: 'A', location: 'Paragraph 8' },
  { id: 'v4-q26', number: 26, type: 'matching-information', text: 'The most important achievement of traditional navigators', options: pacificEndingOptions, correctAnswer: 'D', location: 'Paragraph 8' },
  { id: 'v4-q27', number: 27, type: 'matching-information', text: 'The migration of people from Asia to the Pacific', options: pacificEndingOptions, correctAnswer: 'E', location: 'Paragraph 8' },
]

const passage2: Section = {
  id: 'pacific-voyaging-p2-v4',
  title: 'Reading Passage 2: Pacific navigation and voyaging',
  paragraphs: [
    { label: '', content: `How people migrated to the Pacific islands` },
    {
      label: '',
      content: `The many tiny islands of the Pacific Ocean had no human population until ancestors of today's islanders sailed from Southeast Asia in ocean-going canoes approximately 2,000 years ago. At the present time, the debate continues about exactly how they migrated such vast distances across the ocean, without any of the modern technologies we take for granted.`,
    },
    {
      label: '',
      content: `Although the romantic vision of some early twentieth-century writers of fleets of heroic navigators simultaneously setting sail had come to be considered by later investigators to be exaggerated, no considered assessment of Pacific voyaging was forthcoming until 1956 when the American historian Andrew Sharp published his research. Sharp challenged the 'heroic vision' by asserting that the expertise of the navigators was limited, and that the settlement of the islands was not systematic, being more dependent on good fortune by drifting canoes. Sharp's theory was widely challenged, and deservedly so. If nothing else, however, it did spark renewed interest in the topic and precipitated valuable new research.`,
    },
    {
      label: '',
      content: `Since the 1960s a wealth of investigations has been conducted, and most of them, thankfully, have been of the 'non-armchair' variety. While it would be wrong to denigrate all 'armchair' research - that based on an examination of available published materials - it has turned out that so little progress had been made in the area of Pacific voyaging because most writers relied on the same old sources - travelers' journals or missionary narratives compiled by unskilled observers. After Sharp, this began to change, and researchers conducted most of their investigations not in libraries, but in the field.`,
    },
    {
      label: '',
      content: `In 1965, David Lewis, a physician and experienced yachtsman, set to work using his own unique philosophy: he took the yacht he had owned for many years and navigated through the islands in order to contact those men who still find their way at sea using traditional methods. He then accompanied these men, in their traditional canoes, on test voyages from which all modern instruments were banished from sight, though Lewis secretly used them to confirm the navigator's calculations. His most famous such voyage was a return trip of around 1,000 nautical miles between two islands in mid-ocean. Far from drifting, as proposed by Sharp, Lewis found that ancient navigators would have known which course to steer by memorizing which stars rose and set in certain positions along the horizon and this gave them fixed directions by which to steer their boats.`,
    },
    {
      label: '',
      content: `The geographer Edwin Doran followed a quite different approach. He was interested in obtaining exact data on canoe sailing performance, and to that end employed the latest electronic instrumentation. Doran traveled on board traditional sailing canoes in some of the most remote parts of the Pacific, all the while using his instruments to record canoe speeds in different wind strengths - from gales to calms - the angle canoes could sail relative to the wind. In the process, he provided the first really precise attributes of traditional sailing canoes.`,
    },
    {
      label: '',
      content: `A further contribution was made by Steven Horvath. As a physiologist, Horvath's interest was not in navigation techniques or in canoes, but in the physical capabilities of the men themselves. By adapting standard physiological techniques, Horvath was able to calculate the energy expenditure required to paddle canoes of this sort at times when there was no wind to fill the sails, or when the wind was contrary. He concluded that paddles, or perhaps long oars, could indeed have propelled for long distances what were primarily sailing vessels.`,
    },
    {
      label: '',
      content: `Finally, a team led by p Wall Garrard conducted important research, in this case by making investigations while remaining safely in the laboratory. Wall Garrard's unusual method was to use the findings of linguists who had studied the languages of the Pacific islands, many of which are remarkably similar although the islands where they are spoken are sometimes thousands of kilometres apart. Clever adaptation of computer simulation techniques pioneered in other disciplines allowed him to produce convincing models suggesting the migrations were indeed systematic, but not simultaneous. Wall Garrard proposed the migrations should be seen not as a single journey made by a massed fleet of canoes, but as a series of ever more ambitious voyages, each pushing further into the unknown ocean.`,
    },
    {
      label: '',
      content: `What do we learn about Pacific navigation and voyaging from this research? Quite correctly, none of the researchers tried to use their findings to prove one theory or another; experiments such as these cannot categorically confirm or negate a hypothesis. The strength of this research lay in the range of methodologies employed. When we splice together these findings we can propose that traditional navigators used a variety of canoe types, sources of water and navigation techniques, and it was this adaptability which was their greatest accomplishment. These navigators observed the conditions prevailing at sea at the time a voyage was made and altered their techniques accordingly. Furthermore, the canoes of the navigators were not drifting helplessly at sea but were most likely part of a systematic migration; as such, the Pacific peoples were able to view the ocean as an avenue, not a barrier, to communication before any other race on Earth. Finally, one unexpected but most welcome consequence of this research has been a renaissance in the practice of traditional voyaging. In some groups of islands in the Pacific today young people are resurrecting the skills of their ancestors, when a few decades ago it seemed they would be lost forever.`,
    },
  ],
  questions: pacificQuestions,
}

/* =============================== Passage 3 =============================== */

const dingoSectionOptions = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

const dingoPeopleOptions = [
  'A Stuart McKechnie',
  'B Chris Johnson',
  'C Lee Allen',
  'D Mark Clifford',
]

const dingoQuestions: Question[] = [
  {
    id: 'v4-q28',
    number: 28,
    type: 'matching-information',
    groupTitle: 'Questions 28-34',
    instruction:
      'Reading Passage 3 has eight sections, A-H. Which section contains the following information? Write the correct letter, A-H, in boxes 28-34 on your answer sheet. NB You may use any letter more than once.',
    text: 'a description of a barrier designed to stop dingoes, which also divides two kinds of non-natives animals',
    options: dingoSectionOptions,
    correctAnswer: 'E',
    location: 'Paragraph E',
  },
  { id: 'v4-q29', number: 29, type: 'matching-information', text: 'how dingoes ensure that rival species do not dominate', options: dingoSectionOptions, correctAnswer: 'D', location: 'Paragraph D' },
  { id: 'v4-q30', number: 30, type: 'matching-information', text: 'a reference to a widespread non-native species that other animals feed on', options: dingoSectionOptions, correctAnswer: 'C', location: 'Paragraph C' },
  { id: 'v4-q31', number: 31, type: 'matching-information', text: "a mention of the dingo's arrival in Australia", options: dingoSectionOptions, correctAnswer: 'B', location: 'Paragraph B' },
  { id: 'v4-q32', number: 32, type: 'matching-information', text: 'research which has proved that dingoes have resorted to eating young livestock', options: dingoSectionOptions, correctAnswer: 'F', location: 'Paragraph F' },
  { id: 'v4-q33', number: 33, type: 'matching-information', text: 'a description of a method used to kill dingoes', options: dingoSectionOptions, correctAnswer: 'A', location: 'Paragraph A' },
  { id: 'v4-q34', number: 34, type: 'matching-information', text: 'the way that the structure of dingo groups affects how quickly their numbers grow', options: dingoSectionOptions, correctAnswer: 'D', location: 'Paragraph D' },
  {
    id: 'v4-q35',
    number: 35,
    type: 'matching-information',
    groupTitle: 'Questions 35-37',
    instruction:
      'Look at the following statements (Questions 35-37) and the list of people below. Match each statement with the correct person, A, B, C or D. Write the correct letter, A, B, C or D, in boxes 35-37 on your answer sheet.',
    text: 'Dingoes tend to hunt native animals rather than hunting other non-native predators.',
    options: dingoPeopleOptions,
    correctAnswer: 'D',
    location: 'Paragraph G',
  },
  { id: 'v4-q36', number: 36, type: 'matching-information', text: 'The presence of dingoes puts the income of some people at risk.', options: dingoPeopleOptions, correctAnswer: 'A', location: 'Paragraph A' },
  { id: 'v4-q37', number: 37, type: 'matching-information', text: 'Dingoes have had little impact on the dying out of animal species in Australia.', options: dingoPeopleOptions, correctAnswer: 'B', location: 'Paragraph D' },
  {
    id: 'v4-q38',
    number: 38,
    type: 'summary-completion',
    groupTitle: 'Questions 38-40',
    instruction:
      'Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer. Write your answers in boxes 38-40 on your answer sheet.',
    text: 'The dingo replaced the ______ as the main predatory animal in Australia.',
    correctAnswer: 'Tasmanian tiger',
    location: 'Paragraph B',
  },
  { id: 'v4-q39', number: 39, type: 'summary-completion', text: 'Foxes and cats are more likely to hunt native animals when there are fewer ______.', correctAnswer: 'rabbits', location: 'Paragraph C' },
  { id: 'v4-q40', number: 40, type: 'summary-completion', text: 'Australian animals reproduce at a slow rate as a natural way of avoiding ______.', correctAnswer: 'overpopulation', location: 'Paragraph D' },
]

const passage3: Section = {
  id: 'dingo-debate-p3-v4',
  title: 'Reading Passage 3: The dingo debate',
  paragraphs: [
    { label: '', content: `Graziers see them as pests, and poisoning is common, but some biologists think Australia's dingoes are the best weapon in a war against imported cats and foxes.` },
    {
      label: 'A',
      content: `A plane flies a slow pattern over Carlton Hill station, a 3,600 square kilometre ranch in the Kimberley region in northwest Australia. As the plane circles, those aboard drop 1,000 small pieces of meat, one by one, onto the scrubland below, each piece laced with poison; this practice is known as baiting.`,
    },
    {
      label: '',
      content: `Besides 50,000 head of cattle, Carlton Hill is home to the dingo, Australia's largest mammalian predator and the bane of a grazier's (cattle farmer's) life. Stuart McKechnie, manager of Carlton Hill, complains that graziers' livelihoods are threatened when dingoes prey on cattle. But one man wants the baiting to end, and for dingoes to once again roam Australia's wide-open spaces. According to Chris Johnson of James Cook University, 'Australia needs more dingoes to protect our biodiversity.'`,
    },
    {
      label: 'B',
      content: `About 4,000 years ago, Asian sailors introduced dingoes to Australia. Throughout the ensuing millennia, these descendants of the wolf spread across the continent and, as the Tasmanian tiger disappeared completely from Australia, dingoes became Australia's top predators. As agricultural development took place, the European settlers found that they could not safely keep their livestock where dingoes roamed. So began one of the most sustained efforts at pest control in Australia's history. Over the last 150 years, dingoes have been shot and poisoned, and fences have been used in an attempt to keep them away from livestock. But at the same time, as the European settlers tried to eliminate one native pest from Australia, they introduced more of their own.`,
    },
    {
      label: 'C',
      content: `In 1860, the rabbit was unleashed on Australia by a wealthy landowner and by 1980 rabbits had covered most of the mainland. Rabbits provide huge prey base for two other introduced species: the feral (wild) cat and the red fox.`,
    },
    {
      label: '',
      content: `The Interaction between foxes, cats and rabbits is a huge problem for native mammals. In good years, rabbit numbers increase dramatically, and fox and cat populations grow quickly in response to the abundance of this prey. When bad seasons follow, rabbit numbers are significantly reduced - and the dwindling but still large fox and cat populations are left with little to eat besides native mammals.`,
    },
    {
      label: 'D',
      content: `Australian mammals generally reproduce much more slowly than rabbits, cats and foxes - and adaption to prevent overpopulation in the arid environment, where food can be scarce and unreliable - and populations decline because they can't grow fast enough to replace animals killed by the predators. Johnson says dingoes are the solution to this problem because they keep cat and fox populations under control. Besides regularly eating the smaller predators, dingoes will kill them simply to lessen competition.`,
    },
    {
      label: '',
      content: `Dingo packs live in large, stable territories and generally have only one fertile, which limits their rate of increase. In the 4,000 years that dingoes have been Australia, they have contributed to few, if any, extinctions, Johnsons says.`,
    },
    {
      label: 'E',
      content: `Reaching out from a desolate spot where three states meet, for 2,500 km in either direction, is the world's longest fence, two metres high and stretching from the coast in Queensland to the Great Australian Bight in South Australia; it is there to keep dingoes out of southeast, the fence separates the main types of livestock found in Australia. To the northwest of the fence, cattle predominate; to the southwest, sheep fill the landscape. In fact, Australia is a land dominated by these animals - 25 million cattle, 100 million sheep and just over 20 million people.`,
    },
    {
      label: 'F',
      content: `While there is no argument that dingoes will prey on sheep if given the chance, they don't hunt cattle once the calves are much past two or three weeks old, according to McKechnie. And a study in Queensland suggests that dingoes don't even prey heavily on the newborn calves unless their staple prey disappears due to deteriorating conditions like drought.`,
    },
    {
      label: '',
      content: `This study, co-authored by Lee Alien of the Robert Wicks Research Centre in Queensland, suggests that the aggressive baiting programs used against dingoes may actually be counter-productive for graziers. When dingoes are removed from an area by baiting m the area is recolonized by younger, more solitary dingoes. These animals aren't capable of going after the large prey like kangaroos, so they turn to calves. In their study, some of the highest rates of calf predation occurred in areas that had been baited.`,
    },
    {
      label: 'G',
      content: `Mark Clifford, general manager of a firm that manages over 200,000 head of cattle, is not convinced by Allen's assertion. Clifford says, 'It's obvious if we drop or loosen control on dingoes, we are going to lose more calves.' He doesn't believe that dingoes will go after kangaroos when calves are around. Nor is he persuaded of dingoes' supposed ecological benefits, saying he is not convinced that they manage to catch cats that often, believing they are more likely to catch small native animals instead.`,
    },
    {
      label: 'H',
      content: `McKechnie agrees that dingoes kill the wallabies (small native animals) that compete with his cattle for food, but points out that in parts of Westers Australia, there are no fixes, and not very many cats. He doesn't see how relaxing controls on dingoes in his area will improve the ecological balance.`,
    },
    {
      label: '',
      content: `Johnson sees a need for a change in philosophy on the part of graziers. 'There might be a number of different ways of thinking through dingo management in cattle country,' he says. 'At the moment, though, that hasn't got through to graziers. There's still just on prescription, and that is to bait as widely as possible.'`,
    },
  ],
  questions: dingoQuestions,
}

/* =============================== Test =============================== */

export const fullReadingTest4: IELTSTest = {
  id: 'ielts-reading-full-vol4',
  title: 'IELTS Reading Full Test 4 - William Gilbert, Pacific Navigation, The Dingo Debate',
  type: 'Academic',
  module: 'Reading',
  duration: 60,
  totalQuestions: 40,
  sections: [passage1, passage2, passage3],
}
