-- CreateEnum
CREATE TYPE "SkillTrack" AS ENUM ('IELTS_LISTENING', 'IELTS_READING', 'IELTS_WRITING', 'IELTS_SPEAKING', 'SAT_MATH', 'SAT_ENGLISH');

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "phone" TEXT,
    "country" TEXT,
    "timezone" TEXT,
    "targetExam" TEXT,
    "targetScore" TEXT,
    "examDate" TEXT,
    "bio" TEXT,
    "fieldOfStudy" TEXT,
    "gpa" TEXT,
    "degreeLevel" TEXT,
    "budgetUsd" INTEGER,
    "targetUniversitySlug" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "showResults" BOOLEAN NOT NULL DEFAULT true,
    "showLeaderboard" BOOLEAN NOT NULL DEFAULT true,
    "showUniversity" BOOLEAN NOT NULL DEFAULT true,
    "showBadges" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillBadge" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "track" "SkillTrack" NOT NULL,
    "tier" INTEGER NOT NULL,
    "band" DOUBLE PRECISION NOT NULL,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "source" TEXT,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkillBadge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- CreateIndex
CREATE INDEX "SkillBadge_userId_pinned_idx" ON "SkillBadge"("userId", "pinned");

-- CreateIndex
CREATE UNIQUE INDEX "SkillBadge_userId_track_tier_key" ON "SkillBadge"("userId", "track", "tier");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillBadge" ADD CONSTRAINT "SkillBadge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
