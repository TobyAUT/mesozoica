import { AnimatePresence, motion } from 'motion/react';
import { useActiveChapter } from '@/hooks/useActiveCreature';
import { backgroundOrFallback } from '@/data/backgrounds';

/**
 * Two-layer crossfade background behind the (transparent) WebGL canvas. Each time slice uses
 * its supplied landscape with a light sky→horizon→ground grade for text contrast.
 * This is pure CSS, so it doubles as the low-power fallback and never blocks the 3D scene.
 * Only the active background is mounted, so we never hold ten full-res textures at once.
 */
export function BackgroundTransition() {
  const chapter = useActiveChapter();
  const def = backgroundOrFallback(chapter.backgroundId);
  const gradient = `linear-gradient(145deg, ${def.sky} 0%, transparent 42%, ${def.horizon} 68%, ${def.ground} 100%)`;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-ink-900" aria-hidden="true">
      <AnimatePresence>
        <motion.div
          key={def.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: 'easeInOut' }}
        >
          {def.image ? (
            <motion.img
              src={def.image}
              alt=""
              loading={def.id === 'prologue' ? 'eager' : 'lazy'}
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-center saturate-[0.88] brightness-[0.82]"
              initial={{ scale: 1.035 }}
              animate={{ scale: 1.08 }}
              transition={{ duration: 24, ease: 'linear' }}
            />
          ) : (
            /* No supplied photo (underwater scenes): a deep base plus soft caustic light shafts. */
            <>
              <div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(120% 90% at 50% -10%, ${def.horizon} 0%, ${def.sky} 45%, ${def.ground} 100%)`,
                }}
              />
              <motion.div
                className="absolute inset-0 opacity-40 mix-blend-screen"
                style={{
                  backgroundImage: `repeating-linear-gradient(115deg, transparent 0 42px, ${def.horizon}55 42px 60px, transparent 60px 96px)`,
                }}
                initial={{ backgroundPosition: '0px 0px' }}
                animate={{ backgroundPosition: '220px 120px' }}
                transition={{ duration: 14, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' }}
              />
            </>
          )}
          <motion.div
            className="absolute -inset-[12%] bg-[length:150%_150%]"
            style={{
              backgroundImage: gradient,
              opacity: Math.max(0.3, def.gradientOpacity + 0.16),
              mixBlendMode: 'soft-light',
            }}
            initial={{ backgroundPosition: '0% 20%' }}
            animate={{ backgroundPosition: '100% 80%' }}
            transition={{ duration: 18, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/50" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_38%,rgba(4,7,8,0.2)_68%,rgba(3,5,6,0.72)_100%)]" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
