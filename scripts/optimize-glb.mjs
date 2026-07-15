// Optimize the runtime GLB models in public/models for web delivery.
//
// The Sketchfab source models are almost entirely uncompressed 2K PNG textures (base colour +
// metallic-roughness + normal per material), which is why several run to tens — or in Carnotaurus'
// case ~100 — of megabytes. We recompress every texture to WebP (natively decoded by three.js /
// the browser, so NO runtime Draco/Meshopt decoder is added) and prune unreferenced data. Geometry
// is deliberately left untouched (`--compress false`, no simplify/weld/join): it is only a few MB
// per model, and preserving the mesh/skin/material hierarchy keeps the animation clips and the
// material-name-based display-base hiding in src/utils/model.ts working exactly as before.
//
// Originals are all git-tracked, so `git checkout <ref> -- public/models/<name>.glb` restores any.
//
// Requires the glTF-Transform CLI (kept out of package.json — this is a one-off asset step, not a
// build dependency). Install it locally first:
//   npm i --no-save @gltf-transform/cli
//
// Usage:
//   node scripts/optimize-glb.mjs                 # optimize every glb in public/models
//   node scripts/optimize-glb.mjs carnotaurus     # optimize just the named model(s)

import { execFileSync } from 'node:child_process';
import { readdirSync, statSync, renameSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const modelsDir = path.join(root, 'public', 'models');
const tmpDir = path.join(root, '.opt-tmp');
const cli = path.join(root, 'node_modules', '@gltf-transform', 'cli', 'bin', 'cli.js');

// Safe, texture-only pipeline. Everything that could alter geometry, the scene graph, or material
// identity is disabled so the models look and animate identically — just lighter to download.
const FLAGS = [
  '--compress', 'false',
  '--texture-compress', 'webp',
  '--texture-size', '2048',
  '--simplify', 'false',
  '--weld', 'false',
  '--join', 'false',
  '--flatten', 'false',
  '--instance', 'false',
  '--palette', 'false',
];

const mb = (bytes) => (bytes / 1e6).toFixed(2);

const filter = process.argv.slice(2).map((a) => a.replace(/\.glb$/i, ''));
const files = readdirSync(modelsDir)
  .filter((f) => f.toLowerCase().endsWith('.glb'))
  .filter((f) => filter.length === 0 || filter.includes(f.replace(/\.glb$/i, '')));

mkdirSync(tmpDir, { recursive: true });

let before = 0;
let after = 0;
const rows = [];

for (const file of files) {
  const src = path.join(modelsDir, file);
  const tmp = path.join(tmpDir, file);
  const srcSize = statSync(src).size;
  try {
    execFileSync(process.execPath, [cli, 'optimize', src, tmp, ...FLAGS], { stdio: 'pipe' });
  } catch (err) {
    console.error(`✗ ${file}: ${err.message}`);
    continue;
  }
  const outSize = statSync(tmp).size;
  // Only adopt the result when it is a real win (>5% smaller); some already-lean models don't gain.
  if (outSize < srcSize * 0.95) {
    renameSync(tmp, src);
    rows.push([file, srcSize, outSize, true]);
    before += srcSize;
    after += outSize;
  } else {
    rmSync(tmp);
    rows.push([file, srcSize, outSize, false]);
    before += srcSize;
    after += srcSize;
  }
}

console.log('\nmodel                              before      after     kept');
console.log('─'.repeat(66));
for (const [file, s, o, kept] of rows) {
  console.log(
    `${file.padEnd(34)} ${(mb(s) + ' MB').padStart(9)} ${(mb(o) + ' MB').padStart(9)}   ${kept ? '✔' : '—'}`,
  );
}
console.log('─'.repeat(66));
console.log(`total                              ${(mb(before) + ' MB').padStart(9)} ${(mb(after) + ' MB').padStart(9)}`);
console.log(`saved ${mb(before - after)} MB (${(((before - after) / before) * 100).toFixed(1)}%)\n`);

rmSync(tmpDir, { recursive: true, force: true });
