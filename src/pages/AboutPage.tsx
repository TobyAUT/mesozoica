import { PageShell } from './PageShell';
import { useTr } from '@/i18n';

export default function AboutPage() {
  const { t, list } = useTr();
  return (
    <PageShell title={t('aboutTitle')} intro={t('aboutIntro')}>
      <div className="prose-invert max-w-2xl space-y-6 text-bone/75">
        <p>{t('aboutLead')}</p>
        <div>
          <h2 className="type-title mb-3 text-2xl text-bone">{t('aboutPrinciplesTitle')}</h2>
          <ul className="space-y-2 text-sm">
            {list('aboutPrinciples').map((item) => (
              <li key={item}>— {item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="type-title mb-3 text-2xl text-bone">{t('aboutBuiltWithTitle')}</h2>
          <p className="text-sm">{t('aboutBuiltWith')}</p>
        </div>
        <div>
          <h2 className="type-title mb-3 text-2xl text-bone">{t('aboutA11yTitle')}</h2>
          <p className="text-sm">{t('aboutA11y')}</p>
        </div>
      </div>
    </PageShell>
  );
}
