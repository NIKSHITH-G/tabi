import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function PhotoPage({
  params,
}: {
  params: Promise<{ username: string; id: string }>;
}) {
  const { username, id } = await params;
  const { userId } = await auth();

  const photo = await prisma.photo.findUnique({
    where: { id },
    include: { owner: true },
  });

  if (!photo || photo.owner.username !== username) notFound();

  const isOwner = userId !== null && userId === photo.owner.clerkId;
  if (photo.privacy === "PRIVATE" && !isOwner) notFound();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-16">
      <Link
        href={`/${username}`}
        className="text-sm text-ink-muted hover:text-ink"
      >
        ← {username}&apos;s world
      </Link>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.imageUrl}
        alt={photo.caption ?? "Photo"}
        className="w-full rounded-2xl border border-line object-cover"
      />

      <div className="flex flex-col gap-1">
        {photo.caption && (
          <p className="font-display text-xl">{photo.caption}</p>
        )}
        {photo.takenAt && (
          <p className="text-sm text-ink-muted">
            {new Date(photo.takenAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}
      </div>
    </div>
  );
}
