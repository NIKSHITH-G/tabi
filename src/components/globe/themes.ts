export type GlobeThemeId = "CLASSIC" | "TABLE" | "MOONS" | "SATELLITE";

export type GlobeThemeConfig = {
  id: GlobeThemeId;
  label: string;
  sphereColor: string;
  accentColor: string;
  atmosphereColor: string;
  atmosphereOpacity: number;
  continentOpacity: number;
  showBase: boolean;
  showMoons: boolean;
  showStars: boolean;
  showOrbitRing: boolean;
};

const PAPER = "#faf6ef";

export const GLOBE_THEMES: Record<GlobeThemeId, GlobeThemeConfig> = {
  CLASSIC: {
    id: "CLASSIC",
    label: "Classic",
    sphereColor: "#211d1a",
    accentColor: "#e08148",
    atmosphereColor: "#e08148",
    atmosphereOpacity: 0.06,
    continentOpacity: 0.35,
    showBase: false,
    showMoons: false,
    showStars: false,
    showOrbitRing: false,
  },
  TABLE: {
    id: "TABLE",
    label: "Table Globe",
    sphereColor: "#3a2a1c",
    accentColor: "#d99a52",
    atmosphereColor: "#d99a52",
    atmosphereOpacity: 0.03,
    continentOpacity: 0.4,
    showBase: true,
    showMoons: false,
    showStars: false,
    showOrbitRing: false,
  },
  MOONS: {
    id: "MOONS",
    label: "Moons",
    sphereColor: "#1a1a22",
    accentColor: "#e08148",
    atmosphereColor: "#8891c9",
    atmosphereOpacity: 0.08,
    continentOpacity: 0.35,
    showBase: false,
    showMoons: true,
    showStars: true,
    showOrbitRing: false,
  },
  SATELLITE: {
    id: "SATELLITE",
    label: "Satellite",
    sphereColor: "#10181c",
    accentColor: "#6fd3d9",
    atmosphereColor: "#6fd3d9",
    atmosphereOpacity: 0.1,
    continentOpacity: 0.55,
    showBase: false,
    showMoons: false,
    showStars: true,
    showOrbitRing: true,
  },
};

export const PAPER_COLOR = PAPER;
