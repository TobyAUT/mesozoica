import type { CSSProperties } from 'react';
import { motion } from 'motion/react';
import type { Chapter } from '@/data/eras';
import { eraById } from '@/data/eras';
import { CREATURE_BY_ID } from '@/data/creatures';
import { ScrollHint } from './ScrollHint';
import { useTr } from '@/i18n';
import { cn } from '@/utils/cn';

const reveal = {
  initial: { opacity: 0, y: 30, filter: 'blur(8px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: false, amount: 0.5 },
  transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
};

/**
 * One DOM section per narrative chapter. These create the scroll length; the fixed canvas and
 * info-panel overlay react to the active chapter. Text stays in the DOM for accessibility.
 */
export function ChapterSection({ chapter }: { chapter: Chapter }) {
  const tr = useTr();
  const { t } = tr;
  const era = chapter.eraId ? eraById(chapter.eraId) : null;
  const creature = chapter.creatureId ? CREATURE_BY_ID[chapter.creatureId] : null;
  const minH = `${Math.round(chapter.weight * 100)}svh`;
  const isCreature = chapter.kind === 'creature' || chapter.kind === 'marine';

  return (
    <section
      id={chapter.id}
      aria-label={tr.chapterTitle(chapter)}
      // Creature chapters: on phone/tablet the heading sits at the TOP of the section and scrolls
      // out first; the model, then the info card, follow as scroll phases. On lg+ everything
      // re-centres. Below lg EVERY section is uniformly 1.7× taller to give the three phases
      // scroll room — uniform scaling keeps the weight-based chapter ranges accurate.
      className={cn(
        'relative flex w-full min-h-[calc(var(--section-h)*1.7)] lg:min-h-[var(--section-h)]',
        // Prologue: content anchors to the FIRST viewport (inner block centres itself in 100svh)
        // so the Mesozoica hero is dead-centre on load in every view, not mid-way down the
        // taller mobile section.
        chapter.kind === 'prologue'
          ? 'items-start'
          : isCreature
            ? 'items-start lg:items-center'
            : // Video chapters stretch their content wrapper so the STICKY text block inside can
              // stay pinned on screen for the whole frame-by-frame video scrub.
              chapter.kind === 'extinction' || chapter.kind === 'finale'
              ? 'items-stretch'
              : 'items-center',
      )}
      style={{ '--section-h': minH } as CSSProperties}
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 lg:px-16">
        {chapter.kind === 'prologue' && (
          <div className="relative flex min-h-[100svh] flex-col items-center justify-center text-center">
            <motion.div {...reveal}>
              <div className="type-eyebrow mb-5 text-cretaceous">{tr.chapterSubtitle(chapter)}</div>
              <h1 className="type-display mb-6 heading-hero">Mesozoica</h1>
              <p className="mx-auto max-w-xl text-base leading-relaxed text-bone/70">
                {t('prologueIntro')}
              </p>
            </motion.div>
            <ScrollHint />
          </div>
        )}

        {chapter.kind === 'era-intro' && era && (
          <motion.div {...reveal} className="mx-auto max-w-2xl text-center">
            <div className="type-eyebrow mb-4 text-cretaceous">{tr.eraEpoch(era)}</div>
            <h2 className="type-display mb-6 heading-hero">{tr.eraHeading(era)}</h2>
            <p className="text-lg leading-relaxed text-bone/75">{tr.eraIntro(era)}</p>
          </motion.div>
        )}

        {chapter.kind === 'time-slice' && (
          <motion.div {...reveal} className="mx-auto max-w-2xl text-center">
            <div className="type-eyebrow mb-4 text-cretaceous">{tr.chapterSubtitle(chapter)}</div>
            <h2 className="type-display mb-6 heading-hero">{tr.chapterTitle(chapter)}</h2>
            <p className="text-lg leading-relaxed text-bone/75">{tr.chapterBlurb(chapter)}</p>
          </motion.div>
        )}

        {(chapter.kind === 'creature' || chapter.kind === 'marine') && creature && (
          // On lg+ the short text is anchored just to the RIGHT of the fixed facts panel
          // (a small, constant gap), so it never overlaps the panel or drifts on wide screens.
          <div
            className={cn(
              // Phone/tablet sequence: the heading block fills the FIRST viewport of the (taller)
              // section, dead-centre on screen, then scrolls out of the page before the
              // fullscreen model and the info card take over as later scroll phases
              // (MOBILE_PHASES in utils/timeline). It is never composed beside the info panel —
              // that arrangement exists only on lg+ (absolute, right of the facts panel).
              'flex min-h-[100svh] w-full flex-col items-center justify-center text-center',
              'lg:absolute lg:left-[43rem] lg:top-1/2 lg:block lg:min-h-0 lg:w-auto lg:-translate-y-1/2 lg:text-left xl:left-[45rem] 2xl:left-[48rem]',
            )}
          >
            <motion.div
              {...reveal}
              className="max-w-xl sm:max-w-md lg:max-w-[17rem] xl:max-w-[19rem] 2xl:max-w-sm"
            >
              <div className="mb-3 flex items-center justify-center gap-3 lg:justify-start">
                <span className="type-eyebrow text-[0.68rem] text-cretaceous">
                  {tr.chapterTitle(chapter)}
                </span>
              </div>
              <h2 className="type-title mb-3 heading-hero">{creature.displayName}</h2>
              <p className="max-w-lg text-[1.05rem] leading-relaxed text-bone/80">
                {tr.creatureDescription(creature)}
              </p>
            </motion.div>
          </div>
        )}

        {chapter.kind === 'extinction' && (
          // Sticky: the copy stays on screen while the meteor video is scrubbed through the whole
          // (extra-long) section, releasing right as the next section arrives.
          <motion.div {...reveal} className="sticky top-[34svh] mx-auto max-w-2xl text-center">
            <div className="type-eyebrow mb-4 text-extinction">{tr.chapterSubtitle(chapter)}</div>
            <h2 className="type-display mb-6 heading-hero">{t('impactHeading')}</h2>
            <p className="text-lg leading-relaxed text-bone/75">{t('impactBody')}</p>
          </motion.div>
        )}

        {chapter.kind === 'finale' && (
          // Sticky like the extinction copy: visible over the birds video until the footer.
          // The birds video is by far the brightest backdrop in the experience, so unlike every
          // other chapter this copy needs its own scrim — bone/75 body text on a bright sky was
          // unreadable. The heading already carries heading-hero's text-shadow.
          <motion.div
            {...reveal}
            className="sticky top-[30svh] mx-auto max-w-4xl rounded-3xl bg-ink-900/55 px-6 py-8 text-center backdrop-blur-[3px] sm:px-10"
          >
            <div className="type-eyebrow mb-4 text-cretaceous">{tr.chapterSubtitle(chapter)}</div>
            <h2 className="type-display mb-6 !text-[clamp(2.35rem,8vw,7rem)] text-balance heading-hero sm:!text-[clamp(2.75rem,8vw,7rem)]">
              {t('finaleHeading')}
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-bone/95 [text-shadow:0_1px_10px_rgba(0,0,0,0.55)]">
              {t('finaleBody')}
            </p>
            <a
              href={`${import.meta.env.BASE_URL}creatures`}
              className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-bone px-5 py-2.5 text-sm font-medium text-ink-900 transition hover:bg-white"
            >
              {t('finaleCta')}
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
