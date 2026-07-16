import { create } from 'zustand';

export type Quality = 'auto' | 'high' | 'balanced' | 'low';
export type Lang = 'en' | 'de';

interface ExperienceState {
  activeChapterId: string;
  activeCreatureId: string | null;
  setActive: (chapterId: string, creatureId: string | null) => void;

  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;

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

  exploreMode: boolean;
  setExploreMode: (v: boolean) => void;
  exploreAnimationAvailable: boolean;
  setExploreAnimationAvailable: (v: boolean) => void;
  exploreAnimationPlaying: boolean;
  exploreAnimationPlayRequest: number;
  playExploreAnimation: () => void;
  finishExploreAnimation: () => void;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
  commandOpen: boolean;
  setCommandOpen: (v: boolean) => void;

  ready: boolean;
  setReady: (v: boolean) => void;
}

const KEY = 'mesozoica.prefs.v1';

type Persisted = Pick<
  ExperienceState,
  'scientificMode' | 'quality' | 'audioEnabled' | 'ambienceVolume' | 'effectsVolume' | 'lang'
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
      lang: s.lang,
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

function syncHtmlLang(lang: Lang) {
  if (typeof document !== 'undefined') document.documentElement.lang = lang;
}

export const useExperience = create<ExperienceState>((set, get) => ({
  activeChapterId: 'prologue',
  activeCreatureId: null,
  setActive: (chapterId, creatureId) => {
    if (get().activeChapterId === chapterId && get().activeCreatureId === creatureId) return;
    set({ activeChapterId: chapterId, activeCreatureId: creatureId });
  },

  // English is the default; the nav toggle switches the whole site to German.
  lang: prefs.lang ?? 'en',
  setLang: (lang) => {
    set({ lang });
    syncHtmlLang(lang);
    savePrefs(get());
  },
  toggleLang: () => get().setLang(get().lang === 'en' ? 'de' : 'en'),

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

  exploreMode: false,
  setExploreMode: (exploreMode) => set({ exploreMode, exploreAnimationPlaying: false }),
  exploreAnimationAvailable: false,
  setExploreAnimationAvailable: (exploreAnimationAvailable) =>
    set(
      exploreAnimationAvailable
        ? { exploreAnimationAvailable }
        : { exploreAnimationAvailable, exploreAnimationPlaying: false },
    ),
  exploreAnimationPlaying: false,
  exploreAnimationPlayRequest: 0,
  playExploreAnimation: () => {
    if (!get().exploreMode || !get().exploreAnimationAvailable || get().exploreAnimationPlaying)
      return;
    set((state) => ({
      exploreAnimationPlaying: true,
      exploreAnimationPlayRequest: state.exploreAnimationPlayRequest + 1,
    }));
  },
  finishExploreAnimation: () => set({ exploreAnimationPlaying: false }),
  menuOpen: false,
  setMenuOpen: (menuOpen) => set({ menuOpen }),
  commandOpen: false,
  setCommandOpen: (commandOpen) => set({ commandOpen }),

  ready: false,
  setReady: (ready) => set({ ready }),
}));

// Keep <html lang> honest for screen readers / translation tooling from the very first paint.
// Guarded: this module is also imported by node-environment unit tests, where there is no DOM.
syncHtmlLang(useExperience.getState().lang);
