'use client';

import { Card, CardBody, CardHeader, Skeleton } from '@heroui/react';
import { useEffect, useState } from 'react';

/**
 * Skeleton loading component for the Resources page.
 * Matches the same card-based approach used in the AboutTeam component.
 */
export function ResourcesSkeleton() {
  // Initial state is fully black
  const [showGradient, setShowGradient] = useState(false);
  const [showCards, setShowCards] = useState(false);

  // Use the same colors as AnimatedBackground
  const lightGradientStart = 'rgba(240, 240, 255, 0.7)';
  const lightGradientEnd = 'rgba(255, 255, 255, 0.5)';
  const darkGradientStart = 'rgba(50, 50, 80, 0.5)';
  const darkGradientEnd = 'rgba(30, 30, 60, 0.3)';

  // After a short delay, show the gradient
  useEffect(() => {
    // First show black background
    const gradientTimer = setTimeout(() => {
      setShowGradient(true);
    }, 300);

    // Then a bit later show cards
    const cardsTimer = setTimeout(() => {
      setShowCards(true);
    }, 600);

    return () => {
      clearTimeout(gradientTimer);
      clearTimeout(cardsTimer);
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen px-4 py-8 md:px-6">
      {/* Initial black background */}
      <div
        className={`fixed inset-0 z-0 bg-black transition-opacity duration-1000 ${showGradient ? 'opacity-0' : 'opacity-100'}`}
      />

      {/* Static background that matches AnimatedBackground - appears after delay */}
      <div
        className={`fixed inset-0 z-0 dark:hidden transition-opacity duration-1000 ${showGradient ? 'opacity-100' : 'opacity-0'}`}
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, ${lightGradientStart}, ${lightGradientEnd})`,
          backdropFilter: 'blur(8px)',
        }}
      />
      <div
        className={`fixed inset-0 z-0 hidden dark:block transition-opacity duration-1000 ${showGradient ? 'opacity-100' : 'opacity-0'}`}
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, ${darkGradientStart}, ${darkGradientEnd})`,
          backdropFilter: 'blur(8px)',
        }}
      />

      {/* Semi-transparent overlay after gradient appears */}
      <div
        className={`fixed inset-0 bg-black/35 dark:bg-black/50 z-0 transition-opacity duration-1000 ${showGradient ? 'opacity-100' : 'opacity-0'}`}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header skeleton */}
        <div className="text-center mb-10">
          <Skeleton className="h-10 w-64 mx-auto mb-4 bg-gray-400/70 dark:bg-gray-600/70" />
          <Skeleton className="h-5 w-full max-w-2xl mx-auto mb-2 bg-gray-400/70 dark:bg-gray-600/70" />
          <Skeleton className="h-5 w-3/4 max-w-xl mx-auto bg-gray-400/70 dark:bg-gray-600/70" />
        </div>

        {/* Categories skeleton - cards appear before their content */}
        <div className="mb-12 space-y-6">
          {/* First category - simulate opened state */}
          <Card
            className={`shadow-md h-full backdrop-blur-md bg-opacity-85 border border-content2
              transition-all duration-700
              ${showCards ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
          >
            <CardHeader className="flex items-center gap-2 p-4 border-b border-default-200/50 dark:border-default-700/30">
              <Skeleton className="h-6 w-6 rounded-full bg-gray-400/70 dark:bg-gray-600/70" />
              <Skeleton className="h-6 w-48 bg-gray-400/70 dark:bg-gray-600/70" />
            </CardHeader>
            <CardBody className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ResourceCardSkeleton key="resource-skeleton-1" />
                <ResourceCardSkeleton key="resource-skeleton-2" />
                <ResourceCardSkeleton key="resource-skeleton-3" />
                <ResourceCardSkeleton key="resource-skeleton-4" />
              </div>
            </CardBody>
          </Card>

          {/* More closed categories */}
          <Card
            key="category-skeleton-1"
            className={`shadow-md h-full backdrop-blur-md bg-opacity-85 border border-content2
              transition-all duration-700
              ${showCards ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
            style={{ transitionDelay: '100ms' }}
          >
            <CardHeader className="flex items-center gap-2 p-4">
              <Skeleton className="h-6 w-6 rounded-full bg-gray-400/70 dark:bg-gray-600/70" />
              <Skeleton className="h-6 w-40 bg-gray-400/70 dark:bg-gray-600/70" />
            </CardHeader>
          </Card>

          <Card
            key="category-skeleton-2"
            className={`shadow-md h-full backdrop-blur-md bg-opacity-85 border border-content2
              transition-all duration-700
              ${showCards ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
            style={{ transitionDelay: '200ms' }}
          >
            <CardHeader className="flex items-center gap-2 p-4">
              <Skeleton className="h-6 w-6 rounded-full bg-gray-400/70 dark:bg-gray-600/70" />
              <Skeleton className="h-6 w-40 bg-gray-400/70 dark:bg-gray-600/70" />
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ResourceCardSkeleton() {
  return (
    <Card className="shadow-md h-full backdrop-blur-md bg-opacity-85 border border-content2">
      <CardBody className="p-4">
        <div className="flex gap-3">
          {/* Resource icon */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10">
              <Skeleton className="h-6 w-6 rounded-full bg-gray-400/70 dark:bg-gray-600/70" />
            </div>
          </div>

          <div className="flex-grow">
            {/* Title */}
            <Skeleton className="h-6 w-3/4 mb-2 bg-gray-400/70 dark:bg-gray-600/70" />

            {/* Description */}
            <Skeleton className="h-4 w-full mb-2 bg-gray-400/70 dark:bg-gray-600/70" />
            <Skeleton className="h-4 w-5/6 mb-3 bg-gray-400/70 dark:bg-gray-600/70" />

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              <Skeleton className="h-5 w-12 rounded-full bg-gray-400/70 dark:bg-gray-600/70" />
              <Skeleton className="h-5 w-16 rounded-full bg-gray-400/70 dark:bg-gray-600/70" />
            </div>

            {/* Type and button */}
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-14 rounded-full bg-gray-400/70 dark:bg-gray-600/70" />
              <Skeleton className="h-8 w-24 bg-gray-400/70 dark:bg-gray-600/70" />
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
