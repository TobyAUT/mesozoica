import { describe, expect, it } from 'vitest';
import { AUDIO_CREDITS, MODEL_CREDITS } from './credits';
import { CREATURE_BY_ID } from './creatures';
import { CHAPTERS } from './eras';

describe('credits', () => {
  it('lists exactly the enabled local models used by the live timeline', () => {
    const expected = CHAPTERS.flatMap((chapter) => {
      if (!chapter.creatureId) return [];
      const creature = CREATURE_BY_ID[chapter.creatureId];
      return creature?.enabled && creature.modelPath ? [creature.id] : [];
    }).sort();
    const actual = MODEL_CREDITS.map((credit) => credit.creatureId).sort();

    expect(actual).toEqual(expected);
  });

  it('keeps every audio credit connected to the creature asset it describes', () => {
    for (const credit of AUDIO_CREDITS) {
      expect(CREATURE_BY_ID[credit.creatureId]?.audioPath).toBe(credit.file);
    }
  });
});
