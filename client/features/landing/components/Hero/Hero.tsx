'use client';

import { useLoading } from '@/shared/context/loading/LoadingContext';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
// Import components from the barrel file
import { HeroContent, HeroVideo } from '.';

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

  // Use a ref to store the abort controller for navigation
  const abortControllerRef = useRef<AbortController | null>(null);

  // Create a new AbortController when the component mounts
  useEffect(() => {
    abortControllerRef.current = new AbortController();

    return () => {
      // Abort any in-flight requests when unmounting
      if (abortControllerRef.current) {
        console.debug('Aborting in-flight requests during navigation');
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleStartExploring = useCallback(() => {
    // Abort any in-flight requests before navigation
    if (abortControllerRef.current) {
      console.debug('Aborting in-flight requests before navigation');
      abortControllerRef.current.abort();

      // Create a new abort controller for any new requests
      abortControllerRef.current = new AbortController();
    }

    // Start both the global loading indicator and local loading state
    const loadingId =
      loading?.startLoading({
        message: 'Loading dashboard...',
        type: 'overlay',
      }) || '';
    setIsLoading(true);

    // Short delay to allow abort to complete
    setTimeout(() => {
      // Navigate to dashboard
      router.push('/dashboard');
    }, 50);

    // This will be cleaned up by the useEffect when pathname changes
    return () => {
      if (loadingId) loading?.stopLoading(loadingId);
    };
  }, [loading, router]);

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
        <HeroVideo onVideoError={() => setVideoError(true)} />
      </div>

      {/* Hero content positioned absolutely over the video */}
      <div className="absolute inset-0 z-30 flex items-center justify-center">
        <HeroContent isLoading={isLoading} onStartExploring={handleStartExploring} />
      </div>
    </header>
  );
};
