import { PageShell } from './PageShell';
import { statusLabel } from '@/components/creature/ScientificStatusBadge';

const STATUSES: { status: 'verified' | 'generic' | 'stylized' | 'uncertain' | 'nonDinosaur' | 'groupScene'; group: any; desc: string }[] = [
  { status: 'verified', group: 'theropod', desc: 'The species/genus name is well established. Note: this rates the identity, not the accuracy of this particular mesh.' },
  { status: 'generic', group: 'sauropod', desc: 'The model represents a real group but the source establishes no specific genus. We do not invent one.' },
  { status: 'uncertain', group: 'theropod', desc: 'The source tags a species, but the identification is not confidently supported. Presented cautiously.' },
  { status: 'stylized', group: 'stylized', desc: 'A fictional or fantasy creature. Not a real animal; hidden when scientific mode is on.' },
  { status: 'nonDinosaur', group: 'pterosaur', desc: 'A prehistoric animal that was NOT a dinosaur — e.g. a pterosaur, marine reptile, or bird.' },
  { status: 'groupScene', group: 'mixed', desc: 'A scene containing several animals; individual species are only named after inspecting the model.' },
];

export default function MethodologyPage() {
  return (
    <PageShell
      title="Scientific methodology"
      intro="This is an educational site, so we are explicit about what we know, what we don't, and where each fact comes from."
    >
      <div className="max-w-2xl space-y-8 text-bone/75">
        <section>
          <h2 className="type-title mb-3 text-2xl text-bone">How we handle facts</h2>
          <ul className="space-y-2 text-sm">
            <li>— Every displayed fact is attributed to a reputable museum or science body.</li>
            <li>— Unverifiable details are shown as “To be verified”, never guessed.</li>
            <li>— Popular-media portrayals are never used as scientific evidence.</li>
            <li>— A model looking like a species is not treated as proof of that species.</li>
          </ul>
        </section>

        <section>
          <h2 className="type-title mb-4 text-2xl text-bone">Certainty badges</h2>
          <div className="space-y-3">
            {STATUSES.map((s) => (
              <div
                key={s.status}
                className="rounded-xl border border-white/10 bg-ink-800/50 p-4"
              >
                <div className="mb-1 text-sm font-medium text-bone">
                  {statusLabel({ scientificStatus: s.status, creatureGroup: s.group })}
                </div>
                <p className="text-sm text-bone/70">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="type-title mb-3 text-2xl text-bone">Not all of these are dinosaurs</h2>
          <p className="text-sm">
            Pterosaurs (flying reptiles), mosasaurs (marine reptiles), and even the birds are
            frequently lumped in with dinosaurs. We label each honestly: pterosaurs and marine
            reptiles were separate lineages, while birds are the one branch of dinosaurs still
            alive today.
          </p>
        </section>
      </div>
    </PageShell>
  );
}
