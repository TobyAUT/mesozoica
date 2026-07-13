import { useExperience } from '@/store/experienceStore';
import { CREATURE_BY_ID } from '@/data/creatures';
import { CHAPTERS } from '@/data/eras';
import type { Creature } from '@/data/types';
import type { Chapter } from '@/data/eras';

const CHAPTER_BY_ID = Object.fromEntries(CHAPTERS.map((c) => [c.id, c])) as Record<string, Chapter>;

export function useActiveChapter(): Chapter {
  const id = useExperience((s) => s.activeChapterId);
  return CHAPTER_BY_ID[id] ?? CHAPTERS[0];
}

export function useActiveCreature(): Creature | null {
  const id = useExperience((s) => s.activeCreatureId);
  return id ? (CREATURE_BY_ID[id] ?? null) : null;
}
