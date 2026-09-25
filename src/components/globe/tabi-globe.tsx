"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Link from "next/link";
import { GlobeScene } from "./globe-scene";

export type GlobePlace = {
  slug: string;
  name: string;
  latitude: number;
  longitude: number;
};

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export function TabiGlobe({
  username,
  places,
  isOwner,
  stats,
}: {
  username: string;
  places: GlobePlace[];
  isOwner: boolean;
  stats?: { photos: number; notes: number; diaryEntries: number };
}) {
  // This component is dynamically imported with ssr:false, so it only ever
  // renders in the browser — safe to read window/document in lazy initializers.
  const [webglOk] = useState(() => supportsWebGL());
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [selectedPlace, setSelectedPlace] = useState<GlobePlace | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const statsLine = stats
    ? [
        `${places.length} ${places.length === 1 ? "place" : "places"}`,
        `${stats.photos} ${stats.photos === 1 ? "photo" : "photos"}`,
        `${stats.notes} ${stats.notes === 1 ? "note" : "notes"}`,
        `${stats.diaryEntries} diary`,
      ].join(" · ")
    : null;

  return (
    <div className="mx-auto w-full max-w-5xl px-6">
      {isOwner && (
        <div className="mb-3 flex items-center justify-between">
          {statsLine && <p className="text-sm text-ink-muted">{statsLine}</p>}
          <Link
            href={`/${username}/place/new`}
            className="ml-auto rounded-full bg-accent px-4 py-1.5 text-sm text-paper transition-colors hover:bg-accent-strong"
          >
            + Add a place
          </Link>
        </div>
      )}

      {webglOk === false ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-ink-muted">
            Your browser can&apos;t render the globe — here are your places instead.
          </p>
          {places.length === 0 ? (
            <EmptyPrompt username={username} isOwner={isOwner} />
          ) : (
            <ul className="flex flex-col gap-1 text-sm">
              {places.map((p) => (
                <li key={p.slug}>
                  <Link href={`/${username}/place/${p.slug}`} className="hover:text-accent">
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="relative">
          {/* Soft warm glow behind the card so the dark globe doesn't read as
              a hole punched in the cream page. */}
          <div
            className="pointer-events-none absolute -inset-6 rounded-[2rem] opacity-40 blur-2xl"
            style={{
              background:
                "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)",
            }}
          />
          <div className="relative h-[420px] w-full overflow-hidden rounded-2xl border border-line bg-ink shadow-xl sm:h-[560px]">
            <Canvas camera={{ position: [0, 0, 4], fov: 40 }} dpr={[1, 1.5]}>
              <GlobeScene
                places={places}
                selectedPlace={selectedPlace}
                onSelect={setSelectedPlace}
                reducedMotion={reducedMotion}
              />
            </Canvas>

            {places.length === 0 && (
              <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center">
                <div className="pointer-events-auto">
                  <EmptyPrompt username={username} isOwner={isOwner} dark />
                </div>
              </div>
            )}

            {selectedPlace && (
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 rounded-xl border border-paper/20 bg-ink/80 p-4 backdrop-blur-sm sm:right-auto sm:min-w-[260px]">
                <div>
                  <p className="font-display text-lg text-paper">{selectedPlace.name}</p>
                  <Link
                    href={`/${username}/place/${selectedPlace.slug}`}
                    className="text-xs text-accent hover:text-accent-strong"
                  >
                    Open this place →
                  </Link>
                </div>
                <button
                  onClick={() => setSelectedPlace(null)}
                  className="text-paper/60 hover:text-paper"
                  aria-label="Deselect"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyPrompt({
  username,
  isOwner,
  dark,
}: {
  username: string;
  isOwner: boolean;
  dark?: boolean;
}) {
  if (!isOwner) return null;
  return (
    <Link
      href={`/${username}/place/new`}
      className={
        dark
          ? "rounded-full bg-accent px-5 py-2 text-sm text-paper transition-colors hover:bg-accent-strong"
          : "self-start rounded-full bg-accent px-5 py-2 text-sm text-paper hover:bg-accent-strong"
      }
    >
      Where do you live? →
    </Link>
  );
}
