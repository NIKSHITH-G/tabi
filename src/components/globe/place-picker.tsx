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
  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState<string | null>(null);

  function handleLocateMe() {
    if (!navigator.geolocation) {
      setLocateError("Your browser doesn't support location.");
      return;
    }
    setLocating(true);
    setLocateError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onChange(position.coords.latitude, position.coords.longitude);
        setLocating(false);
      },
      (error) => {
        setLocating(false);
        setLocateError(
          error.code === error.PERMISSION_DENIED
            ? "Location permission denied — pick manually below."
            : "Couldn't get your location — pick manually below.",
        );
      },
      { enableHighAccuracy: false, timeout: 10_000 },
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={handleLocateMe}
        disabled={locating}
        className="flex items-center justify-center gap-2 self-start rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-accent-strong disabled:opacity-50"
      >
        {locating ? "Finding you…" : "📍 Use my current location"}
      </button>
      {locateError && <p className="text-xs text-accent-strong">{locateError}</p>}

      {!manual && webglOk && (
        <>
          <p className="text-xs text-ink-muted">or click the globe to drop a pin</p>
          <div className="relative h-64 w-full overflow-hidden rounded-xl border border-line bg-ink">
            <Canvas camera={{ position: [0, 0, 4], fov: 40 }} dpr={[1, 1.5]}>
              <PlacePickerScene picked={value} onPick={(lat, lng) => onChange(lat, lng)} />
            </Canvas>
          </div>
        </>
      )}

      {(manual || !webglOk) && (
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
      )}

      <div className="flex items-center justify-between text-xs text-ink-muted">
        <span>
          {value ? `${value.lat.toFixed(2)}°, ${value.lng.toFixed(2)}°` : "No location picked yet"}
        </span>
        {webglOk && (
          <button type="button" onClick={() => setManual((m) => !m)} className="hover:text-ink">
            {manual ? "Use the globe instead" : "Enter coordinates manually"}
          </button>
        )}
      </div>
    </div>
  );
}
