export const NOTICE_EVENT = 'mesozoica:notice';

/** Fire a user-facing notice from anywhere (e.g. a failed video or missing capability). */
export function notifyUser(message: string): void {
  window.dispatchEvent(new CustomEvent<string>(NOTICE_EVENT, { detail: message }));
}
