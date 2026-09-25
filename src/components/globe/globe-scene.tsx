"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { latLngToVector3 } from "@/lib/geo";
import { GlobeBody, RADIUS, PAPER, ACCENT } from "./globe-body";
import type { GlobePlace } from "./tabi-globe";

function MemoryPoint({
  place,
  selected,
  onSelect,
}: {
  place: GlobePlace;
  selected: boolean;
  onSelect: (place: GlobePlace) => void;
}) {
  // Sit just outside the graticule/atmosphere shells so it never loses a
  // transparency depth-sort fight with them.
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
      <meshBasicMaterial color={ACCENT} toneMapped={false} />
    </mesh>
  );
}

export function GlobeScene({
  places,
  selectedPlace,
  onSelect,
  reducedMotion,
}: {
  places: GlobePlace[];
  selectedPlace: GlobePlace | null;
  onSelect: (place: GlobePlace) => void;
  reducedMotion: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const controlsRef = useRef<React.ComponentRef<typeof OrbitControls>>(null);
  const { camera } = useThree();

  const targetVec = useMemo(() => {
    if (!selectedPlace) return null;
    return latLngToVector3(selectedPlace.latitude, selectedPlace.longitude, RADIUS);
  }, [selectedPlace]);

  useFrame((_, delta) => {
    if (groupRef.current && !selectedPlace && !reducedMotion) {
      groupRef.current.rotation.y += delta * 0.06;
    }

    if (targetVec && controlsRef.current) {
      const desiredCamPos = targetVec.clone().normalize().multiplyScalar(RADIUS * 2.1);
      camera.position.lerp(desiredCamPos, 0.04);
      controlsRef.current.target.lerp(targetVec, 0.04);
      controlsRef.current.update();
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} color={PAPER} />
      <directionalLight position={[3, 2, 4]} intensity={1.1} color={PAPER} />

      <group ref={groupRef}>
        <GlobeBody>
          {places.map((place) => (
            <MemoryPoint
              key={place.slug}
              place={place}
              selected={selectedPlace?.slug === place.slug}
              onSelect={onSelect}
            />
          ))}
        </GlobeBody>
      </group>

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={RADIUS * 1.6}
        maxDistance={RADIUS * 4}
      />
    </>
  );
}
