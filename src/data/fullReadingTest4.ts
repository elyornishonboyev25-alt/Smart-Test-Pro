import type { IELTSTest, Question, Section } from '../types/ieltsTypes'
import { fullReadingTest6 } from './fullReadingTest6'

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

function mapSectionId(sectionId: string): string {
  if (sectionId.endsWith('-v6')) {
    return sectionId.replace('-v6', '-v4')
  }
  return `${sectionId}-v4`
}

function mapQuestionId(questionId: string): string {
  if (questionId.includes('-v6-')) {
    return questionId.replace('-v6-', '-v4-')
  }
  if (questionId.endsWith('-v6')) {
    return questionId.replace('-v6', '-v4')
  }
  return `${questionId}-v4`
}

export const fullReadingTest4: IELTSTest = {
  ...fullReadingTest6,
  id: 'ielts-reading-full-vol4',
  title: "IELTS Reading Full Test 4 - Georgia O'Keeffe, Climate Change Adaptation, Guard Dogs",
  sections: fullReadingTest6.sections.map((section) => {
    const cloned = cloneSection(section)
    return {
      ...cloned,
      id: mapSectionId(cloned.id),
      questions: cloned.questions.map((question) => ({
        ...question,
        id: mapQuestionId(question.id),
      })),
    }
  }),
}

