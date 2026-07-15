import { Canvas, useThree } from '@react-three/fiber';
import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei';
import { useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { TimelineScene } from './TimelineScene';
import { useDeviceQuality } from '@/hooks/useDeviceQuality';
import { ErrorBoundary } from '@/components/system/ErrorBoundary';
import { notifyUser } from '@/utils/notify';

interface Props {
  reducedMotion: boolean;
}

/**
 * Sizes the canvas from its parent's layout box on mount and on window resize, calling R3F's
 * setSize directly. This is redundant with R3F's own ResizeObserver in a normal browser, but
 * guarantees a correctly-sized canvas even in environments where ResizeObserver never ticks
 * (offscreen/non-painting tabs), instead of being stuck at the 300x150 default.
 */
function ManualResize() {
  const gl = useThree((s) => s.gl);
  const setSize = useThree((s) => s.setSize);
  useEffect(() => {
    const measure = () => {
      const parent = gl.domElement.parentElement;
      if (parent && parent.offsetWidth > 0) setSize(parent.offsetWidth, parent.offsetHeight);
    };
    measure();
    const raf = requestAnimationFrame(measure);
    window.addEventListener('resize', measure);
    window.addEventListener('orientationchange', measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', measure);
      window.removeEventListener('orientationchange', measure);
    };
  }, [gl, setSize]);
  return null;
}

/**
 * The single fixed fullscreen WebGL canvas that sits behind all DOM content. Adapts DPR to
 * runtime performance and pauses rendering when the tab is hidden (`frameloop` handled by R3F
 * default + PerformanceMonitor). No essential readable text lives inside the canvas.
 */
export function ExperienceCanvas({ reducedMotion }: Props) {
  const quality = useDeviceQuality();
  const [degraded, setDegraded] = useState(false);
  const runtimeQuality = useMemo(
    () =>
      degraded
        ? {
            ...quality,
            dpr: [Math.min(quality.dpr[0], 0.75), Math.min(quality.dpr[1], 1)] as [number, number],
            postprocessing: false,
            particles: Math.min(quality.particles, 60),
          }
        : quality,
    [degraded, quality],
  );

  return (
    // Fullscreen on every view. On phone/tablet the chapter plays as a scroll SEQUENCE (heading →
    // model → info card), so the model owns the whole screen while it is visible and the card
    // only appears after the model has faded out — no reserved bottom band needed anymore.
    <div className="fixed inset-0 z-10" aria-hidden="true">
      {/* `relative` wrapper gives the canvas a non-null offsetParent so R3F's react-use-measure
          can size it. Without it, a position:fixed ancestor makes offsetParent null and the
          canvas stays stuck at the default 300x150. */}
      <div className="relative h-full w-full">
        <ErrorBoundary
          label="WebGL canvas"
          fallback={<div className="absolute inset-0 bg-gradient-to-b from-ink-800 to-ink-900" />}
          onError={() =>
            notifyUser(
              'The 3D view could not be started on this device, so the models are hidden. All text and facts still work.',
            )
          }
        >
          <Canvas
            shadows={false}
            dpr={runtimeQuality.dpr}
            // Measure via offsetWidth/Height (layout-based) so a position:fixed ancestor can't
            // leave the canvas stuck at its default 300x150 when ResizeObserver doesn't fire.
            resize={{ offsetSize: true }}
            gl={{
              antialias: runtimeQuality.tier !== 'low',
              powerPreference: runtimeQuality.tier === 'low' ? 'low-power' : 'high-performance',
              toneMapping: THREE.NeutralToneMapping,
            }}
            style={{ touchAction: 'pan-y' }}
            camera={{ position: [6, 3, 9], fov: 44, near: 0.1, far: 200 }}
            frameloop="always"
          >
            <ManualResize />
            <PerformanceMonitor onDecline={() => setDegraded(true)} />
            <AdaptiveDpr pixelated />
            <TimelineScene
              quality={runtimeQuality}
              reducedMotion={reducedMotion}
            />
          </Canvas>
        </ErrorBoundary>
      </div>
    </div>
  );
}
