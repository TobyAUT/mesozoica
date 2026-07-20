import { CREATURES } from './creatures';
import { CHAPTERS } from './eras';
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
  attributionText: string | null;
  /** true only once a human has verified author + license on the source page. */
  resolved: boolean;
}

const USED_CREATURE_IDS = new Set(
  CHAPTERS.flatMap((chapter) => (chapter.creatureId ? [chapter.creatureId] : [])),
);

/** Only models that are enabled, locally backed, and actually referenced by the live timeline. */
export const MODEL_CREDITS: ModelCredit[] = CREATURES.filter(
  (creature) =>
    creature.enabled && creature.modelPath.length > 0 && USED_CREATURE_IDS.has(creature.id),
).map((c: Creature) => ({
  creatureId: c.id,
  sourceTitle: c.sourceTitle,
  displayName: c.displayName,
  author: c.author,
  license: c.license,
  licenseUrl: c.licenseUrl,
  sourceUrl: c.sourceUrl,
  attributionText: c.attributionText,
  resolved: c.author != null && c.license != null,
}));

export interface AudioCredit {
  creatureId: string;
  displayName: string;
  file: string;
  author: string;
}

export const AUDIO_CREDITS: AudioCredit[] = [
  {
    creatureId: 'tyrannosaurus-rex',
    displayName: 'Tyrannosaurus rex sound',
    file: '/audio/tyrannosaurus-rex-studiomod.mp3',
    author: 'StudioMod',
  },
];

export interface AssetCredit {
  category: 'Background' | 'Font' | 'Data source' | 'Library';
  name: string;
  detail: string;
  resolved: boolean;
}

export const ASSET_CREDITS: AssetCredit[] = [
  {
    category: 'Background',
    name: 'Timeline backgrounds and chapter videos',
    detail:
      'AI-generated visual media supplied by the project owner and served locally. Gradient fallbacks are rendered by the application.',
    resolved: true,
  },
  {
    category: 'Font',
    name: 'Self-hosted variable fonts',
    detail:
      'Fraunces, Inter and Space Grotesk are bundled locally from their OFL-licensed Fontsource packages; no third-party font requests are made.',
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
      'React, Three.js, @react-three/fiber & drei, @react-three/postprocessing, Lenis, Motion, Zustand, Zod, Tailwind CSS, React Router, Lucide.',
    resolved: true,
  },
];
