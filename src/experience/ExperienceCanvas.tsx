import { Canvas, useThree } from '@react-three/fiber';
import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei';
import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { TimelineScene } from './TimelineScene';
import { useDeviceQuality } from '@/hooks/useDeviceQuality';
import { ErrorBoundary } from '@/components/system/ErrorBoundary';

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

  return (
    // On mobile the canvas is inset above the bottom info card so the model is never hidden
    // behind it (order: heading, model, card). Full-screen again from lg where the panel is on
    // the left.
    <div className="fixed inset-x-0 top-0 bottom-[40svh] z-10 lg:bottom-0" aria-hidden="true">
      {/* `relative` wrapper gives the canvas a non-null offsetParent so R3F's react-use-measure
          can size it. Without it, a position:fixed ancestor makes offsetParent null and the
          canvas stays stuck at the default 300x150. */}
      <div className="relative h-full w-full">
        <ErrorBoundary
          label="WebGL canvas"
          fallback={<div className="absolute inset-0 bg-gradient-to-b from-ink-800 to-ink-900" />}
        >
          <Canvas
            shadows={false}
            dpr={quality.dpr}
            // Measure via offsetWidth/Height (layout-based) so a position:fixed ancestor can't
            // leave the canvas stuck at its default 300x150 when ResizeObserver doesn't fire.
            resize={{ offsetSize: true }}
            gl={{
              antialias: quality.tier !== 'low',
              powerPreference: 'high-performance',
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
              quality={{ ...quality, postprocessing: quality.postprocessing && !degraded }}
              reducedMotion={reducedMotion}
            />
          </Canvas>
        </ErrorBoundary>
      </div>
    </div>
  );
}
