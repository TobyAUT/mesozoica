import { describe, expect, it } from 'vitest';
import { makeTranslator } from './index';
import { UI, UI_LISTS } from './strings';
import { CREATURE_DE, PERIOD_DE, CONTINENT_DE } from './content';
import { CREATURES } from '@/data/creatures';
import { CHAPTERS, ERAS, eraById } from '@/data/eras';

const en = makeTranslator('en');
const de = makeTranslator('de');

describe('UI dictionaries', () => {
  it('define the same keys in both languages', () => {
    expect(Object.keys(UI.de).sort()).toEqual(Object.keys(UI.en).sort());
    expect(Object.keys(UI_LISTS.de).sort()).toEqual(Object.keys(UI_LISTS.en).sort());
  });

  it('never leaves a German label empty or identical-by-accident on key labels', () => {
    expect(de.t('navTimeline')).toBe('Zeitleiste');
    expect(de.t('panelWhen')).toBe('Wann');
    expect(en.t('navTimeline')).toBe('Timeline');
  });
});

describe('content coverage', () => {
  it('translates every creature shown in the timeline', () => {
    const missing = CREATURES.filter((c) => !CREATURE_DE[c.id]).map((c) => c.id);
    expect(missing).toEqual([]);
  });

  it('translates every period and continent used by the manifest', () => {
    const periods = [...new Set(CREATURES.map((c) => c.period))];
    expect(periods.filter((p) => !PERIOD_DE[p])).toEqual([]);
    const continents = [...new Set(CREATURES.map((c) => c.continent).filter(Boolean))];
    expect(continents.filter((c) => !CONTINENT_DE[c!])).toEqual([]);
  });

  it('gives every chapter a German title and every era a German intro', () => {
    // Era-intro chapters take their heading from the era, so they are exempt from CHAPTER_DE.
    const missing = CHAPTERS.filter(
      (c) => c.kind !== 'era-intro' && de.chapterTitle(c) === c.title && c.id !== 'prologue',
    ).map((c) => c.id);
    expect(missing).toEqual([]);
    ERAS.forEach((era) => {
      expect(de.eraIntro(era)).not.toBe(era.intro);
      expect(de.eraHeading(era)).not.toBe(`The ${era.label}`);
    });
  });
});

describe('fallback behaviour', () => {
  it('returns the English manifest text when no German entry exists', () => {
    const unknown = { id: 'not-in-any-dictionary', title: 'Untranslated', weight: 1 } as never;
    expect(de.chapterTitle(unknown)).toBe('Untranslated');
    expect(de.period('Some Unmapped Period')).toBe('Some Unmapped Period');
  });

  it('never translates proper nouns', () => {
    const trex = CREATURES.find((c) => c.id === 'tyrannosaurus-rex')!;
    expect(trex.displayName).toBe('Tyrannosaurus rex');
    expect(de.creatureDescription(trex)).toContain('Tyrannosaurus rex');
  });

  it('English translator returns the manifest text unchanged', () => {
    const era = eraById('triassic')!;
    expect(en.eraIntro(era)).toBe(era.intro);
    expect(en.eraHeading(era)).toBe('The Triassic');
  });
});
