import { verifyAccessToken } from '../utils/jwt.js';
export function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication required.' });
    }
    const token = authHeader.slice(7);
    try {
        const payload = verifyAccessToken(token);
        req.user = {
            id: payload.sub,
            role: payload.role,
        };
        return next();
    }
    catch {
        return res.status(401).json({ message: 'Invalid or expired access token.' });
    }
}
export function requireRole(allowed) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required.' });
        }
        if (!allowed.includes(req.user.role)) {
            return res.status(403).json({ message: 'You do not have permission to access this resource.' });
        }
        return next();
    };
}
