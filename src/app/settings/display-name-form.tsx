"use client";

import { useActionState } from "react";
import { updateDisplayName } from "@/lib/actions";

export function DisplayNameForm({ initialValue }: { initialValue: string }) {
  const [state, formAction, isPending] = useActionState(
    updateDisplayName,
    undefined,
  );

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <label
        htmlFor="displayName"
        className="text-xs uppercase tracking-wide text-ink-muted"
      >
        Display name
      </label>
      <div className="flex gap-2">
        <input
          id="displayName"
          name="displayName"
          defaultValue={initialValue}
          maxLength={60}
          placeholder="Your name"
          className="flex-1 rounded-lg border border-line bg-paper px-3 py-2 outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-ink px-4 py-2 text-sm text-paper transition-colors hover:bg-accent-strong disabled:opacity-50"
        >
          Save
        </button>
      </div>
      {state?.success && <p className="text-xs text-moss">Saved.</p>}
    </form>
  );
}
