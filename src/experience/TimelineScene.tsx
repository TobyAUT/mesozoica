import { Suspense, useMemo, useRef, useEffect } from 'react';
import { ContactShadows, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
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

/** Transparent contact shadow anchors models without covering the supplied landscape image. */
function Ground({ shadows }: { shadows: boolean }) {
  if (!shadows) return null;
  return (
    <ContactShadows
      position={[0, 0.01, 0]}
      scale={22}
      blur={2.6}
      far={9}
      opacity={0.42}
      resolution={512}
    />
  );
}

/** Subtle stand-in shown when a creature's GLB is not yet available (never an error stack). */
function PendingSpecimen() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.15;
  });
  return (
    <group>
      <mesh ref={ref} position={[0, 1.4, 0]}>
        <icosahedronGeometry args={[1.1, 1]} />
        <meshStandardMaterial
          color="#2a2f34"
          roughness={0.9}
          metalness={0.1}
          transparent
          opacity={0.35}
          wireframe
        />
      </mesh>
    </group>
  );
}

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
  }, [chapter.id]);

  const showModel = creature?.enabled && !!creature.modelPath;
  const showPendingSpecimen = chapter.kind === 'creature' && (!creature || !creature.modelPath);
  const particleColor = useMemo(
    () => backgroundOrFallback(backgroundId).horizon,
    [backgroundId],
  );

  return (
    <>
      <EnvironmentController backgroundId={backgroundId} reducedMotion={reducedMotion} />
      <Ground shadows={quality.shadows} />

      <ErrorBoundary
        key={creature?.id ?? chapter.id}
        label={creature ? `${creature.displayName} model` : 'creature model'}
        fallback={showPendingSpecimen ? <PendingSpecimen /> : null}
      >
        <Suspense fallback={showPendingSpecimen ? <PendingSpecimen /> : null}>
          {showModel && creature ? (
            <CreatureModel key={creature.id} creature={creature} active />
          ) : (
            showPendingSpecimen && <PendingSpecimen />
          )}
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
