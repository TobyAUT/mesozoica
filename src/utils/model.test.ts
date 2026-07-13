import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { normaliseModel, pickClip } from './model';

function makeClip(name: string): THREE.AnimationClip {
  return new THREE.AnimationClip(name, 1, []);
}

describe('pickClip', () => {
  it('returns null with no clips', () => {
    expect(pickClip([], null)).toBeNull();
  });
  it('honours an exact preferred name', () => {
    const clips = [makeClip('Walk'), makeClip('Attack')];
    expect(pickClip(clips, 'Attack')?.name).toBe('Attack');
  });
  it('prefers an idle-like clip when no preference given', () => {
    const clips = [makeClip('Run'), makeClip('Idle_01'), makeClip('Jump')];
    expect(pickClip(clips, null)?.name).toBe('Idle_01');
  });
  it('falls back to locomotion, then first clip', () => {
    expect(pickClip([makeClip('FlyLoop'), makeClip('Bite')], null)?.name).toBe('FlyLoop');
    expect(pickClip([makeClip('Foo'), makeClip('Bar')], null)?.name).toBe('Foo');
  });
});

describe('normaliseModel', () => {
  it('scales a mesh to the target height and seats it on the ground', () => {
    const geo = new THREE.BoxGeometry(2, 8, 2); // 8 tall
    const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial());
    const group = new THREE.Group();
    group.add(mesh);

    const scale = normaliseModel(group, 4);
    expect(scale).toBeCloseTo(0.5, 3);

    const box = new THREE.Box3().setFromObject(group);
    const size = new THREE.Vector3();
    box.getSize(size);
    expect(size.y).toBeCloseTo(4, 2);
    // Feet on the ground.
    expect(box.min.y).toBeCloseTo(0, 2);
  });
});
