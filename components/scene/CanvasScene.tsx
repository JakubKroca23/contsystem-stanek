"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useThree, type ThreeEvent } from "@react-three/fiber";
import { ContactShadows, Html, OrbitControls } from "@react-three/drei";
import { EffectComposer, Outline } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";
import * as THREE from "three";
import {
  DEFAULT_MACHINE,
  PLAN_GHOSTS,
  footprintOutside,
  type Exhibit,
  type MachinePose,
} from "@/lib/layout";
import { FootprintLines } from "./primitives";
import { Foton, Goupil } from "./vehicles";
import { BarStool, Counter, Figure, FlagComet, FlagContsystem, MetalChair, RoundTable } from "./furniture";
import { PalletForks } from "./pallet";
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
    case "pallet-forks":
      return <PalletForks />;
    default:
      return null;
  }
}

const CLICK_PX = 6;

function isClick(event: ThreeEvent<MouseEvent>) {
  return event.delta <= CLICK_PX;
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
  const camera = useThree((state) => state.camera);
  const drag = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const right = useRef(new THREE.Vector3());
  const look = useRef(new THREE.Vector3());

  const applyDrag = (dx: number, dy: number) => {
    if (dx === 0 && dy === 0) return;
    if (mode === "rotate") {
      onNudge(0, 0, dx * 0.4);
      return;
    }
    right.current.setFromMatrixColumn(camera.matrixWorld, 0);
    right.current.y = 0;
    if (right.current.lengthSq() < 1e-8) right.current.set(1, 0, 0);
    right.current.normalize();
    camera.getWorldDirection(look.current);
    look.current.y = 0;
    if (look.current.lengthSq() < 1e-8) look.current.set(0, 0, -1);
    look.current.normalize();
    const scale = 0.012;
    onNudge(
      right.current.x * dx * scale + look.current.x * -dy * scale,
      right.current.z * dx * scale + look.current.z * -dy * scale,
      0,
    );
  };

  return (
    <Html position={[0, item.h + 0.55, 0]} center zIndexRange={[40, 0]} style={{ pointerEvents: "auto" }}>
      <div
        className="w-[220px] rounded-2xl border border-white/25 bg-[#12151a]/75 p-2.5 text-white shadow-2xl backdrop-blur-md"
        onPointerDown={(event) => event.stopPropagation()}
      >
        <div className="truncate px-1 text-sm font-medium">{item.name}</div>
        <button
          type="button"
          className="mt-2 flex w-full cursor-grab items-center justify-between gap-3 rounded-full bg-[#1574d4] px-3 py-2.5 text-left text-sm font-medium shadow-lg active:cursor-grabbing"
          onPointerDown={(event) => {
            event.stopPropagation();
            event.currentTarget.setPointerCapture(event.pointerId);
            drag.current = { x: event.clientX, y: event.clientY, moved: false };
          }}
          onPointerMove={(event) => {
            const state = drag.current;
            if (!state) return;
            const dx = event.clientX - state.x;
            const dy = event.clientY - state.y;
            if (!state.moved && Math.hypot(dx, dy) < 4) return;
            state.moved = true;
            state.x = event.clientX;
            state.y = event.clientY;
            applyDrag(dx, dy);
          }}
          onPointerUp={(event) => {
            const moved = drag.current?.moved ?? false;
            drag.current = null;
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              event.currentTarget.releasePointerCapture(event.pointerId);
            }
            if (!moved) onMode(mode === "translate" ? "rotate" : "translate");
          }}
        >
          <span>{mode === "translate" ? "Posun" : "Otáčení"}</span>
          <span className="text-[11px] font-normal text-white/80">táhni · klik přepne</span>
        </button>
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
  mode,
  onSelect,
  onHover,
  onBind,
  onMode,
  onNudge,
  onPose,
}: {
  item: Exhibit;
  pose: MachinePose;
  selected: boolean;
  mode: GizmoMode;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  onBind: (id: string, object: THREE.Object3D | null) => void;
  onMode: (mode: GizmoMode) => void;
  onNudge: (dx: number, dz: number, dRot: number) => void;
  onPose: (id: string, patch: Partial<MachinePose>) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const onBindRef = useRef(onBind);
  useEffect(() => {
    onBindRef.current = onBind;
  });
  useEffect(() => {
    onBindRef.current(item.id, groupRef.current);
    return () => onBindRef.current(item.id, null);
  }, [item.id]);

  return (
    <group
      ref={groupRef}
      position={[item.x, 0, item.z]}
      rotation={[0, (item.rot * Math.PI) / 180, 0]}
      onClick={(event) => {
        event.stopPropagation();
        if (!isClick(event)) return;
        onSelect(item.id);
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        onHover(item.id);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        onHover(null);
        document.body.style.cursor = "";
      }}
    >
      <Model kind={item.kind} pose={pose} />
      {selected && <ObjectHud item={item} mode={mode} pose={pose} onMode={onMode} onNudge={onNudge} onPose={onPose} />}
    </group>
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
  ghost,
  onSelect,
  onHover,
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
  ghost: boolean;
  onSelect: (id: string | null) => void;
  onHover: (id: string | null) => void;
  onMode: (mode: GizmoMode) => void;
  onNudge: (dx: number, dz: number, dRot: number) => void;
  onPose: (id: string, patch: Partial<MachinePose>) => void;
}) {
  const [nodes, setNodes] = useState<Record<string, THREE.Object3D>>({});
  const bind = (id: string, object: THREE.Object3D | null) => {
    setNodes((prev) => {
      if (object && prev[id] === object) return prev;
      if (!object && !(id in prev)) return prev;
      const next = { ...prev };
      if (object) next[id] = object;
      else delete next[id];
      return next;
    });
  };
  const selectedObj = selected ? nodes[selected] : undefined;
  const hoverObj = hovered && hovered !== selected ? nodes[hovered] : undefined;
  const selectedList = useMemo(() => (selectedObj ? [selectedObj] : []), [selectedObj]);
  const hoverList = useMemo(() => (hoverObj ? [hoverObj] : []), [hoverObj]);

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
            mode={mode}
            onSelect={onSelect}
            onHover={onHover}
            onBind={bind}
            onMode={onMode}
            onNudge={onNudge}
            onPose={onPose}
          />
        ))}

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[5, 0, 8]}
        onClick={(event) => {
          if (!isClick(event)) return;
          onSelect(null);
        }}
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

      <EffectComposer multisampling={4} autoClear={false}>
        {hoverList.length > 0 && (
          <Outline
            selection={hoverList}
            selectionLayer={11}
            edgeStrength={28}
            pulseSpeed={0.8}
            visibleEdgeColor="#ffffff"
            hiddenEdgeColor="#ffffff"
            kernelSize={KernelSize.LARGE}
            blur
            xRay
          />
        )}
        {selectedList.length > 0 && (
          <Outline
            selection={selectedList}
            selectionLayer={12}
            edgeStrength={36}
            pulseSpeed={0.4}
            visibleEdgeColor="#3aa0ff"
            hiddenEdgeColor="#3aa0ff"
            kernelSize={KernelSize.LARGE}
            blur
            xRay
          />
        )}
      </EffectComposer>
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
  ghost: boolean;
  onSelect: (id: string | null) => void;
  onHover: (id: string | null) => void;
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
