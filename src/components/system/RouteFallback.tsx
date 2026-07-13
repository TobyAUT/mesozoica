export function RouteFallback() {
  return (
    <div className="grid min-h-screen place-items-center bg-ink-900 text-muted">
      <div className="flex items-center gap-3 text-sm">
        <span className="h-2 w-2 animate-ping rounded-full bg-cretaceous" />
        Loading…
      </div>
    </div>
  );
}
