import { useEffect, useRef, useState } from 'react';
import { MapPin, Ruler, Utensils, Clock, ExternalLink, Box, Info, Play, Pause } from 'lucide-react';
import { useExperience } from '@/store/experienceStore';
import type { Creature } from '@/data/types';
import {
  formatMya,
  resolveChapter,
  panelFade,
  mobilePanelFade,
  mobilePanelRead,
} from '@/utils/timeline';
import { SCROLL_PROGRESS_EVENT, scrollRef } from '@/store/scrollRef';
import { useTr } from '@/i18n';
import { cn } from '@/utils/cn';

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 text-cretaceous/80">{icon}</span>
      <div>
        <div className="type-eyebrow text-[0.66rem] text-cretaceous lg:text-[0.8rem]">{label}</div>
        <div className="text-[0.95rem] text-bone/90 lg:text-base">{value}</div>
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
  const tr = useTr();
  const { t } = tr;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rootRef = useRef<HTMLElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioTime, setAudioTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);

  // Desktop opacity follows panelFade: up EARLY (together with the creature heading), and out on
  // the same tail as the 3D model so both are gone before the next heading scrolls in. Kept out of
  // React state to avoid re-render churn.
  useEffect(() => {
    const update = () => {
      const el = rootRef.current;
      if (el) {
        const { local } = resolveChapter(scrollRef.progress);
        const f = mobile ? mobilePanelFade(local) : panelFade(local);
        el.style.opacity = String(f);
        el.style.transform = `translateY(${(1 - f) * 10}px)`;
        if (mobile) {
          // Page scroll "reads" the card: content scrolls to the end before the card fades out.
          // The scrolling element is the BODY, not the card — the card itself is a flex column
          // with a fixed action footer.
          const body = bodyRef.current;
          if (body) body.scrollTop = mobilePanelRead(local) * (body.scrollHeight - body.clientHeight);
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
      : t('panelToBeVerified');

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      audio?.pause();
    };
  }, [creature.id]);

  // Play/pause toggle + a small scrubbable progress bar. Pausing keeps the position; pressing
  // play after the clip ended restarts it from the beginning.
  const toggleSound = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }
    if (audio.ended) audio.currentTime = 0;
    setIsPlaying(true);
    try {
      await audio.play();
    } catch {
      setIsPlaying(false);
    }
  };

  const formatClock = (s: number) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  return (
    <aside
      ref={rootRef}
      style={{ opacity: 0 }}
      data-creature-panel
      // ONE glass surface: the card is frosted purely by `backdrop-blur-md` with NO background
      // tint, and its children (scrolling body, action footer) stay transparent. Stacking a tinted
      // layer on top for the footer is what made the button strip read as a solid black block
      // instead of the same glass as the rest. (This carried a `bg-ink-900/78` class for a long
      // time, but Tailwind only emits opacity steps of 5 — /78 was never generated, so the card
      // has always been blur-only. globals.css gives it a real tint in low-power mode, where
      // backdrop filters are switched off.)
      className={cn(
        'pointer-events-auto flex w-[min(94vw,26rem)] flex-col overflow-hidden rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md',
        mobile
          ? 'max-h-[68svh]'
          : 'max-h-[calc(100svh-7rem)] lg:w-[22rem] xl:w-[24rem] 2xl:w-[26rem]',
      )}
    >
      {creature.audioPath && (
        <audio
          ref={audioRef}
          src={`${import.meta.env.BASE_URL}${creature.audioPath.replace(/^\//, '')}`}
          preload="metadata"
          onLoadedMetadata={(e) => setAudioDuration(e.currentTarget.duration || 0)}
          onTimeUpdate={(e) => setAudioTime(e.currentTarget.currentTime)}
          onEnded={() => setIsPlaying(false)}
          onError={() => setIsPlaying(false)}
        />
      )}
      {/* Scrolling body. On mobile it is overflow-hidden so touch drags keep scrolling the PAGE,
          and page scroll drives its scrollTop programmatically (mobilePanelRead). */}
      <div
        ref={bodyRef}
        className={cn(
          'min-h-0 flex-1',
          mobile ? 'overflow-hidden p-5 sm:p-6' : 'overflow-y-auto overscroll-contain p-6',
        )}
      >
      <div className="mb-3 flex items-center gap-3">
        <span className="type-eyebrow text-[0.6rem] text-cretaceous lg:text-[0.72rem]">
          {tr.period(creature.period)}
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

      <p className="mb-4 text-[0.95rem] leading-relaxed text-bone/85 lg:text-base">
        {tr.creatureDescription(creature)}
      </p>

      <div className="mb-4 grid grid-cols-2 gap-x-4 gap-y-3">
        <Row icon={<Clock size={15} />} label={t('panelWhen')} value={timeRange} />
        <Row
          icon={<MapPin size={15} />}
          label={t('panelWhere')}
          value={tr.continent(creature.continent)}
        />
        <Row icon={<Utensils size={15} />} label={t('panelDiet')} value={tr.diet(creature.diet)} />
        <Row
          icon={<Ruler size={15} />}
          label={t('panelLength')}
          value={
            creature.lengthMeters != null ? `~${creature.lengthMeters} m` : t('panelToBeVerified')
          }
        />
      </div>

      {creature.keyFact && (
        <div className="mb-4 rounded-xl border border-white/5 bg-white/[0.03] p-3.5">
          <div className="mb-1 flex items-center gap-1.5 type-eyebrow text-[0.66rem] text-cretaceous">
            <Info size={13} /> {t('panelDidYouKnow')}
          </div>
          <p className="text-[0.95rem] leading-relaxed text-bone/85 lg:text-base">
            {tr.creatureKeyFact(creature)}
          </p>
          {creature.factSource && (
            <p className="mt-1.5 text-[0.68rem] text-muted lg:text-sm">
              {t('panelSource')}: {creature.factSource}
            </p>
          )}
        </div>
      )}
      </div>

      {/* Fixed action footer — never scrolls. On short desktop screens the longest card (T. rex) is
          taller than the viewport, so a statically placed row pushed "Model source" below the fold
          with no way to reach it (the body's scrollbar is hidden). Transparent by design: it sits
          directly on the card's own glass. */}
      <div
        className={cn(
          'shrink-0 border-t border-white/10',
          mobile ? 'px-5 pb-5 pt-3 sm:px-6 sm:pb-6' : 'px-6 pb-6 pt-3',
        )}
      >
        <div className="flex flex-wrap items-center gap-2.5">
        <button
          onClick={() => setExplore(true)}
          className="inline-flex items-center gap-1.5 rounded-full bg-bone px-4 py-2 text-sm font-medium text-ink-900 transition hover:bg-white lg:text-base"
        >
          <Box size={15} /> {t('panelExplore')}
        </button>
        {creature.audioPath && (
          <button
            type="button"
            onClick={toggleSound}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-sm text-bone/80 transition hover:border-white/40 hover:text-bone lg:text-base"
            aria-label={isPlaying ? t('panelPauseAria') : t('panelPlayAria')}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}{' '}
            {isPlaying ? t('panelPause') : t('panelPlay')}
          </button>
        )}
        {creature.sourceUrl && (
          <a
            href={creature.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-sm text-bone/80 transition hover:border-white/40 hover:text-bone lg:text-base"
          >
            <ExternalLink size={14} /> {t('panelModelSource')}
          </a>
        )}
        </div>

        {creature.audioPath && (
          <div className="mt-3 flex items-center gap-2.5">
          <input
            type="range"
            min={0}
            max={audioDuration || 0}
            step={0.05}
            value={Math.min(audioTime, audioDuration || 0)}
            disabled={!audioDuration}
            onChange={(e) => {
              const t = Number(e.target.value);
              const audio = audioRef.current;
              if (audio) audio.currentTime = t;
              setAudioTime(t);
            }}
            aria-label={t('panelAudioPosition')}
            className="h-1 min-w-0 flex-1 cursor-pointer accent-cretaceous disabled:cursor-default"
          />
            <span className="shrink-0 text-[0.66rem] tabular-nums text-muted">
              {formatClock(audioTime)} / {formatClock(audioDuration)}
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}
