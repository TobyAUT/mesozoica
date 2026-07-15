import { useEffect, useRef, useState } from 'react';
import { MapPin, Ruler, Utensils, Clock, ExternalLink, Box, Info, Volume2 } from 'lucide-react';
import { useExperience } from '@/store/experienceStore';
import type { Creature } from '@/data/types';
import {
  formatMya,
  resolveChapter,
  creatureFade,
  mobilePanelFade,
  mobilePanelRead,
} from '@/utils/timeline';
import { SCROLL_PROGRESS_EVENT, scrollRef } from '@/store/scrollRef';
import { cn } from '@/utils/cn';

const DIET_LABEL: Record<string, string> = {
  carnivore: 'Carnivore',
  herbivore: 'Herbivore',
  omnivore: 'Omnivore',
  piscivore: 'Piscivore (fish-eater)',
  unknown: 'Unknown',
};

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 text-cretaceous/80">{icon}</span>
      <div>
        <div className="type-eyebrow text-[0.66rem] text-cretaceous lg:text-[0.8rem]">{label}</div>
        <div className="text-[0.95rem] text-bone/90 lg:text-lg">{value}</div>
      </div>
    </div>
  );
}

/**
 * Editorial creature panel. Readable over any background (gradient scrim), collapses on mobile,
 * and never covers the creature's head — it's anchored to the lower-left / bottom.
 */
export function CreatureInfoPanel({
  creature,
  mobile = false,
}: {
  creature: Creature;
  /** Phone/tablet variant: sequential fade envelope + page scroll drives the card's reading. */
  mobile?: boolean;
}) {
  const setExplore = useExperience((s) => s.setExploreMode);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rootRef = useRef<HTMLElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Drive the panel's opacity from the same scroll envelope as the 3D model (creatureFade), so the
  // window and its model fade in and out together — and the window is gone before the next heading
  // scrolls in. Per-frame via rAF, kept out of React state to avoid re-render churn.
  useEffect(() => {
    const update = () => {
      const el = rootRef.current;
      if (el) {
        const { local } = resolveChapter(scrollRef.progress);
        const f = mobile ? mobilePanelFade(local) : creatureFade(local);
        el.style.opacity = String(f);
        el.style.transform = `translateY(${(1 - f) * 10}px)`;
        if (mobile) {
          // Page scroll "reads" the card: content scrolls to the end before the card fades out.
          el.scrollTop = mobilePanelRead(local) * (el.scrollHeight - el.clientHeight);
        }
      }
    };
    update();
    window.addEventListener(SCROLL_PROGRESS_EVENT, update);
    return () => window.removeEventListener(SCROLL_PROGRESS_EVENT, update);
  }, [mobile]);
  const timeRange =
    creature.approximateTimeStartMya != null && creature.approximateTimeEndMya != null
      ? `${formatMya(creature.approximateTimeStartMya)}–${formatMya(creature.approximateTimeEndMya)} Mya`
      : 'To be verified';

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      audio?.pause();
    };
  }, [creature.id]);

  const playSound = async () => {
    if (!creature.audioPath || isPlaying) return;
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setIsPlaying(true);
    try {
      await audio.play();
    } catch {
      setIsPlaying(false);
    }
  };

  return (
    <aside
      ref={rootRef}
      style={{ opacity: 0 }}
      data-creature-panel
      className={cn(
        'pointer-events-auto w-[min(94vw,26rem)] rounded-2xl border border-white/10 bg-ink-900/78 shadow-2xl backdrop-blur-md',
        mobile
          ? // overflow-hidden (not auto): touch drags keep scrolling the PAGE, and the page scroll
            // drives this card's scrollTop programmatically until it is read to the end.
            'max-h-[68svh] overflow-hidden p-5 sm:p-6'
          : 'max-h-[calc(100svh-8.5rem)] overflow-y-auto overscroll-contain p-6 lg:w-[22rem] xl:w-[24rem] 2xl:w-[26rem]',
      )}
    >
      {creature.audioPath && (
        <audio
          ref={audioRef}
          src={`${import.meta.env.BASE_URL}${creature.audioPath.replace(/^\//, '')}`}
          preload="none"
          onEnded={() => setIsPlaying(false)}
          onError={() => setIsPlaying(false)}
        />
      )}
      <div className="mb-3 flex items-center gap-3">
        <span className="type-eyebrow text-[0.6rem] text-cretaceous lg:text-[0.72rem]">
          {creature.period}
        </span>
      </div>

      {/* Cap the size and allow long single-word names (e.g. "Cryolophosaurus") to wrap/break so
          the last letters are never clipped by the card edge. */}
      <h2 className="type-title mb-1 !text-[2.35rem] !leading-[1.08] break-words text-bone">
        {creature.displayName}
      </h2>
      {creature.scientificName && (
        <p className="mb-4 font-grotesk text-[0.95rem] font-medium italic text-cretaceous lg:text-lg">
          {creature.scientificName}
        </p>
      )}

      <p className="mb-5 text-[0.95rem] leading-relaxed text-bone/85 lg:text-lg">
        {creature.shortDescription}
      </p>

      <div className="mb-5 grid grid-cols-2 gap-x-4 gap-y-3.5">
        <Row icon={<Clock size={15} />} label="When" value={timeRange} />
        <Row
          icon={<MapPin size={15} />}
          label="Where"
          value={creature.continent ?? 'To be verified'}
        />
        <Row
          icon={<Utensils size={15} />}
          label="Diet"
          value={creature.diet ? DIET_LABEL[creature.diet] : 'To be verified'}
        />
        <Row
          icon={<Ruler size={15} />}
          label="Length"
          value={creature.lengthMeters != null ? `~${creature.lengthMeters} m` : 'To be verified'}
        />
      </div>

      {creature.keyFact && (
        <div className="mb-5 rounded-xl border border-white/5 bg-white/[0.03] p-3.5">
          <div className="mb-1 flex items-center gap-1.5 type-eyebrow text-[0.66rem] text-cretaceous">
            <Info size={13} /> Did you know
          </div>
          <p className="text-[0.95rem] leading-relaxed text-bone/85 lg:text-lg">{creature.keyFact}</p>
          {creature.factSource && (
            <p className="mt-1.5 text-[0.68rem] text-muted lg:text-sm">
              Source: {creature.factSource}
            </p>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2.5">
        <button
          onClick={() => setExplore(true)}
          className="inline-flex items-center gap-1.5 rounded-full bg-bone px-4 py-2 text-sm font-medium text-ink-900 transition hover:bg-white lg:text-base"
        >
          <Box size={15} /> Explore in 3D
        </button>
        {creature.audioPath && (
          <button
            type="button"
            onClick={playSound}
            disabled={isPlaying}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-sm text-bone/80 transition hover:border-white/40 hover:text-bone disabled:cursor-default disabled:opacity-60 lg:text-base"
            aria-label={
              isPlaying ? 'Tyrannosaurus sound is playing' : 'Play Tyrannosaurus sound once'
            }
          >
            <Volume2 size={14} /> {isPlaying ? 'Playing' : 'Play'}
          </button>
        )}
        {creature.sourceUrl && (
          <a
            href={creature.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-sm text-bone/80 transition hover:border-white/40 hover:text-bone lg:text-base"
          >
            <ExternalLink size={14} /> Model source
          </a>
        )}
      </div>
    </aside>
  );
}
