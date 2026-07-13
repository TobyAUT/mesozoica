# Timeline Direction

Last updated: 2026-07-14 00:07 +02:00

> UPDATE 2026-07-14 (Claude): the timeline was expanded from 19 to **36 chapters** — 16 new creatures added across the Triassic → Latest Cretaceous plus a new **Late Jurassic** time-slice, and Spinosaurus upgraded to an animated model. The tables below reflect the earlier 19-chapter state; see [PROGRESS.md](../PROGRESS.md) "Latest Session" for the current chapter list and [src/data/eras.ts](../src/data/eras.ts) for the authoritative order.

Scrolling moves from older to younger. MYA values generally decrease from 400 Mya toward 66 Mya, though some late Cretaceous chapter ordering is thematic and not strictly monotonic.

# Era and Background Order

The timeline currently contains 19 chapters. Creature chapters reference only live model-backed IDs from [src/data/creatures.ts](../src/data/creatures.ts).

| Order | Chapter ID | Period/section | Age | Background ID | Creature | Scene type |
|---:|---|---|---:|---|---|---|
| 1 | `prologue` | Mesozoica hero | 400 | `prologue` | none | terrestrial |
| 2 | `before-dinosaurs` | Devonian / Before the Dinosaurs | 395 | `devonian-ocean` | none | underwater intro |
| 3 | `dunkleosteus` | Devonian | 372 | `devonian-ocean` | `dunkleosteus` | underwater |
| 4 | `era-triassic` | Triassic | 235 | `late-triassic` | none | terrestrial |
| 5 | `era-jurassic` | Early Jurassic intro | 195 | `early-jurassic` | none | terrestrial |
| 6 | `plesiosaurus` | Early Jurassic | 190 | `early-jurassic-ocean` | `plesiosaurus` | underwater |
| 7 | `middle-jurassic` | Middle Jurassic | 169 | `middle-jurassic` | none | terrestrial |
| 8 | `era-cretaceous` | Early Cretaceous intro | 129 | `early-cretaceous` | none | terrestrial |
| 9 | `spinosaurus` | Late Cretaceous | 96 | `late-cretaceous-delta` | `spinosaurus` | terrestrial/river delta |
| 10 | `tylosaurus` | Late Cretaceous | 82 | `late-cretaceous-ocean` | `tylosaurus` | underwater |
| 11 | `carnotaurus` | Late Cretaceous | 71 | `late-cretaceous-coast` | `carnotaurus` | terrestrial |
| 12 | `velociraptor-like` | Latest Cretaceous themed | 73 | `late-cretaceous-coast` | `velociraptor-like` | terrestrial/uncertain |
| 13 | `alexornis` | Late Cretaceous | 75 | `late-cretaceous-coast` | `alexornis` | terrestrial/aerial bird |
| 14 | `quetzalcoatlus` | Latest Cretaceous | 68 | `latest-cretaceous` | `quetzalcoatlus` | aerial/coastal |
| 15 | `triceratops` | Latest Cretaceous | 67 | `latest-cretaceous` | `triceratops` | terrestrial |
| 16 | `tyrannosaurus-rex` | Latest Cretaceous | 66.5 | `latest-cretaceous` | `tyrannosaurus-rex` | terrestrial |
| 17 | `marine` | Latest/Late Cretaceous ocean | 68 | `late-cretaceous-ocean-mosasaurus` | `mosasaurus` | underwater |
| 18 | `extinction` | Extinction | 66 | `extinction` | none | terrestrial/impact |
| 19 | `finale` | Finale | 66 | `prologue` | none | terrestrial |

# Creature Timeline

| Creature | Scientific name | Classification | Approximate range | Continent | Model ID/path | Background ID | Scientific certainty |
|---|---|---|---|---|---|---|---|
| Dunkleosteus | Dunkleosteus | fish; not a dinosaur | 382-358 Mya | Global Devonian seas | `dunkleosteus` / `/models/dunkleosteus.glb` | `devonian-ocean` | verified species, body details TODO_VERIFY |
| Plesiosaurus | Plesiosaurus | marine reptile; not a dinosaur | 199-175 Mya | Europe | `plesiosaurus` / `/models/plesiosaurus.glb` | `early-jurassic-ocean` | nonDinosaur |
| Spinosaurus | Spinosaurus | dinosaur, theropod | 99-93 Mya | Africa (North Africa) | `spinosaurus` / `/models/spinosaurus.glb` | `late-cretaceous-delta` | verified |
| Tylosaurus | Tylosaurus | marine reptile; not a dinosaur | 86-78 Mya | North America | `tylosaurus` / `/models/tylosaurus.glb` | `late-cretaceous-ocean` | nonDinosaur |
| Carnotaurus | Carnotaurus sastrei | dinosaur, theropod | 72-70 Mya | South America (Argentina) | `carnotaurus` / `/models/carnotaurus.glb` | `late-cretaceous-coast` | verified species; mesh accuracy TODO_VERIFY |
| Velociraptor-like Dromaeosaur | Uncertain dromaeosaurid | dinosaur, theropod | 75-71 Mya | Uncertain | `velociraptor-like` / `/models/dinosaur-velociraptor-like.glb` | `late-cretaceous-coast` | uncertain model identity |
| Alex (Alexornis) | Alexornis | prehistoric bird/avialan | 84-71 Mya | North America (Mexico) | `alexornis` / `/models/alex-alexornis.glb` | `late-cretaceous-coast` | verified taxon label; film-character model |
| Quetzalcoatlus | Quetzalcoatlus northropi | pterosaur; not a dinosaur | 68-66 Mya | North America | `quetzalcoatlus` / `/models/quetzalcoatlus.glb` | `latest-cretaceous` | verified |
| Triceratops | Triceratops | dinosaur, ceratopsian | 68-66 Mya | North America | `triceratops` / `/models/triceratops.glb` | `latest-cretaceous` | verified |
| Tyrannosaurus rex | Tyrannosaurus rex | dinosaur, theropod | 68-66 Mya | North America | `tyrannosaurus-rex` / `/models/tyrannosaurus-rex-male.glb` | `latest-cretaceous` | verified |
| Mosasaurus | Mosasaurus hoffmannii | marine reptile; not a dinosaur | 82-66 Mya | Global oceans | `mosasaurus` / `/models/mosasaurus.glb` | `late-cretaceous-ocean-mosasaurus` | nonDinosaur |

# Classification Notes

- Dinosaurs: Spinosaurus, Carnotaurus, Velociraptor-like dromaeosaur, Triceratops, Tyrannosaurus rex.
- Marine reptiles: Plesiosaurus, Tylosaurus, Mosasaurus.
- Pterosaurs: Quetzalcoatlus.
- Prehistoric birds: Alexornis.
- Fish: Dunkleosteus.
- Uncertain model identity: Velociraptor-like dromaeosaur.

# Removed Timeline Entries

The previous disabled or no-runtime-model chapters were removed from [src/data/eras.ts](../src/data/eras.ts) and [src/data/creatures.ts](../src/data/creatures.ts): Dilophosaurus, stylized Indoraptor, generic sauropod, Morrison dinosaurs, Concavenator, generic pterosaur, feathered dromaeosaur, Olorotitan, alternate T. rex, alternate Mosasaurus, and other placeholder-only entries.

# Future Additions

Potential chronological gaps or slots, without inventing assets:

- A verified Triassic creature model after `era-triassic`.
- A clean Dilophosaurus GLB/FBX export for Early Jurassic.
- A runtime-ready Late Jurassic sauropod or Morrison group asset, after verifying exact species/meshes.
- Clean, web-sized Early Cretaceous pterosaur and Concavenator assets.
