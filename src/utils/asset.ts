/**
 * Resolve a public asset path against Vite's BASE_URL so it works both in dev (base "/") and on
 * GitHub Pages (base "/<repo>/"). Absolute-looking paths like "/models/x.glb" would otherwise
 * 404 under a sub-path deployment.
 */
export function withBase(path: string): string {
  if (!path) return path;
  if (/^https?:\/\//.test(path)) return path; // leave absolute URLs alone
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}
