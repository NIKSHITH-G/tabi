"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { usernameSchema } from "@/lib/username";

export async function checkUsernameAvailable(
  raw: string,
): Promise<{ valid: boolean; available?: boolean; message?: string }> {
  const parsed = usernameSchema.safeParse(raw);
  if (!parsed.success) {
    return { valid: false, message: parsed.error.issues[0]?.message };
  }
  const taken = await prisma.user.findUnique({
    where: { username: parsed.data },
    select: { id: true },
  });
  return { valid: true, available: !taken };
}

export type ClaimWorldState = { error?: string } | undefined;

export async function claimWorld(
  _prevState: ClaimWorldState,
  formData: FormData,
): Promise<ClaimWorldState> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const existing = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (existing) redirect(`/${existing.username}`);

  const parsed = usernameSchema.safeParse(formData.get("username"));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid name" };
  }
  const username = parsed.data;

  const taken = await prisma.user.findUnique({ where: { username } });
  if (taken) {
    return { error: "That name is already taken" };
  }

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  if (!email) {
    return { error: "Your account has no verified email address" };
  }

  await prisma.user.create({
    data: {
      clerkId: userId,
      email,
      username,
      displayName: user?.firstName ?? null,
      world: { create: { slug: username } },
    },
  });

  redirect(`/${username}`);
}

export type UpdateProfileState = { error?: string; success?: boolean } | undefined;

export async function updateDisplayName(
  _prevState: UpdateProfileState,
  formData: FormData,
): Promise<UpdateProfileState> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const raw = formData.get("displayName");
  const displayName = typeof raw === "string" ? raw.trim().slice(0, 60) : "";

  await prisma.user.update({
    where: { clerkId: userId },
    data: { displayName: displayName.length > 0 ? displayName : null },
  });

  revalidatePath("/settings");
  return { success: true };
}
