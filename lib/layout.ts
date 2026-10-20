export type ExhibitKind =
  | "goupil"
  | "foton"
  | "table"
  | "chair"
  | "counter"
  | "stool"
  | "flag-cs"
  | "flag-comet"
  | "figure"
  | "pallet-forks";

export type Exhibit = {
  id: string;
  kind: ExhibitKind;
  name: string;
  detail: string;
  /** Střed půdorysu v metrech. X 0–10 zleva doprava, Z 0 u vstupu do haly 7, Z 5 do uličky. */
  x: number;
  z: number;
  /** Stupně. 0 = čelem ve směru +Z (do haly). Kladné otáčí směrem doprava při pohledu od uličky. */
  rot: number;
  /** Šířka podél lokální osy X a hloubka podél lokální osy Z, v metrech. */
  w: number;
  d: number;
  h: number;
};

export const BOOTH_W = 10;
export const BOOTH_D = 5;

/** Dveře HALA 7: jedno dvoukřídlé křídlo, světlost 1,80 × 2,10 m. Stánek je vlevo od nich. */
export const DOOR_X = 13;
export const DOOR_W = 1.8;
export const DOOR_H = 2.1;
/** Vnitřní roh haly vlevo od stánku. */
export const CORNER_X = -2.6;
export const STORAGE_KEY = "contsystem-stanek-05-v1";

/**
 * Výchozí rozmístění podle náčrtu ve Wordu
 * (Hala 4C, stánek 05, plocha 5 × 10 m, vstup do haly 7 nahoře na půdorysu).
 * Rozměry strojů jsou z přiložených výkresů, obálka na ploše ze zadání.
 */
export const DEFAULT_LAYOUT: Exhibit[] = [
  {
    id: "goupil",
    kind: "goupil",
    name: "1 · Goupil G6 + COMET",
    detail: "5,13 × 2,99 × 2,38 m, podpěry roztažené",
    x: 2.7,
    z: 3.05,
    rot: 41,
    w: 2.988,
    d: 5.127,
    h: 2.381,
  },
  {
    id: "foton",
    kind: "foton",
    name: "2 · X4-14, FOTON",
    detail: "Ford Ranger single cab 4×4 XL, 5,28 × 2,91 × 2,80 m",
    x: 7.6,
    z: 2.77,
    rot: 0,
    w: 2.91,
    d: 5.277,
    h: 2.8,
  },
  {
    id: "table",
    kind: "table",
    name: "Stůl kulatý",
    detail: "průměr 80 cm",
    x: 4.69,
    z: 0.96,
    rot: 0,
    w: 0.8,
    d: 0.8,
    h: 0.75,
  },
  {
    id: "chair-1",
    kind: "chair",
    name: "Židle kovová 1",
    detail: "ke kulatému stolu",
    x: 4.12,
    z: 1.52,
    rot: 160,
    w: 0.46,
    d: 0.5,
    h: 0.86,
  },
  {
    id: "chair-2",
    kind: "chair",
    name: "Židle kovová 2",
    detail: "ke kulatému stolu",
    x: 5.28,
    z: 1.48,
    rot: 200,
    w: 0.46,
    d: 0.5,
    h: 0.86,
  },
  {
    id: "chair-3",
    kind: "chair",
    name: "Židle kovová 3",
    detail: "ke kulatému stolu",
    x: 4.69,
    z: 0.38,
    rot: 0,
    w: 0.46,
    d: 0.5,
    h: 0.86,
  },
  {
    id: "flag-comet",
    kind: "flag-comet",
    name: "Vlajka COMET",
    detail: "péřová, 3,80 × 0,80 m",
    x: 4.15,
    z: 4.72,
    rot: -15,
    w: 0.8,
    d: 0.4,
    h: 3.8,
  },
  {
    id: "flag-cs",
    kind: "flag-cs",
    name: "Vlajka CONTSYSTEM",
    detail: "péřová, pravý okraj, 3,80 × 0,80 m",
    x: 9.62,
    z: 3.25,
    rot: 0,
    w: 0.8,
    d: 0.4,
    h: 3.8,
  },
  {
    id: "counter",
    kind: "counter",
    name: "Pult s policí",
    detail: "100 × 50 cm, jedna police",
    x: 9.55,
    z: 4.52,
    rot: 22,
    w: 1,
    d: 0.5,
    h: 1.1,
  },
  {
    id: "stool-1",
    kind: "stool",
    name: "Barová židle 1",
    detail: "k pultu",
    x: 9.42,
    z: 5.08,
    rot: 22,
    w: 0.38,
    d: 0.38,
    h: 1.02,
  },
  {
    id: "stool-2",
    kind: "stool",
    name: "Barová židle 2",
    detail: "k pultu",
    x: 9.98,
    z: 4.86,
    rot: 22,
    w: 0.38,
    d: 0.38,
    h: 1.02,
  },
  {
    id: "pallet-forks",
    kind: "pallet-forks",
    name: "Europaleta + vidle Vally",
    detail: "paleta 1200 × 800 mm, vidle VALLY 2000-600",
    x: 9.5,
    z: 1.15,
    rot: 0,
    w: 0.8,
    d: 1.9,
    h: 1.78,
  },
  {
    id: "figure",
    kind: "figure",
    name: "Figurína 175 cm",
    detail: "jen měřítko, v zadání není",
    x: 5.55,
    z: 1.85,
    rot: 210,
    w: 0.4,
    d: 0.4,
    h: 1.75,
  },
];

/** Bílé obálky z náčrtu: Goupil šikmo 5,2 × 3 m, Foton svisle 5,3 × 3 m. */
export const PLAN_GHOSTS: Array<Pick<Exhibit, "id" | "x" | "z" | "rot" | "w" | "d"> & { label: string }> = [
  { id: "ghost-goupil", label: "Goupil 5,2 × 3 m", x: 2.7, z: 3.05, rot: 41, w: 3, d: 5.2 },
  { id: "ghost-foton", label: "X4-14 5,3 × 3 m", x: 7.6, z: 2.77, rot: 0, w: 3.2, d: 5.54 },
];

export function normDeg(value: number) {
  let d = value % 360;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  return Math.round(d * 10) / 10;
}

export function round2(value: number) {
  return Math.round(value * 100) / 100;
}

export function footprintOutside(item: Pick<Exhibit, "x" | "z" | "rot" | "w" | "d">) {
  const hw = item.w / 2;
  const hd = item.d / 2;
  const a = (item.rot * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  const corners: Array<[number, number]> = [
    [hw, hd],
    [hw, -hd],
    [-hw, hd],
    [-hw, -hd],
  ];
  return corners.some(([x, z]) => {
    const wx = item.x + x * c + z * s;
    const wz = item.z - x * s + z * c;
    return wx < -0.04 || wx > BOOTH_W + 0.04 || wz < -0.04 || wz > BOOTH_D + 0.04;
  });
}

export type MachinePose = {
  /** 0 složená přepravní poloha, 1 plně zvednutá plošina. */
  lift: number;
  /** 0 podpěry u karoserie, 1 rozteč z výkresu. */
  legs: number;
};

export const DEFAULT_MACHINE: MachinePose = { lift: 0, legs: 1 };

export function isExhibit(value: unknown): value is Exhibit {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<Exhibit>;
  return (
    typeof v.id === "string" &&
    typeof v.kind === "string" &&
    typeof v.name === "string" &&
    typeof v.x === "number" &&
    typeof v.z === "number" &&
    typeof v.rot === "number" &&
    typeof v.w === "number" &&
    typeof v.d === "number"
  );
}
