"use client";

import { Suspense, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { latLngToVector3 } from "@/lib/geo";
import { EarthSphere, Moons, Starfield, TableBase, RADIUS, PAPER } from "./globe-body";
import { EarthErrorBoundary } from "./earth-error-boundary";
import { GLOBE_THEMES, type GlobeThemeId } from "./themes";
import type { GlobePlace } from "./tabi-globe";

function MemoryPoint({
  place,
  selected,
  onSelect,
  color,
}: {
  place: GlobePlace;
  selected: boolean;
  onSelect: (place: GlobePlace) => void;
  color: string;
}) {
  // Sit just outside the planet surface so it never loses a depth-sort fight
  // with the atmosphere shell.
  const position = useMemo(
    () => latLngToVector3(place.latitude, place.longitude, RADIUS * 1.03),
    [place.latitude, place.longitude],
  );
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const pulse = selected
      ? 1.8
      : 1.2 + Math.sin(clock.elapsedTime * 2 + position.x * 10) * 0.2;
    ref.current.scale.setScalar(pulse);
  });

  return (
    <mesh
      ref={ref}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(place);
      }}
    >
      <sphereGeometry args={[0.045, 16, 16]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
}

export function GlobeScene({
  places,
  selectedPlace,
  onSelect,
  reducedMotion,
  themeId = "CLASSIC",
}: {
  places: GlobePlace[];
  selectedPlace: GlobePlace | null;
  onSelect: (place: GlobePlace) => void;
  reducedMotion: boolean;
  themeId?: GlobeThemeId;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const controlsRef = useRef<React.ComponentRef<typeof OrbitControls>>(null);
  const { camera } = useThree();
  const theme = GLOBE_THEMES[themeId];

  // latLngToVector3 gives a position in the sphere's LOCAL (unrotated) space.
  // The rotating group has almost always turned since that point was last at
  // its "home" orientation (idle spin, or a prior drag), so this must be
  // converted to world space every frame via the group's current rotation —
  // using it directly caused the camera to fly toward a stale, wrong-looking
  // spot instead of where the marker actually is on screen.
  const localTarget = useMemo(() => {
    if (!selectedPlace) return null;
    return latLngToVector3(selectedPlace.latitude, selectedPlace.longitude, RADIUS);
  }, [selectedPlace]);

  useFrame((_, delta) => {
    // Only the planet itself spins — the group holds just the sphere and its
    // memory points, never the stand/moons/stars.
    if (groupRef.current && !selectedPlace && !reducedMotion) {
      groupRef.current.rotation.y += delta * 0.06;
    }

    if (localTarget && groupRef.current && controlsRef.current) {
      const worldTarget = groupRef.current.localToWorld(localTarget.clone());
      const desiredCamPos = worldTarget
        .clone()
        .normalize()
        .multiplyScalar(RADIUS * 2.1 * theme.cameraDistance);
      camera.position.lerp(desiredCamPos, 0.04);
      controlsRef.current.target.lerp(worldTarget, 0.04);
      controlsRef.current.update();
    }
  });

  const lightColor = theme.id === "TABLE" ? "#ffd9a8" : PAPER;

  return (
    <>
      <ambientLight intensity={theme.id === "TABLE" ? 0.9 : 0.7} color={lightColor} />
      <directionalLight position={[3, 2, 4]} intensity={1.3} color={lightColor} />

      {theme.showStars && <Starfield />}
      {theme.showBase && <TableBase />}
      {theme.showMoons && <Moons />}

      <group ref={groupRef}>
        <EarthErrorBoundary>
          <Suspense fallback={null}>
            <EarthSphere theme={theme} />
          </Suspense>
        </EarthErrorBoundary>
        {places.map((place) => (
          <MemoryPoint
            key={place.slug}
            place={place}
            selected={selectedPlace?.slug === place.slug}
            onSelect={onSelect}
            color={theme.accentColor}
          />
        ))}
      </group>

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={RADIUS * 1.6 * theme.cameraDistance}
        maxDistance={RADIUS * 4}
      />
    </>
  );
}
