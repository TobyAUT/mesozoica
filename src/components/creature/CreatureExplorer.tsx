import { useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Rotate3d } from 'lucide-react';
import { useExperience } from '@/store/experienceStore';
import { useActiveCreature } from '@/hooks/useActiveCreature';

/**
 * Explore-mode chrome. While active, OrbitControls (in CameraController) drive the camera and
 * page scroll is locked. Escape or the close button restores the authored camera + scroll.
 */
export function CreatureExplorer() {
  const explore = useExperience((s) => s.exploreMode);
  const setExplore = useExperience((s) => s.setExploreMode);
  const creature = useActiveCreature();

  useEffect(() => {
    if (!explore) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExplore(false);
    };
    document.addEventListener('keydown', onKey);
    // Lock scroll while exploring.
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [explore, setExplore]);

  if (!explore) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pointer-events-none fixed inset-0 z-40 flex flex-col justify-between p-6"
    >
      <div className="flex items-start justify-between">
        <div className="pointer-events-auto rounded-xl border border-white/10 bg-ink-900/60 px-4 py-2 backdrop-blur-md">
          <div className="type-eyebrow text-[0.58rem] text-cretaceous">Explore mode</div>
          <div className="text-sm text-bone">{creature?.displayName ?? 'Model'}</div>
        </div>
        <button
          onClick={() => setExplore(false)}
          className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-bone px-4 py-2 text-sm font-medium text-ink-900 transition hover:bg-white"
        >
          <X size={15} /> Close
        </button>
      </div>
      <div className="mx-auto flex items-center gap-2 rounded-full border border-white/10 bg-ink-900/60 px-4 py-2 text-xs text-muted backdrop-blur-md">
        <Rotate3d size={14} /> Drag to orbit · scroll to zoom · Esc to exit
      </div>
    </motion.div>
  );
}
