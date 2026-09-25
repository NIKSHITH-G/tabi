import { Vector3 } from "three";

// Standard lat/lng-to-sphere-surface conversion (0,0 lng faces -Z).
export function latLngToVector3(lat: number, lng: number, radius: number): Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

// Inverse of the above — a point on (or near) the sphere surface back to lat/lng.
export function vector3ToLatLng(point: Vector3): { lat: number; lng: number } {
  const radius = point.length();
  const phi = Math.acos(Math.max(-1, Math.min(1, point.y / radius)));
  const theta = Math.atan2(point.z, -point.x);
  let lng = (theta * 180) / Math.PI - 180;
  if (lng < -180) lng += 360;
  return { lat: 90 - (phi * 180) / Math.PI, lng };
}
