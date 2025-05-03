'use client';

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

  // Use useEffect to set isClient and mounted to true after hydration
  useEffect(() => {
    setIsClient(true);
    setMounted(true);
  }, []);

  const handleStartExploring = useCallback(() => {
    setIsLoading(true);
    setShouldNavigate(true);
  }, []);

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
