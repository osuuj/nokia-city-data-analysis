'use client';

import { ButtonStart } from '@/components/ui/Button';
import { DataLoader } from '@/components/ui/DataLoader';
import { siteConfig } from '@/config';
import { Spinner } from '@heroui/react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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

  const handleStartExploring = () => {
    setIsLoading(true);
    setShouldNavigate(true);
  };

  const handleDataReady = () => {
    if (shouldNavigate) {
      router.push('/dashboard');
    }
  };

  const handleVideoError = () => {
    setVideoError(true);
  };

  // Determine background color based on theme and video availability
  const bgColor = videoError ? (resolvedTheme === 'dark' ? 'bg-black' : 'bg-white') : '';

  return (
    <div className={`relative h-[calc(100vh-24rem)] w-full overflow-hidden ${bgColor}`}>
      {/* 🔹 Video Background */}
      {!videoError && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute left-0 top-0 h-full w-full object-cover"
          onError={handleVideoError}
        >
          <source src="videos/background.mp4" type="video/mp4" />
        </video>
      )}

      {/* 🔹 Background Overlay - Only show when video is present */}
      {!videoError && <div className="absolute inset-0 bg-black bg-opacity-40" />}

      {/* 🔹 Hero Content */}
      <div
        className={`relative z-10 flex h-full flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8 ${videoError ? 'text-foreground' : 'text-white'}`}
      >
        <div className="inline-block max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            {siteConfig.hero.title.before}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-default-800 via-danger-400 to-secondary-500">
              {siteConfig.hero.title.highlight}
            </span>
            {siteConfig.hero.title.after}
          </h1>
          <p className="mt-4 text-sm sm:text-base md:text-lg">{siteConfig.hero.description}</p>

          {/* 🔹 Call-to-Action Button */}
          <div className="mt-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center">
                <Spinner size="lg" color="primary" />
                <p className="mt-2 text-sm">Loading data...</p>
              </div>
            ) : (
              <ButtonStart
                label="Start Exploring"
                href="/dashboard"
                onPress={handleStartExploring}
              />
            )}
          </div>
        </div>
      </div>

      {/* Hidden DataLoader to prefetch data */}
      {isClient && (
        <div className="hidden">
          <DataLoader onDataReady={handleDataReady}>
            <div>Data is ready</div>
          </DataLoader>
        </div>
      )}
    </div>
  );
};
