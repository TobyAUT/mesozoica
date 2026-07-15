import { describe, expect, it } from 'vitest';
import { CREATURE_BY_ID } from './creatures';

describe('creature animation speed', () => {
  it('plays Quetzalcoatlus at half of the authored clip speed', () => {
    expect(CREATURE_BY_ID.quetzalcoatlus.animationSpeed).toBe(0.5);
  });

  it('keeps the default animation speed for other creatures', () => {
    expect(CREATURE_BY_ID.carnotaurus.animationSpeed).toBe(1);
  });
});
