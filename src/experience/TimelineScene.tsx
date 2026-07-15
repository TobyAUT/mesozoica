import { Suspense, useMemo, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { CreatureModel } from './CreatureModel';
import { CameraController } from './CameraController';
import { EnvironmentController } from './EnvironmentController';
import { ParticleSystem } from './ParticleSystem';
import { Effects } from './Effects';
import { useActiveChapter, useActiveCreature } from '@/hooks/useActiveCreature';
import { useExperience } from '@/store/experienceStore';
import type { ResolvedQuality } from '@/hooks/useDeviceQuality';
import { backgroundOrFallback } from '@/data/backgrounds';
import { withBase } from '@/utils/asset';
import { CREATURES } from '@/data/creatures';
import { CHAPTERS } from '@/data/eras';
import { ErrorBoundary } from '@/components/system/ErrorBoundary';

interface Props {
  quality: ResolvedQuality;
  reducedMotion: boolean;
}

export function TimelineScene({ quality, reducedMotion }: Props) {
  const chapter = useActiveChapter();
  const creature = useActiveCreature();
  const exploreMode = useExperience((s) => s.exploreMode);
  const backgroundId = chapter.backgroundId;

  // Preload the next enabled creature's model so it's ready before its section arrives.
  useEffect(() => {
    // Low-power/save-data devices load only the active model, preventing large GLBs from consuming
    // bandwidth and memory before the visitor actually reaches them.
    if (quality.tier === 'low') return;
    const idx = CHAPTERS.findIndex((c) => c.id === chapter.id);
    for (let i = idx + 1; i < CHAPTERS.length; i++) {
      const next = CHAPTERS[i];
      const c = next.creatureId ? CREATURES.find((x) => x.id === next.creatureId) : null;
      // Preload only glTF here (useGLTF.preload is glTF-specific); other formats load on demand.
      if (c?.enabled && c.modelPath && (c.assetFormat === 'glb' || c.assetFormat === 'gltf')) {
        useGLTF.preload(withBase(c.modelPath));
        break;
      }
    }
  }, [chapter.id, quality.tier]);

  const showModel = creature?.enabled && !!creature.modelPath;
  const particleColor = useMemo(() => backgroundOrFallback(backgroundId).horizon, [backgroundId]);

  return (
    <>
      <EnvironmentController backgroundId={backgroundId} reducedMotion={reducedMotion} />

      <ErrorBoundary
        key={creature?.id ?? chapter.id}
        label={creature ? `${creature.displayName} model` : 'creature model'}
        fallback={null}
      >
        <Suspense fallback={null}>
          {showModel && creature && <CreatureModel key={creature.id} creature={creature} active />}
        </Suspense>
      </ErrorBoundary>

      {quality.particles > 0 && (
        <ParticleSystem
          count={quality.particles}
          color={particleColor}
          reducedMotion={reducedMotion}
        />
      )}

      <CameraController
        creature={creature}
        exploreMode={exploreMode}
        reducedMotion={reducedMotion}
      />

      {quality.postprocessing && !reducedMotion && <Effects />}
    </>
  );
}
