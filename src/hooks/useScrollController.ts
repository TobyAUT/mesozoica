import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollRef } from '@/store/scrollRef';
import { useExperience } from '@/store/experienceStore';
import { resolveChapter, progressForChapterId } from '@/utils/timeline';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;

function documentProgress(): number {
  const el = document.documentElement;
  const max = el.scrollHeight - el.clientHeight;
  return max > 0 ? el.scrollTop / max : 0;
}

/**
 * Core scroll driver. Runs once (mounted by the experience page). Sets up Lenis smooth scroll,
 * synchronises GSAP ScrollTrigger, writes per-frame progress into `scrollRef` (no React state),
 * and pushes only discrete chapter changes into the store. Respects reduced motion by disabling
 * smoothing and long scrub.
 */
export function useScrollController(reducedMotion: boolean): void {
  const setActive = useExperience((s) => s.setActive);

  useEffect(() => {
    const lenis = new Lenis({
      duration: reducedMotion ? 0 : 1.1,
      smoothWheel: !reducedMotion,
      // Gentle easing; no aggressive hijacking.
      easing: (t) => 1 - Math.pow(1 - t, 3),
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });
    lenisInstance = lenis;

    let lastChapterId = '';
    let lastHash = '';

    const onScroll = () => {
      const p = documentProgress();
      scrollRef.progress = p;
      scrollRef.velocity = lenis.velocity;

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
    };

    lenis.on('scroll', onScroll);
    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Damp `scrollRef.damped` toward progress independently of scroll events (keeps moving on idle).
    let frame = 0;
    const damp = () => {
      const k = reducedMotion ? 1 : 0.08;
      scrollRef.damped += (scrollRef.progress - scrollRef.damped) * k;
      frame = requestAnimationFrame(damp);
    };
    frame = requestAnimationFrame(damp);

    onScroll();
    ScrollTrigger.refresh();

    return () => {
      lenis.off('scroll', onScroll);
      lenis.off('scroll', ScrollTrigger.update);
      gsap.ticker.remove(raf);
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisInstance = null;
    };
  }, [reducedMotion, setActive]);
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
