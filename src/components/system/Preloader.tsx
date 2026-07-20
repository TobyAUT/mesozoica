import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useExperience } from '@/store/experienceStore';
import { useTr } from '@/i18n';

/**
 * Cinematic first-load screen. Waits a beat for the initial bundle/first paint, then reveals the
 * experience. It never blocks forever — a hard timeout guarantees dismissal (brief §22).
 */
export function Preloader() {
  const ready = useExperience((s) => s.ready);
  const setReady = useExperience((s) => s.setReady);
  const { t } = useTr();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    const tick = () => {
      const t = Math.min(1, (performance.now() - start) / 1600);
      setCount(Math.round(t * 100));
      if (t < 1) frame = requestAnimationFrame(tick);
      else setReady(true);
    };
    frame = requestAnimationFrame(tick);
    // Hard safety timeout.
    const timeout = setTimeout(() => setReady(true), 4000);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timeout);
    };
  }, [setReady]);

  return (
    <AnimatePresence>
      {!ready && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-ink-900"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <div className="type-eyebrow mb-4 text-[0.6rem] text-cretaceous">
              {t('preloaderEyebrow')}
            </div>
            <div className="font-serif text-5xl font-light tracking-tight text-bone sm:text-7xl">
              Mesozoica
            </div>
          </motion.div>
          <div className="mt-10 h-px w-48 overflow-hidden bg-white/10">
            <motion.div
              className="h-full bg-cretaceous"
              initial={{ width: '0%' }}
              animate={{ width: `${count}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>
          <div className="mt-3 text-xs tabular-nums text-muted">{count}%</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
