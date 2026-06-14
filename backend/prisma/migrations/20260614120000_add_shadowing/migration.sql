-- Shared shadowing library. A video added from a YouTube link is stored once
-- (youtubeId is unique) and shown to every user. Segments hold the per-line
-- timestamps used to loop a single sentence for repetition practice.

CREATE TABLE "ShadowingVideo" (
    "id" TEXT NOT NULL,
    "youtubeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT,
    "thumbnailUrl" TEXT,
    "durationSec" INTEGER NOT NULL DEFAULT 0,
    "level" TEXT NOT NULL DEFAULT 'Intermediate',
    "accent" TEXT,
    "topic" TEXT,
    "captionKind" TEXT NOT NULL DEFAULT 'auto',
    "language" TEXT NOT NULL DEFAULT 'en',
    "segmentCount" INTEGER NOT NULL DEFAULT 0,
    "wordCount" INTEGER NOT NULL DEFAULT 0,
    "playCount" INTEGER NOT NULL DEFAULT 0,
    "submittedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShadowingVideo_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ShadowingVideo_youtubeId_key" ON "ShadowingVideo"("youtubeId");
CREATE INDEX "ShadowingVideo_createdAt_idx" ON "ShadowingVideo"("createdAt");
CREATE INDEX "ShadowingVideo_level_idx" ON "ShadowingVideo"("level");

ALTER TABLE "ShadowingVideo" ADD CONSTRAINT "ShadowingVideo_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "ShadowingSegment" (
    "id" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "startSec" DOUBLE PRECISION NOT NULL,
    "endSec" DOUBLE PRECISION NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "ShadowingSegment_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ShadowingSegment_videoId_orderIndex_key" ON "ShadowingSegment"("videoId", "orderIndex");
CREATE INDEX "ShadowingSegment_videoId_orderIndex_idx" ON "ShadowingSegment"("videoId", "orderIndex");

ALTER TABLE "ShadowingSegment" ADD CONSTRAINT "ShadowingSegment_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "ShadowingVideo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
