import { useEffect, useRef } from 'react';
import { useExperience } from '@/store/experienceStore';
import { useActiveChapter } from '@/hooks/useActiveCreature';
import { withBase } from '@/utils/asset';

/** Per-era ambient bed paths. Files are optional — missing files fail silently. */
const AMBIENCE: Record<string, string> = {
  triassic: '/audio/ambience-triassic.mp3',
  jurassic: '/audio/ambience-jurassic.mp3',
  cretaceous: '/audio/ambience-cretaceous.mp3',
  extinction: '/audio/ambience-extinction.mp3',
};

/**
 * Headless ambient-audio driver. Crossfades a single <audio> element between era beds when
 * enabled. Uses placeholder paths; if an asset 404s the promise rejects and we no-op, so the
 * site stays fully functional without any sound files.
 */
export function AudioManager() {
  const enabled = useExperience((s) => s.audioEnabled);
  const volume = useExperience((s) => s.ambienceVolume);
  const accent = useActiveChapter().accent;
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      const el = new Audio();
      el.loop = true;
      el.preload = 'none';
      audioRef.current = el;
    }
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = volume;
    if (!enabled) {
      el.pause();
      return;
    }
    const src = withBase(AMBIENCE[accent] ?? AMBIENCE.cretaceous);
    if (!el.src.endsWith(src)) el.src = src;
    void el.play().catch(() => {
      /* no asset / autoplay blocked — silent, site remains complete */
    });
  }, [enabled, volume, accent]);

  return null;
}
