import { PageShell } from './PageShell';
import { statusLabel } from '@/components/creature/ScientificStatusBadge';
import { useTr } from '@/i18n';
import type { Creature } from '@/data/types';

const STATUSES: {
  status: Creature['scientificStatus'];
  group: Creature['creatureGroup'];
  desc: string;
}[] = [
  {
    status: 'verified',
    group: 'theropod',
    desc: 'The species/genus name is well established. Note: this rates the identity, not the accuracy of this particular mesh.',
  },
  {
    status: 'generic',
    group: 'sauropod',
    desc: 'The model represents a real group but the source establishes no specific genus. We do not invent one.',
  },
  {
    status: 'uncertain',
    group: 'theropod',
    desc: 'The source tags a species, but the identification is not confidently supported. Presented cautiously.',
  },
  {
    status: 'stylized',
    group: 'stylized',
    desc: 'A fictional or fantasy creature. Not a real animal; hidden when scientific mode is on.',
  },
  {
    status: 'nonDinosaur',
    group: 'pterosaur',
    desc: 'A prehistoric animal that was NOT a dinosaur — e.g. a pterosaur, marine reptile, or bird.',
  },
  {
    status: 'groupScene',
    group: 'mixed',
    desc: 'A scene containing several animals; individual species are only named after inspecting the model.',
  },
];

export default function MethodologyPage() {
  const tr = useTr();
  const { t, list } = tr;
  return (
    <PageShell title={t('methodologyTitle')} intro={t('methodologyIntro')}>
      <div className="max-w-2xl space-y-8 text-bone/75">
        <section>
          <h2 className="type-title mb-3 text-2xl text-bone">{t('methodologyFactsTitle')}</h2>
          <ul className="space-y-2 text-sm">
            {list('methodologyFacts').map((item) => (
              <li key={item}>— {item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="type-title mb-4 text-2xl text-bone">{t('methodologyBadgesTitle')}</h2>
          <div className="space-y-3">
            {STATUSES.map((s) => (
              <div key={s.status} className="rounded-xl border border-white/10 bg-ink-800/50 p-4">
                <div className="mb-1 text-sm font-medium text-bone">
                  {tr.status(statusLabel({ scientificStatus: s.status, creatureGroup: s.group }))}
                </div>
                <p className="text-sm text-bone/70">{tr.methodologyDesc(s.status, s.desc)}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="type-title mb-3 text-2xl text-bone">{t('methodologyNotAllTitle')}</h2>
          <p className="text-sm">{t('methodologyNotAll')}</p>
        </section>
      </div>
    </PageShell>
  );
}
