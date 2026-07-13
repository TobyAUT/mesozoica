import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { damp3, damp } from 'maath/easing';
import * as THREE from 'three';
import type { Creature } from '@/data/types';
import { scrollRef } from '@/store/scrollRef';

const DEFAULT_PRESET = {
  position: [6, 3, 9] as [number, number, number],
  target: [0, 1.6, 0] as [number, number, number],
  fov: 44,
};

interface Props {
  creature: Creature | null;
  exploreMode: boolean;
  reducedMotion: boolean;
}

/** Extra camera distance needed to fit long bodies, wings and tails into the viewport. */
function modelFitScale(creature: Creature | null, aspect: number): number {
  const groupScale: Partial<Record<Creature['creatureGroup'], number>> = {
    theropod: 1.48,
    ceratopsian: 1.28,
    pterosaur: 1.3,
    avialan: 1.3,
    stylized: 1.42,
    marineReptile: 1.45,
    sauropod: 1.5,
    mixed: 1.25,
  };
  const bodyScale = creature ? (groupScale[creature.creatureGroup] ?? 1.2) : 1;
  // Portrait screens have a much narrower horizontal field of view.
  const responsiveScale = aspect < 1 ? Math.min(1.8, 1 / Math.max(0.58, aspect)) : 1;
  return bodyScale * responsiveScale;
}

/**
 * Damped, data-driven camera. Eases toward the active creature's authored preset with subtle
 * scroll-linked dolly/parallax. In Explore mode it hands control to OrbitControls and stops
 * driving the camera (brief §11).
 */
export function CameraController({ creature, exploreMode, reducedMotion }: Props) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const target = useRef(new THREE.Vector3(...DEFAULT_PRESET.target));

  useFrame((_, delta) => {
    if (exploreMode) return;

    const preset = creature?.cameraPreset ?? DEFAULT_PRESET;
    const [authoredX, authoredY, authoredZ] = preset.position;
    const [tx, ty, tz] = preset.target;
    const fitScale = modelFitScale(creature, camera.aspect);
    const px = tx + (authoredX - tx) * fitScale;
    const py = ty + (authoredY - ty) * fitScale;
    const pz = tz + (authoredZ - tz) * fitScale;

    // Subtle cinematic drift tied to damped scroll (skipped under reduced motion).
    const t = scrollRef.damped;
    const drift = reducedMotion ? 0 : Math.sin(t * Math.PI * 8) * 0.25;
    const rise = reducedMotion ? 0 : Math.cos(t * Math.PI * 6) * 0.15;

    const smooth = reducedMotion ? 0.0001 : 0.6;
    damp3(camera.position, [px + drift, py + rise, pz], smooth, delta);
    damp3(target.current, [tx, ty, tz], smooth, delta);

    const targetFov = preset.fov ?? DEFAULT_PRESET.fov;
    damp(camera as unknown as { fov: number }, 'fov', targetFov, smooth, delta);
    camera.updateProjectionMatrix();
    camera.lookAt(target.current);
  });

  if (exploreMode) {
    const preset = creature?.cameraPreset ?? DEFAULT_PRESET;
    return (
      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={2.5}
        maxDistance={18}
        maxPolarAngle={Math.PI * 0.52}
        target={preset.target}
        enableDamping
        dampingFactor={0.08}
      />
    );
  }
  return null;
}
