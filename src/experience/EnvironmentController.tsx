import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { backgroundOrFallback } from '@/data/backgrounds';

interface Props {
  backgroundId: string;
  reducedMotion: boolean;
}

/**
 * Drives scene fog from the active background. Model lights stay neutral so the original
 * Sketchfab textures retain their authored colours in every era.
 */
export function EnvironmentController({ backgroundId }: Props) {
  const scene = useThree((s) => s.scene);
  const fog = useRef<THREE.FogExp2>();
  const key = useRef<THREE.DirectionalLight>(null);
  const fill = useRef<THREE.HemisphereLight>(null);

  if (!fog.current) {
    // A very light depth haze only. Dense coloured fog changes the apparent texture colours.
    fog.current = new THREE.FogExp2('#3f6f6d', 0.012);
    scene.fog = fog.current;
  }

  const targetFog = useRef(new THREE.Color('#3f6f6d'));

  useFrame((_, delta) => {
    const def = backgroundOrFallback(backgroundId);
    targetFog.current.set(def.fog);
    const k = Math.min(1, delta * 1.5);
    if (fog.current) fog.current.color.lerp(targetFog.current, k);
  });

  return (
    <>
      <ambientLight color="#ffffff" intensity={0.8} />
      <hemisphereLight ref={fill} color="#ffffff" groundColor="#8a8a8a" intensity={0.95} />
      <directionalLight ref={key} color="#ffffff" position={[6, 9, 4]} intensity={2.15} />
    </>
  );
}
