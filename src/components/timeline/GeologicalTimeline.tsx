import { useEffect, useRef } from 'react';
import { CHAPTERS } from '@/data/eras';
import { CREATURE_BY_ID } from '@/data/creatures';
import { CHAPTER_RANGES } from '@/utils/timeline';
import { scrollRef } from '@/store/scrollRef';
import { useExperience } from '@/store/experienceStore';
import { scrollToChapter } from '@/hooks/useScrollController';
import { cn } from '@/utils/cn';

// Base hue/saturation per era; each point then varies within its family so every marker on the
// strip has its own distinct accent colour (index-driven, stays on-theme).
const ACCENT_HUE: Record<string, number> = { triassic: 20, jurassic: 48, cretaceous: 176, extinction: 24 };
const ACCENT_SAT: Record<string, number> = { triassic: 62, jurassic: 54, cretaceous: 46, extinction: 74 };
function chapterDotColor(accent: string, index: number): string {
  const h = (ACCENT_HUE[accent] ?? 176) + ((index * 13) % 44) - 22;
  const l = 46 + ((index * 9) % 26);
  return `hsl(${h}deg, ${ACCENT_SAT[accent] ?? 46}%, ${l}%)`;
}

/**
 * Fixed vertical geological timeline (desktop). Shows era/creature markers, the active marker,
 * and a progress fill driven each frame from the scroll ref (no re-render). Click or keyboard to
 * jump. Hidden on small screens where a compact horizontal bar is used instead.
 */
export function GeologicalTimeline() {
  const fillRef = useRef<HTMLDivElement>(null);
  const activeId = useExperience((s) => s.activeChapterId);

  useEffect(() => {
    let frame = 0;
    const tick = () => {
      if (fillRef.current) fillRef.current.style.height = `${scrollRef.progress * 100}%`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <nav
      aria-label="Geological timeline"
      className="pointer-events-auto fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 lg:block"
    >
      <div className="relative flex flex-col gap-1" style={{ height: '66vh' }}>
        <div className="absolute left-[7px] top-0 h-full w-[3px] rounded-full bg-white/25" />
        <div
          ref={fillRef}
          className="absolute left-[7px] top-0 w-[3px] rounded-full bg-gradient-to-b from-cretaceous via-jurassic to-extinction shadow-[0_0_12px_rgba(90,154,151,0.65)]"
          style={{ height: '0%' }}
        />
        <ul className="relative flex h-full flex-col justify-between">
          {CHAPTER_RANGES.map(({ chapter }, index) => {
            const creature = chapter.creatureId ? CREATURE_BY_ID[chapter.creatureId] : null;
            const label =
              creature?.displayName ??
              chapter.title ??
              chapter.id;
            const isActive = chapter.id === activeId;
            const dotColor = chapterDotColor(chapter.accent, index);
            return (
              <li key={chapter.id} className="group flex items-center">
                <button
                  onClick={() => scrollToChapter(chapter.id)}
                  aria-current={isActive ? 'true' : undefined}
                  className="flex items-center gap-3 focus-visible:outline-none"
                >
                  <span
                    className={cn(
                      'relative z-10 block h-4 w-4 rounded-full border-2 transition-all',
                      isActive ? 'scale-[1.65] shadow-[0_0_14px_currentColor]' : 'scale-100 group-hover:scale-125',
                    )}
                    style={{
                      backgroundColor: isActive ? dotColor : '#0b0c0e',
                      borderColor: dotColor,
                    }}
                  />
                  <span
                    className={cn(
                      'whitespace-nowrap text-sm font-medium transition-all',
                      isActive
                        ? 'text-bone opacity-100'
                        : 'text-muted opacity-0 group-hover:opacity-100',
                    )}
                  >
                    {label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

/** Compact horizontal progress + era label for mobile. */
export function MobileTimelineBar() {
  const fillRef = useRef<HTMLDivElement>(null);
  const activeId = useExperience((s) => s.activeChapterId);
  const chapter = CHAPTERS.find((c) => c.id === activeId) ?? CHAPTERS[0];

  useEffect(() => {
    let frame = 0;
    const tick = () => {
      if (fillRef.current) fillRef.current.style.width = `${scrollRef.progress * 100}%`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 px-4 pb-3 lg:hidden">
      <div className="flex items-center justify-between px-1 pb-1.5 text-[0.62rem]">
        <span className="type-eyebrow text-muted">{chapter.title}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
        <div ref={fillRef} className="h-full bg-gradient-to-r from-jurassic to-cretaceous" style={{ width: '0%' }} />
      </div>
    </div>
  );
}
