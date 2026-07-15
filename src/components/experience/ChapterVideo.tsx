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

    // Mobile Safari may ignore preload="auto" for a paused video, while Android browsers can
    // likewise defer the decoder until playback starts. Once the video becomes visible, briefly
    // play one muted inline frame and pause again before the first scroll-driven seek. This warms
    // the native decoder without changing the visitor-controlled scrub behaviour.
    let primed = false;
    let priming = false;
    let primeFrame: number | null = null;
    let primeTimer: number | null = null;
    let latestTarget = 0;

    // Frame-accurate scrubbing needs ONE in-flight seek at a time: firing currentTime on every
    // scroll event cancels the previous seek before the decoder ever presents a frame ("you see
    // nothing and then it's over"). Queue only the newest target and apply it on `seeked`.
    let pendingSeek: number | null = null;
    const seekTo = (t: number) => {
      if (video.seeking) {
        pendingSeek = t;
        return;
      }
      if (Math.abs(video.currentTime - t) > 1 / 60) video.currentTime = t;
    };
    const onSeeked = () => {
      if (pendingSeek === null) return;
      const t = pendingSeek;
      pendingSeek = null;
      seekTo(t);
    };

    const finishPriming = () => {
      if (!priming) return;
      priming = false;
      primed = true;
      if (primeTimer !== null) {
        window.clearTimeout(primeTimer);
        primeTimer = null;
      }
      if (primeFrame !== null && video.cancelVideoFrameCallback) {
        video.cancelVideoFrameCallback(primeFrame);
        primeFrame = null;
      }
      video.pause();
      if (video.duration) seekTo(latestTarget);
    };

    const primeDecoder = () => {
      if (primed || priming || failed.current) return;
      priming = true;
      video.muted = true;
      if (video.networkState === HTMLMediaElement.NETWORK_EMPTY) video.load();

      void video
        .play()
        .then(() => {
          if (video.requestVideoFrameCallback) {
            primeFrame = video.requestVideoFrameCallback(() => {
              primeFrame = null;
              finishPriming();
            });
          }
          // Safety net for browsers that expose the frame callback but do not fire it reliably
          // while the page is scrolling or power-constrained.
          primeTimer = window.setTimeout(finishPriming, 250);
        })
        .catch(() => {
          // Seeking remains a functional fallback if a browser rejects even muted inline play.
          finishPriming();
        });
    };

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

      if (fade > 0.001 && !failed.current) {
        if (video.duration) {
          // Stop just short of duration so the decoder reliably presents the LAST frame.
          latestTarget = Math.min(
            clamp((local - READ[0]) / (READ[1] - READ[0])) * video.duration,
            video.duration - 0.05,
          );
        }
        if (!primed) primeDecoder();
        else if (video.duration) seekTo(latestTarget);
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
    video.addEventListener('seeked', onSeeked);
    return () => {
      window.removeEventListener(SCROLL_PROGRESS_EVENT, update);
      video.removeEventListener('error', onError);
      video.removeEventListener('loadedmetadata', update);
      video.removeEventListener('seeked', onSeeked);
      if (primeTimer !== null) window.clearTimeout(primeTimer);
      if (primeFrame !== null && video.cancelVideoFrameCallback) {
        video.cancelVideoFrameCallback(primeFrame);
      }
      video.pause();
    };
  }, [chapterId, holdLastFrame, source]);

  return (
    <video
      ref={videoRef}
      key={source}
      src={withBase(source)}
      muted
      playsInline
      // Buffer the whole (small) file up front — scrubbing through unbuffered ranges stalls the
      // decoder and shows black instead of frames.
      preload="auto"
      aria-hidden="true"
      style={{ opacity: 0, visibility: 'hidden' }}
      className="pointer-events-none fixed inset-0 z-[5] h-full w-full object-cover"
    />
  );
}
