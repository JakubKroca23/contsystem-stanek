"use client";

import { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import type { MachinePose } from "@/lib/layout";
import { Basket, Outriggers, Wheel } from "./primitives";
import { canvasTexture, mat } from "./materials";
import * as THREE from "three";

const lamp = new THREE.MeshStandardMaterial({
  color: "#fff8e8",
  emissive: "#ffe7a3",
  emissiveIntensity: 0.85,
  roughness: 0.3,
});

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

function useChevrons() {
  return useMemo(
    () =>
      canvasTexture(256, 64, (ctx) => {
        ctx.fillStyle = "#f7f7f7";
        ctx.fillRect(0, 0, 256, 64);
        ctx.fillStyle = "#d7263d";
        for (let i = -2; i < 10; i += 1) {
          const x = i * 36;
          ctx.beginPath();
          ctx.moveTo(x, 64);
          ctx.lineTo(x + 22, 64);
          ctx.lineTo(x + 46, 0);
          ctx.lineTo(x + 24, 0);
          ctx.closePath();
          ctx.fill();
        }
      }),
    [],
  );
}

function mix(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function KnuckleBoom({
  lift,
  pivot,
  lower,
  upper,
  fold,
  raised,
  basketSide,
  basket,
}: {
  lift: number;
  pivot: [number, number, number];
  lower: [number, number];
  upper: [number, number];
  fold: [number, number];
  raised: [number, number];
  basketSide: number;
  basket: [number, number, number];
}) {
  const lowerAngle = mix(fold[0], raised[0], lift);
  const upperAngle = mix(fold[1], raised[1], lift);
  const l1 = mix(lower[0], lower[1], lift);
  const l2 = mix(upper[0], upper[1], lift);
  return (
    <group position={pivot}>
      <mesh material={mat.greenDark} castShadow>
        <cylinderGeometry args={[0.16, 0.2, 0.22, 16]} />
      </mesh>
      <group rotation={[lowerAngle, 0, 0]}>
        <mesh position={[0, l1 / 2, 0]} material={mat.green} castShadow>
          <boxGeometry args={[0.2, l1, 0.16]} />
        </mesh>
        <mesh position={[0, l1, 0]} material={mat.greenDark} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.24, 12]} />
        </mesh>
        <group position={[0, l1, 0]} rotation={[upperAngle, 0, 0]}>
          <mesh position={[0, l2 / 2, 0]} material={mat.green} castShadow>
            <boxGeometry args={[0.14, l2, 0.12]} />
          </mesh>
          <group position={[0, l2, 0]} rotation={[-(lowerAngle + upperAngle), 0, 0]}>
            <Basket position={[basketSide, 0, 0]} size={basket} />
          </group>
        </group>
      </group>
    </group>
  );
}

function Arch({ position, width }: { position: [number, number, number]; width: number }) {
  return (
    <mesh position={position} material={mat.black} castShadow>
      <boxGeometry args={[width, 0.16, 0.42]} />
    </mesh>
  );
}

function SideMirror({ x, y, z }: { x: number; y: number; z: number }) {
  const s = Math.sign(x) || 1;
  return (
    <group position={[x, y, z]}>
      <mesh position={[s * 0.06, 0, 0]} rotation={[0, 0, s * 0.5]} material={mat.black} castShadow>
        <boxGeometry args={[0.14, 0.025, 0.025]} />
      </mesh>
      <mesh position={[s * 0.14, 0.01, 0.02]} material={mat.black} castShadow>
        <boxGeometry args={[0.11, 0.16, 0.08]} />
      </mesh>
      <mesh position={[s * 0.14, 0.01, 0.055]} material={mat.glassLite}>
        <boxGeometry args={[0.08, 0.1, 0.012]} />
      </mesh>
    </group>
  );
}

function GoupilCab({ badge }: { badge: THREE.Texture }) {
  return (
    <group>
      <RoundedBox args={[1.68, 1.12, 1.72]} radius={0.18} smoothness={6} position={[0, 1.24, 1.12]} material={mat.white} castShadow receiveShadow />
      <mesh position={[0, 1.78, 1.05]} material={mat.white} castShadow>
        <boxGeometry args={[1.48, 0.08, 1.25]} />
      </mesh>
      <mesh position={[0, 1.8, 1.62]} rotation={[-0.55, 0, 0]} material={mat.black} castShadow>
        <boxGeometry args={[1.5, 0.07, 0.62]} />
      </mesh>
      <mesh position={[0, 1.46, 1.98]} rotation={[-0.48, 0, 0]} material={mat.black} castShadow>
        <boxGeometry args={[1.46, 0.78, 0.07]} />
      </mesh>
      <mesh position={[0, 1.48, 2.02]} rotation={[-0.48, 0, 0]} material={mat.glass} castShadow>
        <boxGeometry args={[1.28, 0.58, 0.03]} />
      </mesh>
      <mesh position={[0.15, 1.62, 2.06]} rotation={[-0.5, 0, 0.55]} material={mat.black}>
        <boxGeometry args={[0.48, 0.018, 0.02]} />
      </mesh>
      {[-0.66, 0.66].map((x) => (
        <mesh key={x} position={[x, 1.42, 1.82]} rotation={[-0.4, 0, x > 0 ? -0.18 : 0.18]} material={mat.black} castShadow>
          <boxGeometry args={[0.08, 0.72, 0.1]} />
        </mesh>
      ))}
      <mesh position={[0, 1.22, 0.28]} material={mat.black}>
        <boxGeometry args={[1.66, 0.02, 0.03]} />
      </mesh>

      <RoundedBox args={[1.5, 0.48, 0.18]} radius={0.08} smoothness={4} position={[0, 0.74, 2.38]} material={mat.blue} castShadow />
      <mesh position={[0, 0.48, 2.42]} material={mat.black} castShadow>
        <boxGeometry args={[1.62, 0.16, 0.14]} />
      </mesh>
      {[-0.46, 0.46].map((x) => (
        <group key={x} position={[x, 0.78, 2.5]}>
          <mesh material={mat.black}>
            <torusGeometry args={[0.085, 0.02, 10, 22]} />
          </mesh>
          <mesh material={lamp}>
            <sphereGeometry args={[0.062, 18, 18]} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.78, 2.5]} rotation={[Math.PI / 2, 0, 0]} material={mat.chrome}>
        <cylinderGeometry args={[0.05, 0.05, 0.02, 16]} />
      </mesh>
      <mesh position={[0, 0.78, 2.515]} rotation={[Math.PI / 2, 0, 0]} material={mat.black}>
        <cylinderGeometry args={[0.028, 0.028, 0.012, 12]} />
      </mesh>

      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * 0.86, 1.28, 1.15]} material={mat.glass}>
            <boxGeometry args={[0.035, 0.58, 0.92]} />
          </mesh>
          <mesh position={[s * 0.875, 1.28, 1.15]} material={mat.black}>
            <boxGeometry args={[0.012, 0.66, 1.02]} />
          </mesh>
          <mesh position={[s * 0.89, 0.86, 1.15]} material={mat.black} castShadow>
            <boxGeometry args={[0.04, 0.22, 1.15]} />
          </mesh>
          <mesh position={[s * 0.9, 1.12, 1.55]} material={mat.chrome} castShadow>
            <boxGeometry args={[0.035, 0.06, 0.14]} />
          </mesh>
          <mesh position={[s * 0.9, 0.98, 1.42]} rotation={[0, s > 0 ? Math.PI / 2 : -Math.PI / 2, 0]}>
            <planeGeometry args={[0.32, 0.14]} />
            <meshStandardMaterial map={badge} roughness={0.4} />
          </mesh>
          <SideMirror x={s * 0.92} y={1.58} z={1.72} />
        </group>
      ))}
      <mesh position={[0.72, 0.58, 1.95]} material={mat.blackSoft} castShadow>
        <boxGeometry args={[0.28, 0.05, 0.36]} />
      </mesh>
      <mesh position={[-0.72, 0.58, 1.95]} material={mat.blackSoft} castShadow>
        <boxGeometry args={[0.28, 0.05, 0.36]} />
      </mesh>
    </group>
  );
}

function RangerCab() {
  return (
    <group>
      <mesh position={[0, 0.82, 2.05]} rotation={[-0.28, 0, 0]} material={mat.silver} castShadow receiveShadow>
        <boxGeometry args={[1.74, 0.1, 1.35]} />
      </mesh>
      <mesh position={[0, 0.9, 2.15]} material={mat.silver}>
        <boxGeometry args={[0.28, 0.06, 1.05]} />
      </mesh>
      <mesh position={[0, 0.62, 2.55]} material={mat.silverDark} castShadow>
        <boxGeometry args={[1.78, 0.28, 0.22]} />
      </mesh>
      <mesh position={[0, 0.46, 2.6]} material={mat.black} castShadow>
        <boxGeometry args={[1.7, 0.12, 0.16]} />
      </mesh>
      <mesh position={[0, 0.78, 2.66]} material={mat.black} castShadow>
        <boxGeometry args={[0.78, 0.32, 0.05]} />
      </mesh>
      <mesh position={[0, 0.78, 2.69]} material={mat.chrome}>
        <boxGeometry args={[0.7, 0.24, 0.015]} />
      </mesh>
      {[0.08, 0.02, -0.04, -0.1].map((y) => (
        <mesh key={y} position={[0, 0.78 + y, 2.705]} material={mat.black}>
          <boxGeometry args={[0.66, 0.012, 0.012]} />
        </mesh>
      ))}
      <mesh position={[0, 0.96, 2.64]} material={mat.chrome}>
        <boxGeometry args={[0.22, 0.1, 0.03]} />
      </mesh>
      {[-0.62, 0.62].map((x) => (
        <group key={x} position={[x, 0.78, 2.66]}>
          <mesh material={mat.chrome} castShadow>
            <boxGeometry args={[0.32, 0.16, 0.06]} />
          </mesh>
          <mesh position={[0, 0.01, 0.03]} material={lamp}>
            <boxGeometry args={[0.24, 0.09, 0.02]} />
          </mesh>
          <mesh position={[Math.sign(x) * 0.1, -0.1, 0.02]} material={mat.amber}>
            <boxGeometry args={[0.1, 0.045, 0.02]} />
          </mesh>
        </group>
      ))}

      <RoundedBox args={[1.78, 0.98, 1.28]} radius={0.05} smoothness={4} position={[0, 1.34, 0.98]} material={mat.silver} castShadow receiveShadow />
      <mesh position={[0, 1.84, 0.9]} material={mat.silver} castShadow>
        <boxGeometry args={[1.7, 0.05, 1.15]} />
      </mesh>
      <mesh position={[0, 1.52, 1.58]} rotation={[-0.5, 0, 0]} material={mat.black} castShadow>
        <boxGeometry args={[1.58, 0.62, 0.06]} />
      </mesh>
      <mesh position={[0, 1.54, 1.62]} rotation={[-0.5, 0, 0]} material={mat.glass} castShadow>
        <boxGeometry args={[1.4, 0.46, 0.025]} />
      </mesh>
      <mesh position={[0.28, 1.68, 1.66]} rotation={[-0.55, 0, 0.4]} material={mat.black}>
        <boxGeometry args={[0.5, 0.016, 0.018]} />
      </mesh>
      <mesh position={[-0.22, 1.66, 1.64]} rotation={[-0.55, 0, -0.35]} material={mat.black}>
        <boxGeometry args={[0.42, 0.016, 0.018]} />
      </mesh>
      <mesh position={[0, 1.22, 0.36]} material={mat.black}>
        <boxGeometry args={[1.76, 0.015, 0.02]} />
      </mesh>
      <mesh position={[0, 1.35, 0.34]} material={mat.glass}>
        <boxGeometry args={[1.2, 0.28, 0.03]} />
      </mesh>

      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * 0.9, 1.38, 1.02]} material={mat.black}>
            <boxGeometry args={[0.018, 0.62, 0.86]} />
          </mesh>
          <mesh position={[s * 0.91, 1.4, 1.02]} material={mat.glass}>
            <boxGeometry args={[0.02, 0.46, 0.7]} />
          </mesh>
          <mesh position={[s * 0.91, 0.98, 1.02]} material={mat.blackSoft} castShadow>
            <boxGeometry args={[0.03, 0.16, 1.05]} />
          </mesh>
          <mesh position={[s * 0.93, 1.16, 1.32]} material={mat.chrome} castShadow>
            <boxGeometry args={[0.03, 0.045, 0.16]} />
          </mesh>
          <mesh position={[s * 0.96, 0.55, 1.55]} material={mat.black} castShadow>
            <boxGeometry args={[0.18, 0.08, 0.55]} />
          </mesh>
          <SideMirror x={s * 0.98} y={1.55} z={1.22} />
        </group>
      ))}
      <mesh position={[0.42, 1.98, 0.72]} material={mat.black}>
        <cylinderGeometry args={[0.006, 0.006, 0.28, 6]} />
      </mesh>
    </group>
  );
}

/** Goupil G6 dle výkresu: 5127 × 1974 × 2381 mm, podpěry 2988 mm. Převis 586, rozvor 3450, záď 1092. */
export function Goupil({ pose }: { pose: MachinePose }) {
  const g6 = useLabel("G6", "#1d74d6", "#ffffff", 256, 128);
  const comet = useLabel("COMET", "#f4f7f8", "#0e4ea8");
  const chevron = useChevrons();
  const half = 5.127 / 2;
  const frontAxle = half - 0.586;
  const rearAxle = -half + 1.092;
  const track = 0.78;

  return (
    <group>
      <mesh position={[0, 0.42, -0.05]} material={mat.black} castShadow>
        <boxGeometry args={[0.72, 0.16, 4.7]} />
      </mesh>
      <mesh position={[0.42, 0.38, -0.1]} material={mat.blackSoft} castShadow>
        <boxGeometry args={[0.1, 0.14, 4.4]} />
      </mesh>
      <mesh position={[-0.42, 0.38, -0.1]} material={mat.blackSoft} castShadow>
        <boxGeometry args={[0.1, 0.14, 4.4]} />
      </mesh>

      <Wheel position={[-track, 0.36, frontAxle]} radius={0.36} width={0.22} />
      <Wheel position={[track, 0.36, frontAxle]} radius={0.36} width={0.22} />
      <Wheel position={[-track, 0.36, rearAxle]} radius={0.36} width={0.24} />
      <Wheel position={[track, 0.36, rearAxle]} radius={0.36} width={0.24} />
      <Arch position={[0, 0.5, frontAxle]} width={1.92} />
      <Arch position={[0, 0.48, rearAxle]} width={1.86} />

      <GoupilCab badge={g6} />
      <mesh position={[0.72, 0.7, -2.35]} material={mat.hazardRed} castShadow>
        <boxGeometry args={[0.16, 0.1, 0.06]} />
      </mesh>
      <mesh position={[-0.72, 0.7, -2.35]} material={mat.hazardRed} castShadow>
        <boxGeometry args={[0.16, 0.1, 0.06]} />
      </mesh>

      <mesh position={[0, 0.86, -1.05]} material={mat.whiteDark} castShadow receiveShadow>
        <boxGeometry args={[1.58, 0.08, 2.7]} />
      </mesh>
      <mesh position={[0.76, 1.05, -1.15]} material={mat.white} castShadow>
        <boxGeometry args={[0.05, 0.28, 2.35]} />
      </mesh>
      <mesh position={[-0.76, 1.05, -1.15]} material={mat.white} castShadow>
        <boxGeometry args={[0.05, 0.28, 2.35]} />
      </mesh>
      <mesh position={[-0.72, 0.72, -0.55]} material={mat.silverDark} castShadow>
        <boxGeometry args={[0.32, 0.22, 0.55]} />
      </mesh>

      <mesh position={[0.18, 1.35, -0.15]} material={mat.green} castShadow>
        <boxGeometry args={[0.28, 0.7, 0.32]} />
      </mesh>
      <mesh position={[0.34, 1.55, -0.15]} rotation={[0, 0, Math.PI / 2]}>
        <planeGeometry args={[0.55, 0.16]} />
        <meshStandardMaterial map={comet} roughness={0.4} />
      </mesh>
      <KnuckleBoom
        lift={pose.lift}
        pivot={[0.05, 1.02, -0.55]}
        lower={[0.92, 3.5]}
        upper={[0.8, 3.2]}
        fold={[-1.28, 2.52]}
        raised={[-0.38, 0.5]}
        basketSide={-0.46}
        basket={[0.68, 0.88, 0.62]}
      />
      <mesh position={[-0.55, 1.15, -1.7]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.5, 0.12]} />
        <meshStandardMaterial map={chevron} roughness={0.5} />
      </mesh>

      <Outriggers zs={[-0.15, -1.7]} reach={1.494} bodyHalf={0.86} beamY={0.58} extension={pose.legs} />
    </group>
  );
}

/**
 * Ford Ranger single cab 4×4 XL + COMET X4-14.
 * 5277 mm (905 + 3220 + 1152), karoserie 1860, podpěry 2910, složená výška 2800.
 * Pracovní výška 14 m, vyložení cca 6 m. Na stánku začíná složená.
 */
export function Foton({ pose }: { pose: MachinePose }) {
  const comet = useLabel("COMET", "#f7f8fa", "#0e4ea8");
  const chevron = useChevrons();
  const half = 5.277 / 2;
  const frontAxle = half - 0.905;
  const rearAxle = -half + 1.152;
  const track = 0.78;

  return (
    <group>
      <mesh position={[0, 0.46, 0.05]} material={mat.black} castShadow>
        <boxGeometry args={[0.78, 0.14, 4.85]} />
      </mesh>
      <mesh position={[0.48, 0.4, 0.1]} material={mat.silverDark} castShadow>
        <boxGeometry args={[0.08, 0.12, 4.5]} />
      </mesh>
      <mesh position={[-0.48, 0.4, 0.1]} material={mat.silverDark} castShadow>
        <boxGeometry args={[0.08, 0.12, 4.5]} />
      </mesh>

      <Wheel position={[-track, 0.38, frontAxle]} radius={0.38} width={0.24} />
      <Wheel position={[track, 0.38, frontAxle]} radius={0.38} width={0.24} />
      <Wheel position={[-track, 0.38, rearAxle]} radius={0.38} width={0.26} />
      <Wheel position={[track, 0.38, rearAxle]} radius={0.38} width={0.26} />
      <mesh position={[-0.95, 0.22, frontAxle - 0.15]} material={mat.blackSoft}>
        <boxGeometry args={[0.04, 0.28, 0.18]} />
      </mesh>
      <mesh position={[0.95, 0.22, frontAxle - 0.15]} material={mat.blackSoft}>
        <boxGeometry args={[0.04, 0.28, 0.18]} />
      </mesh>

      <RangerCab />
      <mesh position={[0.82, 0.78, -2.42]} material={mat.hazardRed} castShadow>
        <boxGeometry args={[0.22, 0.12, 0.06]} />
      </mesh>
      <mesh position={[-0.82, 0.78, -2.42]} material={mat.hazardRed} castShadow>
        <boxGeometry args={[0.22, 0.12, 0.06]} />
      </mesh>

      <mesh position={[0, 0.92, -0.95]} material={mat.silverDark} receiveShadow castShadow>
        <boxGeometry args={[1.62, 0.08, 2.7]} />
      </mesh>
      <mesh position={[0.8, 1.12, -0.85]} material={mat.silver} castShadow>
        <boxGeometry args={[0.05, 0.36, 2.35]} />
      </mesh>
      <mesh position={[-0.8, 1.12, -0.85]} material={mat.silver} castShadow>
        <boxGeometry args={[0.05, 0.36, 2.35]} />
      </mesh>
      <mesh position={[0, 1.08, -0.2]} material={mat.blackSoft}>
        <boxGeometry args={[1.4, 0.04, 0.9]} />
      </mesh>

      <RoundedBox args={[1.52, 0.82, 1.05]} radius={0.03} smoothness={2} position={[0, 1.36, -1.95]} material={mat.alu} castShadow receiveShadow />
      {[-0.28, -0.08, 0.12, 0.32].map((y) => (
        <mesh key={y} position={[0, 1.36 + y, -2.46]} material={mat.chrome}>
          <boxGeometry args={[1.28, 0.012, 0.012]} />
        </mesh>
      ))}
      <mesh position={[0.77, 1.22, -1.95]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.85, 0.26]} />
        <meshStandardMaterial map={comet} roughness={0.4} />
      </mesh>
      <mesh position={[-0.77, 1.22, -1.95]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[0.85, 0.26]} />
        <meshStandardMaterial map={comet} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.7, -2.48]} material={mat.hazardRed} castShadow>
        <boxGeometry args={[1.5, 0.08, 0.05]} />
      </mesh>

      <mesh position={[0.12, 1.55, -0.42]} material={mat.green} castShadow>
        <boxGeometry args={[0.26, 0.85, 0.26]} />
      </mesh>
      <mesh position={[0.28, 1.7, -0.42]}>
        <planeGeometry args={[0.02, 0.42]} />
        <meshStandardMaterial map={comet} roughness={0.4} />
      </mesh>
      <KnuckleBoom
        lift={pose.lift}
        pivot={[0, 1.15, -0.42]}
        lower={[1.15, 6.6]}
        upper={[1.05, 6.1]}
        fold={[-1.28, 2.55]}
        raised={[-0.42, 0.62]}
        basketSide={-0.48}
        basket={[0.7, 1.05, 0.64]}
      />
      <mesh position={[-0.55, 1.35, -0.15]} rotation={[0, 0.4, 0]}>
        <planeGeometry args={[0.55, 0.14]} />
        <meshStandardMaterial map={chevron} roughness={0.5} />
      </mesh>

      <Outriggers zs={[0.15, -1.55]} reach={1.455} bodyHalf={0.9} beamY={0.55} extension={pose.legs} />
    </group>
  );
}
