import type { Section } from '../types/ieltsTypes'

// Day 10 — full 3-passage mock reading test (40 questions).
// Sources (mini-ielts.com, verbatim where possible): The Importance of Law,
// William Gilbert and Magnetism, Yawning. Heading/people letters normalised to
// the project convention (letter-prefixed options + letter answers).

/* ----------------------------- Passage 1 ----------------------------- */

const lawHeadingOptions = [
  'A. Different areas of professional expertise',
  'B. Reasons why it is unfair to criticise lawyers',
  'C. The disadvantages of the legal system',
  'D. The law applies throughout our lives',
  'E. The law has affected historical events',
  'F. A negative regard for lawyers',
  "G. Public's increasing ability to influence the law",
  'H. Growth in laws',
]

const lawSkillsOptions = [
  'A. There should be a person with legal training in every hospital.',
  'B. Lawyers with experience in commercial law are the most in demand.',
  'C. Knowledge of the law is as important as having computer skills.',
  'D. Society could not function effectively without legal experts.',
  'E. Schools should teach students about the law.',
]

const passage1: Section = {
  id: 'day10-importance-of-law-mp1',
  title: 'Reading Passage 1: The Importance of Law',
  paragraphs: [
    {
      label: 'A',
      content: `The law influences all of us virtually all the time, it governs almost all aspects of our behavior, and even what happens to us when we are no longer alive. It affects us from the embryo onwards. It governs the air we breathe, the food and drink we consume, our travel, family relationships, and our property. It applies at the bottom of the ocean and in space.`,
    },
    {
      label: '',
      content: `Each time we examine a label on a food product, engage in work as an employee or employer, travel on the roads, go to school to learn or to teach, stay in a hotel, borrow a library book, create or dissolve a commercial company, play sports, or engage the services of someone for anything from plumbing a sink to planning a city, we are in the world of law.`,
    },
    {
      label: 'B',
      content: `Law has also become much more widely recognised as the standard by which behavior needs to be judged. A very telling development in recent history is the way in which the idea of law has permeated all parts of social life. The universal standard of whether something is socially tolerated is progressively becoming whether it is legal, rather than something that has always been considered acceptable. In earlier times, most people were illiterate.`,
    },
    {
      label: '',
      content: `Today, by contrast, a vast number of people can read, and it is becoming easier for people to take an interest in law, and for the general population to help actually shape the law in many countries. However, law is a versatile instrument that can be used equally well for the improvement or the degradation of humanity.`,
    },
    {
      label: 'C',
      content: `This, of course, puts law in a very significant position. In our rapidly developing world, all sorts of skills and knowledge are valuable. Those people, for example, with knowledge of computers, the internet, and communications technology are relied upon by the rest of us.`,
    },
    {
      label: '',
      content: `There is now someone with IT skills or an IT help desk in every UK school, every company, every hospital, every local and central government office. Without their knowledge, many parts of commercial and social life today would seize up in minutes. But legal understanding is just as vital and as universally needed. The American comedian Jerry Seinfeld put it like this, 'We are all throwing the dice, playing the game, moving our pieces around the board, but if there is a problem, the lawyer is the only person who has read the inside of the top of the box.' In other words, the lawyer is the only person who has read and made sense of the rules.`,
    },
    {
      label: 'D',
      content: `The number of laws has never been greater. In the UK alone, about 35 new Acts of Parliament are produced every year, thereby delivering thousands of new rules. The legislative output of the British Parliament has more than doubled in recent times from 1,100 pages a year in the early 1970s, to over 2,500 pages a year today. Between 1997 and 2006, the legislature passed 365 Acts of Parliament and more than 32,000 legally binding statutory instruments. In a system with so much law, lawyers do a great deal not just to vindicate the rights of citizens and organizations but also to help develop the law through legal arguments, some of which are adapted by judges to become laws. Law courts can and do produce new law and revise old law, but they do so having heard the arguments of lawyers.`,
    },
    {
      label: 'E',
      content: `However, despite their important role in developing the rules, lawyers are not universally admired. Anti-lawyer jokes have a long history going back to the ancient Greeks. More recently the son of a famous Hollywood actor was asked at his junior school what his father did for a living, to which he replied, 'My daddy is a movie actor, and sometimes he plays the good guy, and sometimes he plays the lawyer.' For balance, though, it is worth remembering that there are and have been many heroic and revered lawyers such as the Roman philosopher and politician Cicero and Mahatma Gandi, the Indian campaigner for independence.`,
    },
    {
      label: 'F',
      content: `People sometimes make comments that characterise lawyers as professionals whose concerns put personal reward above truth, or who gain financially from misfortune. There are undoubtedly lawyers that would fit that bill, just as there are some scientists, journalists and others in that category. But, in general, it is no more just to say that lawyers are bad because they make a living from people's problems than it is to make the same accusation in respect of nurses or IT consultants. A great many lawyers are involved in public law work, such as that involving civil liberties, housing and other issues. Such work is not lavishly remunerated and the quality of the service provided by these lawyers relies on considerable professional dedication. Moreover, much legal work has nothing to do with conflict or misfortune, but is primarily concerned with drafting documents. Another source of social disaffection for lawyers, and disaffection for the law, is a limited public understanding of how law works and how it could be changed. Greater clarity about these issues, maybe as a result of better public relations, would reduce many aspects of public dissatisfaction with the law.`,
    },
  ],
  questions: [
    {
      id: 'day10-q1',
      number: 1,
      type: 'matching-headings',
      groupTitle: 'Questions 1-6',
      instruction:
        'Reading Passage 1 has six paragraphs, A-F. Choose the correct heading for each paragraph from the list of headings below.',
      text: 'Paragraph A',
      options: lawHeadingOptions,
      correctAnswer: 'D',
      location: 'Paragraph A',
    },
    { id: 'day10-q2', number: 2, type: 'matching-headings', text: 'Paragraph B', options: lawHeadingOptions, correctAnswer: 'G', location: 'Paragraph B' },
    { id: 'day10-q3', number: 3, type: 'matching-headings', text: 'Paragraph C', options: lawHeadingOptions, correctAnswer: 'A', location: 'Paragraph C' },
    { id: 'day10-q4', number: 4, type: 'matching-headings', text: 'Paragraph D', options: lawHeadingOptions, correctAnswer: 'H', location: 'Paragraph D' },
    { id: 'day10-q5', number: 5, type: 'matching-headings', text: 'Paragraph E', options: lawHeadingOptions, correctAnswer: 'F', location: 'Paragraph E' },
    { id: 'day10-q6', number: 6, type: 'matching-headings', text: 'Paragraph F', options: lawHeadingOptions, correctAnswer: 'B', location: 'Paragraph F' },
    {
      id: 'day10-q7',
      number: 7,
      type: 'five-true-statements',
      groupTitle: 'Questions 7-8',
      instruction:
        "Choose TWO letters, A-E. Which TWO of the following statements does the writer make about legal skills in today's world?",
      text: 'Select TWO options.',
      options: lawSkillsOptions,
      correctAnswer: ['C', 'D'],
      location: 'Paragraph C',
      evidence: 'But legal understanding is just as vital and as universally needed.',
    },
    {
      id: 'day10-q9',
      number: 9,
      type: 'summary-completion',
      groupTitle: 'Questions 9-13',
      instruction:
        'Complete the summary below. Choose ONE WORD ONLY from the passage for each answer.',
      text: 'Lawyers as professionals. People sometimes say that ______ is of little interest to lawyers, who are more concerned with making money.',
      correctAnswer: 'truth',
      location: 'Paragraph F',
      evidence: 'put personal reward above truth',
    },
    {
      id: 'day10-q10',
      number: 10,
      type: 'summary-completion',
      text: 'This may well be the case with some individuals, in the same way that some ______ or scientific experts may also be driven purely by financial greed.',
      correctAnswer: 'journalists',
      location: 'Paragraph F',
      evidence: 'scientists, journalists and others in that category',
    },
    {
      id: 'day10-q11',
      number: 11,
      type: 'summary-completion',
      text: "However, criticising lawyers because their work is concerned with people's problems would be similar to attacking IT staff or ______ for the same reason.",
      correctAnswer: 'nurses',
      location: 'Paragraph F',
      evidence: 'nurses or IT consultants',
    },
    {
      id: 'day10-q12',
      number: 12,
      type: 'summary-completion',
      text: 'In fact, many lawyers focus on questions relating, for example, to housing or civil liberties, which requires them to have ______ to their work.',
      correctAnswer: 'dedication',
      location: 'Paragraph F',
      evidence: 'considerable professional dedication',
    },
    {
      id: 'day10-q13',
      number: 13,
      type: 'summary-completion',
      text: "What's more, a lot of lawyers' time is spent writing ______ rather than dealing with people's misfortunes.",
      correctAnswer: 'documents',
      location: 'Paragraph F',
      evidence: 'drafting documents',
    },
  ],
}

/* ----------------------------- Passage 2 ----------------------------- */

const gilbertHeadingOptions = [
  'A. Early years of Gilbert',
  'B. What was new about his scientific research method',
  'C. The development of chemistry',
  'D. Questioning traditional astronomy',
  'E. Pioneers of the early science',
  'F. Professional and social recognition',
  'G. Becoming the president of the Royal Science Society',
  'H. The great works of Gilbert',
  'I. His discovery about magnetism',
  'J. His change of focus',
]

const gilbertDiscoveryOptions = [
  'A. Metal can be transformed into another.',
  'B. Garlic can remove magnetism.',
  'C. Metals can be magnetised.',
  'D. Stars are at different distances from the earth.',
  'E. The earth wobbles on its axis.',
  'F. There are two charges of electricity.',
]

const passage2: Section = {
  id: 'day10-william-gilbert-mp2',
  title: 'Reading Passage 2: William Gilbert and Magnetism',
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
  questions: [
    {
      id: 'day10-q14',
      number: 14,
      type: 'matching-headings',
      groupTitle: 'Questions 14-20',
      instruction:
        'Reading Passage 2 has seven paragraphs, A-G. Choose the correct heading for each paragraph from the list of headings below.',
      text: 'Paragraph A',
      options: gilbertHeadingOptions,
      correctAnswer: 'E',
      location: 'Paragraph A',
    },
    { id: 'day10-q15', number: 15, type: 'matching-headings', text: 'Paragraph B', options: gilbertHeadingOptions, correctAnswer: 'A', location: 'Paragraph B' },
    { id: 'day10-q16', number: 16, type: 'matching-headings', text: 'Paragraph C', options: gilbertHeadingOptions, correctAnswer: 'F', location: 'Paragraph C' },
    { id: 'day10-q17', number: 17, type: 'matching-headings', text: 'Paragraph D', options: gilbertHeadingOptions, correctAnswer: 'J', location: 'Paragraph D' },
    { id: 'day10-q18', number: 18, type: 'matching-headings', text: 'Paragraph E', options: gilbertHeadingOptions, correctAnswer: 'I', location: 'Paragraph E' },
    { id: 'day10-q19', number: 19, type: 'matching-headings', text: 'Paragraph F', options: gilbertHeadingOptions, correctAnswer: 'D', location: 'Paragraph F' },
    { id: 'day10-q20', number: 20, type: 'matching-headings', text: 'Paragraph G', options: gilbertHeadingOptions, correctAnswer: 'B', location: 'Paragraph G' },
    {
      id: 'day10-q21',
      number: 21,
      type: 'true-false-not-given',
      groupTitle: 'Questions 21-23',
      instruction:
        'Do the following statements agree with the information given in Reading Passage 2? Write TRUE if the statement agrees with the information, FALSE if the statement contradicts the information, or NOT GIVEN if there is no information on this.',
      text: 'He is less famous than he should be.',
      correctAnswer: 'TRUE',
      location: 'Paragraph A',
      evidence: 'However, he is less well known than he deserves.',
    },
    {
      id: 'day10-q22',
      number: 22,
      type: 'true-false-not-given',
      text: 'He was famous as a doctor before he was employed by the Queen.',
      correctAnswer: 'TRUE',
      location: 'Paragraph C',
      evidence: 'He was a very successful and eminent doctor.',
    },
    {
      id: 'day10-q23',
      number: 23,
      type: 'true-false-not-given',
      text: 'He lost faith in the medical theories of his time.',
      correctAnswer: 'NOT GIVEN',
      location: 'Paragraph D',
    },
    {
      id: 'day10-q24',
      number: 24,
      type: 'five-true-statements',
      groupTitle: 'Questions 24-26',
      instruction:
        "Choose THREE letters, A-F. Which THREE of the following are parts of Gilbert's discovery?",
      text: 'Select THREE options.',
      options: gilbertDiscoveryOptions,
      correctAnswer: ['C', 'D', 'E'],
      location: 'Paragraphs E-F',
      evidence: 'metals can be magnetised by rubbing',
    },
  ],
}

/* ----------------------------- Passage 3 ----------------------------- */

const yawningWordBank = [
  'form and function',
  'long yawns',
  '3 seconds',
  'fixed action pattern',
  '68 seconds',
  'short yawns',
  'reflex',
  'sneeze',
  'short duration',
  '6 seconds',
  'half-yawns',
]

const passage3: Section = {
  id: 'day10-yawning-mp3',
  title: 'Reading Passage 3: Yawning',
  paragraphs: [
    {
      label: '',
      content: `When Robert R Provine began studying yawning in the 1960s, it was difficult for him to convince research students of the merits of 'yawning science'. Although it may appear quirky to some, Provine's decision to study yawning was a logical extension of his research in developmental neuroscience.`,
    },
    {
      label: '',
      content: `The verb 'to yawn' is derived from the Old English ganien or ginian, meaning to gape or open wide. But in addition to gaping jaws, yawning has significant features that are easy to observe and analyse. Provine 'collected' yawns to study by using a variation of the contagion response. He asked people to 'think about yawning' and, once they began to yawn, to depress a button, and that would record from the start of the yawn to the exhalation at its end.`,
    },
    {
      label: '',
      content: `Provine's early discoveries can be summarized as follows: the yawn is highly stereotyped but not invariant in its duration and form. It is an excellent example of the instinctive 'fixed action pattern' of classical animal-behavior study, or ethology. It is not a reflex (short-duration, rapid, proportional response to a simple stimulus), but, once started, a yawn progresses with the inevitability of a sneeze.`,
    },
    {
      label: '',
      content: `The standard yawn runs its course over about six seconds on average, but its duration can range from about three seconds to much longer than the average. There are no half-yawns: this is an example of the typical intensity of fixed action patterns and a reason why you cannot stifle yawns. Just like a cough, yawns can come in bouts with a highly variable inter-yawn interval, which is generally about 68 seconds but rarely more than 70. There is no relation between yawn frequency and duration: producers of short or long yawns do not compensate by yawning more or less often. Furthermore, Provine's hypotheses about the form and function of yawning can be tested by three informative yawn variants which can be used to look at the roles of the nose, the mouth and the jaws.`,
    },
    {
      label: '',
      content: `Subjects are asked to pinch their nose closed when they feel themselves start to yawn. Most subjects report being able to perform perfectly normal closed nose yawns. This indicates that the inhalation at the onset of a yawn, and the exhalation at its end, need not involve the nostrils - the mouth provides a sufficient airway. Subjects are then asked to clench their teeth when they feel themselves start to yawn but allow themselves to inhale normally through their open lips and clenched teeth. This variant gives one the sensation of being stuck mid-yawn. This shows that gaping of the jaws is an essential component of the fixed action pattern of the yawn, and unless it is accomplished, the program (or pattern) will not run to completion.`,
    },
    {
      label: '',
      content: `Yawning and stretching share properties and may be performed together as parts of a global motor complex. Studies by J I P deVries et al. in the early 1980s, charting movement in the developing foetus using ultrasound, observed a link between yawning and stretching. The most extraordinary demonstration of the yawn-stretch linkage occurs in many people paralyzed on one side of their body because of brain damage caused by a stroke. The prominent British neurologist Sir Francis Walshe noted in 1923 that when these people yawn, they are startled and mystified to observe that their otherwise paralyzed arm rises and flexes automatically in what neurologists term an 'associated response'. Yawning apparently activates undamaged, unconsciously controlled connections between the brain and the motor system, causing the paralyzed limb to move. It is not known whether the associated response is a positive prognosis for recovery, nor whether yawning is therapeutic for prevention of muscular deterioration.`,
    },
    {
      label: '',
      content: `Provine speculated that, in general, yawning may have many functions, and selecting a single function from the available options may be an unrealistic goal. Yawning appears to be associated with a change of behavioral state, switching from one activity to another. Yawning is also a reminder that ancient and unconscious behavior linking us to the animal world lurks beneath the veneer of culture, rationality and language.`,
    },
  ],
  questions: [
    {
      id: 'day10-q27',
      number: 27,
      type: 'drag-drop-summary',
      groupTitle: 'Questions 27-32',
      instruction: 'Complete the summary using the list of words, A-K, below. Drag the correct word into each gap.',
      text: [
        'Provine was able to confirm that ______ do not exist.',
        'Just like a ______, yawns cannot be interrupted after they have begun.',
        'This is because yawns occur as a ______ rather than a stimulus response.',
        'A typical yawn lasts about ______.',
        'Yawns usually begin around ______ apart.',
        'People who yawn less do not necessarily produce ______ to make up for this.',
      ].join('\n'),
      options: yawningWordBank,
      correctAnswer: ['half-yawns', 'sneeze', 'fixed action pattern', '6 seconds', '68 seconds', 'long yawns'],
      location: 'Paragraphs 3-4',
    },
    {
      id: 'day10-q33',
      number: 33,
      type: 'multiple-choice',
      groupTitle: 'Questions 33-37',
      instruction: 'Choose the correct letter, A, B, C or D.',
      text: "What did Provine conclude from his 'closed nose yawn' experiment?",
      options: [
        'A. Ending a yawn requires use of the nostrils.',
        'B. You can yawn without breathing through your nose.',
        'C. Breathing through the nose produces a silent yawn.',
        'D. The role of the nose in yawning needs further investigation.',
      ],
      correctAnswer: 'B',
      location: 'Paragraph 5',
      evidence: 'the mouth provides a sufficient airway',
    },
    {
      id: 'day10-q34',
      number: 34,
      type: 'multiple-choice',
      text: "Provine's clenched teeth yawn experiment shows that",
      options: [
        'A. yawning is unconnected with fatigue.',
        'B. a yawn is the equivalent of a deep intake of breath.',
        'C. you have to be able to open your mouth wide to yawn.',
        'D. breathing with the teeth together is as efficient as through the nose.',
      ],
      correctAnswer: 'C',
      location: 'Paragraph 5',
      evidence: 'gaping of the jaws is an essential component',
    },
    {
      id: 'day10-q35',
      number: 35,
      type: 'multiple-choice',
      text: 'The nose yawn experiment was used to test whether yawning',
      options: [
        'A. can be stopped after it has started.',
        'B. is the result of motor programming.',
        'C. involves both inhalation and exhalation.',
        'D. can be accomplished only through the nose.',
      ],
      correctAnswer: 'C',
      location: 'Paragraph 5',
    },
    {
      id: 'day10-q36',
      number: 36,
      type: 'multiple-choice',
      text: 'In people paralyzed on one side because of brain damage',
      options: [
        'A. yawning may involve only one side of the face.',
        'B. the yawning response indicates that recovery is likely.',
        'C. movement in the paralysed arm is stimulated by yawning.',
        'D. yawning can be used as an example to prevent muscle wasting.',
      ],
      correctAnswer: 'C',
      location: 'Paragraph 6',
      evidence: 'their otherwise paralyzed arm rises and flexes automatically',
    },
    {
      id: 'day10-q37',
      number: 37,
      type: 'multiple-choice',
      text: 'In the last paragraph, the writer concludes that',
      options: [
        'A. yawning is a sign of boredom.',
        'B. we yawn in spite of the development of our species.',
        'C. yawning is a more passive activity than we imagine.',
        'D. we are stimulated to yawn when our brain activity is low.',
      ],
      correctAnswer: 'B',
      location: 'Paragraph 7',
      evidence: 'lurks beneath the veneer of culture, rationality and language',
    },
    {
      id: 'day10-q38',
      number: 38,
      type: 'yes-no-not-given',
      groupTitle: 'Questions 38-40',
      instruction:
        'Do the following statements agree with the claims of the writer in Reading Passage 3? Write YES if the statement agrees with the claims of the writer, NO if the statement contradicts the claims of the writer, or NOT GIVEN if it is impossible to say what the writer thinks about this.',
      text: "Research students were initially reluctant to appreciate the value of Provine's studies.",
      correctAnswer: 'YES',
      location: 'Paragraph 1',
      evidence: 'it was difficult for him to convince research students of the merits',
    },
    {
      id: 'day10-q39',
      number: 39,
      type: 'yes-no-not-given',
      text: 'When foetuses yawn and stretch they are learning how to control movement.',
      correctAnswer: 'NOT GIVEN',
      location: 'Paragraph 6',
    },
    {
      id: 'day10-q40',
      number: 40,
      type: 'yes-no-not-given',
      text: 'According to Provine, referring to only one function is probably inadequate to explain why people yawn.',
      correctAnswer: 'YES',
      location: 'Paragraph 7',
      evidence: 'selecting a single function from the available options may be an unrealistic goal',
    },
  ],
}

export const readingMockDay10Sections: Section[] = [passage1, passage2, passage3]
