"use client";

import dynamic from "next/dynamic";
import type { GlobePlace } from "./tabi-globe";
import type { GlobeThemeId } from "./themes";

const TabiGlobe = dynamic(
  () => import("./tabi-globe").then((mod) => mod.TabiGlobe),
  {
    ssr: false,
    loading: () => <div className="h-[100dvh] w-full animate-pulse bg-ink" />,
  },
);

export function GlobeLoader(props: {
  worldId: string;
  username: string;
  displayName: string;
  places: GlobePlace[];
  isOwner: boolean;
  stats?: { photos: number; notes: number; diaryEntries: number };
  initialTheme: GlobeThemeId;
}) {
  return <TabiGlobe {...props} />;
}
