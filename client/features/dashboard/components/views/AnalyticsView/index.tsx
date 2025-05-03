'use client';

import { ErrorBoundary, ErrorMessage } from '@/shared/components/error';
import type React from 'react';
import { Suspense, useState } from 'react';
import { CityComparisonCard } from './cards/CityComparisonCard';
import { IndustriesByCityCard } from './cards/IndustriesByCityCard';
import { IndustryDistributionCard } from './cards/IndustryDistributionCard';
import { TopCitiesCard } from './cards/TopCitiesCard';

// Analytics view loading component
const AnalyticsViewLoading = () => (
  <div className="p-4">
    <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-4" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="h-64 bg-gray-200 rounded animate-pulse" />
      <div className="h-64 bg-gray-200 rounded animate-pulse" />
      <div className="h-64 bg-gray-200 rounded animate-pulse" />
      <div className="h-64 bg-gray-200 rounded animate-pulse" />
    </div>
  </div>
);

interface AnalyticsViewProps {
  // Analytics specific props will be added here as needed
  isLoading?: boolean;
  data?: Record<string, unknown>; // Typed as Record<string, unknown> instead of any
}

/**
 * AnalyticsView Component
 *
 * Displays a collection of analytical visualizations including city comparisons,
 * industry distributions, and more.
 */
export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ isLoading = false, data }) => {
  // Mock data/props for the cards - these would be replaced with real data in the production version
  const [currentTheme] = useState<'light' | 'dark'>('light');

  return (
    <ErrorBoundary
      fallback={
        <ErrorMessage
          title="Analytics Error"
          message="There was an error loading the analytics data. Please try again later."
        />
      }
    >
      <Suspense fallback={<AnalyticsViewLoading />}>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Analytics Dashboard</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopCitiesCard
              data={[]}
              isLoading={isLoading}
              error={null}
              currentTheme={currentTheme}
            />

            <IndustryDistributionCard data={[]} isLoading={isLoading} currentTheme={currentTheme} />

            <CityComparisonCard
              data={[]}
              isLoading={isLoading}
              error={null}
              currentTheme={currentTheme}
            />

            <IndustriesByCityCard
              data={[]}
              isLoading={isLoading}
              error={null}
              currentTheme={currentTheme}
            />
          </div>
        </div>
      </Suspense>
    </ErrorBoundary>
  );
};
