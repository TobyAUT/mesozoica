# Project Map

Last updated: 2026-07-16
Current branch: `codex/bilingual-finale-polish`

Mesozoica is a Vite + React + TypeScript interactive prehistoric timeline. It combines DOM scroll chapters, Lenis/native scroll orchestration, Zustand state, React Three Fiber, local GLB models, and WebP backgrounds to move from Devonian pre-dinosaur seas through the end-Cretaceous extinction.

Current implementation status: The main timeline route is implemented at `/` and `/timeline`, with secondary pages for creatures, about, methodology, and credits. Chapter order is data-driven from [src/data/eras.ts](../src/data/eras.ts), creature/model behavior from [src/data/creatures.ts](../src/data/creatures.ts), and backgrounds from [src/data/backgrounds.ts](../src/data/backgrounds.ts). The active creature manifest contains only model-backed GLB entries in [public/models](../public/models). The last recorded verification in [PROGRESS.md](../PROGRESS.md) shows lint, typecheck, tests, and production build status.

## 1. Read This First

Recommended navigation order for agents:

1. [PROGRESS.md](../PROGRESS.md)
2. [docs/PROJECT_MAP.md](PROJECT_MAP.md)
3. [docs/ARCHITECTURE.md](ARCHITECTURE.md)
4. [docs/ASSET_MAP.md](ASSET_MAP.md)
5. [docs/TIMELINE_MAP.md](TIMELINE_MAP.md)

## 2. Repository Tree

Curated tree only; excludes `node_modules`, `dist`, caches, and individual binary assets.

```text
.
├── AGENTS.md
├── CLAUDE.md
├── PROGRESS.md
├── README.md
├── HANDOFF.md
├── AENDERUNGEN_SESSION_CLAUDE.md
├── package.json
├── package-lock.json
├── index.html
├── vite.config.ts
├── vitest.config.ts
├── tsconfig*.json
├── tailwind.config.ts
├── postcss.config.js
├── .eslintrc.cjs
├── .prettierrc.json
├── docs/
│   ├── PROJECT_MAP.md
│   ├── ARCHITECTURE.md
│   ├── ASSET_MAP.md
│   └── TIMELINE_MAP.md
├── src/
│   ├── main.tsx
│   ├── app/
│   │   └── App.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── CreaturesPage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── MethodologyPage.tsx
│   │   ├── CreditsPage.tsx
│   │   ├── NotFoundPage.tsx
│   │   └── PageShell.tsx
│   ├── components/
│   │   ├── controls/
│   │   ├── creature/
│   │   ├── experience/
│   │   ├── navigation/
│   │   ├── system/
│   │   └── timeline/
│   ├── data/
│   │   ├── backgrounds.ts
│   │   ├── creatures.ts
│   │   ├── credits.ts
│   │   ├── eras.ts
│   │   └── types.ts
│   ├── i18n/
│   │   ├── index.ts        (useTr hook)
│   │   ├── strings.ts      (fixed UI labels, en + de)
│   │   ├── content.ts      (German overrides for the manifests)
│   │   └── i18n.test.ts
│   ├── experience/
│   │   ├── ExperienceCanvas.tsx
│   │   ├── TimelineScene.tsx
│   │   ├── CreatureModel.tsx
│   │   ├── modelLoaders.ts
│   │   ├── CameraController.tsx
│   │   ├── EnvironmentController.tsx
│   │   ├── ParticleSystem.tsx
│   │   └── Effects.tsx
│   ├── hooks/
│   ├── store/
│   ├── styles/
│   └── utils/
│       ├── asset.ts
│       ├── model.ts
│       ├── model.test.ts
│       ├── scientificStatus.ts
│       ├── timeline.ts
│       ├── timeline.test.ts
│       ├── water.ts
│       └── water.test.ts
├── public/
│   ├── models/
│   ├── Images/
│   └── backgrounds/
├── Models/
│   └── raw downloads and duplicate source models
├── Images/
│   └── raw/source ocean PNGs
└── scripts/
    ├── inspect-glb.mjs
    ├── optimize-glb.mjs
    └── optimize-images.mjs
```

The project has one creature effect audio file under [public/audio](../public/audio). It is played
only from the T. rex facts panel; there is no global ambience subsystem.

## 3. Application Entry Points

| Area               | File                                                            | Purpose                                                                    |
| ------------------ | --------------------------------------------------------------- | -------------------------------------------------------------------------- |
| HTML shell         | [index.html](../index.html)                                     | Vite entry HTML.                                                           |
| React root         | [src/main.tsx](../src/main.tsx)                                 | Mounts React and configures `BrowserRouter` with Vite `BASE_URL`.          |
| Routes             | [src/app/App.tsx](../src/app/App.tsx)                           | Lazy route table and route fallback.                                       |
| Timeline page      | [src/pages/HomePage.tsx](../src/pages/HomePage.tsx)             | Main fixed visual layers, UI overlays, and DOM chapter sections.           |
| Page shell         | [src/pages/PageShell.tsx](../src/pages/PageShell.tsx)           | Shared shell for non-timeline pages.                                       |
| Global state       | [src/store/experienceStore.ts](../src/store/experienceStore.ts) | Zustand store for active chapter, language, quality, menus, and preloader. |
| Frame scroll state | [src/store/scrollRef.ts](../src/store/scrollRef.ts)             | Mutable scroll progress/velocity ref used by animation loops.              |
| Global CSS         | [src/styles/globals.css](../src/styles/globals.css)             | Tailwind layers, Lenis styles, responsive and reduced-motion rules.        |

## 4. Routes

Routes are defined in [src/app/App.tsx](../src/app/App.tsx):

| Route          | Page                                                              |
| -------------- | ----------------------------------------------------------------- |
| `/`            | [src/pages/HomePage.tsx](../src/pages/HomePage.tsx)               |
| `/timeline`    | [src/pages/HomePage.tsx](../src/pages/HomePage.tsx)               |
| `/creatures`   | [src/pages/CreaturesPage.tsx](../src/pages/CreaturesPage.tsx)     |
| `/about`       | [src/pages/AboutPage.tsx](../src/pages/AboutPage.tsx)             |
| `/methodology` | [src/pages/MethodologyPage.tsx](../src/pages/MethodologyPage.tsx) |
| `/credits`     | [src/pages/CreditsPage.tsx](../src/pages/CreditsPage.tsx)         |
| `*`            | [src/pages/NotFoundPage.tsx](../src/pages/NotFoundPage.tsx)       |

Navigation items live in [src/components/navigation/navItems.ts](../src/components/navigation/navItems.ts).

## 5. Core Data Manifests

| Manifest                                                                                     | Role                                                                                                                                            | Important consumers                                                                                                                                                                                                                                                                         |
| -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [src/data/eras.ts](../src/data/eras.ts)                                                      | `ERAS`, `CHAPTERS`, timeline order, chapter weights, MYA values.                                                                                | [src/utils/timeline.ts](../src/utils/timeline.ts), [src/components/experience/ChapterSection.tsx](../src/components/experience/ChapterSection.tsx), [src/hooks/useScrollController.ts](../src/hooks/useScrollController.ts)                                                                 |
| [src/data/creatures.ts](../src/data/creatures.ts)                                            | Creature facts, model paths, loader format, animation mode, camera presets, scientific status, enable flags.                                    | [src/experience/CreatureModel.tsx](../src/experience/CreatureModel.tsx), [src/data/credits.ts](../src/data/credits.ts), [src/pages/CreaturesPage.tsx](../src/pages/CreaturesPage.tsx), [src/components/creature](../src/components/creature)                                                |
| [src/data/backgrounds.ts](../src/data/backgrounds.ts)                                        | Background IDs, colors, fog, image paths, underwater flags, AI markers.                                                                         | [src/components/experience/BackgroundTransition.tsx](../src/components/experience/BackgroundTransition.tsx), [src/experience/EnvironmentController.tsx](../src/experience/EnvironmentController.tsx), [src/components/system/AiImageMarker.tsx](../src/components/system/AiImageMarker.tsx) |
| [src/data/credits.ts](../src/data/credits.ts)                                                | Model and asset credit derivation.                                                                                                              | [src/pages/CreditsPage.tsx](../src/pages/CreditsPage.tsx)                                                                                                                                                                                                                                   |
| [src/data/types.ts](../src/data/types.ts)                                                    | Zod schemas and TypeScript types for manifests.                                                                                                 | [src/data/creatures.ts](../src/data/creatures.ts), model and UI systems                                                                                                                                                                                                                     |
| [src/i18n/strings.ts](../src/i18n/strings.ts), [src/i18n/content.ts](../src/i18n/content.ts) | EN/DE UI labels and the German override layer for creatures/chapters/eras. English in the manifests stays the source of truth and the fallback. | every component, via `useTr()` in [src/i18n/index.ts](../src/i18n/index.ts)                                                                                                                                                                                                                 |

Treat these manifests as the source of truth for timeline, model, background, and credits behavior.

## 6. Experience Systems

| System                             | Files                                                                                                                                                                                                                                                                                                 |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Scroll driver                      | [src/hooks/useScrollController.ts](../src/hooks/useScrollController.ts), [src/utils/timeline.ts](../src/utils/timeline.ts)                                                                                                                                                                            |
| Lenis + native low-power scrolling | [src/hooks/useScrollController.ts](../src/hooks/useScrollController.ts), [src/styles/globals.css](../src/styles/globals.css)                                                                                                                                                                          |
| Timeline UI                        | [src/components/timeline/GeologicalTimeline.tsx](../src/components/timeline/GeologicalTimeline.tsx), [src/components/timeline/YearCounter.tsx](../src/components/timeline/YearCounter.tsx)                                                                                                            |
| Chapter DOM sections               | [src/components/experience/ChapterSection.tsx](../src/components/experience/ChapterSection.tsx), [src/components/experience/ScrollHint.tsx](../src/components/experience/ScrollHint.tsx)                                                                                                              |
| Background transitions             | [src/components/experience/BackgroundTransition.tsx](../src/components/experience/BackgroundTransition.tsx), [src/data/backgrounds.ts](../src/data/backgrounds.ts)                                                                                                                                    |
| Three.js canvas                    | [src/experience/ExperienceCanvas.tsx](../src/experience/ExperienceCanvas.tsx), [src/experience/TimelineScene.tsx](../src/experience/TimelineScene.tsx)                                                                                                                                                |
| Model loading                      | [src/experience/CreatureModel.tsx](../src/experience/CreatureModel.tsx), [src/experience/modelLoaders.ts](../src/experience/modelLoaders.ts), [src/utils/model.ts](../src/utils/model.ts), [src/utils/asset.ts](../src/utils/asset.ts)                                                                |
| Camera/environment                 | [src/experience/CameraController.tsx](../src/experience/CameraController.tsx), [src/experience/EnvironmentController.tsx](../src/experience/EnvironmentController.tsx)                                                                                                                                |
| Effects/particles                  | [src/experience/Effects.tsx](../src/experience/Effects.tsx), [src/experience/ParticleSystem.tsx](../src/experience/ParticleSystem.tsx)                                                                                                                                                                |
| Water transition                   | [src/components/experience/WaterlineTransition.tsx](../src/components/experience/WaterlineTransition.tsx), [src/utils/water.ts](../src/utils/water.ts)                                                                                                                                                |
| Quality/reduced motion             | [src/hooks/useDeviceQuality.ts](../src/hooks/useDeviceQuality.ts), [src/hooks/useReducedMotion.ts](../src/hooks/useReducedMotion.ts), [src/components/controls/QualitySelector.tsx](../src/components/controls/QualitySelector.tsx)                                                                   |
| Scientific status and methodology  | [src/components/creature/ScientificStatusBadge.tsx](../src/components/creature/ScientificStatusBadge.tsx), [src/pages/MethodologyPage.tsx](../src/pages/MethodologyPage.tsx)                                                                                                                          |
| Navigation                         | [src/components/navigation/MainNavigation.tsx](../src/components/navigation/MainNavigation.tsx), [src/components/navigation/MobileNavigation.tsx](../src/components/navigation/MobileNavigation.tsx), [src/components/navigation/CommandPalette.tsx](../src/components/navigation/CommandPalette.tsx) |

## 7. Assets

| Asset area                | Path                              | Notes                                                                                          |
| ------------------------- | --------------------------------- | ---------------------------------------------------------------------------------------------- |
| Runtime models            | [public/models](../public/models) | GLBs served by the app. Current runtime public models are GLB only.                            |
| Runtime background images | [public/Images](../public/Images) | WebP land and ocean backgrounds used by [src/data/backgrounds.ts](../src/data/backgrounds.ts). |
| Raw model downloads       | [Models](../Models)               | Raw, duplicate, or not-runtime-ready model files; do not enable without inspection/conversion. |
| Raw source images         | [Images](../Images)               | Source ocean PNGs; runtime images are WebP under `public/Images`.                              |
| Audio                     | [public/audio](../public/audio)   | Contains the credited one-shot T. rex StudioMod sound.                                         |
| Fonts                     | [package.json](../package.json)   | Fontsource variable packages self-host the display and sans-serif fonts under the OFL.         |

See [docs/ASSET_MAP.md](ASSET_MAP.md) for the detailed asset inventory, missing assets, duplicate assets, and license status.

## 8. Tests and Commands

Commands verified in [package.json](../package.json):

| Command                     | Purpose                     |
| --------------------------- | --------------------------- |
| `npm run dev`               | Start Vite dev server.      |
| `npm run build`             | Run `tsc -b && vite build`. |
| `npm run preview`           | Serve the production build. |
| `npm run lint`              | Run ESLint.                 |
| `npm run typecheck`         | Run `tsc -b --noEmit`.      |
| `npm run test` / `npm test` | Run Vitest.                 |

Test files:

- [src/utils/timeline.test.ts](../src/utils/timeline.test.ts)
- [src/utils/model.test.ts](../src/utils/model.test.ts)
- [src/utils/water.test.ts](../src/utils/water.test.ts)
- [src/i18n/i18n.test.ts](../src/i18n/i18n.test.ts)
- [src/data/creatures.test.ts](../src/data/creatures.test.ts)
- [src/data/credits.test.ts](../src/data/credits.test.ts)
- [src/store/experienceStore.test.ts](../src/store/experienceStore.test.ts)

Configuration files:

- [vite.config.ts](../vite.config.ts)
- [vitest.config.ts](../vitest.config.ts)
- [tsconfig.json](../tsconfig.json), [tsconfig.app.json](../tsconfig.app.json), [tsconfig.node.json](../tsconfig.node.json)
- [tailwind.config.ts](../tailwind.config.ts)
- [postcss.config.js](../postcss.config.js)
- [.eslintrc.cjs](../.eslintrc.cjs)
- [.prettierrc.json](../.prettierrc.json)

## 9. Important Coupling

- `CHAPTERS[].creatureId` in [src/data/eras.ts](../src/data/eras.ts) must match creature IDs in [src/data/creatures.ts](../src/data/creatures.ts).
- `backgroundId` values in chapters and creatures must match IDs in [src/data/backgrounds.ts](../src/data/backgrounds.ts).
- Creature `modelPath` values point under [public](../public), usually [public/models](../public/models).
- Creature `assetFormat` must be supported by [src/experience/CreatureModel.tsx](../src/experience/CreatureModel.tsx) and [src/experience/modelLoaders.ts](../src/experience/modelLoaders.ts).
- Timeline math in [src/utils/timeline.ts](../src/utils/timeline.ts) depends on chapter weights/order; run `npm test` after changing [src/data/eras.ts](../src/data/eras.ts).
- Water math in [src/utils/water.ts](../src/utils/water.ts) depends on aquatic creature `sceneType`; run `npm test` after changing underwater chapters.
- Credits are generated from [src/data/creatures.ts](../src/data/creatures.ts); update creature credit fields instead of editing rendered credit rows manually.
- Base-path-safe public URLs should use [src/utils/asset.ts](../src/utils/asset.ts) or `import.meta.env.BASE_URL` patterns already present in the codebase.

## 10. Search Hints

- Creature ID: `tyrannosaurus-rex`, `plesiosaurus`, `quetzalcoatlus`, `mosasaurus`.
- Background ID: `latest-cretaceous`, `devonian-ocean`, `late-cretaceous-ocean`.
- Timeline/chapter math: `CHAPTERS`, `CHAPTER_RANGES`, `progressForChapterId`, `myaAtProgress`.
- Scroll system: `Lenis`, `SCROLL_PROGRESS_EVENT`, `scrollRef`, `setActive`.
- Model system: `assetFormat`, `animationMode`, `useGLTF`, `NON_GLTF_LOADER`, `normaliseModel`.
- Water system: `submersionAt`, `HAS_AQUATIC`, `WaterlineTransition`.
- Scientific labels: `scientificStatus`, `ScientificStatusBadge`, `MethodologyPage`.
- Language: `useTr`, `CREATURE_DE`, `CHAPTER_DE`, `ERA_DE`, `LanguageToggle`, `toggleLang`.

## 11. Generated or Avoided Files

Do not edit manually:

- [dist](../dist)
- [node_modules](../node_modules)
- `*.tsbuildinfo`
- `.codex-vite.log` and `.codex-vite.err.log` unless diagnosing local server output

Do not create duplicate repository maps. This file, [docs/PROJECT_MAP.md](PROJECT_MAP.md), is the authoritative project map.
