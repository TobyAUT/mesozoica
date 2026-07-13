import { AlertTriangle, ExternalLink, CheckCircle2 } from 'lucide-react';
import { PageShell } from './PageShell';
import { MODEL_CREDITS, ASSET_CREDITS } from '@/data/credits';

/**
 * Credits page. Unresolved licences are surfaced LOUDLY (amber warning) so attribution can never
 * be silently omitted. Authors/licences are intentionally blank until a human verifies each
 * Sketchfab page — we never invent them.
 */
export default function CreditsPage() {
  const unresolvedCount = MODEL_CREDITS.filter((m) => !m.resolved).length;

  return (
    <PageShell
      title="Credits & licenses"
      intro="Every model, background, font, and data source used in this project. Attribution is required and tracked here."
    >
      {unresolvedCount > 0 && (
        <div className="mb-8 flex items-start gap-3 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-amber-100">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <div className="text-sm">
            <strong>{unresolvedCount} model licence{unresolvedCount > 1 ? 's' : ''} still need verification.</strong>{' '}
            Author and licence must be confirmed on each Sketchfab page before publishing. These are
            shown below with blank fields — they are not omitted.
          </div>
        </div>
      )}

      <h2 className="type-title mb-4 text-2xl text-bone">3D models</h2>
      <div className="mb-12 overflow-x-auto">
        <table className="w-full min-w-[46rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-xs text-muted">
              <th className="py-2 pr-4 font-medium">Display name</th>
              <th className="py-2 pr-4 font-medium">Source title</th>
              <th className="py-2 pr-4 font-medium">Author</th>
              <th className="py-2 pr-4 font-medium">License</th>
              <th className="py-2 pr-4 font-medium">Source</th>
              <th className="py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {MODEL_CREDITS.map((m) => (
              <tr key={m.creatureId} className="border-b border-white/5 align-top">
                <td className="py-3 pr-4 text-bone">{m.displayName}</td>
                <td className="py-3 pr-4 text-bone/70">{m.sourceTitle}</td>
                <td className="py-3 pr-4">
                  {m.author ?? <span className="text-amber-300/80">TODO_VERIFY</span>}
                </td>
                <td className="py-3 pr-4">
                  {m.license ?? <span className="text-amber-300/80">TODO_VERIFY</span>}
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
                      <CheckCircle2 size={13} /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-amber-300">
                      <AlertTriangle size={13} /> Unresolved
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="type-title mb-4 text-2xl text-bone">Backgrounds, sound, fonts & sources</h2>
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

      <p className="mt-10 text-xs text-muted">
        The user downloaded each model under their own Sketchfab permissions. This project renders
        local GLB files and does not hotlink or bypass any download restrictions.
      </p>
    </PageShell>
  );
}
