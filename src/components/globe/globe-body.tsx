"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { latLngToVector3 } from "@/lib/geo";
import { getContinentDots } from "@/lib/continents";
import { GLOBE_THEMES, PAPER_COLOR, type GlobeThemeConfig } from "./themes";

export const RADIUS = 1.6;
export const INK = "#211d1a";
export const PAPER = PAPER_COLOR;
export const ACCENT = "#e08148";

function ContinentDots({ theme }: { theme: GlobeThemeConfig }) {
  const geometry = useMemo(() => {
    const dots = getContinentDots();
    const positions = new Float32Array(dots.length * 3);
    dots.forEach((d, i) => {
      const v = latLngToVector3(d.lat, d.lng, RADIUS * 1.001);
      positions[i * 3] = v.x;
      positions[i * 3 + 1] = v.y;
      positions[i * 3 + 2] = v.z;
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  return (
    <points geometry={geometry}>
      <pointsMaterial
        color={PAPER}
        size={0.018}
        sizeAttenuation
        transparent
        opacity={theme.continentOpacity}
        depthWrite={false}
      />
    </points>
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

function Starfield() {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(STAR_POSITIONS, 3));
    return geo;
  }, []);

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

function TableBase() {
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

function OrbitRing({ color }: { color: string }) {
  return (
    <mesh rotation={[Math.PI / 2.4, 0, 0]}>
      <torusGeometry args={[RADIUS * 1.35, 0.004, 8, 128]} />
      <meshBasicMaterial color={color} transparent opacity={0.4} />
    </mesh>
  );
}

// Sphere + dotted continents + theme-driven decoration, shared by the
// memory-point globe and the place-picker globe so both stay visually aligned.
export function GlobeBody({
  children,
  onSurfaceClick,
  themeId = "CLASSIC",
}: {
  children?: React.ReactNode;
  onSurfaceClick?: (localPoint: THREE.Vector3) => void;
  themeId?: keyof typeof GLOBE_THEMES;
}) {
  const theme = GLOBE_THEMES[themeId];

  return (
    <>
      {theme.showStars && <Starfield />}

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
        <sphereGeometry args={[RADIUS, 48, 48]} />
        <meshStandardMaterial color={theme.sphereColor} roughness={0.85} metalness={0.1} />
      </mesh>

      <ContinentDots theme={theme} />

      <mesh scale={1.12}>
        <sphereGeometry args={[RADIUS, 32, 32]} />
        <meshBasicMaterial
          color={theme.atmosphereColor}
          transparent
          opacity={theme.atmosphereOpacity}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {theme.showBase && <TableBase />}
      {theme.showOrbitRing && <OrbitRing color={theme.accentColor} />}
      {theme.showMoons && (
        <>
          <Moon radius={RADIUS * 1.8} speed={0.25} tilt={0.3} />
          <Moon radius={RADIUS * 2.3} speed={-0.15} tilt={-0.5} />
        </>
      )}

      {children}
    </>
  );
}
