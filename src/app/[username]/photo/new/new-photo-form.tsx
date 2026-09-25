"use client";

import { useActionState } from "react";
import { createPhoto } from "@/lib/object-actions";

export function NewPhotoForm() {
  const [state, formAction, isPending] = useActionState(createPhoto, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm">
        Image URL
        <input
          name="imageUrl"
          type="url"
          required
          placeholder="https://…"
          className="rounded-lg border border-line bg-paper-raised px-3 py-2 outline-none focus:border-accent"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Caption (optional)
        <input
          name="caption"
          type="text"
          maxLength={280}
          className="rounded-lg border border-line bg-paper-raised px-3 py-2 outline-none focus:border-accent"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Date taken (optional)
        <input
          name="takenAt"
          type="date"
          className="rounded-lg border border-line bg-paper-raised px-3 py-2 outline-none focus:border-accent"
        />
      </label>
      {state?.error && (
        <p role="alert" className="text-sm text-accent-strong">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="self-start rounded-full bg-ink px-6 py-2.5 font-medium text-paper transition-colors hover:bg-accent-strong disabled:opacity-50"
      >
        {isPending ? "Saving…" : "Save photo"}
      </button>
    </form>
  );
}
