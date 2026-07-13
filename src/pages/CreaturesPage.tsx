import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { PageShell } from './PageShell';
import { CREATURES } from '@/data/creatures';
import { ScientificStatusBadge } from '@/components/creature/ScientificStatusBadge';
import { useExperience } from '@/store/experienceStore';
import { formatMya } from '@/utils/timeline';
import { cn } from '@/utils/cn';

/** Grid explorer of every manifest entry, filterable, honest about pending/stylised models. */
export default function CreaturesPage() {
  const scientificMode = useExperience((s) => s.scientificMode);
  const [showPending, setShowPending] = useState(true);

  const list = useMemo(() => {
    return CREATURES.filter((c) => {
      if (scientificMode && c.hideInScientificMode) return false;
      if (!showPending && (!c.enabled || !c.modelPath)) return false;
      return true;
    });
  }, [scientificMode, showPending]);

  return (
    <PageShell
      title="Creature explorer"
      intro="Every specimen in the collection — those rendered live in the timeline, and those awaiting a model. Species identity is kept separate from model quality throughout."
    >
      <div className="mb-8 flex flex-wrap items-center gap-3 text-xs">
        <label className="inline-flex items-center gap-2 text-muted">
          <input
            type="checkbox"
            checked={showPending}
            onChange={(e) => setShowPending(e.target.checked)}
            className="accent-cretaceous"
          />
          Show specimens awaiting a model
        </label>
        <span className="text-muted">
          {list.filter((c) => c.enabled && c.modelPath).length} live · {list.length} total
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((c, i) => {
          const live = c.enabled && !!c.modelPath;
          return (
            <motion.article
              key={c.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.05 }}
              className={cn(
                'flex flex-col rounded-2xl border border-white/10 bg-ink-800/50 p-5',
                !live && 'opacity-70',
              )}
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <ScientificStatusBadge creature={c} />
                {!live && (
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-[0.6rem] text-muted">
                    Pending
                  </span>
                )}
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
                    : '—'}
                </span>
              </div>
              {live && (
                <Link
                  to={`/timeline#${c.id}`}
                  className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs text-bone/80 transition hover:border-white/40 hover:text-bone"
                >
                  View in timeline
                </Link>
              )}
            </motion.article>
          );
        })}
      </div>
    </PageShell>
  );
}
