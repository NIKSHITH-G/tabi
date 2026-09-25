"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { latLngToVector3 } from "@/lib/geo";
import { getContinentDots } from "@/lib/continents";

export const RADIUS = 1.6;
export const INK = "#211d1a";
export const PAPER = "#faf6ef";
export const ACCENT = "#e08148";

function ContinentDots() {
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
        opacity={0.35}
        depthWrite={false}
      />
    </points>
  );
}

// Sphere + dotted continents + atmosphere halo, shared by the memory-point
// globe and the place-picker globe so both stay visually identical.
export function GlobeBody({
  children,
  onSurfaceClick,
}: {
  children?: React.ReactNode;
  onSurfaceClick?: (localPoint: THREE.Vector3) => void;
}) {
  return (
    <>
      <mesh
        onClick={
          onSurfaceClick
            ? (e) => {
                e.stopPropagation();
                // worldToLocal accounts for any parent rotation (idle spin,
                // OrbitControls drag) so the picked lat/lng is always correct.
                onSurfaceClick(e.object.worldToLocal(e.point.clone()));
              }
            : undefined
        }
      >
        <sphereGeometry args={[RADIUS, 48, 48]} />
        <meshStandardMaterial color={INK} roughness={0.85} metalness={0.1} />
      </mesh>

      <ContinentDots />

      <mesh scale={1.12}>
        <sphereGeometry args={[RADIUS, 32, 32]} />
        <meshBasicMaterial
          color={ACCENT}
          transparent
          opacity={0.06}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {children}
    </>
  );
}
