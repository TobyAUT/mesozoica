# Current Project State

Last updated: 2026-07-15 (Codex — low-end performance, typography, cumulative timeline dots)

# Session 2026-07-15 (Codex) — lower-end device optimization

Verified locally: typecheck 0, tests 22/22, lint 0 errors (1 pre-existing warning), production
build 0, and browser checks in forced Low and High quality with no console errors. The HomePage
bundle dropped from 1,241.02 kB / 355.31 kB gzip to 1,126.51 kB / 309.86 kB gzip by removing the
unused GSAP runtime path and driving Lenis directly.

- Auto detection now accounts for cores, device memory, Save-Data and slow connections.
- Balanced disables postprocessing and reduces DPR/particles. Low disables particles, grain,
  backdrop filters, continuous background motion, custom cursor and next-model GLB preloading.
- Low uses passive native scrolling and a CSS water grade instead of permanent smoothing plus a
  second fullscreen WebGL renderer. The high-quality shader remains for capable devices and sleeps
  completely while the page is dry.
- Timeline dots, year counter, mobile progress and creature-panel opacity now update only on actual
  scroll changes instead of running four independent permanent animation loops.
- Runtime performance decline now lowers DPR and particles in addition to disabling postprocessing.
- Removed the now-unused `gsap` dependency and updated architecture/project documentation.

# Session 2026-07-15 (Codex) — typography + timeline progress

Verified: typecheck 0, tests 22/22, lint 0 errors (1 pre-existing warning), production build 0.
Desktop browser checks at 1440x900 confirmed 37 unique timeline colours, 26 filled dots at the
Argentinosaurus chapter, all 37 filled at the finale, centred period content, the expected local
font, and no console errors.

- **Modern main headings**: all semantic h1/h2 and `.type-display`/`.type-title` headings now use
  the locally bundled OFL-licensed Space Grotesk variable font with a stronger editorial weight
  and tighter display spacing ([globals.css](src/styles/globals.css)).
- **More legible subheadings**: eyebrow labels use a heavier weight and less extreme letter spacing.
  Period captions and creature chapter captions now use the established Cretaceous teal. In the
  creature card this also applies to the period, scientific name, and When/Where/Diet/Length labels
  ([ChapterSection.tsx](src/components/experience/ChapterSection.tsx),
  [CreatureInfoPanel.tsx](src/components/creature/CreatureInfoPanel.tsx)).
- **Centred period sections**: era-intro and time-slice headings, captions, and copy are centred as
  one block on every viewport ([ChapterSection.tsx](src/components/experience/ChapterSection.tsx)).
- **Cumulative timeline completion**: the current dot remains filled as before; once a chapter is
  completed, its dot retains its own unique colour. At the end of the page all 37 dots are filled.
  The existing per-dot colour generation was preserved unchanged
  ([GeologicalTimeline.tsx](src/components/timeline/GeologicalTimeline.tsx)).

# Session 2026-07-15 #3 (Claude) — typography + deploy

Live at **https://tobyaut.github.io/mesozoica/** (verified: new title, 37 sections, self-hosted
fonts loading, sand headings, **0 failed resources**, 0 console errors).

- **Self-hosted fonts** (were declared but never loaded → system fallback). Added three OFL variable
  families via `@fontsource-variable/*`, imported in [main.tsx](src/main.tsx), wired in
  [tailwind.config.ts](tailwind.config.ts): Fraunces (serif display), Inter (sans body), Space
  Grotesk (eyebrows/labels). Bundled at build time, no CDN (DSGVO-safe).
- **Green eyebrow legibility**: brightened the four era accents (Cretaceous teal #5a9a97→#74c0ba the
  most) and gave `.type-eyebrow` a text-shadow outline in [globals.css](src/styles/globals.css).
- **Bigger small text**: eyebrows + info-card description/stat/keyfact sizes bumped for readability.
- **Cryolophosaurus name clipping fixed**: the info-card name rendered at 56px (`.type-title` beat
  `text-3xl`), overflowing the card and cutting the final "s". Capped to `!text-[2.35rem]` +
  `break-words` in [CreatureInfoPanel.tsx](src/components/creature/CreatureInfoPanel.tsx).
- **Deploy fixed & made reproducible**: the old gh-pages build baked a Git-Bash-mangled base
  (`/Program Files/Git/mesozoica/…`) so the live link was broken. Added `npm run deploy`
  (`cross-env BASE_PATH=/mesozoica/ npm run build && gh-pages -d dist -t`) — cross-env passes the
  literal base so cmd/PowerShell can't mangle it. Republished with correct `/mesozoica/` base.
  NOTE: build the deploy from PowerShell/cmd, NOT Git Bash (Bash mangles the `/mesozoica/` arg).



# Session 2026-07-15 #2 (Claude) — content + polish pass

Verified: typecheck 0, tests 22/22, lint 0 errors, build 0. Browser: SEO title/description live, 37
chapter sections in corrected order, spinosaurus.glb fetched 200 via the real loader, no loader
errors. (Live 3D/fade visuals aren't observable in the in-app pane — it freezes rAF, stalling Lenis
so the active chapter can't advance; validated via asset fetch, DOM/computed-style, and build.)

- **Spinosaurus now uses the static `spinosaurus.glb`** (1 mesh, 0 skins) in
  [creatures.ts](src/data/creatures.ts) instead of `spinosaurus-animated.glb`, whose rig collapsed
  in bind/native pose and left the section empty. Author/licence for the static mesh are unverified
  (TODO_VERIFY) — the animated file with verified seirogan/CC-BY credit stays in public/models,
  unused, if we want to restore it later.
- **Removed the scientific-status badge** ("Verified" / "Marine reptile" …) from the timeline
  heading ([ChapterSection.tsx](src/components/experience/ChapterSection.tsx)) and the info card
  ([CreatureInfoPanel.tsx](src/components/creature/CreatureInfoPanel.tsx)). The badge component and
  its use on the Creatures/Methodology pages are unchanged.
- **Heading colour/contrast**: new `.heading-hero` class in
  [globals.css](src/styles/globals.css) (warm sand `#f7e2b0` + layered dark text-shadow) applied to
  every on-scene h1/h2 in ChapterSection, so headings stay on-palette and separate cleanly from the
  photographic backdrops on both mobile and desktop.
- **SEO** in [index.html](index.html): title "Mesozoica – Interactive 3D Dinosaur Timeline", new
  meta description, and Open Graph tags.
- **Copy**: rewrote the prologue intro, all four era intros + epochs, the Middle/Late Jurassic
  time-slice blurbs, the Impact/Finale paragraphs, and every creature `shortDescription`
  ([eras.ts](src/data/eras.ts), [creatures.ts](src/data/creatures.ts), ChapterSection). The Jurassic
  and Cretaceous era-intro labels are now "The Early Jurassic" / "The Early Cretaceous".
- **Timeline structure**: added a **"The Late Cretaceous"** time-slice before Spinosaurus, and
  **moved Pistosaurus into the Middle Triassic** (between Lystrosaurus and Herrerasaurus; period enum
  has no "Middle Triassic" so it uses `Triassic` with the age in the text). 37 sections total.



# Session 2026-07-15 (Claude) — 6-point pass

Backup: git tag `backup/pre-claude-2026-07-15` (restore with `git reset --hard` or per-file
`git checkout backup/pre-claude-2026-07-15 -- <path>`). Verified: typecheck 0, tests 22/22, lint 0
errors (1 pre-existing warning), build 0, dev server no console errors.

1. **Model disappearing / wrong-while-rotating — fixed** in [src/utils/model.ts](src/utils/model.ts)
   `prepareForScene`. Root cause: GLB accessors ship stale/missing `boundingSphere`s, so static
   (non-skinned) meshes could frustum-cull themselves once rotation moved their wrong sphere
   off-frustum; single-sided Sketchfab faces (fins/membranes/shells) also dropped out as they
   turned away from camera. Fix: recompute `computeBoundingBox()`+`computeBoundingSphere()` per
   mesh so culling is accurate again, and set `material.side = DoubleSide` so back faces stay solid.
   Kept the targeted `frustumCulled = !isSkinnedMesh` rule (posed skins can't be cheaply bounded).
   Camera `near` inspected and left at 0.1 — models sit ~7–12 units from camera, never near the
   clip plane, so reducing it would risk depth precision for no gain. Pivot system (wrapper Group +
   `normaliseModel` centring X/Z, feet at Y=0, rotation on the outer group) already existed and is
   correct — unchanged.
2. **Timeline scrollbar colours** in [src/components/timeline/GeologicalTimeline.tsx](src/components/timeline/GeologicalTimeline.tsx):
   `chapterDotColor` rewritten to fan each point deterministically across its geological period's
   colour family by its order within that family (no more index*13 collisions) — unique per point,
   still reads by era, early→late lightness ramp.
3. **Desktop layout** — info panel nudged from `left-20rem` to `left-17rem` (2xl 21→18rem) in
   [src/pages/HomePage.tsx](src/pages/HomePage.tsx), closer to the timeline (clears the longest
   label by ~27px). Model + info window now share ONE scroll-driven opacity envelope
   `creatureFade(local)` (added to [src/utils/timeline.ts](src/utils/timeline.ts), unit-tested): both
   fade in mid-section and fully out by ~92% of the chapter, so they vanish together before the next
   heading enters. Panel opacity is now rAF-driven from that curve (removed framer-motion
   AnimatePresence in HomePage + CreatureInfoPanel).
4. **Mobile/tablet order** (heading → model → info) already implemented via the fixed-canvas
   bottom-inset + fixed bottom card; verified layout bands at 375px (canvas 0–487, card 491–800).
   No change needed.
5. **GLB optimization** via [scripts/optimize-glb.mjs](scripts/optimize-glb.mjs) (glTF-Transform,
   WebP texture recompression only — geometry/skins/materials untouched, so NO runtime Draco/Meshopt
   decoder added; `EXT_texture_webp` is decoded natively by three-stdlib's GLTFLoader). **555 MB →
   111 MB (−80%)**: carnotaurus 103→16, tyrannosaurus 53→3.9, stegosaurus 57→3.1, mosasaurus 52→7,
   triceratops 47→1.7, allosaurus 38→2.8, dilophosaurus 21→2.5 MB, etc. Verified in-browser: the app
   fetched carnotaurus.glb (200) via the real loader with zero console errors, and the browser
   decoded an embedded 2048² WebP via createImageBitmap. Originals are recoverable from git.
6. **3D rotation on every device**: unified pointer events + pointer capture already handle
   mouse/touch/pen; added explicit `canvas { touch-action: pan-y }` in
   [src/styles/globals.css](src/styles/globals.css) so horizontal drag rotates and vertical scrolls
   the page on every touch browser (R3F only sets touch-action on the canvas *container*). Verified
   the canvas element now computes `pan-y`.

# Prior state
Last updated: 2026-07-14 (Claude session — mobile order + per-model tuning pass)

# Mobile framing overhaul (2026-07-14, Claude)

The mobile info card had **no height cap** (desktop is scrollable, mobile wasn't) so it rendered
full-content-height (~450px) over the centered fullscreen model — dinos vanished behind it. Also
the per-model x-offsets + `stageOffsetX=3.8` are tuned for the desktop side-panel layout, so on
mobile (no side panel) models were pushed off the narrow frame.

- [ExperienceCanvas.tsx](src/experience/ExperienceCanvas.tsx): canvas wrapper is now `bottom-[40svh] lg:bottom-0` — on mobile the WebGL view occupies the top ~60%, reserving the bottom band for the card (verified: wrapper 0–487px on 375×812). Full-screen again at lg.
- [CreatureInfoPanel.tsx](src/components/creature/CreatureInfoPanel.tsx): mobile card capped `max-h-[38svh] overflow-y-auto overscroll-contain` so it sits in the bottom band and scrolls instead of covering the model.
- [HomePage.tsx](src/pages/HomePage.tsx): mobile panel container moved to `inset-x-3 bottom-3` (was `inset-x-4 bottom-14`).
- [CreatureModel.tsx](src/experience/CreatureModel.tsx): on mobile the model is horizontally centred (`modelX = 0`), ignoring `stageOffsetX` and the authored `position[0]` (which only exists to compose around the desktop text). Desktop framing unchanged.
- Net order on mobile: heading (top) -> 3D model (top ~60%) -> info card (bottom band), no overlap. The squarer canvas box also cuts the portrait camera pull-back (~1.72x -> ~1.30x) so models read larger.
- Verified: typecheck 0, tests 20/20, build 0; desktop canvas still full-height (720/720 at 1280×720). Note: the in-app Browser pane freezes rAF so the WebGL canvas stays 300×150 there — real browsers size it via ExperienceCanvas ManualResize.

# Tuning Pass 2 (2026-07-14, Claude)

- **Mobile layout order fixed** in [src/components/experience/ChapterSection.tsx](src/components/experience/ChapterSection.tsx): creature/marine sections now use `items-start lg:items-center` and the heading block gets `mt-24 lg:mt-0` (dropped the old `hidden sm:block`), so on phones the order reads heading (top) -> 3D model (fixed fullscreen canvas) -> facts panel (fixed bottom). Verified in-browser at 375px: Herrerasaurus heading top ~172px, panel bottom-anchored, no console errors.
- **Per-model adjustments** in [src/data/creatures.ts](src/data/creatures.ts): Dunkleosteus pos y 1.2->0.8; Herrerasaurus scale 1.6->2.08 (+30%) & pos y 0->-1.8; Plateosaurus scale 0.2->0.04 (/5); Dilophosaurus scale 0.4->0.48 (+20%) & rotation y -0.5->2.6416 (flipped 180°); Cryolophosaurus pos y -0.5->-1.8; Plesiosaurus pos y 1.1->0.8 & rotation y -0.6->-0.5127 (+5° left); Pistosaurus pos x 0->-0.8 & **animationMode native->proceduralWholeObject** (native swim clip drove the root transform and blocked drag-rotation — every other marine reptile already uses procedural, which rotates); Cetiosaurus scale 0.07->0.0175 (/4); Megalosaurus pos x 0.6->0.8; Huayangosaurus scale 0.1->0.01 (/10); Allosaurus pos y 0->-1.8; Diplodocus pos x 0->2.5; Argentinosaurus scale 0.055->0.01375 (/4); Tylosaurus pos y 1.25->0.55; Quetzalcoatlus pos x 1.2->-0.5 (back in frame); T. rex scale 1.2->1.44 (+20%) & pos x 0->0.8.
- Verified: typecheck 0, tests 20/20, build 0, dev server no console errors.

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
