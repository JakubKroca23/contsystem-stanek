import * as THREE from "three";

export const mat = {
  white: new THREE.MeshStandardMaterial({ color: "#f3f5f7", roughness: 0.46, metalness: 0.06 }),
  whiteDark: new THREE.MeshStandardMaterial({ color: "#d5dbe2", roughness: 0.5, metalness: 0.08 }),
  black: new THREE.MeshStandardMaterial({ color: "#1a1d22", roughness: 0.55, metalness: 0.2 }),
  blackSoft: new THREE.MeshStandardMaterial({ color: "#2a2e33", roughness: 0.6, metalness: 0.15 }),
  blue: new THREE.MeshStandardMaterial({ color: "#1d74d6", roughness: 0.4, metalness: 0.12 }),
  blueDeep: new THREE.MeshStandardMaterial({ color: "#0e4ea8", roughness: 0.35, metalness: 0.15 }),
  green: new THREE.MeshStandardMaterial({ color: "#2f9a45", roughness: 0.42, metalness: 0.18 }),
  greenDark: new THREE.MeshStandardMaterial({ color: "#1d6e32", roughness: 0.45, metalness: 0.16 }),
  silver: new THREE.MeshStandardMaterial({ color: "#c5cacf", roughness: 0.32, metalness: 0.72 }),
  silverDark: new THREE.MeshStandardMaterial({ color: "#8e959c", roughness: 0.38, metalness: 0.65 }),
  chrome: new THREE.MeshStandardMaterial({ color: "#d7dde3", roughness: 0.22, metalness: 0.85 }),
  rubber: new THREE.MeshStandardMaterial({ color: "#1c1c1c", roughness: 0.86, metalness: 0.02 }),
  glass: new THREE.MeshStandardMaterial({
    color: "#163044",
    roughness: 0.08,
    metalness: 0.15,
    transparent: true,
    opacity: 0.72,
  }),
  glassLite: new THREE.MeshStandardMaterial({
    color: "#9fb4c4",
    roughness: 0.05,
    metalness: 0.1,
    transparent: true,
    opacity: 0.35,
  }),
  yellow: new THREE.MeshStandardMaterial({ color: "#f0b429", roughness: 0.5, metalness: 0.12 }),
  foot: new THREE.MeshStandardMaterial({ color: "#3a3f44", roughness: 0.7, metalness: 0.3 }),
  alu: new THREE.MeshStandardMaterial({ color: "#e4e8ec", roughness: 0.35, metalness: 0.55 }),
  hazardRed: new THREE.MeshStandardMaterial({ color: "#d7263d", roughness: 0.45, metalness: 0.05 }),
  wood: new THREE.MeshStandardMaterial({ color: "#c9b79a", roughness: 0.62, metalness: 0.02 }),
  cloth: new THREE.MeshStandardMaterial({ color: "#1a4f86", roughness: 0.8, metalness: 0.02 }),
  skin: new THREE.MeshStandardMaterial({ color: "#d7b094", roughness: 0.7, metalness: 0 }),
  concrete: new THREE.MeshStandardMaterial({ color: "#d5d2cc", roughness: 0.92, metalness: 0 }),
  stand: new THREE.MeshStandardMaterial({ color: "#e4e0d8", roughness: 0.9, metalness: 0 }),
  terra: new THREE.MeshStandardMaterial({ color: "#8d4e38", roughness: 0.85, metalness: 0 }),
  wall: new THREE.MeshStandardMaterial({ color: "#8d9298", roughness: 0.78, metalness: 0.04 }),
  wallLite: new THREE.MeshStandardMaterial({ color: "#c5c8cc", roughness: 0.7, metalness: 0.02 }),
  steel: new THREE.MeshStandardMaterial({ color: "#9aa1a8", roughness: 0.4, metalness: 0.7 }),
  door: new THREE.MeshStandardMaterial({ color: "#b7bcc1", roughness: 0.45, metalness: 0.35 }),
  red: new THREE.MeshStandardMaterial({ color: "#c62828", roughness: 0.5, metalness: 0.08 }),
  flagPole: new THREE.MeshStandardMaterial({ color: "#cfd3d6", roughness: 0.35, metalness: 0.6 }),
};

export function canvasTexture(
  width: number,
  height: number,
  draw: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void,
  repeat?: [number, number],
) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  draw(ctx, canvas);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  if (repeat) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(repeat[0], repeat[1]);
  }
  texture.needsUpdate = true;
  return texture;
}
