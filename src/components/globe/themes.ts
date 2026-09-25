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
  /**
   * Day/night terminator with city lights on the dark side — a real sun
   * direction relative to the spinning planet. Only makes sense for "planet
   * floating in space" themes; an indoor table globe or a flat satellite-
   * photo view should just be evenly, brightly lit instead.
   */
  dayNightCycle: boolean;
};

const PAPER = "#faf6ef";

export const GLOBE_THEMES: Record<GlobeThemeId, GlobeThemeConfig> = {
  CLASSIC: {
    id: "CLASSIC",
    label: "Classic",
    accentColor: "#e08148",
    atmosphereColor: "#7fb3e0",
    atmosphereOpacity: 0.9,
    showBase: false,
    showMoons: false,
    showStars: true,
    cameraDistance: 1,
    dayNightCycle: true,
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
    dayNightCycle: false,
  },
  MOONS: {
    id: "MOONS",
    label: "Moons",
    accentColor: "#e08148",
    atmosphereColor: "#8891c9",
    atmosphereOpacity: 0.9,
    showBase: false,
    showMoons: true,
    showStars: true,
    cameraDistance: 1.15,
    dayNightCycle: true,
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
    dayNightCycle: false,
  },
};

export const PAPER_COLOR = PAPER;
