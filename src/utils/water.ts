import { CHAPTER_RANGES, resolveChapter, clamp } from './timeline';
import { CREATURE_BY_ID } from '@/data/creatures';
import type { Chapter } from '@/data/eras';

/** A chapter is aquatic when its creature is framed underwater. */
function isAquatic(chapter: Chapter): boolean {
  const c = chapter.creatureId ? CREATURE_BY_ID[chapter.creatureId] : null;
  return !!c && c.sceneType === 'underwater';
}

/** Precomputed aquatic flag per chapter range (index-aligned with CHAPTER_RANGES). */
export const AQUATIC_FLAGS: boolean[] = CHAPTER_RANGES.map((r) => isAquatic(r.chapter));

export const HAS_AQUATIC = AQUATIC_FLAGS.some(Boolean);

/**
 * Submersion factor 0..1 for a given global scroll progress. Rises as you enter an aquatic
 * chapter and falls as you leave — fully reversible on scroll-back. Adjacent aquatic chapters
 * stay submerged (no surfacing between them). The rise begins slightly before the aquatic
 * chapter and the fall completes slightly after, so the crossing feels continuous.
 */
export function submersionAt(progress: number): number {
  const { range, local } = resolveChapter(progress);
  const idx = range.index;
  const here = AQUATIC_FLAGS[idx];
  const prev = idx > 0 && AQUATIC_FLAGS[idx - 1];
  const next = idx < AQUATIC_FLAGS.length - 1 && AQUATIC_FLAGS[idx + 1];

  if (here) {
    let s = 1;
    // Rise late (0.15–0.45), unless we were already underwater in the previous chapter: the
    // visitor is well inside the chapter before the water climbs.
    if (!prev && local < 0.45) s = (local - 0.15) / 0.3;
    // Fall early (0.55–0.85), unless the next chapter is also underwater — the water is fully
    // gone well before the chapter ends, so the next heading never scrolls in over the overlay.
    if (!next && local > 0.55) s = Math.min(s, (0.85 - local) / 0.3);
    return clamp(s);
  }
  // Land chapters are always dry. There is deliberately no "pre-rise" in the tail of the chapter
  // BEFORE an aquatic one: it made the water appear a whole chapter early, and because the rise
  // restarts from 0 at the aquatic chapter's own start it also popped from 0.85 straight back to 0
  // on the boundary.
  return 0;
}
