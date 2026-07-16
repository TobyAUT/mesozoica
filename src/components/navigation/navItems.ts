import type { StringKey } from '@/i18n/strings';

/** Shared nav definitions used by desktop nav, mobile drawer, and command palette. */
export interface EraLink {
  type: 'chapter';
  labelKey: StringKey;
  chapterId: string;
}
export interface RouteLink {
  type: 'route';
  labelKey: StringKey;
  to: string;
}

export const ERA_LINKS: EraLink[] = [
  { type: 'chapter', labelKey: 'eraTriassic', chapterId: 'era-triassic' },
  { type: 'chapter', labelKey: 'eraJurassic', chapterId: 'era-jurassic' },
  { type: 'chapter', labelKey: 'eraCretaceous', chapterId: 'era-cretaceous' },
];

export const ROUTE_LINKS: RouteLink[] = [
  { type: 'route', labelKey: 'navCreatures', to: '/creatures' },
  { type: 'route', labelKey: 'navAbout', to: '/about' },
  { type: 'route', labelKey: 'navMethodology', to: '/methodology' },
  { type: 'route', labelKey: 'navCredits', to: '/credits' },
];
