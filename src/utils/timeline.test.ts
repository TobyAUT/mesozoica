import { describe, it, expect } from 'vitest';
import {
  CHAPTER_RANGES,
  resolveChapter,
  myaAtProgress,
  formatMya,
  progressForChapterId,
  clamp,
  smoothstep,
  creatureFade,
  MOBILE_PHASES,
  mobileModelFade,
  mobilePanelFade,
  mobilePanelRead,
} from './timeline';
import { CHAPTERS, TIME_START_MYA, TIME_END_MYA } from '@/data/eras';

describe('timeline ranges', () => {
  it('covers [0,1] contiguously with no gaps', () => {
    expect(CHAPTER_RANGES[0].start).toBe(0);
    expect(CHAPTER_RANGES[CHAPTER_RANGES.length - 1].end).toBeCloseTo(1, 6);
    for (let i = 1; i < CHAPTER_RANGES.length; i++) {
      expect(CHAPTER_RANGES[i].start).toBeCloseTo(CHAPTER_RANGES[i - 1].end, 6);
    }
  });

  it('has one range per chapter', () => {
    expect(CHAPTER_RANGES).toHaveLength(CHAPTERS.length);
  });
});

describe('resolveChapter', () => {
  it('returns the first chapter at progress 0', () => {
    expect(resolveChapter(0).range.index).toBe(0);
  });
  it('returns the last chapter at progress 1', () => {
    expect(resolveChapter(1).range.index).toBe(CHAPTER_RANGES.length - 1);
  });
  it('clamps out-of-range input', () => {
    expect(resolveChapter(-5).range.index).toBe(0);
    expect(resolveChapter(5).range.index).toBe(CHAPTER_RANGES.length - 1);
  });
});

describe('myaAtProgress', () => {
  it('starts at the oldest time and moves toward the youngest', () => {
    expect(myaAtProgress(0)).toBeCloseTo(TIME_START_MYA, 0);
    expect(myaAtProgress(1)).toBeLessThanOrEqual(TIME_START_MYA);
    expect(myaAtProgress(1)).toBeGreaterThanOrEqual(TIME_END_MYA - 1);
  });
  it('stays within Mesozoic bounds and trends downward overall', () => {
    // The narrative order is thematic, not strictly chronological (loosely-ordered Late
    // Cretaceous creatures + a marine excursion), so the honest per-chapter age can step back
    // slightly. The real invariants are: always within bounds, and net downward across the scroll.
    for (let p = 0; p <= 1.0001; p += 0.02) {
      const v = myaAtProgress(p);
      expect(v).toBeLessThanOrEqual(TIME_START_MYA + 0.001);
      expect(v).toBeGreaterThanOrEqual(TIME_END_MYA - 1);
    }
    expect(myaAtProgress(0)).toBeGreaterThan(myaAtProgress(1));
  });
});

describe('formatMya', () => {
  it('drops decimals for whole numbers, keeps one otherwise', () => {
    expect(formatMya(66)).toBe('66');
    expect(formatMya(66.45)).toBe('66.5');
    expect(formatMya(66.0)).toBe('66');
  });
});

describe('progressForChapterId', () => {
  it('finds a mid-point for a known chapter and null for unknown', () => {
    const p = progressForChapterId('tyrannosaurus-rex');
    expect(p).not.toBeNull();
    expect(p!).toBeGreaterThan(0);
    expect(p!).toBeLessThan(1);
    expect(progressForChapterId('does-not-exist')).toBeNull();
  });
});

describe('clamp', () => {
  it('bounds values', () => {
    expect(clamp(-1)).toBe(0);
    expect(clamp(2)).toBe(1);
    expect(clamp(0.5)).toBe(0.5);
  });
});

describe('smoothstep', () => {
  it('clamps below/above the edges and eases in between', () => {
    expect(smoothstep(0.2, 0.8, 0)).toBe(0);
    expect(smoothstep(0.2, 0.8, 1)).toBe(1);
    expect(smoothstep(0.2, 0.8, 0.5)).toBeCloseTo(0.5, 6);
  });
});

describe('creatureFade', () => {
  it('is invisible early, full mid-chapter, and gone before the boundary', () => {
    expect(creatureFade(0)).toBe(0); // before the text is on screen
    expect(creatureFade(0.4)).toBe(0); // still ramping up
    expect(creatureFade(0.7)).toBeCloseTo(1, 5); // fully visible mid-section
    expect(creatureFade(0.95)).toBe(0); // faded out before the next heading
    expect(creatureFade(1)).toBe(0);
  });
});

describe('mobile sequential phases', () => {
  it('plays model, then panel, without overlap', () => {
    expect(mobileModelFade(0.1)).toBe(0); // heading phase — no model yet
    expect(mobileModelFade(0.42)).toBeCloseTo(1, 5); // model fully visible mid-phase
    expect(mobileModelFade(MOBILE_PHASES.panel.in[0])).toBe(0); // model gone before the panel
    expect(mobilePanelFade(0.42)).toBe(0); // no panel during the model phase
    expect(mobilePanelFade(0.75)).toBeCloseTo(1, 5); // panel fully visible while reading
    expect(mobilePanelFade(1)).toBe(0); // gone before the next section
  });

  it('reads the panel to the end only while it is fully visible', () => {
    expect(mobilePanelRead(MOBILE_PHASES.panel.in[1])).toBe(0); // reading starts after fade-in
    expect(mobilePanelRead(MOBILE_PHASES.panel.read[1])).toBe(1); // read to the end
    expect(mobilePanelRead(MOBILE_PHASES.panel.read[1])).toBeLessThanOrEqual(1);
    expect(MOBILE_PHASES.panel.read[1]).toBeLessThanOrEqual(MOBILE_PHASES.panel.out[0]); // before fade-out
  });
});
