import { motion } from 'motion/react';
import type { Chapter } from '@/data/eras';
import { eraById } from '@/data/eras';
import { CREATURE_BY_ID } from '@/data/creatures';
import { ScientificStatusBadge } from '@/components/creature/ScientificStatusBadge';
import { ScrollHint } from './ScrollHint';
import { cn } from '@/utils/cn';

const reveal = {
  initial: { opacity: 0, y: 30, filter: 'blur(8px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: false, amount: 0.5 },
  transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
};

const ACCENT_TEXT: Record<string, string> = {
  triassic: 'text-triassic',
  jurassic: 'text-jurassic',
  cretaceous: 'text-cretaceous',
  extinction: 'text-extinction',
};

/**
 * One DOM section per narrative chapter. These create the scroll length; the fixed canvas +
 * info-panel overlay react to the active chapter. Text stays in the DOM for accessibility —
 * the canvas holds no essential readable text.
 */
export function ChapterSection({ chapter }: { chapter: Chapter }) {
  const era = chapter.eraId ? eraById(chapter.eraId) : null;
  const creature = chapter.creatureId ? CREATURE_BY_ID[chapter.creatureId] : null;
  const minH = `${Math.round(chapter.weight * 100)}svh`;

  return (
    <section
      id={chapter.id}
      aria-label={chapter.title}
      className="relative flex w-full items-center"
      style={{ minHeight: minH }}
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 lg:px-16">
        {chapter.kind === 'prologue' && (
          <div className="relative flex min-h-[90svh] flex-col items-center justify-center text-center">
            <motion.div {...reveal}>
              <div className="type-eyebrow mb-5 text-cretaceous">{chapter.subtitle}</div>
              <h1 className="type-display mb-6 text-bone">Mesozoica</h1>
              <p className="mx-auto max-w-xl text-base leading-relaxed text-bone/70">
                For 186 million years, dinosaurs ruled the Earth. Scroll through deep time — from
                the recovery after the greatest extinction, to the asteroid that ended an era, to
                the birds that carried the lineage into today.
              </p>
            </motion.div>
            <ScrollHint />
          </div>
        )}

        {chapter.kind === 'era-intro' && era && (
          <motion.div {...reveal} className="max-w-2xl">
            <div className={cn('type-eyebrow mb-4', ACCENT_TEXT[chapter.accent])}>{era.epoch}</div>
            <h2 className="type-display mb-6 text-bone">The {era.label}</h2>
            <p className="text-lg leading-relaxed text-bone/75">{era.intro}</p>
          </motion.div>
        )}

        {chapter.kind === 'time-slice' && (
          <motion.div {...reveal} className="max-w-2xl">
            <div className={cn('type-eyebrow mb-4', ACCENT_TEXT[chapter.accent])}>
              {chapter.subtitle}
            </div>
            <h2 className="type-display mb-6 text-bone">{chapter.title}</h2>
            <p className="text-lg leading-relaxed text-bone/75">
              Warm, humid river deltas spread between muddy banks and dense fern growth.
            </p>
          </motion.div>
        )}

        {(chapter.kind === 'creature' || chapter.kind === 'marine') && creature && (
          <motion.div {...reveal} className="max-w-xl">
            <div className="mb-3 flex items-center gap-3">
              <ScientificStatusBadge creature={creature} />
              <span className="type-eyebrow text-[0.6rem] text-muted">{chapter.title}</span>
            </div>
            <h2 className="type-title mb-3 text-bone">{creature.displayName}</h2>
            {/* Screen-reader text alternative for the 3D scene (brief §18). */}
            <p className="max-w-lg text-base leading-relaxed text-bone/70">
              {creature.shortDescription}
            </p>
            {!creature.enabled || !creature.modelPath ? (
              <p className="mt-4 inline-block rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-muted">
                {import.meta.env.DEV
                  ? creature.modelPath
                    ? 'Model export incompatible — a clean GLB is required.'
                    : 'Model asset pending — add the GLB to enable.'
                  : 'Specimen currently unavailable'}
              </p>
            ) : null}
          </motion.div>
        )}

        {chapter.kind === 'extinction' && (
          <motion.div {...reveal} className="mx-auto max-w-2xl text-center">
            <div className="type-eyebrow mb-4 text-extinction">{chapter.subtitle}</div>
            <h2 className="type-display mb-6 text-bone">Impact</h2>
            <p className="text-lg leading-relaxed text-bone/75">
              A city-sized asteroid struck what is now the Yucatán Peninsula. Firestorms, tsunamis,
              and a global winter followed. Around three-quarters of all species — including every
              non-avian dinosaur — vanished.
            </p>
          </motion.div>
        )}

        {chapter.kind === 'finale' && (
          <motion.div {...reveal} className="mx-auto max-w-2xl text-center">
            <div className="type-eyebrow mb-4 text-cretaceous">{chapter.subtitle}</div>
            <h2 className="type-display mb-6 text-bone">The dinosaurs never left</h2>
            <p className="mb-8 text-lg leading-relaxed text-bone/75">
              One lineage survived: the birds. Every sparrow, hawk, and heron alive today is a
              living dinosaur — the last chapter of a story 250 million years in the making.
            </p>
            <a
              href={`${import.meta.env.BASE_URL}creatures`}
              className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-bone px-5 py-2.5 text-sm font-medium text-ink-900 transition hover:bg-white"
            >
              Explore every creature
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
