"use client";

import { useActionState, useState } from "react";
import { createPlace } from "@/lib/object-actions";
import { PlacePickerLoader } from "@/components/globe/place-picker-loader";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function NewPlaceForm({ firstPlace }: { firstPlace: boolean }) {
  const [state, formAction, isPending] = useActionState(createPlace, undefined);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [picked, setPicked] = useState<{ lat: number; lng: number } | null>(null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        {firstPlace ? "Where do you live?" : "Name"}
        <input
          name="name"
          type="text"
          required
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          placeholder={firstPlace ? "e.g. Melbourne" : "Tokyo"}
          className="rounded-lg border border-line bg-paper-raised px-3 py-2 outline-none focus:border-accent"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Slug
        <div className="flex items-center overflow-hidden rounded-lg border border-line bg-paper-raised focus-within:border-accent">
          <span className="pl-3 pr-1 text-ink-muted">place/</span>
          <input
            name="slug"
            type="text"
            required
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(slugify(e.target.value));
            }}
            placeholder="tokyo"
            className="w-full bg-transparent py-2 pr-3 outline-none"
          />
        </div>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Description (optional)
        <textarea
          name="description"
          rows={3}
          className="resize-none rounded-lg border border-line bg-paper-raised px-3 py-2 outline-none focus:border-accent"
        />
      </label>

      <div className="flex flex-col gap-1 text-sm">
        Location
        <PlacePickerLoader value={picked} onChange={(lat, lng) => setPicked({ lat, lng })} />
      </div>
      <input type="hidden" name="latitude" value={picked?.lat ?? ""} />
      <input type="hidden" name="longitude" value={picked?.lng ?? ""} />

      {state?.error && (
        <p role="alert" className="text-sm text-accent-strong">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="self-start rounded-full bg-accent px-6 py-2.5 font-medium text-paper transition-colors hover:bg-accent-strong disabled:opacity-50"
      >
        {isPending ? "Saving…" : "Save place"}
      </button>
    </form>
  );
}
