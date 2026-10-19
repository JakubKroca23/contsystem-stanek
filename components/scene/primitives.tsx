"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { mat } from "./materials";

export function Wheel({
  position,
  radius = 0.36,
  width = 0.22,
}: {
  position: [number, number, number];
  radius?: number;
  width?: number;
}) {
  return (
    <group position={position} rotation={[0, 0, Math.PI / 2]}>
      <mesh material={mat.rubber} castShadow>
        <cylinderGeometry args={[radius, radius, width, 28]} />
      </mesh>
      <mesh material={mat.black} position={[0, 0, 0]}>
        <cylinderGeometry args={[radius * 0.72, radius * 0.72, width + 0.012, 24]} />
      </mesh>
      <mesh material={mat.chrome}>
        <cylinderGeometry args={[radius * 0.42, radius * 0.42, width + 0.02, 16]} />
      </mesh>
      <mesh material={mat.blackSoft}>
        <cylinderGeometry args={[radius * 0.12, radius * 0.12, width + 0.03, 12]} />
      </mesh>
    </group>
  );
}

export function Outriggers({
  zs,
  reach,
  bodyHalf,
  beamY,
}: {
  zs: number[];
  reach: number;
  bodyHalf: number;
  beamY: number;
}) {
  const beam = reach - bodyHalf;
  return (
    <group>
      {zs.map((z) =>
        [-1, 1].map((side) => (
          <group key={`${z}-${side}`} position={[0, beamY, z]}>
            <mesh
              position={[side * (bodyHalf + beam / 2), 0, 0]}
              material={mat.yellow}
              castShadow
            >
              <boxGeometry args={[beam, 0.07, 0.09]} />
            </mesh>
            <mesh position={[side * reach, -(beamY - 0.06) / 2, 0]} material={mat.black} castShadow>
              <boxGeometry args={[0.07, beamY - 0.06, 0.07]} />
            </mesh>
            <mesh position={[side * reach, -beamY + 0.025, 0]} material={mat.foot} receiveShadow>
              <boxGeometry args={[0.24, 0.04, 0.22]} />
            </mesh>
          </group>
        )),
      )}
    </group>
  );
}

export function Basket({
  position,
  size = [0.72, 1.05, 0.68],
}: {
  position: [number, number, number];
  size?: [number, number, number];
}) {
  const [w, h, d] = size;
  const posts: Array<[number, number]> = [
    [-w / 2, -d / 2],
    [w / 2, -d / 2],
    [w / 2, d / 2],
    [-w / 2, d / 2],
  ];
  return (
    <group position={position}>
      <mesh position={[0, 0.03, 0]} material={mat.alu} castShadow receiveShadow>
        <boxGeometry args={[w, 0.04, d]} />
      </mesh>
      <mesh position={[0, 0.015, 0]} material={mat.hazardRed}>
        <boxGeometry args={[w + 0.02, 0.02, d + 0.02]} />
      </mesh>
      {posts.map(([x, z], i) => (
        <mesh key={i} position={[x, h / 2, z]} material={mat.alu} castShadow>
          <boxGeometry args={[0.035, h, 0.035]} />
        </mesh>
      ))}
      <mesh position={[0, h * 0.55, d / 2]} material={mat.alu}>
        <boxGeometry args={[w, 0.03, 0.03]} />
      </mesh>
      <mesh position={[0, h * 0.92, d / 2]} material={mat.alu}>
        <boxGeometry args={[w, 0.03, 0.03]} />
      </mesh>
      <mesh position={[0, h * 0.55, -d / 2]} material={mat.alu}>
        <boxGeometry args={[w, 0.03, 0.03]} />
      </mesh>
      <mesh position={[0, h * 0.92, -d / 2]} material={mat.alu}>
        <boxGeometry args={[w, 0.03, 0.03]} />
      </mesh>
      <mesh position={[w / 2, h * 0.92, 0]} material={mat.alu}>
        <boxGeometry args={[0.03, 0.03, d]} />
      </mesh>
      <mesh position={[-w / 2, h * 0.92, 0]} material={mat.alu}>
        <boxGeometry args={[0.03, 0.03, d]} />
      </mesh>
      <mesh position={[0, 0.18, d / 2 + 0.01]} material={mat.white}>
        <boxGeometry args={[0.28, 0.16, 0.02]} />
      </mesh>
    </group>
  );
}

export function FootprintLines({
  w,
  d,
  color,
  y = 0.045,
}: {
  w: number;
  d: number;
  color: string;
  y?: number;
}) {
  const geometry = useMemo(() => {
    const hw = w / 2;
    const hd = d / 2;
    const data = new Float32Array([
      -hw, y, -hd, hw, y, -hd,
      hw, y, -hd, hw, y, hd,
      hw, y, hd, -hw, y, hd,
      -hw, y, hd, -hw, y, -hd,
    ]);
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(data, 3));
    return geom;
  }, [w, d, y]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color={color} />
    </lineSegments>
  );
}
