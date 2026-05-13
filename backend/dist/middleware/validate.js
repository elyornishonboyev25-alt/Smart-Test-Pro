export function validateBody(schema) {
    return (req, res, next) => {
        const parsed = schema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                message: 'Invalid request body.',
                errors: parsed.error.flatten(),
            });
        }
        req.body = parsed.data;
        return next();
    };
}
export function validateQuery(schema) {
    return (req, res, next) => {
        const parsed = schema.safeParse(req.query);
        if (!parsed.success) {
            return res.status(400).json({
                message: 'Invalid query parameters.',
                errors: parsed.error.flatten(),
            });
        }
        req.query = parsed.data;
        return next();
    };
}
