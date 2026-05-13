import type { IELTSTest, Question, Section } from '../types/ieltsTypes'
import { fullReadingTest } from './fullReadingTest'

const paragraphOptionsAtoG = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

const climatePeopleOptions = [
  'A. Yanira Pineda',
  'B. Susanna Tol',
  'C. Elizabeth English',
  'D. Raisa Chowdhury',
  'E. Greg Spotts',
]

const guardDogPeopleOptions = [
  'A. Dan Macon',
  'B. Silvia Ribeiro',
  'C. Linda van Bommel',
  'D. Julie Young',
  'E. Bethany Smith',
]

function cloneQuestion(question: Question): Question {
  return {
    ...question,
    options: question.options ? [...question.options] : undefined,
    correctAnswer: Array.isArray(question.correctAnswer)
      ? [...question.correctAnswer]
      : question.correctAnswer,
  }
}

function cloneSection(section: Section): Section {
  return {
    ...section,
    paragraphs: section.paragraphs ? section.paragraphs.map((paragraph) => ({ ...paragraph })) : undefined,
    questions: section.questions.map(cloneQuestion),
  }
}

const georgiaBase = cloneSection(fullReadingTest.sections[0])
const passage1: Section = {
  ...georgiaBase,
  id: 'georgia-okeeffe-p1-v6',
  title: "Reading Passage 1: Georgia O'Keeffe",
  questions: georgiaBase.questions.map((question) => ({
    ...cloneQuestion(question),
    id: `gok-v6-q${question.number}`,
  })),
}

const climateBase = cloneSection(fullReadingTest.sections[1])
const climateLeadingQuestions = climateBase.questions
  .filter((question) => question.number <= 22)
  .map((question) => ({
    ...cloneQuestion(question),
    id: `cca-v6-q${question.number}`,
  }))

const climatePeopleQuestions: Question[] = [
  {
    id: 'cca-v6-q23',
    number: 23,
    type: 'matching-information',
    groupTitle: 'Questions 23-26',
    instruction:
      'Look at the following statements and the list of people below. Match each statement with the correct person.',
    text: 'It is essential to adopt strategies which involve and help residents of the region.',
    options: climatePeopleOptions,
    correctAnswer: 'B',
    location: 'Paragraph C',
  },
  {
    id: 'cca-v6-q24',
    number: 24,
    type: 'matching-information',
    text: 'Interventions which reduce heat are absolutely vital for our survival in this location.',
    options: climatePeopleOptions,
    correctAnswer: 'E',
    location: 'Paragraph F',
  },
  {
    id: 'cca-v6-q25',
    number: 25,
    type: 'matching-information',
    text: 'More work will need to be done in future decades to deal with the impact of rising water levels.',
    options: climatePeopleOptions,
    correctAnswer: 'A',
    location: 'Paragraph B',
  },
  {
    id: 'cca-v6-q26',
    number: 26,
    type: 'matching-information',
    text: 'The number of locations requiring action to adapt to flooding has grown in recent years.',
    options: climatePeopleOptions,
    correctAnswer: 'C',
    location: 'Paragraph D',
  },
]

const passage2: Section = {
  ...climateBase,
  id: 'climate-adaptation-p2-v6',
  title: 'Reading Passage 2: Adapting to the effects of climate change',
  questions: [...climateLeadingQuestions, ...climatePeopleQuestions],
}

const passage3: Section = {
  id: 'guard-dogs-p3-v6',
  title: 'Reading Passage 3: A new role for livestock guard dogs',
  paragraphs: [
    {
      label: 'A',
      content:
        'For thousands of years, livestock guard dogs worked alongside shepherds to protect their sheep, goats and cattle from predators such as wolves and bears. But in the 19th and 20th centuries, when such predators were largely exterminated, most guard dogs lost their jobs. In recent years, however, as increased efforts have been made to protect wild animals, predators have become more widespread again. As a result, farmers once more need to protect their livestock, and guard dogs are enjoying an unexpected revival.',
    },
    {
      label: 'B',
      content:
        "Today there are around 50 breeds of guard dogs on duty in various parts of the world. These dogs are raised from an early age with the animals they will be watching and eventually these animals become the dog's family. The dogs will place themselves between the livestock and any threat, barking loudly. If necessary, they will chase away predators, but often their mere presence is sufficient. 'Their initial training is to make them understand that livestock is going to be their life,' says Dan Macon, a shepherd with three guard dogs. 'A fluffy white puppy is fun to be around, but too much human affection makes it a great dog for guarding the front porch, rather than a great livestock guard dog.'",
    },
    {
      label: 'C',
      content:
        "The evidence indicates that guard dogs are highly effective. For example, in Portugal, biologist Silvia Ribeiro has found that more than 90 per cent of the farmers participating in a programme to train and use guard dogs to protect their herds against attack from wolves rate the performance of the dogs as very good or excellent. In a study carried out in Australia by Linda van Bommel and Chris Johnson at the University of Tasmania, more than 65 per cent of herders reported that predation stopped completely after they got the dogs, and almost all the rest saw a decrease in attacks. 'If they are managed and used properly, livestock guard dogs are the most efficient control method that we have in terms of the amount of livestock that they save from predation,' says van Bommel.",
    },
    {
      label: 'D',
      content:
        "But today's guard dogs also have a new role - to help preserve the predators. It is hoped that reductions in livestock losses can make farmers more tolerant of predators and less likely to kill them. In Namibia, more than 90 per cent of cheetahs live outside protected areas, close to humans raising livestock. As a result, the cheetahs are often held responsible for animal losses, and large numbers have been killed by farmers. When guard dogs were introduced, more than 90 per cent of farmers reported a dramatic reduction in livestock losses, and said that as a result they were less likely to kill predators. Julie Young, at Utah State University in the US, believes this result applies widely. 'There is common ground from the livestock perspective and from the conservation perspective,' she says. 'If ranchers don't have a dead cow, they will not make a call to apply for a permit to kill a wolf.'",
    },
    {
      label: 'E',
      content:
        "Looking at all the published evidence, Bethany Smith at Nottingham Trent University in the UK found that up to 88 per cent of farmers said they no longer killed predators after using dogs - but warned that such self-reported results must be taken with a pinch of salt. What's more, it is possible that livestock guard dogs merely displace predators to unprotected neighbouring properties, where their fate isn't recorded. 'In some regions, we work with almost every farmer, but in others only one or two have dogs,' says Ribeiro. 'If we are not working with everybody, we are transferring the wolf pressure to the neighbour's herd and he can use poison and kill an entire pack of wolves.'",
    },
    {
      label: 'F',
      content:
        "Another concern is whether there may be unintended ecological effects of using guard dogs. Studies suggest that reducing deaths of one type of predator may have a negative impact on other species. The extent of this problem isn't known, but the consequences are clear in Namibia. Cheetahs aren't the only species that cause sheep and goat losses there: other predators also attack livestock. In 2015, researchers reported that in spite of the impact farmers obtaining guard dogs had on cheetahs, the number of jackals killed by dogs and people actually increased. Guard dogs have other ecological impacts too. They have been found to spread diseases to wild animals, including endangered Ethiopian wolves. They may also compete with other carnivores for food. And by creating a 'landscape of fear', their mere presence can influence the behaviour of prey animals.",
    },
    {
      label: 'G',
      content:
        "The evidence so far, however, indicates that these consequences aren't always negative. Guard dogs can deliver unexpected benefits by protecting vulnerable wildlife from predators. For example, their presence has been found to protect birds which build their nests on the ground in fields, where foxes would normally raid them. Indeed, Australian researchers are now using dogs to enhance biodiversity and create refuges for species threatened by predation. So if we can get this right, there may be a bright future for guard dogs in promoting harmonious coexistence between humans and wildlife.",
    },
  ],
  questions: [
    {
      id: 'guard-v6-q27',
      number: 27,
      type: 'matching-information',
      groupTitle: 'Questions 27-31',
      instruction:
        'Reading Passage 3 has seven paragraphs. Which paragraph contains the following information?',
      text: 'an example of how one predator has been protected by the introduction of livestock guard dogs',
      options: paragraphOptionsAtoG,
      correctAnswer: 'D',
      location: 'Paragraph D',
    },
    {
      id: 'guard-v6-q28',
      number: 28,
      type: 'matching-information',
      text:
        'an optimistic suggestion about the possible positive developments in the use of livestock guard dogs',
      options: paragraphOptionsAtoG,
      correctAnswer: 'G',
      location: 'Paragraph G',
    },
    {
      id: 'guard-v6-q29',
      number: 29,
      type: 'matching-information',
      text: 'a description of how the methods used by livestock guard dogs help to keep predators away',
      options: paragraphOptionsAtoG,
      correctAnswer: 'B',
      location: 'Paragraph B',
    },
    {
      id: 'guard-v6-q30',
      number: 30,
      type: 'matching-information',
      text:
        "claims by different academics that the use of livestock guard dogs is a successful way of protecting farmers' herds",
      options: paragraphOptionsAtoG,
      correctAnswer: 'C',
      location: 'Paragraph C',
    },
    {
      id: 'guard-v6-q31',
      number: 31,
      type: 'matching-information',
      text: 'a reference to how livestock guard dogs gain their skills',
      options: paragraphOptionsAtoG,
      correctAnswer: 'B',
      location: 'Paragraph B',
    },
    {
      id: 'guard-v6-q32',
      number: 32,
      type: 'matching-information',
      groupTitle: 'Questions 32-36',
      instruction:
        'Look at the following statements and the list of people below. Match each statement with the correct person.',
      text: 'The use of guard dogs may save the lives of both livestock and wild animals.',
      options: guardDogPeopleOptions,
      correctAnswer: 'D',
      location: 'Paragraph D',
    },
    {
      id: 'guard-v6-q33',
      number: 33,
      type: 'matching-information',
      text: 'Claims of a change in behaviour from those using livestock guard dogs may not be totally accurate.',
      options: guardDogPeopleOptions,
      correctAnswer: 'E',
      location: 'Paragraph E',
    },
    {
      id: 'guard-v6-q34',
      number: 34,
      type: 'matching-information',
      text: 'There may be negative results if the use of livestock guard dogs is not sufficiently widespread.',
      options: guardDogPeopleOptions,
      correctAnswer: 'B',
      location: 'Paragraph E',
    },
    {
      id: 'guard-v6-q35',
      number: 35,
      type: 'matching-information',
      text:
        'Livestock guard dogs are the best way of protecting farm animals, as long as the dogs are appropriately handled.',
      options: guardDogPeopleOptions,
      correctAnswer: 'C',
      location: 'Paragraph C',
    },
    {
      id: 'guard-v6-q36',
      number: 36,
      type: 'matching-information',
      text:
        'Teaching a livestock guard dog how to do its work needs a different focus from teaching a house guard dog.',
      options: guardDogPeopleOptions,
      correctAnswer: 'A',
      location: 'Paragraph B',
    },
    {
      id: 'guard-v6-q37',
      number: 37,
      type: 'summary-completion',
      groupTitle: 'Questions 37-40',
      instruction:
        'Complete the summary below. Choose ONE WORD ONLY from the passage for each answer.',
      text:
        'In Namibia, livestock guard dogs have been used to protect domestic animals from attacks by cheetahs. This has led to a rise in the deaths of other predators, particularly ______.',
      correctAnswer: 'jackals',
      location: 'Paragraph F',
    },
    {
      id: 'guard-v6-q38',
      number: 38,
      type: 'summary-completion',
      text: 'In addition, it has been suggested that dogs could spread ______ which may affect other species.',
      correctAnswer: 'diseases',
      location: 'Paragraph F',
    },
    {
      id: 'guard-v6-q39',
      number: 39,
      type: 'summary-completion',
      text: 'Guard dogs may also reduce the amount of ______ available to certain wild animals.',
      correctAnswer: 'food',
      location: 'Paragraph F',
    },
    {
      id: 'guard-v6-q40',
      number: 40,
      type: 'summary-completion',
      text:
        'Ground-nesting birds might otherwise be threatened by predators such as ______.',
      correctAnswer: 'foxes',
      location: 'Paragraph G',
    },
  ],
}

export const fullReadingTest6: IELTSTest = {
  id: 'ielts-reading-full-vol6',
  title: "IELTS Reading Full Test 6 - Georgia O'Keeffe, Climate Change Adaptation, Guard Dogs",
  type: 'Academic',
  module: 'Reading',
  duration: 60,
  totalQuestions: 40,
  sections: [passage1, passage2, passage3],
}
