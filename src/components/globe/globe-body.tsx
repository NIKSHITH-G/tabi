"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { PAPER_COLOR, type GlobeThemeConfig } from "./themes";

export const RADIUS = 1.6;
export const PAPER = PAPER_COLOR;
export const ACCENT = "#e08148";

const EARTH_DAY_TEXTURE = "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg";
const EARTH_NIGHT_TEXTURE = "https://threejs.org/examples/textures/planets/earth_lights_2048.png";

// Matches the directionalLight position in globe-scene.tsx / place-picker-scene.tsx —
// the sun direction the day/night shader reads is fixed in world space, same
// as that light, so the terminator line stays physically consistent.
const SUN_DIRECTION = new THREE.Vector3(3, 2, 4).normalize();

const DAY_NIGHT_VERTEX_SHADER = `
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  void main() {
    vUv = uv;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const DAY_NIGHT_FRAGMENT_SHADER = `
  uniform sampler2D dayTexture;
  uniform sampler2D nightTexture;
  uniform vec3 sunDirection;
  varying vec2 vUv;
  varying vec3 vWorldNormal;

  void main() {
    vec3 dayColor = texture2D(dayTexture, vUv).rgb;
    vec3 nightColor = texture2D(nightTexture, vUv).rgb * 1.6;
    float sunFacing = dot(normalize(vWorldNormal), normalize(sunDirection));
    float dayAmount = smoothstep(-0.2, 0.15, sunFacing);
    gl_FragColor = vec4(mix(nightColor, dayColor, dayAmount), 1.0);
  }
`;

const ATMOSPHERE_VERTEX_SHADER = `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const ATMOSPHERE_FRAGMENT_SHADER = `
  uniform vec3 glowColor;
  uniform float glowIntensity;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    float rim = pow(1.0 - max(dot(normalize(vNormal), normalize(vViewPosition)), 0.0), 2.2);
    gl_FragColor = vec4(glowColor, rim * glowIntensity);
  }
`;

function DayNightEarth({ onSurfaceClick }: { onSurfaceClick?: (p: THREE.Vector3) => void }) {
  const [dayMap, nightMap] = useTexture([EARTH_DAY_TEXTURE, EARTH_NIGHT_TEXTURE]);
  const uniforms = useMemo(
    () => ({
      dayTexture: { value: dayMap },
      nightTexture: { value: nightMap },
      sunDirection: { value: SUN_DIRECTION },
    }),
    [dayMap, nightMap],
  );

  return (
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
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={DAY_NIGHT_VERTEX_SHADER}
        fragmentShader={DAY_NIGHT_FRAGMENT_SHADER}
      />
    </mesh>
  );
}

function FlatLitEarth({
  onSurfaceClick,
  tint,
}: {
  onSurfaceClick?: (p: THREE.Vector3) => void;
  tint: string;
}) {
  const dayMap = useTexture(EARTH_DAY_TEXTURE);
  return (
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
      <meshStandardMaterial map={dayMap} color={tint} roughness={0.8} metalness={0} />
    </mesh>
  );
}

function AtmosphereGlow({ color, intensity }: { color: string; intensity: number }) {
  const uniforms = useMemo(
    () => ({
      glowColor: { value: new THREE.Color(color) },
      glowIntensity: { value: intensity },
    }),
    [color, intensity],
  );

  return (
    <mesh scale={1.18}>
      <sphereGeometry args={[RADIUS, 48, 48]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={ATMOSPHERE_VERTEX_SHADER}
        fragmentShader={ATMOSPHERE_FRAGMENT_SHADER}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.FrontSide}
      />
    </mesh>
  );
}

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
  return (
    <>
      {theme.dayNightCycle ? (
        <DayNightEarth onSurfaceClick={onSurfaceClick} />
      ) : (
        <FlatLitEarth onSurfaceClick={onSurfaceClick} tint={theme.sphereTint} />
      )}

      {theme.atmosphereOpacity > 0 && (
        <AtmosphereGlow color={theme.atmosphereColor} intensity={theme.atmosphereOpacity} />
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

const WOOD = "#3d2a1a";
const BRASS = "#c9a24b";

function TripodLeg({ angle }: { angle: number }) {
  const legLength = RADIUS * 1.9;
  return (
    <group rotation={[0, angle, 0]}>
      <group position={[0, -RADIUS * 0.15, RADIUS * 0.15]} rotation={[Math.PI / 7, 0, 0]}>
        <mesh position={[0, -legLength / 2, 0]}>
          <cylinderGeometry args={[0.028, 0.04, legLength, 10]} />
          <meshStandardMaterial color={WOOD} roughness={0.65} />
        </mesh>
        {/* brass foot cap */}
        <mesh position={[0, -legLength - 0.02, 0]}>
          <cylinderGeometry args={[0.045, 0.03, 0.06, 10]} />
          <meshStandardMaterial color={BRASS} roughness={0.3} metalness={0.8} />
        </mesh>
      </group>
    </group>
  );
}

// Fixed in world space — a real decorative table globe's meridian ring and
// tripod stand never spin; only the ball rotates inside them.
export function TableBase() {
  return (
    <group position={[0, -RADIUS * 0.05, 0]}>
      {/* Brass meridian ring the sphere sits inside */}
      <mesh rotation={[0, 0, Math.PI / 2.15]}>
        <torusGeometry args={[RADIUS * 1.06, 0.028, 16, 64]} />
        <meshStandardMaterial color={BRASS} roughness={0.25} metalness={0.85} />
      </mesh>

      {/* Brass horizon ring + arms connecting to the tripod head */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -RADIUS * 0.15, 0]}>
        <torusGeometry args={[RADIUS * 1.02, 0.02, 12, 64]} />
        <meshStandardMaterial color={BRASS} roughness={0.25} metalness={0.85} />
      </mesh>

      <TripodLeg angle={0} />
      <TripodLeg angle={(Math.PI * 2) / 3} />
      <TripodLeg angle={(Math.PI * 4) / 3} />
    </group>
  );
}
