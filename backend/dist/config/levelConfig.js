export const LEVEL_THRESHOLDS = [
    0,
    100,
    250,
    450,
    700,
    1000,
    1400,
    1900,
    2500,
    3200,
    4000,
    5000,
    6200,
    7600,
    9200,
    11000,
    13000,
    15200,
    17600,
    20200,
];
export function resolveLevelFromXp(xp) {
    let resolved = 1;
    for (let level = 1; level <= LEVEL_THRESHOLDS.length; level += 1) {
        if (xp >= (LEVEL_THRESHOLDS[level - 1] ?? 0)) {
            resolved = level;
        }
    }
    return resolved;
}
export function getLevelProgress(xp, level) {
    const currentLevelThreshold = LEVEL_THRESHOLDS[level - 1] ?? 0;
    const nextLevelThreshold = LEVEL_THRESHOLDS[level] ?? currentLevelThreshold + 3000;
    const xpIntoCurrent = Math.max(0, xp - currentLevelThreshold);
    const levelSpan = Math.max(1, nextLevelThreshold - currentLevelThreshold);
    const progressPercent = Math.min(100, (xpIntoCurrent / levelSpan) * 100);
    return {
        currentLevelThreshold,
        nextLevelThreshold,
        xpIntoCurrent,
        levelSpan,
        progressPercent,
    };
}
