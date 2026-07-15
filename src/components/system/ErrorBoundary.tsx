import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Rendered instead of the children when they throw. */
  fallback?: ReactNode;
  /** Dev label for the console warning. */
  label?: string;
  /** Called once when the boundary trips — e.g. to surface a user-facing notice. */
  onError?: () => void;
}
interface State {
  hasError: boolean;
}

/**
 * Generic error boundary. Used to isolate model loading and the WebGL canvas so a single bad
 * asset never takes down the whole page (brief §22). Logs in dev, shows a graceful fallback.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn(`[Mesozoica] ${this.props.label ?? 'component'} failed:`, error);
    }
    this.props.onError?.();
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}
