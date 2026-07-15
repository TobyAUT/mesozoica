import { useEffect, useRef } from 'react';
import { SCROLL_PROGRESS_EVENT, scrollRef } from '@/store/scrollRef';
import { CHAPTER_RANGES, clamp, smoothstep } from '@/utils/timeline';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { notifyUser } from '@/utils/notify';
import { withBase } from '@/utils/asset';

/** Local-progress window in which scroll scrubs the video from start to end. */
const READ: readonly [number, number] = [0.06, 0.9];

interface Props {
  /** Chapter whose section drives this video. */
  chapterId: string;
  /** Video for desktop/tablet (landscape). */
  src: string;
  /** Optional portrait variant used on phones (<768px). */
  phoneSrc?: string;
  /** Never fade out: the video's final frame stays on screen to the very end of the page. */
  holdLastFrame?: boolean;
}

/**
 * Fullscreen scroll-scrubbed video for a single chapter (Impact meteor strike, birds finale).
 * Scroll position maps linearly onto video time — the visitor plays the video frame by frame by
 * scrolling, and scrolling back rewinds it. The chapters carry extra scroll weight (see eras.ts)
 * so the scrub is long and deliberate. No auto-scroll: the visitor is always in control.
 * Sits above the background crossfade and below the WebGL canvas/text (these chapters have no
 * 3D model). If the video fails to load, it hides itself and the normal backdrop remains.
 */
export function ChapterVideo({ chapterId, src, phoneSrc, holdLastFrame = false }: Props) {
  const isPhone = useMediaQuery('(max-width: 767px)');
  const videoRef = useRef<HTMLVideoElement>(null);
  const failed = useRef(false);

  const source = isPhone && phoneSrc ? phoneSrc : src;

  useEffect(() => {
    const range = CHAPTER_RANGES.find((r) => r.chapter.id === chapterId);
    const video = videoRef.current;
    if (!range || !video) return;

    const update = () => {
      const span = range.end - range.start || 1;
      const local = clamp((scrollRef.progress - range.start) / span);
      const fadeIn = smoothstep(0.02, 0.08, local);
      const fade = failed.current
        ? 0
        : holdLastFrame
          ? fadeIn
          : fadeIn * (1 - smoothstep(0.93, 0.985, local));
      video.style.opacity = String(fade);
      video.style.visibility = fade > 0.001 ? 'visible' : 'hidden';

      if (fade > 0.001 && video.duration && !failed.current) {
        // Stop just short of duration so the decoder reliably presents the LAST frame.
        const t = Math.min(
          clamp((local - READ[0]) / (READ[1] - READ[0])) * video.duration,
          video.duration - 0.05,
        );
        // Seek only on meaningful change; per-pixel seeking would thrash the decoder.
        if (Math.abs(video.currentTime - t) > 1 / 30) video.currentTime = t;
      }
    };

    const onError = () => {
      failed.current = true;
      video.style.opacity = '0';
      video.style.visibility = 'hidden';
      notifyUser('A background video could not be loaded, so a still backdrop is shown instead.');
    };

    update();
    window.addEventListener(SCROLL_PROGRESS_EVENT, update);
    video.addEventListener('error', onError);
    video.addEventListener('loadedmetadata', update);
    return () => {
      window.removeEventListener(SCROLL_PROGRESS_EVENT, update);
      video.removeEventListener('error', onError);
      video.removeEventListener('loadedmetadata', update);
    };
  }, [chapterId, holdLastFrame, source]);

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
