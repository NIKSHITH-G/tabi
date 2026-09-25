import { requireOwnerPage } from "@/lib/require-owner";
import { NewPhotoForm } from "./new-photo-form";

export default async function NewPhotoPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  await requireOwnerPage(username);

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-6 py-24">
      <div className="flex flex-col gap-1">
        <p className="font-display text-sm uppercase tracking-[0.2em] text-accent">
          New
        </p>
        <h1 className="font-display text-3xl">Add a photo</h1>
      </div>
      <NewPhotoForm />
    </div>
  );
}
