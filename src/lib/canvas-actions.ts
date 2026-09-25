"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import type { WidgetType } from "@/generated/prisma/client";

const DEFAULT_CONTENT: Record<WidgetType, Record<string, string>> = {
  TEXT: { text: "" },
  NOTES: { text: "" },
  PHOTO: { imageUrl: "", caption: "" },
  MAP: { label: "" },
};

const DEFAULT_SIZE: Record<WidgetType, { width: number; height: number }> = {
  TEXT: { width: 280, height: 160 },
  NOTES: { width: 260, height: 220 },
  PHOTO: { width: 280, height: 280 },
  MAP: { width: 320, height: 220 },
};

async function requireWidgetOwnership(widgetId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const widget = await prisma.widget.findUnique({
    where: { id: widgetId },
    include: { world: { include: { owner: true } } },
  });
  if (!widget || widget.world.owner.clerkId !== userId) {
    throw new Error("Forbidden");
  }
  return widget;
}

export async function addWidget(worldId: string, type: WidgetType) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const world = await prisma.world.findUnique({
    where: { id: worldId },
    include: { owner: true },
  });
  if (!world || world.owner.clerkId !== userId) throw new Error("Forbidden");

  const count = await prisma.widget.count({ where: { worldId } });
  const size = DEFAULT_SIZE[type];
  const offset = (count % 6) * 28;

  return prisma.widget.create({
    data: {
      worldId,
      type,
      x: 24 + offset,
      y: 24 + offset,
      width: size.width,
      height: size.height,
      zIndex: count + 1,
      content: DEFAULT_CONTENT[type],
    },
  });
}

export async function updateWidgetLayout(
  widgetId: string,
  layout: { x: number; y: number; width: number; height: number },
) {
  const widget = await requireWidgetOwnership(widgetId);
  await prisma.widget.update({ where: { id: widget.id }, data: layout });
}

export async function updateWidgetContent(
  widgetId: string,
  content: Record<string, string>,
) {
  const widget = await requireWidgetOwnership(widgetId);
  await prisma.widget.update({ where: { id: widget.id }, data: { content } });
}

export async function removeWidget(widgetId: string) {
  const widget = await requireWidgetOwnership(widgetId);
  await prisma.widget.delete({ where: { id: widget.id } });
}

export async function bringWidgetToFront(widgetId: string) {
  const widget = await requireWidgetOwnership(widgetId);
  const highest = await prisma.widget.aggregate({
    where: { worldId: widget.worldId },
    _max: { zIndex: true },
  });
  const zIndex = (highest._max.zIndex ?? 0) + 1;
  await prisma.widget.update({ where: { id: widget.id }, data: { zIndex } });
  return zIndex;
}
