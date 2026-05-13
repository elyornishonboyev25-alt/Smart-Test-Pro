import { prisma } from './prisma.js'

const REQUIRED_AI_MODELS = [
  'user',
  'testAttempt',
  'userAiPreference',
  'aiMemory',
  'vocabularyNotebook',
  'vocabularyNotebookItem',
  'speakingEvaluation',
] as const

const REQUIRED_AI_MIGRATION = '20260306110000_add_ai_study_brain'

type RuntimeReadiness = {
  ok: boolean
  checkedAt: string
  reasons: string[]
}

const readiness: RuntimeReadiness = {
  ok: true,
  checkedAt: new Date(0).toISOString(),
  reasons: [],
}

export function getAiRuntimeReadiness() {
  return readiness
}

function setReadiness(next: RuntimeReadiness) {
  readiness.ok = next.ok
  readiness.checkedAt = next.checkedAt
  readiness.reasons = [...next.reasons]
}

export async function runStartupHealthChecks() {
  const reasons: string[] = []
  const prismaRuntime = prisma as unknown as Record<string, unknown>

  for (const modelName of REQUIRED_AI_MODELS) {
    const delegate = prismaRuntime[modelName] as Record<string, unknown> | undefined
    if (!delegate || typeof delegate !== 'object') {
      reasons.push(`Prisma delegate is missing: prisma.${modelName}`)
      continue
    }
    const hasFindUnique =
      typeof delegate.findUnique === 'function' ||
      typeof delegate.findMany === 'function' ||
      typeof delegate.upsert === 'function'
    if (!hasFindUnique) {
      reasons.push(`Prisma delegate is not callable: prisma.${modelName}`)
    }
  }

  try {
    const rows = await prisma.$queryRawUnsafe<Array<{ migration_name: string }>>(
      'SELECT migration_name FROM "_prisma_migrations" WHERE migration_name = $1',
      REQUIRED_AI_MIGRATION,
    )
    if (!Array.isArray(rows) || rows.length === 0) {
      reasons.push(`Required migration is not applied: ${REQUIRED_AI_MIGRATION}`)
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown migration status error'
    reasons.push(`Migration readiness check failed: ${message}`)
  }

  const next: RuntimeReadiness = {
    ok: reasons.length === 0,
    checkedAt: new Date().toISOString(),
    reasons,
  }
  setReadiness(next)

  if (!next.ok) {
    console.error('[startup-health] AI runtime is NOT ready:')
    for (const reason of reasons) {
      console.error(`[startup-health] - ${reason}`)
    }
    return next
  }

  console.log('[startup-health] AI runtime is ready.')
  return next
}

