-- CreateEnum
CREATE TYPE "FocusTaskCategory" AS ENUM ('IELTS', 'SAT', 'ENGLISH_PRACTICE');

-- CreateEnum
CREATE TYPE "FocusTaskKey" AS ENUM (
    'IELTS_READING',
    'IELTS_LISTENING',
    'IELTS_WRITING',
    'IELTS_SPEAKING',
    'SAT_MATH',
    'SAT_READING_WRITING',
    'SHADOWING',
    'ENGLISH_MOVIE',
    'VOCABULARY'
);

-- CreateEnum
CREATE TYPE "FocusTaskStatus" AS ENUM ('LOCKED', 'READY', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED', 'MISSED');

-- CreateTable
CREATE TABLE "FocusPlan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planDate" TIMESTAMP(3) NOT NULL,
    "allowManualOverride" BOOLEAN NOT NULL DEFAULT false,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FocusPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FocusTask" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "category" "FocusTaskCategory" NOT NULL,
    "moduleKey" "FocusTaskKey" NOT NULL,
    "title" TEXT NOT NULL,
    "routePath" TEXT NOT NULL,
    "estimatedMinutes" INTEGER NOT NULL DEFAULT 30,
    "status" "FocusTaskStatus" NOT NULL DEFAULT 'LOCKED',
    "completionPercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalTimeSec" INTEGER NOT NULL DEFAULT 0,
    "focusScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3),
    "unlockedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FocusTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FocusTaskLog" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tabSessionId" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "durationSec" INTEGER NOT NULL DEFAULT 0,
    "activeSec" INTEGER NOT NULL DEFAULT 0,
    "idleSec" INTEGER NOT NULL DEFAULT 0,
    "focusScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FocusTaskLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FocusDailyAnalytics" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "activityDate" TIMESTAMP(3) NOT NULL,
    "totalPlannedTasks" INTEGER NOT NULL DEFAULT 0,
    "completedTasks" INTEGER NOT NULL DEFAULT 0,
    "completionRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalStudyTimeSec" INTEGER NOT NULL DEFAULT 0,
    "averageSessionSec" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "focusConsistency" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "averageFocusScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "studyStreak" INTEGER NOT NULL DEFAULT 0,
    "categoryBreakdown" JSONB NOT NULL,
    "timeline" JSONB NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FocusDailyAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FocusPlan_userId_planDate_key" ON "FocusPlan"("userId", "planDate");

-- CreateIndex
CREATE INDEX "FocusPlan_userId_planDate_idx" ON "FocusPlan"("userId", "planDate");

-- CreateIndex
CREATE UNIQUE INDEX "FocusTask_planId_orderIndex_key" ON "FocusTask"("planId", "orderIndex");

-- CreateIndex
CREATE INDEX "FocusTask_planId_status_orderIndex_idx" ON "FocusTask"("planId", "status", "orderIndex");

-- CreateIndex
CREATE INDEX "FocusTask_moduleKey_idx" ON "FocusTask"("moduleKey");

-- CreateIndex
CREATE INDEX "FocusTaskLog_taskId_endedAt_idx" ON "FocusTaskLog"("taskId", "endedAt");

-- CreateIndex
CREATE INDEX "FocusTaskLog_userId_endedAt_idx" ON "FocusTaskLog"("userId", "endedAt");

-- CreateIndex
CREATE UNIQUE INDEX "FocusDailyAnalytics_planId_key" ON "FocusDailyAnalytics"("planId");

-- CreateIndex
CREATE UNIQUE INDEX "FocusDailyAnalytics_userId_activityDate_key" ON "FocusDailyAnalytics"("userId", "activityDate");

-- CreateIndex
CREATE INDEX "FocusDailyAnalytics_userId_activityDate_idx" ON "FocusDailyAnalytics"("userId", "activityDate");

-- AddForeignKey
ALTER TABLE "FocusPlan" ADD CONSTRAINT "FocusPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FocusTask" ADD CONSTRAINT "FocusTask_planId_fkey" FOREIGN KEY ("planId") REFERENCES "FocusPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FocusTaskLog" ADD CONSTRAINT "FocusTaskLog_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "FocusTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FocusTaskLog" ADD CONSTRAINT "FocusTaskLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FocusDailyAnalytics" ADD CONSTRAINT "FocusDailyAnalytics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FocusDailyAnalytics" ADD CONSTRAINT "FocusDailyAnalytics_planId_fkey" FOREIGN KEY ("planId") REFERENCES "FocusPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
