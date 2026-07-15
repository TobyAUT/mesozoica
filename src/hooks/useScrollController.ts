import { useEffect } from 'react';
import Lenis from 'lenis';
import { notifyScrollProgress, scrollRef } from '@/store/scrollRef';
import { useExperience } from '@/store/experienceStore';
import { resolveChapter, progressForChapterId } from '@/utils/timeline';

let lenisInstance: Lenis | null = null;

function documentProgress(): number {
  const el = document.documentElement;
  const max = el.scrollHeight - el.clientHeight;
  return max > 0 ? el.scrollTop / max : 0;
}

/**
 * Core scroll driver. Runs once (mounted by the experience page). Uses Lenis smooth scrolling on
 * capable devices and passive native scrolling on low-power/reduced-motion devices. Progress lives
 * in `scrollRef`; only discrete chapter changes enter the store.
 */
export function useScrollController(reducedMotion: boolean, lowPower = false): void {
  const setActive = useExperience((s) => s.setActive);

  useEffect(() => {
    let lastChapterId = '';
    let lastHash = '';

    const updateProgress = (velocity = 0) => {
      const p = documentProgress();
      scrollRef.progress = p;
      scrollRef.velocity = velocity;
      if (reducedMotion || lowPower) scrollRef.damped = p;

      const { range } = resolveChapter(p);
      const chapter = range.chapter;
      if (chapter.id !== lastChapterId) {
        lastChapterId = chapter.id;
        const creatureId =
          chapter.kind === 'creature' || chapter.kind === 'marine'
            ? (chapter.creatureId ?? null)
            : null;
        setActive(chapter.id, creatureId);

        // Reflect creature chapters in the URL hash for deep links, without adding history entries.
        const hash = creatureId ? `#${chapter.id}` : '';
        if (hash !== lastHash) {
          lastHash = hash;
          window.history.replaceState(null, '', `${location.pathname}${location.search}${hash}`);
        }
      }
      notifyScrollProgress();
    };

    // Low-power and reduced-motion modes use the browser's native passive scroll path. This avoids
    // keeping Lenis and animation-frame smoothing alive for the entire visit.
    if (reducedMotion || lowPower) {
      const onNativeScroll = () => updateProgress();
      lenisInstance = null;
      window.addEventListener('scroll', onNativeScroll, { passive: true });
      window.addEventListener('resize', onNativeScroll);
      updateProgress();
      return () => {
        window.removeEventListener('scroll', onNativeScroll);
        window.removeEventListener('resize', onNativeScroll);
      };
    }

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      // Gentle easing; no aggressive hijacking.
      easing: (t) => 1 - Math.pow(1 - t, 3),
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });
    lenisInstance = lenis;
    const onScroll = () => updateProgress(lenis.velocity);

    lenis.on('scroll', onScroll);

    // One shared frame loop drives Lenis and camera damping; no GSAP ticker or second rAF needed.
    let frame = 0;
    const animate = (time: number) => {
      lenis.raf(time);
      scrollRef.damped += (scrollRef.progress - scrollRef.damped) * 0.08;
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);

    updateProgress();

    return () => {
      lenis.off('scroll', onScroll);
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisInstance = null;
    };
  }, [lowPower, reducedMotion, setActive]);
}

/** Programmatic navigation used by the timeline, nav links, and command palette. */
export function scrollToChapter(id: string, immediate = false): void {
  const el = document.documentElement;
  const max = el.scrollHeight - el.clientHeight;
  const section = document.getElementById(id);
  const p = progressForChapterId(id);
  if (!section && p == null) return;
  const targetY = section
    ? Math.min(
        max,
        Math.max(
          0,
          section.getBoundingClientRect().top +
            window.scrollY +
            section.offsetHeight / 2 -
            window.innerHeight / 2,
        ),
      )
    : p! * max;
  if (lenisInstance) lenisInstance.scrollTo(targetY, { immediate, duration: immediate ? 0 : 1.4 });
  else window.scrollTo({ top: targetY, behavior: immediate ? 'auto' : 'smooth' });
}

export function scrollToTop(): void {
  if (lenisInstance) lenisInstance.scrollTo(0, { immediate: false });
  else window.scrollTo({ top: 0, behavior: 'smooth' });
}
