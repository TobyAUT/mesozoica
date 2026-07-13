# Current Project State

Last updated: 2026-07-14 (Claude session — 16 new specimens added)

# Tuning Pass (2026-07-14, Claude — follow-up)

Per-model scale/position/rotation/animation adjustments in [src/data/creatures.ts](src/data/creatures.ts):
- Herrerasaurus scale 1→1.6; Plateosaurus 1→0.2; Dilophosaurus 1.05→0.4; Cryolophosaurus 0.95→0.85 + pos y −0.5; Plesiosaurus pos →[-0.6,1.1,0.65]; Pistosaur 0.5→0.35, pos y→0.9, +7s anim pause; Cetiosaurus 0.7→0.07; Megalosaurus 1.05→1.15 + x+0.6; Huayangosaurus 1→0.1; Allosaurus 1.05→2.6 + rotated 180° (y 2.6416) to face viewer; Stegosaurus +7s pause; Diplodocus 0.5→1.3; Baryonyx 0.9→0.99 + x+0.5; Iguanodon 1→0.3 + 7s pause; Argentinosaurus 0.55→0.055; Alex pos x→−1.8 (more centred); Quetzalcoatlus 0.32→0.13 + 7s pause.
- **Spinosaurus "not shown" root cause**: the model normalises to ~3.2 units tall at rest and is visible, but its native clip `Armature|ArmatureAction` stores bone translations in a different unit space than the mesh, so playing it collapses the skeleton to a near-zero point → invisible in a live browser (fine in the frozen-rAF pane). Fix: set `animationMode: 'static'` (no native clip). Now renders ~3.68 units tall. Clip kept in `availableAnimations` for reference.
- Global: models now fade in later — `smoothstep(local, 0.46, 0.64)` in [src/experience/CreatureModel.tsx](src/experience/CreatureModel.tsx) (was 0.24–0.42), so a creature only appears once its chapter text is on screen.
- Verified: typecheck 0, tests 20/20, build 0, dev server no console errors; Spinosaurus pipeline re-measured at 3.68 units tall (static).

# Latest Session (2026-07-14, Claude)

Objective: add all supplied new GLB models into the correct epochs in the existing style, wire full clickable credits, and move each chapter's short text to sit with a small gap beside the facts panel.

Done:
- Copied 17 GLBs from `Downloads\Claude\Websites\3D Modelle\Neue Modelle` into [public/models](public/models) with clean names.
- Added 16 new creature entries in [src/data/creatures.ts](src/data/creatures.ts) and upgraded Spinosaurus to the new animated model (`spinosaurus-animated.glb`, native clip `Armature|ArmatureAction`, credits filled). New: Lystrosaurus, Herrerasaurus, Plateosaurus (Triassic); Dilophosaurus, Cryolophosaurus, Pistosaur (Early Jurassic); Cetiosaurus, Megalosaurus, Huayangosaurus (Middle Jurassic); Allosaurus, Stegosaurus, Diplodocus (Late Jurassic); Baryonyx, Iguanodon (Early Cretaceous); Argentinosaurus (Late Cretaceous); Ankylosaurus (Latest Cretaceous).
- Wove new chapters into [src/data/eras.ts](src/data/eras.ts) in chronological order; added a **Late Jurassic** time-slice section (uses the previously-unused `late-jurassic` background) and a `blurb` field for time-slice copy. Timeline is now 36 sections.
- Every new model carries full Sketchfab attribution (author, `license` full name, new `licenseUrl`, `attributionText`, `sourceUrl`). Added `licenseUrl` to the schema/credits; [src/pages/CreditsPage.tsx](src/pages/CreditsPage.tsx) now renders the licence as a clickable link. Dunkleosteus also got its `licenseUrl`.
- Extended `creatureGroup` enum with `sauropodomorph`, `stegosaur`, `ornithopod`, `synapsid` in [src/data/types.ts](src/data/types.ts).
- Layout: in [src/components/experience/ChapterSection.tsx](src/components/experience/ChapterSection.tsx) the short creature text is now `lg:absolute` anchored just right of the fixed facts panel (constant ~1rem gap, vertically centred beside it) so it no longer drifts on wide screens.

Verification (all run):
- `npm run typecheck` → exit 0.
- `npm test` → 20/20 passed.
- `npm run lint` → 0 errors, 1 pre-existing warning.
- `npm run build` → exit 0.
- Dev server + in-app browser: all 17 new GLBs return HTTP 200; 36 sections present in correct order; Allosaurus chapter activates and every model fetches with **no console errors** (only pre-existing React Router future-flag warnings). Measured layout at 1920px: facts panel right edge 752px, short text left 768px → 16px (1rem) gap. Credits page shows new rows with clickable licence + Sketchfab links; unresolved banner dropped to the 9 older TODO_VERIFY models.

Manual tuning notes (may need visual pass in a normal browser — in-app pane freezes rAF so 3D isn't visually confirmed):
- Elongated models scaled down to frame on screen: Diplodocus 0.5, Argentinosaurus 0.55, Cetiosaurus 0.7, Pistosaur 0.5, Ankylosaurus 0.85, Baryonyx 0.9, Stegosaurus 0.95. Others ~1.0–1.15.
- All land creatures use `rotation:[0,-0.5,0]`; if any faces away, flip the sign (add/subtract π).
- Animated models use their native idle/animation clip; static ones (Cryolophosaurus, Megalosaurus, Cetiosaurus, Argentinosaurus have no GLB clips) use idle-sway.

# Previous Project State

Last updated: 2026-07-14 00:12 +02:00

Mesozoica is a Vite + React + TypeScript interactive timeline. The main route renders fixed background imagery, a fixed React Three Fiber canvas, a scroll-driven water overlay, and DOM chapter sections that control active era/creature state. The site has routes for home/timeline, creatures, about, methodology, credits, and a not-found page.

What currently works:

- 19 chapter sections are composed in [src/data/eras.ts](src/data/eras.ts), starting at the Mesozoica hero/prologue, then Devonian "Before the Dinosaurs", Triassic/Jurassic/Cretaceous chapters, extinction, and finale.
- The active manifest in [src/data/creatures.ts](src/data/creatures.ts) contains only model-backed runtime entries: Dunkleosteus, Carnotaurus, Velociraptor-like dromaeosaur, Alexornis, Spinosaurus, Plesiosaurus, Tylosaurus, Quetzalcoatlus, Mosasaurus, Triceratops, and T. rex.
- Disabled/no-runtime-model placeholder creature entries were removed from the active creature manifest and from the chapter sequence.
- Water transition code exists in [src/components/experience/WaterlineTransition.tsx](src/components/experience/WaterlineTransition.tsx) and [src/utils/water.ts](src/utils/water.ts), including circular rising bubble animation in underwater sections.
- Background images are in [public/Images](public/Images); one older wasteland PNG remains in [public/backgrounds/wasteland.png](public/backgrounds/wasteland.png).
- Credits are generated from creature data in [src/data/credits.ts](src/data/credits.ts); most model licenses are still not verified.

# Latest Session

- Timestamp: 2026-07-14 00:12 +02:00
- Agent used: Codex
- Objective: Replace Quetzalcoatlus with the new animated model, adjust info/text layout, move the old Quetzal assets to Recycle Bin, and remove creature manifest entries that are not model-backed.
- Summary:
  - Copied [Models/quetzal_animated.glb](Models/quetzal_animated.glb) to [public/models/quetzalcoatlus.glb](public/models/quetzalcoatlus.glb).
  - Moved the old raw `Models/Quetzal.glb` and the old runtime `public/models/quetzalcoatlus.glb` to the Windows Recycle Bin before replacing the runtime copy.
  - Updated Quetzalcoatlus to use native animation clip `Animation`, scale `0.32`, position `[1.2,-0.2,0.5]`, and rotation `[-0.2,0,0]`.
  - Moved the desktop facts panel closer to the progress/timeline bar and shifted the chapter creature text left so the visual order is progress bar -> facts panel -> short chapter text -> model.
  - Removed non-model-backed/disabled creature manifest entries and removed their old chapter sections.
  - Removed the pending specimen fallback UI from the 3D scene and chapter text.
  - Updated the creature explorer so "View in timeline" links target the real chapter IDs, including the Mosasaurus `marine` chapter.
  - Updated [docs/PROJECT_MAP.md](docs/PROJECT_MAP.md), [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/ASSET_MAP.md](docs/ASSET_MAP.md), and [docs/TIMELINE_MAP.md](docs/TIMELINE_MAP.md).

# Verification

Commands run during the latest session:

| Category | Command | Actual result |
|---|---|---|
| model inspection | `node scripts/inspect-glb.mjs Models\quetzal_animated.glb` | Detected one native clip named `Animation`; GLB has mesh, skin, material, and embedded image data. |
| typecheck | `npm.cmd run typecheck` | Exit 0; `tsc -b --noEmit` passed. |
| lint | `npm.cmd run lint` | Exit 0; 0 errors, 1 existing warning in `ScientificStatusBadge.tsx` (`react-refresh/only-export-components`). |
| tests | `npm.cmd test` | Exit 0 after rerun outside sandbox; 3 files passed, 20 tests passed. |
| production build | `npm.cmd run build` | Exit 0 after rerun outside sandbox; Vite built successfully. |
| browser verification | local Vite app at `http://127.0.0.1:5173/` | Desktop 1280x720 checked during tuning: facts panel and text no longer overlap, Quetzalcoatlus uses the animated GLB and appears on the right. |

# Active Model Snapshot

| Creature | Local path | Animation status | Scale/orientation status | License status |
|---|---|---|---|---|
| Carnotaurus | `public/models/carnotaurus.glb` | static/no clips | scale 1.12, rotation `[0,-0.6,0]` | TODO_VERIFY |
| Velociraptor-like Dromaeosaur | `public/models/dinosaur-velociraptor-like.glb` | static/no clips | scale 1, rotation `[0,2.44,0]` | TODO_VERIFY |
| Alexornis | `public/models/alex-alexornis.glb` | native clip with 7s replay pause | scale 1.15, rotation `[0,-0.5,0]` | TODO_VERIFY |
| Spinosaurus | `public/models/spinosaurus.glb` | static/no clips | scale 1.25, rotation `[0,-0.15,0]` | TODO_VERIFY |
| Triceratops | `public/models/triceratops.glb` | static/no clips | scale 1.12, rotation `[0,-0.55,0]` | TODO_VERIFY |
| Tyrannosaurus rex | `public/models/tyrannosaurus-rex-male.glb` | static/no clips; one-shot audio | scale 1.2, rotation `[0,-0.6,0]` | TODO_VERIFY |
| Mosasaurus | `public/models/mosasaurus.glb` | procedural whole-object | scale 1.3, position `[-1.6,-2.5,0.35]`, rotation `[0,-0.18,-0.5]` | TODO_VERIFY |
| Dunkleosteus | `public/models/dunkleosteus.glb` | procedural whole-object | scale 0.9, position `[0,1.2,0.25]` | hendrikReyneke, CC BY-NC 4.0 |
| Plesiosaurus | `public/models/plesiosaurus.glb` | procedural whole-object | scale 0.45, position `[0,1.3,0.65]` | TODO_VERIFY |
| Tylosaurus | `public/models/tylosaurus.glb` | procedural whole-object | scale 0.44, position `[0,1.25,0.35]` | TODO_VERIFY |
| Quetzalcoatlus | `public/models/quetzalcoatlus.glb` | native clip `Animation` | scale 0.32, position `[1.2,-0.2,0.5]`, rotation `[-0.2,0,0]` | TODO_VERIFY |

# Known Issues

- Most model authors/licenses are not verified.
- Several enabled models have manifest `animationMode: native` but no clips detected; this is handled by idle sway, not true skeletal animation.
- `carnotaurus.glb` is about 98.59 MB and should be compressed before production scale-up.
- Water overlay is a portable screen-space effect, not a physical 3D water surface.
- Some prior Markdown contains mojibake/encoding artifacts; newly rewritten docs are ASCII.
- Unused public GLBs for the old generic pterosaur and stylized Indoraptor remain in [public/models](public/models) for manual review, but they are no longer referenced by the active app data.

# Remaining Work

1. Verify model licenses and authors for every enabled public model.
2. Visually verify enabled models on a normal browser/device and tune scale/orientation where needed.
3. Decide whether to move or archive unused public GLBs after manual confirmation.
4. Convert or replace raw downloads in [Models](Models) if they are intended for runtime use.
5. Add looping era ambience assets or intentionally remove those still-silent ambience expectations.
6. Consider compressing oversized GLBs, especially Carnotaurus.

# Preserved Prior Session History

- Earlier work added Devonian chapters, multi-format loader support, water transition utilities/tests, AI-generated background transparency marker, base-path-aware assets, and WebP background optimization.
- Recent work added [public/models/dunkleosteus.glb](public/models/dunkleosteus.glb), the StudioMod T. rex sound under [public/audio](public/audio), a one-shot Play button, audio credits, and stronger circular underwater bubbles.
- Three unused ZIPs were moved to the Recycle Bin in a prior implementation session; the pterodactyl ZIP remains in [Models](Models) for manual review.
