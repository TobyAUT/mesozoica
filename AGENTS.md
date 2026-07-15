# Project Overview

Last updated: 2026-07-13 20:31 +02:00

Mesozoica is an interactive prehistoric timeline website. It uses React, Vite, TypeScript, Lenis/native scrolling, Zustand state, and React Three Fiber to present fixed 3D creature scenes while the user scrolls from pre-dinosaur Devonian seas toward the end-Cretaceous extinction.

# Read First

Before broad repository exploration, read project documentation in this order:

1. [PROGRESS.md](PROGRESS.md)
2. [docs/PROJECT_MAP.md](docs/PROJECT_MAP.md)
3. [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
4. [docs/ASSET_MAP.md](docs/ASSET_MAP.md)
5. [docs/TIMELINE_MAP.md](docs/TIMELINE_MAP.md)

# Important Entry Points

- Application entry: [src/main.tsx](src/main.tsx)
- Routes: [src/app/App.tsx](src/app/App.tsx)
- Main timeline page: [src/pages/HomePage.tsx](src/pages/HomePage.tsx)
- Three.js canvas: [src/experience/ExperienceCanvas.tsx](src/experience/ExperienceCanvas.tsx)
- Scroll orchestration: [src/hooks/useScrollController.ts](src/hooks/useScrollController.ts)
- Global state: [src/store/experienceStore.ts](src/store/experienceStore.ts), [src/store/scrollRef.ts](src/store/scrollRef.ts)
- Creature manifest: [src/data/creatures.ts](src/data/creatures.ts)
- Era and chapter manifest: [src/data/eras.ts](src/data/eras.ts)
- Background manifest: [src/data/backgrounds.ts](src/data/backgrounds.ts)
- Credits: [src/data/credits.ts](src/data/credits.ts), [src/pages/CreditsPage.tsx](src/pages/CreditsPage.tsx)
- Water transition: [src/components/experience/WaterlineTransition.tsx](src/components/experience/WaterlineTransition.tsx), [src/utils/water.ts](src/utils/water.ts)
- Model loader: [src/experience/modelLoaders.ts](src/experience/modelLoaders.ts), [src/experience/CreatureModel.tsx](src/experience/CreatureModel.tsx)
- Tests: [src/utils/model.test.ts](src/utils/model.test.ts), [src/utils/timeline.test.ts](src/utils/timeline.test.ts), [src/utils/water.test.ts](src/utils/water.test.ts), [vitest.config.ts](vitest.config.ts)

# Working Rules

- Inspect existing code before rewriting.
- Use targeted search before recursively scanning large folders.
- Preserve existing architecture unless a refactor is necessary.
- Do not invent scientific data or licenses.
- Do not permanently delete assets; move unused files to Trash/Recycle Bin.
- Update documentation when architecture, assets, models, or timeline data change.
- Update [PROGRESS.md](PROGRESS.md) before context becomes low.
- Run type checking and production build after meaningful changes.

# Commands

Commands verified in [package.json](package.json):

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm test`
