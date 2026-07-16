import { useEffect, useRef } from 'react';
import { SCROLL_PROGRESS_EVENT, scrollRef } from '@/store/scrollRef';
import { myaAtProgress, formatMya } from '@/utils/timeline';
import { useTr } from '@/i18n';
import { cn } from '@/utils/cn';

/**
 * Live "millions of years ago" read-out. Reads scroll progress from the ref each frame and
 * writes straight to the DOM — deliberately NOT React state, to avoid per-frame re-renders.
 */
export function YearCounter({ className, compact = false }: { className?: string; compact?: boolean }) {
  const numRef = useRef<HTMLSpanElement>(null);
  const { t } = useTr();

  useEffect(() => {
    let last = '';
    const update = () => {
      const value = formatMya(myaAtProgress(scrollRef.progress));
      if (value !== last && numRef.current) {
        numRef.current.textContent = value;
        last = value;
      }
    };
    update();
    window.addEventListener(SCROLL_PROGRESS_EVENT, update);
    return () => window.removeEventListener(SCROLL_PROGRESS_EVENT, update);
  }, []);

  return (
    <div className={cn('flex items-baseline gap-1.5 tabular-nums', className)}>
      <span
        ref={numRef}
        className={cn('font-serif tracking-tight text-bone', compact ? 'text-lg' : 'text-2xl')}
      >
        252
      </span>
      <span className={cn('text-muted', compact ? 'text-[0.6rem]' : 'text-xs')}>
        {t('yearsAgo')}
      </span>
    </div>
  );
}
