# Mesozoica — Handoff

Timestamp: 2026-07-13 · Model: Claude (fable-5) · Branch: (no git repo)
Prior session log (German, Codex): `AENDERUNGEN_SESSION_CLAUDE.md` — treat as history; this file is the
canonical ongoing handoff going forward.

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
