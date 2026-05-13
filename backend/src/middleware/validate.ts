import type { Request, Response, NextFunction } from 'express'
import type { AnyZodObject, ZodTypeAny } from 'zod'

export function validateBody(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({
        message: 'Invalid request body.',
        errors: parsed.error.flatten(),
      })
    }

    req.body = parsed.data
    return next()
  }
}

export function validateQuery(schema: AnyZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.query)
    if (!parsed.success) {
      return res.status(400).json({
        message: 'Invalid query parameters.',
        errors: parsed.error.flatten(),
      })
    }

    req.query = parsed.data
    return next()
  }
}
