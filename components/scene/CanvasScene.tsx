"use client";

import { Suspense, useRef, type RefObject } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, Html, OrbitControls, TransformControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import {
  DEFAULT_MACHINE,
  PLAN_GHOSTS,
  footprintOutside,
  type Exhibit,
  type MachinePose,
  normDeg,
  round2,
} from "@/lib/layout";
import { FootprintLines } from "./primitives";
import { Foton, Goupil } from "./vehicles";
import { BarStool, Counter, Figure, FlagComet, FlagContsystem, MetalChair, RoundTable } from "./furniture";
import { BoothPad, Hall } from "./Hall";

export type GizmoMode = "translate" | "rotate";

function Model({ kind, pose }: { kind: Exhibit["kind"]; pose: MachinePose }) {
  switch (kind) {
    case "goupil":
      return <Goupil pose={pose} />;
    case "foton":
      return <Foton pose={pose} />;
    case "table":
      return <RoundTable />;
    case "chair":
      return <MetalChair />;
    case "counter":
      return <Counter />;
    case "stool":
      return <BarStool />;
    case "flag-cs":
      return <FlagContsystem />;
    case "flag-comet":
      return <FlagComet />;
    case "figure":
      return <Figure />;
    default:
      return null;
  }
}

function SelectionMark({ item, selected, hovered }: { item: Exhibit; selected: boolean; hovered: boolean }) {
  if (!selected && !hovered) return null;
  return (
    <group>
      <FootprintLines w={item.w + (selected ? 0.16 : 0.04)} d={item.d + (selected ? 0.16 : 0.04)} color={selected ? "#3aa0ff" : "#ffffff"} y={0.07} />
      {selected && (
        <mesh position={[0, item.h / 2, 0]}>
          <boxGeometry args={[item.w + 0.08, item.h + 0.06, item.d + 0.08]} />
          <meshBasicMaterial color="#3aa0ff" wireframe transparent opacity={0.9} />
        </mesh>
      )}
    </group>
  );
}

function ObjectHud({
  item,
  mode,
  pose,
  onMode,
  onNudge,
  onPose,
}: {
  item: Exhibit;
  mode: GizmoMode;
  pose?: MachinePose;
  onMode: (mode: GizmoMode) => void;
  onNudge: (dx: number, dz: number, dRot: number) => void;
  onPose: (id: string, patch: Partial<MachinePose>) => void;
}) {
  const vehicle = item.kind === "goupil" || item.kind === "foton";
  const btn = "rounded bg-white/10 px-2 py-1 text-xs hover:bg-white/20";
  return (
    <Html position={[0, item.h + 0.55, 0]} center zIndexRange={[40, 0]} style={{ pointerEvents: "auto" }}>
      <div
        className="w-[228px] rounded-xl border border-white/25 bg-[#12151a]/70 p-2 text-white shadow-2xl backdrop-blur-md"
        onPointerDown={(event) => event.stopPropagation()}
      >
        <div className="truncate text-sm font-medium">{item.name}</div>
        <div className="mt-2 flex gap-1">
          <button type="button" data-on={mode === "translate"} onClick={() => onMode("translate")} className={`${btn} data-[on=true]:bg-[#1574d4]`}>
            Posun
          </button>
          <button type="button" data-on={mode === "rotate"} onClick={() => onMode("rotate")} className={`${btn} data-[on=true]:bg-[#1574d4]`}>
            Otáčení
          </button>
        </div>
        <div className="mt-2 grid grid-cols-4 gap-1">
          <button type="button" className={btn} onClick={() => onNudge(-0.1, 0, 0)}>
            ←
          </button>
          <button type="button" className={btn} onClick={() => onNudge(0.1, 0, 0)}>
            →
          </button>
          <button type="button" className={btn} onClick={() => onNudge(0, -0.1, 0)}>
            ↑
          </button>
          <button type="button" className={btn} onClick={() => onNudge(0, 0.1, 0)}>
            ↓
          </button>
          <button type="button" className={`${btn} col-span-2`} onClick={() => onNudge(0, 0, -15)}>
            ↺ 15°
          </button>
          <button type="button" className={`${btn} col-span-2`} onClick={() => onNudge(0, 0, 15)}>
            15° ↻
          </button>
        </div>
        {vehicle && pose && (
          <div className="mt-2 flex flex-col gap-1 border-t border-white/15 pt-2">
            <label className="text-[11px] text-[#d5dbe2]">
              Podpěry {Math.round(pose.legs * 100)} %
              <input
                className="mt-1 w-full accent-[#f0b429]"
                type="range"
                min={0}
                max={100}
                value={Math.round(pose.legs * 100)}
                onChange={(event) => onPose(item.id, { legs: Number(event.target.value) / 100 })}
              />
            </label>
            <label className="text-[11px] text-[#d5dbe2]">
              Plošina {Math.round(pose.lift * 100)} %
              <input
                className="mt-1 w-full accent-[#2f9a45]"
                type="range"
                min={0}
                max={100}
                value={Math.round(pose.lift * 100)}
                onChange={(event) => onPose(item.id, { lift: Number(event.target.value) / 100 })}
              />
            </label>
          </div>
        )}
        {footprintOutside(item) && <p className="mt-1 text-[11px] text-[#e0a23a]">Půdorys přesahuje plochu.</p>}
      </div>
    </Html>
  );
}

function ExhibitNode({
  item,
  pose,
  selected,
  hovered,
  mode,
  snap,
  onSelect,
  onHover,
  onCommit,
  onMode,
  onNudge,
  onPose,
}: {
  item: Exhibit;
  pose: MachinePose;
  selected: boolean;
  hovered: boolean;
  mode: GizmoMode;
  snap: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  onCommit: (id: string, x: number, z: number, rot: number) => void;
  onMode: (mode: GizmoMode) => void;
  onNudge: (dx: number, dz: number, dRot: number) => void;
  onPose: (id: string, patch: Partial<MachinePose>) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const dragging = useRef(false);
  const get = useThree((s) => s.get);

  const lockAxes = () => {
    const obj = groupRef.current;
    if (!obj) return null;
    obj.position.y = 0;
    obj.rotation.x = 0;
    obj.rotation.z = 0;
    return obj;
  };

  const setOrbit = (enabled: boolean) => {
    const controls = get().controls as OrbitControlsImpl | null;
    if (controls) controls.enabled = enabled;
  };

  return (
    <>
      <group
        ref={groupRef}
        position={[item.x, 0, item.z]}
        rotation={[0, (item.rot * Math.PI) / 180, 0]}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(item.id);
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          onHover(item.id);
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          onHover(null);
        }}
      >
        <Model kind={item.kind} pose={pose} />
        <SelectionMark item={item} selected={selected} hovered={hovered} />
        {selected && (
          <ObjectHud item={item} mode={mode} pose={pose} onMode={onMode} onNudge={onNudge} onPose={onPose} />
        )}
      </group>
      {selected && (
        <TransformControls
          object={groupRef as RefObject<THREE.Object3D>}
          mode={mode}
          space="world"
          size={1.15}
          translationSnap={snap ? 0.05 : null}
          rotationSnap={snap ? THREE.MathUtils.degToRad(5) : null}
          showX={mode === "translate"}
          showY={mode === "rotate"}
          showZ={mode === "translate"}
          onMouseDown={() => {
            dragging.current = true;
            setOrbit(false);
          }}
          onObjectChange={lockAxes}
          onMouseUp={() => {
            dragging.current = false;
            setOrbit(true);
            const obj = lockAxes();
            if (!obj) return;
            onCommit(item.id, round2(obj.position.x), round2(obj.position.z), normDeg((obj.rotation.y * 180) / Math.PI));
          }}
        />
      )}
    </>
  );
}

function Ghosts() {
  return (
    <group>
      {PLAN_GHOSTS.map((ghost) => (
        <group
          key={ghost.id}
          position={[ghost.x, 0.03, ghost.z]}
          rotation={[0, (ghost.rot * Math.PI) / 180, 0]}
        >
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[ghost.w, ghost.d]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.22} depthWrite={false} />
          </mesh>
          <FootprintLines w={ghost.w} d={ghost.d} color="#8d97a3" y={0.02} />
        </group>
      ))}
    </group>
  );
}

function SceneBody({
  items,
  machines,
  hidden,
  selected,
  hovered,
  mode,
  snap,
  ghost,
  onSelect,
  onHover,
  onCommit,
  onMode,
  onNudge,
  onPose,
}: {
  items: Exhibit[];
  machines: Record<string, MachinePose>;
  hidden: Record<string, boolean>;
  selected: string | null;
  hovered: string | null;
  mode: GizmoMode;
  snap: boolean;
  ghost: boolean;
  onSelect: (id: string | null) => void;
  onHover: (id: string | null) => void;
  onCommit: (id: string, x: number, z: number, rot: number) => void;
  onMode: (mode: GizmoMode) => void;
  onNudge: (dx: number, dz: number, dRot: number) => void;
  onPose: (id: string, patch: Partial<MachinePose>) => void;
}) {
  return (
    <>
      <color attach="background" args={["#d5dbe2"]} />
      <hemisphereLight args={["#f2f6fb", "#c9beb0", 0.72]} />
      <ambientLight intensity={0.28} />
      <directionalLight
        position={[8, 16, 12]}
        intensity={2.4}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={18}
        shadow-camera-bottom={-18}
        shadow-camera-near={1}
        shadow-camera-far={48}
        shadow-bias={-0.00035}
      />
      <spotLight position={[-2, 9.6, 3]} angle={0.7} penumbra={0.7} intensity={30} color="#f7f4ee" />
      <spotLight position={[6, 9.6, 2]} angle={0.75} penumbra={0.65} intensity={36} color="#f7f4ee" />
      <spotLight position={[14, 9.6, 4]} angle={0.7} penumbra={0.7} intensity={24} color="#f7f4ee" />

      <Hall />
      <BoothPad />
      {ghost && <Ghosts />}
      <ContactShadows position={[5, 0.02, 2.5]} opacity={0.38} scale={22} blur={2.2} far={6} />

      {items
        .filter((item) => !hidden[item.id])
        .map((item) => (
          <ExhibitNode
            key={item.id}
            item={item}
            pose={machines[item.id] ?? DEFAULT_MACHINE}
            selected={selected === item.id}
            hovered={hovered === item.id}
            mode={mode}
            snap={snap}
            onSelect={onSelect}
            onHover={onHover}
            onCommit={onCommit}
            onMode={onMode}
            onNudge={onNudge}
            onPose={onPose}
          />
        ))}

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[5, 0, 8]}
        onClick={() => onSelect(null)}
      >
        <planeGeometry args={[60, 40]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        maxPolarAngle={Math.PI / 2 - 0.04}
        minDistance={1.6}
        maxDistance={40}
        target={[5.4, 1.25, 2.2]}
      />
    </>
  );
}

export function CanvasScene(props: {
  items: Exhibit[];
  machines: Record<string, MachinePose>;
  hidden: Record<string, boolean>;
  selected: string | null;
  hovered: string | null;
  mode: GizmoMode;
  snap: boolean;
  ghost: boolean;
  onSelect: (id: string | null) => void;
  onHover: (id: string | null) => void;
  onCommit: (id: string, x: number, z: number, rot: number) => void;
  onMode: (mode: GizmoMode) => void;
  onNudge: (dx: number, dz: number, dRot: number) => void;
  onPose: (id: string, patch: Partial<MachinePose>) => void;
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [7.6, 4.6, 15.8], fov: 38, near: 0.1, far: 120 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      >
      <Suspense fallback={null}>
        <SceneBody {...props} />
      </Suspense>
    </Canvas>
  );
}
