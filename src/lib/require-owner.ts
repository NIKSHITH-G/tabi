import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

// For pages that only the world's own owner may view (e.g. "new object" forms).
export async function requireOwnerPage(username: string) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user || user.username !== username) redirect(`/${username}`);

  return user;
}
