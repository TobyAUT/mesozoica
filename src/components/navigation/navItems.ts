/** Shared nav definitions used by desktop nav, mobile drawer, and command palette. */
export interface EraLink {
  type: 'chapter';
  label: string;
  chapterId: string;
}
export interface RouteLink {
  type: 'route';
  label: string;
  to: string;
}

export const ERA_LINKS: EraLink[] = [
  { type: 'chapter', label: 'Triassic', chapterId: 'era-triassic' },
  { type: 'chapter', label: 'Jurassic', chapterId: 'era-jurassic' },
  { type: 'chapter', label: 'Cretaceous', chapterId: 'era-cretaceous' },
];

export const ROUTE_LINKS: RouteLink[] = [
  { type: 'route', label: 'Creatures', to: '/creatures' },
  { type: 'route', label: 'About', to: '/about' },
  { type: 'route', label: 'Methodology', to: '/methodology' },
  { type: 'route', label: 'Credits', to: '/credits' },
];
