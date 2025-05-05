'use client';

import { FadeIn } from '../Animations';

// Define static keys for skeleton elements
const SKELETON_ROW_KEYS = ['row-1', 'row-2', 'row-3', 'row-4', 'row-5'];

/**
 * DashboardSkeleton
 * Skeleton loader for the entire dashboard view
 */
export function DashboardSkeleton() {
  return (
    <FadeIn>
      <div className="w-full space-y-4">
        <div className="h-12 bg-default-100 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="h-40 bg-default-100 rounded-lg animate-pulse" />
          <div className="h-40 bg-default-100 rounded-lg animate-pulse" />
          <div className="h-40 bg-default-100 rounded-lg animate-pulse" />
        </div>
        <div className="h-[60vh] bg-default-100 rounded-lg animate-pulse" />
      </div>
    </FadeIn>
  );
}

/**
 * SectionSkeleton
 * Skeleton loader for a specific dashboard section
 */
export function SectionSkeleton({ section }: { section: 'table' | 'map' | 'analytics' }) {
  if (section === 'table') {
    return (
      <FadeIn>
        <div className="w-full space-y-4 rounded-lg border border-default-200 p-4">
          <div className="h-10 bg-default-100 rounded-lg animate-pulse w-1/3" />
          <div className="space-y-2">
            {SKELETON_ROW_KEYS.map((key) => (
              <div
                key={`skeleton-${section}-${key}`}
                className="h-12 bg-default-100 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </FadeIn>
    );
  }

  if (section === 'map') {
    return (
      <FadeIn>
        <div className="w-full h-[70vh] bg-default-100 rounded-lg animate-pulse flex items-center justify-center">
          <div className="text-default-500 text-xl">Loading map...</div>
        </div>
      </FadeIn>
    );
  }

  return (
    <FadeIn>
      <div className="w-full space-y-4">
        <div className="h-10 bg-default-100 rounded-lg animate-pulse w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-60 bg-default-100 rounded-lg animate-pulse" />
          <div className="h-60 bg-default-100 rounded-lg animate-pulse" />
        </div>
      </div>
    </FadeIn>
  );
}

/**
 * AnalyticsSkeleton
 * Skeleton loader for analytics views
 */
export function AnalyticsSkeleton({
  type = 'distribution',
}: { type?: 'distribution' | 'comparison' }) {
  if (type === 'comparison') {
    return (
      <FadeIn>
        <div className="w-full space-y-4">
          <div className="h-8 bg-default-100 rounded-lg animate-pulse w-1/3" />
          <div className="h-[400px] bg-default-100 rounded-lg animate-pulse" />
        </div>
      </FadeIn>
    );
  }

  return (
    <FadeIn>
      <div className="w-full space-y-4">
        <div className="h-8 bg-default-100 rounded-lg animate-pulse w-1/4" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="h-[300px] bg-default-100 rounded-lg animate-pulse" />
          <div className="h-[300px] bg-default-100 rounded-lg animate-pulse" />
        </div>
      </div>
    </FadeIn>
  );
}
