'use client';

import { filters } from '@/features/dashboard/data/filters';
import {
  useCityComparison,
  useIndustriesByCity,
  useIndustryDistribution,
  useTopCities,
} from '@/features/dashboard/hooks/analytics/useAnalytics';
import type { DistributionItemRaw } from '@/features/dashboard/hooks/analytics/useAnalytics';
import type { Filter as DashboardFilter, FilterOption } from '@/features/dashboard/types';
import { API_ENDPOINTS } from '@/shared/api/endpoints';
import type { ApiError } from '@/shared/api/types';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import { LoadingSpinner } from '@/shared/components/loading';
import { useApiQuery } from '@/shared/hooks/useApi';
import { createQueryKey } from '@/shared/hooks/useApi';
import { useTheme } from 'next-themes';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import type { TopCityData } from '../../hooks/analytics/useAnalytics';
import type { PivotedData } from '../../hooks/analytics/useAnalytics';
import {
  useCityComparisonEnhanced,
  useIndustriesByCityEnhanced,
  useIndustryDistributionEnhanced,
  useTopCitiesEnhanced,
} from '../../hooks/analytics/useEnhancedAnalytics';
import {
  CityComparisonCard,
  IndustriesByCityCard,
  IndustryDistributionCard,
  TopCitiesCard,
} from './cards';
import { CitySelection, IndustrySelection } from './selection';
import type {
  DistributionDataRaw,
  TransformedCityComparison,
  TransformedDistribution,
  TransformedIndustriesByCity,
} from './utils/types';
import {
  OTHER_CATEGORY_DISPLAY_NAME,
  OTHER_CATEGORY_NAME_FROM_BACKEND,
  getIndustryKeyFromName,
  getIndustryName,
  getPotentialOthers,
  getThemedIndustryColor,
  transformCityComparison,
  transformIndustriesByCity,
} from './utils/utils';

const MAX_SELECTED_CITIES = 5;
const MAX_SELECTED_INDUSTRIES = 5;

// Type definitions
interface City {
  name: string;
  // Add other city properties as needed
}

interface Industry {
  value: string;
  title: string;
  icon?: string;
  color?: {
    light: string;
    dark: string;
  };
}

interface Filter {
  key: string;
  options?: Industry[];
  industries?: Industry[];
  name?: string;
  darkColor?: string;
  lightColor?: string;
  value?: string;
  title?: string;
}

interface ApiResponse<T> {
  data: T;
  status: string;
}

interface IndustryDistributionResponse extends ApiResponse<DistributionDataRaw> {}
interface IndustriesByCityResponse extends ApiResponse<TransformedIndustriesByCity[]> {}
interface CityComparisonResponse extends ApiResponse<TransformedCityComparison[]> {}
interface TopCitiesResponse extends ApiResponse<TopCityData[]> {}

interface AnalyticsData {
  id: string;
  name: string;
  value: number;
  timestamp: string;
  // Add other properties as needed
}

interface IndustryDistributionCardProps {
  data: TransformedDistribution[];
  currentTheme: 'light' | 'dark' | undefined;
  getIndustryKeyFromName: (displayName: string) => string | undefined;
  potentialOthers: string[];
  industryNameMap: Map<string, string>;
  isLoading: boolean;
  error: Error | null;
  selectedIndustryDisplayNames: Set<string>;
  getThemedIndustryColor: (industry: string) => string;
  selectedCities: string[];
  pieChartFocusCity: string | null;
  onPieFocusChange: (city: string | null) => void;
}

interface IndustriesByCityCardProps {
  data: TransformedIndustriesByCity[];
  currentTheme: 'light' | 'dark' | undefined;
  getIndustryKeyFromName: (displayName: string) => string | undefined;
  potentialOthers: string[];
  getThemedIndustryColor: (industry: string) => string;
  isLoading: boolean;
  error: Error | null;
  selectedIndustryDisplayNames: Set<string>;
  canFetchMultiCity: boolean;
}

interface CityComparisonCardProps {
  data: TransformedCityComparison[];
  currentTheme: 'light' | 'dark' | undefined;
  selectedIndustryDisplayNames: Set<string>;
  canFetchMultiCity: boolean;
  isLoading: boolean;
  error: Error | null;
}

interface TopCitiesCardProps {
  data: TopCityData[];
  currentTheme: 'light' | 'dark' | undefined;
  isLoading: boolean;
  error: Error | null;
}

// Define a type that combines Error and ApiError properties
type ErrorWithApi = {
  name: string;
  message: string;
  status: number;
  code?: string;
};

// Helper function to convert ApiError to ErrorWithApi
const convertToErrorWithApi = (error: ApiError | null): ErrorWithApi | null => {
  if (!error) return null;
  return {
    name: 'ApiError',
    message: error.message || 'An error occurred',
    status: error.status,
    code: error.code,
  };
};

// Wrap each card component with error boundary
const IndustryDistributionCardWithErrorBoundary = (props: IndustryDistributionCardProps) => (
  <ErrorBoundary
    fallback={
      <ErrorMessage
        title="Error Loading Industry Distribution"
        message="Failed to load industry distribution data. Please try again."
      />
    }
  >
    <IndustryDistributionCard {...props} />
  </ErrorBoundary>
);

const IndustriesByCityCardWithErrorBoundary = ({
  data,
  error,
  ...props
}: IndustriesByCityCardProps & { error: ErrorWithApi | null }) => (
  <ErrorBoundary
    fallback={
      <ErrorMessage
        title="Error loading industries by city data"
        error={convertToErrorWithApi(error)}
      />
    }
  >
    <IndustriesByCityCard data={data} error={error} {...props} />
  </ErrorBoundary>
);

const CityComparisonCardWithErrorBoundary = ({
  data,
  error,
  ...props
}: CityComparisonCardProps & { error: ErrorWithApi | null }) => (
  <ErrorBoundary
    fallback={
      <ErrorMessage
        title="Error Loading City Comparison"
        message="Failed to load city comparison data. Please try again."
      />
    }
  >
    <CityComparisonCard data={data} error={error} {...props} />
  </ErrorBoundary>
);

const TopCitiesCardWithErrorBoundary = ({
  data,
  error,
  ...props
}: TopCitiesCardProps & { error: ErrorWithApi | null }) => (
  <ErrorBoundary
    fallback={
      <ErrorMessage
        title="Error Loading Top Cities"
        message="Failed to load top cities data. Please try again."
      />
    }
  >
    <TopCitiesCard data={data} {...props} />
  </ErrorBoundary>
);

export const AnalyticsView: React.FC = () => {
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
    API_ENDPOINTS.CITIES.LIST,
  );

  // Convert selectedCities Set to Array for the hooks
  const selectedCitiesArray = useMemo(() => Array.from(selectedCities), [selectedCities]);

  // Fetch top cities data with enhanced hook
  const {
    data: topCitiesData,
    isLoading: isTopCitiesLoading,
    error: topCitiesError,
  } = useTopCitiesEnhanced(selectedCitiesArray, selectedIndustries);

  // Fetch industry distribution data with enhanced hook
  const {
    data: industryDistributionData,
    isLoading: isIndustryDistributionLoading,
    error: industryDistributionError,
  } = useIndustryDistributionEnhanced(selectedCitiesArray, selectedIndustries);

  // Fetch industries by city data with enhanced hook
  const {
    data: industriesByCityData,
    isLoading: isIndustriesByCityLoading,
    error: industriesByCityError,
  } = useIndustriesByCityEnhanced(selectedCitiesArray, selectedIndustries);

  // Fetch city comparison data with enhanced hook
  const {
    data: cityComparisonData,
    isLoading: isCityComparisonLoading,
    error: cityComparisonError,
  } = useCityComparisonEnhanced(selectedCitiesArray, selectedIndustries);

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

    const items = data as DistributionItemRaw[];
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
    return transformIndustriesByCity(industriesByCityData.data as PivotedData);
  }, [industriesByCityData]);

  // Memoize the transformed city comparison data with type assertion
  const transformedCityComparison = useMemo(() => {
    if (!cityComparisonData?.data) return [];
    return transformCityComparison(cityComparisonData.data as PivotedData);
  }, [cityComparisonData]);

  // Memoize the list of available industries with their counts
  const availableIndustries = useMemo(() => {
    if (!industryDistributionData?.data) return [];
    const data = industryDistributionData.data as DistributionItemRaw[];
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
    return getPotentialOthers(industryDistributionData.data as DistributionItemRaw[]);
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

  const handleClearAllCities = () => {
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

  const handleClearAllIndustries = () => {
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

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <CitySelection
          cities={cities}
          selectedCities={selectedCities}
          onCityAdd={handleCityAdd}
          onCityRemove={handleCityRemove}
          onClearAll={handleClearAllCities}
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
          onClearAll={handleClearAllIndustries}
          showMaxWarning={showMaxIndustriesWarning}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <IndustryDistributionCardWithErrorBoundary
          data={chartData}
          currentTheme={currentTheme as 'light' | 'dark' | undefined}
          getIndustryKeyFromName={(displayName: string) =>
            getIndustryKeyFromName(displayName, filters)
          }
          potentialOthers={potentialOthers}
          industryNameMap={industryNameMap}
          getThemedIndustryColor={(industryName: string) =>
            getThemedIndustryColor(industryName, currentTheme, filters)
          }
          selectedCities={Array.from(selectedCities)}
          pieChartFocusCity={pieChartFocusCity}
          onPieFocusChange={handlePieFocusChange}
          isLoading={isIndustryDistributionLoading}
          error={
            industryDistributionError ? convertToErrorWithApi(industryDistributionError) : null
          }
          selectedIndustryDisplayNames={selectedIndustryDisplayNames}
        />

        <IndustriesByCityCardWithErrorBoundary
          data={transformedIndustriesByCity}
          currentTheme={currentTheme as 'light' | 'dark' | undefined}
          getIndustryKeyFromName={(displayName: string) =>
            getIndustryKeyFromName(displayName, filters)
          }
          potentialOthers={potentialOthers}
          getThemedIndustryColor={(industryName: string) =>
            getThemedIndustryColor(industryName, currentTheme, filters)
          }
          isLoading={isIndustriesByCityLoading}
          error={convertToErrorWithApi(industriesByCityError)}
          selectedIndustryDisplayNames={selectedIndustryDisplayNames}
          canFetchMultiCity={selectedCities.size > 1}
        />

        <CityComparisonCardWithErrorBoundary
          data={transformedCityComparison}
          currentTheme={currentTheme as 'light' | 'dark' | undefined}
          isLoading={isCityComparisonLoading}
          error={convertToErrorWithApi(cityComparisonError)}
          selectedIndustryDisplayNames={selectedIndustryDisplayNames}
          canFetchMultiCity={selectedCities.size > 1}
        />

        <TopCitiesCardWithErrorBoundary
          data={topCitiesData?.data || []}
          currentTheme={currentTheme as 'light' | 'dark' | undefined}
          isLoading={isTopCitiesLoading}
          error={convertToErrorWithApi(topCitiesError)}
        />
      </div>
    </div>
  );
};
