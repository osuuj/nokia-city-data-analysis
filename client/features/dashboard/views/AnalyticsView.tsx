'use client';

import { filters } from '@/features/dashboard/data/filters';
import type {
  AnalyticsData,
  City,
  DistributionItemRaw,
  ErrorWithApi,
  Industry,
  PivotedData,
  TopCityData,
} from '@/features/dashboard/hooks/analytics/types';
import {
  useCityComparison,
  useIndustriesByCity,
  useIndustryDistribution,
  useTopCities,
} from '@/features/dashboard/hooks/analytics/useAnalytics';
import type { Filter as DashboardFilter, FilterOption } from '@/features/dashboard/types';
import { API_ENDPOINTS } from '@/shared/api/endpoints';
import type { ApiError } from '@/shared/api/types';
import { ErrorBoundary } from '@/shared/components/error';
import { ErrorMessage } from '@/shared/components/error';
import { LoadingSpinner } from '@/shared/components/loading';
import { useApiQuery } from '@/shared/hooks/api';
import { createQueryKey } from '@/shared/hooks/api';
import { useTheme } from 'next-themes';
import type React from 'react';
import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { CitySelection, IndustrySelection } from '../components/analytics-selection';
import { AnalyticsCardSkeleton } from '../components/analytics-skeletons';
import type {
  DistributionDataRaw,
  TransformedCityComparison,
  TransformedDistribution,
  TransformedIndustriesByCity,
} from '../components/analytics-utils/types';
import {
  OTHER_CATEGORY_DISPLAY_NAME,
  OTHER_CATEGORY_NAME_FROM_BACKEND,
  getIndustryKeyFromName,
  getIndustryName,
  getPotentialOthers,
  getThemedIndustryColor,
  transformCityComparison,
  transformIndustriesByCity,
} from '../components/analytics-utils/utils';
import { withDashboardErrorBoundary } from '../components/shared/withDashboardErrorBoundary';
import {
  useCityComparisonEnhanced,
  useIndustriesByCityEnhanced,
  useIndustryDistributionEnhanced,
  useTopCitiesEnhanced,
} from '../hooks/analytics/useEnhancedAnalytics';

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

// Helper function to convert ApiError to ErrorWithApi
const convertToErrorWithApi = (error: ApiError | null): ErrorWithApi | null => {
  if (!error) return null;
  return {
    name: 'ApiError',
    message: error.message || 'An error occurred',
    status: error.status || 500,
    code: error.code,
  };
};

const AnalyticsViewComponent: React.FC = () => {
  const { theme: currentTheme } = useTheme();
  const [selectedCities, setSelectedCities] = useState<Set<string>>(new Set());
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMaxCitiesWarning, setShowMaxCitiesWarning] = useState(false);
  const [showMaxIndustriesWarning, setShowMaxIndustriesWarning] = useState(false);
  const [pieChartFocusCity, setPieChartFocusCity] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Fetch cities data
  const { data: citiesData, isLoading: isCitiesLoading } = useApiQuery(
    createQueryKey('cities'),
    API_ENDPOINTS.CITIES,
  );

  // Convert selectedCities Set to Array for the hooks
  const selectedCitiesArray = useMemo(() => Array.from(selectedCities), [selectedCities]);

  // Fetch top cities data with enhanced hook
  const {
    data: topCitiesData,
    isLoading: isTopCitiesLoading,
    error: topCitiesError,
  } = useTopCitiesEnhanced(selectedIndustries.length > 0);

  // Fetch industry distribution data with enhanced hook
  const {
    data: industryDistributionData,
    isLoading: isIndustryDistributionLoading,
    error: industryDistributionError,
  } = useIndustryDistributionEnhanced(selectedCitiesArray, selectedIndustries.length > 0);

  // Fetch industries by city data with enhanced hook
  const {
    data: industriesByCityData,
    isLoading: isIndustriesByCityLoading,
    error: industriesByCityError,
  } = useIndustriesByCityEnhanced(selectedCitiesArray, selectedIndustries.length > 0);

  // Fetch city comparison data with enhanced hook
  const {
    data: cityComparisonData,
    isLoading: isCityComparisonLoading,
    error: cityComparisonError,
  } = useCityComparisonEnhanced(selectedCitiesArray, selectedIndustries.length > 0);

  // Memoize the list of cities
  const cities = useMemo(() => {
    if (!citiesData?.data || !Array.isArray(citiesData.data)) {
      return [];
    }
    return citiesData.data.map((city: City) => city.name);
  }, [citiesData]);

  // Memoize the industry name map
  const industryNameMap = useMemo(() => {
    const map = new Map<string, string>();
    const industriesFilter = filters.find((f: DashboardFilter) => f.key === 'industries');
    if (industriesFilter?.options) {
      for (const option of industriesFilter.options) {
        map.set(option.value, option.title);
      }
    }
    return map;
  }, []);

  // Memoize the transformed industry distribution data with combined calculations
  const { chartData, total } = useMemo(() => {
    const data = industryDistributionData?.data;
    if (!Array.isArray(data)) return { chartData: [], total: 0 };

    const items = data as unknown as DistributionItemRaw[];
    const currentTotal = items.reduce((sum, item) => sum + item.value, 0);

    const transformedData = items.map(
      (item): TransformedDistribution => ({
        industry: getIndustryName(item.name, industryNameMap),
        count: item.value,
        percentage: currentTotal > 0 ? (item.value / currentTotal) * 100 : 0,
      }),
    );

    return { chartData: transformedData, total: currentTotal };
  }, [industryDistributionData, industryNameMap]);

  // Memoize the transformed industries by city data with type assertion
  const transformedIndustriesByCity = useMemo(() => {
    if (!industriesByCityData?.data) return [];
    return transformIndustriesByCity(industriesByCityData.data as unknown as PivotedData);
  }, [industriesByCityData]);

  // Memoize the transformed city comparison data with type assertion
  const transformedCityComparison = useMemo(() => {
    if (!cityComparisonData?.data) return [];
    return transformCityComparison(cityComparisonData.data as unknown as PivotedData);
  }, [cityComparisonData]);

  // Memoize the list of available industries with their counts
  const availableIndustries = useMemo(() => {
    if (!industryDistributionData?.data) return [];
    const data = industryDistributionData.data as unknown as DistributionItemRaw[];
    return data.map((item) => ({
      name: getIndustryName(item.name, industryNameMap),
      total: item.value,
    }));
  }, [industryDistributionData, industryNameMap]);

  // Memoize the selected industry display names
  const selectedIndustryDisplayNames = useMemo(() => {
    return new Set(selectedIndustries.map((key) => getIndustryName(key, industryNameMap)));
  }, [selectedIndustries, industryNameMap]);

  // Memoize the potential "Others" category
  const potentialOthers = useMemo(() => {
    if (!industryDistributionData?.data) return [];
    return getPotentialOthers(industryDistributionData.data as unknown as DistributionItemRaw[]);
  }, [industryDistributionData]);

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

  const handleError = (error: ApiError | null) => {
    if (!error) return;
    const convertedError = {
      name: 'ApiError',
      message: error.message || 'An error occurred',
      stack: new Error().stack,
    };
    setError(convertedError);
  };

  const handleDataChange = (data: AnalyticsData[]) => {
    // ... existing code ...
  };

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
        <ErrorBoundary
          fallback={<ErrorMessage message="Failed to load top cities data" />}
          onError={(error: Error, errorInfo: React.ErrorInfo) => {
            console.error('Error in TopCitiesCard:', error, errorInfo);
            setError(error);
          }}
        >
          <Suspense fallback={<AnalyticsCardSkeleton type="trends" />}>
            <TopCitiesCard
              data={topCitiesData?.data || []}
              isLoading={isTopCitiesLoading}
              error={convertToErrorWithApi(topCitiesError)}
              currentTheme={currentTheme as 'light' | 'dark' | undefined}
            />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary
          fallback={<ErrorMessage message="Failed to load industry distribution data" />}
          onError={(error: Error) => {
            console.error('Error in IndustryDistributionCard:', error);
            setError(error);
          }}
        >
          <Suspense fallback={<AnalyticsCardSkeleton type="distribution" />}>
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
              error={convertToErrorWithApi(industryDistributionError)}
              selectedIndustryDisplayNames={selectedIndustryDisplayNames}
            />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary
          fallback={<ErrorMessage message="Failed to load industries by city data" />}
          onError={(error: Error) => {
            console.error('Error in IndustriesByCityCard:', error);
            setError(error);
          }}
        >
          <Suspense fallback={<AnalyticsCardSkeleton type="comparison" />}>
            <IndustriesByCityCard
              data={transformedIndustriesByCity}
              currentTheme={currentTheme as 'light' | 'dark' | undefined}
              getIndustryKeyFromName={getIndustryKeyFromDisplayName}
              potentialOthers={potentialOthers}
              getThemedIndustryColor={getThemedIndustryColorFromName}
              isLoading={isIndustriesByCityLoading}
              error={convertToErrorWithApi(industriesByCityError)}
              selectedIndustryDisplayNames={selectedIndustryDisplayNames}
              canFetchMultiCity={selectedCitiesArray.length > 1}
            />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary
          fallback={<ErrorMessage message="Failed to load city comparison data" />}
          onError={(error: Error, errorInfo: React.ErrorInfo) => {
            console.error('Error in CityComparisonCard:', error, errorInfo);
            setError(error);
          }}
        >
          <Suspense fallback={<AnalyticsCardSkeleton type="comparison" />}>
            <CityComparisonCard
              data={transformedCityComparison}
              currentTheme={currentTheme as 'light' | 'dark' | undefined}
              selectedIndustryDisplayNames={selectedIndustryDisplayNames}
              canFetchMultiCity={selectedCitiesArray.length > 1}
              isLoading={isCityComparisonLoading}
              error={convertToErrorWithApi(cityComparisonError)}
            />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export const AnalyticsView = withDashboardErrorBoundary(AnalyticsViewComponent, {
  componentName: 'AnalyticsView',
  fallback: <ErrorMessage message="Failed to load analytics view" />,
});
