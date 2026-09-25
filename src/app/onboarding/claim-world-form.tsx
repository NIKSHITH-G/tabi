"use client";

import { useActionState } from "react";
import { claimWorld } from "@/lib/actions";

export function ClaimWorldForm() {
  const [state, formAction, isPending] = useActionState(claimWorld, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div className="flex items-center overflow-hidden rounded-full border border-line bg-paper-raised focus-within:border-accent">
        <span className="pl-4 pr-1 text-ink-muted">tabi.app/</span>
        <input
          name="username"
          type="text"
          required
          minLength={3}
          maxLength={24}
          pattern="[a-z0-9][a-z0-9-]*[a-z0-9]"
          placeholder="yourname"
          autoFocus
          className="w-full bg-transparent py-3 pr-4 outline-none placeholder:text-ink-muted/60"
        />
      </div>
      {state?.error && (
        <p role="alert" className="text-sm text-accent-strong">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-ink px-6 py-3 font-medium text-paper transition-colors hover:bg-accent-strong disabled:opacity-50"
      >
        {isPending ? "Creating your world…" : "Enter Tabi"}
      </button>
    </form>
  );
}
