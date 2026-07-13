import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { RouteFallback } from '@/components/system/RouteFallback';

// Code-split secondary pages; the immersive home experience is the primary bundle.
const HomePage = lazy(() => import('@/pages/HomePage'));
const CreaturesPage = lazy(() => import('@/pages/CreaturesPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const CreditsPage = lazy(() => import('@/pages/CreditsPage'));
const MethodologyPage = lazy(() => import('@/pages/MethodologyPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/timeline" element={<HomePage />} />
        <Route path="/creatures" element={<CreaturesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/methodology" element={<MethodologyPage />} />
        <Route path="/credits" element={<CreditsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
