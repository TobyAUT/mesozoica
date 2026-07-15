/** The ten supplied landscapes, ordered chronologically through the experience. */
export interface BackgroundDef {
  id: string;
  /** Human label for the a11y scene description. */
  label: string;
  /** CSS gradient stops, top of sky to ground. */
  sky: string;
  horizon: string;
  ground: string;
  /** Three.js fog colour (hex) to match the horizon. */
  fog: string;
  /** Real image served from public/Images. Optional — underwater scenes are gradient-only. */
  image?: string;
  /** Overlay opacity of the gradient over the image (0–1). */
  gradientOpacity: number;
  /** Underwater scenes get caustics, denser fog and a deep colour grade. */
  underwater?: boolean;
  /** True when the backdrop is AI-generated — surfaced as an EU AI Act transparency marker. */
  aiGenerated?: boolean;
}

// Prefixed with Vite BASE_URL so images resolve under a GitHub Pages sub-path.
const image = (filename: string) => `${import.meta.env.BASE_URL}Images/${filename}`;

export const BACKGROUNDS: readonly BackgroundDef[] = [
  {
    id: 'prologue',
    label: 'A nearly empty grey volcanic plain after the Permian mass extinction',
    sky: '#66625d',
    horizon: '#928a80',
    ground: '#292724',
    fog: '#817970',
    image: image('01-prologue.webp'),
    gradientOpacity: 0.18,
  },
  {
    id: 'late-triassic',
    label: 'A dry red desert with sandstone plateaus and sparse vegetation',
    sky: '#66402d',
    horizon: '#bd7440',
    ground: '#2b1a13',
    fog: '#a4653b',
    image: image('02-late-triassic.webp'),
    gradientOpacity: 0.16,
  },
  {
    id: 'early-jurassic',
    label: 'A dark humid volcanic landscape with conifer forest, river and waterfall',
    sky: '#29332d',
    horizon: '#687966',
    ground: '#151b17',
    fog: '#5b6b5d',
    image: image('03-early-jurassic.webp'),
    gradientOpacity: 0.17,
  },
  {
    id: 'middle-jurassic',
    label: 'A warm humid river delta with ferns and muddy banks',
    sky: '#40564a',
    horizon: '#849577',
    ground: '#1c281f',
    fog: '#72836d',
    image: image('04-middle-jurassic.webp'),
    gradientOpacity: 0.16,
  },
  {
    id: 'late-jurassic',
    label: 'A broad golden plain with tall conifers, mountains and open ground',
    sky: '#59624f',
    horizon: '#b7a56f',
    ground: '#29281c',
    fog: '#9a9168',
    image: image('05-late-jurassic.webp'),
    gradientOpacity: 0.15,
  },
  {
    id: 'early-cretaceous',
    label: 'A bright lake bordered by conifers, ferns and the first flowering plants',
    sky: '#55727c',
    horizon: '#9ab4ad',
    ground: '#1d2d28',
    fog: '#86a39d',
    image: image('06-early-cretaceous.webp'),
    gradientOpacity: 0.14,
  },
  {
    id: 'late-cretaceous-delta',
    label: 'A tropical humid river delta with sandbanks and dense vegetation',
    sky: '#355a58',
    horizon: '#779f8d',
    ground: '#14251f',
    fog: '#668d7c',
    image: image('07-early-late-cretaceous.webp'),
    gradientOpacity: 0.16,
  },
  {
    id: 'late-cretaceous-coast',
    label: 'An open coastal landscape with sea, islands and bright vegetation',
    sky: '#587889',
    horizon: '#9cb9b3',
    ground: '#20302b',
    fog: '#89a9a4',
    image: image('08-middle-late-cretaceous.webp'),
    gradientOpacity: 0.13,
  },
  {
    id: 'latest-cretaceous',
    label: 'A forested river plain with clearings, wetlands and dense woodland',
    sky: '#394940',
    horizon: '#879176',
    ground: '#172019',
    fog: '#737e69',
    image: image('09-latest-cretaceous.webp'),
    gradientOpacity: 0.16,
  },
  {
    id: 'extinction',
    label: 'A meteor beneath an orange sky over a dusty dark volcanic landscape',
    sky: '#29130d',
    horizon: '#a34420',
    ground: '#100907',
    fog: '#71331d',
    image: image('10-extinction.webp'),
    gradientOpacity: 0.2,
  },

  {
    // Finale ("The dinosaurs never left"): intentionally image-free — the birds video plays over
    // this soft dawn-sky gradient, which also serves as the fallback if the video fails.
    id: 'finale',
    label: 'A soft dawn sky, brightening after the impact winter',
    sky: '#2b3a44',
    horizon: '#8fa8a0',
    ground: '#141c1c',
    fog: '#7b948d',
    gradientOpacity: 0.2,
  },

  // ── Underwater backdrops (AI-generated ocean images, light gaussian blur baked in) ──
  {
    id: 'devonian-ocean',
    label: 'A deep Devonian sea, dim green-blue water pierced by faint light shafts',
    sky: '#0d3436',
    horizon: '#12615f',
    ground: '#04181c',
    fog: '#0c4a4a',
    image: image('devonian-ocean.webp'),
    gradientOpacity: 0.35,
    underwater: true,
    aiGenerated: true,
  },
  {
    id: 'early-jurassic-ocean',
    label: 'A bright Early Jurassic shallow sea in cool turquoise light',
    sky: '#12484c',
    horizon: '#2f7f7c',
    ground: '#072224',
    fog: '#1c6260',
    image: image('early-jurassic-ocean.webp'),
    gradientOpacity: 0.32,
    underwater: true,
    aiGenerated: true,
  },
  {
    id: 'late-cretaceous-ocean',
    label: 'A Late Cretaceous open ocean in deep teal (Tylosaurus scene)',
    sky: '#0f3a44',
    horizon: '#2a7381',
    ground: '#06191f',
    fog: '#175560',
    image: image('late-cretaceous-ocean.webp'),
    gradientOpacity: 0.32,
    underwater: true,
    aiGenerated: true,
  },
  {
    id: 'late-cretaceous-ocean-mosasaurus',
    label: 'A Late Cretaceous open ocean in deep teal (Mosasaurus scene)',
    sky: '#0f3a44',
    horizon: '#2a7381',
    ground: '#06191f',
    fog: '#175560',
    image: image('late-cretaceous-ocean-mosasaurus.webp'),
    gradientOpacity: 0.32,
    underwater: true,
    aiGenerated: true,
  },
];

export const BACKGROUND_BY_ID: Readonly<Record<string, BackgroundDef>> = Object.fromEntries(
  BACKGROUNDS.map((b) => [b.id, b]),
);

export function backgroundOrFallback(id: string): BackgroundDef {
  return BACKGROUND_BY_ID[id] ?? BACKGROUNDS[0];
}
