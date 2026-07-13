import { Link } from 'react-router-dom';
import { PageShell } from './PageShell';

export default function NotFoundPage() {
  return (
    <PageShell title="Lost in deep time" intro="This page drifted off the geological record.">
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-full bg-bone px-5 py-2.5 text-sm font-medium text-ink-900 transition hover:bg-white"
      >
        Return to the timeline
      </Link>
    </PageShell>
  );
}
