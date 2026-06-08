import type { IELTSTest, Section } from '../types/ieltsTypes'

const paragraphOptionsAtoJ = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
const paragraphOptionsAtoG = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

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

const passage1: Section = {
  id: 'aus-parrots-p1-v6',
  title: 'Reading Passage 1: Australian parrots and their adaptation to habitat change',
  paragraphs: [
    {
      label: 'A',
      content:
        'Parrots are found across the tropics and in all southern hemisphere continents except Antarctica, but nowhere do they display such a richness of diversity and form as in Australia. One-sixth of the world’s 345 parrot species are found there, and Australia has long been renowned for the number and variety of its parrots.',
    },
    {
      label: 'B',
      content:
        'In the 16th century, the German cartographer Mercator made a world map that included a place, somewhere near present-day Australia, that he named Terra Psittacorum – the Land of Parrots – and the first European settlers in Australia often referred to the country as Parrot Land. In 1865, the celebrated British naturalist and wildlife artist John Gould said: “No group of birds gives Australia so tropical and benign an air as the numerous species of this great family by which it is tenanted.”',
    },
    {
      label: 'C',
      content:
        'Parrots are descendants of an ancient line. Due to their great diversity, and since most species inhabit Africa, Australia and South America, it seems almost certain that parrots originated millions of years ago on the ancient southern continent of Gondwana, before it broke up into the separate southern hemisphere continents we know today. Much of Gondwana comprised vast rainforests intersected by huge slow-flowing rivers and expansive lakes, but by eight million years ago, great changes were underway. The centre of the continent of Australia had begun to dry out, and the rainforests that once covered it gradually contracted to the continental margins, where, to a limited extent, they still exist today.',
    },
    {
      label: 'D',
      content:
        'The creatures that remained in those shrinking rainforests had to adapt to the drier conditions or face extinction. Reacting to these desperate circumstances, the parrot family, typically found in jungles in other parts of the world, has populated some of Australia’s harshest environments. The parrots spread from ancestral forests through eucalypt woodlands to colonise the central deserts of Australia, and as a consequence they diversified into a wide range of species with adaptations that reflect the many changes animals and plants had to make to survive in these areas.',
    },
    {
      label: 'E',
      content:
        'These evolutionary pressures helped mould keratin, the substance from which beaks are made, into a range of tools capable of gathering the new food types favoured by various species of parrot. The size of a parrot’s short, blunt beak and the length of that beak’s downcurved upper section are related to the type of food each species eats. Some have comparatively long beaks that are perfect for extracting seeds from fruit; others have broader and stronger beaks that are designed for cracking hard seeds.',
    },
    {
      label: 'F',
      content:
        'Differently shaped beaks are not the only adaptations that have been made during the developing relationship between parrots and their food plants. Like all of Australia’s many honey-eating birds, the rainbow-coloured lorikeets and the flowers on which they feed have long co-evolved, with features such as the shape and colour of the flowers adapted to the birds’ particular needs. For example, red is the most attractive colour to birds, and thus flowers which depend on birds for pollination are more often red, and lorikeets’ tongues have bristles which help them to collect as much pollen as possible.',
    },
    {
      label: 'G',
      content:
        'Today, most of Australia’s parrots inhabit woodland and open forest, and their numbers decline towards both deserts and wetter areas. The majority are nomadic to some degree, moving around to take advantage of feeding and breeding places. Two of the dry country parrots, the pink and grey galah and the pink, white and yellow corella, have expanded their ranges in recent years. They are among the species that have adapted well to the changes brought about by European settlement: forest felling created grasslands where galahs and corellas thrive.',
    },
    {
      label: 'H',
      content:
        'But other parrot species did not fare so well when their environments were altered. The clearing of large areas of rainforest is probably responsible for the disappearance of the double-eyed fig parrot, and numbers of ground parrots declined when a great part of their habitat was destroyed by the draining of coastal swamps. Even some parrot species that benefited from forest clearing at first are now confronted by a shortage of nesting sites due to further man-made changes.',
    },
    {
      label: 'I',
      content:
        'New conditions also sometimes favour an incoming species over one that originally inhabited the area. For example, after farmers cleared large areas of forest on Kangaroo Island off the coast of South Australia, the island was colonised by galahs. They were soon going down holes and destroying black cockatoo eggs in order to take the hole for their own use. Their success precipitated a partial collapse in the black cockatoo population when the latter lost the struggle for scarce nesting hollows.',
    },
    {
      label: 'J',
      content:
        'There may be no final answer to ensuring an equitable balance between parrot species. Nest box programmes help ease the shortage of nesting sites in some places, but there are not enough, they are expensive and they are not an adequate substitute for large, old trees, such as the habitat they represent and the nectar, pollen and seeds they provide. Competition between parrots for nest sites is a result of the changes we humans have made to the Earth. We are the most widespread and dangerous competitors that parrots have ever had to face, but we also have the knowledge and skill to maintain the wonderfully rich diversity of Australia’s parrots. All we need is the will to do so.',
    },
  ],
  questions: [
    {
      id: 'parrot-v6-q1',
      number: 1,
      type: 'matching-information',
      groupTitle: 'Questions 1-6',
      instruction:
        'Reading Passage 1 has ten paragraphs, A–J. Which paragraph contains the following information? Write the correct letter, A–J.',
      text: 'An example of how one parrot species may survive at the expense of another',
      options: paragraphOptionsAtoJ,
      correctAnswer: 'I',
      location: 'Paragraph I',
    },
    {
      id: 'parrot-v6-q2',
      number: 2,
      type: 'matching-information',
      text: 'A description of how plants may adapt to attract birds',
      options: paragraphOptionsAtoJ,
      correctAnswer: 'F',
      location: 'Paragraph F',
    },
    {
      id: 'parrot-v6-q3',
      number: 3,
      type: 'matching-information',
      text: 'Example of two parrot species which benefited from changes to the environment',
      options: paragraphOptionsAtoJ,
      correctAnswer: 'G',
      location: 'Paragraph G',
    },
    {
      id: 'parrot-v6-q4',
      number: 4,
      type: 'matching-information',
      text: 'How the varied Australian landscape resulted in a great variety of parrot species',
      options: paragraphOptionsAtoJ,
      correctAnswer: 'D',
      location: 'Paragraph D',
    },
    {
      id: 'parrot-v6-q5',
      number: 5,
      type: 'matching-information',
      text: 'A reason why most parrot species are native to the southern hemisphere',
      options: paragraphOptionsAtoJ,
      correctAnswer: 'C',
      location: 'Paragraph C',
    },
    {
      id: 'parrot-v6-q6',
      number: 6,
      type: 'matching-information',
      text: 'An example of a parrot species which did not survive changes to its habitat',
      options: paragraphOptionsAtoJ,
      correctAnswer: 'H',
      location: 'Paragraph H',
    },
    {
      id: 'parrot-v6-q7',
      number: 7,
      type: 'multiple-choice',
      groupTitle: 'Questions 7-9',
      instruction: 'Choose the correct letter, A, B, C or D.',
      text: 'The writer believes that most parrot species',
      options: [
        'moved from Africa and South America to Australia.',
        'had ancestors in either Africa, Australia or South America.',
        'had ancestors in a continent which later split up.',
        'came from a continent now covered by water.',
      ],
      correctAnswer: 'C',
      location: 'Paragraph C',
    },
    {
      id: 'parrot-v6-q8',
      number: 8,
      type: 'multiple-choice',
      text: "What does the writer say about a parrot's beak?",
      options: [
        'They are longer than those of other birds.',
        'They are made of a unique material.',
        'They are used more efficiently than those of other species.',
        'They are specially adapted to suit the diet.',
      ],
      correctAnswer: 'D',
      location: 'Paragraph E',
    },
    {
      id: 'parrot-v6-q9',
      number: 9,
      type: 'multiple-choice',
      text: 'Which of the following is NOT mentioned by the writer as a disadvantage of nesting boxes?',
      options: [
        'They cost too much.',
        'They need to be maintained.',
        'They provide only shelter, not food.',
        'There are too few of them.',
      ],
      correctAnswer: 'B',
      location: 'Paragraph J',
    },
    {
      id: 'parrot-v6-q10',
      number: 10,
      type: 'summary-completion',
      groupTitle: 'Questions 10-13',
      instruction:
        'Complete the summary below. Choose NO MORE THAN TWO WORDS AND/OR A NUMBER from the passage for each answer.',
      text: 'Parrots in Australia\nThere are 345 varieties of parrot in existence and, of these, ______ live in Australia.',
      correctAnswer: 'one-sixth',
      location: 'Paragraph A',
    },
    {
      id: 'parrot-v6-q11',
      number: 11,
      type: 'summary-completion',
      text: 'As early as the ______, parrots were known to live in that part of the world.',
      correctAnswer: '16th century',
      location: 'Paragraph B',
    },
    {
      id: 'parrot-v6-q12',
      number: 12,
      type: 'summary-completion',
      text: 'The mapmaker ______ recognised that parrots lived in that part of the world.',
      correctAnswer: 'Mercator',
      location: 'Paragraph B',
    },
    {
      id: 'parrot-v6-q13',
      number: 13,
      type: 'summary-completion',
      text:
        '______, the famous painter of animals and birds, commented on the size and beauty of the Australian parrot family.',
      correctAnswer: 'John Gould',
      location: 'Paragraph B',
    },
  ],
}

const passage2: Section = {
  id: 'yawning-p2-v6',
  title: 'Reading Passage 2: Yawning',
  content: [
    'How and why we yawn still presents problems for researchers in an area which has only recently been opened up to study.',
    "When Robert R Provine began studying yawning in the 1960s, it was difficult for him to convince research students of the merits of 'yawning science'. Although it may appear quirky to some, Provine's decision to study yawning was a logical extension of his research in developmental neuroscience.",
    "The verb 'to yawn' is derived from the Old English ganien or ginian, meaning to gape or open wide. But in addition to gaping jaws, yawning has significant features that are easy to observe and analyse. Provine 'collected' yawns to study by using a variation of the contagion response. He asked people to 'think about yawning' and, once they began to yawn, to depress a button that would record from the start of the yawn to the exhalation at its end.",
    "Provine's early discoveries can be summarised as follows: the yawn is highly stereotyped but not invariant in its duration and form. It is an excellent example of the instinctive 'fixed action pattern' of classical animal-behaviour study, or ethology. It is not a reflex (a short-duration, rapid, proportional response to a simple stimulus), but, once started, a yawn progresses with the inevitability of a sneeze. The standard yawn runs its course over about six seconds on average, but its duration can range from about three seconds to much longer than the average. There are no half-yawns: this is an example of the typical intensity of fixed action patterns and a reason why you cannot stifle yawns. Just like a cough, yawns can come in bouts with a highly variable inter-yawn interval, which is generally about 68 seconds but rarely more than 70. There is no relation between yawn frequency and duration: producers of short or long yawns do not compensate by yawning more or less often. Furthermore, Provine's hypotheses about the form and function of yawning can be tested by three informative yawn variants which can be used to look at the roles of the nose, the mouth and the jaws.",
    'i) The closed nose yawn',
    'Subjects are asked to pinch their nose closed when they feel themselves start to yawn. Most subjects report being able to perform perfectly normal closed nose yawns. This indicates that the inhalation at the onset of a yawn, and the exhalation at its end, need not involve the nostrils – the mouth provides a sufficient airway.',
    'ii) The clenched teeth yawn',
    'Subjects are asked to clench their teeth when they feel themselves start to yawn but allow themselves to inhale normally through their open lips and clenched teeth. This variant gives one the sensation of being stuck mid-yawn. This shows that gaping of the jaws is an essential component of the fixed action pattern of the yawn, and unless it is accomplished, the program (or pattern) will not run to completion. The yawn is also shown to be more than a deep breath, because, unlike normal breathing, inhalation and exhalation cannot be performed so well through the clenched teeth as through the nose.',
    'iii) The nose yawn',
    'This variant tests the adequacy of the nasal airway to sustain a yawn. Unlike normal breathing, which can be performed equally well through mouth or nose, yawning is impossible via nasal inhalation alone. As with the clenched teeth yawn, the nose yawn provides the unfulfilling sensation of being stuck in mid-yawn. Exhalation, on the other hand, can be accomplished equally well through nose or mouth. Through this methodology Provine demonstrated that inhalation through the oral airway and the gaping of jaws are necessary for normal yawns. The motor program for yawning will not run to completion without feedback that these parts of the program have been accomplished.',
    "But yawning is a powerful, generalised movement that involves much more than airway manoeuvres and jaw-gaping. When yawning you also stretch your facial muscles, tilt your head back, narrow or close your eyes, produce tears, salivate, open the Eustachian tubes of your middle ear and perform many other, yet unspecified, cardiovascular and respiratory acts. Perhaps the yawn shares components with other behaviour. For example, is the yawn a kind of 'slow sneeze', or is the sneeze a 'fast yawn'? Both share common respiratory and other features including jaw gaping, eye closing and head tilting.",
    "Yawning and stretching share properties and may be performed together as parts of a global motor complex. Studies by J I P de Vries et al. in the early 1980s, charting movement in the developing foetus using ultrasound, observed a link between yawning and stretching. The most extraordinary demonstration of the yawn-stretch linkage occurs in many people paralysed on one side of their body because of brain damage caused by a stroke. The prominent British neurologist Sir Francis Walshe noted in 1923 that when these people yawn, they are startled and mystified to observe that their otherwise paralysed arm rises and flexes automatically in what neurologists term an 'associated response'. Yawning apparently activates undamaged, unconsciously controlled connections between the brain and the motor system, causing the paralysed limb to move. It is not known whether the associated response is a positive prognosis for recovery, nor whether yawning is therapeutic for prevention of muscular deterioration.",
    "Provine speculated that, in general, yawning may have many functions, and selecting a single function from the available options may be an unrealistic goal. Yawning appears to be associated with a change of behavioural state, switching from one activity to another. Yawning is also a reminder that ancient and unconscious behaviour linking us to the animal world lurks beneath the veneer of culture, rationality and language.",
  ].join('\n\n'),
  questions: [
    {
      id: 'yawning-v6-q14',
      number: 14,
      type: 'drag-drop-summary',
      groupTitle: 'Questions 14-19',
      instruction:
        "Complete the summary below using the list of words, A–K. Choose the correct word for each gap and place it in the blank.",
      text: [
        'Provine’s early findings on yawns',
        'Through his observation of yawns, Provine was able to confirm that ______ do not exist.',
        'Just like a ______, yawns cannot be interrupted after they have begun.',
        'This is because yawns occur as a ______ rather than a stimulus response, as was previously thought.',
        'In measuring the time taken to yawn, Provine found that a typical yawn lasts about ______.',
        'He also found that it is common for people to yawn several times in quick succession, with the yawns usually being around ______ apart.',
        'Provine concluded that people who yawn less do not necessarily produce ______ to make up for this.',
      ].join('\n'),
      options: yawningWordBank,
      correctAnswer: ['half-yawns', 'sneeze', 'fixed action pattern', '6 seconds', '68 seconds', 'long yawns'],
      location: "Provine's early discoveries",
    },
    {
      id: 'yawning-v6-q20',
      number: 20,
      type: 'multiple-choice',
      groupTitle: 'Questions 20-24',
      instruction: 'Choose the correct letter, A, B, C or D.',
      text: "What did Provine conclude from his 'closed nose yawn' experiment?",
      options: [
        'Ending a yawn requires use of the nostrils.',
        'You can yawn without breathing through your nose.',
        'Breathing through the nose produces a silent yawn.',
        'The role of the nose in yawning needs further investigation.',
      ],
      correctAnswer: 'B',
      location: 'The closed nose yawn',
    },
    {
      id: 'yawning-v6-q21',
      number: 21,
      type: 'multiple-choice',
      text: "Provine's clenched teeth yawn experiment shows that",
      options: [
        'yawning is unconnected with fatigue.',
        'a yawn is the equivalent of a deep intake of breath.',
        'you have to be able to open your mouth wide to yawn.',
        'breathing with the teeth together is as efficient as through the nose.',
      ],
      correctAnswer: 'C',
      location: 'The clenched teeth yawn',
    },
    {
      id: 'yawning-v6-q22',
      number: 22,
      type: 'multiple-choice',
      text: 'The nose yawn experiment was used to test whether yawning',
      options: [
        'can be stopped after it has started.',
        'is the result of motor programming.',
        'involves both inhalation and exhalation.',
        'can be accomplished only through the nose.',
      ],
      correctAnswer: 'D',
      location: 'The nose yawn',
    },
    {
      id: 'yawning-v6-q23',
      number: 23,
      type: 'multiple-choice',
      text: 'In people paralysed on one side because of brain damage,',
      options: [
        'yawning may involve only one side of the face.',
        'the yawning response indicates that recovery is likely.',
        'movement in a paralysed arm is stimulated by yawning.',
        'yawning can be used as a way to prevent muscle wasting.',
      ],
      correctAnswer: 'C',
      location: 'Yawning and stretching',
    },
    {
      id: 'yawning-v6-q24',
      number: 24,
      type: 'multiple-choice',
      text: 'In the last paragraph, the writer concludes that',
      options: [
        'yawning is a sign of boredom.',
        'we yawn in spite of the development of our species.',
        'yawning is a more passive activity than we imagine.',
        'we are stimulated to yawn when our brain activity is low.',
      ],
      correctAnswer: 'B',
      location: 'Final paragraph',
    },
    {
      id: 'yawning-v6-q25',
      number: 25,
      type: 'yes-no-not-given',
      groupTitle: 'Questions 25-27',
      instruction:
        'Do the following statements agree with the claims of the writer? Write YES if the statement agrees with the views of the writer, NO if the statement contradicts the views of the writer, or NOT GIVEN if it is impossible to say what the writer thinks about this.',
      text: "Research students were initially reluctant to appreciate the value of Provine's studies.",
      correctAnswer: 'YES',
      location: 'Paragraph 2',
    },
    {
      id: 'yawning-v6-q26',
      number: 26,
      type: 'yes-no-not-given',
      text: 'When foetuses yawn and stretch they are learning how to control movement.',
      correctAnswer: 'NOT GIVEN',
      location: 'Yawning and stretching',
    },
    {
      id: 'yawning-v6-q27',
      number: 27,
      type: 'yes-no-not-given',
      text:
        'According to Provine, referring to only one function is probably inadequate to explain why people yawn.',
      correctAnswer: 'YES',
      location: 'Final paragraph',
    },
  ],
}

const passage3: Section = {
  id: 'history-film-p3-v6',
  title: 'Reading Passage 3: A new stage in the study and teaching of history',
  paragraphs: [
    {
      label: '',
      content:
        'For hundreds of years, historians have relied on written or printed documents to provide the bulk of their source materials, and they have largely communicated with students and the wider public by writing books and journal articles. Today, however, the printed word is being superseded by a diversity of forms of communication, above all moving images on video or film.',
    },
    {
      label: 'A',
      content:
        "The development of this new form of communication is leading to a growing gap between the practice of professional historians based in academia, and the practice of those aiming to popularise the study of history among the general public, and to encourage people to create their own records for the future. On the one hand, there are mainstream academics who continue to use only the written word as they examine more and more fields with an ever-increasing number of sophisticated methodologies. On the other hand, film and video, especially as broadcast on television, are probably the major influence on the public's consciousness of history, as they see film of events of fifty or a hundred years ago, events they had previously only read about.",
    },
    {
      label: 'B',
      content:
        'In a related development, a great many people now document local and family events in the form of videos; many schools, too, produce video yearbooks. All these visual records may well prove to be invaluable sources of information for future historians. The glaring contradiction is that the two approaches – the academic and what we might term the popular – have intersected very little: with a few notable exceptions, professional historians have tended to avoid involvement in television programmes about history, and have even less impact on what is being captured and preserved on video. And the potential of moving images has wielded negligible influence on the academic study of history.',
    },
    {
      label: 'C',
      content:
        'This gulf can be seen as resulting from the willingness or otherwise of individual historians to accept the validity of new forms of communication in the study of history. This is not the first time that the question has arisen. The study of history, as conceived of today, began with the transition from oral to literate culture, leading to the earliest written records and the earliest historical studies. The next great shift came with the advent of printing, which transformed everything. Today, as the printed word loses its dominance, historians are faced with a variety of forms of communication, ranging from simple audiotape to the promising complexities of videodiscs linked with computers. As yet, however, the use of moving images to record current events for the benefit of future historians does not even have a commonly agreed name.',
    },
    {
      label: 'D',
      content:
        'This does not mean that mainstream historians have totally rejected the use of moving images as sources: the majority seem intrigued by the idea, and valuable research has been carried out into the history and analysis of films with a broad circulation, using them as a source of information on the social and intellectual history of the twentieth century. Journals such as American History Review have played a significant role in this field.',
    },
    {
      label: 'E',
      content:
        'Yet the number of historians using moving images in their research or teaching is very small. The barrier seems to be that the profession is structured around the medium of the written word, and is somewhat insulated in its academic setting. The use of moving images presents a substantial challenge to this setting and its assumptions. As a result, historians have rejected the training, the institutions, the motivations and the professional structures that would be needed in order to use moving images effectively. Above all, they have rejected the necessity to learn complicated new skills.',
    },
    {
      label: 'F',
      content:
        'So why should historians make this change? Clearly, films or videos of events and people can be used as solid evidence of the past, linked to the words of the narrator (whether a television presenter/historian or a university teacher giving a lecture) but carrying information in their own right. Film has reintroduced the oral form as a mode of research and communication for documenting historical events. Now, with moving images, people are reminded that oral communication is not limited to words: it also includes body language, expression and tone, and is embedded in a context. Little of this is evident in a written transcript. A further effect of video and film is that the narrator gives up some control and has less need to give explanations, while the viewer becomes involved in the process of interpreting and understanding history.',
    },
    {
      label: 'G',
      content:
        'Film or videotape can also aid historians by simplifying the work of the interviewer. Instead of trying to carry on an interview while simultaneously making notes about setting and other unspoken data, this new kind of historian can concentrate on the interview itself, and study the film later. The many benefits of using moving images as historical evidence easily outweigh worries about cost, technical skills, or the effect of a camera on a person telling his or her story. Moving images enhance the quality of historical research, and suggest new directions for historians to explore.',
    },
  ],
  questions: [
    {
      id: 'history-v6-q28',
      number: 28,
      type: 'matching-information',
      groupTitle: 'Questions 28-36',
      instruction:
        'Reading Passage 3 has seven paragraphs, A–G. Which paragraph contains the following information? Write the correct letter, A–G. NB You may use any letter more than once.',
      text: 'an overview of the range of methods that have been used over time to document history',
      options: paragraphOptionsAtoG,
      correctAnswer: 'C',
      location: 'Paragraph C',
    },
    {
      id: 'history-v6-q29',
      number: 29,
      type: 'matching-information',
      text: 'the main reason why many historians are unwilling to use films in their work',
      options: paragraphOptionsAtoG,
      correctAnswer: 'E',
      location: 'Paragraph E',
    },
    {
      id: 'history-v6-q30',
      number: 30,
      type: 'matching-information',
      text: 'a reference to some differences between oral and written communication',
      options: paragraphOptionsAtoG,
      correctAnswer: 'F',
      location: 'Paragraph F',
    },
    {
      id: 'history-v6-q31',
      number: 31,
      type: 'matching-information',
      text: 'how most citizens today gain an understanding of history',
      options: paragraphOptionsAtoG,
      correctAnswer: 'A',
      location: 'Paragraph A',
    },
    {
      id: 'history-v6-q32',
      number: 32,
      type: 'matching-information',
      text: 'how current student events are sometimes captured for future audiences',
      options: paragraphOptionsAtoG,
      correctAnswer: 'B',
      location: 'Paragraph B',
    },
    {
      id: 'history-v6-q33',
      number: 33,
      type: 'matching-information',
      text: 'mention of the fact that the advantages of film are greater than the disadvantages',
      options: paragraphOptionsAtoG,
      correctAnswer: 'G',
      location: 'Paragraph G',
    },
    {
      id: 'history-v6-q34',
      number: 34,
      type: 'matching-information',
      text: 'the claim that there is no official title for film-based historical work',
      options: paragraphOptionsAtoG,
      correctAnswer: 'C',
      location: 'Paragraph C',
    },
    {
      id: 'history-v6-q35',
      number: 35,
      type: 'matching-information',
      text: 'reference to the active role the audience plays when watching films',
      options: paragraphOptionsAtoG,
      correctAnswer: 'F',
      location: 'Paragraph F',
    },
    {
      id: 'history-v6-q36',
      number: 36,
      type: 'matching-information',
      text: 'a list of requirements that historians see as obstacles to their use of film to record history',
      options: paragraphOptionsAtoG,
      correctAnswer: 'E',
      location: 'Paragraph E',
    },
    {
      id: 'history-v6-q37',
      number: 37,
      type: 'yes-no-not-given',
      groupTitle: 'Questions 37-41',
      instruction:
        'Do the following statements agree with the claims of the writer in Reading Passage 3? Write YES if the statement reflects the claims of the writer, NO if the statement contradicts the claims of the writer, or NOT GIVEN if it is impossible to say what the writer thinks about this.',
      text: 'The needs of students in school have led to improvements in the teaching of history.',
      correctAnswer: 'NOT GIVEN',
      location: 'Paragraph A',
    },
    {
      id: 'history-v6-q38',
      number: 38,
      type: 'yes-no-not-given',
      text:
        'Academic and popular historians have different attitudes towards the value of innovations in communication.',
      correctAnswer: 'YES',
      location: 'Paragraph A',
    },
    {
      id: 'history-v6-q39',
      number: 39,
      type: 'yes-no-not-given',
      text: 'It is common for historians to play a major role in creating historical documentaries for television.',
      correctAnswer: 'NO',
      location: 'Paragraph B',
    },
    {
      id: 'history-v6-q40',
      number: 40,
      type: 'yes-no-not-given',
      text: 'Articles in American History Review have explored aspects of modern history through popular films.',
      correctAnswer: 'YES',
      location: 'Paragraph D',
    },
    {
      id: 'history-v6-q41',
      number: 41,
      type: 'yes-no-not-given',
      text: 'Developments in technology are influencing a range of academic subjects.',
      correctAnswer: 'NOT GIVEN',
      location: 'Paragraph C',
    },
  ],
}

export const fullReadingTest6: IELTSTest = {
  id: 'ielts-reading-full-vol6',
  title: 'IELTS Reading Full Test 6 - Australian Parrots, Yawning, A New Stage in History',
  type: 'Academic',
  module: 'Reading',
  duration: 60,
  totalQuestions: 41,
  sections: [passage1, passage2, passage3],
}
