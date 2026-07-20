import { describe, it, expect } from 'vitest';
import { submersionAt, HAS_AQUATIC } from './water';
import { progressForChapterId, CHAPTER_RANGES } from './timeline';

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

  it('rises late and drains early within an aquatic chapter', () => {
    const r = CHAPTER_RANGES.find((r) => r.chapter.id === 'dunkleosteus')!;
    const at = (local: number) => submersionAt(r.start + (r.end - r.start) * local);
    expect(at(0.05)).toBe(0); // still dry well into the chapter
    expect(at(0.14)).toBe(0); // rise has not started yet
    expect(at(0.3)).toBeGreaterThan(0); // climbing
    expect(at(0.5)).toBeCloseTo(1, 5); // fully submerged mid-chapter
    expect(at(0.86)).toBe(0); // gone before the next heading
    expect(at(0.99)).toBe(0);
  });

  it('never rises inside the land chapter that precedes an aquatic one', () => {
    // `before-dinosaurs` (land intro) runs straight into `dunkleosteus` (underwater).
    const r = CHAPTER_RANGES.find((r) => r.chapter.id === 'before-dinosaurs')!;
    const at = (local: number) => submersionAt(r.start + (r.end - r.start) * local);
    [0.5, 0.8, 0.9, 0.99].forEach((local) => expect(at(local)).toBe(0));
  });

  it('has no discontinuity across a land → water boundary', () => {
    const r = CHAPTER_RANGES.find((r) => r.chapter.id === 'dunkleosteus')!;
    const step = (r.end - r.start) / 400;
    let prev = submersionAt(r.start - step * 20);
    for (let p = r.start - step * 20; p <= r.end; p += step) {
      const s = submersionAt(p);
      expect(Math.abs(s - prev)).toBeLessThan(0.05); // no pop
      prev = s;
    }
  });
});
