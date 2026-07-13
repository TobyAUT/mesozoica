# Mesozoica

A cinematic, scientifically-honest interactive journey through the Mesozoic era — a single fixed
WebGL scene that transforms as you scroll through 186 million years of deep time.

Built with React + Vite + TypeScript (strict), Three.js via React Three Fiber & drei,
@react-three/postprocessing, GSAP + Lenis (scroll), Motion (UI), Zustand, Zod, and Tailwind CSS.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc -b && vite build  (production build)
npm run preview    # serve the production build
npm test           # Vitest (timeline + model utils)
npm run lint       # ESLint
```

## How it works

- **One data manifest drives everything.** `src/data/creatures.ts` is the single source of truth,
  validated by Zod at load. Add a creature (or enable a pending one) by editing that file — the
  timeline, navigation, panels, credits, and creature explorer all update automatically.
- **The narrative order** lives in `src/data/eras.ts` (`CHAPTERS`). It composes the scroll.
- **Scroll**: Lenis smooth-scroll + GSAP ScrollTrigger. Per-frame scroll progress lives in a plain
  ref (`src/store/scrollRef.ts`), never React state, so the render loop never triggers re-renders.
  Only discrete chapter changes are pushed into the Zustand store.
- **Backgrounds**: each era is a tuned CSS gradient (`src/data/backgrounds.ts`) that also serves as
  the low-power fallback. The one supplied photo backs the prologue & extinction.

## Asset checklist

### Local GLB models expected under `public/models/`

Present now (rendered live): `dinosaur-velociraptor-like.glb`, `alex-alexornis.glb`,
`carnotaurus.glb`, `triceratops.glb`, `tyrannosaurus-rex-male.glb`, `generic-pterosaur.glb`,
`stylized-indoraptor.glb`.

Pending (manifest entry exists, `enabled: false` — drop the GLB in and flip `enabled: true` +
set `modelPath`): `protoceratops-andrewsi.glb`, `stegoceras-validum.glb`,
`mosasaurus-hoffmannii.glb`, `tyrannosaurus-rex-alternate.glb`, `generic-sauropod.glb`,
`styracosaurus-albertensis.glb`, `tupuxuara-leonardii.glb`, `spinosaurus.glb`, `saichania.glb`,
`morrison-dinosaurs.glb`, `stylized-crested-theropod.glb`.

### Background images under `public/backgrounds/`

Only `wasteland.png` is supplied (used for prologue + extinction). Every other era uses a
procedural gradient. To use real photos, add files and set `image` on the matching entry in
`src/data/backgrounds.ts` (ids: `late-triassic`, `early-jurassic`, `middle-jurassic`,
`late-jurassic`, `early-cretaceous`, `late-cretaceous-delta`, `late-cretaceous-coast`,
`latest-cretaceous`).

### Audio under `public/audio/` (optional)

None supplied. The audio system is wired but silent. Expected paths:
`ambience-triassic.mp3`, `ambience-jurassic.mp3`, `ambience-cretaceous.mp3`,
`ambience-extinction.mp3`.

## Before publishing — unresolved credits

**Every model licence/author is unverified.** They show as `TODO_VERIFY` on the Credits page (not
omitted). Open each Sketchfab page (linked in the manifest), confirm the author + licence, and fill
`author` / `license` in `src/data/creatures.ts`. `resolved` flips automatically once both are set.

## DEVELOPER NOTE — Morrison group scene

`morrison-dinosaurs` is a `groupScene`. The GLB has **not** been supplied, so the meshes it
actually contains are **unknown**. Do NOT name any species from it (Allosaurus, Stegosaurus, etc.)
until the downloaded GLB is inspected — list the real mesh names here once it is.

## Known environment note

The in-app Browser preview throttles hidden tabs (rAF frozen), so the 3D scene won't animate and
screenshots time out *there only*. WebGL2 initialises with no errors and all assets load (verified
via network + console); rendering is normal in any visible browser.

## Performance decisions

- Adaptive DPR + `PerformanceMonitor` auto-degrades effects; manual quality selector (Auto/High/
  Balanced/Low).
- Only the active model is mounted; the next enabled model is preloaded; models are lazy-loaded per
  section. Route bundles are code-split; the heavy 3D home bundle is lazy.
- `carnotaurus.glb` is ~98 MB — it loads only when its section is active, but should be
  Draco/Meshopt-compressed and its textures reduced to ~1–2K before production.
