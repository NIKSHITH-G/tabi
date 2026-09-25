// Vercel writes Neon + Clerk credentials to .env.local, not .env — point dotenv there.
import { config } from "dotenv";
config({ path: ".env.local" });

import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Direct (unpooled) connection: required for migrations against Neon.
    url: process.env["DATABASE_URL_UNPOOLED"],
  },
});
