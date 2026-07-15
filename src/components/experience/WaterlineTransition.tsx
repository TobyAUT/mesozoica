import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SCROLL_PROGRESS_EVENT, scrollRef } from '@/store/scrollRef';
import { submersionAt, HAS_AQUATIC } from '@/utils/water';
import type { ResolvedQuality } from '@/hooks/useDeviceQuality';
import { useMediaQuery } from '@/hooks/useMediaQuery';

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

float bubbleLayer(vec2 uv, float columns, float rows, float speed, float seedOffset){
  vec2 p = vec2(uv.x * columns, uv.y * rows - uTime * speed);
  vec2 cell = floor(p);
  vec2 local = fract(p) - 0.5;
  float seed = hash(cell + seedOffset);
  local.x += (hash(cell + vec2(3.1, 7.7) + seedOffset) - 0.5) * 0.62;
  local.y += (hash(cell + vec2(8.2, 2.4) + seedOffset) - 0.5) * 0.42;
  local.y *= (columns / rows) * (uResolution.y / max(uResolution.x, 1.0));

  float radius = mix(0.038, 0.078, seed);
  float distanceToCentre = length(local);
  float outer = 1.0 - smoothstep(radius * 0.76, radius, distanceToCentre);
  float inner = 1.0 - smoothstep(radius * 0.34, radius * 0.56, distanceToCentre);
  float ring = max(outer - inner, 0.0);
  float glint = 1.0 - smoothstep(
    radius * 0.08,
    radius * 0.24,
    length(local - vec2(-radius * 0.34, radius * 0.34))
  );
  return ring + glint * 0.42;
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

  // Two sparse layers of circular bubbles moving upward at different speeds.
  float bubbles = bubbleLayer(uv, 9.0, 5.0, 0.72, 2.7)
                + bubbleLayer(uv, 14.0, 8.0, 1.05, 8.4) * 0.55;

  vec3 col = uWaterColor * (0.55 + 0.5*depth);
  col += vec3(0.35,0.55,0.5) * caustic * 0.5;
  col += vec3(0.72,0.92,0.94) * bubbles * (0.32 + nearSurface * 0.22);
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
  // Phones (<768px) skip the water effect entirely — no overlay, no CSS grade, no extra renderer.
  // Tablet and desktop keep it.
  const isPhone = useMediaQuery('(max-width: 767px)');

  useEffect(() => {
    if (!HAS_AQUATIC || isPhone) return; // nothing aquatic / phone view → don't spin up a renderer
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Low tier: preserve the rising-water transition with a CSS grade, but avoid a second WebGL
    // context, fullscreen shader, high-frequency bubble noise and another permanent render loop.
    if (quality.tier === 'low') {
      canvas.style.background =
        'linear-gradient(to bottom, rgba(45,132,139,0.5), rgba(8,55,66,0.92))';
      canvas.style.transition = reducedMotion
        ? 'none'
        : 'opacity 180ms ease-out, clip-path 180ms linear';
      const update = () => {
        const progress = submersionAt(scrollRef.progress);
        canvas.style.opacity = progress > 0.002 ? '1' : '0';
        canvas.style.clipPath = `inset(${Math.max(0, (1 - progress) * 100)}% 0 0 0)`;
      };
      update();
      window.addEventListener(SCROLL_PROGRESS_EVENT, update);
      return () => window.removeEventListener(SCROLL_PROGRESS_EVENT, update);
    }

    // Clear inline fallback styles when switching from Low back to Balanced/High.
    canvas.style.background = 'none';
    canvas.style.clipPath = 'none';
    canvas.style.transition = '';

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    } catch {
      return; // no WebGL → the site still works, just without the water overlay
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

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
      raf = 0;
      const target = submersionAt(scrollRef.progress);
      // Damp toward target so the surface eases rather than snaps.
      visibleProgress += (target - visibleProgress) * (reducedMotion ? 1 : 0.12);
      uniforms.uProgress.value = visibleProgress;
      uniforms.uTime.value = reducedMotion ? 0 : (performance.now() - start) * 0.001;
      // Skip the draw entirely when dry — no cost outside aquatic chapters.
      canvas.style.opacity = visibleProgress > 0.002 ? '1' : '0';
      if (visibleProgress > 0.002) renderer.render(scene, camera);
      // Stay animated while water is visible. When dry, sleep completely until the next scroll
      // event wakes the effect instead of polling for the entire terrestrial timeline.
      if (target > 0.002 || visibleProgress > 0.002) raf = requestAnimationFrame(loop);
    };
    const ensureLoop = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };
    ensureLoop();
    window.addEventListener(SCROLL_PROGRESS_EVENT, ensureLoop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener(SCROLL_PROGRESS_EVENT, ensureLoop);
      window.removeEventListener('resize', resize);
      quad.geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [quality.tier, reducedMotion, isPhone]);

  if (!HAS_AQUATIC || isPhone) return null;
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-10 h-full w-full transition-opacity duration-500"
      style={{ opacity: 0 }}
    />
  );
}
