import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useExperience } from '@/store/experienceStore';
import { scrollToChapter, scrollToTop } from '@/hooks/useScrollController';
import { QualitySelector } from '@/components/controls/QualitySelector';
import { LanguageToggle } from '@/components/controls/LanguageToggle';
import { YearCounter } from '@/components/timeline/YearCounter';
import { ERA_LINKS, ROUTE_LINKS } from './navItems';
import { useTr } from '@/i18n';
import { useEffect } from 'react';

/** Accessible animated mobile drawer. Closes on Escape and after navigation. */
export function MobileNavigation() {
  const { t } = useTr();
  const open = useExperience((s) => s.menuOpen);
  const setOpen = useExperience((s) => s.setMenuOpen);
  const location = useLocation();
  const navigate = useNavigate();
  const onHome = location.pathname === '/' || location.pathname === '/timeline';

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, setOpen]);

  const goChapter = (id: string) => {
    setOpen(false);
    if (onHome) scrollToChapter(id);
    else navigate(`/#${id}`);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div
            className="absolute inset-0 bg-ink-900/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.nav
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 260 }}
            className="absolute right-0 top-0 flex h-full w-[min(85vw,20rem)] flex-col border-l border-white/10 bg-ink-800 p-6"
          >
            <div className="mb-8 flex items-center justify-between">
              <YearCounter compact />
              <button
                onClick={() => setOpen(false)}
                aria-label={t('navMenuClose')}
                className="rounded-full border border-white/15 p-2 text-bone"
              >
                <X size={16} />
              </button>
            </div>

            <button
              onClick={() => {
                setOpen(false);
                if (onHome) scrollToTop();
                else navigate('/');
              }}
              className="border-b border-white/5 py-3 text-left font-serif text-2xl text-bone"
            >
              {t('navTimeline')}
            </button>
            {ERA_LINKS.map((l) => (
              <button
                key={l.chapterId}
                onClick={() => goChapter(l.chapterId)}
                className="border-b border-white/5 py-3 text-left font-serif text-2xl text-bone/90"
              >
                {t(l.labelKey)}
              </button>
            ))}
            {ROUTE_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="border-b border-white/5 py-3 text-left font-serif text-2xl text-bone/90"
              >
                {t(l.labelKey)}
              </Link>
            ))}

            <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
              <LanguageToggle />
              <QualitySelector />
            </div>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
