import { useEffect, useRef } from 'react';
import { CHAPTERS } from '@/data/eras';
import { CREATURE_BY_ID } from '@/data/creatures';
import { CHAPTER_RANGES } from '@/utils/timeline';
import { SCROLL_PROGRESS_EVENT, scrollRef } from '@/store/scrollRef';
import { useExperience } from '@/store/experienceStore';
import { scrollToChapter } from '@/hooks/useScrollController';
import { cn } from '@/utils/cn';

// Every timeline point gets its own colour, anchored on the chapter's geological period so the
// strip still reads by era (Triassic rust, Jurassic gold, Cretaceous teal, extinction red). Within
// each period family the points fan across a small hue + lightness range by their order, so no two
// collide and the gradient flows from early (deep) to late (bright).
const ACCENT_BASE: Record<string, { h: number; s: number }> = {
  triassic: { h: 20, s: 62 },
  jurassic: { h: 44, s: 58 },
  cretaceous: { h: 176, s: 46 },
  extinction: { h: 8, s: 78 },
};
// Order of chapter ids within each accent family, so each point knows its position in the ramp.
const ACCENT_ORDER = CHAPTER_RANGES.reduce<Record<string, string[]>>((acc, { chapter }) => {
  (acc[chapter.accent] ??= []).push(chapter.id);
  return acc;
}, {});
// One smooth top→bottom gradient through the era palette (Triassic rust → Jurassic gold →
// Cretaceous teal → extinction red) shared by the faint track and the vivid progress fill.
const ERA_GRADIENT =
  'linear-gradient(to bottom, #d4794a 0%, #cbab55 34%, #74c0ba 68%, #d97b48 100%)';

function chapterDotColor(accent: string, id: string): string {
  const base = ACCENT_BASE[accent] ?? ACCENT_BASE.cretaceous;
  const family = ACCENT_ORDER[accent] ?? [id];
  const t = family.length > 1 ? family.indexOf(id) / (family.length - 1) : 0.5;
  const h = base.h + (t - 0.5) * 40; // ±20° fan within the family
  const l = 44 + t * 22; // 44%–66% lightness, early → late
  return `hsl(${h}deg ${base.s}% ${l}%)`;
}

/**
 * Fixed vertical geological timeline (desktop). Shows era/creature markers, the active marker,
 * and a progress fill driven each frame from the scroll ref (no re-render). Click or keyboard to
 * jump. Hidden on small screens where a compact horizontal bar is used instead.
 */
export function GeologicalTimeline() {
  const fillRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef(new Map<string, HTMLSpanElement>());
  const activeId = useExperience((s) => s.activeChapterId);

  useEffect(() => {
    const update = () => {
      const progress = scrollRef.progress;
      if (fillRef.current) fillRef.current.style.height = `${progress * 100}%`;

      // Keep the active point filled as before, then retain that point's own colour once its
      // chapter has been completed. This turns the dots into a cumulative reading trail.
      CHAPTER_RANGES.forEach(({ chapter, start, end }) => {
        const dot = dotRefs.current.get(chapter.id);
        if (!dot) return;
        const isCurrent = progress >= start && progress < end;
        const isComplete = progress >= end;
        dot.style.backgroundColor =
          isCurrent || isComplete ? chapterDotColor(chapter.accent, chapter.id) : '#0b0c0e';
      });
    };
    update();
    window.addEventListener(SCROLL_PROGRESS_EVENT, update);
    return () => window.removeEventListener(SCROLL_PROGRESS_EVENT, update);
  }, []);

  return (
    <nav
      aria-label="Geological timeline"
      className="pointer-events-auto fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 lg:block"
    >
      <div className="relative flex flex-col gap-1" style={{ height: '66vh' }}>
        {/* Faint full-height era gradient as the track… */}
        <div
          className="absolute left-[7px] top-0 h-full w-[3px] rounded-full opacity-30"
          style={{ background: ERA_GRADIENT }}
        />
        {/* …and the same gradient at full strength revealed by scroll progress. The inner layer
            is fixed at track height so the colours stay in place while the clip grows. */}
        <div
          ref={fillRef}
          className="absolute left-[7px] top-0 w-[3px] overflow-hidden rounded-full shadow-[0_0_12px_rgba(90,154,151,0.65)]"
          style={{ height: '0%' }}
        >
          <div className="w-full" style={{ height: '66vh', background: ERA_GRADIENT }} />
        </div>
        <ul className="relative flex h-full flex-col justify-between">
          {CHAPTER_RANGES.map(({ chapter }) => {
            const creature = chapter.creatureId ? CREATURE_BY_ID[chapter.creatureId] : null;
            const label =
              creature?.displayName ??
              chapter.title ??
              chapter.id;
            const isActive = chapter.id === activeId;
            const dotColor = chapterDotColor(chapter.accent, chapter.id);
            return (
              <li key={chapter.id} className="group flex items-center">
                <button
                  onClick={() => scrollToChapter(chapter.id)}
                  aria-current={isActive ? 'true' : undefined}
                  className="flex items-center gap-3 focus-visible:outline-none"
                >
                  <span
                    ref={(node) => {
                      if (node) dotRefs.current.set(chapter.id, node);
                      else dotRefs.current.delete(chapter.id);
                    }}
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
    const update = () => {
      if (fillRef.current) fillRef.current.style.width = `${scrollRef.progress * 100}%`;
    };
    update();
    window.addEventListener(SCROLL_PROGRESS_EVENT, update);
    return () => window.removeEventListener(SCROLL_PROGRESS_EVENT, update);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 px-4 pb-3 lg:hidden">
      <div className="flex items-center justify-between px-1 pb-1.5 text-[0.62rem]">
        <span className="type-eyebrow text-cretaceous">{chapter.title}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
        <div ref={fillRef} className="h-full bg-gradient-to-r from-jurassic to-cretaceous" style={{ width: '0%' }} />
      </div>
    </div>
  );
}
