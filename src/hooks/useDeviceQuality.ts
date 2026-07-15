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
  const connection = (
    navigator as unknown as {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;
  const constrainedNetwork =
    connection?.saveData === true ||
    connection?.effectiveType === 'slow-2g' ||
    connection?.effectiveType === '2g';

  if (constrainedNetwork || cores <= 2 || mem <= 2) return 'low';
  if (mobile && (cores <= 4 || mem <= 4)) return 'low';
  if (!mobile && cores <= 4 && mem <= 4) return 'low';
  if (mobile || cores < 8 || mem < 8) return 'balanced';
  if (cores >= 8 && mem >= 8) return 'high';
  return 'balanced';
}

function isMobileDevice(): boolean {
  return typeof navigator !== 'undefined' && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
}

const PRESETS: Record<'high' | 'balanced' | 'low', Omit<ResolvedQuality, 'isMobile'>> = {
  high: { tier: 'high', dpr: [1, 1.75], shadows: true, postprocessing: true, particles: 280 },
  balanced: {
    tier: 'balanced',
    dpr: [0.85, 1.25],
    shadows: false,
    postprocessing: false,
    particles: 100,
  },
  low: { tier: 'low', dpr: [0.65, 0.9], shadows: false, postprocessing: false, particles: 0 },
};

/** Resolves the user's quality choice ('auto' → detected tier) into concrete render settings. */
export function useDeviceQuality(): ResolvedQuality {
  const quality: Quality = useExperience((s) => s.quality);
  return useMemo(() => {
    const tier = quality === 'auto' ? detectTier() : quality;
    return { ...PRESETS[tier], isMobile: isMobileDevice() };
  }, [quality]);
}
