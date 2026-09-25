"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { GlobeScene } from "./globe-scene";
import type { GlobePlace } from "./tabi-globe";

const DEMO_PLACES: GlobePlace[] = [
  { slug: "tokyo", name: "Tokyo", latitude: 35.6762, longitude: 139.6503 },
  { slug: "melbourne", name: "Melbourne", latitude: -37.8136, longitude: 144.9631 },
  { slug: "paris", name: "Paris", latitude: 48.8566, longitude: 2.3522 },
  { slug: "new-york", name: "New York", latitude: 40.7128, longitude: -74.006 },
];

export function DemoGlobe() {
  const [selected, setSelected] = useState<GlobePlace | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setSelected(DEMO_PLACES[0]), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative aspect-square w-full max-w-md">
      <Canvas camera={{ position: [0, 0, 4], fov: 40 }} dpr={[1, 1.5]}>
        <GlobeScene
          places={DEMO_PLACES}
          selectedPlace={selected}
          onSelect={setSelected}
          reducedMotion={false}
        />
      </Canvas>

      {selected && (
        <div className="pointer-events-none absolute bottom-2 left-2 rounded-lg border border-paper/20 bg-ink/80 px-3 py-2 backdrop-blur-sm">
          <p className="font-display text-sm text-paper">{selected.name}</p>
          <p className="text-[10px] uppercase tracking-wide text-accent">
            3 memories
          </p>
        </div>
      )}
    </div>
  );
}
