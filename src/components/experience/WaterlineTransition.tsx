import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { scrollRef } from '@/store/scrollRef';
import { submersionAt, HAS_AQUATIC } from '@/utils/water';
import type { ResolvedQuality } from '@/hooks/useDeviceQuality';

/**
 * WATER TRANSITION — a self-contained fullscreen GLSL overlay in its own tiny Three.js renderer,
 * layered above the 3D scene but below the text UI. It never touches the main canvas, so it
 * cannot regress the scene.
 *
 * Driven by `submersionAt(scroll)`: a noisy waterline rises from the bottom of the viewport, the
 * area below it gets blue-green refraction, caustic light and suspended particles, and at full
 * submersion the whole screen becomes the underwater grade. Fully reversible on scroll-back.
 *
 * Quality/reduced-motion: `uTime` animation is frozen under reduced motion (static crossfade by
 * submersion), and the pixel ratio is clamped down on low-power devices.
 *
 * NOTE (see HANDOFF): this is the portable baseline that also serves as the low/mobile fallback.
 * The high-tier reflective three/addons Water surface + camera dip is a documented next step.
 */
const FRAG = /* glsl */ `
precision highp float;
uniform float uProgress;      // 0 = dry, 1 = fully submerged
uniform float uTime;
uniform vec2  uResolution;
uniform float uEdgeNoise;
uniform float uDistortionStrength;
uniform vec3  uWaterColor;
uniform float uOpacity;
varying vec2 vUv;

// cheap hash noise
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
float noise(vec2 p){
  vec2 i=floor(p), f=fract(p);
  float a=hash(i), b=hash(i+vec2(1.,0.)), c=hash(i+vec2(0.,1.)), d=hash(i+vec2(1.,1.));
  vec2 u=f*f*(3.-2.*f);
  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}

void main(){
  vec2 uv = vUv;
  // Waterline height rises with progress; a little slack so it fully clears top & bottom.
  float line = uProgress * 1.15 - 0.075;
  // Noisy, moving surface edge so the line is never perfectly straight.
  float wobble = (noise(vec2(uv.x*6.0, uTime*0.35)) - 0.5) * uEdgeNoise
               + (noise(vec2(uv.x*18.0, uTime*0.6)) - 0.5) * uEdgeNoise * 0.4;
  float surface = line + wobble;
  float below = smoothstep(surface + 0.012, surface - 0.012, uv.y); // 1 below the line

  if (below <= 0.001) { discard; }

  // Depth below surface (0 at line, 1 deep) for grading.
  float depth = clamp((surface - uv.y) / max(surface, 0.001), 0.0, 1.0);

  // Refraction/distortion ripple, strongest near the surface.
  float ripple = sin((uv.x*22.0) + uTime*1.4) * 0.5 + 0.5;
  float nearSurface = smoothstep(0.16, 0.0, surface - uv.y);
  float distort = ripple * uDistortionStrength * (0.35 + nearSurface);

  // Caustic light bands.
  float caustic = noise(vec2(uv.x*10.0 + uTime*0.25, uv.y*10.0 - uTime*0.2));
  caustic = pow(caustic, 3.0) * (0.6 + 0.4*nearSurface);

  // Suspended particles.
  float parts = step(0.995, hash(floor(vec2(uv.x*140.0, uv.y*140.0 - uTime*4.0))));

  vec3 col = uWaterColor * (0.55 + 0.5*depth);
  col += vec3(0.35,0.55,0.5) * caustic * 0.5;
  col += vec3(0.7,0.85,0.85) * parts * 0.5;
  col += distort * 0.06;

  // Bright crest highlight right at the waterline.
  float crest = smoothstep(0.02, 0.0, abs(uv.y - surface));
  col += vec3(0.8,0.95,0.95) * crest * 0.35;

  float alpha = below * uOpacity * (0.5 + 0.5*depth + crest*0.5);
  gl_FragColor = vec4(col, clamp(alpha, 0.0, 0.96));
}
`;

const VERT = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

interface Props {
  quality: ResolvedQuality;
  reducedMotion: boolean;
}

export function WaterlineTransition({ quality, reducedMotion }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!HAS_AQUATIC) return; // nothing aquatic in the timeline → don't spin up a renderer
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    } catch {
      return; // no WebGL → the site still works, just without the water overlay
    }
    const maxDpr = quality.tier === 'low' ? 1 : 1.5;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr));

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    const uniforms = {
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uEdgeNoise: { value: 0.035 },
      uDistortionStrength: { value: reducedMotion ? 0 : 0.5 },
      uWaterColor: { value: new THREE.Color('#1c6f74') },
      uOpacity: { value: 0.92 },
    };
    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(quad);

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      uniforms.uResolution.value.set(w, h);
    };
    resize();
    window.addEventListener('resize', resize);

    let raf = 0;
    let visibleProgress = 0;
    const start = performance.now();
    const loop = () => {
      const target = submersionAt(scrollRef.progress);
      // Damp toward target so the surface eases rather than snaps.
      visibleProgress += (target - visibleProgress) * (reducedMotion ? 1 : 0.12);
      uniforms.uProgress.value = visibleProgress;
      uniforms.uTime.value = reducedMotion ? 0 : (performance.now() - start) * 0.001;
      // Skip the draw entirely when dry — no cost outside aquatic chapters.
      canvas.style.opacity = visibleProgress > 0.002 ? '1' : '0';
      if (visibleProgress > 0.002) renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      quad.geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [quality.tier, reducedMotion]);

  if (!HAS_AQUATIC) return null;
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-10 h-full w-full transition-opacity duration-500"
      style={{ opacity: 0 }}
    />
  );
}
