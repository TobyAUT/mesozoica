# Mesozoica — Handoff

Timestamp: 2026-07-13 · Model: Claude (fable-5) · Repo: https://github.com/TobyAUT/mesozoica (main)
Live site: **https://tobyaut.github.io/mesozoica/** (GitHub Pages, gh-pages branch)
Prior session log (German, Codex): `AENDERUNGEN_SESSION_CLAUDE.md` — history.
Latest work log: **`Progress.md`** (Session 5 = 4 new GLBs integrated: Plesiosaurus, Spinosaurus,
Tylosaurus, Quetzalcoatlus; FBX folders retired). Also: Mesozoica hero now opens the page, nav
scroll-jitter fixed, per-point timeline colours, velociraptor-like turned 180°.

---

## ⭐ SESSION 3 (latest) — assets, EU compliance, performance, deploy

**Done this session:**
- **Ocean backgrounds**: the 4 supplied AI ocean images wired to Devonian / Early-Jurassic /
  Tylosaurus / Mosasaurus scenes, converted to WebP with a **light gaussian blur baked in**
  (`scripts/optimize-images.mjs`, sharp). Mosasaurus got its own `late-cretaceous-ocean-mosasaurus`
  backdrop so Tylosaurus & Mosasaurus differ.
- **Performance**: all 10 land backgrounds PNG→WebP (~24 MB → ~2.5 MB total, no visible loss).
  Base-path-aware asset loading (`utils/asset.ts withBase`) so images/models resolve under the
  Pages sub-path. Raw `Models/` + `Images/` (multi-GB) gitignored.
- **Two new models actually wired**: Plesiosaurus + Spinosaurus **low-poly FBX + PBR textures**
  (extracted from the `*_export.zip`s into `public/models/{plesiosaurus,spinosaurus}/`), `enabled:true`,
  via the FBX loader. ⚠️ NOT visually verified (Browser pane freezes rAF) — check textures/orientation
  in a real browser; if sideways set `upAxis:'z'`; FBX PBR channel mapping may need a tweak.
- **EU AI Act (Art. 50) transparency**: small persistent "KI-generiertes Bild · AI-generated" marker
  on-screen while an AI backdrop shows (`components/system/AiImageMarker.tsx`) + a privacy/AI footer
  disclosure in `PageShell`. `backgrounds.ts` gained an `aiGenerated` flag (all backdrops are AI).
- **Portfolio**: added Mesozoica as the FIRST project in `Personal Page/App.jsx` (`PROJECTS[0]`,
  links to the live site; cards now honour a `url` field). NOTE: Personal Page is a **separate repo/app** —
  rebuild & deploy it there to publish that change.
- **Deploy**: pushed to GitHub `main`; built with `BASE_PATH=/mesozoica/`; published `dist` to the
  `gh-pages` branch; enabled Pages. Live URL above. (Token lacked `workflow` scope, so a branch deploy
  is used instead of an Actions workflow — see Next Steps to switch to Actions.)

**STILL TODO (ran out of budget / blocked):**
1. **Remove the Sketchfab-only pending models + their credits** (user request). These have a
   Sketchfab `sourceUrl`, no local asset, and will never be delivered — safe to delete from
   `src/data/creatures.ts` AND their chapters in `src/data/eras.ts`. Candidates:
   `protoceratops, stegoceras, styracosaurus, saichania, generic-sauropod, morrison-dinosaurs,
   tupuxuara, tyrannosaurus-rex-alternate, stylized-crested-theropod, generic-pterosaur, mosasaurus-alt`.
   Chapters to also remove: `generic-sauropod, morrison-dinosaurs, generic-pterosaur`. Credits are
   auto-generated from `CREATURES`, so removing the entries removes their credit rows automatically.
   After removing, delete now-orphaned GLBs (`public/models/generic-pterosaur.glb` 23 MB, etc.) and
   run `npm test` (a test references `progressForChapterId('tyrannosaurus-rex')` — keep T. rex).
2. **The other downloaded models cannot be runtime-loaded as-is:**
   - `Dilophosaurus` (`*_Dilophosaurus+rig+.blend`) and `Pterodon` (`*_Pterodon.blend1`) are **Blender
     files** — three.js cannot read `.blend`. Export to GLB in Blender, drop in `public/models/`,
     set `modelPath` + `assetFormat:'glb'` + `enabled:true`.
   - `Concavenator` (580 MB STL), `Dino2.stl` (370 MB), `Velociraptor looking` (242 MB STL zip) are
     **3D-print STLs** far too heavy for the web. Decimate + convert to GLB offline (Blender / gltf
     tools) to a few MB, remove print bases/supports, THEN wire (`assetFormat:'stl'`→better `'glb'`).
   - `uploads_files_6902129_obj.rar` — no extractor installed; extract manually, inspect, wire the OBJ
     (`assetFormat:'obj'`, add `materialPath` if it ships an `.mtl` — OBJ+MTL chaining is still TODO in
     `modelLoaders.ts`).
   - `uploads_files_3154100_model.obj` (13 MB standalone OBJ) — unknown creature; identify, then wire.
3. **Optional**: switch Pages to an Actions workflow (needs a token with `workflow` scope:
   `gh auth refresh -s workflow`, then re-add `.github/workflows/deploy.yml`). Consider Git LFS or
   compressing `carnotaurus.glb` (98 MB) — it's near GitHub's 100 MB limit and slow on mobile.
4. **Verify the live site** loads on a phone once the first Pages build finishes (~1–2 min).

---

## Current Project State

Runnable Vite + React + TS (strict) + R3F experience. Build, typecheck, lint, and 20 unit tests all
pass. This session extended it with a **Devonian "Before the Dinosaurs" opener, 9 new specimens,
a data-driven multi-format model loader, and a reversible scroll-driven water-transition system.**

All 9 new source models are **not yet supplied**, so every new creature is `enabled: false`
("specimen pending"): it holds its correct chronological place, shows honest classification, and the
timeline never breaks. Drop the asset in + set `modelPath`/`assetFormat`/`enabled: true` to activate.

## Work Completed in This Session

- Extended the manifest type with: `assetFormat`, `upAxis`, `materialPath`, `textureBasePath`,
  `animationMode`, `sceneType`, `underwaterBackgroundId`, `waterTransition`, `stage`, `formation`,
  `factSources` (all optional/defaulted → existing entries unchanged). Added `Devonian` period,
  `fish`/`hadrosaur` creature groups.
- Added a **Devonian era** + a "Before the Dinosaurs" chapter and Dunkleosteus chapter **before the
  prologue**. Time counter now opens at 400 Mya (`TIME_START_MYA`).
- Added **9 new creature entries** and wove new chapters into the timeline in descending-age order.
- Added **3 underwater backgrounds** (gradient fallbacks — no photos supplied) and taught
  `BackgroundTransition` to render a caustic gradient when a background has no image.
- Built a **format-aware loader registry** (`experience/modelLoaders.ts`) + refactored
  `CreatureModel` into a dispatcher (glTF via `useGLTF`, FBX/OBJ/STL/PLY via `useLoader`) sharing one
  `ModelPresenter`. Preserves all prior GLB tuning (drag-rotate, fade, material handling, framing).
  Honours `animationMode` (native / static / proceduralWholeObject / disabled) — static models get
  no fake skeleton, aquatic/flying models get subtle whole-object drift only.
- Built the **water transition**: `utils/water.ts` (`submersionAt`) + `WaterlineTransition.tsx`
  (self-contained fullscreen GLSL overlay). Reversible, scroll-driven, with reduced-motion + low-power
  fallbacks. Marine chapter (Mosasaurus) converted to a real underwater scene.
- Badge/labels updated for `fish` ("Prehistoric fish"). Added tests for the water logic.

## Files Added or Modified

Added: `experience/modelLoaders.ts`, `utils/water.ts`, `utils/water.test.ts`,
`components/experience/WaterlineTransition.tsx`, `HANDOFF.md`.
Modified: `data/types.ts`, `data/creatures.ts`, `data/eras.ts`, `data/backgrounds.ts`,
`components/experience/BackgroundTransition.tsx`, `experience/CreatureModel.tsx`,
`components/creature/ScientificStatusBadge.tsx`, `pages/HomePage.tsx`.

## New Creature Manifest (this session)

| id | display | classification | timeline | asset path | format | runtime | asset status | clips | anim | scale/orient | licence |
|----|---------|----------------|----------|-----------|--------|---------|--------------|-------|------|--------------|---------|
| dunkleosteus | Dunkleosteus | Prehistoric fish (placoderm) — NOT a dinosaur | Devonian ~382–358 | — | glb | glb | PENDING | — (inspect) | proceduralWholeObject | default | TODO_VERIFY |
| plesiosaurus | Plesiosaurus | Marine reptile — NOT a dinosaur (statue prop) | Early Jurassic ~199–175 | — | glb | glb | PENDING | — | proceduralWholeObject | default | TODO_VERIFY |
| dilophosaurus | Dilophosaurus | Theropod dinosaur | Early Jurassic ~186–183 | — | glb? (title="RIG"→maybe FBX) | tbd | PENDING | — | native | default | TODO_VERIFY |
| concavenator | Concavenator | Theropod dinosaur | Early Cretaceous ~130–125 | — | stl (print) | stl | PENDING | none expected | static | default | TODO_VERIFY |
| tylosaurus | Tylosaurus | Mosasaur / marine reptile — NOT a dinosaur (cartoon) | Late Cret ~86–78 | — | glb | glb | PENDING | — | proceduralWholeObject | default | TODO_VERIFY |
| pteranodon-like | Pteranodon-like Pterosaur | Pterosaur — NOT a dinosaur | Late Cret ~86–84 | — | glb | glb | PENDING | — | proceduralWholeObject | default | TODO_VERIFY |
| mosasaurus-alt | Mosasaurus (alternate) | Marine reptile — NOT a dinosaur | Late Cret ~82–66 | — | glb | glb | PENDING | — | proceduralWholeObject | default | TODO_VERIFY |
| feathered-dromaeosaur | Feathered dromaeosaur | Dromaeosaurid theropod (PREFERRED raptor) | Latest Cret ~75–70 | — | stl (pre-supported print) | stl | PENDING | none expected | static | default; remove base/supports | TODO_VERIFY |
| olorotitan | Olorotitan | Hadrosaur (Asia) | Latest Cret ~72–66 | — | glb | glb | PENDING | — | native | default | TODO_VERIFY |

Clip names are detected at RUNTIME and logged in dev (`[Mesozoica] <name> (<format>/<mode>) — N clip(s): …`).
Fill `availableAnimations` + `preferredAnimation` only after inspecting the real GLB/FBX.

## Water Transition Implementation

- Components: `utils/water.ts` → `submersionAt(progress): 0..1` (aquatic-chapter aware, reversible);
  `components/experience/WaterlineTransition.tsx` → fullscreen GLSL overlay (own tiny WebGLRenderer,
  z-10, above scene / below text UI). Uniforms: `uProgress, uTime, uResolution, uEdgeNoise,
  uDistortionStrength, uWaterColor, uOpacity` (as specified).
- Effect: noisy rising waterline, refraction ripple + crest highlight near the surface, blue-green
  depth grade, caustic bands, suspended particles; at full submersion the whole screen is the
  underwater grade. Damped rise/fall; discards when dry (zero cost on land chapters).
- ScrollTrigger integration: reads `scrollRef.progress` (the Lenis+ScrollTrigger driver already in
  `useScrollController`) each frame — no React state per frame.
- Aquatic chapters: `before-dinosaurs`→`dunkleosteus`, `plesiosaurus`, `tylosaurus`→`pteranodon-like`
  (surfacing), `marine` (Mosasaurus). Backgrounds: `devonian-ocean`, `early-jurassic-ocean`,
  `late-cretaceous-ocean` (gradient fallbacks).
- Quality fallbacks: pixel ratio clamped on low tier; **reduced motion** freezes `uTime` and snaps
  submersion (static crossfade, no rising sequence). If no aquatic chapters exist, the overlay/renderer
  is never created.
- **Simplified vs the full brief (intentional, documented):** this is the portable baseline that also
  serves as the low/mobile fallback. NOT yet implemented: the high-tier reflective `three/addons/Water`
  surface, a literal camera dip below a 3D surface, and true 3D suspended-particle/bubble systems.
  The overlay approximates all of these in screen space. See Next Steps.

## Tests and Commands Run (actual results this session)

- `npx tsc -b --noEmit` → exit 0 (clean)
- `npm test` (vitest) → 20/20 passed (`timeline` 10, `model` 5, `water` 5)
- `npx eslint .` → 0 errors, 1 pre-existing warning (`ScientificStatusBadge.tsx` fast-refresh)
- `npm run build` → exit 0 (HomePage chunk ~1.24 MB / 355 kB gzip; lazy-loaded)
- Browser smoke (dev): 27 sections present, new chapters in correct order, 2 canvases mounted
  (scene + waterline), **no console errors**. Live rendering NOT visually verifiable here — the
  in-app Browser pane throttles the hidden tab (`document.hidden`, rAF = 0 fps). Verify visuals in a
  normal browser.

## Known Issues

- `generic-pterosaur` and `stylized-indoraptor` GLBs load as broken/disassembled skins in three.js
  (prior session finding) → remain `enabled: false`. Need clean re-exports.
- Water overlay + camera crossing not visually confirmed in this environment (frozen-rAF pane).
- OBJ+MTL chaining and external-texture `textureBasePath` are typed in the manifest but the generic
  loader currently loads OBJ standalone (no MTL pass). No OBJ asset exists yet.

## Missing Assets

- All 9 new models (see table). Backgrounds: `-01-devonian-ocean.webp`, `02b-early-jurassic-ocean.webp`,
  `07b-late-cretaceous-ocean.webp` (currently gradient fallbacks). No audio files.

## Unverified Scientific Data

- Dunkleosteus body length/full-body form (post-cranial anatomy uncertain) → `lengthMeters: null`.
- Pteranodon-like exact genus → `scientificName: null`, status `uncertain`.
- Any range given as "~" is approximate; all displayed facts carry a `factSource`/`factSources`.

## Unverified Licenses

- **Every** model's `author`, `license`, `sourceUrl` is `null` / `TODO_VERIFY` and shown loudly on
  the Credits page. Do not publish any model until its Sketchfab page is checked and both fields set.

## Remaining Work

1. Acquire + wire the 9 GLB/STL/FBX assets (per table); fill clips + licence + verify format.
2. Optional high-tier water: reflective `three/addons/Water` surface + camera dip; 3D bubbles/particles.
3. OBJ+MTL chaining + `textureBasePath` support in `modelLoaders.ts`.
4. Re-export `generic-pterosaur` / `stylized-indoraptor` cleanly, or replace sources.
5. Add `mosasaurus-alt` to the Creature Explorer as a comparison model (primary chosen by config).
6. Credits page: it already lists all creatures automatically; verify the new ones appear.

## Exact Next Steps for Codex

1. Open `src/data/creatures.ts`. For `dilophosaurus`: once the asset is downloaded, confirm whether it
   is GLB or FBX; set `assetFormat` accordingly and `modelPath` to `/models/dilophosaurus.<ext>`.
2. Put the file in `public/models/`. Set `enabled: true`.
3. `npm run dev`, scroll to the Jurassic. Read the dev console line
   `[Mesozoica] Dilophosaurus (…) — N clip(s): …`; copy the clip names into `availableAnimations` and
   pick `preferredAnimation`.
4. For `concavenator` and `feathered-dromaeosaur` (STL prints): keep `assetFormat: 'stl'`,
   `animationMode: 'static'`. In a DCC/mesh tool, delete the print base/support meshes BEFORE export;
   do not alter the licensed mesh otherwise. Set `upAxis: 'z'` only if it loads lying on its side.
5. For `feathered-dromaeosaur`: once enabled, set `velociraptor-like` `enabled: false` (only the
   feathered dromaeosaur should be an active timeline entry).
6. Verify the water crossing: scroll `spinosaurus → tylosaurus`. Confirm the waterline rises, and
   scrolling back up drains it (reversibility). Then `tylosaurus → pteranodon-like` should surface.
7. Run `npx tsc -b --noEmit`, `npm test`, `npm run build` — all must stay green.
8. Confirm preloading does NOT fetch far-off models: `src/experience/TimelineScene.tsx` preloads only
   the next enabled creature with a `modelPath`.

### Architecture decisions / assumptions

- Manifest literals are typed `CreatureInput` (`z.input`) so defaulted fields stay optional.
- glTF stays on `useGLTF` (Draco/KTX2 aware); only FBX/OBJ/STL/PLY go through `useLoader` — avoids
  regressing the working GLB path and avoids conditional hooks.
- Water is a separate WebGL overlay (own renderer) → zero risk to the main scene; also the mobile/low
  fallback. Reflective 3D water is deferred (see Remaining Work #2).
- Chronology is thematic where ranges overlap (the brief allows this); the year counter is not strictly
  monotonic and the test asserts bounds + net direction, not monotonicity.
- Last verified route: `/` (home) DOM + `/credits`. Last verified creature pipeline: preload GET 200
  (prior session). No aquatic model could be visually verified (assets pending + frozen-rAF pane).
