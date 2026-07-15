import { PageShell } from './PageShell';

export default function AboutPage() {
  return (
    <PageShell
      title="About the project"
      intro="Mesozoica is a cinematic, scientifically-honest journey through the Mesozoic era — built as a single fixed WebGL scene that transforms as you scroll through 186 million years of deep time."
    >
      <div className="prose-invert max-w-2xl space-y-6 text-bone/75">
        <p>
          The experience pairs real 3D models with restrained camera work, era-specific
          atmosphere, and editorial information panels. It is designed to feel like a premium
          natural-history museum rather than a game.
        </p>
        <div>
          <h2 className="type-title mb-3 text-2xl text-bone">Design principles</h2>
          <ul className="space-y-2 text-sm">
            <li>— One fixed 3D scene; the DOM provides scroll length and all readable text.</li>
            <li>— Model identity and scientific identity are treated as separate facts.</li>
            <li>— Nothing essential lives only inside WebGL; the site works with reduced motion.</li>
            <li>— Attribution is a first-class concern, never silently dropped.</li>
            <li>— Performance scales from desktop down to mobile via an adaptive quality system.</li>
          </ul>
        </div>
        <div>
          <h2 className="type-title mb-3 text-2xl text-bone">Built with</h2>
          <p className="text-sm">
            React, Three.js, React Three Fiber &amp; drei, postprocessing, Lenis for scroll,
            Motion for interface motion, Zustand, Zod, and Tailwind CSS.
          </p>
        </div>
        <div>
          <h2 className="type-title mb-3 text-2xl text-bone">Accessibility</h2>
          <p className="text-sm">
            The site respects <code>prefers-reduced-motion</code>, provides text alternatives for
            every 3D scene, supports full keyboard navigation and a command palette, and keeps all
            information available outside the canvas.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
