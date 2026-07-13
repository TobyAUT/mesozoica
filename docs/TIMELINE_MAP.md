# Timeline Direction

Last updated: 2026-07-13 20:31 +02:00

Scrolling moves from older to younger. MYA values generally decrease from 400 Mya toward 66 Mya, though some late Cretaceous chapter ordering is thematic and not strictly monotonic.

# Era and Background Order

| Order | Chapter ID | Period/section | Age | Background ID | Creatures | Scene type |
|---:|---|---|---:|---|---|---|
| 1 | `prologue` | Mesozoica hero | 400 | `prologue` | none | terrestrial |
| 2 | `before-dinosaurs` | Devonian / Before the Dinosaurs | 395 | `devonian-ocean` | none | underwater intro |
| 3 | `dunkleosteus` | Devonian | 372 | `devonian-ocean` | `dunkleosteus` | underwater |
| 4 | `era-triassic` | Triassic | 235 | `late-triassic` | none | terrestrial |
| 5 | `era-jurassic` | Early Jurassic intro | 195 | `early-jurassic` | none | terrestrial |
| 6 | `plesiosaurus` | Early Jurassic | 190 | `early-jurassic-ocean` | `plesiosaurus` | underwater |
| 7 | `dilophosaurus` | Early Jurassic | 185 | `early-jurassic` | `dilophosaurus` | terrestrial |
| 8 | `stylized-indoraptor` | Early Jurassic | 180 | `early-jurassic` | `stylized-indoraptor` | terrestrial/stylized |
| 9 | `middle-jurassic` | Middle Jurassic | 169 | `middle-jurassic` | none | terrestrial |
| 10 | `generic-sauropod` | Late Jurassic | 150 | `late-jurassic` | `generic-sauropod` | terrestrial |
| 11 | `morrison-dinosaurs` | Late Jurassic | 150 | `late-jurassic` | `morrison-dinosaurs` | terrestrial/group scene |
| 12 | `era-cretaceous` | Early Cretaceous intro | 129 | `early-cretaceous` | none | terrestrial |
| 13 | `concavenator` | Early Cretaceous | 128 | `early-cretaceous` | `concavenator` | terrestrial |
| 14 | `generic-pterosaur` | Early Cretaceous | 115 | `early-cretaceous` | `generic-pterosaur` | aerial/generic |
| 15 | `spinosaurus` | Late Cretaceous | 96 | `late-cretaceous-delta` | `spinosaurus` | terrestrial/river delta |
| 16 | `tylosaurus` | Late Cretaceous | 82 | `late-cretaceous-ocean` | `tylosaurus` | underwater |
| 17 | `carnotaurus` | Late Cretaceous | 71 | `late-cretaceous-coast` | `carnotaurus` | terrestrial |
| 18 | `velociraptor-like` | Latest Cretaceous themed | 73 | `late-cretaceous-coast` | `velociraptor-like` | terrestrial/uncertain |
| 19 | `alexornis` | Late Cretaceous | 75 | `late-cretaceous-coast` | `alexornis` | terrestrial/aerial bird |
| 20 | `feathered-dromaeosaur` | Latest Cretaceous | 72 | `latest-cretaceous` | `feathered-dromaeosaur` | terrestrial/uncertain |
| 21 | `olorotitan` | Latest Cretaceous | 70 | `latest-cretaceous` | `olorotitan` | terrestrial |
| 22 | `quetzalcoatlus` | Latest Cretaceous | 68 | `latest-cretaceous` | `quetzalcoatlus` | aerial/coastal |
| 23 | `triceratops` | Latest Cretaceous | 67 | `latest-cretaceous` | `triceratops` | terrestrial |
| 24 | `tyrannosaurus-rex` | Latest Cretaceous | 66.5 | `latest-cretaceous` | `tyrannosaurus-rex` | terrestrial |
| 25 | `marine` | Latest/Late Cretaceous ocean | 68 | `late-cretaceous-ocean-mosasaurus` | `mosasaurus` | underwater |
| 26 | `extinction` | Extinction | 66 | `extinction` | none | terrestrial/impact |
| 27 | `finale` | Finale | 66 | `prologue` | none | terrestrial |

# Creature Timeline

| Creature | Scientific name | Classification | Approximate range | Continent | Scene type | Model ID/path | Background ID | Scientific certainty |
|---|---|---|---|---|---|---|---|---|
| Dunkleosteus | Dunkleosteus | fish; not a dinosaur | 382-358 Mya | Global Devonian seas | underwater | none | `devonian-ocean` | verified species, body details TODO_VERIFY |
| Plesiosaurus | Plesiosaurus | marine reptile; not a dinosaur | 199-175 Mya | Europe | underwater | `plesiosaurus` / `/models/plesiosaurus.glb` | `early-jurassic-ocean` | nonDinosaur |
| Dilophosaurus | Dilophosaurus | dinosaur, theropod | 186-183 Mya | North America | terrestrial | none | `early-jurassic` | verified, asset pending |
| Stylized "Indoraptor" | null | stylized fictional creature | unknown | null | terrestrial | `stylized-indoraptor` / disabled GLB | `early-jurassic` | stylized; hidden in scientific mode |
| Sauropod | Unidentified Sauropoda | dinosaur, generic sauropod | 157-145 Mya | Uncertain | terrestrial | none | `late-jurassic` | generic |
| Dinosaurs of the Morrison Formation | null | mixed group scene | 157-145 Mya | North America | terrestrial | none | `late-jurassic` | groupScene; actual meshes unknown |
| Concavenator | Concavenator corcovatus | dinosaur, theropod | 130-125 Mya | Europe (Spain) | terrestrial | none | `early-cretaceous` | verified, asset pending |
| Pterosaur (flying reptile) | null | pterosaur; not a dinosaur | 125-100 Mya | Uncertain | terrestrial/aerial | `generic-pterosaur` / disabled GLB | `early-cretaceous` | generic/nonDinosaur; broken model TODO_VERIFY |
| Spinosaurus | Spinosaurus | dinosaur, theropod | 99-93 Mya | Africa (North Africa) | terrestrial/river delta | `spinosaurus` / `/models/spinosaurus.glb` | `late-cretaceous-delta` | verified |
| Tylosaurus | Tylosaurus | marine reptile; not a dinosaur | 86-78 Mya | North America | underwater | `tylosaurus` / `/models/tylosaurus.glb` | `late-cretaceous-ocean` | nonDinosaur |
| Carnotaurus | Carnotaurus sastrei | dinosaur, theropod | 72-70 Mya | South America (Argentina) | terrestrial | `carnotaurus` / `/models/carnotaurus.glb` | `late-cretaceous-coast` | verified species; mesh accuracy TODO_VERIFY |
| Velociraptor-like Dromaeosaur | Uncertain dromaeosaurid | dinosaur, theropod | 75-71 Mya | Uncertain | terrestrial | `velociraptor-like` / `/models/dinosaur-velociraptor-like.glb` | `late-cretaceous-coast` | uncertain model identity |
| Alex (Alexornis) | Alexornis | prehistoric bird/avialan | 84-71 Mya | North America (Mexico) | terrestrial/aerial bird | `alexornis` / `/models/alex-alexornis.glb` | `late-cretaceous-coast` | verified taxon label; film-character model |
| Feathered Velociraptor-like Dromaeosaur | Unidentified Dromaeosauridae | dinosaur, theropod | 75-70 Mya | Uncertain | terrestrial | none | `latest-cretaceous` | uncertain, asset pending |
| Olorotitan | Olorotitan | dinosaur, hadrosaur | 72-66 Mya | Asia (Far East Russia) | terrestrial | none | `latest-cretaceous` | verified, asset pending |
| Quetzalcoatlus | Quetzalcoatlus northropi | pterosaur; not a dinosaur | 68-66 Mya | North America | aerial/coastal | `quetzalcoatlus` / `/models/quetzalcoatlus.glb` | `latest-cretaceous` | verified |
| Triceratops | Triceratops | dinosaur, ceratopsian | 68-66 Mya | North America | terrestrial | `triceratops` / `/models/triceratops.glb` | `latest-cretaceous` | verified |
| Tyrannosaurus rex | Tyrannosaurus rex | dinosaur, theropod | 68-66 Mya | North America | terrestrial | `tyrannosaurus-rex` / `/models/tyrannosaurus-rex-male.glb` | `latest-cretaceous` | verified |
| Mosasaurus | Mosasaurus hoffmannii | marine reptile; not a dinosaur | 82-66 Mya | Global oceans | underwater | none | `late-cretaceous-ocean-mosasaurus` | nonDinosaur, asset pending |

# Classification Notes

- Dinosaurs: Dilophosaurus, generic sauropod, Concavenator, Spinosaurus, Carnotaurus, Velociraptor-like dromaeosaur, feathered dromaeosaur, Olorotitan, Triceratops, Tyrannosaurus rex.
- Marine reptiles: Plesiosaurus, Tylosaurus, Mosasaurus, Mosasaurus alternate.
- Pterosaurs: generic pterosaur, Tupuxuara, Quetzalcoatlus.
- Prehistoric birds: Alexornis.
- Fish: Dunkleosteus.
- Generic models: generic sauropod, generic pterosaur.
- Stylized models: stylized indoraptor, stylized crested theropod.
- Uncertain models: velociraptor-like, feathered dromaeosaur, generic/group entries.

# Duplicate and Alternate Models

- Primary T. rex: `tyrannosaurus-rex` using [public/models/tyrannosaurus-rex-male.glb](../public/models/tyrannosaurus-rex-male.glb).
- Alternate T. rex: `tyrannosaurus-rex-alternate`, disabled and no local runtime path.
- Primary Mosasaurus chapter: `mosasaurus`, disabled and no local runtime path.
- Alternate Mosasaurus: `mosasaurus-alt`, disabled and no local runtime path.
- Raw duplicate GLBs in [Models](../Models) mirror several public runtime GLBs; see [ASSET_MAP.md](ASSET_MAP.md).

# Future Additions

Potential chronological gaps or slots, without inventing assets:

- A verified Triassic creature model after `era-triassic`.
- A runtime-ready Devonian Dunkleosteus model for `dunkleosteus`.
- A clean Dilophosaurus GLB/FBX export for Early Jurassic.
- A runtime-ready Late Jurassic sauropod or Morrison group asset, after verifying exact species/meshes.
- Clean, web-sized Early Cretaceous pterosaur and Concavenator assets.
- Runtime-ready Mosasaurus model for the existing underwater chapter.
