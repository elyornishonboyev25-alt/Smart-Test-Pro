import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { requireAuth } from '../middleware/auth.js'
import { validateBody } from '../middleware/validate.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

const createTaskSchema = z.object({
  title: z.string().min(2).max(140),
  description: z
    .string()
    .max(1000)
    .optional()
    .transform((value) => (value?.trim() ? value.trim() : null)),
  scheduledAt: z.string().datetime(),
})

const updateTaskSchema = z.object({
  completed: z.boolean(),
})

router.get(
  '/tasks',
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = req.user!.id
    const tasks = await prisma.userTask.findMany({
      where: { userId },
      orderBy: [{ scheduledAt: 'asc' }, { createdAt: 'asc' }],
    })

    return res.json({ tasks })
  }),
)

router.post(
  '/tasks',
  requireAuth,
  validateBody(createTaskSchema),
  asyncHandler(async (req, res) => {
    const payload = req.body as z.infer<typeof createTaskSchema>
    const userId = req.user!.id
    const scheduledAt = new Date(payload.scheduledAt)

    if (Number.isNaN(scheduledAt.getTime())) {
      return res.status(400).json({ message: 'Invalid scheduledAt value.' })
    }

    const task = await prisma.userTask.create({
      data: {
        userId,
        title: payload.title.trim(),
        description: payload.description ?? null,
        scheduledAt,
      },
    })

    return res.status(201).json({ task })
  }),
)

router.patch(
  '/tasks/:taskId',
  requireAuth,
  validateBody(updateTaskSchema),
  asyncHandler(async (req, res) => {
    const userId = req.user!.id
    const { taskId } = req.params
    const payload = req.body as z.infer<typeof updateTaskSchema>

    const existing = await prisma.userTask.findFirst({
      where: {
        id: taskId,
        userId,
      },
      select: { id: true },
    })

    if (!existing) {
      return res.status(404).json({ message: 'Task not found.' })
    }

    const task = await prisma.userTask.update({
      where: { id: taskId },
      data: {
        completed: payload.completed,
      },
    })

    return res.json({ task })
  }),
)

export default router
