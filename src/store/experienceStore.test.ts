import { beforeEach, describe, expect, it } from 'vitest';
import { useExperience } from './experienceStore';

describe('Explore animation controls', () => {
  beforeEach(() => {
    useExperience.setState({
      exploreMode: false,
      exploreAnimationAvailable: false,
      exploreAnimationPlaying: false,
      exploreAnimationPlayRequest: 0,
    });
  });

  it('cannot request playback outside Explore mode', () => {
    useExperience.getState().setExploreAnimationAvailable(true);
    useExperience.getState().playExploreAnimation();

    expect(useExperience.getState().exploreAnimationPlaying).toBe(false);
    expect(useExperience.getState().exploreAnimationPlayRequest).toBe(0);
  });

  it('requests one playback at a time and resets the playing state on close', () => {
    useExperience.getState().setExploreMode(true);
    useExperience.getState().setExploreAnimationAvailable(true);
    useExperience.getState().playExploreAnimation();
    useExperience.getState().playExploreAnimation();

    expect(useExperience.getState().exploreAnimationPlaying).toBe(true);
    expect(useExperience.getState().exploreAnimationPlayRequest).toBe(1);

    useExperience.getState().setExploreMode(false);
    expect(useExperience.getState().exploreAnimationPlaying).toBe(false);
  });
});
