"use client";

import { useActionState } from "react";
import { createNote } from "@/lib/object-actions";

export function NewNoteForm() {
  const [state, formAction, isPending] = useActionState(createNote, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm">
        Title (optional)
        <input
          name="title"
          type="text"
          maxLength={120}
          className="rounded-lg border border-line bg-paper-raised px-3 py-2 outline-none focus:border-accent"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Note
        <textarea
          name="body"
          required
          rows={8}
          placeholder={"Grocery list\n\nMilk\nEggs\nCoffee"}
          className="resize-none rounded-lg border border-line bg-paper-raised px-3 py-2 outline-none focus:border-accent"
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
        {isPending ? "Saving…" : "Save note"}
      </button>
    </form>
  );
}
