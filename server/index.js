const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const PORT = Number(process.env.PORT || 5001);
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'local-dev-access-secret-123456789';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'local-dev-refresh-secret-123456789';
const ACCESS_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m';
const REFRESH_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

const DB_FILE = path.join(__dirname, 'local-db.json');

const LEVEL_THRESHOLDS = [
  0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200,
  4000, 5000, 6200, 7600, 9200, 11000, 13000,
];

const BASE_XP_BY_DIFFICULTY = {
  EASY: 45,
  MEDIUM: 75,
  HARD: 110,
  OLYMPIAD: 150,
};

const ACHIEVEMENTS = [
  { id: 'achv_first_attempt', slug: 'first_attempt', title: 'First Milestone', description: 'Complete your first test attempt.', xpReward: 50, type: 'attempt_count', min: 1 },
  { id: 'achv_precision_90', slug: 'precision_90', title: 'Precision 90+', description: 'Score 90% or above.', xpReward: 120, type: 'best_score', min: 90 },
  { id: 'achv_streak_7', slug: 'streak_7', title: '7-Day Discipline', description: 'Maintain a 7-day streak.', xpReward: 200, type: 'streak', min: 7 },
  { id: 'achv_xp_1000', slug: 'xp_1000', title: 'XP Builder', description: 'Reach 1000 XP.', xpReward: 250, type: 'xp', min: 1000 },
];

function createOption(text, isCorrect, order) {
  return { id: crypto.randomUUID(), text, isCorrect, order };
}

function createQuestion(text, explanation, weight, options, order) {
  return {
    id: crypto.randomUUID(),
    text,
    explanation,
    weight,
    order,
    options,
  };
}

function seedTests() {
  return [
    {
      id: crypto.randomUUID(),
      slug: 'sat-reading-01',
      title: 'SAT Reading Precision 01',
      description: 'Inference, evidence and vocabulary in context.',
      category: 'SAT',
      difficulty: 'MEDIUM',
      durationSec: 2700,
      premium: false,
      xpReward: 95,
      subjects: ['Reading', 'Critical Thinking'],
      published: true,
      createdAt: new Date().toISOString(),
      questions: [
        createQuestion('The author includes paragraph 3 mainly to:', 'It provides historical support.', 1.2, [
          createOption('refute surveys', false, 1),
          createOption('provide historical context', true, 2),
          createOption('introduce opponent', false, 3),
          createOption('summarize conclusion', false, 4),
        ], 1),
        createQuestion('The phrase "structural constraint" most nearly means:', 'Context implies a system limitation.', 1, [
          createOption('temporary challenge', false, 1),
          createOption('design limitation', true, 2),
          createOption('financial risk', false, 3),
          createOption('random chance', false, 4),
        ], 2),
        createQuestion('Which evidence best supports the previous answer?', 'Lines about architecture limits.', 1.1, [
          createOption('Lines 4-6', false, 1),
          createOption('Lines 19-21', true, 2),
          createOption('Lines 33-35', false, 3),
          createOption('Lines 47-48', false, 4),
        ], 3),
      ],
    },
    {
      id: crypto.randomUUID(),
      slug: 'ielts-reading-01',
      title: 'IELTS Academic Reading 01',
      description: 'Band-focused academic passage evaluation.',
      category: 'IELTS',
      difficulty: 'HARD',
      durationSec: 3600,
      premium: true,
      xpReward: 120,
      subjects: ['Reading', 'Vocabulary'],
      published: true,
      createdAt: new Date().toISOString(),
      questions: [
        createQuestion('Writer attitude is best described as:', 'Balanced, but critical.', 1.1, [
          createOption('fully supportive', false, 1),
          createOption('balanced but critical', true, 2),
          createOption('indifferent', false, 3),
          createOption('dismissive', false, 4),
        ], 1),
        createQuestion('Primary adoption driver in year two:', 'Productivity gain drove adoption.', 1, [
          createOption('regulatory pressure', false, 1),
          createOption('messaging campaign', false, 2),
          createOption('efficiency improvement', true, 3),
          createOption('seasonal demand', false, 4),
        ], 2),
      ],
    },
    {
      id: crypto.randomUUID(),
      slug: 'olympiad-algebra-01',
      title: 'Olympiad Algebra Challenge 01',
      description: 'Competition-level algebra and number theory.',
      category: 'OLYMPIAD',
      difficulty: 'OLYMPIAD',
      durationSec: 5400,
      premium: true,
      xpReward: 180,
      subjects: ['Algebra', 'Number Theory'],
      published: true,
      createdAt: new Date().toISOString(),
      questions: [
        createQuestion('If abc=1, which is always true?', 'AM-GM gives a+b+c >= 3.', 1.4, [
          createOption('a+b+c<2', false, 1),
          createOption('a+b+c>=3', true, 2),
          createOption('ab+bc+ca<=1', false, 3),
          createOption('a^2+b^2+c^2<=1', false, 4),
        ], 1),
        createQuestion('n^2+n is divisible by:', 'n(n+1) always even.', 1, [
          createOption('2', true, 1),
          createOption('3', false, 2),
          createOption('5', false, 3),
          createOption('7', false, 4),
        ], 2),
      ],
    },
    {
      id: crypto.randomUUID(),
      slug: 'school-math-01',
      title: 'School Mathematics Foundation 01',
      description: 'Core arithmetic and algebra assessment.',
      category: 'SCHOOL',
      difficulty: 'EASY',
      durationSec: 1800,
      premium: false,
      xpReward: 60,
      subjects: ['Mathematics', 'Reasoning'],
      published: true,
      createdAt: new Date().toISOString(),
      questions: [
        createQuestion('Solve 3x+5=20', 'Subtract then divide.', 1, [
          createOption('x=4', false, 1),
          createOption('x=5', true, 2),
          createOption('x=6', false, 3),
          createOption('x=7', false, 4),
        ], 1),
        createQuestion('25% of 200 is:', 'A quarter of 200.', 1, [
          createOption('40', false, 1),
          createOption('45', false, 2),
          createOption('50', true, 3),
          createOption('60', false, 4),
        ], 2),
      ],
    },
  ];
}

function defaultDb() {
  return {
    users: [],
    refreshTokens: [],
    tests: seedTests(),
    attempts: [],
    dailyActivity: [],
    userAchievements: [],
    notifications: [],
    leaderboardStates: [],
    achievements: ACHIEVEMENTS,
  };
}

function loadDb() {
  if (!fs.existsSync(DB_FILE)) {
    const db = defaultDb();
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
    return db;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.tests) || parsed.tests.length === 0) {
      parsed.tests = seedTests();
    }
    if (!Array.isArray(parsed.achievements) || parsed.achievements.length === 0) {
      parsed.achievements = ACHIEVEMENTS;
    }
    return parsed;
  } catch {
    const db = defaultDb();
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
    return db;
  }
}

let db = loadDb();

function saveDb() {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function safeUser(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    xp: user.xp,
    level: user.level,
    currentStreak: user.currentStreak,
  };
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const check = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(check, 'hex'));
}

function parseDurationMs(duration) {
  const match = String(duration).trim().match(/^(\d+)([smhd])$/i);
  if (!match) return 15 * 60 * 1000;
  const value = Number(match[1]);
  const unit = match[2].toLowerCase();
  if (unit === 's') return value * 1000;
  if (unit === 'm') return value * 60 * 1000;
  if (unit === 'h') return value * 60 * 60 * 1000;
  return value * 24 * 60 * 60 * 1000;
}

function signAccessToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
}

function signRefreshToken(user, tokenId) {
  return jwt.sign({ sub: user.id, tokenId }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
}

function resolveLevelFromXp(xp) {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i += 1) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1;
  }
  return level;
}

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function streakUpdate(user) {
  const today = startOfDay(new Date());
  if (!user.lastActiveDate) {
    return { currentStreak: 1, longestStreak: Math.max(1, user.longestStreak || 0), lastActiveDate: today.toISOString() };
  }

  const last = startOfDay(new Date(user.lastActiveDate));
  const diffDays = Math.round((today.getTime() - last.getTime()) / (24 * 60 * 60 * 1000));

  if (diffDays === 0) {
    return { currentStreak: user.currentStreak || 0, longestStreak: user.longestStreak || 0, lastActiveDate: user.lastActiveDate };
  }

  const currentStreak = diffDays === 1 ? (user.currentStreak || 0) + 1 : 1;
  const longestStreak = Math.max(user.longestStreak || 0, currentStreak);
  return { currentStreak, longestStreak, lastActiveDate: today.toISOString() };
}

function calculateXp(baseXp, difficulty, performancePercent, timeBonus, streak) {
  const difficultyWeight = { EASY: 0.9, MEDIUM: 1, HARD: 1.15, OLYMPIAD: 1.3 }[difficulty] || 1;
  const performanceMultiplier = 0.55 + Math.max(0, Math.min(100, performancePercent)) / 100;
  const timeMultiplier = 1 + Math.min(0.2, timeBonus / 25);
  const streakMultiplier = 1 + Math.min(0.35, Math.max(0, streak - 1) * 0.03);
  const xp = baseXp * difficultyWeight * performanceMultiplier * timeMultiplier * streakMultiplier;
  return Math.max(20, Math.round(xp));
}

function getPeriodStart(period) {
  const now = startOfDay(new Date());
  if (period === 'today') return now;
  if (period === 'week') {
    const d = new Date(now);
    d.setDate(d.getDate() - 6);
    return d;
  }
  if (period === 'month') {
    const d = new Date(now);
    d.setDate(d.getDate() - 29);
    return d;
  }
  return null;
}

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET);
    const user = db.users.find((u) => u.id === payload.sub);
    if (!user) return res.status(401).json({ message: 'Invalid token.' });
    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'ok', service: 'smart-test-pro-local-api', timestamp: new Date().toISOString() });
});

app.post('/api/v1/auth/register', (req, res) => {
  const { fullName, email, password } = req.body || {};

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'fullName, email, and password are required.' });
  }

  if (String(password).length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters.' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  if (db.users.some((user) => user.email === normalizedEmail)) {
    return res.status(409).json({ message: 'User with this email already exists.' });
  }

  const now = new Date().toISOString();
  const user = {
    id: crypto.randomUUID(),
    fullName: String(fullName).trim(),
    email: normalizedEmail,
    role: 'USER',
    passwordHash: hashPassword(String(password)),
    xp: 0,
    level: 1,
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: null,
    createdAt: now,
  };

  db.users.push(user);

  const tokenId = crypto.randomUUID();
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user, tokenId);

  db.refreshTokens.push({
    id: crypto.randomUUID(),
    tokenHash: crypto.createHash('sha256').update(refreshToken).digest('hex'),
    userId: user.id,
    expiresAt: new Date(Date.now() + parseDurationMs(REFRESH_EXPIRES_IN)).toISOString(),
    revokedAt: null,
  });

  saveDb();

  return res.status(201).json({
    user: safeUser(user),
    accessToken,
    refreshToken,
  });
});

app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const user = db.users.find((u) => u.email === normalizedEmail);

  if (!user || !verifyPassword(String(password || ''), user.passwordHash)) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const tokenId = crypto.randomUUID();
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user, tokenId);

  db.refreshTokens.push({
    id: crypto.randomUUID(),
    tokenHash: crypto.createHash('sha256').update(refreshToken).digest('hex'),
    userId: user.id,
    expiresAt: new Date(Date.now() + parseDurationMs(REFRESH_EXPIRES_IN)).toISOString(),
    revokedAt: null,
  });

  saveDb();

  return res.json({ user: safeUser(user), accessToken, refreshToken });
});

app.post('/api/v1/auth/refresh', (req, res) => {
  const { refreshToken } = req.body || {};
  if (!refreshToken) return res.status(400).json({ message: 'refreshToken required.' });

  let payload;
  try {
    payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
  } catch {
    return res.status(401).json({ message: 'Invalid refresh token.' });
  }

  const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
  const tokenEntry = db.refreshTokens.find((token) => token.tokenHash === tokenHash && !token.revokedAt);

  if (!tokenEntry || tokenEntry.userId !== payload.sub || new Date(tokenEntry.expiresAt) < new Date()) {
    return res.status(401).json({ message: 'Refresh token expired or revoked.' });
  }

  tokenEntry.revokedAt = new Date().toISOString();
  const user = db.users.find((u) => u.id === payload.sub);
  if (!user) return res.status(401).json({ message: 'User not found.' });

  const nextTokenId = crypto.randomUUID();
  const accessToken = signAccessToken(user);
  const nextRefreshToken = signRefreshToken(user, nextTokenId);

  db.refreshTokens.push({
    id: crypto.randomUUID(),
    tokenHash: crypto.createHash('sha256').update(nextRefreshToken).digest('hex'),
    userId: user.id,
    expiresAt: new Date(Date.now() + parseDurationMs(REFRESH_EXPIRES_IN)).toISOString(),
    revokedAt: null,
  });

  saveDb();

  return res.json({ user: safeUser(user), accessToken, refreshToken: nextRefreshToken });
});

app.post('/api/v1/auth/logout', auth, (req, res) => {
  const { refreshToken } = req.body || {};
  if (!refreshToken) return res.status(204).send();

  const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
  db.refreshTokens = db.refreshTokens.map((entry) => {
    if (entry.userId === req.user.id && entry.tokenHash === tokenHash && !entry.revokedAt) {
      return { ...entry, revokedAt: new Date().toISOString() };
    }
    return entry;
  });

  saveDb();
  return res.status(204).send();
});

app.get('/api/v1/auth/me', auth, (req, res) => {
  res.json({ user: safeUser(req.user) });
});

app.get('/api/v1/tests', auth, (req, res) => {
  const {
    search = '',
    category,
    difficulty,
    premium,
    page = '1',
    limit = '12',
  } = req.query;

  let items = db.tests.filter((test) => test.published);

  const searchText = String(search).toLowerCase().trim();
  if (searchText) {
    items = items.filter((test) =>
      test.title.toLowerCase().includes(searchText)
      || test.description.toLowerCase().includes(searchText)
      || test.subjects.some((subject) => subject.toLowerCase().includes(searchText))
    );
  }

  if (category) items = items.filter((test) => test.category === category);
  if (difficulty) items = items.filter((test) => test.difficulty === difficulty);
  if (premium === 'true') items = items.filter((test) => test.premium);
  if (premium === 'false') items = items.filter((test) => !test.premium);

  const pageNumber = Math.max(1, Number(page));
  const limitNumber = Math.min(50, Math.max(1, Number(limit)));
  const total = items.length;

  const paged = items.slice((pageNumber - 1) * limitNumber, pageNumber * limitNumber).map((test) => ({
    id: test.id,
    slug: test.slug,
    title: test.title,
    description: test.description,
    category: test.category,
    difficulty: test.difficulty,
    durationSec: test.durationSec,
    premium: test.premium,
    xpReward: test.xpReward,
    subjects: test.subjects,
    questionCount: test.questions.length,
  }));

  res.json({
    items: paged,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    },
  });
});

app.get('/api/v1/tests/recommended', auth, (req, res) => {
  const attempts = db.attempts.filter((a) => a.userId === req.user.id);
  const byCategory = new Map();

  attempts.forEach((attempt) => {
    const test = db.tests.find((t) => t.id === attempt.testId);
    if (!test) return;
    const prev = byCategory.get(test.category) || { total: 0, count: 0 };
    byCategory.set(test.category, { total: prev.total + attempt.percentage, count: prev.count + 1 });
  });

  const weakest = [...byCategory.entries()]
    .map(([category, stats]) => ({ category, avg: stats.total / stats.count }))
    .sort((a, b) => a.avg - b.avg)[0]?.category;

  const items = db.tests
    .filter((test) => test.published && (!weakest || test.category === weakest))
    .slice(0, 6)
    .map((test) => ({
      id: test.id,
      title: test.title,
      description: test.description,
      difficulty: test.difficulty,
      category: test.category,
      durationSec: test.durationSec,
      premium: test.premium,
      xpReward: test.xpReward,
      subjects: test.subjects,
    }));

  res.json({ items, weakestCategory: weakest || null });
});

app.get('/api/v1/tests/:id', auth, (req, res) => {
  const test = db.tests.find((t) => t.id === req.params.id);
  if (!test) return res.status(404).json({ message: 'Test not found.' });

  res.json({
    test: {
      id: test.id,
      slug: test.slug,
      title: test.title,
      description: test.description,
      category: test.category,
      difficulty: test.difficulty,
      durationSec: test.durationSec,
      premium: test.premium,
      xpReward: test.xpReward,
      subjects: test.subjects,
      questions: test.questions.map((q) => ({
        id: q.id,
        text: q.text,
        explanation: q.explanation,
        order: q.order,
        weight: q.weight,
        options: q.options.map((o) => ({ id: o.id, text: o.text, order: o.order })),
      })),
    },
  });
});

app.post('/api/v1/tests/:id/submit', auth, (req, res) => {
  const test = db.tests.find((t) => t.id === req.params.id);
  if (!test) return res.status(404).json({ message: 'Test not found.' });

  const { timeSpentSec, answers } = req.body || {};
  if (!Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ message: 'answers are required.' });
  }

  const answerMap = new Map(answers.map((a) => [a.questionId, a.optionId]));
  const totalQuestions = test.questions.length;
  const totalWeight = test.questions.reduce((sum, q) => sum + q.weight, 0);

  let correctAnswers = 0;
  let weightedCorrect = 0;

  const answerReview = test.questions.map((question) => {
    const selectedOptionId = answerMap.get(question.id) || null;
    const correctOption = question.options.find((o) => o.isCorrect);
    const isCorrect = Boolean(correctOption && selectedOptionId === correctOption.id);

    if (isCorrect) {
      correctAnswers += 1;
      weightedCorrect += question.weight;
    }

    return {
      questionId: question.id,
      selectedOptionId,
      correctOptionId: correctOption ? correctOption.id : null,
      isCorrect,
      weight: question.weight,
    };
  });

  const rawScore = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  const weightedScore = totalWeight > 0 ? (weightedCorrect / totalWeight) * 100 : 0;
  const percentage = weightedScore;

  const safeDuration = Math.max(1, test.durationSec);
  const boundedTime = Math.max(0, Math.min(Number(timeSpentSec || safeDuration), safeDuration));
  const timeEfficiency = Math.max(0, safeDuration - boundedTime) / safeDuration;
  const timeBonus = Math.min(5, timeEfficiency * 10);
  const finalScore = Math.max(0, Math.min(100, weightedScore + timeBonus));

  const streak = streakUpdate(req.user);
  const baseXp = test.xpReward || BASE_XP_BY_DIFFICULTY[test.difficulty] || 75;
  const baseXpEarned = calculateXp(baseXp, test.difficulty, percentage, timeBonus, streak.currentStreak);

  const attemptCount = db.attempts.filter((a) => a.userId === req.user.id).length;
  const currentUserAchievements = db.userAchievements.filter((a) => a.userId === req.user.id);
  const unlockedIds = new Set(currentUserAchievements.map((a) => a.achievementId));

  const projectedXp = req.user.xp + baseXpEarned;

  const newlyUnlocked = db.achievements.filter((achievement) => {
    if (unlockedIds.has(achievement.id)) return false;

    if (achievement.type === 'attempt_count') return attemptCount + 1 >= achievement.min;
    if (achievement.type === 'best_score') return finalScore >= achievement.min;
    if (achievement.type === 'streak') return streak.currentStreak >= achievement.min;
    if (achievement.type === 'xp') return projectedXp >= achievement.min;
    return false;
  });

  const achievementBonusXp = newlyUnlocked.reduce((sum, achievement) => sum + achievement.xpReward, 0);
  const xpEarned = baseXpEarned + achievementBonusXp;

  const levelBefore = resolveLevelFromXp(req.user.xp);
  const nextXp = req.user.xp + xpEarned;
  const levelAfter = resolveLevelFromXp(nextXp);
  const leveledUp = levelAfter > levelBefore;

  const now = new Date();

  const attempt = {
    id: crypto.randomUUID(),
    userId: req.user.id,
    testId: test.id,
    timeSpentSec: boundedTime,
    totalQuestions,
    correctAnswers,
    rawScore,
    weightedScore,
    percentage,
    timeBonus,
    finalScore,
    accuracy: percentage,
    xpEarned,
    levelBefore,
    levelAfter,
    streakAtCompletion: streak.currentStreak,
    answerReview,
    completedAt: now.toISOString(),
  };

  db.attempts.push(attempt);

  req.user.xp = nextXp;
  req.user.level = levelAfter;
  req.user.currentStreak = streak.currentStreak;
  req.user.longestStreak = streak.longestStreak;
  req.user.lastActiveDate = streak.lastActiveDate;

  const todayKey = startOfDay(now).toISOString();
  const activity = db.dailyActivity.find((entry) => entry.userId === req.user.id && entry.activityDate === todayKey);
  if (!activity) {
    db.dailyActivity.push({
      id: crypto.randomUUID(),
      userId: req.user.id,
      activityDate: todayKey,
      testsCompleted: 1,
      questionsAnswered: totalQuestions,
      xpEarned,
      averageScore: finalScore,
    });
  } else {
    const nextTests = activity.testsCompleted + 1;
    activity.averageScore = (activity.averageScore * activity.testsCompleted + finalScore) / nextTests;
    activity.testsCompleted = nextTests;
    activity.questionsAnswered += totalQuestions;
    activity.xpEarned += xpEarned;
  }

  newlyUnlocked.forEach((achievement) => {
    db.userAchievements.push({
      id: crypto.randomUUID(),
      userId: req.user.id,
      achievementId: achievement.id,
      unlockedAt: now.toISOString(),
    });

    db.notifications.push({
      id: crypto.randomUUID(),
      userId: req.user.id,
      type: 'ACHIEVEMENT',
      title: `Achievement Unlocked: ${achievement.title}`,
      message: achievement.description,
      createdAt: now.toISOString(),
    });
  });

  if (leveledUp) {
    db.notifications.push({
      id: crypto.randomUUID(),
      userId: req.user.id,
      type: 'LEVEL_UP',
      title: 'Level Up!',
      message: `You reached level ${levelAfter}.`,
      createdAt: now.toISOString(),
    });
  }

  saveDb();

  return res.status(201).json({
    attemptId: attempt.id,
    totalQuestions,
    correctAnswers,
    weightedScore,
    finalScore,
    percentage,
    timeBonus,
    xpEarned,
    baseXpEarned,
    achievementBonusXp,
    currentStreak: streak.currentStreak,
    longestStreak: streak.longestStreak,
    levelBefore,
    levelAfter,
    leveledUp,
    answerReview,
    unlockedAchievements: newlyUnlocked.map((achievement) => ({
      id: achievement.id,
      slug: achievement.slug,
      title: achievement.title,
      xpReward: achievement.xpReward,
    })),
  });
});

function generateLeaderboard(period, category, currentUserId) {
  const startDate = getPeriodStart(period);

  const filteredAttempts = db.attempts.filter((attempt) => {
    const test = db.tests.find((t) => t.id === attempt.testId);
    if (!test) return false;
    if (category && category !== 'ALL' && test.category !== category) return false;
    if (startDate && new Date(attempt.completedAt) < startDate) return false;
    return true;
  });

  const group = new Map();
  filteredAttempts.forEach((attempt) => {
    const entry = group.get(attempt.userId) || { testsCompleted: 0, xp: 0, scoreTotal: 0 };
    entry.testsCompleted += 1;
    entry.xp += attempt.xpEarned;
    entry.scoreTotal += attempt.percentage;
    group.set(attempt.userId, entry);
  });

  const rows = db.users
    .map((user) => {
      const stats = group.get(user.id) || { testsCompleted: 0, xp: 0, scoreTotal: 0 };
      if (stats.testsCompleted === 0 && period !== 'all') return null;

      const accuracy = stats.testsCompleted > 0 ? stats.scoreTotal / stats.testsCompleted : 0;
      const totalXp = period === 'all' ? user.xp : stats.xp;
      const rankingScore = totalXp + stats.testsCompleted * 15 + accuracy * 2 + user.currentStreak * 5;

      return {
        userId: user.id,
        fullName: user.fullName,
        avatarUrl: null,
        totalXp,
        testsCompleted: stats.testsCompleted,
        accuracy,
        streak: user.currentStreak,
        rankingScore,
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (b.rankingScore !== a.rankingScore) return b.rankingScore - a.rankingScore;
      if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
      return b.testsCompleted - a.testsCompleted;
    });

  const periodKey = `${period}:${category || 'ALL'}`;

  const withRank = rows.map((row, index) => {
    const rank = index + 1;
    const stateKey = `${periodKey}:${row.userId}`;
    const previous = db.leaderboardStates.find((state) => state.key === stateKey);
    const previousRank = previous ? previous.rank : rank;
    const rankDelta = previousRank - rank;

    if (!previous) {
      db.leaderboardStates.push({ key: stateKey, rank, score: row.rankingScore });
    } else {
      previous.rank = rank;
      previous.score = row.rankingScore;
    }

    return {
      rank,
      previousRank,
      rankDelta,
      rankTrend: rankDelta > 0 ? 'up' : rankDelta < 0 ? 'down' : 'same',
      isCurrentUser: row.userId === currentUserId,
      ...row,
    };
  });

  saveDb();

  return {
    period,
    category: category && category !== 'ALL' ? category : null,
    rows: withRank,
    podium: withRank.slice(0, 3),
    currentUserRank: withRank.find((row) => row.userId === currentUserId)?.rank || null,
  };
}

app.get('/api/v1/leaderboard', auth, (req, res) => {
  const period = String(req.query.period || 'all');
  const category = req.query.category ? String(req.query.category) : null;
  const data = generateLeaderboard(period, category, req.user.id);
  res.json(data);
});

app.get('/api/v1/dashboard/overview', auth, (req, res) => {
  const attempts = db.attempts.filter((a) => a.userId === req.user.id);
  const averageScore = attempts.length > 0 ? attempts.reduce((sum, a) => sum + a.finalScore, 0) / attempts.length : 0;

  const leaderboard = generateLeaderboard('all', null, req.user.id);
  const miniLeaderboard = leaderboard.rows.slice(0, 5);

  const categoryBuckets = new Map();
  attempts.forEach((attempt) => {
    const test = db.tests.find((t) => t.id === attempt.testId);
    if (!test) return;
    const prev = categoryBuckets.get(test.category) || { total: 0, count: 0 };
    categoryBuckets.set(test.category, { total: prev.total + attempt.percentage, count: prev.count + 1 });
  });

  const weakestCategory = [...categoryBuckets.entries()]
    .map(([category, stats]) => ({ category, avg: stats.total / stats.count }))
    .sort((a, b) => a.avg - b.avg)[0]?.category;

  const recommendedTests = db.tests
    .filter((test) => test.published && (!weakestCategory || test.category === weakestCategory))
    .slice(0, 6)
    .map((test) => ({
      id: test.id,
      title: test.title,
      description: test.description,
      category: test.category,
      difficulty: test.difficulty,
      durationSec: test.durationSec,
      premium: test.premium,
      xpReward: test.xpReward,
      subjects: test.subjects,
    }));

  const week = [];
  const today = startOfDay(new Date());
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    week.push(d);
  }

  const weeklyProgress = week.map((day) => {
    const key = startOfDay(day).toISOString();
    const activity = db.dailyActivity.find((a) => a.userId === req.user.id && a.activityDate === key);
    return {
      date: key,
      label: day.toLocaleDateString('en-US', { weekday: 'short' }),
      testsCompleted: activity ? activity.testsCompleted : 0,
      questionsAnswered: activity ? activity.questionsAnswered : 0,
      active: activity ? activity.testsCompleted > 0 : false,
    };
  });

  const notifications = db.notifications.filter((n) => n.userId === req.user.id).slice(-4).reverse();
  const recentAttempts = attempts.slice(-6).reverse();

  const activityTimeline = [
    ...recentAttempts.map((attempt) => {
      const test = db.tests.find((t) => t.id === attempt.testId);
      return {
        id: `attempt_${attempt.id}`,
        type: 'attempt',
        title: `Completed ${test ? test.title : 'Test'}`,
        description: `Score ${attempt.finalScore.toFixed(1)}% • +${attempt.xpEarned} XP`,
        date: attempt.completedAt,
      };
    }),
    ...notifications.map((notification) => ({
      id: `notification_${notification.id}`,
      type: 'notification',
      title: notification.title,
      description: notification.message,
      date: notification.createdAt,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  res.json({
    metrics: {
      totalTests: attempts.length,
      averageScore: Number(averageScore.toFixed(2)),
      currentRank: leaderboard.currentUserRank,
      currentStreak: req.user.currentStreak,
    },
    weeklyProgress,
    recommendedTests,
    activityTimeline,
    miniLeaderboard,
  });
});

app.get('/api/v1/profile/overview', auth, (req, res) => {
  const attempts = db.attempts.filter((a) => a.userId === req.user.id);
  const averageScore = attempts.length > 0 ? attempts.reduce((sum, a) => sum + a.finalScore, 0) / attempts.length : 0;
  const averageAccuracy = attempts.length > 0 ? attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length : 0;
  const totalXpFromAttempts = attempts.reduce((sum, a) => sum + a.xpEarned, 0);

  const currentLevelThreshold = LEVEL_THRESHOLDS[req.user.level - 1] || 0;
  const nextLevelThreshold = LEVEL_THRESHOLDS[req.user.level] || (currentLevelThreshold + 3000);
  const xpIntoCurrent = Math.max(0, req.user.xp - currentLevelThreshold);
  const levelSpan = Math.max(1, nextLevelThreshold - currentLevelThreshold);
  const progressPercent = Math.min(100, (xpIntoCurrent / levelSpan) * 100);

  const today = startOfDay(new Date());
  const weeklyActivity = [];
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = startOfDay(d).toISOString();
    const row = db.dailyActivity.find((a) => a.userId === req.user.id && a.activityDate === key);
    weeklyActivity.push({
      date: key,
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      testsCompleted: row ? row.testsCompleted : 0,
      questionsAnswered: row ? row.questionsAnswered : 0,
      xpEarned: row ? row.xpEarned : 0,
      active: row ? row.testsCompleted > 0 : false,
    });
  }

  const achievements = db.userAchievements
    .filter((ua) => ua.userId === req.user.id)
    .map((ua) => ({
      unlockedAt: ua.unlockedAt,
      achievement: db.achievements.find((a) => a.id === ua.achievementId),
    }))
    .filter((row) => row.achievement)
    .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
    .slice(0, 12)
    .map((row) => ({
      unlockedAt: row.unlockedAt,
      achievement: row.achievement,
    }));

  const recentAttempts = attempts
    .slice(-8)
    .reverse()
    .map((attempt) => {
      const test = db.tests.find((t) => t.id === attempt.testId);
      return {
        id: attempt.id,
        finalScore: attempt.finalScore,
        percentage: attempt.percentage,
        xpEarned: attempt.xpEarned,
        completedAt: attempt.completedAt,
        test: {
          id: test ? test.id : 'unknown',
          title: test ? test.title : 'Unknown test',
          category: test ? test.category : 'SCHOOL',
          difficulty: test ? test.difficulty : 'EASY',
        },
      };
    });

  res.json({
    profile: {
      id: req.user.id,
      fullName: req.user.fullName,
      email: req.user.email,
      level: req.user.level,
      xp: req.user.xp,
      currentStreak: req.user.currentStreak,
      longestStreak: req.user.longestStreak,
      memberSince: req.user.createdAt,
    },
    stats: {
      totalAttempts: attempts.length,
      averageScore: Number(averageScore.toFixed(2)),
      averageAccuracy: Number(averageAccuracy.toFixed(2)),
      totalXpFromAttempts,
    },
    levelProgress: {
      currentLevelThreshold,
      nextLevelThreshold,
      xpIntoCurrent,
      levelSpan,
      progressPercent,
    },
    weeklyActivity,
    achievements,
    recentAttempts,
  });
});

app.listen(PORT, () => {
  console.log(`Smart Test Pro local API running on http://localhost:${PORT}/api/v1`);
});
