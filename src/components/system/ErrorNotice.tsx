import { useEffect, useState } from 'react';
import { NOTICE_EVENT } from '@/utils/notify';
import { useTr } from '@/i18n';

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
  const { t } = useTr();
  // Notices raised by other systems (e.g. a failed video) arrive as ready-made strings; ours are
  // stored as keys so a language switch after the fact still re-renders them correctly.
  const [message, setMessage] = useState<string | null>(null);
  const [messageKey, setMessageKey] = useState<'noticeWebgl' | 'noticeGeneric' | null>(null);

  useEffect(() => {
    // Only keep the first message; later errors usually cascade from the same root cause.
    const showKey = (key: 'noticeWebgl' | 'noticeGeneric') =>
      setMessageKey((current) => current ?? key);
    const show = (msg: string) => setMessage((current) => current ?? msg);

    if (webglMissing()) showKey('noticeWebgl');
    const onError = () => showKey('noticeGeneric');
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

  const text = messageKey ? t(messageKey) : message;
  if (!text) return null;

  return (
    <div
      role="alert"
      className="fixed inset-x-3 bottom-16 z-[60] mx-auto flex max-w-md items-start gap-3 rounded-xl border border-white/15 bg-ink-900/95 p-4 text-sm text-bone/90 shadow-2xl backdrop-blur-md lg:bottom-6"
    >
      <span aria-hidden="true">⚠️</span>
      <p className="flex-1 leading-snug">{text}</p>
      <button
        onClick={() => {
          setMessage(null);
          setMessageKey(null);
        }}
        aria-label={t('noticeDismiss')}
        className="rounded-full border border-white/15 px-2.5 py-0.5 text-xs text-bone/70 transition hover:border-white/40 hover:text-bone"
      >
        {t('noticeOk')}
      </button>
    </div>
  );
}
