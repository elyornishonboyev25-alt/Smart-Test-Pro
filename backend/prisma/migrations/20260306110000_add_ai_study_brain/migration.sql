-- CreateTable
CREATE TABLE "UserAiPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "preferredLocale" TEXT NOT NULL DEFAULT 'en',
    "preferredName" TEXT,
    "toneStyle" TEXT NOT NULL DEFAULT 'sweet',
    "lastAssistantLanguage" TEXT NOT NULL DEFAULT 'en',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAiPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiMemory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiMemory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VocabularyNotebook" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "preferenceId" TEXT,
    "testKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VocabularyNotebook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VocabularyNotebookItem" (
    "id" TEXT NOT NULL,
    "notebookId" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "meaning" TEXT NOT NULL,
    "notes" TEXT,
    "sourceLang" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VocabularyNotebookItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpeakingEvaluation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "preferenceId" TEXT,
    "transcript" TEXT NOT NULL,
    "overallBand" DOUBLE PRECISION NOT NULL,
    "fluencyBand" DOUBLE PRECISION NOT NULL,
    "grammarBand" DOUBLE PRECISION NOT NULL,
    "pronunciationBand" DOUBLE PRECISION NOT NULL,
    "lexicalBand" DOUBLE PRECISION NOT NULL,
    "feedback" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpeakingEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserAiPreference_userId_key" ON "UserAiPreference"("userId");

-- CreateIndex
CREATE INDEX "UserAiPreference_preferredLocale_idx" ON "UserAiPreference"("preferredLocale");

-- CreateIndex
CREATE UNIQUE INDEX "AiMemory_userId_key_key" ON "AiMemory"("userId", "key");

-- CreateIndex
CREATE INDEX "AiMemory_userId_updatedAt_idx" ON "AiMemory"("userId", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "VocabularyNotebook_userId_testKey_key" ON "VocabularyNotebook"("userId", "testKey");

-- CreateIndex
CREATE INDEX "VocabularyNotebook_userId_updatedAt_idx" ON "VocabularyNotebook"("userId", "updatedAt");

-- CreateIndex
CREATE INDEX "VocabularyNotebookItem_notebookId_createdAt_idx" ON "VocabularyNotebookItem"("notebookId", "createdAt");

-- CreateIndex
CREATE INDEX "SpeakingEvaluation_userId_createdAt_idx" ON "SpeakingEvaluation"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "UserAiPreference" ADD CONSTRAINT "UserAiPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiMemory" ADD CONSTRAINT "AiMemory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VocabularyNotebook" ADD CONSTRAINT "VocabularyNotebook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VocabularyNotebook" ADD CONSTRAINT "VocabularyNotebook_preferenceId_fkey" FOREIGN KEY ("preferenceId") REFERENCES "UserAiPreference"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VocabularyNotebookItem" ADD CONSTRAINT "VocabularyNotebookItem_notebookId_fkey" FOREIGN KEY ("notebookId") REFERENCES "VocabularyNotebook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpeakingEvaluation" ADD CONSTRAINT "SpeakingEvaluation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpeakingEvaluation" ADD CONSTRAINT "SpeakingEvaluation_preferenceId_fkey" FOREIGN KEY ("preferenceId") REFERENCES "UserAiPreference"("id") ON DELETE SET NULL ON UPDATE CASCADE;
