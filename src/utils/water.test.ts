import { describe, it, expect } from 'vitest';
import { submersionAt, HAS_AQUATIC } from './water';
import { progressForChapterId } from './timeline';

describe('submersionAt', () => {
  it('has aquatic chapters in the timeline', () => {
    expect(HAS_AQUATIC).toBe(true);
  });

  it('stays within [0,1] across the whole scroll', () => {
    for (let p = 0; p <= 1.0001; p += 0.01) {
      const s = submersionAt(p);
      expect(s).toBeGreaterThanOrEqual(0);
      expect(s).toBeLessThanOrEqual(1);
    }
  });

  it('is fully submerged at the centre of an underwater chapter', () => {
    const p = progressForChapterId('dunkleosteus')!;
    expect(submersionAt(p)).toBeCloseTo(1, 5);
  });

  it('is dry at the centre of a land chapter', () => {
    const p = progressForChapterId('prologue')!;
    expect(submersionAt(p)).toBe(0);
  });

  it('is dry on a terrestrial creature chapter', () => {
    const p = progressForChapterId('triceratops')!;
    expect(submersionAt(p)).toBe(0);
  });
});
