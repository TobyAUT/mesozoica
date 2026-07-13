import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { copyFileSync } from 'node:fs';

// GitHub Pages serves a project site under /<repo>/. Override with BASE_PATH in CI if the repo
// is renamed. Locally (dev / preview) base stays "/".
const base = process.env.BASE_PATH ?? '/';

/** Copy index.html → 404.html so client-side routes work on GitHub Pages (SPA fallback). */
function spaFallback() {
  return {
    name: 'spa-404-fallback',
    closeBundle() {
      try {
        copyFileSync(path.resolve(__dirname, 'dist/index.html'), path.resolve(__dirname, 'dist/404.html'));
      } catch {
        /* dist/index.html not present (e.g. non-build command) */
      }
    },
  };
}

export default defineConfig({
  base,
  plugins: [react(), spaFallback()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  build: {
    target: 'es2020',
    // GLB models are large; raising the warn limit avoids noisy but harmless warnings.
    chunkSizeWarningLimit: 1500,
  },
  assetsInclude: ['**/*.glb'],
});
