"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  DEFAULT_LAYOUT,
  STORAGE_KEY,
  footprintOutside,
  isExhibit,
  normDeg,
  round2,
  type Exhibit,
} from "@/lib/layout";
import { CanvasScene, type GizmoMode, type ViewId } from "./scene/CanvasScene";

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
  const [snap, setSnap] = useState(true);
  const [ghost, setGhost] = useState(true);
  const [hidden, setHidden] = useState<Record<string, boolean>>({});
  const [view, setView] = useState<ViewId>("perspective");
  const [showBrief, setShowBrief] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const current = items.find((item) => item.id === selected) ?? null;

  const commit = (id: string, x: number, z: number, rot: number) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, x, z, rot } : item)));
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
      } else if (event.key === "1") setView("perspective");
      else if (event.key === "2") setView("top");
      else if (event.key === "3") setView("entrance");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const outside = current ? footprintOutside(current) : false;

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "stanek-05-rozmisteni.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const views = useMemo(
    () =>
      [
        ["perspective", "Perspektiva"],
        ["top", "Půdorys"],
        ["entrance", "Od vchodu"],
      ] as const,
    [],
  );

  return (
    <div className="relative h-full min-h-screen w-full bg-[#c5ccd3]">
      <div className="absolute inset-0">
        <CanvasScene
          items={items}
          hidden={hidden}
          selected={selected}
          mode={mode}
          snap={snap}
          ghost={ghost}
          view={view}
          onSelect={setSelected}
          onCommit={commit}
        />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-end p-3 md:left-[372px]">
        <div className="pointer-events-auto flex gap-1 rounded-full bg-[#12151a]/90 p-1 text-sm text-white shadow-lg backdrop-blur">
          {views.map(([id, label]) => (
            <button
              key={id}
              type="button"
              data-on={view === id}
              onClick={() => setView(id)}
              className="rounded-full px-3 py-1.5 data-[on=true]:bg-[#1574d4] data-[on=false]:hover:bg-white/10"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <aside className="absolute inset-x-0 bottom-0 z-20 flex max-h-[48vh] flex-col overflow-hidden rounded-t-2xl border border-white/10 bg-[#12151a]/95 text-[#e8eaed] shadow-2xl backdrop-blur md:inset-y-0 md:left-0 md:right-auto md:max-h-none md:w-[360px] md:rounded-none">
        <header className="border-b border-white/10 px-4 py-3">
          <div className="text-[11px] font-semibold tracking-[0.16em] text-[#7eb6f0]">CONTSYSTEM GROUP</div>
          <h1 className="mt-1 text-lg font-semibold leading-tight">Stánek 05 · Hala 4C</h1>
          <p className="mt-1 text-sm text-[#b7c0cb]">
            Plocha 5 × 10 m před vstupem do haly 7. Rozměry strojů jsou z výkresů, rozmístění z náčrtu. Objekty jdou posouvat a otáčet.
          </p>
        </header>

        <div className="flex flex-wrap gap-1 border-b border-white/10 px-3 py-2">
          <button type="button" data-on={mode === "translate"} onClick={() => setMode("translate")} className="rounded px-2.5 py-1 text-sm data-[on=true]:bg-[#1574d4]">
            Posun
          </button>
          <button type="button" data-on={mode === "rotate"} onClick={() => setMode("rotate")} className="rounded px-2.5 py-1 text-sm data-[on=true]:bg-[#1574d4]">
            Otáčení
          </button>
          <button type="button" data-on={snap} onClick={() => setSnap((v) => !v)} className="rounded px-2.5 py-1 text-sm data-[on=true]:bg-white/15">
            Krok 5 cm
          </button>
          <button type="button" data-on={ghost} onClick={() => setGhost((v) => !v)} className="rounded px-2.5 py-1 text-sm data-[on=true]:bg-white/15">
            Obálka
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-auto px-3 py-2">
          <ul className="flex flex-col gap-1">
            {items.map((item) => {
              const active = item.id === selected;
              const over = footprintOutside(item);
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(item.id)}
                    data-on={active}
                    className="flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left data-[on=true]:bg-white/10 hover:bg-white/5"
                  >
                    <span className="mt-0.5 inline-flex size-2 shrink-0 rounded-full bg-[#1574d4] data-[over=true]:bg-[#e0a23a]" data-over={over} />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{item.name}</span>
                      <span className="block truncate text-xs text-[#9aa6b2]">{item.detail}</span>
                    </span>
                    <span
                      role="checkbox"
                      aria-checked={!hidden[item.id]}
                      onClick={(event) => {
                        event.stopPropagation();
                        setHidden((prev) => ({ ...prev, [item.id]: !prev[item.id] }));
                      }}
                      className="ml-auto shrink-0 rounded px-1.5 py-0.5 text-[11px] text-[#9aa6b2] hover:bg-white/10"
                    >
                      {hidden[item.id] ? "zobrazit" : "skrýt"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {current && (
            <div className="mt-3 rounded-xl border border-white/10 bg-black/25 p-3">
              <div className="text-sm font-medium">{current.name}</div>
              <p className="mt-1 text-xs leading-5 text-[#9aa6b2]">
                X je podél 10 m zleva doprava, Z od vstupu do haly 7 (0) směrem do uličky (5). Otočení 0° míří do uličky.
              </p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <label className="text-xs text-[#9aa6b2]">
                  X m
                  <input
                    className="mt-1 w-full rounded border border-white/10 bg-black/40 px-2 py-1 font-mono text-sm text-white"
                    type="number"
                    step={0.05}
                    value={current.x}
                    onChange={(event) => commit(current.id, round2(Number(event.target.value)), current.z, current.rot)}
                  />
                </label>
                <label className="text-xs text-[#9aa6b2]">
                  Z m
                  <input
                    className="mt-1 w-full rounded border border-white/10 bg-black/40 px-2 py-1 font-mono text-sm text-white"
                    type="number"
                    step={0.05}
                    value={current.z}
                    onChange={(event) => commit(current.id, current.x, round2(Number(event.target.value)), current.rot)}
                  />
                </label>
                <label className="text-xs text-[#9aa6b2]">
                  °
                  <input
                    className="mt-1 w-full rounded border border-white/10 bg-black/40 px-2 py-1 font-mono text-sm text-white"
                    type="number"
                    step={5}
                    value={current.rot}
                    onChange={(event) => commit(current.id, current.x, current.z, normDeg(Number(event.target.value)))}
                  />
                </label>
              </div>
              {outside && (
                <p className="mt-2 text-xs text-[#e0a23a]">Půdorys přesahuje plochu 5 × 10 m. V náčrtu Goupil a Foton mírně vyčnívají.</p>
              )}
            </div>
          )}

          <button type="button" onClick={() => setShowBrief((v) => !v)} className="mt-3 text-sm text-[#7eb6f0]">
            {showBrief ? "Skrýt zadání" : "Ukázat náčrt ze zadání"}
          </button>
          {showBrief && (
            <div className="relative mt-2 aspect-[3/4] w-full overflow-hidden rounded-lg border border-white/10 bg-white">
              <Image
                src="/ref/zadani.png"
                alt="Náčrt rozmístění exponátů na ploše 5 × 10 m"
                fill
                sizes="360px"
                className="object-contain"
              />
            </div>
          )}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="relative h-24 overflow-hidden rounded-lg bg-white">
              <Image src="/ref/goupil.png" alt="Goupil G6 s plošinou COMET" fill sizes="160px" className="object-contain" />
            </div>
            <div className="relative h-24 overflow-hidden rounded-lg bg-white">
              <Image src="/ref/foton.png" alt="Ford Ranger s plošinou COMET X4-14" fill sizes="160px" className="object-contain" />
            </div>
          </div>
        </div>

        <footer className="flex flex-col gap-2 border-t border-white/10 px-3 py-2 text-xs text-[#9aa6b2]">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded border border-white/15 px-2 py-1 text-[#e8eaed] hover:bg-white/10"
              onClick={() => {
                setItems(DEFAULT_LAYOUT);
                setHidden({});
                setSelected("goupil");
              }}
            >
              Obnovit zadání
            </button>
            <button type="button" className="rounded border border-white/15 px-2 py-1 text-[#e8eaed] hover:bg-white/10" onClick={exportJson}>
              Export JSON
            </button>
            <a
              className="rounded border border-white/15 px-2 py-1 text-[#e8eaed] hover:bg-white/10"
              href="https://my.matterport.com/show/?m=MTeqx1io6Kr"
              target="_blank"
              rel="noreferrer"
            >
              Matterport haly
            </a>
          </div>
          <p>Tažení prázdného místa otáčí pohled. Šipky posouvají výběr, Q a E otáčí, Shift je hrubší krok. G posun, R otáčení, 1–3 kamery.</p>
        </footer>
      </aside>
    </div>
  );
}
