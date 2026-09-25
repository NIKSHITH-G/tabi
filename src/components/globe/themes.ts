export type GlobeThemeId = "CLASSIC" | "TABLE" | "MOONS" | "SATELLITE";

export type GlobeThemeConfig = {
  id: GlobeThemeId;
  label: string;
  accentColor: string;
  atmosphereColor: string;
  /** 0 disables the glow entirely (flat/indoor looks don't want one). */
  atmosphereOpacity: number;
  showBase: boolean;
  showMoons: boolean;
  showStars: boolean;
  /** Multiplier on the default camera distance — <1 zooms in. */
  cameraDistance: number;
};

const PAPER = "#faf6ef";

export const GLOBE_THEMES: Record<GlobeThemeId, GlobeThemeConfig> = {
  CLASSIC: {
    id: "CLASSIC",
    label: "Classic",
    accentColor: "#e08148",
    atmosphereColor: "#7fb3e0",
    atmosphereOpacity: 0.15,
    showBase: false,
    showMoons: false,
    showStars: true,
    cameraDistance: 1,
  },
  TABLE: {
    id: "TABLE",
    label: "Table Globe",
    accentColor: "#e08148",
    atmosphereColor: "#e08148",
    atmosphereOpacity: 0,
    showBase: true,
    showMoons: false,
    showStars: false,
    cameraDistance: 1,
  },
  MOONS: {
    id: "MOONS",
    label: "Moons",
    accentColor: "#e08148",
    atmosphereColor: "#8891c9",
    atmosphereOpacity: 0.18,
    showBase: false,
    showMoons: true,
    showStars: true,
    cameraDistance: 1.15,
  },
  SATELLITE: {
    id: "SATELLITE",
    label: "Satellite",
    accentColor: "#ffcc4d",
    atmosphereColor: "#7fb3e0",
    atmosphereOpacity: 0,
    showBase: false,
    showMoons: false,
    showStars: false,
    cameraDistance: 0.7,
  },
};

export const PAPER_COLOR = PAPER;
