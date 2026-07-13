/**
 * Per-frame scroll state lives OUTSIDE React (see brief §17: never store frame-level animation
 * values in React state). The render loop, GSAP, and the year counter all read/write this
 * mutable object directly. Only discrete transitions (active chapter changing) are pushed into
 * the Zustand store.
 */
export interface ScrollState {
  /** Global scroll progress through the whole experience, 0–1. */
  progress: number;
  /** Smoothed/damped progress used for cinematic camera + fog. */
  damped: number;
  /** Current velocity (from Lenis), for subtle motion effects. */
  velocity: number;
}

export const scrollRef: ScrollState = { progress: 0, damped: 0, velocity: 0 };
