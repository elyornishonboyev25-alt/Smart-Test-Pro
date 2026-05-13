import { resolveLevelFromXp } from '../config/levelConfig.js';
import { isSameUtcDay, startOfUtcDay } from '../utils/date.js';
const DIFFICULTY_XP_WEIGHT = {
    EASY: 0.9,
    MEDIUM: 1,
    HARD: 1.15,
    OLYMPIAD: 1.3,
};
export function computeStreak(input) {
    const today = startOfUtcDay(input.now);
    if (!input.lastActiveDate) {
        return {
            currentStreak: 1,
            longestStreak: Math.max(1, input.longestStreak),
            lastActiveDate: today,
        };
    }
    const lastDate = startOfUtcDay(input.lastActiveDate);
    if (isSameUtcDay(lastDate, today)) {
        return {
            currentStreak: input.currentStreak,
            longestStreak: input.longestStreak,
            lastActiveDate: lastDate,
        };
    }
    const dayDiff = Math.round((today.getTime() - lastDate.getTime()) / (24 * 60 * 60 * 1000));
    const currentStreak = dayDiff === 1 ? input.currentStreak + 1 : 1;
    const longestStreak = Math.max(input.longestStreak, currentStreak);
    return {
        currentStreak,
        longestStreak,
        lastActiveDate: today,
    };
}
export function calculateXp(input) {
    const performanceMultiplier = 0.55 + Math.max(0, Math.min(100, input.performancePercent)) / 100;
    const timeMultiplier = 1 + Math.min(0.2, input.timeBonus / 25);
    const streakMultiplier = 1 + Math.min(0.35, Math.max(0, input.streak - 1) * 0.03);
    const difficultyMultiplier = DIFFICULTY_XP_WEIGHT[input.difficulty];
    const xp = input.baseXp * performanceMultiplier * timeMultiplier * streakMultiplier * difficultyMultiplier;
    return Math.max(20, Math.round(xp));
}
export function resolveLevelTransition(currentXp, gainedXp) {
    const levelBefore = resolveLevelFromXp(currentXp);
    const nextXp = currentXp + gainedXp;
    const levelAfter = resolveLevelFromXp(nextXp);
    return {
        nextXp,
        levelBefore,
        levelAfter,
        leveledUp: levelAfter > levelBefore,
    };
}
