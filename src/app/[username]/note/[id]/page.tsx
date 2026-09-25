import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function NotePage({
  params,
}: {
  params: Promise<{ username: string; id: string }>;
}) {
  const { username, id } = await params;
  const { userId } = await auth();

  const note = await prisma.note.findUnique({
    where: { id },
    include: { owner: true },
  });

  if (!note || note.owner.username !== username) notFound();

  const isOwner = userId !== null && userId === note.owner.clerkId;
  if (note.privacy === "PRIVATE" && !isOwner) notFound();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-16">
      <Link
        href={`/${username}`}
        className="text-sm text-ink-muted hover:text-ink"
      >
        ← {username}&apos;s world
      </Link>

      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-paper-raised p-6">
        {note.title && <h1 className="font-display text-2xl">{note.title}</h1>}
        <p className="whitespace-pre-wrap leading-relaxed">{note.body}</p>
      </div>
    </div>
  );
}
