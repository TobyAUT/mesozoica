import { useEffect, useRef } from 'react';
import { SCROLL_PROGRESS_EVENT, scrollRef } from '@/store/scrollRef';
import { CHAPTER_RANGES, clamp, smoothstep } from '@/utils/timeline';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { notifyUser } from '@/utils/notify';
import { withBase } from '@/utils/asset';

/** Local-progress window in which scroll scrubs the video from start to end. */
const READ: readonly [number, number] = [0.08, 0.9];

interface Props {
  /** Chapter whose section drives this video. */
  chapterId: string;
  /** Video for desktop/tablet (landscape). */
  src: string;
  /** Optional portrait variant used on phones (<768px). */
  phoneSrc?: string;
  /** Slowly auto-scroll the page through the chapter so the video plays hands-free. */
  autoScroll?: boolean;
}

/**
 * Fullscreen scroll-scrubbed video for a single chapter (Impact meteor strike, birds finale).
 * Scroll position maps linearly onto video time, so scrolling back rewinds. While the visitor
 * rests inside the chapter, a slow auto-scroll advances the page at the video's natural pace;
 * any wheel/touch/key input cancels it until the chapter is left and re-entered.
 * Sits above the background crossfade and below the WebGL canvas/text (these chapters have no
 * 3D model). If the video fails to load, it hides itself and the normal backdrop remains.
 */
export function ChapterVideo({ chapterId, src, phoneSrc, autoScroll = true }: Props) {
  const isPhone = useMediaQuery('(max-width: 767px)');
  const videoRef = useRef<HTMLVideoElement>(null);
  const failed = useRef(false);

  const source = isPhone && phoneSrc ? phoneSrc : src;

  useEffect(() => {
    const range = CHAPTER_RANGES.find((r) => r.chapter.id === chapterId);
    const video = videoRef.current;
    if (!range || !video) return;

    let autoRaf = 0;
    let autoCancelled = false;
    let lastTs = 0;

    const stopAuto = () => {
      if (autoRaf) cancelAnimationFrame(autoRaf);
      autoRaf = 0;
      lastTs = 0;
    };
    const cancelAuto = () => {
      autoCancelled = true;
      stopAuto();
    };

    const localAt = (progress: number) => {
      const span = range.end - range.start || 1;
      return clamp((progress - range.start) / span);
    };

    // Advance the page so the READ window elapses in exactly the video's duration — the video
    // plays at its natural speed while the page drifts. Any user input cancels (see listeners).
    const autoStep = (ts: number) => {
      autoRaf = 0;
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      const local = localAt(scrollRef.progress);
      if (autoCancelled || local >= READ[1] || !video.duration) return;
      if (lastTs) {
        const chapterPx = (range.end - range.start) * max;
        const pxPerSecond = (chapterPx * (READ[1] - READ[0])) / video.duration;
        el.scrollTop += (pxPerSecond * (ts - lastTs)) / 1000;
      }
      lastTs = ts;
      autoRaf = requestAnimationFrame(autoStep);
    };

    const update = () => {
      const local = localAt(scrollRef.progress);
      const active = scrollRef.progress >= range.start && scrollRef.progress < range.end;
      const fade = failed.current
        ? 0
        : smoothstep(0.02, 0.1, local) * (1 - smoothstep(0.92, 0.985, local));
      video.style.opacity = String(fade);
      video.style.visibility = fade > 0.001 ? 'visible' : 'hidden';

      if (!active) {
        // Leaving the chapter re-arms the auto-scroll for the next visit.
        autoCancelled = false;
        stopAuto();
        return;
      }
      if (video.duration && !failed.current) {
        const t = clamp((local - READ[0]) / (READ[1] - READ[0])) * video.duration;
        // Seek only on meaningful change; per-pixel seeking would thrash the decoder.
        if (Math.abs(video.currentTime - t) > 1 / 30) video.currentTime = t;
        if (autoScroll && !autoCancelled && !autoRaf && local >= READ[0] && local < READ[1]) {
          autoRaf = requestAnimationFrame(autoStep);
        }
      }
    };

    const onError = () => {
      failed.current = true;
      video.style.opacity = '0';
      video.style.visibility = 'hidden';
      stopAuto();
      notifyUser('A background video could not be loaded, so a still backdrop is shown instead.');
    };

    update();
    window.addEventListener(SCROLL_PROGRESS_EVENT, update);
    video.addEventListener('error', onError);
    video.addEventListener('loadedmetadata', update);
    const cancelEvents = ['wheel', 'touchstart', 'pointerdown', 'keydown'] as const;
    cancelEvents.forEach((e) => window.addEventListener(e, cancelAuto, { passive: true }));
    return () => {
      stopAuto();
      window.removeEventListener(SCROLL_PROGRESS_EVENT, update);
      video.removeEventListener('error', onError);
      video.removeEventListener('loadedmetadata', update);
      cancelEvents.forEach((e) => window.removeEventListener(e, cancelAuto));
    };
  }, [chapterId, autoScroll, source]);

  return (
    <video
      ref={videoRef}
      key={source}
      src={withBase(source)}
      muted
      playsInline
      preload="metadata"
      aria-hidden="true"
      style={{ opacity: 0, visibility: 'hidden' }}
      className="pointer-events-none fixed inset-0 z-[5] h-full w-full object-cover"
    />
  );
}
