import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ROUTE_LINKS } from '@/components/navigation/navItems';
import { LanguageToggle } from '@/components/controls/LanguageToggle';
import { useTr } from '@/i18n';
import { cn } from '@/utils/cn';
import type { ReactNode } from 'react';

/** Static page chrome for the secondary routes (no WebGL canvas). */
export function PageShell({
  children,
  title,
  intro,
}: {
  children: ReactNode;
  title: string;
  intro?: string;
}) {
  const location = useLocation();
  const { t } = useTr();
  return (
    <div className="min-h-screen bg-ink-900 text-bone">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-900/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <Link to="/" className="flex items-center gap-2 font-serif text-lg tracking-tight">
            <span className="inline-block h-2 w-2 rounded-full bg-cretaceous" />
            Mesozoica
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            {ROUTE_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  'rounded-full px-3 py-1.5 text-xs transition hover:text-bone',
                  location.pathname === l.to ? 'text-bone' : 'text-muted',
                )}
              >
                {t(l.labelKey)}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs text-muted transition hover:text-bone"
            >
              <ArrowLeft size={13} /> {t('navTimeline')}
            </Link>
            <LanguageToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-12 max-w-2xl">
          <h1 className="type-title mb-4 text-bone">{title}</h1>
          {intro && <p className="text-lg leading-relaxed text-bone/70">{intro}</p>}
        </div>
        {children}
      </main>

      <footer className="mx-auto max-w-3xl space-y-2 border-t border-white/5 px-6 py-8 text-center text-xs text-muted">
        <p>{t('shellFooterEdu')}</p>
        <p>{t('shellFooterAi')}</p>
        <p>{t('shellFooterPrivacy')}</p>
      </footer>
    </div>
  );
}
