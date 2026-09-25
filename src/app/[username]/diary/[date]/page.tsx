import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function DiaryEntryPage({
  params,
}: {
  params: Promise<{ username: string; date: string }>;
}) {
  const { username, date } = await params;
  const { userId } = await auth();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) notFound();

  const owner = await prisma.user.findUnique({ where: { username } });
  if (!owner) notFound();

  const entry = await prisma.diaryEntry.findUnique({
    where: { ownerId_date: { ownerId: owner.id, date: new Date(date) } },
  });

  if (!entry) notFound();

  const isOwner = userId !== null && userId === owner.clerkId;
  if (entry.privacy === "PRIVATE" && !isOwner) notFound();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-16">
      <Link
        href={`/${username}`}
        className="text-sm text-ink-muted hover:text-ink"
      >
        ← {username}&apos;s world
      </Link>

      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-paper-raised p-6">
        <p className="font-display text-sm uppercase tracking-[0.2em] text-accent">
          {new Date(entry.date).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <p className="whitespace-pre-wrap leading-relaxed">{entry.body}</p>
      </div>
    </div>
  );
}
