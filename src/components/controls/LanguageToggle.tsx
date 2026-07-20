import { Languages } from 'lucide-react';
import { useExperience } from '@/store/experienceStore';
import { useTr } from '@/i18n';

/**
 * Site-wide EN/DE switch. Shows the language that is CURRENTLY active (default "EN"); clicking it
 * flips the whole site — timeline, creature panels, chapter copy and every sub-page — and the
 * button then reads "DE". The choice persists with the other preferences.
 */
export function LanguageToggle() {
  const lang = useExperience((s) => s.lang);
  const toggleLang = useExperience((s) => s.toggleLang);
  const { t } = useTr();

  return (
    <button
      type="button"
      onClick={toggleLang}
      aria-label={t('langSwitchTo')}
      title={t('langSwitchTo')}
      className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold tracking-wide text-bone/80 transition hover:border-white/40 hover:text-bone"
    >
      <Languages size={14} />
      {lang.toUpperCase()}
    </button>
  );
}
