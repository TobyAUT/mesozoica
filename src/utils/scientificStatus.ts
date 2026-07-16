import type { Creature } from '@/data/types';

/** Maps the manifest scientific status + group to an honest, human-readable badge. */
export function statusLabel(
  creature: Pick<Creature, 'scientificStatus' | 'creatureGroup'>,
): string {
  switch (creature.scientificStatus) {
    case 'verified':
      return 'Verified';
    case 'generic':
      return 'Generic model';
    case 'stylized':
      return 'Stylised interpretation';
    case 'uncertain':
      return 'Identification uncertain';
    case 'groupScene':
      return 'Group scene';
    case 'nonDinosaur':
      if (creature.creatureGroup === 'marineReptile') return 'Marine reptile';
      if (creature.creatureGroup === 'pterosaur') return 'Pterosaur';
      if (creature.creatureGroup === 'avialan') return 'Prehistoric bird';
      if (creature.creatureGroup === 'fish') return 'Prehistoric fish';
      return 'Not a dinosaur';
  }
}
