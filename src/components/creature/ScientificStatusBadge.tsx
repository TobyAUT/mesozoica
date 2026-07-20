import { cn } from '@/utils/cn';
import { statusLabel } from '@/utils/scientificStatus';
import type { Creature } from '@/data/types';
import { useTr } from '@/i18n';

const TONE: Record<string, string> = {
  verified: 'border-emerald-400/40 text-emerald-200 bg-emerald-400/10',
  generic: 'border-amber-400/40 text-amber-200 bg-amber-400/10',
  stylized: 'border-fuchsia-400/40 text-fuchsia-200 bg-fuchsia-400/10',
  uncertain: 'border-orange-400/40 text-orange-200 bg-orange-400/10',
  groupScene: 'border-sky-400/40 text-sky-200 bg-sky-400/10',
  nonDinosaur: 'border-cyan-400/40 text-cyan-200 bg-cyan-400/10',
};

export function ScientificStatusBadge({
  creature,
  className,
}: {
  creature: Pick<Creature, 'scientificStatus' | 'creatureGroup'>;
  className?: string;
}) {
  const tr = useTr();
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.68rem] font-medium tracking-wide',
        TONE[creature.scientificStatus],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {tr.status(statusLabel(creature))}
    </span>
  );
}
