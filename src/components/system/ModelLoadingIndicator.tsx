import { useProgress } from '@react-three/drei';
import { motion, AnimatePresence } from 'motion/react';

/**
 * DOM-based model loading indicator (lives outside the canvas). Reads drei's global load
 * progress. Some supplied GLBs are very large, so this prevents a silent blank canvas.
 */
export function ModelLoadingIndicator() {
  const { active, progress, item } = useProgress();
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none fixed bottom-6 left-1/2 z-30 -translate-x-1/2 lg:left-auto lg:right-6 lg:translate-x-0"
        >
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-ink-900/70 px-4 py-2 backdrop-blur-md">
            <span className="h-2 w-2 animate-pulse rounded-full bg-cretaceous" />
            <span className="text-xs text-bone/80">
              Loading specimen… {Math.round(progress)}%
            </span>
            {import.meta.env.DEV && item && (
              <span className="max-w-[10rem] truncate text-[0.6rem] text-muted">{item}</span>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
