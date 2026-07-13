import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { PageShell } from './PageShell';
import { CREATURES } from '@/data/creatures';
import { CHAPTERS } from '@/data/eras';
import { ScientificStatusBadge } from '@/components/creature/ScientificStatusBadge';
import { useExperience } from '@/store/experienceStore';
import { formatMya } from '@/utils/timeline';

/** Grid explorer of every live model-backed manifest entry. */
export default function CreaturesPage() {
  const scientificMode = useExperience((s) => s.scientificMode);

  const list = useMemo(() => {
    return CREATURES.filter((c) => !(scientificMode && c.hideInScientificMode)).map((creature) => ({
      creature,
      chapterId: CHAPTERS.find((chapter) => chapter.creatureId === creature.id)?.id ?? creature.id,
    }));
  }, [scientificMode]);

  return (
    <PageShell
      title="Creature explorer"
      intro="Every model-backed specimen in the collection. Species identity is kept separate from model quality throughout."
    >
      <div className="mb-8 flex flex-wrap items-center gap-3 text-xs">
        <span className="text-muted">{list.length} live specimens</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map(({ creature: c, chapterId }, i) => (
          <motion.article
            key={c.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.05 }}
            className="flex flex-col rounded-2xl border border-white/10 bg-ink-800/50 p-5"
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <ScientificStatusBadge creature={c} />
            </div>
            <h3 className="type-title mb-1 text-xl text-bone">{c.displayName}</h3>
            {c.scientificName && (
              <p className="mb-3 font-serif text-sm italic text-muted">{c.scientificName}</p>
            )}
            <p className="mb-4 flex-1 text-sm leading-relaxed text-bone/70">
              {c.shortDescription}
            </p>
            <div className="flex items-center justify-between text-[0.68rem] text-muted">
              <span>{c.period}</span>
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
              View in timeline
            </Link>
          </motion.article>
        ))}
      </div>
    </PageShell>
  );
}
