"use client";

import dynamic from "next/dynamic";

const PlacePicker = dynamic(
  () => import("./place-picker").then((mod) => mod.PlacePicker),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 w-full animate-pulse rounded-xl border border-line bg-ink/90" />
    ),
  },
);

export function PlacePickerLoader(props: {
  value: { lat: number; lng: number } | null;
  onChange: (lat: number, lng: number) => void;
}) {
  return <PlacePicker {...props} />;
}
