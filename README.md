# Mesozoica

A cinematic, scientifically-honest interactive journey through the Mesozoic era — a single fixed
WebGL scene that transforms as you scroll through 186 million years of deep time.

Built with React + Vite + TypeScript (strict), Three.js via React Three Fiber & drei,
@react-three/postprocessing, Lenis (scroll), Motion (UI), Zustand, Zod, and Tailwind CSS.

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
- **Scroll**: Lenis smooth-scroll on capable devices and passive native scrolling in low-power or
  reduced-motion mode. Progress lives in a plain ref (`src/store/scrollRef.ts`), never React state;
  DOM read-outs update only on scroll events. Only discrete chapter changes enter the Zustand store.
- **Backgrounds**: each era combines a local WebP image with a tuned CSS gradient fallback. The
  extinction and finale additionally use scroll-scrubbed local video.

## Asset checklist

### Runtime assets under `public/`

- `public/models/` contains exactly the 27 GLBs used by the active creature and chapter manifests.
- `public/Images/` contains the WebP backgrounds referenced by `src/data/backgrounds.ts`.
- `public/videos/` contains only the three scroll-optimized runtime videos.
- `public/audio/` contains the credited one-shot T. rex effect used by its facts panel.

Keep runtime additions manifest-backed. The detailed inventory and source/licence notes live in
`docs/ASSET_MAP.md`.

## Before publishing — unresolved credits

Nine models that are actually used on the timeline still have an unverified author or licence.
They remain visibly marked `TODO_VERIFY` rather than being hidden. Confirm their linked source pages
and fill `author` / `license` in `src/data/creatures.ts`; `resolved` then flips automatically.

## Known environment note

The in-app Browser preview throttles hidden tabs (rAF frozen), so the 3D scene won't animate and
screenshots time out _there only_. WebGL2 initialises with no errors and all assets load (verified
via network + console); rendering is normal in any visible browser.

## Performance decisions

- Adaptive DPR + `PerformanceMonitor` auto-degrades effects; manual quality selector (Auto/High/
  Balanced/Low).
- Only the active model is mounted; the next enabled model is preloaded; models are lazy-loaded per
  section. Route bundles are code-split; the heavy 3D home bundle is lazy.
- Runtime GLBs have WebP-compressed textures; the model folder is about 111 MB in total and the
  largest individual model is about 16 MB.
