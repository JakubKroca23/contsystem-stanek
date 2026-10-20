"use client";

import { useMemo } from "react";
import { canvasTexture, mat } from "./materials";

/** Europaleta 1200 × 800 × 144 mm, střed v počátku skupiny. */
function EuroPallet() {
  const deck = 0.022;
  const blockH = 0.1;
  const runners = [-0.3275, 0, 0.3275];
  const blockZ = [-0.5275, 0, 0.5275];
  const topBoards = [
    { z: -0.528, w: 0.145 },
    { z: -0.27, w: 0.1 },
    { z: 0, w: 0.145 },
    { z: 0.27, w: 0.1 },
    { z: 0.528, w: 0.145 },
  ];
  return (
    <group>
      {runners.map((x) => (
        <mesh key={`run-${x}`} position={[x, deck / 2, 0]} material={x === 0 ? mat.woodDark : mat.wood} castShadow receiveShadow>
          <boxGeometry args={[0.145, deck, 1.2]} />
        </mesh>
      ))}
      {runners.map((x) =>
        blockZ.map((z) => (
          <mesh key={`block-${x}-${z}`} position={[x, deck + blockH / 2, z]} material={mat.woodDark} castShadow receiveShadow>
            <boxGeometry args={[0.145, blockH, 0.145]} />
          </mesh>
        )),
      )}
      {topBoards.map((board, index) => (
        <group key={`top-${board.z}`}>
          <mesh
            position={[0, deck + blockH + deck / 2, board.z]}
            material={index % 2 === 0 ? mat.wood : mat.woodDark}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[0.8, deck, board.w]} />
          </mesh>
          {[
            [-0.28, -board.w * 0.22],
            [0.28, -board.w * 0.22],
            [-0.28, board.w * 0.22],
            [0.28, board.w * 0.22],
          ].map(([x, z]) => (
            <mesh key={`${x}-${z}`} position={[x, 0.148, board.z + z]} material={mat.nail}>
              <cylinderGeometry args={[0.006, 0.006, 0.006, 8]} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function VallyLogo({ side }: { side: 1 | -1 }) {
  const map = useMemo(
    () =>
      canvasTexture(640, 200, (ctx) => {
        ctx.clearRect(0, 0, 640, 200);
        ctx.strokeStyle = "#102e22";
        ctx.fillStyle = "#102e22";
        ctx.lineWidth = 16;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.arc(86, 100, 46, 0.5, Math.PI * 1.75);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(86, 100, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = "700 104px sans-serif";
        ctx.textBaseline = "middle";
        ctx.fillText("Vally", 150, 108);
      }),
    [],
  );
  return (
    <mesh position={[side * 0.052, 1.56, -0.84]} rotation={[0, side === 1 ? Math.PI / 2 : -Math.PI / 2, 0]}>
      <planeGeometry args={[0.38, 0.12]} />
      <meshStandardMaterial map={map} transparent roughness={0.45} metalness={0.05} />
    </mesh>
  );
}

/**
 * Jeřábové paletové vidle VALLY 2000-600 na europaletě.
 * Vidlice 1148 × 100 × 40 mm leží na paletě, hrdlo je ve středu rozsahu 1113–1743 mm.
 * Skupina je vystředěná na půdorys 0,8 × 1,9 m; paleta je v ní posunutá dopředu.
 */
export function PalletForks() {
  const deck = 0.144;
  const forkLen = 1.148;
  const forkW = 0.1;
  const forkH = 0.04;
  const spread = 0.31;
  const tipZ = 0.56;
  const heelZ = tipZ - forkLen;
  const forkY = deck + forkH / 2 + 0.002;
  const mastZ = heelZ + 0.05;
  const teeth = [0, 1, 2, 3, 4, 5, 6, 7];

  return (
    <group position={[0, 0, 0.22]}>
      <EuroPallet />
      {[-spread, spread].map((x) => (
        <group key={x}>
          <mesh position={[x, forkY, (tipZ + heelZ) / 2 + 0.04]} material={mat.vallyGreen} castShadow receiveShadow>
            <boxGeometry args={[forkW, forkH, forkLen - 0.1]} />
          </mesh>
          <mesh position={[x, forkY - 0.006, tipZ - 0.04]} rotation={[0.22, 0, 0]} material={mat.vallyGreen} castShadow>
            <boxGeometry args={[forkW, 0.028, 0.1]} />
          </mesh>
          <mesh position={[x, deck + 0.09, heelZ + 0.03]} material={mat.vallyGreenDark} castShadow>
            <boxGeometry args={[forkW, 0.12, 0.06]} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, deck + 0.16, heelZ + 0.02]} material={mat.vallyGreen} castShadow receiveShadow>
        <boxGeometry args={[0.74, 0.28, 0.045]} />
      </mesh>
      <mesh position={[0, deck + 0.31, heelZ - 0.01]} material={mat.vallyGreenDark} castShadow>
        <boxGeometry args={[0.42, 0.08, 0.05]} />
      </mesh>
      {[-0.39, 0.39].map((x) => (
        <mesh key={x} position={[x, deck + 0.2, heelZ + 0.03]} rotation={[0, 0, Math.PI / 2]} material={mat.vallyLime} castShadow>
          <cylinderGeometry args={[0.016, 0.016, 0.06, 12]} />
        </mesh>
      ))}
      <mesh position={[0, 0.92, mastZ]} material={mat.vallyGreen} castShadow>
        <boxGeometry args={[0.12, 1.36, 0.1]} />
      </mesh>
      <mesh position={[0, deck + 0.2, mastZ + 0.02]} material={mat.vallyGreenDark} castShadow>
        <boxGeometry args={[0.2, 0.08, 0.08]} />
      </mesh>
      <mesh position={[0, 1.52, mastZ]} material={mat.vallyLime} castShadow>
        <boxGeometry args={[0.16, 0.18, 0.16]} />
      </mesh>
      <mesh position={[0, 1.56, mastZ - 0.3]} material={mat.vallyLime} castShadow receiveShadow>
        <boxGeometry args={[0.09, 0.12, 0.58]} />
      </mesh>
      {teeth.map((i) => (
        <mesh key={i} position={[0, 1.655, mastZ - 0.08 - i * 0.065]} material={mat.vallyLime} castShadow>
          <boxGeometry args={[0.092, 0.045, 0.03]} />
        </mesh>
      ))}
      <mesh position={[0, 1.6, mastZ - 0.58]} material={mat.vallyLime} castShadow>
        <boxGeometry args={[0.05, 0.22, 0.04]} />
      </mesh>
      <mesh position={[0, 1.68, mastZ - 0.61]} rotation={[0, Math.PI / 2, 0]} material={mat.vallyLime} castShadow>
        <torusGeometry args={[0.055, 0.013, 12, 28]} />
      </mesh>
      <VallyLogo side={1} />
      <VallyLogo side={-1} />
    </group>
  );
}
