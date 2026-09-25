"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { PAPER_COLOR, type GlobeThemeConfig } from "./themes";

export const RADIUS = 1.6;
export const PAPER = PAPER_COLOR;
export const ACCENT = "#e08148";

const EARTH_DAY_TEXTURE = "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg";

// The real, photographic Earth — goes inside the rotating group so it spins
// on its axis. Everything decorative (stand, moons, stars) stays outside that
// group so only the planet itself turns.
export function EarthSphere({
  theme,
  onSurfaceClick,
}: {
  theme: GlobeThemeConfig;
  onSurfaceClick?: (localPoint: THREE.Vector3) => void;
}) {
  const dayMap = useTexture(EARTH_DAY_TEXTURE);

  return (
    <>
      <mesh
        onClick={
          onSurfaceClick
            ? (e) => {
                e.stopPropagation();
                onSurfaceClick(e.object.worldToLocal(e.point.clone()));
              }
            : undefined
        }
      >
        <sphereGeometry args={[RADIUS, 64, 64]} />
        <meshStandardMaterial map={dayMap} roughness={0.8} metalness={0} />
      </mesh>

      {theme.atmosphereOpacity > 0 && (
        <mesh scale={1.1}>
          <sphereGeometry args={[RADIUS, 32, 32]} />
          <meshBasicMaterial
            color={theme.atmosphereColor}
            transparent
            opacity={theme.atmosphereOpacity}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>
      )}
    </>
  );
}

// Computed once at module load (not during render) since eslint's purity
// rule disallows Math.random() anywhere reachable from a component/hook body.
const STAR_POSITIONS = (() => {
  const count = 400;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 8 + Math.random() * 6;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.cos(phi);
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  return positions;
})();

// Fixed in world space — does not rotate with the Earth.
export function Starfield() {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(STAR_POSITIONS, 3));

  return (
    <points geometry={geometry}>
      <pointsMaterial color={PAPER} size={0.02} transparent opacity={0.5} depthWrite={false} />
    </points>
  );
}

function Moon({ radius, speed, tilt }: { radius: number; speed: number; tilt: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime * speed;
    ref.current.position.set(
      Math.cos(t) * radius,
      Math.sin(tilt) * radius * 0.3,
      Math.sin(t) * radius,
    );
  });
  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#cfc9c0" roughness={0.9} />
      </mesh>
    </group>
  );
}

// Fixed in world space — orbits are independent of the Earth's own spin.
export function Moons() {
  return (
    <>
      <Moon radius={RADIUS * 1.8} speed={0.25} tilt={0.3} />
      <Moon radius={RADIUS * 2.3} speed={-0.15} tilt={-0.5} />
    </>
  );
}

// Fixed in world space — a table globe's stand does not spin, only the ball does.
export function TableBase() {
  return (
    <group position={[0, -RADIUS * 1.05, 0]}>
      <mesh>
        <cylinderGeometry args={[RADIUS * 0.55, RADIUS * 0.7, RADIUS * 0.12, 32]} />
        <meshStandardMaterial color="#2a1c12" roughness={0.7} />
      </mesh>
      <mesh position={[0, RADIUS * 0.35, 0]}>
        <cylinderGeometry args={[0.04, 0.06, RADIUS * 0.7, 16]} />
        <meshStandardMaterial color="#4a3524" roughness={0.6} metalness={0.2} />
      </mesh>
    </group>
  );
}
