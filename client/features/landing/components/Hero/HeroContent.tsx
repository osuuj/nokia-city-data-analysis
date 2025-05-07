'use client';

import { ButtonStart } from '@/features/landing/components/ButtonStart';
import { Card, Spinner } from '@heroui/react';
import { siteConfig } from '@shared/config';
import { type FC, useCallback } from 'react';

/**
 * Props for the HeroContent component.
 */
export interface HeroContentProps {
  /** Whether the component is in a loading state */
  isLoading: boolean;
  /** Whether the video has an error */
  videoError: boolean;
  /** Callback function to execute when the start button is clicked */
  onStartExploring: () => void;
}

/**
 * HeroContent Component
 *
 * Displays the content of the Hero section, including heading text,
 * description, and a call-to-action button.
 *
 * @example
 * <HeroContent
 *   isLoading={false}
 *   videoError={false}
 *   onStartExploring={() => console.log('Start exploring')}
 * />
 */
export const HeroContent: FC<HeroContentProps> = ({ isLoading, videoError, onStartExploring }) => {
  const handleStartExploring = useCallback(() => {
    onStartExploring();
  }, [onStartExploring]);

  // Skip animation for better performance on mobile
  const fadeInUpClass = 'animate-none';
  const fadeInScaleClass = 'animate-none';

  return (
    <div className="w-full h-full flex items-center justify-center p-4" aria-label="Hero content">
      <Card
        className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl text-center p-4 sm:p-6 md:p-8 bg-background/90 backdrop-blur-sm shadow-lg ${fadeInScaleClass}`}
        tabIndex={0}
        aria-label="Hero card"
      >
        <h1
          className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight ${fadeInUpClass}`}
        >
          {siteConfig.hero.title.before}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-default-800 via-danger-400 to-secondary-500">
            {siteConfig.hero.title.highlight}
          </span>
          {siteConfig.hero.title.after}
        </h1>
        <p
          className={`mt-4 text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto ${fadeInUpClass}`}
        >
          {siteConfig.hero.description}
        </p>

        {/* 🔹 Call-to-Action Button */}
        <div className={`mt-6 sm:mt-8 md:mt-10 ${fadeInUpClass}`}>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center" aria-live="polite">
              <Spinner size="lg" color="primary" aria-label="Loading" />
              <p className="mt-2 text-sm">Preparing dashboard data...</p>
              <p className="mt-1 text-xs text-default-500">This may take a moment</p>
            </div>
          ) : (
            <ButtonStart
              label="Start Exploring"
              href="/dashboard"
              onPress={handleStartExploring}
              aria-label="Start exploring the dashboard"
              className="text-lg font-medium px-6 py-3"
            />
          )}
        </div>
      </Card>
    </div>
  );
};
