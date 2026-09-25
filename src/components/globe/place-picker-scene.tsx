"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type * as THREE from "three";
import { latLngToVector3, vector3ToLatLng } from "@/lib/geo";
import { GlobeBody, RADIUS, PAPER, ACCENT } from "./globe-body";

function PickedMarker({ lat, lng }: { lat: number; lng: number }) {
  const position = useMemo(
    () => latLngToVector3(lat, lng, RADIUS * 1.03),
    [lat, lng],
  );
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.scale.setScalar(1.4 + Math.sin(clock.elapsedTime * 3) * 0.25);
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshBasicMaterial color={ACCENT} toneMapped={false} />
    </mesh>
  );
}

export function PlacePickerScene({
  picked,
  onPick,
}: {
  picked: { lat: number; lng: number } | null;
  onPick: (lat: number, lng: number) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current && !picked) {
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} color={PAPER} />
      <directionalLight position={[3, 2, 4]} intensity={1.1} color={PAPER} />

      <group ref={groupRef}>
        <GlobeBody
          onSurfaceClick={(localPoint) => {
            const { lat, lng } = vector3ToLatLng(localPoint);
            onPick(lat, lng);
          }}
        >
          {picked && <PickedMarker lat={picked.lat} lng={picked.lng} />}
        </GlobeBody>
      </group>

      <OrbitControls
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={RADIUS * 1.6}
        maxDistance={RADIUS * 4}
      />
    </>
  );
}
