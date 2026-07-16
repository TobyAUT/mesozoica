import { useMemo } from 'react';
import { useExperience, type Lang } from '@/store/experienceStore';
import { UI, UI_LISTS, type StringKey } from './strings';
import {
  CHAPTER_DE,
  CONTINENT_DE,
  CREATURE_DE,
  ERA_DE,
  METHODOLOGY_DESC_DE,
  PERIOD_DE,
  STATUS_DE,
} from './content';
import type { Chapter, Era } from '@/data/eras';
import type { Creature } from '@/data/types';

export type { Lang };

/**
 * ONE hook for every translated string. English comes from the existing manifests/JSX literals and
 * stays the fallback: a missing German entry renders the English text rather than a blank or a key.
 */
export interface Translator {
  lang: Lang;
  /** Fixed UI label. */
  t: (key: StringKey) => string;
  /** Fixed UI bullet list. */
  list: (key: keyof (typeof UI_LISTS)['en']) => readonly string[];
  chapterTitle: (chapter: Chapter) => string;
  chapterSubtitle: (chapter: Chapter) => string | undefined;
  chapterBlurb: (chapter: Chapter) => string;
  eraHeading: (era: Era) => string;
  eraEpoch: (era: Era) => string;
  eraIntro: (era: Era) => string;
  creatureDescription: (creature: Creature) => string;
  creatureKeyFact: (creature: Creature) => string | null;
  period: (period: string) => string;
  continent: (continent: string | null) => string;
  diet: (diet: string | null) => string;
  /** Localises the English label returned by statusLabel(). */
  status: (englishLabel: string) => string;
  methodologyDesc: (status: string, englishDesc: string) => string;
}

const DIET_KEY: Record<string, StringKey> = {
  carnivore: 'dietCarnivore',
  herbivore: 'dietHerbivore',
  omnivore: 'dietOmnivore',
  piscivore: 'dietPiscivore',
  unknown: 'dietUnknown',
};

export function makeTranslator(lang: Lang): Translator {
  const de = lang === 'de';
  const t = (key: StringKey) => UI[lang][key];
  return {
    lang,
    t,
    list: (key) => UI_LISTS[lang][key],
    chapterTitle: (c) => (de && CHAPTER_DE[c.id]?.title) || c.title,
    chapterSubtitle: (c) => (de && CHAPTER_DE[c.id]?.subtitle) || c.subtitle,
    chapterBlurb: (c) => (de && CHAPTER_DE[c.id]?.blurb) || c.blurb || t('timeSliceFallback'),
    eraHeading: (e) => (de && ERA_DE[e.id]?.heading) || `The ${e.label}`,
    eraEpoch: (e) => (de && ERA_DE[e.id]?.epoch) || e.epoch,
    eraIntro: (e) => (de && ERA_DE[e.id]?.intro) || e.intro,
    creatureDescription: (c) => (de && CREATURE_DE[c.id]?.shortDescription) || c.shortDescription,
    creatureKeyFact: (c) => (de && CREATURE_DE[c.id]?.keyFact) || c.keyFact,
    period: (p) => (de && PERIOD_DE[p]) || p,
    continent: (c) => (c == null ? t('panelToBeVerified') : (de && CONTINENT_DE[c]) || c),
    diet: (d) => (d == null ? t('panelToBeVerified') : t(DIET_KEY[d] ?? 'dietUnknown')),
    status: (label) => (de && STATUS_DE[label]) || label,
    methodologyDesc: (status, englishDesc) => (de && METHODOLOGY_DESC_DE[status]) || englishDesc,
  };
}

/** Component-facing hook. Re-renders only when the language actually changes. */
export function useTr(): Translator {
  const lang = useExperience((s) => s.lang);
  return useMemo(() => makeTranslator(lang), [lang]);
}
