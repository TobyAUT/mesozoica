import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Bird, Info, ScrollText, BookOpen } from 'lucide-react';
import { useExperience } from '@/store/experienceStore';
import { scrollToChapter, setScrollLocked } from '@/hooks/useScrollController';
import { CHAPTERS } from '@/data/eras';
import { CREATURE_BY_ID } from '@/data/creatures';
import { useTr } from '@/i18n';

interface Item {
  id: string;
  label: string;
  hint: string;
  icon: React.ReactNode;
  run: () => void;
}

/** Cmd/Ctrl+K palette: jump to any era/creature or open a secondary page. */
export function CommandPalette() {
  const tr = useTr();
  const { t } = tr;
  const open = useExperience((s) => s.commandOpen);
  const setOpen = useExperience((s) => s.setCommandOpen);
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);

  const items = useMemo<Item[]>(() => {
    const onHome = location.pathname === '/' || location.pathname === '/timeline';
    const goChapter = (id: string) => {
      setOpen(false);
      if (onHome) scrollToChapter(id);
      else navigate(`/#${id}`);
    };
    const chapterItems: Item[] = CHAPTERS.map((c) => {
      const creature = c.creatureId ? CREATURE_BY_ID[c.creatureId] : null;
      return {
        id: `chapter-${c.id}`,
        label: creature?.displayName ?? tr.chapterTitle(c),
        hint: creature ? tr.period(creature.period) : t('paletteHintChapter'),
        icon: creature ? <Bird size={15} /> : <ScrollText size={15} />,
        run: () => goChapter(c.id),
      };
    });
    const actions: Item[] = [
      {
        id: 'creatures',
        label: t('paletteCreatures'),
        hint: t('paletteHintPage'),
        icon: <Bird size={15} />,
        run: () => {
          navigate('/creatures');
          setOpen(false);
        },
      },
      {
        id: 'methodology',
        label: t('paletteMethodology'),
        hint: t('paletteHintPage'),
        icon: <BookOpen size={15} />,
        run: () => {
          navigate('/methodology');
          setOpen(false);
        },
      },
      {
        id: 'credits',
        label: t('paletteCredits'),
        hint: t('paletteHintPage'),
        icon: <Info size={15} />,
        run: () => {
          navigate('/credits');
          setOpen(false);
        },
      },
    ];
    return [...chapterItems, ...actions];
  }, [location.pathname, navigate, setOpen, t, tr]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => `${i.label} ${i.hint}`.toLowerCase().includes(q));
  }, [items, query]);

  // Global Cmd/Ctrl+K shortcut.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(!open);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, setOpen]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setCursor(0);
    }
    // While the palette is open the wheel must scroll the RESULT LIST, not the page behind it:
    // pause Lenis (it owns the wheel globally) and let the list scroll natively.
    setScrollLocked(open);
    return () => setScrollLocked(false);
  }, [open]);

  useEffect(() => {
    setCursor(0);
  }, [query]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[15vh]"
          role="dialog"
          aria-modal="true"
          aria-label={t('paletteAria')}
        >
          <div
            className="absolute inset-0 bg-ink-900/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-ink-800/95 shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <Search size={16} className="text-muted" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') setCursor((c) => Math.min(filtered.length - 1, c + 1));
                  if (e.key === 'ArrowUp') setCursor((c) => Math.max(0, c - 1));
                  if (e.key === 'Enter') filtered[cursor]?.run();
                }}
                placeholder={t('palettePlaceholder')}
                className="w-full bg-transparent text-sm text-bone placeholder:text-muted focus:outline-none"
              />
            </div>
            <ul data-lenis-prevent className="max-h-[50vh] overflow-y-auto py-2">
              {filtered.length === 0 && (
                <li className="px-4 py-6 text-center text-sm text-muted">
                  {t('paletteNoMatches')}
                </li>
              )}
              {filtered.map((i, idx) => (
                <li key={i.id}>
                  <button
                    onMouseEnter={() => setCursor(idx)}
                    onClick={i.run}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition ${
                      idx === cursor ? 'bg-white/5' : ''
                    }`}
                  >
                    <span className="text-cretaceous">{i.icon}</span>
                    <span className="flex-1 text-sm text-bone">{i.label}</span>
                    <span className="text-[0.66rem] text-muted">{i.hint}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
