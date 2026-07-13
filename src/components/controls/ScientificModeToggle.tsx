import { FlaskConical } from 'lucide-react';
import { useExperience } from '@/store/experienceStore';
import { cn } from '@/utils/cn';

/** Toggles scientific mode, which hides stylised/fictional models and flags uncertain ones. */
export function ScientificModeToggle({ compact = false }: { compact?: boolean }) {
  const on = useExperience((s) => s.scientificMode);
  const toggle = useExperience((s) => s.toggleScientificMode);
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label="Scientific mode"
      title="Scientific mode hides stylised and fictional models"
      onClick={toggle}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition',
        on
          ? 'border-emerald-400/50 bg-emerald-400/10 text-emerald-200'
          : 'border-white/15 text-muted hover:border-white/30 hover:text-bone',
      )}
    >
      <FlaskConical size={14} />
      {!compact && <span>Scientific{on ? ' · on' : ''}</span>}
    </button>
  );
}
