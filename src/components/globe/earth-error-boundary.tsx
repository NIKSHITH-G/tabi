"use client";

import { Component, type ReactNode } from "react";
import { RADIUS } from "./globe-body";

export class EarthErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Earth texture failed to load, falling back to a plain sphere:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <mesh>
          <sphereGeometry args={[RADIUS, 48, 48]} />
          <meshStandardMaterial color="#2a4d6b" roughness={0.9} />
        </mesh>
      );
    }
    return this.props.children;
  }
}
