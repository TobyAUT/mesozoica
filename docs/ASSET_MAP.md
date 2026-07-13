# 3D Models

Last updated: 2026-07-13 20:31 +02:00

Runtime models live in [public/models](../public/models). Raw/downloaded or duplicate source assets live in [Models](../Models). File sizes below are from the current filesystem.

| Creature ID | Source title | Display name | Local file | Format | Loader | File size | Animation clips | Selected animation | Scale | Rotation | Enabled | Timeline chapter | License status | Notes |
|---|---|---|---|---|---|---:|---|---|---:|---|---|---|---|---|
| alexornis | Walking With Dinosaurs 3D - Alex | Alex (Alexornis) | [public/models/alex-alexornis.glb](../public/models/alex-alexornis.glb) | GLB | `useGLTF` | 2.68 MB | `alex\|p_keepaway\|Base Layer` | `alex\|p_keepaway\|Base Layer` | 1 | `[0,-0.5,0]` | yes | `alexornis` | TODO_VERIFY | Rigged/skinned GLB. |
| carnotaurus | CARNOTAURUS DINOSAUR | Carnotaurus | [public/models/carnotaurus.glb](../public/models/carnotaurus.glb) | GLB | `useGLTF` | 98.59 MB | none | null | 1 | `[0,-0.6,0]` | yes | `carnotaurus` | TODO_VERIFY | Very large; compression recommended. |
| velociraptor-like | Dinosaur | Velociraptor-like Dromaeosaur | [public/models/dinosaur-velociraptor-like.glb](../public/models/dinosaur-velociraptor-like.glb) | GLB | `useGLTF` | 6.44 MB | none | null | 1 | `[0,2.44,0]` | yes | `velociraptor-like` | TODO_VERIFY | Identity intentionally uncertain. |
| generic-pterosaur | Animated Flying Pteradactyl (loop) | Pterosaur (flying reptile) | [public/models/generic-pterosaur.glb](../public/models/generic-pterosaur.glb) | GLB | `useGLTF` if enabled | 23.62 MB | `PixCap Animation` | null | 1 | `[0,-0.4,0]` | no | `generic-pterosaur` | TODO_VERIFY | Confirmed file exists; prior notes say broken/disassembled skin in Three.js. |
| plesiosaurus | TODO_VERIFY downloaded GLB title in manifest | Plesiosaurus | [public/models/plesiosaurus.glb](../public/models/plesiosaurus.glb) | GLB | `useGLTF` | 13.19 MB | none | null | 0.32 | `[0,-0.6,0]` | yes | `plesiosaurus` | TODO_VERIFY | Blender GLB, no rig; procedural whole-object movement. |
| quetzalcoatlus | Quetzalcoatlus (Quetzal.glb) | Quetzalcoatlus | [public/models/quetzalcoatlus.glb](../public/models/quetzalcoatlus.glb) | GLB | `useGLTF` | 1.57 MB | none | null | 0.62 | `[0,-0.5,0]` | yes | `quetzalcoatlus` | TODO_VERIFY | Blender GLB, no rig; procedural whole-object movement. |
| spinosaurus | Spinosaurus \| Spino Dinosaur | Spinosaurus | [public/models/spinosaurus.glb](../public/models/spinosaurus.glb) | GLB | `useGLTF` | 16.81 MB | none | null | 0.9 | `[0,-0.6,0]` | yes | `spinosaurus` | TODO_VERIFY | Blender GLB, no rig; manifest says static. |
| stylized-indoraptor | Raptor Dinosaur (Indoraptor) | Stylized "Indoraptor" | [public/models/stylized-indoraptor.glb](../public/models/stylized-indoraptor.glb) | GLB | `useGLTF` if enabled | 5.48 MB | `Armature\|eat`, `Armature\|idle`, `Armature\|roar` | null | 1 | `[0,-0.7,0]` | no | `stylized-indoraptor` | TODO_VERIFY | Prior notes say broken/disassembled skin in Three.js. |
| triceratops | Triceratops dinosaur | Triceratops | [public/models/triceratops.glb](../public/models/triceratops.glb) | GLB | `useGLTF` | 45.02 MB | none | null | 1 | `[0,-0.55,0]` | yes | `triceratops` | TODO_VERIFY | Static GLB despite manifest `native`. |
| tylosaurus | Cartoon Tylosaurus free 3D model | Tylosaurus | [public/models/tylosaurus.glb](../public/models/tylosaurus.glb) | GLB | `useGLTF` | 0.24 MB | none | null | 0.28 | `[0,-0.7,0]` | yes | `tylosaurus` | TODO_VERIFY | Blender GLB, no textures embedded, material colors only. |
| tyrannosaurus-rex | Tyrannosaurus Rex (Male version) | Tyrannosaurus rex | [public/models/tyrannosaurus-rex-male.glb](../public/models/tyrannosaurus-rex-male.glb) | GLB | `useGLTF` | 50.95 MB | none | null | 1 | `[0,-0.6,0]` | yes | `tyrannosaurus-rex` | TODO_VERIFY | Primary T. rex. |
| concavenator | Concavenator chasing... | Concavenator | none in `public/models` | STL in manifest | `STLLoader` if enabled | n/a | none expected | null | 1 | `[0,-0.5,0]` | no | `concavenator` | TODO_VERIFY | Raw ZIP exists under [Models](../Models); not runtime-ready. |
| dilophosaurus | Dilophosaurus RIG free 3D model | Dilophosaurus | none in `public/models` | GLB in manifest, TODO_VERIFY | `useGLTF` if enabled | n/a | unknown | null | 1 | `[0,-0.5,0]` | no | `dilophosaurus` | TODO_VERIFY | Raw `.blend` exists; browser cannot load Blender files directly. |
| dunkleosteus | Dunkleosteus fish free 3D model | Dunkleosteus | none | GLB in manifest | `useGLTF` if enabled | n/a | unknown | null | 1 | `[0,-0.5,0]` | no | `dunkleosteus` | TODO_VERIFY | No local model path. |
| mosasaurus | Mosasaurus Hoffmannii | Mosasaurus | none | GLB default | `useGLTF` if enabled | n/a | unknown | null | 1 | `[0,-0.5,0]` | no | `marine` | TODO_VERIFY | Primary underwater Mosasaurus entry is pending. |
| mosasaurus-alt | Mosasaurus free 3D model | Mosasaurus (alternate model) | none | GLB | `useGLTF` if enabled | n/a | unknown | null | 1 | `[0,-0.5,0]` | no | not in `CHAPTERS` | TODO_VERIFY | Alternate model entry only. |

Schema-supported formats in [src/data/types.ts](../src/data/types.ts): GLB, glTF, FBX, OBJ, MTL-adjacent OBJ metadata, STL, PLY. Current runtime public models are GLB only.

# Background Images

| Background ID | Local file | Resolution | Format | Geological period/scene | Linked creatures/chapters | Underwater/terrestrial | Loading status |
|---|---|---|---|---|---|---|---|
| prologue | [public/Images/01-prologue.webp](../public/Images/01-prologue.webp) | 1672x941 | WebP | Prologue/finale | `prologue`, `finale` | terrestrial | present |
| late-triassic | [public/Images/02-late-triassic.webp](../public/Images/02-late-triassic.webp) | 1672x941 | WebP | Triassic | `era-triassic` | terrestrial | present |
| early-jurassic | [public/Images/03-early-jurassic.webp](../public/Images/03-early-jurassic.webp) | 1672x941 | WebP | Early Jurassic | `era-jurassic`, `dilophosaurus`, `stylized-indoraptor` | terrestrial | present |
| middle-jurassic | [public/Images/04-middle-jurassic.webp](../public/Images/04-middle-jurassic.webp) | 1672x941 | WebP | Middle Jurassic | `middle-jurassic` | terrestrial | present |
| late-jurassic | [public/Images/05-late-jurassic.webp](../public/Images/05-late-jurassic.webp) | 1672x941 | WebP | Late Jurassic | `generic-sauropod`, `morrison-dinosaurs` | terrestrial | present |
| early-cretaceous | [public/Images/06-early-cretaceous.webp](../public/Images/06-early-cretaceous.webp) | 1672x941 | WebP | Early Cretaceous | `era-cretaceous`, `concavenator`, `generic-pterosaur` | terrestrial | present |
| late-cretaceous-delta | [public/Images/07-early-late-cretaceous.webp](../public/Images/07-early-late-cretaceous.webp) | 1672x941 | WebP | Late Cretaceous delta | `spinosaurus` | terrestrial | present |
| late-cretaceous-coast | [public/Images/08-middle-late-cretaceous.webp](../public/Images/08-middle-late-cretaceous.webp) | 1672x941 | WebP | Late Cretaceous coast | `carnotaurus`, `velociraptor-like`, `alexornis` | terrestrial/aerial coast | present |
| latest-cretaceous | [public/Images/09-latest-cretaceous.webp](../public/Images/09-latest-cretaceous.webp) | 1672x941 | WebP | Latest Cretaceous | `feathered-dromaeosaur`, `olorotitan`, `quetzalcoatlus`, `triceratops`, `tyrannosaurus-rex` | terrestrial/aerial coast | present |
| extinction | [public/Images/10-extinction.webp](../public/Images/10-extinction.webp) | 1672x941 | WebP | Extinction | `extinction` | terrestrial | present |
| devonian-ocean | [public/Images/devonian-ocean.webp](../public/Images/devonian-ocean.webp) | 2560x1440 | WebP | Devonian ocean | `before-dinosaurs`, `dunkleosteus` | underwater | present |
| early-jurassic-ocean | [public/Images/early-jurassic-ocean.webp](../public/Images/early-jurassic-ocean.webp) | 2560x1440 | WebP | Early Jurassic ocean | `plesiosaurus` | underwater | present |
| late-cretaceous-ocean | [public/Images/late-cretaceous-ocean.webp](../public/Images/late-cretaceous-ocean.webp) | 2560x1440 | WebP | Late Cretaceous ocean | `tylosaurus` | underwater | present |
| late-cretaceous-ocean-mosasaurus | [public/Images/late-cretaceous-ocean-mosasaurus.webp](../public/Images/late-cretaceous-ocean-mosasaurus.webp) | 2560x1440 | WebP | Late Cretaceous ocean | `marine` / `mosasaurus` | underwater | present |

# Audio Assets

No audio files were found under [public](../public). [src/components/controls/AudioManager.tsx](../src/components/controls/AudioManager.tsx) expects era ambience paths under `/audio/` when assets are added.

# Fonts

No local font files were found outside dependencies. The project uses CSS/system stacks in [src/styles/globals.css](../src/styles/globals.css).

# Credits and Licenses

Credits are generated in [src/data/credits.ts](../src/data/credits.ts) from [src/data/creatures.ts](../src/data/creatures.ts). A model credit is resolved only when both `author` and `license` are set. Most model licenses are TODO_VERIFY.

# Missing Assets

These manifest entries have no runtime local model path: `generic-sauropod`, `morrison-dinosaurs`, `protoceratops`, `styracosaurus`, `saichania`, `stegoceras`, `tupuxuara`, `tyrannosaurus-rex-alternate`, `mosasaurus`, `stylized-crested-theropod`, `dunkleosteus`, `dilophosaurus`, `concavenator`, `mosasaurus-alt`, `feathered-dromaeosaur`, `olorotitan`.

# Unused or Duplicate Assets

Do not delete while documenting. Move to Trash/Recycle Bin only after verification.

| Status | Asset(s) | Reason |
|---|---|---|
| confirmed duplicate | [Models/carnotaurus_dinosaur.glb](../Models/carnotaurus_dinosaur.glb), [Models/dinosaur.glb](../Models/dinosaur.glb), [Models/Plesio.glb](../Models/Plesio.glb), [Models/Quetzal.glb](../Models/Quetzal.glb), [Models/raptor_dinosaur_indoraptor.glb](../Models/raptor_dinosaur_indoraptor.glb), [Models/Spino.glb](../Models/Spino.glb), [Models/triceratops_dinosaur.glb](../Models/triceratops_dinosaur.glb), [Models/TylosaurusNoAnimation.glb](../Models/TylosaurusNoAnimation.glb), [Models/tyrant_king_-_tyrannosaurus.glb](../Models/tyrant_king_-_tyrannosaurus.glb), [Models/walking_with_dinosaurs_3d_alex.glb](../Models/walking_with_dinosaurs_3d_alex.glb) | Public runtime copies exist under [public/models](../public/models). |
| likely unused | [public/backgrounds/wasteland.png](../public/backgrounds/wasteland.png) | Current background manifest points to [public/Images/01-prologue.webp](../public/Images/01-prologue.webp) and [public/Images/10-extinction.webp](../public/Images/10-extinction.webp), not this PNG. |
| needs verification | [Models/uploads_files_3154100_model.obj](../Models/uploads_files_3154100_model.obj), [Models/uploads_files_6902129_obj.rar](../Models/uploads_files_6902129_obj.rar) | Raw OBJ/RAR assets not wired into manifest. |
| needs verification | ZIP and `.blend`/STL assets in [Models](../Models) | Raw downloads may be source material for pending entries; inspect/convert before runtime use. |
