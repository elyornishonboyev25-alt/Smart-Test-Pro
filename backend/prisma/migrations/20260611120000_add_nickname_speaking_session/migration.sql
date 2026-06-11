-- Unique public nickname on User (nullable; users set it during onboarding).
ALTER TABLE "User" ADD COLUMN "nickname" TEXT;
CREATE UNIQUE INDEX "User_nickname_key" ON "User"("nickname");

-- Persisted speaking sessions — powers real speaker profiles and the community list.
CREATE TABLE "SpeakingSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "modeLabel" TEXT NOT NULL,
    "overallBand" DOUBLE PRECISION NOT NULL,
    "fluencyBand" DOUBLE PRECISION NOT NULL,
    "lexicalBand" DOUBLE PRECISION NOT NULL,
    "grammarBand" DOUBLE PRECISION NOT NULL,
    "pronunciationBand" DOUBLE PRECISION NOT NULL,
    "durationSec" INTEGER NOT NULL DEFAULT 0,
    "wordCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SpeakingSession_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "SpeakingSession_userId_createdAt_idx" ON "SpeakingSession"("userId", "createdAt");

ALTER TABLE "SpeakingSession" ADD CONSTRAINT "SpeakingSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
