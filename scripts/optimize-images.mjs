// One-off asset optimiser. Converts the heavy PNG backgrounds to WebP (typically ~10× smaller,
// no visible quality loss for full-bleed backdrops) and bakes a light gaussian blur into the four
// AI-generated ocean backdrops so the swimming creatures read clearly in front of them.
//
// Run: node scripts/optimize-images.mjs
import sharp from 'sharp';
import { readdir, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const PUB_IMAGES = path.join(ROOT, 'public', 'Images');
const SRC_OCEAN = path.join(ROOT, 'Images');

const MAX_W = 2560; // backgrounds never need more than this on screen
const Q = 80;

async function toWebp(input, output, { blur = 0 } = {}) {
  let img = sharp(input).resize({ width: MAX_W, withoutEnlargement: true });
  if (blur > 0) img = img.blur(blur);
  await img.webp({ quality: Q, effort: 5 }).toFile(output);
  const { size } = await stat(output);
  console.log(`  ${path.basename(output)}  ${(size / 1024).toFixed(0)} KB`);
}

// Ocean backdrops (AI-generated) → clean ids, with a light gaussian blur baked in.
const OCEAN = {
  '01_devonian_ocean_no_dunkleosteus_4k.png': 'devonian-ocean.webp',
  '02_early_jurassic_ocean_no_plesiosaurus_4k.png': 'early-jurassic-ocean.webp',
  '03_late_cretaceous_ocean_no_tylosaurus_4k.png': 'late-cretaceous-ocean.webp',
  '04_late_cretaceous_ocean_no_mosasaurus_4k.png': 'late-cretaceous-ocean-mosasaurus.webp',
};

async function main() {
  await mkdir(PUB_IMAGES, { recursive: true });

  console.log('Land backgrounds → WebP:');
  const files = await readdir(PUB_IMAGES);
  for (const f of files) {
    if (!f.toLowerCase().endsWith('.png')) continue;
    const out = path.join(PUB_IMAGES, f.replace(/\.png$/i, '.webp'));
    await toWebp(path.join(PUB_IMAGES, f), out);
  }

  console.log('Ocean backgrounds (blurred) → WebP:');
  for (const [src, dest] of Object.entries(OCEAN)) {
    await toWebp(path.join(SRC_OCEAN, src), path.join(PUB_IMAGES, dest), { blur: 6 });
  }
  console.log('Done.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
