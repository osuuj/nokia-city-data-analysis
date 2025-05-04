'use client';

import { useLoading } from '@/shared/context/LoadingContext';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { HeroSkeleton } from './HeroSkeleton';

// Lazy load the HeroContent and HeroVideo components
const HeroContent = lazy(() =>
  import('./HeroContent').then((module) => ({ default: module.HeroContent })),
);
const HeroVideo = lazy(() =>
  import('./HeroVideo').then((module) => ({ default: module.HeroVideo })),
);

/**
 * Hero Component
 *
 * Displays a fullscreen landing section with background video, heading text,
 * description, and a call-to-action button.
 *
 * @returns {JSX.Element} The rendered Hero section.
 */
export const Hero = (): JSX.Element => {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const loading = useLoading();

  // Use useEffect to set isClient and mounted to true after hydration
  useEffect(() => {
    setIsClient(true);
    setMounted(true);
  }, []);

  // Monitor global loading state and sync with local state
  useEffect(() => {
    if (loading?.isLoading && !isLoading) {
      setIsLoading(true);
    } else if (!loading?.isLoading && isLoading && !shouldNavigate) {
      setIsLoading(false);
    }
  }, [loading?.isLoading, isLoading, shouldNavigate]);

  const handleStartExploring = useCallback(() => {
    // Start both the global loading indicator and local loading state
    const loadingId =
      loading?.startLoading({
        message: 'Loading dashboard...',
        type: 'overlay',
      }) || '';
    setIsLoading(true);
    setShouldNavigate(true);

    // Navigate to dashboard
    router.push('/dashboard');

    // This will be cleaned up by the useEffect when pathname changes
    return () => {
      if (loadingId) loading?.stopLoading(loadingId);
    };
  }, [loading, router]);

  const handleDataReady = useCallback(() => {
    if (shouldNavigate) {
      router.push('/dashboard');
    }
  }, [shouldNavigate, router]);

  const handleVideoError = useCallback(() => {
    setVideoError(true);
  }, []);

  // Determine background color based on theme and video availability
  const bgColor = videoError ? (resolvedTheme === 'dark' ? 'bg-black' : 'bg-white') : '';

  return (
    <header
      className={`relative h-[calc(100vh-16rem)] md:h-[calc(100vh-20rem)] sm:h-[calc(100vh-6rem)] xs:h-[calc(100vh-3rem)] w-full overflow-hidden ${bgColor}`}
      aria-label="Hero section"
    >
      {/* 🔹 Video Background */}
      <Suspense fallback={null}>
        <HeroVideo onVideoError={handleVideoError} />
      </Suspense>

      {/* 🔹 Hero Content */}
      <Suspense fallback={<HeroSkeleton />}>
        <HeroContent
          isLoading={isLoading}
          videoError={videoError}
          onStartExploring={handleStartExploring}
        />
      </Suspense>
    </header>
  );
};

/**
 * HeroWithSuspense Component
 *
 * Wraps the Hero component with Suspense and provides a skeleton loading state.
 *
 * @returns {JSX.Element} The rendered HeroWithSuspense component.
 */
export const HeroWithSuspense = (): JSX.Element => {
  return (
    <Suspense fallback={<HeroSkeleton />}>
      <Hero />
    </Suspense>
  );
};
