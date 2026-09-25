import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { WorldCanvas, type CanvasWidget } from "@/components/world-canvas/world-canvas";
import { ObjectsSection } from "@/components/objects-section";
import { GlobeLoader } from "@/components/globe/globe-loader";

export default async function WorldPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const { userId } = await auth();

  const world = await prisma.world.findUnique({
    where: { slug: username },
    include: { owner: true, widgets: { orderBy: { zIndex: "asc" } } },
  });

  if (!world) notFound();

  const isOwner = userId !== null && userId === world.owner.clerkId;

  const widgets: CanvasWidget[] = world.widgets.map((w) => ({
    id: w.id,
    type: w.type,
    x: w.x,
    y: w.y,
    width: w.width,
    height: w.height,
    zIndex: w.zIndex,
    content: w.content as Record<string, string>,
  }));

  const objects = isOwner
    ? await prisma.user.findUniqueOrThrow({
        where: { id: world.ownerId },
        select: {
          photos: { select: { id: true, caption: true }, orderBy: { createdAt: "desc" } },
          notes: { select: { id: true, title: true }, orderBy: { createdAt: "desc" } },
          diaryEntries: { select: { date: true }, orderBy: { date: "desc" } },
          places: { select: { slug: true, name: true }, orderBy: { createdAt: "desc" } },
        },
      })
    : null;

  const placesWithGeo = await prisma.place.findMany({
    where: {
      ownerId: world.ownerId,
      latitude: { not: null },
      longitude: { not: null },
      ...(isOwner ? {} : { privacy: { in: ["PUBLIC", "UNLISTED"] } }),
    },
    select: { slug: true, name: true, latitude: true, longitude: true },
  });

  const globePlaces = placesWithGeo.map((p) => ({
    slug: p.slug,
    name: p.name,
    latitude: p.latitude as number,
    longitude: p.longitude as number,
  }));

  return (
    <div className="flex flex-1 flex-col">
      <GlobeLoader
        worldId={world.id}
        username={username}
        displayName={world.owner.displayName ?? world.slug}
        places={globePlaces}
        isOwner={isOwner}
        initialTheme={world.globeTheme}
        stats={
          objects
            ? {
                photos: objects.photos.length,
                notes: objects.notes.length,
                diaryEntries: objects.diaryEntries.length,
              }
            : undefined
        }
      />

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-16">
        <h2 className="font-display text-2xl">Customize your space</h2>

        <WorldCanvas worldId={world.id} initialWidgets={widgets} isOwner={isOwner} />

        {objects && (
          <ObjectsSection
            username={username}
            photos={objects.photos}
            notes={objects.notes}
            diaryEntries={objects.diaryEntries}
            places={objects.places}
          />
        )}
      </div>
    </div>
  );
}
