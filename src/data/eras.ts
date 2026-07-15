export type AccentTheme = 'triassic' | 'jurassic' | 'cretaceous' | 'extinction';

export interface Era {
  id: string;
  label: string;
  /** Sub-label / epoch. */
  epoch: string;
  startMya: number;
  endMya: number;
  accent: AccentTheme;
  /** Short editorial intro shown at the era boundary. */
  intro: string;
}

/** Geological periods of the Mesozoic (plus the prologue framing). Boundaries are approximate Mya. */
export const ERAS: readonly Era[] = [
  {
    id: 'devonian',
    label: 'Devonian',
    epoch: '419.6 – 358.9 million years ago',
    startMya: 419,
    endMya: 359,
    accent: 'cretaceous',
    intro:
      'Long before the first dinosaurs appeared, the Devonian seas supported diverse fishes, reefs and early marine ecosystems. Armoured placoderms such as Dunkleosteus were among the largest predators of their time. On land, the first extensive forests developed and began transforming soils, rivers and the global carbon cycle.',
  },
  {
    id: 'triassic',
    label: 'Triassic',
    epoch: '251.9 – 201.4 million years ago',
    startMya: 252,
    endMya: 201,
    accent: 'triassic',
    intro:
      'The Triassic Period began after the largest mass extinction in Earth’s history. Life slowly recovered across the supercontinent Pangaea, where climates were often warm and seasonally dry. The first dinosaurs appeared during the Late Triassic, but initially shared their environments with many other reptiles and synapsids.',
  },
  {
    id: 'jurassic',
    label: 'Early Jurassic',
    epoch: '201.4 – 174.7 million years ago',
    startMya: 201,
    endMya: 145,
    accent: 'jurassic',
    intro:
      'After the end-Triassic extinction, dinosaurs became increasingly important in terrestrial ecosystems. Pangaea began to break apart, creating rift valleys, deserts and extensive river systems. Early large theropods hunted on land, while plesiosaurs and other marine reptiles occupied the surrounding seas.',
  },
  {
    id: 'cretaceous',
    label: 'Early Cretaceous',
    epoch: '143.1 – 100.5 million years ago',
    startMya: 145,
    endMya: 66,
    accent: 'cretaceous',
    intro:
      'Continents continued to separate during the Early Cretaceous, while sea levels rose and regional ecosystems became more distinct. Flowering plants first appeared and began to diversify. Iguanodontians, spinosaurids, armoured dinosaurs and many smaller feathered species inhabited forests, floodplains and wetlands.',
  },
];

/** Full mya span used to map scroll progress to a time counter. Now opens in the Devonian. */
export const TIME_START_MYA = 400;
export const TIME_END_MYA = 66;

export type ChapterKind =
  | 'prologue'
  | 'era-intro'
  | 'time-slice'
  | 'creature'
  | 'marine'
  | 'extinction'
  | 'finale';

export interface Chapter {
  id: string;
  kind: ChapterKind;
  /** For creature chapters, the creature id. */
  creatureId?: string;
  /** For era-intro chapters, the era id. */
  eraId?: string;
  title: string;
  subtitle?: string;
  /** Optional editorial paragraph for time-slice chapters (falls back to a default). */
  blurb?: string;
  /** Point in time this chapter represents, for the year counter. */
  mya: number;
  accent: AccentTheme;
  backgroundId: string;
  /** Relative scroll weight — larger sections get more scroll length. */
  weight: number;
}

/**
 * The narrative sequence. This is the ONLY place that composes the scroll.
 * Creature chapters can reference live model manifest ids; retired or future ids fall back to
 * chapter-only narrative/background sections.
 */
export const CHAPTERS: readonly Chapter[] = [
  // ── Title / hero first, so "Mesozoica" opens the page ──
  {
    id: 'prologue',
    kind: 'prologue',
    title: 'Mesozoica',
    subtitle: 'A journey through deep time',
    mya: 400,
    accent: 'triassic',
    backgroundId: 'prologue',
    weight: 1.1,
  },
  // ── Before the dinosaurs (Devonian ocean) ──
  {
    id: 'before-dinosaurs',
    kind: 'era-intro',
    eraId: 'devonian',
    title: 'Before the Dinosaurs',
    mya: 395,
    accent: 'cretaceous',
    backgroundId: 'devonian-ocean',
    weight: 1.15,
  },
  {
    id: 'dunkleosteus',
    kind: 'marine',
    creatureId: 'dunkleosteus',
    title: 'The armoured fish',
    subtitle: 'A placoderm — not a dinosaur',
    mya: 372,
    accent: 'cretaceous',
    backgroundId: 'devonian-ocean',
    weight: 1.1,
  },
  {
    id: 'era-triassic',
    kind: 'era-intro',
    eraId: 'triassic',
    title: 'The Triassic',
    mya: 250,
    accent: 'triassic',
    backgroundId: 'late-triassic',
    weight: 1.2,
  },
  {
    id: 'lystrosaurus',
    kind: 'creature',
    creatureId: 'lystrosaurus',
    title: 'The disaster survivor',
    subtitle: 'A synapsid — not a dinosaur',
    mya: 250,
    accent: 'triassic',
    backgroundId: 'late-triassic',
    weight: 1,
  },
  {
    id: 'pistosaurus',
    kind: 'marine',
    creatureId: 'pistosaurus',
    title: 'Ancestor of the sea dragons',
    subtitle: 'A marine reptile — not a dinosaur',
    mya: 245,
    accent: 'triassic',
    backgroundId: 'early-jurassic-ocean',
    weight: 1.05,
  },
  {
    id: 'herrerasaurus',
    kind: 'creature',
    creatureId: 'herrerasaurus',
    title: 'One of the first dinosaurs',
    mya: 231,
    accent: 'triassic',
    backgroundId: 'late-triassic',
    weight: 1,
  },
  {
    id: 'plateosaurus',
    kind: 'creature',
    creatureId: 'plateosaurus',
    title: 'The early giant',
    mya: 214,
    accent: 'triassic',
    backgroundId: 'late-triassic',
    weight: 1,
  },
  {
    id: 'era-jurassic',
    kind: 'era-intro',
    eraId: 'jurassic',
    title: 'The Jurassic',
    mya: 196,
    accent: 'jurassic',
    backgroundId: 'early-jurassic',
    weight: 1.2,
  },
  {
    id: 'dilophosaurus',
    kind: 'creature',
    creatureId: 'dilophosaurus',
    title: 'The crested hunter',
    mya: 193,
    accent: 'jurassic',
    backgroundId: 'early-jurassic',
    weight: 1,
  },
  {
    id: 'cryolophosaurus',
    kind: 'creature',
    creatureId: 'cryolophosaurus',
    title: 'The predator from Antarctica',
    mya: 190,
    accent: 'jurassic',
    backgroundId: 'early-jurassic',
    weight: 1,
  },
  {
    id: 'plesiosaurus',
    kind: 'marine',
    creatureId: 'plesiosaurus',
    title: 'The long-necked swimmer',
    subtitle: 'A marine reptile — not a dinosaur',
    mya: 188,
    accent: 'jurassic',
    backgroundId: 'early-jurassic-ocean',
    weight: 1.1,
  },
  {
    id: 'middle-jurassic',
    kind: 'time-slice',
    title: 'The Middle Jurassic',
    subtitle: '174.7–161.5 million years ago',
    blurb:
      'During the Middle Jurassic, drifting continents created increasingly distinct ecosystems. Sauropods became major large-bodied herbivores, while early stegosaurs and large theropods diversified. Although its fossil record is less complete than that of the Late Jurassic, this interval was crucial to dinosaur evolution.',
    mya: 170,
    accent: 'jurassic',
    backgroundId: 'middle-jurassic',
    weight: 0.85,
  },
  {
    id: 'cetiosaurus',
    kind: 'creature',
    creatureId: 'cetiosaurus',
    title: 'The whale lizard',
    mya: 168,
    accent: 'jurassic',
    backgroundId: 'middle-jurassic',
    weight: 1,
  },
  {
    id: 'megalosaurus',
    kind: 'creature',
    creatureId: 'megalosaurus',
    title: 'The first dinosaur named',
    mya: 166,
    accent: 'jurassic',
    backgroundId: 'middle-jurassic',
    weight: 1,
  },
  {
    id: 'huayangosaurus',
    kind: 'creature',
    creatureId: 'huayangosaurus',
    title: 'The early plated dinosaur',
    mya: 165,
    accent: 'jurassic',
    backgroundId: 'middle-jurassic',
    weight: 1,
  },
  {
    id: 'late-jurassic',
    kind: 'time-slice',
    title: 'The Late Jurassic',
    subtitle: '161.5–143.1 million years ago',
    blurb:
      'The Late Jurassic featured vast floodplains, conifer woodlands and fern-rich landscapes. Giant sauropods such as Diplodocus lived alongside Stegosaurus and large predators including Allosaurus. Small feathered dinosaurs and early birds also show that the evolutionary transition from dinosaurs to birds was already underway.',
    mya: 156,
    accent: 'jurassic',
    backgroundId: 'late-jurassic',
    weight: 0.9,
  },
  {
    id: 'allosaurus',
    kind: 'creature',
    creatureId: 'allosaurus',
    title: 'The lion of the Jurassic',
    mya: 153,
    accent: 'jurassic',
    backgroundId: 'late-jurassic',
    weight: 1,
  },
  {
    id: 'stegosaurus',
    kind: 'creature',
    creatureId: 'stegosaurus',
    title: 'Plates and spikes',
    mya: 152,
    accent: 'jurassic',
    backgroundId: 'late-jurassic',
    weight: 1,
  },
  {
    id: 'diplodocus',
    kind: 'creature',
    creatureId: 'diplodocus',
    title: 'The longest neck',
    mya: 151,
    accent: 'jurassic',
    backgroundId: 'late-jurassic',
    weight: 1,
  },
  {
    id: 'era-cretaceous',
    kind: 'era-intro',
    eraId: 'cretaceous',
    title: 'The Cretaceous',
    mya: 129,
    accent: 'cretaceous',
    backgroundId: 'early-cretaceous',
    weight: 1.2,
  },
  {
    id: 'baryonyx',
    kind: 'creature',
    creatureId: 'baryonyx',
    title: 'The fisher king',
    mya: 128,
    accent: 'cretaceous',
    backgroundId: 'early-cretaceous',
    weight: 1,
  },
  {
    id: 'iguanodon',
    kind: 'creature',
    creatureId: 'iguanodon',
    title: 'The thumb-spiked grazer',
    mya: 125,
    accent: 'cretaceous',
    backgroundId: 'early-cretaceous',
    weight: 1,
  },
  {
    id: 'late-cretaceous',
    kind: 'time-slice',
    title: 'The Late Cretaceous',
    subtitle: '100.5–66 million years ago',
    blurb:
      'By the Late Cretaceous, flowering plants were widespread and dinosaurs had evolved into highly diverse groups. Tyrannosaurs, ceratopsians, titanosaurs and ankylosaurs dominated many land ecosystems, while mosasaurs ruled the oceans and giant pterosaurs crossed the skies. The period ended with the Chicxulub impact and a global mass extinction.',
    mya: 100,
    accent: 'cretaceous',
    backgroundId: 'late-cretaceous-delta',
    weight: 0.9,
  },
  {
    id: 'spinosaurus',
    kind: 'creature',
    creatureId: 'spinosaurus',
    title: 'The river hunter',
    mya: 96,
    accent: 'cretaceous',
    backgroundId: 'late-cretaceous-delta',
    weight: 1,
  },
  {
    id: 'argentinosaurus',
    kind: 'creature',
    creatureId: 'argentinosaurus',
    title: 'The colossus',
    mya: 95,
    accent: 'cretaceous',
    backgroundId: 'late-cretaceous-delta',
    weight: 1.05,
  },
  {
    id: 'tylosaurus',
    kind: 'marine',
    creatureId: 'tylosaurus',
    title: 'The sea lizard',
    subtitle: 'A mosasaur — not a dinosaur',
    mya: 82,
    accent: 'cretaceous',
    backgroundId: 'late-cretaceous-ocean',
    weight: 1.05,
  },
  {
    id: 'carnotaurus',
    kind: 'creature',
    creatureId: 'carnotaurus',
    title: 'The horned predator',
    mya: 71,
    accent: 'cretaceous',
    backgroundId: 'late-cretaceous-coast',
    weight: 1,
  },
  {
    id: 'velociraptor-like',
    kind: 'creature',
    creatureId: 'velociraptor-like',
    title: 'The swift dromaeosaur',
    mya: 73,
    accent: 'cretaceous',
    backgroundId: 'late-cretaceous-coast',
    weight: 1,
  },
  {
    id: 'alexornis',
    kind: 'creature',
    creatureId: 'alexornis',
    title: 'The first birds',
    mya: 75,
    accent: 'cretaceous',
    backgroundId: 'late-cretaceous-coast',
    weight: 1,
  },
  {
    id: 'ankylosaurus',
    kind: 'creature',
    creatureId: 'ankylosaurus',
    title: 'The living fortress',
    mya: 69,
    accent: 'cretaceous',
    backgroundId: 'latest-cretaceous',
    weight: 1,
  },
  {
    id: 'quetzalcoatlus',
    kind: 'creature',
    creatureId: 'quetzalcoatlus',
    title: 'The giant of the sky',
    subtitle: 'A pterosaur — not a dinosaur',
    mya: 68,
    accent: 'cretaceous',
    backgroundId: 'latest-cretaceous',
    weight: 1.05,
  },
  {
    id: 'triceratops',
    kind: 'creature',
    creatureId: 'triceratops',
    title: 'Three horns',
    mya: 67,
    accent: 'cretaceous',
    backgroundId: 'latest-cretaceous',
    weight: 1,
  },
  {
    id: 'tyrannosaurus-rex',
    kind: 'creature',
    creatureId: 'tyrannosaurus-rex',
    title: 'The tyrant king',
    mya: 66.5,
    accent: 'cretaceous',
    backgroundId: 'latest-cretaceous',
    weight: 1.15,
  },
  {
    id: 'marine',
    kind: 'marine',
    creatureId: 'mosasaurus',
    title: 'Beneath the waves',
    subtitle: 'A marine reptile — not a dinosaur',
    mya: 68,
    accent: 'cretaceous',
    backgroundId: 'late-cretaceous-ocean-mosasaurus',
    weight: 1.1,
  },
  {
    id: 'extinction',
    kind: 'extinction',
    title: 'Impact',
    subtitle: '66 million years ago',
    mya: 66,
    accent: 'extinction',
    backgroundId: 'extinction',
    weight: 1.3,
  },
  {
    id: 'finale',
    kind: 'finale',
    title: 'The dinosaurs never left',
    subtitle: 'Birds are living dinosaurs',
    mya: 66,
    accent: 'cretaceous',
    backgroundId: 'prologue',
    weight: 1.1,
  },
];

export const eraById = (id: string) => ERAS.find((e) => e.id === id);
