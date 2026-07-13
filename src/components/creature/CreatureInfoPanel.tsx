import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Ruler, Utensils, Clock, ExternalLink, Box, Info, Volume2 } from 'lucide-react';
import { ScientificStatusBadge } from './ScientificStatusBadge';
import { useExperience } from '@/store/experienceStore';
import type { Creature } from '@/data/types';
import { formatMya } from '@/utils/timeline';

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
        <div className="type-eyebrow text-[0.6rem] text-muted lg:text-[0.72rem]">{label}</div>
        <div className="text-sm text-bone/90 lg:text-lg">{value}</div>
      </div>
    </div>
  );
}

/**
 * Editorial creature panel. Readable over any background (gradient scrim), collapses on mobile,
 * and never covers the creature's head — it's anchored to the lower-left / bottom.
 */
export function CreatureInfoPanel({ creature }: { creature: Creature }) {
  const setExplore = useExperience((s) => s.setExploreMode);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
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
    <motion.aside
      initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      data-creature-panel
      className="pointer-events-auto w-[min(92vw,26rem)] rounded-2xl border border-white/10 bg-ink-900/78 p-5 shadow-2xl backdrop-blur-md sm:p-6 lg:max-h-[calc(100svh-8.5rem)] lg:w-[22rem] lg:overflow-y-auto lg:overscroll-contain lg:p-6 xl:w-[24rem] 2xl:w-[26rem]"
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
      <div className="mb-3 flex items-center justify-between gap-3">
        <ScientificStatusBadge creature={creature} />
        <span className="type-eyebrow text-[0.6rem] text-muted lg:text-[0.72rem]">
          {creature.period}
        </span>
      </div>

      <h2 className="type-title mb-1 text-3xl text-bone">{creature.displayName}</h2>
      {creature.scientificName && (
        <p className="mb-4 font-serif text-sm italic text-muted lg:text-lg">
          {creature.scientificName}
        </p>
      )}

      <p className="mb-5 text-sm leading-relaxed text-bone/80 lg:text-lg">
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
          <div className="mb-1 flex items-center gap-1.5 type-eyebrow text-[0.58rem] text-cretaceous">
            <Info size={12} /> Did you know
          </div>
          <p className="text-sm leading-relaxed text-bone/85 lg:text-lg">{creature.keyFact}</p>
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
    </motion.aside>
  );
}
