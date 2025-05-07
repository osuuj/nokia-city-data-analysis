'use client';

import { Card, CardBody, CardFooter, CardHeader, Skeleton } from '@heroui/react';

/**
 * Base props for all skeleton card components
 */
export interface BaseCardSkeletonProps {
  /**
   * Additional className for the card container
   */
  className?: string;
  /**
   * Animation delay in milliseconds
   */
  delay?: number;
  /**
   * Whether to apply animation styles
   */
  animate?: boolean;
}

/**
 * Props for BasicCardSkeleton component
 */
export interface BasicCardSkeletonProps extends BaseCardSkeletonProps {
  /**
   * Whether to include an image placeholder
   */
  withImage?: boolean;
  /**
   * Whether to include a footer
   */
  withFooter?: boolean;
  /**
   * Number of description lines to show
   */
  descriptionLines?: number;
  /**
   * Number of tag placeholders to show
   */
  tagCount?: number;
}

/**
 * A basic card skeleton that can be used for most card layouts
 *
 * Highly configurable with options for image, footer, description lines, etc.
 */
export function BasicCardSkeleton({
  className = '',
  withImage = false,
  withFooter = false,
  descriptionLines = 2,
  tagCount = 2,
  delay = 0,
  animate = true,
}: BasicCardSkeletonProps) {
  const animationStyles = animate
    ? {
        transform: 'translateY(0)',
        opacity: 1,
        transition: 'all 0.7s ease',
        transitionDelay: `${delay}ms`,
      }
    : {};

  return (
    <Card
      className={`shadow-md h-full backdrop-blur-md bg-opacity-85 border border-content2 overflow-hidden ${className}`}
      style={animationStyles}
    >
      {withImage && (
        <CardHeader className="p-0 overflow-hidden h-48 relative">
          <Skeleton className="absolute inset-0 bg-gray-400/70 dark:bg-gray-600/70" />
        </CardHeader>
      )}

      <CardBody className="pb-0">
        {/* Category chip */}
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-6 w-16 rounded-full bg-gray-400/70 dark:bg-gray-600/70" />
        </div>

        {/* Title */}
        <Skeleton className="h-7 w-3/4 mb-2 bg-gray-400/70 dark:bg-gray-600/70" />

        {/* Description */}
        {Array.from({ length: descriptionLines }).map(() => (
          <Skeleton
            key={`desc-line-${crypto.randomUUID()}`}
            className="h-4 w-full mb-2 bg-gray-400/70 dark:bg-gray-600/70"
          />
        ))}

        {/* Tags */}
        {tagCount > 0 && (
          <div className="flex flex-wrap gap-1 mt-4">
            {Array.from({ length: tagCount }).map(() => (
              <Skeleton
                key={`tag-${crypto.randomUUID()}`}
                className="h-6 w-20 rounded-full bg-gray-400/70 dark:bg-gray-600/70"
              />
            ))}
          </div>
        )}
      </CardBody>

      {withFooter && (
        <CardFooter className="flex justify-between mt-4">
          <Skeleton className="h-8 w-24 bg-gray-400/70 dark:bg-gray-600/70" />
          <Skeleton className="h-8 w-24 bg-gray-400/70 dark:bg-gray-600/70" />
        </CardFooter>
      )}
    </Card>
  );
}

/**
 * Props for ResourceCardSkeleton component
 */
export interface ResourceCardSkeletonProps extends BaseCardSkeletonProps {
  /**
   * Number of tags to display
   */
  tagCount?: number;
}

/**
 * A skeleton specifically for resource cards with icon, title, description, and tags
 */
export function ResourceCardSkeleton({
  className = '',
  tagCount = 2,
  delay = 0,
  animate = true,
}: ResourceCardSkeletonProps) {
  const animationStyles = animate
    ? {
        transform: 'translateY(0)',
        opacity: 1,
        transition: 'all 0.7s ease',
        transitionDelay: `${delay}ms`,
      }
    : {};

  return (
    <Card
      className={`shadow-md h-full backdrop-blur-md bg-opacity-85 border border-content2 ${className}`}
      style={animationStyles}
    >
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
            {tagCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {Array.from({ length: tagCount }).map(() => (
                  <Skeleton
                    key={`tag-${crypto.randomUUID()}`}
                    className="h-5 w-20 rounded-full bg-gray-400/70 dark:bg-gray-600/70"
                  />
                ))}
              </div>
            )}

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

/**
 * Header section skeleton with title and optional description
 */
export function HeaderSectionSkeleton({
  titleWidth = 'w-64',
  descriptionLines = 2,
  className = '',
}: {
  titleWidth?: string;
  descriptionLines?: number;
  className?: string;
}) {
  return (
    <div className={`text-center mb-10 ${className}`}>
      <Skeleton className={`h-10 ${titleWidth} mx-auto mb-4 bg-gray-400/70 dark:bg-gray-600/70`} />

      {descriptionLines > 0 && (
        <>
          <Skeleton className="h-5 w-full max-w-2xl mx-auto mb-2 bg-gray-400/70 dark:bg-gray-600/70" />
          {descriptionLines > 1 && (
            <Skeleton className="h-5 w-3/4 max-w-xl mx-auto bg-gray-400/70 dark:bg-gray-600/70" />
          )}
        </>
      )}
    </div>
  );
}

// Define a generic type for card component props
type CardComponentProps = BaseCardSkeletonProps & Record<string, unknown>;

/**
 * Grid of card skeletons with animation
 */
export function CardGridSkeleton<T extends CardComponentProps>({
  cardCount = 3,
  CardComponent = BasicCardSkeleton as React.ComponentType<T>,
  cardProps = {} as T,
  className = '',
  columns = { sm: 2, lg: 3 },
}: {
  cardCount?: number;
  CardComponent?: React.ComponentType<T>;
  cardProps?: T;
  className?: string;
  columns?: { sm?: number; lg?: number };
}) {
  const colClasses = `grid-cols-1 ${columns.sm ? `sm:grid-cols-${columns.sm}` : ''} ${columns.lg ? `lg:grid-cols-${columns.lg}` : ''}`;

  return (
    <div className={`grid gap-6 ${colClasses} ${className}`}>
      {Array.from({ length: cardCount }).map(() => (
        <div
          key={`card-${crypto.randomUUID()}`}
          className="opacity-0 translate-y-4"
          style={{ animation: 'fadeInUp 0.7s ease forwards' }}
        >
          <CardComponent {...cardProps} />
        </div>
      ))}
    </div>
  );
}
