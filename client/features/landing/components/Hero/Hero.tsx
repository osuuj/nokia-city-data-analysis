'use client';

import { useLoading } from '@/shared/context/LoadingContext';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { Suspense, useCallback, useState } from 'react';
// Import components directly
import { HeroContent } from './HeroContent';
import { HeroSkeleton } from './HeroSkeleton';
import { HeroVideo } from './HeroVideo';

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
  const [videoError, setVideoError] = useState(false);
  const loading = useLoading();

  const handleStartExploring = useCallback(() => {
    // Start both the global loading indicator and local loading state
    const loadingId =
      loading?.startLoading({
        message: 'Loading dashboard...',
        type: 'overlay',
      }) || '';
    setIsLoading(true);

    // Navigate to dashboard
    router.push('/dashboard');

    // This will be cleaned up by the useEffect when pathname changes
    return () => {
      if (loadingId) loading?.stopLoading(loadingId);
    };
  }, [loading, router]);

  const handleVideoError = useCallback(() => {
    setVideoError(true);
  }, []);

  // Determine background color based on theme and video availability
  const bgColor = videoError ? (resolvedTheme === 'dark' ? 'bg-black' : 'bg-white') : '';

  return (
    <header
      className={`hero-section relative h-[calc(100vh-16rem)] md:h-[calc(100vh-20rem)] sm:h-[calc(100vh-6rem)] xs:h-[calc(100vh-3rem)] w-full overflow-hidden ${bgColor}`}
      aria-label="Hero section"
      style={{ minHeight: '400px' }}
    >
      {/* Simple structure: Video at the bottom, content at the top in z-index */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <HeroVideo onVideoError={handleVideoError} />
      </div>

      {/* Hero content positioned absolutely over the video */}
      <div className="absolute inset-0 z-30 flex items-center justify-center">
        <HeroContent
          isLoading={isLoading}
          videoError={videoError}
          onStartExploring={handleStartExploring}
        />
      </div>
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
