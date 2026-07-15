import { useEffect, useMemo, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame, useLoader, useThree, type ThreeEvent } from '@react-three/fiber';
import { SkeletonUtils } from 'three-stdlib';
import * as THREE from 'three';
import type { Creature } from '@/data/types';
import { normaliseModel, prepareForScene, pickClip } from '@/utils/model';
import { withBase } from '@/utils/asset';
import { scrollRef } from '@/store/scrollRef';
import { useExperience } from '@/store/experienceStore';
import { resolveChapter, creatureFade, mobileModelFade } from '@/utils/timeline';
import { NON_GLTF_LOADER, normaliseLoaded, isGltf } from './modelLoaders';

interface Props {
  creature: Creature;
  /** Whether the model is the active one (drives fade + animation). */
  active: boolean;
  /** Auto-normalised target height in world units. */
  targetHeight?: number;
}

interface PointerCaptureTarget {
  setPointerCapture: (pointerId: number) => void;
  hasPointerCapture: (pointerId: number) => boolean;
  releasePointerCapture: (pointerId: number) => void;
}

/**
 * Format dispatcher. glTF/GLB keeps drei's battle-tested `useGLTF` path; FBX/OBJ/STL/PLY go
 * through the loader registry. Both hand a common { scene, animations } to <ModelPresenter/>,
 * so drag-rotation, fade, framing and animation logic live in exactly one place.
 */
export function CreatureModel(props: Props) {
  return isGltf(props.creature.assetFormat) ? (
    <GltfCreatureModel {...props} />
  ) : (
    <GenericCreatureModel {...props} />
  );
}

function GltfCreatureModel(props: Props) {
  const { scene, animations } = useGLTF(withBase(props.creature.modelPath));
  return <ModelPresenter {...props} scene={scene} animations={animations} />;
}

function GenericCreatureModel(props: Props) {
  const format = props.creature.assetFormat;
  const LoaderClass = NON_GLTF_LOADER[format];
  if (!LoaderClass && import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.warn(`[Mesozoica] Unsupported asset format "${format}" for ${props.creature.id}`);
  }
  // LoaderClass is guaranteed for non-glTF formats by the manifest enum.
  const loaded = useLoader(LoaderClass!, withBase(props.creature.modelPath));
  const asset = useMemo(() => normaliseLoaded(format, loaded), [format, loaded]);
  return <ModelPresenter {...props} scene={asset.scene} animations={asset.animations} />;
}

interface PresenterProps extends Props {
  scene: THREE.Object3D;
  animations: THREE.AnimationClip[];
}

/**
 * Shared presentation: normalises + frames the model, detects clips at RUNTIME, plays them only
 * when the manifest allows native animation, applies drag-rotation, and fades in/out. Static
 * models never fake a skeleton; aquatic/flying models get a subtle whole-object drift and never
 * deform. A SkeletonUtils clone keeps everything local to this creature.
 */
function ModelPresenter({
  creature,
  active,
  scene,
  animations,
  targetHeight = 3.2,
}: PresenterProps) {
  const viewportWidth = useThree((state) => state.size.width);
  // Three views: phone <768, tablet 768–1023, desktop ≥1024 (matches Tailwind md/lg).
  const device = viewportWidth >= 1024 ? 'desktop' : viewportWidth >= 768 ? 'tablet' : 'phone';
  const isDesktop = device === 'desktop';
  // Manual per-view tuning: `deviceOverrides.<view>` in creatures.ts beats the base transform.
  const override = creature.deviceOverrides[device];
  const position = override?.position ?? creature.position;
  const scale = override?.scale ?? creature.scale;
  const rotation = override?.rotation ?? creature.rotation;
  // Desktop layout reads left-to-right: timeline, facts, copy, then the model (staged right of
  // the side panel). Phone/tablet have no side panel, so centre the model horizontally unless an
  // override explicitly positions it — the base x-offset only composes around the desktop text.
  const modelX = isDesktop ? position[0] + 3.8 : override?.position ? position[0] : 0;

  // Independent instance; wrapped so a Z-up source can be corrected without fighting normalisation.
  const model = useMemo(() => {
    const clone = SkeletonUtils.clone(scene);
    prepareForScene(clone);
    if (creature.upAxis === 'z') clone.rotation.x = -Math.PI / 2;
    const wrapper = new THREE.Group();
    wrapper.add(clone);
    normaliseModel(wrapper, targetHeight);
    return wrapper;
  }, [scene, creature.upAxis, targetHeight]);

  const group = useRef<THREE.Group>(null);
  const userRotation = useRef(0);
  const drag = useRef({ active: false, lastX: 0 });
  const { actions, mixer, names } = useAnimations(animations, group);
  const exploreMode = useExperience((state) => state.exploreMode);
  const exploreAnimationPlayRequest = useExperience(
    (state) => state.exploreAnimationPlayRequest,
  );
  const setExploreAnimationAvailable = useExperience(
    (state) => state.setExploreAnimationAvailable,
  );
  const finishExploreAnimation = useExperience((state) => state.finishExploreAnimation);
  const lastExplorePlayRequest = useRef(exploreAnimationPlayRequest);
  const selectedClip = useMemo(
    () => pickClip(animations, creature.preferredAnimation),
    [animations, creature.preferredAnimation],
  );

  const startDrag = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    drag.current.active = true;
    drag.current.lastX = event.clientX;
    (event.target as unknown as PointerCaptureTarget).setPointerCapture(event.pointerId);
  };
  const moveDrag = (event: ThreeEvent<PointerEvent>) => {
    if (!drag.current.active) return;
    event.stopPropagation();
    userRotation.current += (event.clientX - drag.current.lastX) * 0.009;
    drag.current.lastX = event.clientX;
  };
  const stopDrag = (event: ThreeEvent<PointerEvent>) => {
    if (!drag.current.active) return;
    event.stopPropagation();
    drag.current.active = false;
    const target = event.target as unknown as PointerCaptureTarget;
    if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId);
  };

  useEffect(
    () => () => {
      delete document.documentElement.dataset.modelHover;
    },
    [],
  );

  // Log detected clips once, in dev — the "inspect real clips" requirement.
  useEffect(() => {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.info(
        `[Mesozoica] ${creature.displayName} (${creature.assetFormat}/${creature.animationMode}) — ${names.length} clip(s):`,
        names.length ? names.join(', ') : '(none)',
      );
    }
  }, [creature.displayName, creature.assetFormat, creature.animationMode, names]);

  // Play a clip only when the manifest asks for native animation — never fake a rig otherwise.
  useEffect(() => {
    const available =
      creature.animationMode === 'native' &&
      selectedClip !== null &&
      actions[selectedClip.name] !== undefined;
    setExploreAnimationAvailable(available);
    return () => setExploreAnimationAvailable(false);
  }, [actions, creature.animationMode, selectedClip, setExploreAnimationAvailable]);

  // Normal timeline playback is unchanged. Explore mode pauses the current clip immediately and
  // does not start the normal repeat/pause cycle again until the viewer closes Explore mode.
  useEffect(() => {
    if (creature.animationMode !== 'native') return;
    if (!selectedClip || !actions[selectedClip.name]) return;
    const action = actions[selectedClip.name]!;

    if (exploreMode) {
      action.paused = true;
      return () => {
        action.paused = false;
      };
    }

    let timeout: number | null = null;
    const pauseMs = (creature.animationPauseSeconds ?? 0) * 1000;
    const playOnce = () => {
      action.paused = false;
      action.setEffectiveTimeScale(creature.animationSpeed);
      action.reset().fadeIn(0.6).play();
    };

    if (pauseMs > 0) {
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
      const onFinished = (event: { action: THREE.AnimationAction }) => {
        if (event.action !== action) return;
        timeout = window.setTimeout(playOnce, pauseMs);
      };
      mixer.addEventListener('finished', onFinished);
      playOnce();
      return () => {
        if (timeout) window.clearTimeout(timeout);
        mixer.removeEventListener('finished', onFinished);
        action.fadeOut(0.4);
      };
    }

    action.setLoop(THREE.LoopRepeat, Infinity);
    action.clampWhenFinished = false;
    playOnce();
    return () => {
      action.fadeOut(0.4);
    };
  }, [
    actions,
    creature.animationMode,
    creature.animationPauseSeconds,
    creature.animationSpeed,
    exploreMode,
    mixer,
    selectedClip,
  ]);

  // A request from the Explore UI restarts the selected native clip and runs it exactly once.
  // Its final frame stays clamped; Close restores the normal timeline animation branch above.
  useEffect(() => {
    if (!exploreMode) {
      lastExplorePlayRequest.current = exploreAnimationPlayRequest;
      return;
    }
    if (exploreAnimationPlayRequest === lastExplorePlayRequest.current) return;
    lastExplorePlayRequest.current = exploreAnimationPlayRequest;

    if (
      creature.animationMode !== 'native' ||
      !selectedClip ||
      !actions[selectedClip.name]
    ) {
      finishExploreAnimation();
      return;
    }

    const action = actions[selectedClip.name]!;
    const onFinished = (event: { action: THREE.AnimationAction }) => {
      if (event.action !== action) return;
      action.paused = true;
      finishExploreAnimation();
    };

    mixer.addEventListener('finished', onFinished);
    action.reset();
    action.enabled = true;
    action.paused = false;
    action.clampWhenFinished = true;
    action.setLoop(THREE.LoopOnce, 1);
    action.setEffectiveTimeScale(creature.animationSpeed);
    action.fadeIn(0.2).play();

    return () => {
      mixer.removeEventListener('finished', onFinished);
    };
  }, [
    actions,
    creature.animationMode,
    creature.animationSpeed,
    exploreAnimationPlayRequest,
    exploreMode,
    finishExploreAnimation,
    mixer,
    selectedClip,
  ]);

  // Fade opacity in/out, preserving each material's authored alphaMode.
  const fade = useRef(0);
  const materials = useMemo(() => {
    const list: Array<{ material: THREE.Material; opacity: number; transparent: boolean }> = [];
    model.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        const mats = Array.isArray(m.material) ? m.material : [m.material];
        mats.forEach((mat) =>
          list.push({ material: mat, opacity: mat.opacity, transparent: mat.transparent }),
        );
      }
    });
    return list;
  }, [model]);

  const baseY = position[1];

  useFrame((_, delta) => {
    const { local } = resolveChapter(scrollRef.progress);
    // Shared envelope: desktop fades model + info window together (creatureFade); phone/tablet
    // play the sequential mobile phases, where the model owns the middle of the chapter.
    const target = active ? (isDesktop ? creatureFade(local) : mobileModelFade(local)) : 0;
    fade.current += (target - fade.current) * Math.min(1, delta * 3.5);
    for (const { material, opacity, transparent } of materials) {
      material.opacity = transparent ? opacity * fade.current : opacity;
    }

    // Explore freezes procedural drift and idle sway too; native one-shot playback is handled by
    // the AnimationMixer above and can still be explicitly requested from the overlay.
    if (!group.current || exploreMode) return;
    const t = performance.now() * 0.001;
    const mode = creature.animationMode;
    // Whole-object motion only — the mesh is never deformed procedurally.
    if (mode === 'proceduralWholeObject') {
      // Gentle swim/glide for aquatic and flying models. Damped, non-repetitive-looking.
      group.current.rotation.x = rotation[0];
      group.current.rotation.y = rotation[1] + userRotation.current + Math.sin(t * 0.24) * 0.12;
      group.current.rotation.z = rotation[2] + Math.sin(t * 0.4) * 0.03;
      group.current.position.y = baseY + Math.sin(t * 0.5) * 0.08;
    } else {
      // Native models with no clip get a barely-there breathing sway; static/disabled stay put.
      const idleSway = mode === 'native' && names.length === 0 ? Math.sin(t * 0.3) * 0.04 : 0;
      group.current.rotation.y = rotation[1] + userRotation.current + idleSway;
    }
  });

  return (
    <group
      ref={group}
      position={[modelX, position[1], position[2]]}
      rotation={rotation}
      scale={scale}
      onPointerDown={startDrag}
      onPointerMove={moveDrag}
      onPointerUp={stopDrag}
      onPointerCancel={stopDrag}
      onPointerOver={() => {
        document.documentElement.dataset.modelHover = 'true';
      }}
      onPointerOut={() => {
        delete document.documentElement.dataset.modelHover;
      }}
    >
      <primitive object={model} />
    </group>
  );
}
