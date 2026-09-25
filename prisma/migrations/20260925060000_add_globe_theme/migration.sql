-- CreateEnum
CREATE TYPE "GlobeTheme" AS ENUM ('CLASSIC', 'TABLE', 'MOONS', 'SATELLITE');

-- AlterTable
ALTER TABLE "World" ADD COLUMN "globeTheme" "GlobeTheme" NOT NULL DEFAULT 'CLASSIC';
