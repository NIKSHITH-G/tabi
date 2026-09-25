"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

async function requireOwnerUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) throw new Error("No Tabi world yet");
  return user;
}

export type ObjectFormState = { error?: string } | undefined;

const photoSchema = z.object({
  imageUrl: z.string().trim().url("Enter a valid image URL"),
  caption: z.string().trim().max(280).optional(),
  takenAt: z.string().trim().optional(),
});

export async function createPhoto(
  _prevState: ObjectFormState,
  formData: FormData,
): Promise<ObjectFormState> {
  const user = await requireOwnerUser();
  const parsed = photoSchema.safeParse({
    imageUrl: formData.get("imageUrl"),
    caption: formData.get("caption") || undefined,
    takenAt: formData.get("takenAt") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid photo" };
  }

  const photo = await prisma.photo.create({
    data: {
      ownerId: user.id,
      imageUrl: parsed.data.imageUrl,
      caption: parsed.data.caption || null,
      takenAt: parsed.data.takenAt ? new Date(parsed.data.takenAt) : null,
    },
  });

  redirect(`/${user.username}/photo/${photo.id}`);
}

const noteSchema = z.object({
  title: z.string().trim().max(120).optional(),
  body: z.string().trim().min(1, "Write something first").max(10_000),
});

export async function createNote(
  _prevState: ObjectFormState,
  formData: FormData,
): Promise<ObjectFormState> {
  const user = await requireOwnerUser();
  const parsed = noteSchema.safeParse({
    title: formData.get("title") || undefined,
    body: formData.get("body"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid note" };
  }

  const note = await prisma.note.create({
    data: {
      ownerId: user.id,
      title: parsed.data.title || null,
      body: parsed.data.body,
    },
  });

  redirect(`/${user.username}/note/${note.id}`);
}

const diarySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a valid date"),
  body: z.string().trim().min(1, "Write something first").max(20_000),
});

export async function createDiaryEntry(
  _prevState: ObjectFormState,
  formData: FormData,
): Promise<ObjectFormState> {
  const user = await requireOwnerUser();
  const parsed = diarySchema.safeParse({
    date: formData.get("date"),
    body: formData.get("body"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid entry" };
  }

  const existing = await prisma.diaryEntry.findUnique({
    where: { ownerId_date: { ownerId: user.id, date: new Date(parsed.data.date) } },
  });
  if (existing) {
    return { error: "You already have an entry for that date" };
  }

  await prisma.diaryEntry.create({
    data: {
      ownerId: user.id,
      date: new Date(parsed.data.date),
      body: parsed.data.body,
    },
  });

  redirect(`/${user.username}/diary/${parsed.data.date}`);
}

const placeSchema = z.object({
  name: z.string().trim().min(1, "Give it a name").max(120),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Give it a short slug")
    .max(60)
    .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, "Lowercase letters, numbers, hyphens only"),
  description: z.string().trim().max(2000).optional(),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
});

export async function createPlace(
  _prevState: ObjectFormState,
  formData: FormData,
): Promise<ObjectFormState> {
  const user = await requireOwnerUser();
  const rawLat = formData.get("latitude");
  const rawLng = formData.get("longitude");
  const parsed = placeSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") || undefined,
    latitude: rawLat ? rawLat : undefined,
    longitude: rawLng ? rawLng : undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid place" };
  }

  const existing = await prisma.place.findUnique({
    where: { ownerId_slug: { ownerId: user.id, slug: parsed.data.slug } },
  });
  if (existing) {
    return { error: "You already have a place with that slug" };
  }

  await prisma.place.create({
    data: {
      ownerId: user.id,
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description || null,
      latitude: parsed.data.latitude ?? null,
      longitude: parsed.data.longitude ?? null,
    },
  });

  redirect(`/${user.username}/place/${parsed.data.slug}`);
}
