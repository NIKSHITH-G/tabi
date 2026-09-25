import { auth } from "@clerk/nextjs/server";
import { SignOutButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { DisplayNameForm } from "./display-name-form";

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) redirect("/onboarding");

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-10 px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Settings</h1>
        <Link
          href={`/${user.username}`}
          className="text-sm text-ink-muted hover:text-ink"
        >
          View your world →
        </Link>
      </div>

      <section className="flex flex-col gap-5 rounded-2xl border border-line bg-paper-raised p-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-ink-muted">
            Your world
          </p>
          <p className="font-display text-lg">tabi.app/{user.username}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-ink-muted">
            Email
          </p>
          <p>{user.email}</p>
        </div>
        <DisplayNameForm initialValue={user.displayName ?? ""} />
      </section>

      <SignOutButton redirectUrl="/">
        <button className="self-start rounded-full border border-line px-5 py-2 text-sm transition-colors hover:bg-ink hover:text-paper">
          Sign out
        </button>
      </SignOutButton>
    </div>
  );
}
