import { create } from 'zustand';

export type Quality = 'auto' | 'high' | 'balanced' | 'low';

interface ExperienceState {
  // ── discrete scroll-driven state (set only when the value changes) ──
  activeChapterId: string;
  activeCreatureId: string | null;
  setActive: (chapterId: string, creatureId: string | null) => void;

  // ── user preferences (persisted) ──
  scientificMode: boolean;
  toggleScientificMode: () => void;

  quality: Quality;
  setQuality: (q: Quality) => void;

  audioEnabled: boolean;
  setAudioEnabled: (v: boolean) => void;
  ambienceVolume: number;
  effectsVolume: number;
  setVolume: (kind: 'ambience' | 'effects', v: number) => void;

  reducedMotion: boolean;
  setReducedMotion: (v: boolean) => void;

  // ── which T. rex model is the hero (config option, brief §Model 9) ──
  primaryTrexId: 'tyrannosaurus-rex' | 'tyrannosaurus-rex-alternate';

  // ── transient UI ──
  exploreMode: boolean;
  setExploreMode: (v: boolean) => void;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
  commandOpen: boolean;
  setCommandOpen: (v: boolean) => void;

  // ── preloader ──
  ready: boolean;
  setReady: (v: boolean) => void;
}

const KEY = 'mesozoica.prefs.v1';

type Persisted = Pick<
  ExperienceState,
  'scientificMode' | 'quality' | 'audioEnabled' | 'ambienceVolume' | 'effectsVolume'
>;

function loadPrefs(): Partial<Persisted> {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Partial<Persisted>) : {};
  } catch {
    return {};
  }
}

function savePrefs(s: ExperienceState) {
  try {
    const data: Persisted = {
      scientificMode: s.scientificMode,
      quality: s.quality,
      audioEnabled: s.audioEnabled,
      ambienceVolume: s.ambienceVolume,
      effectsVolume: s.effectsVolume,
    };
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* ignore quota / private-mode errors */
  }
}

const prefs = loadPrefs();

export const useExperience = create<ExperienceState>((set, get) => ({
  activeChapterId: 'prologue',
  activeCreatureId: null,
  setActive: (chapterId, creatureId) => {
    if (get().activeChapterId === chapterId && get().activeCreatureId === creatureId) return;
    set({ activeChapterId: chapterId, activeCreatureId: creatureId });
  },

  scientificMode: prefs.scientificMode ?? false,
  toggleScientificMode: () => {
    set((s) => ({ scientificMode: !s.scientificMode }));
    savePrefs(get());
  },

  quality: prefs.quality ?? 'auto',
  setQuality: (quality) => {
    set({ quality });
    savePrefs(get());
  },

  audioEnabled: prefs.audioEnabled ?? false,
  setAudioEnabled: (audioEnabled) => {
    set({ audioEnabled });
    savePrefs(get());
  },
  ambienceVolume: prefs.ambienceVolume ?? 0.5,
  effectsVolume: prefs.effectsVolume ?? 0.6,
  setVolume: (kind, v) => {
    set(kind === 'ambience' ? { ambienceVolume: v } : { effectsVolume: v });
    savePrefs(get());
  },

  reducedMotion: false,
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),

  primaryTrexId: 'tyrannosaurus-rex',

  exploreMode: false,
  setExploreMode: (exploreMode) => set({ exploreMode }),
  menuOpen: false,
  setMenuOpen: (menuOpen) => set({ menuOpen }),
  commandOpen: false,
  setCommandOpen: (commandOpen) => set({ commandOpen }),

  ready: false,
  setReady: (ready) => set({ ready }),
}));
