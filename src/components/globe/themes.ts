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
  /** Multiplies the day texture — a warm tan/orange tint for a physical
   * decorative-globe look instead of a cool photographic satellite tone. */
  sphereTint: string;
  /** CSS background behind the canvas — dark space, or a warm indoor tone. */
  backgroundCss: string;
};

const PAPER = "#faf6ef";
const SPACE_BG = "#0e0c0a";

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
    sphereTint: "#ffffff",
    backgroundCss: SPACE_BG,
  },
  TABLE: {
    id: "TABLE",
    label: "Table Globe",
    accentColor: "#c97b3d",
    atmosphereColor: "#e08148",
    atmosphereOpacity: 0,
    showBase: true,
    showMoons: false,
    showStars: false,
    cameraDistance: 1,
    sphereTint: "#f0c894",
    backgroundCss:
      "radial-gradient(circle at 50% 35%, #4a3423 0%, #2c1f16 55%, #1a120c 100%)",
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
    sphereTint: "#ffffff",
    backgroundCss: SPACE_BG,
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
    sphereTint: "#ffffff",
    backgroundCss: SPACE_BG,
  },
};

export const PAPER_COLOR = PAPER;
