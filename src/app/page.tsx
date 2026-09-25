import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { DemoGlobeLoader } from "@/components/globe/demo-globe-loader";
import { ClaimInput } from "@/components/landing/claim-input";
import {
  ConnectIcon,
  ConnectionsIcon,
  CreateIcon,
  CustomizeIcon,
  ExploreIcon,
  PlaceIcon,
  SpaceIcon,
  TimeIcon,
} from "@/components/landing/icons";

const dimensions = [
  {
    name: "Space",
    detail: "Where it happened — a city, a café, a trail, a home.",
    Icon: SpaceIcon,
  },
  {
    name: "Time",
    detail: "When it happened — a date, a season, a chapter of your life.",
    Icon: TimeIcon,
  },
  {
    name: "Connections",
    detail: "What it's tied to — a photo to a place, a place to a story.",
    Icon: ConnectionsIcon,
  },
];

const steps = [
  { name: "Create", detail: "Drop in a photo, note, or idea.", Icon: CreateIcon },
  { name: "Place", detail: "Tie it to a location on your globe.", Icon: PlaceIcon },
  { name: "Connect", detail: "Link it to a date, a diary entry, a song.", Icon: ConnectIcon },
  { name: "Customize", detail: "Arrange it your way — it's your world.", Icon: CustomizeIcon },
  { name: "Explore", detail: "Wander back through your own life, later.", Icon: ExploreIcon },
];

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <span className="font-display text-xl tracking-tight">tabi</span>
        <nav className="flex items-center gap-6 text-sm">
          {userId ? (
            <Link href="/onboarding" className="text-ink-muted hover:text-ink">
              Enter your world
            </Link>
          ) : (
            <>
              <Link href="/sign-in" className="text-ink-muted hover:text-ink">
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="rounded-full bg-ink px-4 py-2 text-paper hover:bg-accent-strong transition-colors"
              >
                Start your Tabi
              </Link>
            </>
          )}
        </nav>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-28 px-6 pb-24 pt-8">
        {/* Hero */}
        <section className="relative grid gap-10 overflow-hidden lg:grid-cols-2 lg:items-center">
          <span
            aria-hidden
            className="pointer-events-none absolute -left-10 -top-24 select-none font-display text-[22rem] leading-none text-ink/[0.04]"
          >
            旅
          </span>

          <div className="relative flex flex-col gap-6">
            <p className="font-display text-sm tracking-[0.2em] text-accent uppercase">
              旅 · journey
            </p>
            <h1 className="font-display text-5xl leading-[1.05] sm:text-6xl">
              Your life is a journey.
              <br />
              Tabi is where it lives.
            </h1>
            <p className="max-w-xl text-lg text-ink-muted">
              A personal digital world — not a blog, not a photo app, not
              another dashboard. A place you build yourself, out of the photos,
              notes, places, and memories that make up your life.
            </p>

            <div className="mt-2">
              <ClaimInput href={userId ? "/onboarding" : "/sign-up"} />
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <DemoGlobeLoader />
          </div>
        </section>

        {/* Dimensions */}
        <section className="grid gap-10 sm:grid-cols-3">
          {dimensions.map((d) => (
            <div key={d.name} className="flex flex-col gap-3">
              <d.Icon className="h-7 w-7 text-accent" />
              <h2 className="font-display text-2xl">{d.name}</h2>
              <p className="max-w-xs text-base text-[#BDB4A6]">{d.detail}</p>
            </div>
          ))}
        </section>

        {/* Steps */}
        <section className="flex flex-col gap-8 border-t border-line pt-16">
          <h2 className="font-display text-2xl">How it works</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((step) => (
              <div
                key={step.name}
                className="flex flex-col gap-3 rounded-2xl border border-line bg-paper-raised p-5"
              >
                <step.Icon className="h-6 w-6 text-accent" />
                <p className="font-display text-lg">{step.name}</p>
                <p className="text-sm text-ink-muted">{step.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Real example world */}
        <section className="flex flex-col gap-6 border-t border-line pt-16">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-2xl">Take a look at tabi.app/aiko</h2>
            <p className="max-w-xl text-base text-[#BDB4A6]">
              A real Tabi, not a mockup. See what a world can look like once
              it&apos;s had a little time to grow.
            </p>
          </div>
          <Link
            href="/aiko"
            className="group flex items-center justify-between rounded-2xl border border-line bg-paper-raised p-6 transition-colors hover:border-accent"
          >
            <div>
              <p className="font-display text-xl">Aiko&apos;s world</p>

              <p className="text-sm text-ink-muted">
                Tokyo, Kyoto, Lisbon — photos, notes, and a few places worth
                remembering.
              </p>
            </div>
            <span className="text-accent transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </section>

        {/* Ending */}
        <section className="flex flex-col items-center gap-6 border-t border-line pt-16 text-center">
          <h2 className="font-display text-3xl">Your world is waiting.</h2>
          <ClaimInput href={userId ? "/onboarding" : "/sign-up"} />
        </section>
      </main>

      <footer className="border-t border-line px-6 py-8 text-center text-xs text-ink-muted">
        旅 Tabi — your journey, your world.
      </footer>
    </div>
  );
}
