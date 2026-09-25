import { requireOwnerPage } from "@/lib/require-owner";
import { prisma } from "@/lib/db";
import { NewPlaceForm } from "./new-place-form";

export default async function NewPlacePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = await requireOwnerPage(username);
  const placeCount = await prisma.place.count({ where: { ownerId: user.id } });

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-6 py-24">
      <div className="flex flex-col gap-1">
        <p className="font-display text-sm uppercase tracking-[0.2em] text-accent">
          New
        </p>
        <h1 className="font-display text-3xl">
          {placeCount === 0 ? "Start with your first place" : "Add a place"}
        </h1>
      </div>
      <NewPlaceForm firstPlace={placeCount === 0} />
    </div>
  );
}
