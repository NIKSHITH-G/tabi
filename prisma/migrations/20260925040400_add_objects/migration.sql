-- CreateEnum
CREATE TYPE "Privacy" AS ENUM ('PRIVATE', 'PUBLIC', 'UNLISTED', 'SHARED');

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "caption" TEXT,
    "takenAt" TIMESTAMP(3),
    "privacy" "Privacy" NOT NULL DEFAULT 'PRIVATE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "title" TEXT,
    "body" TEXT NOT NULL,
    "privacy" "Privacy" NOT NULL DEFAULT 'PRIVATE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiaryEntry" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "body" TEXT NOT NULL,
    "privacy" "Privacy" NOT NULL DEFAULT 'PRIVATE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiaryEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Place" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "privacy" "Privacy" NOT NULL DEFAULT 'PRIVATE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Photo_ownerId_idx" ON "Photo"("ownerId");

-- CreateIndex
CREATE INDEX "Note_ownerId_idx" ON "Note"("ownerId");

-- CreateIndex
CREATE INDEX "DiaryEntry_ownerId_idx" ON "DiaryEntry"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "DiaryEntry_ownerId_date_key" ON "DiaryEntry"("ownerId", "date");

-- CreateIndex
CREATE INDEX "Place_ownerId_idx" ON "Place"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Place_ownerId_slug_key" ON "Place"("ownerId", "slug");

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiaryEntry" ADD CONSTRAINT "DiaryEntry_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Place" ADD CONSTRAINT "Place_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
