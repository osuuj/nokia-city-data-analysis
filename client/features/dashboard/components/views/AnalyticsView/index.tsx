'use client';

import { useAnalyticsData } from '@/features/dashboard/hooks/useAnalyticsData';
import { ErrorBoundary, ErrorMessage } from '@/shared/components/error';
import type React from 'react';
import { Suspense, memo, useMemo } from 'react';
import { CityComparisonCard } from './cards/CityComparisonCard';
import { IndustriesByCityCard } from './cards/IndustriesByCityCard';
import { IndustryDistributionCard } from './cards/IndustryDistributionCard';
import { TopCitiesCard } from './cards/TopCitiesCard';

// Analytics view loading component
const AnalyticsViewLoading = memo(() => (
  <div className="p-4">
    <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-4" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="h-64 bg-gray-200 rounded animate-pulse" />
      <div className="h-64 bg-gray-200 rounded animate-pulse" />
      <div className="h-64 bg-gray-200 rounded animate-pulse" />
      <div className="h-64 bg-gray-200 rounded animate-pulse" />
    </div>
  </div>
));

AnalyticsViewLoading.displayName = 'AnalyticsViewLoading';

/**
 * Props for the AnalyticsView component
 * Currently empty as the component uses a centralized data hook
 */
type AnalyticsViewProps = Record<string, never>;

/**
 * AnalyticsView Component
 *
 * Displays a collection of analytical visualizations including city comparisons,
 * industry distributions, and more.
 *
 * Optimized with React.memo to prevent unnecessary re-renders.
 */
export const AnalyticsView = memo(function AnalyticsView(_props: AnalyticsViewProps): JSX.Element {
  // Use the centralized analytics data hook
  const {
    isLoading,
    error,
    currentTheme,
    topCitiesData,
    distributionData,
    getIndustryKeyFromName,
    potentialOthers,
    industryNameMap,
    getThemedIndustryColor,
    selectedCities,
    pieChartFocusCity,
    onPieFocusChange,
    comparisonData,
    selectedIndustryDisplayNames,
    canFetchMultiCity,
    industriesByCityData,
  } = useAnalyticsData();

  // Memoize the grid layout to prevent unnecessary re-renders
  const cardsGrid = useMemo(
    () => (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopCitiesCard
          data={topCitiesData}
          isLoading={isLoading}
          error={error}
          currentTheme={currentTheme}
        />

        <IndustryDistributionCard
          data={distributionData}
          isLoading={isLoading}
          error={error}
          currentTheme={currentTheme}
          getIndustryKeyFromName={getIndustryKeyFromName}
          potentialOthers={potentialOthers}
          industryNameMap={industryNameMap}
          getThemedIndustryColor={getThemedIndustryColor}
          selectedCities={selectedCities}
          pieChartFocusCity={pieChartFocusCity}
          onPieFocusChange={onPieFocusChange}
          selectedIndustryDisplayNames={selectedIndustryDisplayNames}
        />

        <CityComparisonCard
          data={comparisonData}
          isLoading={isLoading}
          error={error}
          currentTheme={currentTheme}
          selectedIndustryDisplayNames={selectedIndustryDisplayNames}
          canFetchMultiCity={canFetchMultiCity}
        />

        <IndustriesByCityCard
          data={industriesByCityData}
          isLoading={isLoading}
          error={error}
          currentTheme={currentTheme}
          selectedIndustryDisplayNames={selectedIndustryDisplayNames}
          getIndustryKeyFromName={getIndustryKeyFromName}
          potentialOthers={potentialOthers}
          getThemedIndustryColor={getThemedIndustryColor}
          canFetchMultiCity={canFetchMultiCity}
        />
      </div>
    ),
    [
      isLoading,
      error,
      currentTheme,
      topCitiesData,
      distributionData,
      comparisonData,
      industriesByCityData,
      getIndustryKeyFromName,
      potentialOthers,
      industryNameMap,
      getThemedIndustryColor,
      selectedCities,
      pieChartFocusCity,
      onPieFocusChange,
      selectedIndustryDisplayNames,
      canFetchMultiCity,
    ],
  );

  // Memoize the error boundary to prevent unnecessary re-renders
  const errorBoundaryContent = useMemo(
    () => (
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
            {cardsGrid}
          </div>
        </Suspense>
      </ErrorBoundary>
    ),
    [cardsGrid],
  );

  return errorBoundaryContent;
});
