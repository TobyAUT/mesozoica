# Current Project State

Last updated: 2026-07-13 20:31 +02:00

Mesozoica is a Vite + React + TypeScript interactive timeline. The main route renders a fixed background layer, a fixed React Three Fiber canvas, a scroll-driven water overlay, and DOM chapter sections that control active era/creature state. The site has routes for home/timeline, creatures, about, methodology, credits, and a not-found page.

What currently works, based on code and prior notes:

- 27 chapter sections are composed in [src/data/eras.ts](src/data/eras.ts), starting at the Mesozoica hero/prologue, then Devonian "Before the Dinosaurs", then Triassic/Jurassic/Cretaceous chapters, extinction, and finale.
- Enabled local GLB models in [public/models](public/models) are loaded through [src/experience/CreatureModel.tsx](src/experience/CreatureModel.tsx): Carnotaurus, Velociraptor-like dromaeosaur, Alexornis, Spinosaurus, Plesiosaurus, Tylosaurus, Quetzalcoatlus, Triceratops, and T. rex.
- Disabled or pending creature entries remain in the manifest and render as pending/hidden depending on chapter state and scientific mode.
- Water transition code exists in [src/components/experience/WaterlineTransition.tsx](src/components/experience/WaterlineTransition.tsx) and [src/utils/water.ts](src/utils/water.ts).
- Background images are in [public/Images](public/Images); one older wasteland PNG remains in [public/backgrounds/wasteland.png](public/backgrounds/wasteland.png).
- Credits are generated from creature data in [src/data/credits.ts](src/data/credits.ts); most model licenses are still not verified.

# Latest Session

- Timestamp: 2026-07-13 20:31 +02:00
- Agent used: Codex
- Objective: Create/update Markdown documentation for Claude Code, Codex, and future developers using the actual repository as source of truth.
- Short continuation summary: Added top-level agent docs, renamed/updated progress handoff to `PROGRESS.md`, created repository, architecture, asset, and timeline maps under `docs/`. Preserved useful prior history as summarized sections and marked stale/unverified claims rather than carrying them forward as fact.

# Work Completed

- Inspected existing Markdown files: [README.md](README.md), [HANDOFF.md](HANDOFF.md), previous `Progress.md`, and [AENDERUNGEN_SESSION_CLAUDE.md](AENDERUNGEN_SESSION_CLAUDE.md).
- Inspected package scripts, source structure, route entry points, data manifests, loader code, scroll code, water code, public assets, raw model downloads, recent git history, and current branch.
- Verified GLB animation clips with [scripts/inspect-glb.mjs](scripts/inspect-glb.mjs).
- Verified public image dimensions with `sharp`.
- Created/updated the documentation requested by the user.

# Files Added or Modified

| Path | Purpose | Important changes |
|---|---|---|
| [AGENTS.md](AGENTS.md) | Shared agent entry point | Read order, entry points, working rules, verified package commands. |
| [CLAUDE.md](CLAUDE.md) | Claude-specific brief | Short instructions to continue existing work, update progress, and avoid unverified test/build claims. |
| [PROGRESS.md](PROGRESS.md) | Current state and continuation file | Replaces previous `Progress.md` casing, preserves useful session history, records current docs session and next steps. |
| [docs/PROJECT_MAP.md](docs/PROJECT_MAP.md) | Repository navigation | Directory map, feature map, search hints, coupled files, generated files. |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Runtime architecture | Data flow, scroll/R3F model, asset loading, accessibility/responsive behavior, risks. |
| [docs/ASSET_MAP.md](docs/ASSET_MAP.md) | Asset inventory | Verified model files, clips, image dimensions, audio/fonts/credits, unused/duplicate candidates. |
| [docs/TIMELINE_MAP.md](docs/TIMELINE_MAP.md) | Chronological map | Scroll direction, chapters, creature timeline, alternate models, future gaps. |

# Models and Assets Added

No new runtime model or background asset was added in this documentation session.

Affected/verified creature model facts:

| Creature | Source title | Display name | Local path | Format | Loader | Timeline placement | Animation status | Detected animation clips | Scale/orientation status | License verification status | Enabled |
|---|---|---|---|---|---|---|---|---|---|---|---|
| carnotaurus | CARNOTAURUS DINOSAUR | Carnotaurus | `public/models/carnotaurus.glb` | GLB | `useGLTF` | Late Cretaceous coast, ~71 Mya | Manifest `native`, no clips detected | none | scale 1, rotation `[0,-0.6,0]`; visual tuning TODO_VERIFY | author/license TODO_VERIFY | yes |
| velociraptor-like | Dinosaur | Velociraptor-like Dromaeosaur | `public/models/dinosaur-velociraptor-like.glb` | GLB | `useGLTF` | Late Cretaceous coast, ~73 Mya | Manifest `native`, no clips detected | none | scale 1, rotation `[0,2.44,0]`; identity uncertain | author/license TODO_VERIFY | yes |
| alexornis | Walking With Dinosaurs 3D - Alex | Alex (Alexornis) | `public/models/alex-alexornis.glb` | GLB | `useGLTF` | Late Cretaceous coast, ~75 Mya | Native clip selected | `alex\|p_keepaway\|Base Layer` | scale 1, rotation `[0,-0.5,0]`; offset in presenter | author/license TODO_VERIFY | yes |
| spinosaurus | Spinosaurus \| Spino Dinosaur | Spinosaurus | `public/models/spinosaurus.glb` | GLB | `useGLTF` | Late Cretaceous delta, ~96 Mya | Static | none | scale 0.9, rotation `[0,-0.6,0]`; visual orientation TODO_VERIFY | author TODO_VERIFY, license null | yes |
| plesiosaurus | TODO_VERIFY downloaded GLB title in manifest | Plesiosaurus | `public/models/plesiosaurus.glb` | GLB | `useGLTF` | Early Jurassic underwater, ~190 Mya | Procedural whole-object | none | scale 0.32, rotation `[0,-0.6,0]`; visual tuning TODO_VERIFY | author TODO_VERIFY, license null | yes |
| tylosaurus | Cartoon Tylosaurus free 3D model | Tylosaurus | `public/models/tylosaurus.glb` | GLB | `useGLTF` | Late Cretaceous underwater, ~82 Mya | Procedural whole-object | none | scale 0.28, rotation `[0,-0.7,0]`; visual tuning TODO_VERIFY | author TODO_VERIFY, license null | yes |
| quetzalcoatlus | Quetzalcoatlus (Quetzal.glb) | Quetzalcoatlus | `public/models/quetzalcoatlus.glb` | GLB | `useGLTF` | Latest Cretaceous, ~68 Mya | Procedural whole-object | none | scale 0.62, rotation `[0,-0.5,0]`; visual tuning TODO_VERIFY | author TODO_VERIFY, license null | yes |
| triceratops | Triceratops dinosaur | Triceratops | `public/models/triceratops.glb` | GLB | `useGLTF` | Latest Cretaceous, ~67 Mya | Manifest `native`, no clips detected | none | scale 1, rotation `[0,-0.55,0]`; visual tuning TODO_VERIFY | author/license TODO_VERIFY | yes |
| tyrannosaurus-rex | Tyrannosaurus Rex (Male version) | Tyrannosaurus rex | `public/models/tyrannosaurus-rex-male.glb` | GLB | `useGLTF` | Latest Cretaceous, ~66.5 Mya | Manifest `native`, no clips detected | none | scale 1, rotation `[0,-0.6,0]`; primary T. rex | author/license TODO_VERIFY | yes |
| generic-pterosaur | Animated Flying Pteradactyl (loop) | Pterosaur (flying reptile) | `public/models/generic-pterosaur.glb` | GLB | `useGLTF` if enabled | Early Cretaceous placeholder, ~115 Mya | Disabled; GLB has a clip but prior notes say broken skin/export | `PixCap Animation` | scale 1, rotation `[0,-0.4,0]`; broken/disassembled TODO_VERIFY before enabling | TODO_VERIFY | no |
| stylized-indoraptor | Raptor Dinosaur (Indoraptor) | Stylized "Indoraptor" | `public/models/stylized-indoraptor.glb` | GLB | `useGLTF` if enabled | Early Jurassic stylized chapter, ~180 Mya | Disabled; GLB has clips but prior notes say broken skin/export | `Armature\|eat`, `Armature\|idle`, `Armature\|roar` | scale 1, rotation `[0,-0.7,0]`; broken/disassembled TODO_VERIFY before enabling | TODO_VERIFY | no |

# Water and Underwater System

- Implementation state: implemented as a scroll-driven screen-space WebGL overlay plus underwater background selection.
- Relevant components: [src/components/experience/WaterlineTransition.tsx](src/components/experience/WaterlineTransition.tsx), [src/utils/water.ts](src/utils/water.ts), [src/components/experience/BackgroundTransition.tsx](src/components/experience/BackgroundTransition.tsx), [src/data/backgrounds.ts](src/data/backgrounds.ts), [src/data/creatures.ts](src/data/creatures.ts).
- Shader/library used: custom GLSL in a small Three.js `WebGLRenderer` owned by `WaterlineTransition`.
- Background assets: `devonian-ocean.webp`, `early-jurassic-ocean.webp`, `late-cretaceous-ocean.webp`, `late-cretaceous-ocean-mosasaurus.webp`.
- Scroll transition behavior: `submersionAt(progress)` rises into aquatic chapters, stays submerged across adjacent aquatic chapters, and drains when returning to land.
- Mobile fallback: quality tier clamps water overlay DPR to 1 on low tier; background CSS still provides a fallback visual.
- Reduced-motion fallback: overlay time animation freezes and submersion snaps instead of damping.
- Known issues: high-tier reflective `three/addons/Water` surface and true 3D bubbles/particles are not implemented; visual verification on a normal browser/device remains TODO_VERIFY in prior notes.

# Commands Run

Commands run during this documentation session:

| Category | Command | Actual result |
|---|---|---|
| install | Not run | `node_modules` already present; no dependency change. |
| repository inspection | `git status --short` | Clean before documentation edits. |
| history inspection | `git log --oneline -5` | Latest commit `d4e3ded docs: HANDOFF pointer to Progress.md session 5`. |
| model inspection | `node scripts/inspect-glb.mjs ...` | Completed; detected clips listed in this file and [docs/ASSET_MAP.md](docs/ASSET_MAP.md). |
| lint | `npm.cmd run lint` | Exit 0; 0 errors, 1 existing warning in `ScientificStatusBadge.tsx` (`react-refresh/only-export-components`). Initial `npm run lint` attempt was blocked by PowerShell execution policy before running. |
| typecheck | `npm.cmd run typecheck` | Exit 0; `tsc -b --noEmit` passed. Initial `npm run typecheck` attempt was blocked by PowerShell execution policy before running. |
| tests | `npm.cmd test` | Exit 0 outside sandbox after sandbox config-load failure; 3 files passed, 20 tests passed. Initial `npm test` attempt was blocked by PowerShell execution policy before running. |
| production build | `npm.cmd run build` | Exit 0 outside sandbox after sandbox config-load failure; Vite built successfully in 4.93s. |

# Known Issues

- Most model authors/licenses are not verified.
- Several enabled models have manifest `animationMode: native` but no clips detected; this is handled by idle sway, not true skeletal animation.
- `generic-pterosaur` and `stylized-indoraptor` are disabled despite having GLB files because prior notes record broken/disassembled Three.js rendering.
- `carnotaurus.glb` is about 98.59 MB and should be compressed before production scale-up.
- Water overlay is a portable screen-space effect, not a physical 3D water surface.
- Some prior Markdown contains mojibake/encoding artifacts; new docs are written in ASCII.

# Missing Assets

Manifest entries with no runtime model path include: `generic-sauropod`, `morrison-dinosaurs`, `protoceratops`, `styracosaurus`, `saichania`, `stegoceras`, `tupuxuara`, `tyrannosaurus-rex-alternate`, `mosasaurus`, `stylized-crested-theropod`, `dunkleosteus`, `dilophosaurus`, `concavenator`, `mosasaurus-alt`, `feathered-dromaeosaur`, and `olorotitan`.

Audio assets are not present under `public/audio`.

# Unverified Scientific Data

- Any creature marked `generic`, `stylized`, `uncertain`, `groupScene`, or `nonDinosaur` should be treated carefully in UI copy.
- `Dunkleosteus` full-body reconstruction details are uncertain in prior notes.
- `velociraptor-like`, `feathered-dromaeosaur`, and generic/stylized entries are intentionally not exact species reconstructions.
- TODO_VERIFY before adding new factual claims: geological ranges, formations, continents, and model identity.

# Unverified Licenses

The project records model credits from [src/data/creatures.ts](src/data/creatures.ts). Treat all null licenses/authors and `TODO_VERIFY` author strings as unresolved. Do not claim license verification until the source page or supplied license file has been checked.

# Remaining Work

1. Verify model licenses and authors for every enabled public model.
2. Visually verify enabled models on a normal browser/device and tune scale/orientation where needed.
3. Decide whether to remove disabled Sketchfab-only placeholder entries listed in prior handoff notes.
4. Convert or replace raw downloads in [Models](Models) if they are intended for runtime use.
5. Add or intentionally remove the silent audio system expectations.
6. Consider compressing oversized GLBs, especially Carnotaurus.

# Exact Next Steps for Codex

Current branch: `main`.

Last successful route recorded in prior notes: `/` and `/credits`; current docs session did not run browser verification.

Last successful creature/model verified by file inspection: enabled GLBs under [public/models](public/models); Alex is the only enabled GLB with a detected animation clip.

Last known build status: `npm.cmd run build` passed on 2026-07-13 during this documentation session after rerunning outside the sandbox.

1. File: [src/data/creatures.ts](src/data/creatures.ts). Task: decide whether disabled placeholder entries with no local asset should remain or be removed. Expected result: manifest only contains intentional current/future entries. Command afterward: `npm run test`.
2. File: [src/data/creatures.ts](src/data/creatures.ts). Task: verify author/license/source URL for each enabled model and replace `TODO_VERIFY`/null values only with checked facts. Expected result: [src/pages/CreditsPage.tsx](src/pages/CreditsPage.tsx) reports fewer unresolved credits. Command afterward: `npm run typecheck`.
3. File: [src/data/creatures.ts](src/data/creatures.ts). Task: visually tune `scale`, `position`, and `rotation` for Plesiosaurus, Tylosaurus, Quetzalcoatlus, and Spinosaurus on a real browser/device. Expected result: models frame correctly in their chapters. Command afterward: `npm run build`.
4. File: [src/experience/modelLoaders.ts](src/experience/modelLoaders.ts). Task: add OBJ+MTL chaining only if an OBJ asset is intentionally enabled. Expected result: OBJ entries can load their materials. Command afterward: `npm run test`.
5. File: [docs/ASSET_MAP.md](docs/ASSET_MAP.md). Task: update model/background tables whenever assets are added, removed, compressed, or re-exported. Expected result: docs match files and manifests. Command afterward: `npm run typecheck`.

# Preserved Prior Session History

Useful history from the previous `Progress.md`, [HANDOFF.md](HANDOFF.md), and [AENDERUNGEN_SESSION_CLAUDE.md](AENDERUNGEN_SESSION_CLAUDE.md):

- Session 5 integrated four GLBs: `plesiosaurus.glb`, `spinosaurus.glb`, `tylosaurus.glb`, and `quetzalcoatlus.glb`; all were inspected as Blender exports with no rig/no animation.
- Session 4 moved the Mesozoica hero to the start, fixed navigation scroll jitter, gave timeline dots per-point colors, and rotated the velociraptor-like model.
- Earlier work added Devonian chapters, multi-format loader support, water transition utilities/tests, AI-generated background transparency marker, base-path-aware assets, and WebP background optimization.
- Prior testing claims recorded: typecheck, tests, lint, and build passed in earlier sessions. These are historical notes, not current-session verification.
