"use client";

import { useMemo } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { BOOTH_D, BOOTH_SHIFT_X, BOOTH_SHIFT_Z, BOOTH_W, CORNER_X, DOOR_H, DOOR_W, DOOR_X } from "@/lib/layout";
import { canvasTexture, mat } from "./materials";

function Column({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 4.6, 0]} material={mat.steel} castShadow receiveShadow>
        <boxGeometry args={[0.28, 9.2, 0.18]} />
      </mesh>
      <mesh position={[0, 4.6, 0]} material={mat.steel}>
        <boxGeometry args={[0.12, 9.2, 0.42]} />
      </mesh>
      <mesh position={[0, 0.08, 0]} material={mat.steel} receiveShadow>
        <boxGeometry args={[0.7, 0.08, 0.7]} />
      </mesh>
    </group>
  );
}

export function Hall() {
  const ribs = useMemo(
    () =>
      canvasTexture(64, 256, (ctx) => {
        ctx.fillStyle = "#8b9096";
        ctx.fillRect(0, 0, 64, 256);
        for (let y = 0; y < 256; y += 10) {
          ctx.fillStyle = y % 20 === 0 ? "#747a80" : "#a0a6ab";
          ctx.fillRect(0, y, 64, 3);
        }
      }, [6, 3]),
    [],
  );
  const floorTex = useMemo(
    () =>
      canvasTexture(256, 256, (ctx) => {
        ctx.fillStyle = "#d4d1cb";
        ctx.fillRect(0, 0, 256, 256);
        for (let i = 0; i < 1800; i += 1) {
          const n = Math.sin(i * 12.9898) * 43758.5453;
          const frac = n - Math.floor(n);
          const m = Math.sin(i * 78.233) * 24634.6345;
          const frac2 = m - Math.floor(m);
          const v = 190 + Math.floor(frac * 30);
          ctx.fillStyle = `rgba(${v},${v - 2},${v - 6},0.35)`;
          ctx.fillRect(frac * 256, frac2 * 256, 2, 2);
        }
        ctx.strokeStyle = "rgba(120,116,110,0.45)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 128);
        ctx.lineTo(256, 128);
        ctx.moveTo(128, 0);
        ctx.lineTo(128, 256);
        ctx.stroke();
      }, [8, 6]),
    [],
  );
  const sign = useMemo(
    () =>
      canvasTexture(1024, 420, (ctx) => {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 1024, 420);
        ctx.strokeStyle = "#d21f26";
        ctx.lineWidth = 28;
        ctx.strokeRect(16, 16, 992, 388);
        ctx.fillStyle = "#d21f26";
        ctx.beginPath();
        ctx.moveTo(150, 300);
        ctx.lineTo(250, 300);
        ctx.lineTo(250, 230);
        ctx.lineTo(330, 230);
        ctx.lineTo(200, 90);
        ctx.lineTo(70, 230);
        ctx.lineTo(150, 230);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#c4161c";
        ctx.font = "800 150px Arial, Helvetica, sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText("HALA 7", 390, 175);
        ctx.font = "700 78px Arial, Helvetica, sans-serif";
        ctx.fillText("HALL 7", 394, 300);
      }),
    [],
  );
  const floorMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: floorTex,
        color: "#e7e4de",
        roughness: 0.94,
        metalness: 0,
      }),
    [floorTex],
  );
  const ribMat = useMemo(
    () => new THREE.MeshStandardMaterial({ map: ribs, roughness: 0.82, metalness: 0.05 }),
    [ribs],
  );

  const wallZ = -3.4;
  const wallCenter = 12;
  const wallW = 42;
  const hallH = 9.2;
  const columns = [CORNER_X, 6.2, DOOR_X + 3.6, 24];
  const leaf = DOOR_W / 2;

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[wallCenter, -0.02, 8]} receiveShadow material={floorMat}>
        <planeGeometry args={[wallW + 8, 36]} />
      </mesh>

      <mesh position={[wallCenter, 0.01, wallZ + 0.55]} rotation={[-Math.PI / 2, 0, 0]} material={mat.terra} receiveShadow>
        <planeGeometry args={[wallW, 1.1]} />
      </mesh>

      <mesh position={[wallCenter, 3.9, wallZ]} material={ribMat} receiveShadow>
        <boxGeometry args={[wallW, 7.4, 0.18]} />
      </mesh>
      <mesh position={[wallCenter, 8.4, wallZ]} material={mat.wallLite} receiveShadow>
        <boxGeometry args={[wallW, 1.6, 0.16]} />
      </mesh>
      <mesh position={[wallCenter, 6.2, wallZ + 0.08]} material={mat.steel}>
        <boxGeometry args={[wallW, 0.1, 0.1]} />
      </mesh>
      <mesh position={[wallCenter, 0.1, wallZ + 0.08]} material={mat.whiteDark} receiveShadow>
        <boxGeometry args={[wallW, 0.2, 0.12]} />
      </mesh>

      <mesh position={[wallCenter, hallH - 0.15, wallZ + 0.28]} material={mat.steel}>
        <boxGeometry args={[wallW - 1, 0.16, 0.36]} />
      </mesh>

      {columns.map((x) => (
        <Column key={x} position={[x, 0, wallZ + 0.35]} />
      ))}

      <mesh position={[CORNER_X, hallH / 2, 2.4]} material={ribMat} receiveShadow>
        <boxGeometry args={[0.18, hallH, 12.2]} />
      </mesh>
      <mesh position={[CORNER_X + 0.2, 0.1, 2.4]} material={mat.whiteDark}>
        <boxGeometry args={[0.12, 0.2, 12.2]} />
      </mesh>

      <mesh position={[DOOR_X, DOOR_H / 2, wallZ + 0.12]} material={mat.blackSoft}>
        <boxGeometry args={[DOOR_W - 0.02, DOOR_H - 0.02, 0.12]} />
      </mesh>
      <group position={[DOOR_X, 0, wallZ + 0.22]}>
        {[-leaf / 2, leaf / 2].map((x) => (
          <group key={x} position={[x, DOOR_H / 2, 0]}>
            <mesh material={mat.door} castShadow receiveShadow>
              <boxGeometry args={[leaf - 0.02, DOOR_H, 0.05]} />
            </mesh>
            <mesh position={[0, 0.28, 0.035]} material={mat.glassLite}>
              <boxGeometry args={[leaf - 0.22, 0.85, 0.02]} />
            </mesh>
            <mesh position={[x > 0 ? -0.28 : 0.28, -0.05, 0.04]} material={mat.chrome}>
              <boxGeometry args={[0.08, 0.035, 0.03]} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, DOOR_H + 0.05, 0]} material={mat.steel}>
          <boxGeometry args={[DOOR_W + 0.18, 0.1, 0.08]} />
        </mesh>
        <mesh position={[-(DOOR_W / 2 + 0.04), DOOR_H / 2, 0]} material={mat.steel}>
          <boxGeometry args={[0.08, DOOR_H, 0.08]} />
        </mesh>
        <mesh position={[DOOR_W / 2 + 0.04, DOOR_H / 2, 0]} material={mat.steel}>
          <boxGeometry args={[0.08, DOOR_H, 0.08]} />
        </mesh>
      </group>

      <mesh position={[DOOR_X, DOOR_H + 0.72, wallZ + 0.2]}>
        <planeGeometry args={[2.15, 0.88]} />
        <meshStandardMaterial map={sign} roughness={0.55} />
      </mesh>

      {[DOOR_X - 1.7, DOOR_X + 1.7].map((x) => (
        <mesh key={x} position={[x, 1.15, wallZ + 0.28]} material={mat.red} castShadow>
          <boxGeometry args={[0.55, 0.78, 0.22]} />
        </mesh>
      ))}

      <mesh position={[30, hallH / 2, 8]} material={mat.wall} receiveShadow>
        <boxGeometry args={[0.2, hallH, 24]} />
      </mesh>
      {[2, 10, 18].map((x) => (
        <mesh key={x} position={[x, hallH - 0.35, 3.5]} material={mat.white}>
          <boxGeometry args={[2.4, 0.08, 0.28]} />
        </mesh>
      ))}

      <Html position={[BOOTH_SHIFT_X + BOOTH_W / 2, 0.15, BOOTH_SHIFT_Z + BOOTH_D + 0.55]} center transform sprite distanceFactor={8} zIndexRange={[0, 0]} style={{ pointerEvents: "none" }}>
        <div className="whitespace-nowrap text-[13px] font-medium text-[#3c4450]">10,00 m · ulička</div>
      </Html>
      <Html position={[BOOTH_SHIFT_X - 0.7, 0.15, BOOTH_SHIFT_Z + BOOTH_D / 2]} center transform sprite distanceFactor={8} zIndexRange={[0, 0]} style={{ pointerEvents: "none" }}>
        <div className="whitespace-nowrap text-[13px] font-medium text-[#3c4450]">5,00 m</div>
      </Html>
    </group>
  );
}

export function BoothPad() {
  const grid = useMemo(() => {
    const y = 0.03;
    const data: number[] = [];
    for (let i = 0; i <= BOOTH_W; i += 1) data.push(i, y, 0, i, y, BOOTH_D);
    for (let j = 0; j <= BOOTH_D; j += 1) data.push(0, y, j, BOOTH_W, y, j);
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.Float32BufferAttribute(data, 3));
    return geom;
  }, []);
  const border = useMemo(() => {
    const y = 0.04;
    const data = new Float32Array([
      0, y, 0, BOOTH_W, y, 0,
      BOOTH_W, y, 0, BOOTH_W, y, BOOTH_D,
      BOOTH_W, y, BOOTH_D, 0, y, BOOTH_D,
      0, y, BOOTH_D, 0, y, 0,
    ]);
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(data, 3));
    return geom;
  }, []);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[BOOTH_W / 2, 0.005, BOOTH_D / 2]} receiveShadow material={mat.stand}>
        <planeGeometry args={[BOOTH_W, BOOTH_D]} />
      </mesh>
      <lineSegments geometry={grid}>
        <lineBasicMaterial color="#b7b1a6" />
      </lineSegments>
      <lineSegments geometry={border}>
        <lineBasicMaterial color="#c0392b" />
      </lineSegments>
    </group>
  );
}
