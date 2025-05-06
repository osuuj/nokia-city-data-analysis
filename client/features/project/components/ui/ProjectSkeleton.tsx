'use client';

import { Card, CardBody, CardFooter, CardHeader, Chip, Skeleton } from '@heroui/react';
import { memo, useEffect, useState } from 'react';

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
      <Card className="shadow-md h-full backdrop-blur-md bg-opacity-85 border border-content2 overflow-hidden">
        {/* Image Header */}
        <CardHeader className="p-0 overflow-hidden h-48 relative">
          <Skeleton className="absolute inset-0 bg-gray-400/70 dark:bg-gray-600/70" />

          {/* Featured chip - always show for consistency */}
          <div className="absolute top-2 right-2 z-10">
            <Skeleton className="h-6 w-20 rounded-full bg-gray-400/70 dark:bg-gray-600/70" />
          </div>
        </CardHeader>

        <CardBody className="pb-0">
          {/* Category chip */}
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-6 w-16 rounded-full bg-gray-400/70 dark:bg-gray-600/70" />
          </div>

          {/* Title */}
          <Skeleton className="h-7 w-3/4 mb-2 bg-gray-400/70 dark:bg-gray-600/70" />

          {/* Description */}
          <Skeleton className="h-4 w-full mb-2 bg-gray-400/70 dark:bg-gray-600/70" />
          <Skeleton className="h-4 w-5/6 mb-4 bg-gray-400/70 dark:bg-gray-600/70" />

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mt-4">
            <Skeleton className="h-6 w-14 rounded-full bg-gray-400/70 dark:bg-gray-600/70" />
            <Skeleton className="h-6 w-20 rounded-full bg-gray-400/70 dark:bg-gray-600/70" />
            <Skeleton className="h-6 w-16 rounded-full bg-gray-400/70 dark:bg-gray-600/70" />
          </div>
        </CardBody>

        <CardFooter className="flex justify-between mt-4">
          <Skeleton className="h-8 w-24 bg-gray-400/70 dark:bg-gray-600/70" />
          <Skeleton className="h-8 w-24 bg-gray-400/70 dark:bg-gray-600/70" />
        </CardFooter>
      </Card>
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

export function ProjectGridSkeleton() {
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

        <div className="grid gap-6 mb-2 max-w-5xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`transition-all duration-700 ${showCards ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <ProjectSkeleton type="card" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProjectDetailSkeleton() {
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
    <div className="relative w-full min-h-screen">
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

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Hero Section */}
        <Card
          className={`shadow-md h-full backdrop-blur-md bg-opacity-85 border border-content2
            transition-all duration-700 overflow-hidden
            ${showCards ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
        >
          <div className="relative h-[40vh] overflow-hidden">
            <Skeleton className="w-full h-full bg-gray-400/70 dark:bg-gray-600/70" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Skeleton className="w-32 h-8 mb-4 bg-gray-400/70 dark:bg-gray-600/70" />
              <Skeleton className="w-3/4 h-12 mb-2 bg-gray-400/70 dark:bg-gray-600/70" />
              <Skeleton className="w-1/2 h-6 bg-gray-400/70 dark:bg-gray-600/70" />
            </div>
          </div>
        </Card>

        {/* Content in Card with same styling as other components */}
        <Card
          className={`shadow-md h-full backdrop-blur-md bg-opacity-85 border border-content2
            transition-all duration-700
            ${showCards ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
          style={{ transitionDelay: '100ms' }}
        >
          <CardHeader className="p-6 border-b border-default-200/50 dark:border-default-700/30">
            <Skeleton className="h-8 w-1/3 bg-gray-400/70 dark:bg-gray-600/70" />
          </CardHeader>
          <CardBody className="p-6">
            <ProjectSkeleton type="detail" />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
