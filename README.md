# Stánek 05 · CONTSYSTEM Group

Interaktivní 3D vizualizace výstavního stánku **Hala 4C, stánek 05**, plocha **5 × 10 m**, před vstupem do haly 7 (PVA EXPO PRAHA).

Rozmístění vychází z náčrtu `CONTSYSTEM_Exponáty na ploše 5x10m`. Rozměry strojů jsou z přiložených výkresů:

- **Goupil G6 + COMET** — 5127 × 1974 × 2381 mm, s roztaženými podpěrami šířka 2988 mm (v zadání obálka 5,2 × 3 m), na půdorysu šikmo.
- **X4-14, FOTON** — Ford Ranger single cab 4×4 XL, 5277 × 1860 mm, podpěry 2910 mm, složená výška 2800 mm (obálka 5,3 × 3 m). Koš 120 kg, pracovní výška 14 m; na stánku je složená poloha.
- Kulatý stůl Ø 80 cm a 3 kovové židle, pult 100 × 50 cm s policí a 2 barové židle, vlajka CONTSYSTEM a vlajka COMET.

Hala za stánkem odpovídá pohledu z Matterportu u dveří HALA 7 / HALL 7. Samotný sken Matterportu se do scény nevkládá (vyžaduje jejich SDK). Odkaz je v panelu: [my.matterport.com/show/?m=MTeqx1io6Kr](https://my.matterport.com/show/?m=MTeqx1io6Kr).

## Ovládání

- Klik na objekt ho vybere. Táhlo posouvá po podlaze nebo otáčí kolem svislé osy.
- Souřadnice: **X** 0–10 m zleva doprava, **Z** 0 u vstupu do haly 7 a 5 m směrem do uličky. **0°** míří do uličky.
- Šipky posouvají výběr, **Q / E** otáčí, **Shift** je hrubší krok. **G** posun, **R** otáčení, **1–3** kamery.
- Bílá obálka je obrys z náčrtu. Rozmístění se ukládá v prohlížeči a jde exportovat do JSON.
- Figurína 175 cm je jen měřítko, v zadání není.

## Spuštění

```bash
npm install
npm run dev
```

Vývojový server poslouchá na [http://127.0.0.1:43123](http://127.0.0.1:43123).
