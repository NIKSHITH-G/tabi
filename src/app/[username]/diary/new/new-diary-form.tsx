"use client";

import { useActionState } from "react";
import { createDiaryEntry } from "@/lib/object-actions";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function NewDiaryForm() {
  const [state, formAction, isPending] = useActionState(
    createDiaryEntry,
    undefined,
  );

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm">
        Date
        <input
          name="date"
          type="date"
          required
          defaultValue={todayISO()}
          className="rounded-lg border border-line bg-paper-raised px-3 py-2 outline-none focus:border-accent"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Entry
        <textarea
          name="body"
          required
          rows={10}
          placeholder="What happened today?"
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
        {isPending ? "Saving…" : "Save entry"}
      </button>
    </form>
  );
}
