// Deliberately simplified continent silhouettes — not survey-accurate, just
// recognizable enough to spot "roughly my part of the world" on a stylized
// globe. [lng, lat] rings, rough and hand-authored.
const CONTINENT_RINGS: [number, number][][] = [
  // North America
  [
    [-165, 68], [-150, 60], [-130, 55], [-125, 48], [-124, 40], [-117, 32],
    [-105, 20], [-97, 18], [-90, 16], [-80, 25], [-75, 35], [-70, 45],
    [-65, 50], [-60, 55], [-70, 60], [-90, 68], [-120, 70], [-165, 68],
  ],
  // South America
  [
    [-80, 10], [-70, 5], [-60, 5], [-50, 0], [-35, -5], [-35, -15],
    [-40, -23], [-48, -25], [-58, -35], [-65, -45], [-70, -53], [-75, -45],
    [-78, -30], [-80, -15], [-80, 10],
  ],
  // Africa
  [
    [-17, 15], [-10, 5], [10, 5], [10, -5], [15, -25], [18, -35],
    [30, -30], [40, -15], [45, 0], [50, 10], [43, 15], [35, 20],
    [32, 30], [10, 37], [-5, 35], [-10, 30], [-17, 15],
  ],
  // Europe
  [
    [-10, 36], [-5, 43], [0, 50], [10, 55], [20, 60], [30, 60],
    [40, 55], [35, 45], [25, 40], [15, 38], [0, 38], [-10, 36],
  ],
  // Asia (incl. Russia, China, India, SE Asia)
  [
    [30, 60], [50, 65], [70, 70], [100, 72], [140, 65], [150, 55],
    [140, 45], [130, 35], [125, 30], [120, 20], [105, 10], [95, 5],
    [80, 8], [70, 20], [65, 25], [60, 25], [50, 30], [45, 35],
    [35, 40], [30, 50], [30, 60],
  ],
  // Australia
  [
    [113, -22], [125, -15], [135, -12], [145, -15], [153, -27],
    [150, -38], [140, -38], [130, -32], [115, -33], [113, -22],
  ],
];

function pointInRing(lng: number, lat: number, ring: [number, number][]) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersect =
      yi > lat !== yj > lat &&
      lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

let cachedDots: { lat: number; lng: number }[] | null = null;

// A grid of lat/lng points sampled at `step` degrees, kept only where they
// fall inside one of the rough continent rings above.
export function getContinentDots(step = 3.5): { lat: number; lng: number }[] {
  if (cachedDots) return cachedDots;
  const dots: { lat: number; lng: number }[] = [];
  for (let lat = -85; lat <= 85; lat += step) {
    for (let lng = -180; lng <= 180; lng += step) {
      if (CONTINENT_RINGS.some((ring) => pointInRing(lng, lat, ring))) {
        dots.push({ lat, lng });
      }
    }
  }
  cachedDots = dots;
  return dots;
}
