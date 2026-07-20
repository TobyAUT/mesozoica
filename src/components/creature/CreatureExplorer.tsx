import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { X, Rotate3d, Play } from 'lucide-react';
import { useExperience } from '@/store/experienceStore';
import { useActiveCreature } from '@/hooks/useActiveCreature';
import { setScrollLocked } from '@/hooks/useScrollController';
import { useTr } from '@/i18n';

/**
 * Explore-mode chrome. While active, OrbitControls (in CameraController) drive the camera and
 * page scroll is locked. Escape or the close button restores the authored camera + scroll.
 */
export function CreatureExplorer() {
  const explore = useExperience((s) => s.exploreMode);
  const setExplore = useExperience((s) => s.setExploreMode);
  const animationAvailable = useExperience((s) => s.exploreAnimationAvailable);
  const animationPlaying = useExperience((s) => s.exploreAnimationPlaying);
  const playAnimation = useExperience((s) => s.playExploreAnimation);
  const creature = useActiveCreature();
  const { t } = useTr();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!explore) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExplore(false);
    };
    document.addEventListener('keydown', onKey);
    document.documentElement.classList.add('explore-scroll-locked');
    setScrollLocked(true);
    const focusFrame = requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', onKey);
      document.documentElement.classList.remove('explore-scroll-locked');
      setScrollLocked(false);
      if (previouslyFocused && document.contains(previouslyFocused)) previouslyFocused.focus();
    };
  }, [explore, setExplore]);

  if (!explore) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={`Explore ${creature?.displayName ?? '3D model'}`}
      className="pointer-events-none fixed inset-0 z-50 flex flex-col justify-between p-4 sm:p-6"
    >
      <div className="flex items-start justify-between">
        <div className="pointer-events-auto rounded-xl border border-white/10 bg-ink-900/60 px-4 py-2 backdrop-blur-md">
          <div className="type-eyebrow text-[0.58rem] text-cretaceous">{t('exploreMode')}</div>
          <div className="text-sm text-bone">{creature?.displayName ?? t('exploreModel')}</div>
        </div>
        <button
          ref={closeRef}
          type="button"
          aria-label={t('exploreCloseAria')}
          onClick={() => setExplore(false)}
          className="pointer-events-auto inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-white/80 bg-cretaceous px-5 py-3 text-base font-bold text-ink-900 shadow-[0_0_0_4px_rgba(11,12,14,0.55),0_8px_30px_rgba(0,0,0,0.55)] transition hover:scale-105 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <X size={20} strokeWidth={3} /> {t('exploreClose')}
        </button>
      </div>
      <div className="pointer-events-auto mx-auto flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={playAnimation}
          disabled={!animationAvailable || animationPlaying}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-cretaceous/80 bg-ink-900/85 px-5 py-2.5 text-sm font-bold text-bone shadow-lg backdrop-blur-md transition hover:border-white hover:bg-cretaceous hover:text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-not-allowed disabled:border-white/15 disabled:text-bone/45 disabled:hover:bg-ink-900/85"
        >
          <Play size={17} fill="currentColor" />
          <span aria-live="polite">
            {animationPlaying
              ? t('explorePlaying')
              : animationAvailable
                ? t('explorePlay')
                : t('exploreNoAnimation')}
          </span>
        </button>
        <div className="flex items-center gap-2 rounded-full border border-white/15 bg-ink-900/80 px-4 py-2 text-xs text-bone/80 shadow-lg backdrop-blur-md">
          <Rotate3d size={14} /> {t('exploreHint')}
        </div>
      </div>
    </motion.div>
  );
}
