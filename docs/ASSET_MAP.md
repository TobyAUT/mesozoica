# 3D Models

Last updated: 2026-07-14 00:07 +02:00

> UPDATE 2026-07-15 (Claude): every runtime GLB was recompressed to WebP textures via
> [scripts/optimize-glb.mjs](../scripts/optimize-glb.mjs) — **total public/models ~555 MB → ~111 MB
> (−80%)** with no geometry/animation change (e.g. carnotaurus 98.59→15.9, tyrannosaurus 50.95→3.9,
> stegosaurus→3.1, mosasaurus 50.43→7.0, triceratops 45.02→1.7 MB). The "File size" column below is
> the pre-optimization value; re-run `node scripts/optimize-glb.mjs` after adding new models. WebP is
> decoded natively (`EXT_texture_webp`), so no runtime decoder was added.

> UPDATE 2026-07-14 (Claude): 17 more runtime GLBs were added under [public/models](../public/models) (Lystrosaurus, Herrerasaurus, Plateosaurus, Dilophosaurus, Cryolophosaurus, Pistosaur, Cetiosaurus, Megalosaurus, Huayangosaurus, Allosaurus, Stegosaurus, Diplodocus, Baryonyx, Iguanodon, Argentinosaurus, Ankylosaurus, plus `spinosaurus-animated.glb`). Each has full verified credits (author + `license` + new `licenseUrl` + `sourceUrl`, rendered clickable on the Credits page). The table below predates them; see [PROGRESS.md](../PROGRESS.md) "Latest Session" and [src/data/creatures.ts](../src/data/creatures.ts).

Runtime models live in [public/models](../public/models). Raw/downloaded or duplicate source assets live in [Models](../Models). The active manifest now contains only model-backed creature entries.

| Creature ID | Source title | Display name | Local file | Loader | File size | Animation clips | Selected animation | Scale | Rotation | Timeline chapter | License status | Notes |
|---|---|---|---|---|---:|---|---|---:|---|---|---|---|
| alexornis | Walking With Dinosaurs 3D - Alex | Alex (Alexornis) | [public/models/alex-alexornis.glb](../public/models/alex-alexornis.glb) | `useGLTF` | 2.68 MB | `alex\|p_keepaway\|Base Layer` | `alex\|p_keepaway\|Base Layer`, 7s replay pause | 1.15 | `[0,-0.5,0]` | `alexornis` | TODO_VERIFY | Rigged/skinned GLB. |
| carnotaurus | CARNOTAURUS DINOSAUR | Carnotaurus | [public/models/carnotaurus.glb](../public/models/carnotaurus.glb) | `useGLTF` | 98.59 MB | none | null | 1.12 | `[0,-0.6,0]` | `carnotaurus` | TODO_VERIFY | Very large; compression recommended. |
| velociraptor-like | Dinosaur | Velociraptor-like Dromaeosaur | [public/models/dinosaur-velociraptor-like.glb](../public/models/dinosaur-velociraptor-like.glb) | `useGLTF` | 6.44 MB | none | null | 1 | `[0,2.44,0]` | `velociraptor-like` | TODO_VERIFY | Identity intentionally uncertain. |
| dunkleosteus | Dunkleosteus | Dunkleosteus | [public/models/dunkleosteus.glb](../public/models/dunkleosteus.glb) | `useGLTF` | 3.39 MB | none | null | 0.9 | `[0,-0.35,0]` | `dunkleosteus` | CC BY-NC 4.0, hendrikReyneke | Position `[0,1.2,0.25]`; supplied attribution stored. |
| mosasaurus | Mosasaurus Hoffmannii | Mosasaurus | [public/models/mosasaurus.glb](../public/models/mosasaurus.glb) | `useGLTF` | 50.43 MB | none | null | 1.3 | `[0,-0.18,-0.5]` | `marine` | TODO_VERIFY | Position `[-1.6,-2.5,0.35]`; copied from [Models/Moser.glb](../Models/Moser.glb). |
| plesiosaurus | PLESIOSAURUS DINOSAUR STATUE THEME PARK JURASSIC MUSEUM PROP free low-poly 3d model | Plesiosaurus | [public/models/plesiosaurus.glb](../public/models/plesiosaurus.glb) | `useGLTF` | 13.19 MB | none | null | 0.45 | `[0,-0.6,0]` | `plesiosaurus` | TODO_VERIFY | Position `[0,1.3,0.65]`; procedural whole-object movement. |
| quetzalcoatlus | Quetzalcoatlus (quetzal_animated.glb) | Quetzalcoatlus | [public/models/quetzalcoatlus.glb](../public/models/quetzalcoatlus.glb) | `useGLTF` | 1.53 MB | `Animation` | `Animation` | 0.32 | `[-0.2,0,0]` | `quetzalcoatlus` | TODO_VERIFY | Runtime model replaced from [Models/quetzal_animated.glb](../Models/quetzal_animated.glb); old raw/runtime Quetzal files moved to Recycle Bin. |
| spinosaurus | Spinosaurus \| Spino Dinosaur | Spinosaurus | [public/models/spinosaurus.glb](../public/models/spinosaurus.glb) | `useGLTF` | 16.81 MB | none | null | 1.25 | `[0,-0.15,0]` | `spinosaurus` | TODO_VERIFY | Static GLB; larger/front-facing framing. |
| triceratops | Triceratops dinosaur | Triceratops | [public/models/triceratops.glb](../public/models/triceratops.glb) | `useGLTF` | 45.02 MB | none | null | 1.12 | `[0,-0.55,0]` | `triceratops` | TODO_VERIFY | Static GLB despite manifest `native`. |
| tylosaurus | Cartoon Tylosaurus free 3D model | Tylosaurus | [public/models/tylosaurus.glb](../public/models/tylosaurus.glb) | `useGLTF` | 0.24 MB | none | null | 0.44 | `[0,-0.22,0]` | `tylosaurus` | TODO_VERIFY | Position `[0,1.25,0.35]`; GLB reports no embedded image textures. |
| tyrannosaurus-rex | Tyrannosaurus Rex (Male version) | Tyrannosaurus rex | [public/models/tyrannosaurus-rex-male.glb](../public/models/tyrannosaurus-rex-male.glb) | `useGLTF` | 50.95 MB | none | null | 1.2 | `[0,-0.6,0]` | `tyrannosaurus-rex` | TODO_VERIFY | Facts panel exposes a one-shot StudioMod sound button. |

Schema-supported formats in [src/data/types.ts](../src/data/types.ts): GLB, glTF, FBX, OBJ, MTL-adjacent OBJ metadata, STL, PLY. Current active runtime models are GLB only.

# Background Images

| Background ID | Local file | Resolution | Format | Geological period/scene | Linked chapters | Underwater/terrestrial |
|---|---|---|---|---|---|---|
| prologue | [public/Images/01-prologue.webp](../public/Images/01-prologue.webp) | 1672x941 | WebP | Prologue/finale | `prologue`, `finale` | terrestrial |
| late-triassic | [public/Images/02-late-triassic.webp](../public/Images/02-late-triassic.webp) | 1672x941 | WebP | Triassic | `era-triassic` | terrestrial |
| early-jurassic | [public/Images/03-early-jurassic.webp](../public/Images/03-early-jurassic.webp) | 1672x941 | WebP | Early Jurassic intro | `era-jurassic` | terrestrial |
| middle-jurassic | [public/Images/04-middle-jurassic.webp](../public/Images/04-middle-jurassic.webp) | 1672x941 | WebP | Middle Jurassic | `middle-jurassic` | terrestrial |
| early-cretaceous | [public/Images/06-early-cretaceous.webp](../public/Images/06-early-cretaceous.webp) | 1672x941 | WebP | Early Cretaceous intro | `era-cretaceous` | terrestrial |
| late-cretaceous-delta | [public/Images/07-early-late-cretaceous.webp](../public/Images/07-early-late-cretaceous.webp) | 1672x941 | WebP | Late Cretaceous delta | `spinosaurus` | terrestrial |
| late-cretaceous-coast | [public/Images/08-middle-late-cretaceous.webp](../public/Images/08-middle-late-cretaceous.webp) | 1672x941 | WebP | Late Cretaceous coast | `carnotaurus`, `velociraptor-like`, `alexornis` | terrestrial/aerial coast |
| latest-cretaceous | [public/Images/09-latest-cretaceous.webp](../public/Images/09-latest-cretaceous.webp) | 1672x941 | WebP | Latest Cretaceous | `quetzalcoatlus`, `triceratops`, `tyrannosaurus-rex` | terrestrial/aerial coast |
| extinction | [public/Images/10-extinction.webp](../public/Images/10-extinction.webp) | 1672x941 | WebP | Extinction | `extinction` | terrestrial |
| devonian-ocean | [public/Images/devonian-ocean.webp](../public/Images/devonian-ocean.webp) | 2560x1440 | WebP | Devonian ocean | `before-dinosaurs`, `dunkleosteus` | underwater |
| early-jurassic-ocean | [public/Images/early-jurassic-ocean.webp](../public/Images/early-jurassic-ocean.webp) | 2560x1440 | WebP | Early Jurassic ocean | `plesiosaurus` | underwater |
| late-cretaceous-ocean | [public/Images/late-cretaceous-ocean.webp](../public/Images/late-cretaceous-ocean.webp) | 2560x1440 | WebP | Late Cretaceous ocean | `tylosaurus` | underwater |
| late-cretaceous-ocean-mosasaurus | [public/Images/late-cretaceous-ocean-mosasaurus.webp](../public/Images/late-cretaceous-ocean-mosasaurus.webp) | 2560x1440 | WebP | Late Cretaceous ocean | `marine` / `mosasaurus` | underwater |

# Chapter Videos

Scroll-scrubbed chapter videos live in [public/videos](../public/videos). The runtime uses the
`-scrub.mp4` variants; the three original MP4s remain alongside them as reversible source/fallback
files and are not referenced by the app.

| Chapter | Runtime file | Size | Format | Scrub structure | Original fallback |
|---|---|---:|---|---|---|
| Extinction desktop/tablet | `meteor-impact-scrub.mp4` | 5.82 MB | H.264 High 3.1, yuv420p, 1280x720, 24 fps | fast-start, 16 keyframes, 0.5 s GOP, no B-frames/audio | `meteor-impact.mp4` |
| Extinction phone | `meteor-impact-portrait-scrub.mp4` | 6.00 MB | H.264 High 3.1, yuv420p, 720x1280, 24 fps | fast-start, 16 keyframes, 0.5 s GOP, no B-frames/audio | `meteor-impact-portrait.mp4` |
| Finale | `birds-scrub.mp4` | 4.32 MB | H.264 High 3.1, yuv420p, 720x1280, 24 fps | fast-start, 16 keyframes, 0.5 s GOP, no B-frames/audio | `birds.mp4` |

The originals each contain only one keyframe and place `moov` after `mdat`, which makes frequent
paused random seeks expensive on mobile decoders. Runtime selection is in
[src/pages/HomePage.tsx](../src/pages/HomePage.tsx); decoder priming and queued seeking are in
[src/components/experience/ChapterVideo.tsx](../src/components/experience/ChapterVideo.tsx).

# Audio Assets

[public/audio/tyrannosaurus-rex-studiomod.mp3](../public/audio/tyrannosaurus-rex-studiomod.mp3) is a one-shot T. rex sound exposed by the facts panel. Creator credit: StudioMod. Looping era ambience files expected by [src/components/controls/AudioManager.tsx](../src/components/controls/AudioManager.tsx) are still absent.

# Credits and Licenses

Credits are generated in [src/data/credits.ts](../src/data/credits.ts) from [src/data/creatures.ts](../src/data/creatures.ts). A model credit is resolved only when both `author` and `license` are set. Most model licenses are TODO_VERIFY.

# Unused or Duplicate Assets

Do not permanently delete while documenting. Move to Trash/Recycle Bin only after verification.

| Status | Asset(s) | Reason |
|---|---|---|
| unused runtime GLBs | [public/models/generic-pterosaur.glb](../public/models/generic-pterosaur.glb), [public/models/stylized-indoraptor.glb](../public/models/stylized-indoraptor.glb) | No longer referenced by active creature or chapter manifests; retained for manual review. |
| duplicate raw GLBs | [Models/carnotaurus_dinosaur.glb](../Models/carnotaurus_dinosaur.glb), [Models/dinosaur.glb](../Models/dinosaur.glb), [Models/Plesio.glb](../Models/Plesio.glb), [Models/raptor_dinosaur_indoraptor.glb](../Models/raptor_dinosaur_indoraptor.glb), [Models/Spino.glb](../Models/Spino.glb), [Models/triceratops_dinosaur.glb](../Models/triceratops_dinosaur.glb), [Models/TylosaurusNoAnimation.glb](../Models/TylosaurusNoAnimation.glb), [Models/tyrant_king_-_tyrannosaurus.glb](../Models/tyrant_king_-_tyrannosaurus.glb), [Models/walking_with_dinosaurs_3d_alex.glb](../Models/walking_with_dinosaurs_3d_alex.glb) | Public runtime copies exist under [public/models](../public/models). |
| runtime source retained | [Models/Moser.glb](../Models/Moser.glb), [Models/dunkleosteus.glb](../Models/dunkleosteus.glb), [Models/quetzal_animated.glb](../Models/quetzal_animated.glb) | Source copies for the current Mosasaurus, Dunkleosteus, and animated Quetzalcoatlus runtime models. |
| likely unused | [public/backgrounds/wasteland.png](../public/backgrounds/wasteland.png) | Current background manifest points to [public/Images/01-prologue.webp](../public/Images/01-prologue.webp) and [public/Images/10-extinction.webp](../public/Images/10-extinction.webp), not this PNG. |
| needs verification | [Models/uploads_files_3154100_model.obj](../Models/uploads_files_3154100_model.obj), [Models/uploads_files_6902129_obj.rar](../Models/uploads_files_6902129_obj.rar), [Models/uploads_files_7092023_Dino2.stl](../Models/uploads_files_7092023_Dino2.stl), [Models/uploads_files_5717658_Dilophosaurus+rig+.blend](../Models/uploads_files_5717658_Dilophosaurus+rig+.blend) | Raw OBJ/RAR/STL/Blend assets are not wired into the active manifest. |
| retained source ZIP | [Models/animated-flying-pteradactal-dinosaur-loop.zip](../Models/animated-flying-pteradactal-dinosaur-loop.zip) | Its contents previously matched the now-unused generic pterosaur runtime copy. |
| moved to Recycle Bin | `Models/Quetzal.glb`, old `public/models/quetzalcoatlus.glb`, `uploads_files_3517731_Renders.zip`, `uploads_files_5129003_Velociraptor_looking_body+_Supported.zip`, `uploads_files_5216512_concavenator-chasing-1-35-scale-pre-supported-dinosaur-free-model.zip` | Replaced by `quetzal_animated.glb`, or not referenced by runtime code/public assets. |
