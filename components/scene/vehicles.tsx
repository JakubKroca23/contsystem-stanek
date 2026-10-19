"use client";

import { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import { Basket, Outriggers, Wheel } from "./primitives";
import { canvasTexture, mat } from "./materials";

function useLabel(text: string, bg: string, fg: string, width = 512, height = 160) {
  return useMemo(
    () =>
      canvasTexture(width, height, (ctx) => {
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = fg;
        ctx.font = `700 ${Math.floor(height * 0.52)}px Arial, Helvetica, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, width / 2, height / 2 + 4);
      }),
    [text, bg, fg, width, height],
  );
}

/** Goupil G6 dle výkresu: 5127 × 1974 × 2381 mm, podpěry 2988 mm. Přední převis 586, rozvor 3450, zadní 1092. */
export function Goupil() {
  const g6 = useLabel("G6", "#1d74d6", "#ffffff", 256, 128);
  const comet = useLabel("COMET", "#f4f7f8", "#0e4ea8");
  const L = 5.127;
  const half = L / 2;
  const frontAxle = half - 0.586;
  const rearAxle = -half + 1.092;
  const track = 0.78;

  return (
    <group>
      <mesh position={[0, 0.48, -0.15]} material={mat.black} castShadow>
        <boxGeometry args={[1.18, 0.22, 4.55]} />
      </mesh>
      <mesh position={[0, 0.62, 0.35]} material={mat.blackSoft} castShadow>
        <boxGeometry args={[1.35, 0.12, 3.4]} />
      </mesh>

      <Wheel position={[-track, 0.36, frontAxle]} radius={0.36} width={0.22} />
      <Wheel position={[track, 0.36, frontAxle]} radius={0.36} width={0.22} />
      <Wheel position={[-track, 0.36, rearAxle]} radius={0.36} width={0.24} />
      <Wheel position={[track, 0.36, rearAxle]} radius={0.36} width={0.24} />

      <RoundedBox
        args={[1.72, 1.28, 2.05]}
        radius={0.08}
        smoothness={3}
        position={[0, 1.28, 1.15]}
        material={mat.white}
        castShadow
        receiveShadow
      />
      <mesh position={[0, 1.95, 1.05]} material={mat.black} castShadow>
        <boxGeometry args={[1.66, 0.1, 1.85]} />
      </mesh>
      <mesh position={[0, 1.35, 2.16]} rotation={[-0.22, 0, 0]} material={mat.glass} castShadow>
        <boxGeometry args={[1.48, 0.72, 0.06]} />
      </mesh>
      <mesh position={[0.87, 1.32, 1.15]} material={mat.glass}>
        <boxGeometry args={[0.04, 0.62, 1.15]} />
      </mesh>
      <mesh position={[-0.87, 1.32, 1.15]} material={mat.glass}>
        <boxGeometry args={[0.04, 0.62, 1.15]} />
      </mesh>
      <mesh position={[0.89, 1.55, 0.35]} material={mat.black} castShadow>
        <boxGeometry args={[0.08, 0.85, 0.1]} />
      </mesh>
      <mesh position={[-0.89, 1.55, 0.35]} material={mat.black} castShadow>
        <boxGeometry args={[0.08, 0.85, 0.1]} />
      </mesh>
      <mesh position={[0, 0.58, 2.42]} material={mat.blue} castShadow>
        <boxGeometry args={[1.62, 0.28, 0.18]} />
      </mesh>
      <mesh position={[0, 0.78, 2.38]} material={mat.black}>
        <boxGeometry args={[1.2, 0.08, 0.08]} />
      </mesh>
      <mesh position={[-0.48, 0.72, 2.46]} material={mat.white}>
        <sphereGeometry args={[0.07, 16, 16]} />
      </mesh>
      <mesh position={[0.48, 0.72, 2.46]} material={mat.white}>
        <sphereGeometry args={[0.07, 16, 16]} />
      </mesh>
      <mesh position={[0.9, 1.15, 1.7]} material={mat.chrome}>
        <boxGeometry args={[0.12, 0.18, 0.22]} />
      </mesh>
      <mesh position={[-0.9, 1.15, 1.7]} material={mat.chrome}>
        <boxGeometry args={[0.12, 0.18, 0.22]} />
      </mesh>
      <mesh position={[0.88, 0.95, 1.55]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.32, 0.16]} />
        <meshStandardMaterial map={g6} roughness={0.5} />
      </mesh>

      <mesh position={[0, 0.78, -0.35]} material={mat.blackSoft} receiveShadow>
        <boxGeometry args={[0.08, 0.08, 0.08]} />
      </mesh>
      <mesh position={[0, 0.9, -1.05]} material={mat.whiteDark} castShadow receiveShadow>
        <boxGeometry args={[1.62, 0.08, 2.55]} />
      </mesh>
      <mesh position={[0.78, 1.08, -1.05]} material={mat.white} castShadow>
        <boxGeometry args={[0.06, 0.28, 2.45]} />
      </mesh>
      <mesh position={[-0.78, 1.08, -1.05]} material={mat.white} castShadow>
        <boxGeometry args={[0.06, 0.28, 2.45]} />
      </mesh>

      <mesh position={[0.12, 1.7, -0.35]} material={mat.green} castShadow>
        <boxGeometry args={[0.32, 1.55, 0.36]} />
      </mesh>
      <mesh position={[0.12, 2.28, -0.72]} material={mat.greenDark} castShadow>
        <boxGeometry args={[0.22, 0.18, 0.85]} />
      </mesh>
      <mesh position={[0.12, 1.95, -1.15]} rotation={[0.7, 0, 0]} material={mat.green} castShadow>
        <boxGeometry args={[0.16, 0.14, 1.15]} />
      </mesh>
      <mesh position={[0.12, 2.05, -0.15]} rotation={[0, 0, Math.PI / 2]}>
        <planeGeometry args={[0.7, 0.22]} />
        <meshStandardMaterial map={comet} roughness={0.45} />
      </mesh>
      <mesh position={[-0.28, 1.15, -0.2]} material={mat.blackSoft} castShadow>
        <boxGeometry args={[0.42, 0.32, 0.55]} />
      </mesh>

      <Basket position={[-0.42, 1.15, -1.85]} size={[0.7, 1.02, 0.66]} />

      <Outriggers zs={[-0.35, -1.85]} reach={1.494} bodyHalf={0.82} beamY={0.62} />
    </group>
  );
}

/**
 * Ford Ranger single cab 4×4 XL + COMET X4-14.
 * Výkres: 5277 mm (905 + 3220 + 1152), šířka 1860 / podpěry 2910, výška složené plošiny 2800.
 * Koš 120 kg, pracovní výška 14 m — na stánku je složená přepravní poloha.
 */
export function Foton() {
  const comet = useLabel("COMET", "#f7f8fa", "#0e4ea8");
  const half = 5.277 / 2;
  const frontAxle = half - 0.905;
  const rearAxle = -half + 1.152;
  const track = 0.82;

  return (
    <group>
      <mesh position={[0, 0.52, 0.05]} material={mat.black} castShadow>
        <boxGeometry args={[1.15, 0.18, 4.7]} />
      </mesh>
      <mesh position={[0, 0.42, 0.2]} material={mat.silverDark} castShadow>
        <boxGeometry args={[0.85, 0.16, 3.6]} />
      </mesh>

      <Wheel position={[-track, 0.38, frontAxle]} radius={0.38} width={0.24} />
      <Wheel position={[track, 0.38, frontAxle]} radius={0.38} width={0.24} />
      <Wheel position={[-track, 0.38, rearAxle]} radius={0.38} width={0.26} />
      <Wheel position={[track, 0.38, rearAxle]} radius={0.38} width={0.26} />

      <mesh position={[0, 0.92, 2.05]} rotation={[-0.12, 0, 0]} material={mat.silver} castShadow>
        <boxGeometry args={[1.72, 0.32, 1.15]} />
      </mesh>
      <mesh position={[0, 0.62, 2.5]} material={mat.silverDark} castShadow>
        <boxGeometry args={[1.78, 0.28, 0.28]} />
      </mesh>
      <mesh position={[-0.62, 0.72, 2.58]} material={mat.white}>
        <boxGeometry args={[0.28, 0.12, 0.08]} />
      </mesh>
      <mesh position={[0.62, 0.72, 2.58]} material={mat.white}>
        <boxGeometry args={[0.28, 0.12, 0.08]} />
      </mesh>
      <mesh position={[0, 0.72, 2.62]} material={mat.black}>
        <boxGeometry args={[0.7, 0.16, 0.04]} />
      </mesh>

      <RoundedBox
        args={[1.74, 1.05, 1.45]}
        radius={0.05}
        smoothness={2}
        position={[0, 1.35, 0.95]}
        material={mat.silver}
        castShadow
        receiveShadow
      />
      <mesh position={[0, 1.78, 0.85]} material={mat.silverDark} castShadow>
        <boxGeometry args={[1.7, 0.08, 1.35]} />
      </mesh>
      <mesh position={[0, 1.48, 1.62]} rotation={[-0.28, 0, 0]} material={mat.glass} castShadow>
        <boxGeometry args={[1.48, 0.62, 0.05]} />
      </mesh>
      <mesh position={[0.88, 1.38, 0.9]} material={mat.glass}>
        <boxGeometry args={[0.04, 0.55, 0.85]} />
      </mesh>
      <mesh position={[-0.88, 1.38, 0.9]} material={mat.glass}>
        <boxGeometry args={[0.04, 0.55, 0.85]} />
      </mesh>
      <mesh position={[1.02, 1.45, 1.15]} material={mat.black} castShadow>
        <boxGeometry args={[0.16, 0.2, 0.28]} />
      </mesh>
      <mesh position={[-1.02, 1.45, 1.15]} material={mat.black} castShadow>
        <boxGeometry args={[0.16, 0.2, 0.28]} />
      </mesh>
      <mesh position={[0.9, 1.05, 1.35]} material={mat.chrome}>
        <boxGeometry args={[0.04, 0.08, 0.55]} />
      </mesh>
      <mesh position={[-0.9, 1.05, 1.35]} material={mat.chrome}>
        <boxGeometry args={[0.04, 0.08, 0.55]} />
      </mesh>

      <mesh position={[0, 0.9, -0.85]} material={mat.silverDark} receiveShadow castShadow>
        <boxGeometry args={[1.7, 0.08, 2.85]} />
      </mesh>
      <mesh position={[0.84, 1.15, -0.7]} material={mat.silver} castShadow>
        <boxGeometry args={[0.06, 0.42, 2.5]} />
      </mesh>
      <mesh position={[-0.84, 1.15, -0.7]} material={mat.silver} castShadow>
        <boxGeometry args={[0.06, 0.42, 2.5]} />
      </mesh>

      <RoundedBox
        args={[1.58, 0.92, 1.15]}
        radius={0.03}
        smoothness={2}
        position={[0, 1.38, -1.85]}
        material={mat.alu}
        castShadow
        receiveShadow
      />
      <mesh position={[0, 1.38, -2.4]} material={mat.silverDark}>
        <boxGeometry args={[1.4, 0.7, 0.04]} />
      </mesh>
      {[0.35, 0.1, -0.15, -0.4].map((y) => (
        <mesh key={y} position={[0, 1.38 + y, -2.43]} material={mat.chrome}>
          <boxGeometry args={[1.25, 0.015, 0.01]} />
        </mesh>
      ))}
      <mesh position={[0.8, 1.25, -1.85]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.95, 0.28]} />
        <meshStandardMaterial map={comet} roughness={0.4} />
      </mesh>
      <mesh position={[-0.8, 1.25, -1.85]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[0.95, 0.28]} />
        <meshStandardMaterial map={comet} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.72, -2.45]} material={mat.hazardRed}>
        <boxGeometry args={[1.5, 0.08, 0.04]} />
      </mesh>

      <mesh position={[0.15, 1.85, -0.55]} material={mat.green} castShadow>
        <boxGeometry args={[0.34, 1.85, 0.38]} />
      </mesh>
      <mesh position={[0.15, 2.55, -0.55]} material={mat.greenDark} castShadow>
        <boxGeometry args={[0.4, 0.22, 0.46]} />
      </mesh>
      <mesh position={[0.15, 2.15, -0.15]} rotation={[0.9, 0, 0]} material={mat.green} castShadow>
        <boxGeometry args={[0.16, 0.14, 0.7]} />
      </mesh>
      <mesh position={[0.38, 1.7, -0.55]}>
        <planeGeometry args={[0.02, 0.7]} />
        <meshStandardMaterial map={comet} roughness={0.4} />
      </mesh>

      <Basket position={[-0.48, 1.15, -0.45]} size={[0.68, 1.1, 0.64]} />

      <mesh position={[-0.95, 0.55, 0.15]} material={mat.blackSoft} castShadow>
        <boxGeometry args={[0.16, 0.08, 0.7]} />
      </mesh>
      <mesh position={[0.95, 0.55, 0.15]} material={mat.blackSoft} castShadow>
        <boxGeometry args={[0.16, 0.08, 0.7]} />
      </mesh>

      <Outriggers zs={[-0.15, -1.7]} reach={1.455} bodyHalf={0.9} beamY={0.58} />
    </group>
  );
}
