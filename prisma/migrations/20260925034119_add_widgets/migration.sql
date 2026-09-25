-- CreateEnum
CREATE TYPE "WidgetType" AS ENUM ('TEXT', 'NOTES', 'PHOTO', 'MAP');

-- CreateTable
CREATE TABLE "Widget" (
    "id" TEXT NOT NULL,
    "worldId" TEXT NOT NULL,
    "type" "WidgetType" NOT NULL,
    "x" INTEGER NOT NULL DEFAULT 0,
    "y" INTEGER NOT NULL DEFAULT 0,
    "width" INTEGER NOT NULL DEFAULT 280,
    "height" INTEGER NOT NULL DEFAULT 200,
    "zIndex" INTEGER NOT NULL DEFAULT 0,
    "content" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Widget_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Widget_worldId_idx" ON "Widget"("worldId");

-- AddForeignKey
ALTER TABLE "Widget" ADD CONSTRAINT "Widget_worldId_fkey" FOREIGN KEY ("worldId") REFERENCES "World"("id") ON DELETE CASCADE ON UPDATE CASCADE;
