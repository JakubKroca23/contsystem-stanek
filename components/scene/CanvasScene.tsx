"use client";

import { Suspense, useEffect, useRef, type RefObject } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, OrbitControls, TransformControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import {
  DEFAULT_MACHINE,
  PLAN_GHOSTS,
  type Exhibit,
  type MachinePose,
  normDeg,
  round2,
} from "@/lib/layout";
import { FootprintLines } from "./primitives";
import { Foton, Goupil } from "./vehicles";
import { BarStool, Counter, Figure, FlagComet, FlagContsystem, MetalChair, RoundTable } from "./furniture";
import { BoothPad, Hall } from "./Hall";

export type ViewId = "perspective" | "top" | "entrance";
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

function CameraRig({ view }: { view: ViewId }) {
  const get = useThree((s) => s.get);
  const controlsReady = useThree((s) => s.controls);

  useEffect(() => {
    if (!controlsReady) return;
    const { camera, controls } = get();
    const orbit = controls as OrbitControlsImpl | null;
    if (!orbit) return;
    camera.up.set(0, 1, 0);
    if (view === "top") {
      orbit.target.set(6.2, 0, 1.6);
      camera.position.set(6.2, 24, 1.6 + 4.2);
    } else if (view === "entrance") {
      orbit.target.set(5.2, 1.4, 1.8);
      camera.position.set(16.2, 3.3, 5.4);
    } else {
      orbit.target.set(5.4, 1.25, 2.2);
      camera.position.set(7.6, 4.6, 15.8);
    }
    orbit.update();
  }, [view, get, controlsReady]);

  return null;
}

function ExhibitNode({
  item,
  pose,
  selected,
  mode,
  snap,
  onSelect,
  onCommit,
}: {
  item: Exhibit;
  pose: MachinePose;
  selected: boolean;
  mode: GizmoMode;
  snap: boolean;
  onSelect: (id: string) => void;
  onCommit: (id: string, x: number, z: number, rot: number) => void;
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
      >
        <Model kind={item.kind} pose={pose} />
        {selected && <FootprintLines w={item.w} d={item.d} color="#1574d4" />}
      </group>
      {selected && (
        <TransformControls
          object={groupRef as RefObject<THREE.Object3D>}
          mode={mode}
          space="world"
          size={0.7}
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
  mode,
  snap,
  ghost,
  view,
  onSelect,
  onCommit,
}: {
  items: Exhibit[];
  machines: Record<string, MachinePose>;
  hidden: Record<string, boolean>;
  selected: string | null;
  mode: GizmoMode;
  snap: boolean;
  ghost: boolean;
  view: ViewId;
  onSelect: (id: string | null) => void;
  onCommit: (id: string, x: number, z: number, rot: number) => void;
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
            mode={mode}
            snap={snap}
            onSelect={onSelect}
            onCommit={onCommit}
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
      <CameraRig view={view} />
    </>
  );
}

export function CanvasScene(props: {
  items: Exhibit[];
  machines: Record<string, MachinePose>;
  hidden: Record<string, boolean>;
  selected: string | null;
  mode: GizmoMode;
  snap: boolean;
  ghost: boolean;
  view: ViewId;
  onSelect: (id: string | null) => void;
  onCommit: (id: string, x: number, z: number, rot: number) => void;
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
