'use client';

import { ButtonStart } from '@/features/landing/components/ButtonStart';
import { Card, Spinner } from '@heroui/react';
import { siteConfig } from '@shared/config';
import { type FC, useCallback } from 'react';
import { useHeroAnimation } from '../../hooks/useHeroAnimation';

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

  // Use the animation hook
  const { fadeInUpClass, fadeInScaleClass } = useHeroAnimation();

  return (
    <footer
      className={`relative z-10 flex h-full flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8 lg:px-12 ${videoError ? 'text-foreground' : 'text-white'}`}
      aria-label="Hero content"
    >
      <Card
        className={`inline-block max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl text-center p-4 sm:p-6 md:p-8 bg-background/80 backdrop-blur-sm ${fadeInScaleClass}`}
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
            />
          )}
        </div>
      </Card>
    </footer>
  );
};
