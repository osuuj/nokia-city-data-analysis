'use client';

import { Card, CardBody, Skeleton } from '@heroui/react';
import { memo } from 'react';

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
      <div className="w-full rounded-lg overflow-hidden shadow-md bg-white dark:bg-gray-800">
        {/* Header */}
        <div className="p-4">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        {/* Image */}
        <Skeleton className="h-48 w-full" />

        {/* Body */}
        <div className="p-4">
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6 mb-4" />

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-14" />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>

      {/* Tech Stack */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton
              key={`skeleton-tag-tech-${String.fromCharCode(97 + i)}`}
              className="h-12 w-full"
            />
          ))}
        </div>
      </div>

      {/* Gallery */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton
              key={`skeleton-image-gallery-${String.fromCharCode(97 + i)}`}
              className="h-48 w-full"
            />
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`skeleton-row-timeline-${String.fromCharCode(97 + i)}`}
              className="flex gap-4"
            >
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default ProjectSkeleton;

export function ProjectGridSkeleton() {
  return (
    <div className="grid gap-6 mb-2 max-w-5xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <ProjectSkeleton key={i} type="card" />
      ))}
    </div>
  );
}

export function ProjectDetailSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Hero Section */}
      <div className="relative h-[40vh] overflow-hidden">
        <Skeleton className="w-full h-full" />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Skeleton className="w-32 h-8 mb-4" />
          <Skeleton className="w-3/4 h-12 mb-2" />
          <Skeleton className="w-1/2 h-6" />
        </div>
      </div>

      {/* Overview Section */}
      <Card>
        <CardBody className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="w-32 h-8" />
            <Skeleton className="w-48 h-6" />
          </div>
          <Skeleton className="w-full h-24" />
          <div className="space-y-2">
            <Skeleton className="w-32 h-6" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-3/4 h-4" />
          </div>
        </CardBody>
      </Card>

      {/* Gallery Section */}
      <div>
        <Skeleton className="w-48 h-8 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardBody className="p-0">
                <Skeleton className="w-full h-48" />
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      {/* Tech Stack Section */}
      <div>
        <Skeleton className="w-48 h-8 mb-6 mx-auto" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i}>
              <CardBody className="flex flex-col items-center justify-center p-4">
                <Skeleton className="w-12 h-12 rounded-full mb-2" />
                <Skeleton className="w-20 h-4" />
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
