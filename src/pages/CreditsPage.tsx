import { AlertTriangle, ExternalLink, CheckCircle2, Volume2 } from 'lucide-react';
import { PageShell } from './PageShell';
import { MODEL_CREDITS, AUDIO_CREDITS, ASSET_CREDITS } from '@/data/credits';
import { useTr } from '@/i18n';

/**
 * Credits page. Unresolved licences are surfaced LOUDLY (amber warning) so attribution can never
 * be silently omitted. Authors/licences are intentionally blank until a human verifies each
 * Sketchfab page — we never invent them.
 */
export default function CreditsPage() {
  const { t } = useTr();
  const unresolvedCount = MODEL_CREDITS.filter((m) => !m.resolved).length;

  return (
    <PageShell title={t('creditsTitle')} intro={t('creditsIntro')}>
      {unresolvedCount > 0 && (
        <div className="mb-8 flex items-start gap-3 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-amber-100">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <div className="text-sm">
            <strong>
              {unresolvedCount} {t('creditsWarning')}
            </strong>{' '}
            {t('creditsWarningBody')}
          </div>
        </div>
      )}

      <h2 className="type-title mb-4 text-2xl text-bone">{t('creditsModels')}</h2>
      <div className="mb-12 overflow-x-auto">
        <table className="w-full min-w-[46rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-xs text-muted">
              <th className="py-2 pr-4 font-medium">{t('creditsColDisplayName')}</th>
              <th className="py-2 pr-4 font-medium">{t('creditsColSourceTitle')}</th>
              <th className="py-2 pr-4 font-medium">{t('creditsColAuthor')}</th>
              <th className="py-2 pr-4 font-medium">{t('creditsColLicense')}</th>
              <th className="py-2 pr-4 font-medium">{t('creditsColSource')}</th>
              <th className="py-2 font-medium">{t('creditsColStatus')}</th>
            </tr>
          </thead>
          <tbody>
            {MODEL_CREDITS.map((m) => (
              <tr key={m.creatureId} className="border-b border-white/5 align-top">
                <td className="py-3 pr-4 text-bone">{m.displayName}</td>
                <td className="py-3 pr-4 text-bone/70">
                  <span>{m.sourceTitle}</span>
                  {m.attributionText && (
                    <span className="mt-1 block max-w-md text-xs leading-relaxed text-bone/50">
                      {m.attributionText}
                    </span>
                  )}
                </td>
                <td className="py-3 pr-4">
                  {m.author ?? <span className="text-amber-300/80">TODO_VERIFY</span>}
                </td>
                <td className="py-3 pr-4">
                  {m.license ? (
                    m.licenseUrl ? (
                      <a
                        href={m.licenseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-cretaceous hover:underline"
                      >
                        {m.license} <ExternalLink size={12} />
                      </a>
                    ) : (
                      m.license
                    )
                  ) : (
                    <span className="text-amber-300/80">TODO_VERIFY</span>
                  )}
                </td>
                <td className="py-3 pr-4">
                  {m.sourceUrl ? (
                    <a
                      href={m.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-cretaceous hover:underline"
                    >
                      Sketchfab <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td className="py-3">
                  {m.resolved ? (
                    <span className="inline-flex items-center gap-1 text-emerald-300">
                      <CheckCircle2 size={13} /> {t('creditsVerified')}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-amber-300">
                      <AlertTriangle size={13} /> {t('creditsUnresolved')}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="type-title mb-4 text-2xl text-bone">{t('creditsAudio')}</h2>
      <div className="mb-12 grid gap-3 sm:grid-cols-2">
        {AUDIO_CREDITS.map((audio) => (
          <div
            key={audio.creatureId}
            className="flex items-start gap-3 rounded-xl border border-white/10 bg-ink-800/50 p-4"
          >
            <Volume2 size={17} className="mt-0.5 shrink-0 text-cretaceous" />
            <div>
              <div className="text-sm font-medium text-bone">{audio.displayName}</div>
              <p className="mt-1 text-xs text-bone/60">
                {t('creditsAudioCreator')}: {audio.author}
              </p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="type-title mb-4 text-2xl text-bone">{t('creditsOther')}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {ASSET_CREDITS.map((a) => (
          <div key={a.name} className="rounded-xl border border-white/10 bg-ink-800/50 p-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="type-eyebrow text-[0.58rem] text-cretaceous">{a.category}</span>
              {a.resolved ? (
                <CheckCircle2 size={13} className="text-emerald-300" />
              ) : (
                <AlertTriangle size={13} className="text-amber-300" />
              )}
            </div>
            <div className="mb-1 text-sm font-medium text-bone">{a.name}</div>
            <p className="text-xs leading-relaxed text-bone/60">{a.detail}</p>
          </div>
        ))}
      </div>

      <p className="mt-10 text-xs text-muted">{t('creditsNote')}</p>
    </PageShell>
  );
}
