import * as THREE from 'three';

/**
 * Auto-normalise a loaded model: centre it on the ground at the origin and scale it so its
 * height matches `targetHeight` world units. Returns the applied uniform scale so callers can
 * reason about it. Preserves the artist's proportions (uniform scale only).
 */
export function normaliseModel(root: THREE.Object3D, targetHeight = 3.2): number {
  // Reset any prior transform so this is idempotent.
  root.position.set(0, 0, 0);
  root.scale.set(1, 1, 1);
  root.updateWorldMatrix(true, true);

  const box = new THREE.Box3().setFromObject(root);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  const height = size.y || 1;
  const scale = targetHeight / height;
  root.scale.setScalar(scale);

  // Recompute after scaling, then seat the model's feet on y=0 and centre x/z.
  const box2 = new THREE.Box3().setFromObject(root);
  const min = box2.min;
  const center2 = new THREE.Vector3();
  box2.getCenter(center2);
  root.position.x -= center2.x;
  root.position.z -= center2.z;
  root.position.y -= min.y;

  return scale;
}

/** Prepare independent materials and disable model shadows for the image-backed scene. */
export function prepareForScene(root: THREE.Object3D): void {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.isMesh) {
      // SkeletonUtils clones geometry/skeletons but intentionally shares materials. Give every
      // displayed creature independent materials so fades cannot leak opacity or colour state
      // into another cached Sketchfab model.
      mesh.material = Array.isArray(mesh.material)
        ? mesh.material.map((material) => material.clone())
        : mesh.material.clone();

      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      const isStandaloneBase = materials.every((material) =>
        /(?:^|[_ .-])(sasso|ground|floor|pedestal|platform|display[ _-]?base)(?:\d|$)/i.test(
          material.name,
        ),
      );
      if (isStandaloneBase) {
        mesh.visible = false;
        return;
      }

      // Keep authored texture hues readable without turning the material unlit.
      for (const material of materials) {
        const standard = material as THREE.MeshStandardMaterial;
        if (standard.isMeshStandardMaterial && standard.map) {
          standard.map.colorSpace = THREE.SRGBColorSpace;
          standard.emissive.set('#ffffff');
          standard.emissiveMap = standard.map;
          standard.emissiveIntensity = 0.08;
        }
        // Many Sketchfab meshes are modelled single-sided (fins, wing membranes, hollow shells).
        // Their back faces cull away as the model turns, so polygons "disappear" mid-rotation.
        // Rendering both sides keeps the silhouette solid from every angle.
        material.side = THREE.DoubleSide;
      }
      mesh.castShadow = false;
      mesh.receiveShadow = false;

      // Frustum culling test uses geometry.boundingSphere. GLB accessors often ship with a stale
      // or missing sphere, so a static mesh could cull itself out of view once rotation moved its
      // (wrong) sphere off-frustum — the disappearing bug. Recompute accurate bounds so culling is
      // trustworthy again.
      if (mesh.geometry) {
        mesh.geometry.computeBoundingBox();
        mesh.geometry.computeBoundingSphere();
      }
      // Skinned meshes are the one case we can't cheaply bound: once posed/animated the body no
      // longer fits its bind-pose sphere, so keep culling off for them (accurate bounds fix the
      // rest). This is the targeted rule, not a blanket disable.
      mesh.frustumCulled = !(mesh as THREE.SkinnedMesh).isSkinnedMesh;
    }
  });
}

const IDLE_HINTS = ['idle', 'rest', 'stand', 'breath', 'stay'];
const MOVE_HINTS = ['walk', 'run', 'move', 'fly', 'swim', 'loop'];

/**
 * Pick a sensible default clip WITHOUT assuming a naming convention. Preference order:
 *  1. an explicitly requested clip name (exact match)
 *  2. a clip whose name looks idle-like
 *  3. a clip whose name looks like locomotion (e.g. flying loops)
 *  4. the first clip
 * Returns null when there are no clips.
 */
export function pickClip(
  clips: THREE.AnimationClip[],
  preferred: string | null,
): THREE.AnimationClip | null {
  if (!clips.length) return null;
  if (preferred) {
    const exact = clips.find((c) => c.name === preferred);
    if (exact) return exact;
  }
  const lower = (c: THREE.AnimationClip) => c.name.toLowerCase();
  const byHint = (hints: string[]) => clips.find((c) => hints.some((h) => lower(c).includes(h)));
  return byHint(IDLE_HINTS) ?? byHint(MOVE_HINTS) ?? clips[0];
}
