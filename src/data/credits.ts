import { CREATURES } from './creatures';
import type { Creature } from './types';

/**
 * CREDITS — attribution is a first-class, non-silent concern.
 *
 * Licenses/authors are UNRESOLVED until each Sketchfab page is checked by a human. We do NOT
 * invent them. `resolved: false` entries are surfaced loudly in the Credits page (and in dev)
 * so they can never be quietly omitted. The user downloaded these models under their own
 * permissions; this file records what still needs to be filled in.
 */
export interface ModelCredit {
  creatureId: string;
  sourceTitle: string;
  displayName: string;
  author: string | null;
  license: string | null;
  licenseUrl: string | null;
  sourceUrl: string | null;
  changesMade: string;
  attributionText: string | null;
  /** true only once a human has verified author + license on the source page. */
  resolved: boolean;
}

export const MODEL_CREDITS: ModelCredit[] = CREATURES.map((c: Creature) => ({
  creatureId: c.id,
  sourceTitle: c.sourceTitle,
  displayName: c.displayName,
  author: c.author,
  license: c.license,
  licenseUrl: c.licenseUrl,
  sourceUrl: c.sourceUrl,
  changesMade:
    'Converted/streamed as local GLB; auto-centred, scale-normalised, and re-lit for the scene. Geometry and textures unmodified.',
  attributionText: c.attributionText,
  resolved: c.author != null && c.license != null,
}));

export interface AudioCredit {
  creatureId: string;
  displayName: string;
  file: string;
  author: string;
  resolved: boolean;
}

export const AUDIO_CREDITS: AudioCredit[] = [
  {
    creatureId: 'tyrannosaurus-rex',
    displayName: 'Tyrannosaurus rex sound',
    file: '/audio/tyrannosaurus-rex-studiomod.mp3',
    author: 'StudioMod',
    resolved: true,
  },
];

export interface AssetCredit {
  category: 'Background' | 'Sound' | 'Font' | 'Data source' | 'Library';
  name: string;
  detail: string;
  resolved: boolean;
}

export const ASSET_CREDITS: AssetCredit[] = [
  {
    category: 'Background',
    name: 'Volcanic wasteland (prologue & extinction)',
    detail:
      'Supplied by the project owner (AI-generated concept image). All other era backdrops are procedurally rendered CSS gradients.',
    resolved: true,
  },
  {
    category: 'Sound',
    name: 'Ambient beds (per era)',
    detail:
      'No looping era ambience has been supplied yet. Creature one-shot sounds are credited separately.',
    resolved: false,
  },
  {
    category: 'Font',
    name: 'System font stack',
    detail:
      'Uses the OS system sans-serif and serif (Inter/Fraunces if installed) — loaded locally, no third-party font requests, DSGVO-friendly.',
    resolved: true,
  },
  {
    category: 'Data source',
    name: 'Palaeontology facts',
    detail:
      'Facts are attributed per creature to reputable museums and science bodies (Natural History Museum London, AMNH, Smithsonian, Royal Tyrrell, NPS, National Geographic). Unverifiable facts are omitted, never invented.',
    resolved: true,
  },
  {
    category: 'Library',
    name: 'Open-source stack',
    detail:
      'React, Three.js, @react-three/fiber & drei, @react-three/postprocessing, GSAP (free features only), Lenis, Motion, Zustand, Zod, Tailwind CSS, React Router, Lucide.',
    resolved: true,
  },
];

export function unresolvedCredits(): { models: ModelCredit[]; assets: AssetCredit[] } {
  return {
    models: MODEL_CREDITS.filter((m) => !m.resolved),
    assets: ASSET_CREDITS.filter((a) => !a.resolved),
  };
}
