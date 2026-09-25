import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function PlacePage({
  params,
}: {
  params: Promise<{ username: string; slug: string }>;
}) {
  const { username, slug } = await params;
  const { userId } = await auth();

  const owner = await prisma.user.findUnique({ where: { username } });
  if (!owner) notFound();

  const place = await prisma.place.findUnique({
    where: { ownerId_slug: { ownerId: owner.id, slug } },
  });
  if (!place) notFound();

  const isOwner = userId !== null && userId === owner.clerkId;
  if (place.privacy === "PRIVATE" && !isOwner) notFound();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-16">
      <Link
        href={`/${username}`}
        className="text-sm text-ink-muted hover:text-ink"
      >
        ← {username}&apos;s world
      </Link>

      <div className="flex flex-col gap-3">
        <p className="font-display text-sm uppercase tracking-[0.2em] text-accent">
          Place
        </p>
        <h1 className="font-display text-3xl">{place.name}</h1>
        {place.description && (
          <p className="text-ink-muted">{place.description}</p>
        )}
        {place.latitude !== null && place.longitude !== null && (
          <p className="text-xs text-ink-muted">
            {place.latitude?.toFixed(4)}, {place.longitude?.toFixed(4)}
          </p>
        )}
      </div>
    </div>
  );
}
