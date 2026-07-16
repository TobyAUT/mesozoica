import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { PageShell } from './PageShell';
import { CREATURES } from '@/data/creatures';
import { CHAPTERS } from '@/data/eras';
import { ScientificStatusBadge } from '@/components/creature/ScientificStatusBadge';
import { formatMya } from '@/utils/timeline';
import { useTr } from '@/i18n';

/** Grid explorer of every live model-backed manifest entry. */
export default function CreaturesPage() {
  const tr = useTr();
  const { t } = tr;

  const list = CREATURES.map((creature) => ({
    creature,
    chapterId: CHAPTERS.find((chapter) => chapter.creatureId === creature.id)?.id ?? creature.id,
  }));

  return (
    <PageShell title={t('creaturesTitle')} intro={t('creaturesIntro')}>
      <div className="mb-8 flex flex-wrap items-center gap-3 text-xs">
        <span className="text-muted">
          {list.length} {t('creaturesCount')}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map(({ creature: c, chapterId }, i) => (
          <motion.article
            key={c.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.05 }}
            className="flex min-w-0 flex-col rounded-2xl border border-white/10 bg-ink-800/50 p-5"
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <ScientificStatusBadge creature={c} />
            </div>
            {/* `.type-title` carries its own clamp(1.75rem, 4.5vw, 3.5rem) and beats a plain
                `text-xl`, so long names ("Velociraptor-like Dromaeosaur") rendered at ~56px and
                spilled out of the card. Force the size and let long words break. */}
            <h3 className="type-title mb-1 !text-xl !leading-snug break-words text-bone">
              {c.displayName}
            </h3>
            {c.scientificName && (
              <p className="mb-3 break-words font-serif text-sm italic text-muted">
                {c.scientificName}
              </p>
            )}
            <p className="mb-4 flex-1 text-sm leading-relaxed text-bone/70">
              {tr.creatureDescription(c)}
            </p>
            <div className="flex items-center justify-between text-[0.68rem] text-muted">
              <span>{tr.period(c.period)}</span>
              <span>
                {c.approximateTimeStartMya != null
                  ? `${formatMya(c.approximateTimeStartMya)} Mya`
                  : '-'}
              </span>
            </div>
            <Link
              to={`/timeline#${chapterId}`}
              className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs text-bone/80 transition hover:border-white/40 hover:text-bone"
            >
              {t('creaturesViewInTimeline')}
            </Link>
          </motion.article>
        ))}
      </div>
    </PageShell>
  );
}
