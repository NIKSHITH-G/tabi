"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PlacePickerScene } from "./place-picker-scene";

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

export function PlacePicker({
  value,
  onChange,
}: {
  value: { lat: number; lng: number } | null;
  onChange: (lat: number, lng: number) => void;
}) {
  // This component is only ever mounted client-side via next/dynamic
  // ({ ssr: false }), so reading window here on first render is safe.
  const [webglOk] = useState(() => supportsWebGL());
  const [manual, setManual] = useState(false);

  if (!webglOk || manual) {
    return (
      <div className="flex flex-col gap-2">
        {webglOk && (
          <button
            type="button"
            onClick={() => setManual(false)}
            className="self-start text-xs text-accent hover:text-accent-strong"
          >
            ← Use the globe instead
          </button>
        )}
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-sm">
            Latitude
            <input
              type="number"
              step="any"
              min={-90}
              max={90}
              value={value?.lat ?? ""}
              onChange={(e) => onChange(Number(e.target.value), value?.lng ?? 0)}
              className="rounded-lg border border-line bg-paper-raised px-3 py-2 outline-none focus:border-accent"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Longitude
            <input
              type="number"
              step="any"
              min={-180}
              max={180}
              value={value?.lng ?? ""}
              onChange={(e) => onChange(value?.lat ?? 0, Number(e.target.value))}
              className="rounded-lg border border-line bg-paper-raised px-3 py-2 outline-none focus:border-accent"
            />
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="relative h-64 w-full overflow-hidden rounded-xl border border-line bg-ink">
        <Canvas camera={{ position: [0, 0, 4], fov: 40 }} dpr={[1, 1.5]}>
          <PlacePickerScene
            picked={value}
            onPick={(lat, lng) => onChange(lat, lng)}
          />
        </Canvas>
        {!value && (
          <p className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-xs text-paper/70">
            Click the globe to drop a pin
          </p>
        )}
      </div>
      <div className="flex items-center justify-between text-xs text-ink-muted">
        <span>
          {value
            ? `${value.lat.toFixed(2)}°, ${value.lng.toFixed(2)}°`
            : "No location picked yet"}
        </span>
        <button
          type="button"
          onClick={() => setManual(true)}
          className="hover:text-ink"
        >
          Enter coordinates manually
        </button>
      </div>
    </div>
  );
}
