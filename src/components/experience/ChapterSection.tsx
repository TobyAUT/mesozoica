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
 * One DOM section per narrative chapter. These create the scroll length; the fixed canvas and
 * info-panel overlay react to the active chapter. Text stays in the DOM for accessibility.
 */
export function ChapterSection({ chapter }: { chapter: Chapter }) {
  const era = chapter.eraId ? eraById(chapter.eraId) : null;
  const creature = chapter.creatureId ? CREATURE_BY_ID[chapter.creatureId] : null;
  const minH = `${Math.round(chapter.weight * 100)}svh`;
  const isCreature = chapter.kind === 'creature' || chapter.kind === 'marine';

  return (
    <section
      id={chapter.id}
      aria-label={chapter.title}
      // Creature chapters: on mobile the heading sits at the TOP of the section (model fills
      // the screen, facts panel is fixed at the bottom); on lg+ everything re-centres.
      className={cn('relative flex w-full', isCreature ? 'items-start lg:items-center' : 'items-center')}
      style={{ minHeight: minH }}
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 lg:px-16">
        {chapter.kind === 'prologue' && (
          <div className="relative flex min-h-[90svh] flex-col items-center justify-center text-center">
            <motion.div {...reveal}>
              <div className="type-eyebrow mb-5 text-cretaceous">{chapter.subtitle}</div>
              <h1 className="type-display mb-6 text-bone">Mesozoica</h1>
              <p className="mx-auto max-w-xl text-base leading-relaxed text-bone/70">
                For 186 million years, dinosaurs ruled the Earth. Scroll through deep time from
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
              {chapter.blurb ??
                'Warm, humid river deltas spread between muddy banks and dense fern growth.'}
            </p>
          </motion.div>
        )}

        {(chapter.kind === 'creature' || chapter.kind === 'marine') && creature && (
          // On lg+ the short text is anchored just to the RIGHT of the fixed facts panel
          // (a small, constant gap), so it never overlaps the panel or drifts on wide screens.
          <div
            className={cn(
              'lg:absolute lg:left-[43rem] lg:top-1/2 lg:-translate-y-1/2 xl:left-[45rem] 2xl:left-[48rem]',
              // Mobile order: heading pinned to the TOP of the section, model fills the screen
              // behind it, facts panel sits fixed at the bottom -> heading, model, info panel.
              creature.enabled && creature.modelPath && 'mt-24 lg:mt-0',
            )}
          >
            <motion.div
              {...reveal}
              className="max-w-xl sm:max-w-md lg:max-w-[17rem] xl:max-w-[19rem] 2xl:max-w-sm"
            >
              <div className="mb-3 flex items-center gap-3">
                <ScientificStatusBadge creature={creature} />
                <span className="type-eyebrow text-[0.6rem] text-muted">{chapter.title}</span>
              </div>
              <h2 className="type-title mb-3 text-bone">{creature.displayName}</h2>
              <p className="max-w-lg text-base leading-relaxed text-bone/70">
                {creature.shortDescription}
              </p>
            </motion.div>
          </div>
        )}

        {chapter.kind === 'extinction' && (
          <motion.div {...reveal} className="mx-auto max-w-2xl text-center">
            <div className="type-eyebrow mb-4 text-extinction">{chapter.subtitle}</div>
            <h2 className="type-display mb-6 text-bone">Impact</h2>
            <p className="text-lg leading-relaxed text-bone/75">
              A city-sized asteroid struck what is now the Yucatan Peninsula. Firestorms, tsunamis,
              and a global winter followed. Around three-quarters of all species, including every
              non-avian dinosaur, vanished.
            </p>
          </motion.div>
        )}

        {chapter.kind === 'finale' && (
          <motion.div {...reveal} className="mx-auto max-w-2xl text-center">
            <div className="type-eyebrow mb-4 text-cretaceous">{chapter.subtitle}</div>
            <h2 className="type-display mb-6 text-bone">The dinosaurs never left</h2>
            <p className="mb-8 text-lg leading-relaxed text-bone/75">
              One lineage survived: the birds. Every sparrow, hawk, and heron alive today is a
              living dinosaur, the last chapter of a story 250 million years in the making.
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
