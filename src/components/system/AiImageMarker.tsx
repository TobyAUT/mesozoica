import { Sparkles } from 'lucide-react';
import { useActiveChapter } from '@/hooks/useActiveCreature';
import { backgroundOrFallback } from '@/data/backgrounds';

// Chapters whose fullscreen ChapterVideo (see HomePage) is AI-generated.
const AI_VIDEO_CHAPTER_IDS = new Set(['extinction', 'finale']);

/**
 * EU AI Act (Art. 50) transparency marker. Every backdrop image and the chapter videos in this
 * project are AI-generated, so a small persistent label discloses it while one is on screen. A
 * fuller disclosure lives in the Credits footer. Unobtrusive, pointer-events-none, never covers
 * content.
 */
export function AiImageMarker() {
  const chapter = useActiveChapter();
  const def = backgroundOrFallback(chapter.backgroundId);
  const isAiVideo = AI_VIDEO_CHAPTER_IDS.has(chapter.id);
  const isAiImage = !!def.image && (def.aiGenerated ?? true);
  if (!isAiVideo && !isAiImage) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-2 right-2 z-30 flex items-center gap-1 rounded-full border border-white/10 bg-ink-900/60 px-2 py-0.5 text-[0.55rem] tracking-wide text-bone/60 backdrop-blur-sm"
      aria-hidden="true"
    >
      <Sparkles size={9} />
      {isAiVideo ? 'KI-generiertes Video · AI-generated' : 'KI-generiertes Bild · AI-generated'}
    </div>
  );
}
