import type { Section } from '../types/ieltsTypes'
import { readingMockDay10Sections } from './readingMockDay10'

/**
 * Full 3-passage mock tests for the reading track's milestone days (10, 20, 30).
 * Each value is an array of three Sections (40 questions total). Days without an
 * entry here fall back to the regular single-passage day behaviour.
 */
export const readingMockDaySections: Record<number, Section[]> = {
  10: readingMockDay10Sections,
}
