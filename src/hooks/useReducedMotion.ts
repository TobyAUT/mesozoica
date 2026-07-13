import { useEffect } from 'react';
import { useExperience } from '@/store/experienceStore';

/** Syncs the OS "prefers-reduced-motion" setting into the store. Returns the current value. */
export function useReducedMotionSync(): boolean {
  const reducedMotion = useExperience((s) => s.reducedMotion);
  const setReducedMotion = useExperience((s) => s.setReducedMotion);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [setReducedMotion]);

  return reducedMotion;
}
