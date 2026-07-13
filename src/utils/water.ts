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
    // Rise across the first third, unless we were already underwater in the previous chapter.
    if (!prev && local < 0.35) s = local / 0.35;
    // Fall across the last third, unless the next chapter is also underwater.
    if (!next && local > 0.7) s = Math.min(s, (1 - local) / 0.3);
    return clamp(s);
  }
  // Pre-rise in the tail of a land chapter that leads into water.
  if (next && local > 0.78) return clamp(((local - 0.78) / 0.22) * 0.85);
  // Continue draining in the head of a land chapter that follows water.
  if (prev && local < 0.22) return clamp((1 - local / 0.22) * 0.85);
  return 0;
}
