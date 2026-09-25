# Tabi (旅)

A personal digital world — the place on the internet where your photos, notes,
places, and memories live, connected. Not a blog, not a photo app, not another
dashboard.

Every user gets a permanent world at `tabi.app/<username>`, built from real
objects (photos, notes, diary entries, places) that exist independently of
however they're displayed — a canvas of movable widgets, or a 3D globe
showing where those memories happened.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, TypeScript, Tailwind v4)
- [Prisma 7](https://www.prisma.io) + [Neon Postgres](https://neon.tech)
- [Clerk](https://clerk.com) for authentication
- [Three.js](https://threejs.org) + [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) for the globe
- Deployed on [Vercel](https://vercel.com)

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Requires a `.env.local` with `DATABASE_URL` / `DATABASE_URL_UNPOOLED` (Neon)
and `CLERK_SECRET_KEY` / `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (Clerk) — see
`vercel env pull` if the project is linked to Vercel.

Database schema lives in `prisma/schema.prisma`; after changing it, run:

```bash
npx prisma migrate dev --config prisma7.config.ts
```

## Project status

Built incrementally, one version at a time:

- **V0.1 — Foundation**: auth, user/world model, personal world URL
- **V0.2 — Your First Tabi**: draggable/resizable widget canvas
- **V0.3 — Tabi Objects**: real Photo/Note/DiaryEntry/Place objects with permanent URLs
- **V0.4 — The Tabi Globe**: 3D globe as the primary interface for the Space dimension

Connections between objects, timelines, journeys, sharing, and search are
planned but not yet built.
