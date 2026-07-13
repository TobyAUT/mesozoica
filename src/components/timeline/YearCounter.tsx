import { useEffect, useRef } from 'react';
import { scrollRef } from '@/store/scrollRef';
import { myaAtProgress, formatMya } from '@/utils/timeline';
import { cn } from '@/utils/cn';

/**
 * Live "millions of years ago" read-out. Reads scroll progress from the ref each frame and
 * writes straight to the DOM — deliberately NOT React state, to avoid per-frame re-renders.
 */
export function YearCounter({ className, compact = false }: { className?: string; compact?: boolean }) {
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame = 0;
    let last = '';
    const tick = () => {
      const value = formatMya(myaAtProgress(scrollRef.progress));
      if (value !== last && numRef.current) {
        numRef.current.textContent = value;
        last = value;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
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
        million years ago
      </span>
    </div>
  );
}
