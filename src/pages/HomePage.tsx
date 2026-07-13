import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { ExperienceCanvas } from '@/experience/ExperienceCanvas';
import { BackgroundTransition } from '@/components/experience/BackgroundTransition';
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
  useScrollController(reducedMotion);
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
    <div className="grain vignette relative">
      <Preloader />
      <CustomCursor />

      {/* Fixed visual layers */}
      <BackgroundTransition />
      <ExperienceCanvas reducedMotion={reducedMotion} />
      <WaterlineTransition quality={quality} reducedMotion={reducedMotion} />

      {/* Fixed UI overlays */}
      <MainNavigation />
      <MobileNavigation />
      <CommandPalette />
      <GeologicalTimeline />
      <MobileTimelineBar />
      <ModelLoadingIndicator />
      <AiImageMarker />
      <CreatureExplorer />
      <AudioManager />

      {/* Active creature info panel */}
      <div className="pointer-events-none fixed bottom-1 left-6 z-30 hidden max-w-[32rem] sm:block lg:left-20">
        <AnimatePresence mode="wait">
          {showPanel && creature && <CreatureInfoPanel key={creature.id} creature={creature} />}
        </AnimatePresence>
      </div>
      {/* Mobile: panel sits above the timeline bar */}
      <div className="pointer-events-none fixed inset-x-4 bottom-14 z-30 sm:hidden">
        <AnimatePresence mode="wait">
          {showPanel && creature && <CreatureInfoPanel key={`m-${creature.id}`} creature={creature} />}
        </AnimatePresence>
      </div>

      {/* Scroll length: one section per chapter */}
      <main className="pointer-events-none relative z-20">
        {CHAPTERS.map((chapter) => (
          <ChapterSection key={chapter.id} chapter={chapter} />
        ))}
      </main>
    </div>
  );
}
