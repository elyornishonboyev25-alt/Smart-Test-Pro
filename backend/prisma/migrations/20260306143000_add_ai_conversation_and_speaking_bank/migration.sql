-- CreateEnum
CREATE TYPE "SpeakingQuestionSource" AS ENUM ('LICENSED', 'USER_UPLOADED', 'CURATED');

-- CreateTable
CREATE TABLE "AiConversationThread" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "contextMode" TEXT NOT NULL DEFAULT 'general',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiConversationThread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiConversationMessage" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiConversationMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpeakingQuestionBank" (
    "id" TEXT NOT NULL,
    "part" INTEGER NOT NULL,
    "prompt" TEXT NOT NULL,
    "followUps" JSONB,
    "sourceType" "SpeakingQuestionSource" NOT NULL DEFAULT 'CURATED',
    "sourceLabel" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpeakingQuestionBank_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AiConversationThread_userId_updatedAt_idx" ON "AiConversationThread"("userId", "updatedAt");

-- CreateIndex
CREATE INDEX "AiConversationMessage_threadId_createdAt_idx" ON "AiConversationMessage"("threadId", "createdAt");

-- CreateIndex
CREATE INDEX "SpeakingQuestionBank_part_isActive_idx" ON "SpeakingQuestionBank"("part", "isActive");

-- CreateIndex
CREATE INDEX "SpeakingQuestionBank_sourceType_isActive_idx" ON "SpeakingQuestionBank"("sourceType", "isActive");

-- AddForeignKey
ALTER TABLE "AiConversationThread" ADD CONSTRAINT "AiConversationThread_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiConversationMessage" ADD CONSTRAINT "AiConversationMessage_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "AiConversationThread"("id") ON DELETE CASCADE ON UPDATE CASCADE;
