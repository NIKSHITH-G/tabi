"use client";

import dynamic from "next/dynamic";
import type { GlobePlace } from "./tabi-globe";

const TabiGlobe = dynamic(
  () => import("./tabi-globe").then((mod) => mod.TabiGlobe),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto h-[420px] w-full max-w-5xl animate-pulse rounded-2xl border border-line bg-ink/90 sm:h-[560px]" />
    ),
  },
);

export function GlobeLoader({
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
  return <TabiGlobe username={username} places={places} isOwner={isOwner} stats={stats} />;
}
