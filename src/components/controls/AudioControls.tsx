import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useExperience } from '@/store/experienceStore';
import { useTr } from '@/i18n';
import { cn } from '@/utils/cn';

/**
 * Audio is muted by default and never autoplays with sound — the first click here is the
 * required user gesture. Volume prefs persist. Ambience files are optional; the UI works even
 * when no audio assets exist (see AudioManager).
 */
export function AudioControls() {
  const enabled = useExperience((s) => s.audioEnabled);
  const setEnabled = useExperience((s) => s.setAudioEnabled);
  const ambience = useExperience((s) => s.ambienceVolume);
  const effects = useExperience((s) => s.effectsVolume);
  const setVolume = useExperience((s) => s.setVolume);
  const { t } = useTr();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        aria-label={enabled ? t('audioMute') : t('audioEnable')}
        aria-pressed={enabled}
        onClick={() => {
          setEnabled(!enabled);
          if (!enabled) setOpen(true);
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          setOpen((v) => !v);
        }}
        className={cn(
          'inline-flex items-center justify-center rounded-full border p-2 transition',
          enabled
            ? 'border-cretaceous/50 bg-cretaceous/10 text-cretaceous'
            : 'border-white/15 text-muted hover:border-white/30 hover:text-bone',
        )}
      >
        {enabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-white/10 bg-ink-800/95 p-4 shadow-2xl backdrop-blur-md">
          <p className="mb-3 text-[0.68rem] text-muted">{t('audioNote')}</p>
          {(['ambience', 'effects'] as const).map((kind) => (
            <label key={kind} className="mb-3 block">
              <span className="mb-1 flex justify-between text-xs text-bone/80">
                {kind === 'ambience' ? t('audioAmbience') : t('audioEffects')}
                <span className="text-muted">
                  {Math.round((kind === 'ambience' ? ambience : effects) * 100)}%
                </span>
              </span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={kind === 'ambience' ? ambience : effects}
                onChange={(e) => setVolume(kind, parseFloat(e.target.value))}
                className="w-full accent-cretaceous"
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
