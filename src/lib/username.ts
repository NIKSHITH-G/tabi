import { z } from "zod";

// Routes and words a username must never shadow or impersonate.
export const RESERVED_USERNAMES = new Set([
  "admin",
  "api",
  "app",
  "onboarding",
  "settings",
  "sign-in",
  "sign-up",
  "world",
  "worlds",
  "tabi",
  "about",
  "help",
  "support",
  "privacy",
  "terms",
  "sso-callback",
  "root",
  "null",
  "undefined",
]);

export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Must be at least 3 characters")
  .max(24, "Must be 24 characters or fewer")
  .regex(
    /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
    "Only lowercase letters, numbers, and hyphens (no leading/trailing hyphen)",
  )
  .refine((value) => !RESERVED_USERNAMES.has(value), {
    message: "That name is reserved",
  });
