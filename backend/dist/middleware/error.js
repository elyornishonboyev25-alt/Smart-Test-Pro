import { ZodError } from 'zod';
export function notFoundHandler(req, res) {
    res.status(404).json({ message: `Route not found: ${req.method} ${req.path}` });
}
export function errorHandler(error, _req, res, _next) {
    if (error instanceof ZodError) {
        return res.status(400).json({
            message: 'Validation failed.',
            errors: error.flatten(),
        });
    }
    if (error instanceof Error) {
        return res.status(500).json({
            message: error.message,
        });
    }
    return res.status(500).json({ message: 'Unexpected server error.' });
}
