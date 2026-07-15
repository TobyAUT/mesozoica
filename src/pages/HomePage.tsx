import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ExperienceCanvas } from '@/experience/ExperienceCanvas';
import { BackgroundTransition } from '@/components/experience/BackgroundTransition';
import { ChapterVideo } from '@/components/experience/ChapterVideo';
import { WaterlineTransition } from '@/components/experience/WaterlineTransition';
import { ChapterSection } from '@/components/experience/ChapterSection';
import { MainNavigation } from '@/components/navigation/MainNavigation';
import { MobileNavigation } from '@/components/navigation/MobileNavigation';
import { CommandPalette } from '@/components/navigation/CommandPalette';
import { GeologicalTimeline, MobileTimelineBar } from '@/components/timeline/GeologicalTimeline';
import { CreatureInfoPanel } from '@/components/creature/CreatureInfoPanel';
import { CreatureExplorer } from '@/components/creature/CreatureExplorer';
import { Preloader } from '@/components/system/Preloader';
import { CustomCursor } from '@/components/system/CustomCursor';
import { ModelLoadingIndicator } from '@/components/system/ModelLoadingIndicator';
import { AiImageMarker } from '@/components/system/AiImageMarker';
import { AudioManager } from '@/components/controls/AudioManager';
import { useReducedMotionSync } from '@/hooks/useReducedMotion';
import { useDeviceQuality } from '@/hooks/useDeviceQuality';
import { useScrollController, scrollToChapter } from '@/hooks/useScrollController';
import { useActiveCreature } from '@/hooks/useActiveCreature';
import { useExperience } from '@/store/experienceStore';
import { CHAPTERS } from '@/data/eras';

export default function HomePage() {
  const reducedMotion = useReducedMotionSync();
  const quality = useDeviceQuality();
  const lowPower = quality.tier === 'low';
  useScrollController(reducedMotion, lowPower);
  const location = useLocation();
  const creature = useActiveCreature();
  const exploreMode = useExperience((s) => s.exploreMode);

  // Deep-link support: /timeline#tyrannosaurus-rex jumps to that chapter once laid out.
  useEffect(() => {
    const id = location.hash.replace('#', '');
    if (!id) return;
    const t = setTimeout(() => scrollToChapter(id, true), 120);
    return () => clearTimeout(t);
  }, [location.hash]);

  const showPanel = !!creature && creature.enabled && !!creature.modelPath && !exploreMode;

  return (
    <div className={`grain vignette relative ${lowPower ? 'performance-low' : ''}`}>
      <Preloader />
      {!lowPower && <CustomCursor />}

      {/* Fixed visual layers */}
      <BackgroundTransition quality={quality} reducedMotion={reducedMotion} />
      {/* Scroll-scrubbed chapter videos: meteor strike over Impact, birds over the finale. */}
      <ChapterVideo
        chapterId="extinction"
        src="/videos/meteor-impact.mp4"
        phoneSrc="/videos/meteor-impact-portrait.mp4"
      />
      <ChapterVideo chapterId="finale" src="/videos/birds.mp4" holdLastFrame />
      <ExperienceCanvas reducedMotion={reducedMotion} />
      <WaterlineTransition quality={quality} reducedMotion={reducedMotion} />

      {/* Fixed UI overlays */}
      <div
        aria-hidden={exploreMode}
        className={`transition-opacity duration-200 ${
          exploreMode ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
      >
        <MainNavigation />
        <MobileNavigation />
        <CommandPalette />
        <GeologicalTimeline />
        <MobileTimelineBar />
        <ModelLoadingIndicator />
        <AiImageMarker />
        <AudioManager />
      </div>
      <CreatureExplorer />

      {/* Active creature info panel — nudged closer to the geological timeline on the left. */}
      <div className="pointer-events-none fixed left-[17rem] top-1/2 z-30 hidden -translate-y-1/2 lg:block 2xl:left-[18rem]">
        {showPanel && creature && <CreatureInfoPanel key={creature.id} creature={creature} />}
      </div>
      {/* Mobile/tablet: sequential flow — the panel appears centred AFTER the model has faded
          out, and page scroll reads its content to the end (see MOBILE_PHASES in utils/timeline). */}
      <div className="pointer-events-none fixed inset-x-0 top-1/2 z-30 flex -translate-y-1/2 justify-center px-3 lg:hidden">
        {showPanel && creature && (
          <CreatureInfoPanel key={`m-${creature.id}`} creature={creature} mobile />
        )}
      </div>

      {/* Scroll length: one section per chapter */}
      <main
        aria-hidden={exploreMode}
        className={`pointer-events-none relative z-20 transition-opacity duration-200 ${
          exploreMode ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {CHAPTERS.map((chapter) => (
          <ChapterSection key={chapter.id} chapter={chapter} />
        ))}

        {/* Page end: full-width legal footer — the LAST element, over the held final video frame. */}
        <footer className="pointer-events-auto relative z-20 w-full border-t border-white/10 bg-ink-900/85 text-center text-[0.72rem] text-bone/60 backdrop-blur-md">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-6 pb-16 pt-6 lg:pb-6">
            <nav className="flex items-center gap-5">
              <Link to="/legal#impressum" className="transition hover:text-bone">
                Impressum
              </Link>
              <Link to="/legal#datenschutz" className="transition hover:text-bone">
                Datenschutz
              </Link>
              <Link to="/credits" className="transition hover:text-bone">
                Credits
              </Link>
            </nav>
            <p>
              © {new Date().getFullYear()} Mesozoica · KI-generierte Bilder &amp; Videos ·
              AI-generated media
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
