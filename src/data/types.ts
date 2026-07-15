import { z } from 'zod';

/**
 * Scientific status is deliberately separate from model/reconstruction quality.
 * It answers "how confident are we in the species identity", not "how good is the mesh".
 */
export const scientificStatusSchema = z.enum([
  'verified',
  'generic',
  'stylized',
  'uncertain',
  'nonDinosaur',
  'groupScene',
]);
export type ScientificStatus = z.infer<typeof scientificStatusSchema>;

export const creatureGroupSchema = z.enum([
  'theropod',
  'sauropod',
  'sauropodomorph',
  'ceratopsian',
  'ankylosaur',
  'stegosaur',
  'ornithopod',
  'pachycephalosaur',
  'hadrosaur',
  'marineReptile',
  'synapsid',
  'pterosaur',
  'avialan',
  'fish',
  'stylized',
  'mixed',
]);
export type CreatureGroup = z.infer<typeof creatureGroupSchema>;

export const periodSchema = z.enum([
  'Devonian',
  'Triassic',
  'Early Jurassic',
  'Middle Jurassic',
  'Late Jurassic',
  'Early Cretaceous',
  'Late Cretaceous',
  'Latest Cretaceous',
]);
export type Period = z.infer<typeof periodSchema>;

/**
 * Supported 3D asset containers. The loader registry (see experience/modelLoaders) picks a
 * Three.js loader from this, so format is driven by data — not guessed from the file extension.
 */
export const modelAssetFormatSchema = z.enum(['glb', 'gltf', 'fbx', 'obj', 'stl', 'ply']);
export type ModelAssetFormat = z.infer<typeof modelAssetFormatSchema>;

/** How a chapter frames its creature: on land, underwater, or above a coast. */
export const sceneTypeSchema = z.enum(['terrestrial', 'underwater', 'aerialCoastal']);
export type SceneType = z.infer<typeof sceneTypeSchema>;

/**
 * How a model is animated. `native` = use an included rig/clip; `static` = no skeleton, use
 * camera/atmosphere only; `proceduralWholeObject` = move the whole transform (drift/glide) but
 * never deform the mesh; `disabled` = do not animate.
 */
export const animationModeSchema = z.enum([
  'native',
  'static',
  'proceduralWholeObject',
  'disabled',
]);
export type AnimationMode = z.infer<typeof animationModeSchema>;

const vec3 = z.tuple([z.number(), z.number(), z.number()]);

/**
 * MANUAL PER-DEVICE 3D TUNING. The base `position`/`scale`/`rotation` on a creature apply to every
 * view; set `deviceOverrides.phone/tablet/desktop` in creatures.ts to reposition/rescale/rotate a
 * model for ONE view only. Views: phone <768px, tablet 768–1023px, desktop ≥1024px.
 * Example: `deviceOverrides: { phone: { scale: 1.4, position: [0, -1, 0] } }`.
 * Note: on phone/tablet the model is horizontally centred unless the override sets a position.
 */
const deviceTransformSchema = z.object({
  position: vec3.optional(),
  scale: z.number().positive().optional(),
  rotation: vec3.optional(),
});
export const deviceOverridesSchema = z
  .object({
    phone: deviceTransformSchema.optional(),
    tablet: deviceTransformSchema.optional(),
    desktop: deviceTransformSchema.optional(),
  })
  .default({});
export type DeviceOverrides = z.infer<typeof deviceOverridesSchema>;

export const cameraPresetSchema = z.object({
  /** Camera world position. */
  position: vec3,
  /** Look-at target. */
  target: vec3,
  fov: z.number().min(20).max(90).default(42),
  /** Seconds for the authored transition into this preset. */
  transition: z.number().positive().default(2.2),
});
export type CameraPreset = z.infer<typeof cameraPresetSchema>;

export const creatureSchema = z.object({
  id: z.string(),
  sourceTitle: z.string(),
  displayName: z.string(),
  scientificName: z.string().nullable(),
  scientificStatus: scientificStatusSchema,
  creatureGroup: creatureGroupSchema,
  period: periodSchema,
  approximateTimeStartMya: z.number().nullable(),
  approximateTimeEndMya: z.number().nullable(),
  continent: z.string().nullable(),
  habitat: z.string().nullable(),
  diet: z.enum(['carnivore', 'herbivore', 'omnivore', 'piscivore', 'unknown']).nullable(),
  /** Estimated adult length, for the info panel. null when not reliably known. */
  lengthMeters: z.number().nullable(),
  shortDescription: z.string(),
  /** One concise, source-backed fact. */
  keyFact: z.string().nullable(),
  factSource: z.string().nullable(),
  /** Local path under /public for the runtime model. Alias: assetPath in older notes. */
  modelPath: z.string(),
  /** Container format for the loader registry. Defaults to glb for existing entries. */
  assetFormat: modelAssetFormatSchema.default('glb'),
  /** Source up-axis; 'z' models (e.g. some STL/print models) get a -90° X correction. */
  upAxis: z.enum(['y', 'z']).default('y'),
  /** Optional .mtl path for OBJ models. */
  materialPath: z.string().nullable().default(null),
  /** Optional base folder for external textures (OBJ/glTF). */
  textureBasePath: z.string().nullable().default(null),
  /** Optional one-shot creature sound exposed from the facts panel. */
  audioPath: z.string().nullable().default(null),
  sourceUrl: z.string().url().nullable(),
  author: z.string().nullable(),
  license: z.string().nullable(),
  /** Link to the license text (e.g. the Creative Commons deed). Rendered clickable in credits. */
  licenseUrl: z.string().url().nullable().default(null),
  /** Exact attribution wording supplied by the creator or asset source. */
  attributionText: z.string().nullable().default(null),
  creditRequired: z.boolean(),
  /** Uniform scale multiplier applied AFTER auto-normalising the model to a target height. */
  scale: z.number().positive().default(1),
  position: vec3.default([0, 0, 0]),
  rotation: vec3.default([0, 0, 0]),
  /** Per-view manual transform overrides — see deviceOverridesSchema above. */
  deviceOverrides: deviceOverridesSchema,
  cameraPreset: cameraPresetSchema,
  /** Detected at runtime; null preferredAnimation lets the loader auto-pick an idle-like clip. */
  availableAnimations: z.array(z.string()).default([]),
  preferredAnimation: z.string().nullable(),
  animationMode: animationModeSchema.default('native'),
  /** Playback multiplier for native clips. 1 = authored speed, 0.5 = half speed. */
  animationSpeed: z.number().positive().default(1),
  /** Optional pause after each native clip loop, in seconds. */
  animationPauseSeconds: z.number().min(0).default(0),
  backgroundId: z.string(),
  /** Terrestrial by default; underwater/aerialCoastal drive the water-transition system. */
  sceneType: sceneTypeSchema.default('terrestrial'),
  /** Background used once fully submerged (only for underwater/aquatic scenes). */
  underwaterBackgroundId: z.string().nullable().default(null),
  /** When true, the chapter plays the rising-waterline transition into an underwater scene. */
  waterTransition: z.boolean().default(false),
  accentTheme: z.enum(['triassic', 'jurassic', 'cretaceous', 'extinction']),
  heroModel: z.boolean().default(false),
  enabled: z.boolean().default(true),
  /** If true, hidden when scientific mode is active. */
  hideInScientificMode: z.boolean().default(false),
  /** Geological stage(s), e.g. "Maastrichtian". Optional. */
  stage: z.string().nullable().default(null),
  /** Rock formation the fossils come from, e.g. "Hell Creek". Optional. */
  formation: z.string().nullable().default(null),
  /** Zero or more reputable sources backing the factual text. */
  factSources: z.array(z.string()).default([]),
  notes: z.string().nullable(),
});
export type Creature = z.infer<typeof creatureSchema>;
/** Input shape (defaulted fields optional) — use this when authoring manifest literals. */
export type CreatureInput = z.input<typeof creatureSchema>;
