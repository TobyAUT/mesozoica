import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Command, Menu } from 'lucide-react';
import { useExperience } from '@/store/experienceStore';
import { scrollToChapter, scrollToTop } from '@/hooks/useScrollController';
import { YearCounter } from '@/components/timeline/YearCounter';
import { QualitySelector } from '@/components/controls/QualitySelector';
import { LanguageToggle } from '@/components/controls/LanguageToggle';
import { ERA_LINKS, ROUTE_LINKS } from './navItems';
import { useTr } from '@/i18n';
import { cn } from '@/utils/cn';

/** Translucent fixed top navigation with era jumps, route links, live counter, and controls. */
export function MainNavigation() {
  const { t } = useTr();
  const location = useLocation();
  const navigate = useNavigate();
  const activeChapterId = useExperience((s) => s.activeChapterId);
  const setMenuOpen = useExperience((s) => s.setMenuOpen);
  const setCommandOpen = useExperience((s) => s.setCommandOpen);
  const onHome = location.pathname === '/' || location.pathname === '/timeline';
  const solidNav = !onHome || activeChapterId !== 'prologue';

  const goChapter = (id: string) => {
    if (onHome) scrollToChapter(id);
    else navigate(`/#${id}`);
  };

  return (
    <header className="main-nav pointer-events-none fixed inset-x-0 top-0 z-40 px-3 pt-3">
      <motion.div
        animate={{
          backgroundColor: solidNav ? 'rgba(28, 47, 43, 0.94)' : 'rgba(15, 19, 21, 0.82)',
          borderColor: solidNav ? 'rgba(127, 175, 158, 0.34)' : 'rgba(255, 255, 255, 0.15)',
        }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="pointer-events-auto mx-auto flex max-w-[1600px] items-center justify-between gap-3 rounded-2xl border px-5 py-3 shadow-[0_12px_38px_rgba(0,0,0,0.32)] backdrop-blur-xl"
      >
        {/* Wordmark */}
        <button
          onClick={() => (onHome ? scrollToTop() : navigate('/'))}
          className="nav-wordmark flex items-center gap-2.5 font-serif text-2xl tracking-tight text-bone"
        >
          <span className="inline-block h-2 w-2 rounded-full bg-cretaceous" />
          Mesozoica
        </button>

        {/* Center links (desktop) */}
        <nav className="hidden items-center gap-0.5 rounded-full border border-white/15 bg-black/25 px-1.5 py-1 shadow-inner lg:flex">
          <button
            onClick={() => (onHome ? scrollToTop() : navigate('/'))}
            className="rounded-full px-2.5 py-1.5 text-[0.82rem] font-medium text-bone/80 transition hover:bg-white/10 hover:text-white"
          >
            {t('navTimeline')}
          </button>
          {ERA_LINKS.map((l) => (
            <button
              key={l.chapterId}
              onClick={() => goChapter(l.chapterId)}
              className={cn(
                'relative rounded-full px-2.5 py-1.5 text-[0.82rem] font-medium transition hover:bg-white/10 hover:text-white',
                activeChapterId === l.chapterId ? 'text-white' : 'text-bone/75',
              )}
            >
              {t(l.labelKey)}
              {/* Static underline (no shared-layout animation → no scroll jitter). */}
              <span
                className={cn(
                  'absolute inset-x-2 -bottom-0.5 h-px bg-cretaceous transition-opacity duration-200',
                  activeChapterId === l.chapterId ? 'opacity-100' : 'opacity-0',
                )}
              />
            </button>
          ))}
          <span className="mx-1 h-4 w-px bg-white/10" />
          {ROUTE_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                'rounded-full px-2.5 py-1.5 text-[0.82rem] font-medium transition hover:bg-white/10 hover:text-white',
                location.pathname === l.to ? 'text-white' : 'text-bone/75',
              )}
            >
              {t(l.labelKey)}
            </Link>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-1.5">
          <YearCounter className="mr-1 hidden xl:flex" compact />
          <button
            onClick={() => setCommandOpen(true)}
            aria-label="Open command palette"
            className="hidden items-center gap-1.5 rounded-full border border-white/20 bg-black/10 px-3 py-1.5 text-[0.82rem] text-bone/80 transition hover:border-white/40 hover:text-white sm:inline-flex"
          >
            <Command size={13} /> <span className="hidden md:inline">{t('navJumpTo')}</span>
          </button>
          <div className="hidden sm:block">
            <QualitySelector />
          </div>
          <button
            onClick={() => setMenuOpen(true)}
            aria-label={t('navMenuOpen')}
            className="inline-flex items-center justify-center rounded-full border border-white/15 p-2 text-bone transition hover:border-white/30 lg:hidden"
          >
            <Menu size={16} />
          </button>
          {/* Outermost control: flips the entire site between English and German. */}
          <LanguageToggle />
        </div>
      </motion.div>
    </header>
  );
}
