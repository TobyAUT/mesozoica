import { useEffect, useState } from 'react';
import { NOTICE_EVENT } from '@/utils/notify';

function webglMissing(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return true;
  }
}

/**
 * Site-wide degradation notice. If a required capability is missing (WebGL), a script crashes, or
 * a promise rejects unhandled, the visitor gets one small dismissible banner instead of a silently
 * broken page. Shows only the FIRST notice per visit — it is a heads-up, not a console.
 */
export function ErrorNotice() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Only keep the first message; later errors usually cascade from the same root cause.
    const show = (msg: string) => setMessage((current) => current ?? msg);

    if (webglMissing()) {
      show(
        'Your browser or device does not support WebGL, so the 3D models cannot be shown. All text, facts and images still work.',
      );
    }
    const onError = () =>
      show('Something went wrong while running the page. Parts of the experience may be missing — reloading usually helps.');
    const onNotice = (event: Event) => show((event as CustomEvent<string>).detail);
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onError);
    window.addEventListener(NOTICE_EVENT, onNotice);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onError);
      window.removeEventListener(NOTICE_EVENT, onNotice);
    };
  }, []);

  if (!message) return null;
  return (
    <div
      role="alert"
      className="fixed inset-x-3 bottom-16 z-[60] mx-auto flex max-w-md items-start gap-3 rounded-xl border border-white/15 bg-ink-900/95 p-4 text-sm text-bone/90 shadow-2xl backdrop-blur-md lg:bottom-6"
    >
      <span aria-hidden="true">⚠️</span>
      <p className="flex-1 leading-snug">{message}</p>
      <button
        onClick={() => setMessage(null)}
        aria-label="Dismiss notice"
        className="rounded-full border border-white/15 px-2.5 py-0.5 text-xs text-bone/70 transition hover:border-white/40 hover:text-bone"
      >
        OK
      </button>
    </div>
  );
}
