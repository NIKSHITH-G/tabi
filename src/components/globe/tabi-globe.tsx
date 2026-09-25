"use client";

import { useEffect, useState, useTransition } from "react";
import { Canvas } from "@react-three/fiber";
import Link from "next/link";
import { GlobeScene } from "./globe-scene";
import { GLOBE_THEMES, type GlobeThemeId } from "./themes";
import { updateGlobeTheme } from "@/lib/canvas-actions";

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
  worldId,
  username,
  displayName,
  places,
  isOwner,
  stats,
  initialTheme,
}: {
  worldId: string;
  username: string;
  displayName: string;
  places: GlobePlace[];
  isOwner: boolean;
  stats?: { photos: number; notes: number; diaryEntries: number };
  initialTheme: GlobeThemeId;
}) {
  // This component is dynamically imported with ssr:false, so it only ever
  // renders in the browser — safe to read window/document in lazy initializers.
  const [webglOk] = useState(() => supportsWebGL());
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [selectedPlace, setSelectedPlace] = useState<GlobePlace | null>(null);
  const [theme, setTheme] = useState<GlobeThemeId>(initialTheme);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  function handleThemeChange(next: GlobeThemeId) {
    setTheme(next);
    startTransition(async () => {
      await updateGlobeTheme(worldId, next);
    });
  }

  const totalContent = stats
    ? places.length + stats.photos + stats.notes + stats.diaryEntries
    : 0;
  const statsLine =
    stats && totalContent > 0
      ? [
          `${places.length} ${places.length === 1 ? "place" : "places"}`,
          `${stats.photos} ${stats.photos === 1 ? "photo" : "photos"}`,
          `${stats.notes} ${stats.notes === 1 ? "note" : "notes"}`,
          `${stats.diaryEntries} diary`,
        ].join(" · ")
      : null;

  if (webglOk === false) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-6 py-16">
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
    );
  }

  const cameraZ = 4 * GLOBE_THEMES[theme].cameraDistance;

  return (
    <div
      className="relative h-[100dvh] w-full overflow-hidden"
      style={{ background: GLOBE_THEMES[theme].backgroundCss }}
    >
      <Canvas camera={{ position: [0, 0, cameraZ], fov: 40 }} dpr={[1, 1.5]}>
        <GlobeScene
          places={places}
          selectedPlace={selectedPlace}
          onSelect={setSelectedPlace}
          reducedMotion={reducedMotion}
          themeId={theme}
        />
      </Canvas>

      {/* Title overlay */}
      <div className="pointer-events-none absolute left-0 top-0 flex flex-col gap-1 p-6 sm:p-10">
        <p className="font-display text-sm uppercase tracking-[0.2em] text-accent">
          tabi.app/{username}
        </p>
        <h1 className="font-display text-3xl text-paper sm:text-4xl">
          {displayName}&apos;s world
        </h1>
        {statsLine && <p className="mt-1 text-sm text-paper/60">{statsLine}</p>}
      </div>

      {/* Theme switcher (owner only) */}
      {isOwner && (
        <div className="absolute right-6 top-6 flex flex-col gap-2 sm:right-10 sm:top-10">
          {(Object.keys(GLOBE_THEMES) as GlobeThemeId[]).map((id) => (
            <button
              key={id}
              onClick={() => handleThemeChange(id)}
              className={
                theme === id
                  ? "rounded-full bg-paper px-3 py-1 text-xs text-ink"
                  : "rounded-full border border-paper/30 px-3 py-1 text-xs text-paper/70 hover:border-paper/60 hover:text-paper"
              }
            >
              {GLOBE_THEMES[id].label}
            </button>
          ))}
        </div>
      )}

      {/* Add-place CTA (owner only) */}
      {isOwner && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 sm:bottom-28">
          <EmptyPrompt username={username} isOwner={isOwner} />
        </div>
      )}

      {selectedPlace && (
        <div className="absolute bottom-24 left-4 right-4 flex items-end justify-between gap-4 rounded-xl border border-paper/20 bg-ink/80 p-4 backdrop-blur-sm sm:bottom-28 sm:left-10 sm:right-auto sm:min-w-[260px]">
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

      {/* Scroll hint */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 flex flex-col items-center gap-1 text-paper/50">
        <p className="text-xs uppercase tracking-[0.2em]">Customize your space</p>
        <span className="text-lg">↓</span>
      </div>
    </div>
  );
}

function EmptyPrompt({
  username,
  isOwner,
}: {
  username: string;
  isOwner: boolean;
}) {
  if (!isOwner) return null;
  return (
    <Link
      href={`/${username}/place/new`}
      className="pointer-events-auto rounded-full bg-accent px-5 py-2 text-sm text-paper transition-colors hover:bg-accent-strong"
    >
      Where do you live? →
    </Link>
  );
}
