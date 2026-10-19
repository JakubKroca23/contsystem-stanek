"use client";

import { useMemo } from "react";
import type { Texture } from "three";
import { useTexture } from "@react-three/drei";
import { canvasTexture, mat } from "./materials";

export function RoundTable() {
  return (
    <group>
      <mesh position={[0, 0.74, 0]} material={mat.wood} castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.035, 40]} />
      </mesh>
      <mesh position={[0, 0.715, 0]} material={mat.chrome}>
        <cylinderGeometry args={[0.37, 0.37, 0.015, 32]} />
      </mesh>
      <mesh position={[0, 0.38, 0]} material={mat.chrome} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 0.68, 16]} />
      </mesh>
      <mesh position={[0, 0.04, 0]} material={mat.chrome} receiveShadow>
        <cylinderGeometry args={[0.22, 0.24, 0.03, 24]} />
      </mesh>
    </group>
  );
}

export function MetalChair() {
  const leg = (x: number, z: number) => (
    <mesh key={`${x}-${z}`} position={[x, 0.24, z]} material={mat.chrome} castShadow>
      <cylinderGeometry args={[0.015, 0.015, 0.48, 8]} />
    </mesh>
  );
  return (
    <group>
      {leg(-0.18, -0.18)}
      {leg(0.18, -0.18)}
      {leg(0.18, 0.18)}
      {leg(-0.18, 0.18)}
      <mesh position={[0, 0.46, 0]} material={mat.black} castShadow receiveShadow>
        <boxGeometry args={[0.42, 0.04, 0.42]} />
      </mesh>
      <mesh position={[0, 0.68, -0.19]} material={mat.black} castShadow>
        <boxGeometry args={[0.42, 0.4, 0.03]} />
      </mesh>
      <mesh position={[-0.18, 0.66, -0.16]} material={mat.chrome}>
        <boxGeometry args={[0.02, 0.38, 0.02]} />
      </mesh>
      <mesh position={[0.18, 0.66, -0.16]} material={mat.chrome}>
        <boxGeometry args={[0.02, 0.38, 0.02]} />
      </mesh>
    </group>
  );
}

export function Counter() {
  const logo = useTexture("/brand/contsystem-logo.png");
  return (
    <group>
      <mesh position={[0, 0.52, 0]} material={mat.whiteDark} castShadow receiveShadow>
        <boxGeometry args={[1, 1.04, 0.5]} />
      </mesh>
      <mesh position={[0, 1.06, 0]} material={mat.white} castShadow receiveShadow>
        <boxGeometry args={[1.04, 0.04, 0.54]} />
      </mesh>
      <mesh position={[0, 0.42, 0.02]} material={mat.white}>
        <boxGeometry args={[0.92, 0.02, 0.4]} />
      </mesh>
      <mesh position={[0, 0.7, 0.26]}>
        <planeGeometry args={[0.72, 0.2]} />
        <meshStandardMaterial map={logo} transparent roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.08, 0.22]} material={mat.blue}>
        <boxGeometry args={[1.02, 0.06, 0.06]} />
      </mesh>
    </group>
  );
}

export function BarStool() {
  return (
    <group>
      <mesh position={[0, 0.03, 0]} material={mat.chrome} receiveShadow>
        <cylinderGeometry args={[0.18, 0.2, 0.03, 20]} />
      </mesh>
      <mesh position={[0, 0.4, 0]} material={mat.chrome} castShadow>
        <cylinderGeometry args={[0.025, 0.03, 0.74, 12]} />
      </mesh>
      <mesh position={[0, 0.28, 0]} material={mat.chrome}>
        <torusGeometry args={[0.14, 0.012, 8, 20]} />
      </mesh>
      <mesh position={[0, 0.8, 0]} material={mat.black} castShadow receiveShadow>
        <cylinderGeometry args={[0.17, 0.17, 0.05, 24]} />
      </mesh>
      <mesh position={[0, 0.95, -0.12]} material={mat.blackSoft} castShadow>
        <boxGeometry args={[0.32, 0.28, 0.04]} />
      </mesh>
    </group>
  );
}

function FlagBody({ map }: { map: Texture }) {
  return (
    <group>
      <mesh position={[0, 0.02, 0]} material={mat.foot} receiveShadow>
        <boxGeometry args={[0.28, 0.04, 0.28]} />
      </mesh>
      <mesh position={[0, 1.4, 0]} material={mat.flagPole} castShadow>
        <cylinderGeometry args={[0.018, 0.024, 2.76, 12]} />
      </mesh>
      <mesh position={[0.38, 1.85, 0]} castShadow>
        <planeGeometry args={[0.72, 1.5]} />
        <meshStandardMaterial map={map} roughness={0.75} side={2} />
      </mesh>
    </group>
  );
}

export function FlagContsystem() {
  const logo = useTexture("/brand/contsystem-logo.png");
  const map = useMemo(() => {
    return canvasTexture(512, 1024, (ctx) => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 512, 1024);
      ctx.fillStyle = "#1574d4";
      ctx.fillRect(0, 0, 512, 36);
      ctx.fillRect(0, 988, 512, 36);
      const img = logo.image as CanvasImageSource;
      ctx.drawImage(img, 36, 300, 440, 116);
      ctx.fillStyle = "#1c1f24";
      ctx.font = "600 46px Arial, Helvetica, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("HALA 4C", 256, 520);
      ctx.fillStyle = "#1574d4";
      ctx.font = "600 40px Arial, Helvetica, sans-serif";
      ctx.fillText("STÁNEK 05", 256, 590);
      ctx.fillStyle = "#5c6570";
      ctx.font = "400 28px Arial, Helvetica, sans-serif";
      ctx.fillText("5 × 10 m", 256, 660);
    });
  }, [logo]);
  return <FlagBody map={map} />;
}

export function FlagComet() {
  const map = useMemo(
    () =>
      canvasTexture(512, 1024, (ctx) => {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 512, 1024);
        ctx.fillStyle = "#2f9a45";
        ctx.fillRect(0, 0, 512, 36);
        ctx.fillRect(0, 988, 512, 36);
        ctx.fillStyle = "#0e4ea8";
        ctx.font = "800 92px Arial, Helvetica, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("COMET", 256, 430);
        ctx.fillStyle = "#1c1f24";
        ctx.font = "600 40px Arial, Helvetica, sans-serif";
        ctx.fillText("X4-14", 256, 540);
        ctx.font = "500 30px Arial, Helvetica, sans-serif";
        ctx.fillStyle = "#3d4650";
        ctx.fillText("pracovní plošiny", 256, 610);
      }),
    [],
  );
  return <FlagBody map={map} />;
}

export function Figure() {
  return (
    <group>
      <mesh position={[0, 0.12, 0]} material={mat.black} castShadow>
        <boxGeometry args={[0.22, 0.08, 0.32]} />
      </mesh>
      <mesh position={[0, 0.95, 0]} material={mat.cloth} castShadow>
        <capsuleGeometry args={[0.18, 0.72, 6, 12]} />
      </mesh>
      <mesh position={[0, 1.58, 0]} material={mat.skin} castShadow>
        <sphereGeometry args={[0.12, 18, 18]} />
      </mesh>
      <mesh position={[0, 1.66, 0]} material={mat.black} castShadow>
        <sphereGeometry args={[0.13, 16, 12, 0, Math.PI * 2, 0, 1.15]} />
      </mesh>
    </group>
  );
}
