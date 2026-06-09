import type { Question, Section } from '../types/ieltsTypes'

const day24ParagraphOptions = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

const day24Questions: Question[] = [
  // Questions 1-5: Matching Information
  {
    id: 'day24-q1',
    number: 1,
    type: 'matching-information',
    groupTitle: 'Questions 1-5',
    instruction:
      'Which paragraph contains the following information? Write the correct letter, A-G, in boxes 1-5 on your answer sheet. NB You may use any letter more than once.',
    text: 'The part of the brain where amusia may be located',
    options: day24ParagraphOptions,
    correctAnswer: 'D',
    location: 'Paragraph D',
  },
  {
    id: 'day24-q2',
    number: 2,
    type: 'matching-information',
    text: 'The specific pitch differences that amusics cannot detect',
    options: day24ParagraphOptions,
    correctAnswer: 'B',
    location: 'Paragraph B',
  },
  {
    id: 'day24-q3',
    number: 3,
    type: 'matching-information',
    text: 'An explanation of what congenital amusia is',
    options: day24ParagraphOptions,
    correctAnswer: 'A',
    location: 'Paragraph A',
  },
  {
    id: 'day24-q4',
    number: 4,
    type: 'matching-information',
    text: 'Evidence that music and language abilities are separate',
    options: day24ParagraphOptions,
    correctAnswer: 'C',
    location: 'Paragraph C',
  },
  {
    id: 'day24-q5',
    number: 5,
    type: 'matching-information',
    text: 'How amusics perform when singing along with a melody',
    options: day24ParagraphOptions,
    correctAnswer: 'B',
    location: 'Paragraph B',
  },
  // Questions 6-9: Yes/No/Not Given
  {
    id: 'day24-q6',
    number: 6,
    type: 'yes-no-not-given',
    groupTitle: 'Questions 6-9',
    instruction:
      'Do the following statements agree with the claims of the writer in Reading Passage? In boxes 6-9 on your answer sheet, write YES if the statement agrees with the claims of the writer, NO if the statement contradicts the claims of the writer, or NOT GIVEN if it is impossible to say what the writer thinks about this.',
    text: 'People with amusia are always unable to tell the difference between any two musical notes',
    correctAnswer: 'NO',
    location: 'Paragraph B',
  },
  {
    id: 'day24-q7',
    number: 7,
    type: 'yes-no-not-given',
    text: 'Most amusics are unaware of their condition',
    correctAnswer: 'NOT GIVEN',
    location: 'Paragraph A',
  },
  {
    id: 'day24-q8',
    number: 8,
    type: 'yes-no-not-given',
    text: 'Language and music ability appear to be independent of each other',
    correctAnswer: 'YES',
    location: 'Paragraph C',
  },
  {
    id: 'day24-q9',
    number: 9,
    type: 'yes-no-not-given',
    text: 'Amusia is more common in men than in women',
    correctAnswer: 'NOT GIVEN',
    location: 'Paragraph A',
  },
  // Questions 10-14: Matching Information
  {
    id: 'day24-q10',
    number: 10,
    type: 'matching-information',
    groupTitle: 'Questions 10-14',
    instruction:
      'Which paragraph contains the following information? Write the correct letter, A-G, in boxes 10-14 on your answer sheet.',
    text: 'A comparison of amusia to other human traits',
    options: day24ParagraphOptions,
    correctAnswer: 'E',
    location: 'Paragraph E',
  },
  {
    id: 'day24-q11',
    number: 11,
    type: 'matching-information',
    text: 'Evidence that amusics can understand tonal languages',
    options: day24ParagraphOptions,
    correctAnswer: 'C',
    location: 'Paragraph C',
  },
  {
    id: 'day24-q12',
    number: 12,
    type: 'matching-information',
    text: 'A description of how amusics\' brains react differently to tone changes',
    options: day24ParagraphOptions,
    correctAnswer: 'D',
    location: 'Paragraph D',
  },
  {
    id: 'day24-q13',
    number: 13,
    type: 'matching-information',
    text: 'The suggestion that amusia should not be classified as a disability',
    options: day24ParagraphOptions,
    correctAnswer: 'G',
    location: 'Paragraph G',
  },
  {
    id: 'day24-q14',
    number: 14,
    type: 'matching-information',
    text: 'Details about the diatonic scale and amusics\' limitations',
    options: day24ParagraphOptions,
    correctAnswer: 'B',
    location: 'Paragraph B',
  },
]

export const readingDaySectionDay24: Section = {
  id: 'day24-amusia-p1',
  title: 'Day 24 Passage 1: When people are deaf to music',
  paragraphs: [
    {
      label: 'A',
      content: `Music has long been considered a uniquely human concept. In fact, most psychologists agree that music is a universal human instinct. Like any ability, however, there is great variation in people's musical competence. For every brilliant pianist in the world, there are several people we refer to as 'tone deaf'. It is not simply that people with tone deafness (or 'amusia') are unable to sing in tune, they are also unable to discriminate between tones or recognize familiar melodies. Such a 'disorder' can occur after some sort of brain damage, but recently research has been undertaken in an attempt to discover the cause of congenital amusia (when people are born with the condition), which is not associated with any brain damage, hearing problems, or lack of exposure to music.`,
    },
    {
      label: 'B',
      content: `According to the research of Dr. Isabelle Peretz of the University of Montreal, amusia is more complicated than the inability to distinguish pitches. An amusic (a person who has the condition of amusia) can distinguish between two pitches that are far apart, but cannot tell the difference between intervals smaller than a half step on the Western diatonic scale, while most people can easily distinguish differences smaller than that. When listening to melodies which have had a single note altered so that it is out of key with the rest of the melody, amusics do not notice a problem. As would be expected, amusics perform significantly worse at singing and tapping a rhythm along with a melody than do non-amusics.`,
    },
    {
      label: 'C',
      content: `The most fascinating aspect of amusia is how specific to music it is. Because of music's close ties to language, it might be expected that a musical impairment may be caused by a language impairment. Studies suggest, however, that language and music ability are independent of one another. People with brain damage in areas critical to language are often still able to sing, despite being unable to communicate through speech. Moreover, while amusics show deficiencies in their recognition of pitch differences in melodies, they show no such difficulties with tonal languages, such as Chinese, and do not report having any difficulty discriminating between words that differ only in their intonation. The linguistic cues inherent in speech make discrimination of meaning much easier for amusics. Amusics are also successful most of the time at detecting the mood of a melody, can identify a speaker based on his or her voice and can discriminate and identify environmental sounds.`,
    },
    {
      label: 'D',
      content: `Recent work has been focused on locating the part of the brain that is responsible for amusia. The temporal lobes of the brain, the location of the primary auditory cortex, have been considered. It has long been believed that the temporal lobes, especially the right temporal lobe, are most active during musical activity, so any musical disability should logically stem from here as well. Because it has been shown that there is no hearing deficit in amusia, researchers moved on to the temporal neocortex, which is where more sophisticated processing of musical cues was thought to take place. New studies, however, have suggested that the deficits in amusics are located outside the auditory cortex. Brain scans of amusics do not show any reaction at all to differences smaller than a half step. When changes in tones are large, their brains overreact, showing twice as much activity on the right side of the brain as a normal brain hearing the same thing. These differences do not occur in the auditory cortex, indicating again that the deficits of amusia lie mostly not in hearing impairment, but in higher processing of melodies.`,
    },
    {
      label: 'E',
      content: `So what does this all mean? Looking only at the research of Peretz in the field of neuropsychology of music, it would appear that amusia is some sort of disorder. As a student of neurobiology, however, I am skeptical. Certainly the studies by Peretz that have found significant differences between the brains of so-called amusics and normal brains are legitimate. The more important question now becomes one of normality. Every trait from skin color to intelligence to mood exists on a continuum - there is a great deal of variation from one extreme to the other. Just because we recognize that basic musical ability is something that the vast majority of people have, this doesn't mean that the lack of it is abnormal.`,
    },
    {
      label: 'F',
      content: `What makes an amusic worse off than a musical prodigy? Musical ability is culturally valued, and may have been a factor in survival at one point in human history, but it does not seem likely that it is being selected for on an evolutionary scale any longer. Darwin believed that music was adaptive as a way of finding a mate, but who needs to be able to sing to find a partner in an age when it is possible to express your emotions through a song on your iPod?`,
    },
    {
      label: 'G',
      content: `While the idea of amusia is interesting, it seems to be just one end of the continuum of innate musical ability. Comparing this 'disorder' to learning disorders like a specific language impairment seems to be going too far. Before amusia can be declared a disability, further research must be done to determine whether lack of musical ability is actually detrimental in any way. If no disadvantages can be found of having amusia, then it is no more a disability than having poor fashion sense or bad handwriting.`,
    },
  ],
  questions: day24Questions,
}
