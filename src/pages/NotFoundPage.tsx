import { Link } from 'react-router-dom';
import { PageShell } from './PageShell';
import { useTr } from '@/i18n';

export default function NotFoundPage() {
  const { t } = useTr();
  return (
    <PageShell title={t('notFoundTitle')} intro={t('notFoundIntro')}>
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-full bg-bone px-5 py-2.5 text-sm font-medium text-ink-900 transition hover:bg-white"
      >
        {t('notFoundCta')}
      </Link>
    </PageShell>
  );
}
