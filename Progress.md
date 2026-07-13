# Progress — Mesozoica

> **Konvention:** Diese Datei nach **jedem essentiellen Arbeitsschritt** aktualisieren
> (Stand, offene Fehler, geänderte Dateien, nächste Schritte). Kurz & konzentriert halten.
> Ausführliche Historie/Übergabe steht in `HANDOFF.md`.

_Zuletzt aktualisiert: 2026-07-13 · Modell: Claude_

---

## Aktueller Implementierungsstand

- **Live:** https://tobyaut.github.io/mesozoica/ (GitHub Pages, Branch `gh-pages`). Repo:
  https://github.com/TobyAUT/mesozoica (`main`). Assets/HTML verifiziert (HTTP 200, Base-Pfad ok).
- Vite + React + TS (strict) + R3F. Grün: `tsc`, **20/20 Tests**, ESLint (0 Fehler), Build.
- 27 Kapitel, Zeitachse startet im Devon (400 Mya). Datengetrieben über `src/data/creatures.ts`.
- **Wasser-System:** reversibler Scroll-Übergang (GLSL-Overlay `WaterlineTransition.tsx` +
  `utils/water.ts`). 4 KI-Meeres-Hintergründe (Devon/Frühjura/Tylosaurus/Mosasaurus), WebP,
  Gaussian-Blur eingebrannt.
- **Multi-Format-Loader** (glTF/FBX/OBJ/STL/PLY): `experience/modelLoaders.ts` + `CreatureModel`.
  Aktiv geladene neue Modelle: **Plesiosaurus + Spinosaurus** (Low-Poly-FBX + Texturen).
- **EU/KI:** AI-Act-Marker (`components/system/AiImageMarker.tsx`) + Datenschutz-/KI-Footer.
- **Performance:** Hintergründe PNG→WebP (~24 MB → 2,5 MB). Base-Pfad-fähig (`utils/asset.ts`).
- **Portfolio:** Mesozoica als 1. Projekt in `Personal Page/App.jsx` (separates Projekt!).

## Offene Fehler / Unverifiziert

- ⚠️ **FBX (Plesiosaurus/Spinosaurus) optisch NICHT verifiziert** — Browser-Vorschau friert 3D-rAF
  ein. Am echten Gerät prüfen: Textur-Mapping (FBX-PBR-Kanäle), Orientierung (ggf. `upAxis:'z'`).
- `generic-pterosaur` + `stylized-indoraptor` GLBs = kaputte Sketchfab-Skins → `enabled:false`.
- `carnotaurus.glb` = 98 MB (nahe GitHub-Limit, langsam auf Mobil).

## Zuletzt geänderte/erstellte Dateien (Session 3)

- `src/data/{backgrounds,creatures,eras}.ts` (Ozean-BGs, FBX aktiviert, Mosasaurus-BG)
- `src/utils/asset.ts` (neu, `withBase`), `src/components/system/AiImageMarker.tsx` (neu)
- `src/experience/CreatureModel.tsx`, `TimelineScene.tsx` (base-path), `src/components/controls/AudioManager.tsx`
- `src/pages/{HomePage,PageShell}.tsx`, `src/components/experience/{BackgroundTransition,ChapterSection}.tsx`
- `scripts/optimize-images.mjs` (neu), `vite.config.ts` (base + SPA-404), `src/main.tsx` (basename)
- `public/Images/*.webp` (neu), `public/models/{plesiosaurus,spinosaurus}/*` (neu)
- `../Personal Page/App.jsx` (Projekt-Karte)

## Nächste Schritte (Priorität)

1. **Sketchfab-Platzhalter entfernen** (User-Wunsch): 11 Manifest-Einträge ohne lokales Asset +
   3 Kapitel (`generic-sauropod`, `morrison-dinosaurs`, `generic-pterosaur`). Details in `HANDOFF.md`.
   Danach `npm test` + Rebuild + `gh-pages` neu deployen.
2. **Nicht-ladbare Downloads konvertieren:** `.blend` (Dilophosaurus, Pterodon) → GLB via Blender;
   Riesen-STLs (Concavenator 580 MB, Dino2 370 MB, Velociraptor 242 MB) offline dezimieren → GLB;
   `obj.rar` entpacken + OBJ einbinden (OBJ+MTL-Chaining in `modelLoaders.ts` noch TODO).
3. FBX-Modelle am echten Gerät verifizieren (siehe offene Fehler).
4. Personal Page neu bauen/deployen, damit die Projekt-Karte online erscheint.
5. Optional: Pages auf Actions-Workflow (Token-Scope `workflow`), `carnotaurus.glb` komprimieren.

## Deploy-Ablauf (Kurz)

```
# Code:
git add -A && git commit -m "..." && git push origin main
# Live-Seite aktualisieren:
$env:BASE_PATH='/mesozoica/'; npm run build
cd dist; git add -A; git commit -m "deploy"; git push -f https://github.com/TobyAUT/mesozoica.git gh-pages
```
