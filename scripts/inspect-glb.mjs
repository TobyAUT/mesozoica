// Inspect GLB files: reads the glTF JSON chunk (no three.js needed) and reports meshes, animation
// clip names, whether it's rigged (skins), materials/textures, and a rough bounding size from the
// POSITION accessor bounds. Used to verify new models and decide animation mode / scale.
//
// Usage: node scripts/inspect-glb.mjs <file.glb> [more.glb ...]
import { readFileSync } from 'node:fs';
import path from 'node:path';

function readGlbJson(file) {
  const buf = readFileSync(file);
  const magic = buf.readUInt32LE(0);
  if (magic !== 0x46546c67) throw new Error('not a GLB (bad magic)');
  let offset = 12;
  while (offset < buf.length) {
    const chunkLen = buf.readUInt32LE(offset);
    const chunkType = buf.readUInt32LE(offset + 4);
    const data = buf.subarray(offset + 8, offset + 8 + chunkLen);
    if (chunkType === 0x4e4f534a) return JSON.parse(data.toString('utf8')); // "JSON"
    offset += 8 + chunkLen;
  }
  throw new Error('no JSON chunk');
}

function bounds(gltf) {
  // Union of POSITION accessor min/max across all mesh primitives (ignores node transforms → rough).
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  for (const mesh of gltf.meshes ?? []) {
    for (const prim of mesh.primitives ?? []) {
      const acc = gltf.accessors?.[prim.attributes?.POSITION];
      if (acc?.min && acc?.max) {
        for (let i = 0; i < 3; i++) {
          min[i] = Math.min(min[i], acc.min[i]);
          max[i] = Math.max(max[i], acc.max[i]);
        }
      }
    }
  }
  if (!isFinite(min[0])) return null;
  return { size: max.map((v, i) => +(v - min[i]).toFixed(3)) };
}

for (const file of process.argv.slice(2)) {
  try {
    const g = readGlbJson(file);
    const b = bounds(g);
    console.log(`\n=== ${path.basename(file)} ===`);
    console.log(`  generator: ${g.asset?.generator ?? '?'}`);
    console.log(`  meshes: ${g.meshes?.length ?? 0} · nodes: ${g.nodes?.length ?? 0} · skins(rig): ${g.skins?.length ?? 0}`);
    console.log(`  materials: ${g.materials?.length ?? 0} · images(tex): ${g.images?.length ?? 0}`);
    console.log(`  animations: ${g.animations?.length ? g.animations.map((a) => a.name ?? '(unnamed)').join(', ') : '(none)'}`);
    console.log(`  rough size (model units, W×H×D): ${b ? b.size.join(' × ') : 'unknown'}`);
  } catch (e) {
    console.log(`\n=== ${path.basename(file)} ===\n  ERROR: ${e.message}`);
  }
}
