'use client';

import { filters } from '@/features/dashboard/data/filters';
import { useTheme } from 'next-themes';
import React from 'react';
import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { CitySelection, IndustrySelection } from '../components/analytics-selection';
import { AnalyticsSkeleton } from '../components/analytics-skeletons';
import type { TransformedDistribution } from '../components/analytics-utils/types';
import {
  getIndustryKeyFromName,
  getIndustryName,
  getPotentialOthers,
  getThemedIndustryColor,
  transformCityComparison,
  transformIndustriesByCity,
} from '../components/analytics-utils/utils';
import { withDashboardErrorBoundary } from '../components/shared/withDashboardErrorBoundary';

// Lazy load card components for code splitting
const CityComparisonCard = lazy(() =>
  import('../components/analytics-cards/CityComparisonCard').then((module) => ({
    default: module.CityComparisonCard,
  })),
);
const IndustriesByCityCard = lazy(() =>
  import('../components/analytics-cards/IndustriesByCityCard').then((module) => ({
    default: module.IndustriesByCityCard,
  })),
);
const IndustryDistributionCard = lazy(() =>
  import('../components/analytics-cards/IndustryDistributionCard').then((module) => ({
    default: module.IndustryDistributionCard,
  })),
);
const TopCitiesCard = lazy(() =>
  import('../components/analytics-cards/TopCitiesCard').then((module) => ({
    default: module.TopCitiesCard,
  })),
);

const MAX_SELECTED_CITIES = 5;
const MAX_SELECTED_INDUSTRIES = 5;

const AnalyticsViewComponent: React.FC = () => {
  const { theme: currentTheme } = useTheme();
  const [selectedCities, setSelectedCities] = useState<Set<string>>(new Set());
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMaxCitiesWarning, setShowMaxCitiesWarning] = useState(false);
  const [showMaxIndustriesWarning, setShowMaxIndustriesWarning] = useState(false);
  const [pieChartFocusCity, setPieChartFocusCity] = useState<string | null>(null);
  const [_error, setError] = useState<Error | null>(null);

  // Placeholders for removed cities data fetching
  const citiesData = { data: [] };
  const isCitiesLoading = false;

  // Convert selectedCities Set to Array for the hooks
  const selectedCitiesArray = useMemo(() => Array.from(selectedCities), [selectedCities]);

  // Placeholders for removed analytics hooks
  const topCitiesData = undefined;
  const isTopCitiesLoading = false;
  const topCitiesError = null;

  const industryDistributionData = undefined;
  const isIndustryDistributionLoading = false;
  const industryDistributionError = null;

  const industriesByCityData = undefined;
  const isIndustriesByCityLoading = false;
  const industriesByCityError = null;

  const cityComparisonData = undefined;
  const isCityComparisonLoading = false;
  const cityComparisonError = null;

  // Memoize the list of cities
  const cities = useMemo(() => {
    return [];
  }, []);

  // Memoize the industry name map
  const industryNameMap = useMemo(() => {
    const map = new Map<string, string>();
    const industriesFilter = filters.find((f) => f.key === 'industries');
    if (industriesFilter?.options) {
      for (const option of industriesFilter.options) {
        map.set(option.value, option.title);
      }
    }
    return map;
  }, []);

  // Memoize the transformed industry distribution data with combined calculations
  const { chartData } = useMemo(() => {
    const data: unknown[] = [];
    if (!Array.isArray(data)) return { chartData: [], total: 0 };

    const items = data;
    const currentTotal = items.reduce((sum, item) => sum + item.value, 0);

    const transformedData = items.map((item) => ({
      industry: getIndustryName(item.name, industryNameMap),
      count: item.value,
      percentage: currentTotal > 0 ? (item.value / currentTotal) * 100 : 0,
    }));

    return { chartData: transformedData, total: currentTotal };
  }, [industryNameMap]);

  // Memoize the transformed industries by city data with type assertion
  const transformedIndustriesByCity = useMemo(() => {
    const data: unknown[] = [];
    return data;
  }, []);

  // Memoize the transformed city comparison data with type assertion
  const transformedCityComparison = useMemo(() => {
    const data: unknown[] = [];
    return data;
  }, []);

  // Memoize the list of available industries with their counts
  const availableIndustries = useMemo(() => {
    const data: unknown[] = [];
    return data.map((item) => ({
      name: getIndustryName(item.name, industryNameMap),
      total: item.value,
    }));
  }, [industryNameMap]);

  // Memoize the selected industry display names
  const selectedIndustryDisplayNames = useMemo(() => {
    return new Set(selectedIndustries.map((key) => getIndustryName(key, industryNameMap)));
  }, [selectedIndustries, industryNameMap]);

  // Memoize the potential "Others" category
  const potentialOthers = useMemo(() => {
    const data: unknown[] = [];
    return data;
  }, []);

  // Handle city selection
  const handleCityAdd = (city: string) => {
    if (selectedCities.size >= MAX_SELECTED_CITIES) {
      setShowMaxCitiesWarning(true);
      setTimeout(() => setShowMaxCitiesWarning(false), 3000);
      return;
    }
    setSelectedCities((prev) => new Set([...prev, city]));
    // Don't clear the search input here to prevent unexpected behavior
  };

  const handleCityRemove = (city: string) => {
    setSelectedCities((prev) => {
      const next = new Set(prev);
      next.delete(city);
      return next;
    });
  };

  const handleClearCities = () => {
    setSelectedCities(new Set());
  };

  // Handle pie chart focus city change
  const handlePieFocusChange = (city: string | null) => {
    setPieChartFocusCity(city);
  };

  // Handle industry selection
  const handleIndustryChange = (industries: string[]) => {
    if (industries.length > MAX_SELECTED_INDUSTRIES) {
      setShowMaxIndustriesWarning(true);
      setTimeout(() => setShowMaxIndustriesWarning(false), 3000);
      return;
    }
    setSelectedIndustries(industries);
  };

  const handleIndustryRemove = (industry: string) => {
    setSelectedIndustries((prev) => prev.filter((i) => i !== industry));
  };

  const handleClearIndustries = () => {
    setSelectedIndustries([]);
  };

  // Reset pie chart focus when cities change
  useEffect(() => {
    if (pieChartFocusCity && !selectedCities.has(pieChartFocusCity)) {
      setPieChartFocusCity(null);
    }
  }, [selectedCities, pieChartFocusCity]);

  // Helper functions for industry data
  const getIndustryKeyFromDisplayName = (name: string) => {
    return getIndustryKeyFromName(name, filters);
  };

  const getThemedIndustryColorFromName = (industry: string) => {
    return getThemedIndustryColor(industry, currentTheme, filters);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <CitySelection
          cities={cities}
          selectedCities={selectedCities}
          onCityAdd={handleCityAdd}
          onCityRemove={handleCityRemove}
          onClearAll={handleClearCities}
          isLoading={isCitiesLoading}
          showMaxWarning={showMaxCitiesWarning}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <IndustrySelection
          availableIndustries={availableIndustries}
          selectedIndustries={selectedIndustries}
          onIndustryChange={handleIndustryChange}
          onIndustryRemove={handleIndustryRemove}
          onClearAll={handleClearIndustries}
          showMaxWarning={showMaxIndustriesWarning}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <React.Fragment>
          <Suspense fallback={<AnalyticsSkeleton type="trends" />}>
            <TopCitiesCard
              data={topCitiesData?.data || []}
              isLoading={isTopCitiesLoading}
              error={null}
              currentTheme={currentTheme as 'light' | 'dark' | undefined}
            />
          </Suspense>
        </React.Fragment>

        <React.Fragment>
          <Suspense fallback={<AnalyticsSkeleton type="distribution" />}>
            <IndustryDistributionCard
              data={chartData}
              currentTheme={currentTheme as 'light' | 'dark' | undefined}
              getIndustryKeyFromName={getIndustryKeyFromDisplayName}
              potentialOthers={potentialOthers}
              industryNameMap={industryNameMap}
              getThemedIndustryColor={getThemedIndustryColorFromName}
              selectedCities={selectedCitiesArray}
              pieChartFocusCity={pieChartFocusCity}
              onPieFocusChange={handlePieFocusChange}
              isLoading={isIndustryDistributionLoading}
              error={null}
              selectedIndustryDisplayNames={selectedIndustryDisplayNames}
            />
          </Suspense>
        </React.Fragment>

        <React.Fragment>
          <Suspense fallback={<AnalyticsSkeleton type="comparison" />}>
            <IndustriesByCityCard
              data={transformedIndustriesByCity}
              currentTheme={currentTheme as 'light' | 'dark' | undefined}
              getIndustryKeyFromName={getIndustryKeyFromDisplayName}
              potentialOthers={potentialOthers}
              getThemedIndustryColor={getThemedIndustryColorFromName}
              isLoading={isIndustriesByCityLoading}
              error={null}
              selectedIndustryDisplayNames={selectedIndustryDisplayNames}
              canFetchMultiCity={selectedCitiesArray.length > 1}
            />
          </Suspense>
        </React.Fragment>

        <React.Fragment>
          <Suspense fallback={<AnalyticsSkeleton type="comparison" />}>
            <CityComparisonCard
              data={transformedCityComparison}
              isLoading={isCityComparisonLoading}
              error={null}
              selectedIndustryDisplayNames={selectedIndustryDisplayNames}
              canFetchMultiCity={selectedCitiesArray.length > 1}
              currentTheme={currentTheme as 'light' | 'dark' | undefined}
            />
          </Suspense>
        </React.Fragment>
      </div>
    </div>
  );
};

export const AnalyticsView = withDashboardErrorBoundary(AnalyticsViewComponent, {
  componentName: 'AnalyticsView',
  fallback: <ErrorMessage message="Failed to load analytics view" />,
});
