import { useState, useRef, useEffect } from 'react';
import { Gauge, Check } from 'lucide-react';
import { useExperience, type Quality } from '@/store/experienceStore';
import { useTr } from '@/i18n';
import type { StringKey } from '@/i18n/strings';
import { cn } from '@/utils/cn';

const OPTIONS: { value: Quality; labelKey: StringKey }[] = [
  { value: 'auto', labelKey: 'qualityAuto' },
  { value: 'high', labelKey: 'qualityHigh' },
  { value: 'balanced', labelKey: 'qualityBalanced' },
  { value: 'low', labelKey: 'qualityLow' },
];

export function QualitySelector() {
  const quality = useExperience((s) => s.quality);
  const setQuality = useExperience((s) => s.setQuality);
  const { t } = useTr();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('qualityAria')}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-xs text-muted transition hover:border-white/30 hover:text-bone"
      >
        <Gauge size={14} />
        <span>{t(OPTIONS.find((o) => o.value === quality)!.labelKey)}</span>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-50 mt-2 w-36 overflow-hidden rounded-xl border border-white/10 bg-ink-800/95 py-1 shadow-2xl backdrop-blur-md"
        >
          {OPTIONS.map((o) => (
            <li key={o.value}>
              <button
                role="option"
                aria-selected={quality === o.value}
                onClick={() => {
                  setQuality(o.value);
                  setOpen(false);
                }}
                className={cn(
                  'flex w-full items-center justify-between px-3 py-2 text-left text-sm transition hover:bg-white/5',
                  quality === o.value ? 'text-bone' : 'text-muted',
                )}
              >
                {t(o.labelKey)}
                {quality === o.value && <Check size={14} className="text-cretaceous" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
