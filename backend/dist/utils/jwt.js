import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
export function signAccessToken(payload) {
    return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
        expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
    });
}
export function verifyAccessToken(token) {
    return jwt.verify(token, env.ACCESS_TOKEN_SECRET);
}
export function signRefreshToken(payload) {
    return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
        expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
    });
}
export function verifyRefreshToken(token) {
    return jwt.verify(token, env.REFRESH_TOKEN_SECRET);
}
export function hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
}
export function generateTokenId() {
    return crypto.randomUUID();
}
export function durationToMs(duration) {
    const match = duration.trim().match(/^(\d+)([smhd])$/i);
    if (!match) {
        return 15 * 60 * 1000;
    }
    const value = Number(match[1]);
    const unit = match[2].toLowerCase();
    if (unit === 's')
        return value * 1000;
    if (unit === 'm')
        return value * 60 * 1000;
    if (unit === 'h')
        return value * 60 * 60 * 1000;
    return value * 24 * 60 * 60 * 1000;
}
export function getTokenExpiryDate(duration) {
    return new Date(Date.now() + durationToMs(duration));
}
