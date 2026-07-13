import * as THREE from 'three';
import { FBXLoader, OBJLoader, STLLoader, PLYLoader } from 'three-stdlib';
import type { ModelAssetFormat } from '@/data/types';

/**
 * LOADER REGISTRY for the non-glTF formats. glTF/GLB stays on drei's `useGLTF` (Draco/KTX2 aware)
 * in its own component; everything else routes through R3F's `useLoader` with the class picked
 * here — so format is data-driven (manifest `assetFormat`), never guessed from the extension.
 *
 * three-stdlib re-exports the official three.js example loaders, so no new dependency is added.
 */
export const NON_GLTF_LOADER: Partial<Record<ModelAssetFormat, new () => THREE.Loader>> = {
  fbx: FBXLoader as unknown as new () => THREE.Loader,
  obj: OBJLoader as unknown as new () => THREE.Loader,
  stl: STLLoader as unknown as new () => THREE.Loader,
  ply: PLYLoader as unknown as new () => THREE.Loader,
};

export function isGltf(format: ModelAssetFormat): boolean {
  return format === 'glb' || format === 'gltf';
}

export interface LoadedAsset {
  scene: THREE.Object3D;
  animations: THREE.AnimationClip[];
}

/**
 * Normalise a `useLoader` result into a common { scene, animations } shape.
 * - FBX → Group (carries its own `.animations`)
 * - OBJ → Group (no animations)
 * - STL/PLY → BufferGeometry → wrapped in a lit Mesh; generates normals only if missing
 *   (never overwrites authored normals).
 */
export function normaliseLoaded(format: ModelAssetFormat, loaded: unknown): LoadedAsset {
  if (format === 'fbx') {
    const group = loaded as THREE.Group & { animations?: THREE.AnimationClip[] };
    return { scene: group, animations: group.animations ?? [] };
  }
  if (format === 'obj') {
    return { scene: loaded as THREE.Group, animations: [] };
  }
  // stl / ply resolve to a BufferGeometry.
  const geometry = loaded as THREE.BufferGeometry;
  if (!geometry.attributes.normal) geometry.computeVertexNormals();
  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({ color: '#b6ad9f', roughness: 0.82, metalness: 0.04 }),
  );
  return { scene: mesh, animations: [] };
}
