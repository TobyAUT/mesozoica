import { CHAPTERS, TIME_START_MYA, TIME_END_MYA, type Chapter } from '@/data/eras';

/** Total scroll weight across all chapters. */
export const TOTAL_WEIGHT = CHAPTERS.reduce((s, c) => s + c.weight, 0);

export interface ChapterRange {
  chapter: Chapter;
  /** Normalised scroll start/end (0–1). */
  start: number;
  end: number;
  index: number;
}

/** Precomputed scroll ranges for each chapter, laid end-to-end weighted by `weight`. */
export const CHAPTER_RANGES: ChapterRange[] = (() => {
  const ranges: ChapterRange[] = [];
  let acc = 0;
  CHAPTERS.forEach((chapter, index) => {
    const start = acc / TOTAL_WEIGHT;
    acc += chapter.weight;
    const end = acc / TOTAL_WEIGHT;
    ranges.push({ chapter, start, end, index });
  });
  return ranges;
})();

/** Clamp a number to [min, max]. */
export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

/**
 * Map global scroll progress (0–1) to the active chapter plus the local progress within it.
 * Robust at the exact boundaries and beyond [0,1].
 */
export function resolveChapter(progress: number): {
  range: ChapterRange;
  local: number;
} {
  const p = clamp(progress);
  const range =
    CHAPTER_RANGES.find((r) => p >= r.start && p < r.end) ?? CHAPTER_RANGES[CHAPTER_RANGES.length - 1];
  const span = range.end - range.start || 1;
  const local = clamp((p - range.start) / span);
  return { range, local };
}

/**
 * Interpolate the "millions of years ago" counter across chapters. Each chapter is anchored to
 * its `mya`; we lerp from the current chapter's mya toward the next as local progress advances,
 * so the counter moves continuously rather than snapping.
 */
export function myaAtProgress(progress: number): number {
  const { range, local } = resolveChapter(progress);
  const next = CHAPTER_RANGES[range.index + 1]?.chapter.mya ?? TIME_END_MYA;
  const from = range.chapter.mya;
  return from + (next - from) * local;
}

/** Overall progress through geological time, for a secondary "% through the Mesozoic" style read-out. */
export function timeFraction(mya: number): number {
  return clamp((TIME_START_MYA - mya) / (TIME_START_MYA - TIME_END_MYA));
}

/** Format a mya value for display, e.g. 66.4 → "66.4". Whole numbers drop the decimal. */
export function formatMya(mya: number): string {
  const rounded = Math.round(mya * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

/** Find the scroll progress at the centre of a chapter, for deep-link / timeline jumps. */
export function progressForChapterId(id: string): number | null {
  const r = CHAPTER_RANGES.find((r) => r.chapter.id === id);
  return r ? (r.start + r.end) / 2 : null;
}
