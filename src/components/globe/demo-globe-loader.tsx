"use client";

import dynamic from "next/dynamic";

const DemoGlobe = dynamic(
  () => import("./demo-globe").then((mod) => mod.DemoGlobe),
  {
    ssr: false,
    loading: () => (
      <div className="aspect-square w-full max-w-md animate-pulse rounded-full bg-ink/90" />
    ),
  },
);

export function DemoGlobeLoader() {
  return <DemoGlobe />;
}
