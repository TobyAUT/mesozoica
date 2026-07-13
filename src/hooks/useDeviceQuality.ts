import { useMemo } from 'react';
import { useExperience, type Quality } from '@/store/experienceStore';

export interface ResolvedQuality {
  tier: 'high' | 'balanced' | 'low';
  dpr: [number, number];
  shadows: boolean;
  postprocessing: boolean;
  particles: number;
  /** Target auto-normalised model height stays constant; this only gates effects. */
  isMobile: boolean;
}

/** Cheap capability probe. No external gpu-tier dep — coarse but good enough to gate effects. */
function detectTier(): 'high' | 'balanced' | 'low' {
  if (typeof navigator === 'undefined') return 'balanced';
  const mobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
  const cores = navigator.hardwareConcurrency ?? 4;
  const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 4;
  if (mobile || cores <= 4 || mem <= 4) return mobile && (cores <= 4 || mem <= 3) ? 'low' : 'balanced';
  if (cores >= 8 && mem >= 8) return 'high';
  return 'balanced';
}

function isMobileDevice(): boolean {
  return typeof navigator !== 'undefined' && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
}

const PRESETS: Record<'high' | 'balanced' | 'low', Omit<ResolvedQuality, 'isMobile'>> = {
  high: { tier: 'high', dpr: [1, 2], shadows: true, postprocessing: true, particles: 380 },
  balanced: { tier: 'balanced', dpr: [1, 1.5], shadows: true, postprocessing: true, particles: 210 },
  low: { tier: 'low', dpr: [0.75, 1], shadows: false, postprocessing: false, particles: 80 },
};

/** Resolves the user's quality choice ('auto' → detected tier) into concrete render settings. */
export function useDeviceQuality(): ResolvedQuality {
  const quality: Quality = useExperience((s) => s.quality);
  return useMemo(() => {
    const tier = quality === 'auto' ? detectTier() : quality;
    return { ...PRESETS[tier], isMobile: isMobileDevice() };
  }, [quality]);
}
