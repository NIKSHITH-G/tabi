"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { checkUsernameAvailable } from "@/lib/actions";

type CheckResult = { value: string; valid: boolean; available?: boolean };

export function ClaimInput({ href }: { href: string }) {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<CheckResult | null>(null);

  useEffect(() => {
    if (value.trim().length < 3) return;
    const t = setTimeout(() => {
      checkUsernameAvailable(value).then((r) => {
        setResult({ value, valid: r.valid, available: r.available });
      });
    }, 350);
    return () => clearTimeout(t);
  }, [value]);

  const trimmed = value.trim();
  let status: "idle" | "checking" | "available" | "taken" | "invalid" = "idle";
  if (trimmed.length >= 3) {
    status =
      result && result.value === value
        ? !result.valid
          ? "invalid"
          : result.available
            ? "available"
            : "taken"
        : "checking";
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-stretch gap-3">
        <div className="flex h-12 items-center overflow-hidden rounded-full border border-line bg-paper">
          <span className="pl-4 pr-1 text-ink-muted">tabi.app/</span>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="yourname"
            className="h-full w-32 bg-transparent pr-4 outline-none placeholder:text-ink-muted/60"
          />
        </div>
        <Link
          href={href}
          className="flex h-12 items-center rounded-full bg-accent px-6 font-medium text-paper transition-colors hover:bg-accent-strong"
        >
          Claim your world
        </Link>
      </div>
      <p className="h-4 pl-1 text-xs">
        {status === "checking" && (
          <span className="text-ink-muted">Checking…</span>
        )}
        {status === "available" && (
          <span className="text-moss">✓ tabi.app/{value} is available</span>
        )}
        {status === "taken" && (
          <span className="text-accent-strong">That name is taken</span>
        )}
        {status === "invalid" && (
          <span className="text-ink-muted">
            Lowercase letters, numbers, hyphens — 3+ characters
          </span>
        )}
      </p>
    </div>
  );
}
