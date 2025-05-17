'use client';

import { BasicCardSkeleton, CardGridSkeleton } from '@/shared/components/loading';
import { Skeleton } from '@heroui/react';
import { useReducedMotion } from 'framer-motion';
import { memo, useEffect, useState } from 'react';

/**
 * Animation timing constants
 */
const ANIMATION_TIMING = {
  GRADIENT_DELAY: 300,
  CARDS_DELAY: 600,
  TRANSITION_DURATION: 1000,
};

/**
 * Props for the ProjectSkeleton component
 */
interface ProjectSkeletonProps {
  /**
   * The type of skeleton to display
   * - 'card': A compact skeleton for project cards
   * - 'detail': A detailed skeleton for project detail pages
   */
  type: 'card' | 'detail';
}

/**
 * ProjectSkeleton component
 *
 * Displays a loading skeleton for project components.
 * Supports two layouts: card and detail.
 *
 * @example
 * ```tsx
 * // Card layout
 * <ProjectSkeleton type="card" />
 *
 * // Detail layout
 * <ProjectSkeleton type="detail" />
 * ```
 */
const ProjectSkeleton = memo(function ProjectSkeleton({ type }: ProjectSkeletonProps) {
  if (type === 'card') {
    return (
      <BasicCardSkeleton
        withImage
        withFooter
        descriptionLines={2}
        tagCount={3}
        className="shadow-md h-full"
      />
    );
  }

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4 bg-gray-400/70 dark:bg-gray-600/70" />
        <Skeleton className="h-4 w-1/2 bg-gray-400/70 dark:bg-gray-600/70" />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full bg-gray-400/70 dark:bg-gray-600/70" />
        <Skeleton className="h-4 w-full bg-gray-400/70 dark:bg-gray-600/70" />
        <Skeleton className="h-4 w-5/6 bg-gray-400/70 dark:bg-gray-600/70" />
      </div>

      {/* Tech Stack */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-32 bg-gray-400/70 dark:bg-gray-600/70" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton
              key={`skeleton-tag-tech-${String.fromCharCode(97 + i)}`}
              className="h-12 w-full bg-gray-400/70 dark:bg-gray-600/70"
            />
          ))}
        </div>
      </div>

      {/* Gallery */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-32 bg-gray-400/70 dark:bg-gray-600/70" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton
              key={`skeleton-image-gallery-${String.fromCharCode(97 + i)}`}
              className="h-48 w-full bg-gray-400/70 dark:bg-gray-600/70"
            />
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-32 bg-gray-400/70 dark:bg-gray-600/70" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`skeleton-row-timeline-${String.fromCharCode(97 + i)}`}
              className="flex gap-4"
            >
              <Skeleton className="h-4 w-24 bg-gray-400/70 dark:bg-gray-600/70" />
              <Skeleton className="h-4 w-full bg-gray-400/70 dark:bg-gray-600/70" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default ProjectSkeleton;

/**
 * Helper function for shared background gradient settings
 */
function useSkeletonAnimation() {
  const prefersReducedMotion = useReducedMotion();
  const [showGradient, setShowGradient] = useState(false);
  const [showCards, setShowCards] = useState(false);

  // Use the same colors as AnimatedBackground
  const lightGradientStart = 'rgba(240, 240, 255, 0.7)';
  const lightGradientEnd = 'rgba(255, 255, 255, 0.5)';
  const darkGradientStart = 'rgba(50, 50, 80, 0.5)';
  const darkGradientEnd = 'rgba(30, 30, 60, 0.3)';

  // After a short delay, show the gradient
  useEffect(() => {
    if (prefersReducedMotion) {
      // If user prefers reduced motion, show everything immediately
      setShowGradient(true);
      setShowCards(true);
      return;
    }

    // First show black background
    const gradientTimer = setTimeout(() => {
      setShowGradient(true);
    }, ANIMATION_TIMING.GRADIENT_DELAY);

    // Then a bit later show cards
    const cardsTimer = setTimeout(() => {
      setShowCards(true);
    }, ANIMATION_TIMING.CARDS_DELAY);

    return () => {
      clearTimeout(gradientTimer);
      clearTimeout(cardsTimer);
    };
  }, [prefersReducedMotion]);

  return {
    showGradient,
    showCards,
    lightGradientStart,
    lightGradientEnd,
    darkGradientStart,
    darkGradientEnd,
    transitionDuration: ANIMATION_TIMING.TRANSITION_DURATION,
    prefersReducedMotion,
  };
}

export function ProjectGridSkeleton() {
  const { showCards, prefersReducedMotion } = useSkeletonAnimation();

  const transitionStyle = prefersReducedMotion
    ? {}
    : {
        transition: `all ${ANIMATION_TIMING.TRANSITION_DURATION}ms ease`,
        opacity: showCards ? 1 : 0,
        transform: showCards ? 'translateY(0)' : 'translateY(10px)',
      };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8" style={transitionStyle}>
      <div className="mb-8">
        <Skeleton className="h-8 w-48 bg-gray-400/70 dark:bg-gray-600/70 mb-2" />
        <Skeleton className="h-4 w-full max-w-md bg-gray-400/70 dark:bg-gray-600/70" />
      </div>

      <CardGridSkeleton
        cardCount={6}
        CardComponent={BasicCardSkeleton}
        cardProps={{
          withImage: true,
          withFooter: true,
          tagCount: 3,
          descriptionLines: 2,
          animate: showCards,
        }}
        columns={{ sm: 2, lg: 3 }}
      />
    </div>
  );
}

export function ProjectDetailSkeleton() {
  const { showCards, prefersReducedMotion } = useSkeletonAnimation();

  const transitionStyle = prefersReducedMotion
    ? {}
    : {
        transition: `all ${ANIMATION_TIMING.TRANSITION_DURATION}ms ease`,
        opacity: showCards ? 1 : 0,
        transform: showCards ? 'translateY(0)' : 'translateY(10px)',
      };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8" style={transitionStyle}>
      <ProjectSkeleton type="detail" />
    </div>
  );
}
