"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { publicPath } from "@/lib/public-path";
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
  const logo = useTexture(publicPath("/brand/contsystem-logo.png"));
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

/** Péřová vlajka 3800 × 800 mm. Tyč vpravo, plachta doleva, jako na výkrese. */
function useFeatherGeometry() {
  return useMemo(() => {
    const y0 = 0.5;
    const y1 = 3.5;
    const shape = new THREE.Shape();
    shape.moveTo(0, y0);
    shape.lineTo(0, y1);
    shape.bezierCurveTo(-0.12, y1 + 0.1, -0.5, y1 + 0.04, -0.66, y1 - 0.42);
    shape.bezierCurveTo(-0.82, y1 - 1.15, -0.8, y0 + 0.45, -0.8, y0);
    shape.lineTo(0, y0);
    const geom = new THREE.ShapeGeometry(shape, 28);
    const pos = geom.attributes.position;
    const uv = geom.attributes.uv;
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (let i = 0; i < pos.count; i += 1) {
      minX = Math.min(minX, pos.getX(i));
      maxX = Math.max(maxX, pos.getX(i));
      minY = Math.min(minY, pos.getY(i));
      maxY = Math.max(maxY, pos.getY(i));
    }
    const spanX = maxX - minX || 1;
    const spanY = maxY - minY || 1;
    for (let i = 0; i < pos.count; i += 1) {
      uv.setXY(i, (pos.getX(i) - minX) / spanX, (pos.getY(i) - minY) / spanY);
    }
    uv.needsUpdate = true;
    return geom;
  }, []);
}

function recolorLogo(source: CanvasImageSource, silver: boolean) {
  const image = source as HTMLImageElement;
  const width = image.naturalWidth || image.width;
  const height = image.naturalHeight || image.height;
  const tmp = document.createElement("canvas");
  tmp.width = width;
  tmp.height = height;
  const ctx = tmp.getContext("2d");
  if (!ctx) return tmp;
  ctx.drawImage(image, 0, 0, width, height);
  if (!silver) return tmp;
  const data = ctx.getImageData(0, 0, width, height);
  const px = data.data;
  for (let i = 0; i < px.length; i += 4) {
    const r = px[i];
    const g = px[i + 1];
    const b = px[i + 2];
    const a = px[i + 3];
    if (a < 8 || (r > 235 && g > 235 && b > 235)) {
      px[i + 3] = 0;
      continue;
    }
    const blue = b > r + 25 && b > g + 10;
    if (!blue) {
      px[i] = 188;
      px[i + 1] = 192;
      px[i + 2] = 198;
      px[i + 3] = 255;
    }
  }
  ctx.putImageData(data, 0, 0);
  return tmp;
}

function drawFeatherLogo(ctx: CanvasRenderingContext2D, logo: CanvasImageSource, cloth: string, silver: boolean) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  ctx.fillStyle = cloth;
  ctx.fillRect(0, 0, width, height);
  const prepared = recolorLogo(logo, silver);
  const maxAcross = width * 0.7;
  const maxAlong = height * 0.78;
  const scale = Math.min(maxAcross / prepared.height, maxAlong / prepared.width);
  const dw = prepared.width * scale;
  const dh = prepared.height * scale;
  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.drawImage(prepared, -dw / 2, -dh / 2, dw, dh);
  ctx.restore();
}

function FeatherFlag({ map }: { map: THREE.Texture }) {
  const geom = useFeatherGeometry();
  return (
    <group>
      <mesh position={[0, 0.04, 0]} material={mat.black} receiveShadow>
        <boxGeometry args={[0.4, 0.08, 0.4]} />
      </mesh>
      <mesh position={[0, 1.94, 0]} material={mat.black} castShadow>
        <cylinderGeometry args={[0.015, 0.02, 3.72, 12]} />
      </mesh>
      <mesh geometry={geom} castShadow>
        <meshStandardMaterial map={map} roughness={0.8} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export function FlagContsystem() {
  const logo = useTexture(publicPath("/brand/contsystem-logo.png"));
  const map = useMemo(
    () => canvasTexture(640, 1280, (ctx) => drawFeatherLogo(ctx, logo.image as CanvasImageSource, "#141416", true)),
    [logo],
  );
  return <FeatherFlag map={map} />;
}

export function FlagComet() {
  const logo = useTexture(publicPath("/brand/comet-logo.png"));
  const map = useMemo(
    () => canvasTexture(640, 1280, (ctx) => drawFeatherLogo(ctx, logo.image as CanvasImageSource, "#f7f8fa", false)),
    [logo],
  );
  return <FeatherFlag map={map} />;
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
