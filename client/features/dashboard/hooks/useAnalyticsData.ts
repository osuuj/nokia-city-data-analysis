'use client';

import { useQuery } from '@tanstack/react-query';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  fetchCityComparison,
  fetchIndustriesByCity,
  fetchIndustryDistribution,
  fetchTopCities,
} from '../services/api';
import { useDashboardStore } from '../store/useDashboardStore';

const MAX_SELECTED_CITIES = 5;
const OTHER_CATEGORY_DISPLAY_NAME = 'Others';

/**
 * Interface for the useAnalyticsData hook result
 */
interface UseAnalyticsDataResult {
  // Shared data
  isLoading: boolean;
  error: Error | null;
  currentTheme: 'light' | 'dark';

  // Top Cities Card data
  topCitiesData: TopCityData[];

  // Industry Distribution Card data
  distributionData: TransformedDistribution[];
  getIndustryKeyFromName: (name: string) => string | undefined;
  potentialOthers: string[];
  industryNameMap: Map<string, string>;
  getThemedIndustryColor: (name: string, theme?: 'light' | 'dark') => string;
  selectedCities: string[];
  pieChartFocusCity: string | null;
  onPieFocusChange: (city: string | null) => void;

  // City Comparison Card data
  comparisonData: TransformedCityComparison[];
  selectedIndustryDisplayNames: Set<string>;
  canFetchMultiCity: boolean;

  // Industries By City Card data
  industriesByCityData: TransformedIndustriesByCity[];
}

/**
 * Hook for managing analytics data and state
 * Uses React Query for data fetching and Zustand for state management
 */
export function useAnalyticsData(): UseAnalyticsDataResult {
  const { theme } = useTheme();
  const currentTheme = (theme || 'light') as 'light' | 'dark';

  // Get state from dashboard store
  const selectedCity = useDashboardStore((state) => state.selectedCity);
  const selectedIndustries = useDashboardStore((state) => state.selectedIndustries);

  // Local state for analytics-specific UI
  const [selectedCities, setSelectedCities] = useState<string[]>(
    selectedCity ? [selectedCity] : [],
  );
  const [pieChartFocusCity, setPieChartFocusCity] = useState<string | null>(null);

  // Update selected cities when store city changes
  useEffect(() => {
    if (selectedCity && !selectedCities.includes(selectedCity)) {
      setSelectedCities((prev) => {
        // Maintain the MAX_SELECTED_CITIES limit
        const cities = [selectedCity, ...prev.filter((city) => city !== selectedCity)];
        return cities.slice(0, MAX_SELECTED_CITIES);
      });
    }
  }, [selectedCity, selectedCities]);

  // Determine if we can fetch multi-city data
  const canFetchMultiCity =
    selectedCities.length > 0 && selectedCities.length <= MAX_SELECTED_CITIES;
  const multiCityQueryParam = canFetchMultiCity ? selectedCities.join(',') : null;

  // City statistics chart query
  const topCitiesQuery = useQuery({
    queryKey: ['analytics', 'topCities'],
    queryFn: () => fetchTopCities(10),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Industry distribution query
  const distributionFetchUrl = useMemo(() => {
    if (selectedCities.length === 1) {
      return selectedCities[0];
    }
    if (selectedCities.length > 1 && pieChartFocusCity) {
      return pieChartFocusCity;
    }
    return null; // Don't fetch if 0 or >1 selected without focus
  }, [selectedCities, pieChartFocusCity]);

  const distributionQuery = useQuery({
    queryKey: ['analytics', 'industryDistribution', distributionFetchUrl],
    queryFn: () => {
      if (!distributionFetchUrl) {
        return Promise.resolve([]);
      }
      return fetchIndustryDistribution(distributionFetchUrl);
    },
    enabled: !!distributionFetchUrl,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Industries by city query
  const industriesByCityQuery = useQuery({
    queryKey: ['analytics', 'industriesByCity', multiCityQueryParam],
    queryFn: () => {
      if (!multiCityQueryParam) {
        return Promise.resolve([]);
      }
      return fetchIndustriesByCity(multiCityQueryParam);
    },
    enabled: !!multiCityQueryParam,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // City comparison query
  const cityComparisonQuery = useQuery({
    queryKey: ['analytics', 'cityComparison', multiCityQueryParam],
    queryFn: () => {
      if (!multiCityQueryParam) {
        return Promise.resolve([]);
      }
      return fetchCityComparison(multiCityQueryParam);
    },
    enabled: !!multiCityQueryParam,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Loading and error states
  const isLoading =
    topCitiesQuery.isLoading ||
    distributionQuery.isLoading ||
    industriesByCityQuery.isLoading ||
    cityComparisonQuery.isLoading;

  const error =
    topCitiesQuery.error ||
    distributionQuery.error ||
    industriesByCityQuery.error ||
    cityComparisonQuery.error ||
    null;

  // Utility functions
  const getIndustryKeyFromName = useCallback((name: string) => {
    const normalizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    return normalizedName || undefined;
  }, []);

  const industryNameMap = useMemo(() => {
    const map = new Map<string, string>();
    map.set('technology', 'Technology');
    map.set('healthcare', 'Healthcare');
    map.set('education', 'Education');
    map.set('manufacturing', 'Manufacturing');
    map.set('other', 'Other');
    return map;
  }, []);

  const potentialOthers = useMemo(() => ['Other', 'Miscellaneous'], []);

  const getThemedIndustryColor = useCallback(
    (name: string, theme: 'light' | 'dark' = currentTheme) => {
      const colors: Record<string, { light: string; dark: string }> = {
        technology: { light: '#4361ee', dark: '#4cc9f0' },
        healthcare: { light: '#f72585', dark: '#ff85a1' },
        education: { light: '#7209b7', dark: '#9d4edd' },
        manufacturing: { light: '#3a0ca3', dark: '#7678ed' },
        other: { light: '#4895ef', dark: '#a5c9f1' },
      };

      const key = getIndustryKeyFromName(name) || 'other';
      return colors[key]?.[theme] || colors.other[theme];
    },
    [currentTheme, getIndustryKeyFromName],
  );

  const onPieFocusChange = useCallback((city: string | null) => {
    setPieChartFocusCity(city);
  }, []);

  // Create selected industry display names
  const selectedIndustryDisplayNames = useMemo(() => {
    return new Set(selectedIndustries.map((ind) => industryNameMap.get(ind) || ind));
  }, [selectedIndustries, industryNameMap]);

  return {
    // Data
    topCitiesData: topCitiesQuery.data || [],
    distributionData: distributionQuery.data || [],
    industriesByCityData: industriesByCityQuery.data || [],
    comparisonData: cityComparisonQuery.data || [],

    // State
    isLoading,
    error,
    currentTheme,
    selectedCities,
    pieChartFocusCity,
    selectedIndustryDisplayNames,
    canFetchMultiCity,

    // Utility functions
    getIndustryKeyFromName,
    potentialOthers,
    industryNameMap,
    getThemedIndustryColor,
    onPieFocusChange,

    // Actions
    setSelectedCities,
  };
}
