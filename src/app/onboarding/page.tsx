import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { ClaimWorldForm } from "./claim-world-form";

export default async function OnboardingPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const existing = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (existing) redirect(`/${existing.username}`);

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-6 py-24">
      <div className="flex flex-col gap-2">
        <p className="font-display text-sm uppercase tracking-[0.2em] text-accent">
          Almost there
        </p>
        <h1 className="font-display text-3xl">Claim your world</h1>
        <p className="text-sm text-ink-muted">
          Pick the name your Tabi will live at. This becomes your permanent
          address on the internet.
        </p>
      </div>
      <ClaimWorldForm />
    </div>
  );
}
