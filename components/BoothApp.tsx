"use client";

import { useEffect, useRef, useState } from "react";
import {
  DEFAULT_LAYOUT,
  DEFAULT_MACHINE,
  STORAGE_KEY,
  isExhibit,
  normDeg,
  round2,
  type Exhibit,
  type MachinePose,
} from "@/lib/layout";
import { CanvasScene, type GizmoMode } from "./scene/CanvasScene";

function loadLayout(): Exhibit[] {
  if (typeof window === "undefined") return DEFAULT_LAYOUT;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_LAYOUT;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed) || !parsed.every(isExhibit)) return DEFAULT_LAYOUT;
    const byId = new Map(parsed.map((item) => [item.id, item]));
    return DEFAULT_LAYOUT.map((item) => {
      const saved = byId.get(item.id);
      if (!saved) return item;
      return { ...item, x: saved.x, z: saved.z, rot: saved.rot };
    });
  } catch {
    return DEFAULT_LAYOUT;
  }
}

export default function BoothApp() {
  const [items, setItems] = useState<Exhibit[]>(loadLayout);
  const [selected, setSelected] = useState<string | null>(null);
  const [mode, setMode] = useState<GizmoMode>("translate");
  const [ghost, setGhost] = useState(true);
  const [hidden, setHidden] = useState<Record<string, boolean>>({});
  const [panelOpen, setPanelOpen] = useState(true);
  const [hovered, setHovered] = useState<string | null>(null);
  const [machines, setMachines] = useState<Record<string, MachinePose>>({
    goupil: { ...DEFAULT_MACHINE },
    foton: { ...DEFAULT_MACHINE },
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const nudge = (dx: number, dz: number, dRot: number) => {
    if (!selected) return;
    setItems((prev) =>
      prev.map((entry) =>
        entry.id === selected
          ? { ...entry, x: round2(entry.x + dx), z: round2(entry.z + dz), rot: normDeg(entry.rot + dRot) }
          : entry,
      ),
    );
  };

  const setPose = (id: string, patch: Partial<MachinePose>) => {
    setMachines((prev) => ({ ...prev, [id]: { ...(prev[id] ?? DEFAULT_MACHINE), ...patch } }));
  };

  const itemsRef = useRef(items);
  const selectedRef = useRef(selected);
  useEffect(() => {
    itemsRef.current = items;
    selectedRef.current = selected;
  });

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      const step = event.shiftKey ? 0.25 : 0.05;
      const turn = event.shiftKey ? 15 : 5;
      const id = selectedRef.current;
      const item = itemsRef.current.find((entry) => entry.id === id);
      const move = (dx: number, dz: number, dRot: number) => {
        if (!item) return;
        setItems((prev) =>
          prev.map((entry) =>
            entry.id === item.id
              ? { ...entry, x: round2(entry.x + dx), z: round2(entry.z + dz), rot: normDeg(entry.rot + dRot) }
              : entry,
          ),
        );
      };
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        move(-step, 0, 0);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        move(step, 0, 0);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        move(0, -step, 0);
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        move(0, step, 0);
      } else if (event.key === "q" || event.key === "Q") {
        move(0, 0, -turn);
      } else if (event.key === "e" || event.key === "E") {
        move(0, 0, turn);
      } else if (event.key === "Escape") {
        setSelected(null);
      } else if (event.key === "g" || event.key === "G") {
        setMode("translate");
      } else if (event.key === "r" || event.key === "R") {
        setMode("rotate");
      } else if (event.key === "h" || event.key === "H") {
        setPanelOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "stanek-05-rozmisteni.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative h-full min-h-screen w-full bg-[#c5ccd3]">
      <div className="absolute inset-0">
        <CanvasScene
          items={items}
          machines={machines}
          hidden={hidden}
          selected={selected}
          hovered={hovered}
          mode={mode}
          ghost={ghost}
          onSelect={setSelected}
          onHover={setHovered}
          onMode={setMode}
          onNudge={nudge}
          onPose={setPose}
        />
      </div>

      {panelOpen ? (
      <aside className="absolute inset-x-0 bottom-0 z-20 flex max-h-[42vh] flex-col overflow-hidden rounded-t-2xl border border-white/20 bg-[#12151a]/45 text-[#e8eaed] shadow-2xl backdrop-blur-md md:inset-y-3 md:left-3 md:right-auto md:bottom-3 md:max-h-none md:w-[280px] md:rounded-2xl">
        <header className="flex items-start justify-between gap-2 border-b border-white/10 px-3 py-3">
          <div>
            <div className="text-[11px] font-semibold tracking-[0.14em] text-[#7eb6f0]">CONTSYSTEM</div>
            <h1 className="text-base font-semibold leading-tight">Stánek 05 · Hala 4C</h1>
          </div>
          <button type="button" onClick={() => setPanelOpen(false)} className="rounded px-2 py-1 text-xs text-[#d5dbe2] hover:bg-white/10">
            Skrýt
          </button>
        </header>
        <ul className="min-h-0 flex-1 overflow-auto px-2 py-2">
          {items.map((item) => {
            const active = item.id === selected;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setSelected(item.id)}
                  data-on={active}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-white/10 data-[on=true]:bg-[#1574d4]/35"
                >
                  <span className="min-w-0 flex-1 truncate text-sm">{item.name}</span>
                  <span
                    role="checkbox"
                    aria-checked={!hidden[item.id]}
                    onClick={(event) => {
                      event.stopPropagation();
                      setHidden((prev) => ({ ...prev, [item.id]: !prev[item.id] }));
                    }}
                    className="shrink-0 text-[11px] text-[#c5ccd3] hover:text-white"
                  >
                    {hidden[item.id] ? "zobrazit" : "skrýt"}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <footer className="flex flex-wrap gap-2 border-t border-white/10 px-3 py-2 text-xs">
          <button type="button" data-on={ghost} onClick={() => setGhost((v) => !v)} className="rounded px-2 py-1 hover:bg-white/10 data-[on=true]:bg-white/15">
            Obálka
          </button>
          <button
            type="button"
            className="rounded px-2 py-1 hover:bg-white/10"
            onClick={() => {
              setItems(DEFAULT_LAYOUT);
              setHidden({});
              setMachines({ goupil: { ...DEFAULT_MACHINE }, foton: { ...DEFAULT_MACHINE } });
              setSelected("goupil");
            }}
          >
            Obnovit
          </button>
          <button type="button" className="rounded px-2 py-1 hover:bg-white/10" onClick={exportJson}>
            Export
          </button>
          <a className="rounded px-2 py-1 hover:bg-white/10" href="https://my.matterport.com/show/?m=MTeqx1io6Kr" target="_blank" rel="noreferrer">
            Hala
          </a>
        </footer>
      </aside>
      ) : (
        <button
          type="button"
          onClick={() => setPanelOpen(true)}
          className="absolute left-3 top-3 z-20 rounded-full border border-white/20 bg-[#12151a]/45 px-3 py-1.5 text-sm text-white shadow-lg backdrop-blur-md hover:bg-[#12151a]/60"
        >
          Seznam
        </button>
      )}
    </div>
  );
}
