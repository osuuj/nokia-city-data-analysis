'use client';

import type {
  TopCityData,
  TransformedCityComparison,
  TransformedDistribution,
  TransformedIndustriesByCity,
} from '@/features/dashboard/types/analytics';
import {
  getIndustryKeyFromName,
  getStandardIndustryName,
  getThemedIndustryColor,
  isOtherIndustry,
} from '@/features/dashboard/utils/theme';
import { useCallback, useMemo, useState } from 'react';

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
  industryNameMap: Map<string, string>;
  getThemedColor: (name: string) => string;
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
 * Centralizes the analytics data handling logic for use in the AnalyticsView component
 */
export function useAnalyticsData(): UseAnalyticsDataResult {
  const [isLoading] = useState(false);
  const [error] = useState<Error | null>(null);
  const [currentTheme] = useState<'light' | 'dark'>('light');

  // Top Cities data
  const topCitiesData = useMemo<TopCityData[]>(() => [], []);

  // Industry Distribution data
  const distributionData = useMemo<TransformedDistribution[]>(() => [], []);
  const [selectedCities] = useState<string[]>(['Helsinki', 'Tampere']);
  const [pieChartFocusCity, setPieChartFocusCity] = useState<string | null>('Helsinki');

  // City Comparison data
  const comparisonData = useMemo<TransformedCityComparison[]>(() => [], []);
  const [selectedIndustryDisplayNames] = useState<Set<string>>(
    new Set(['Technology', 'Healthcare']),
  );
  const canFetchMultiCity = true;

  // Industries By City data
  const industriesByCityData = useMemo<TransformedIndustriesByCity[]>(() => [], []);

  // Industry name mapping
  const industryNameMap = useMemo(() => {
    const map = new Map<string, string>();
    map.set('technology', 'Technology');
    map.set('healthcare', 'Healthcare');
    map.set('education', 'Education');
    map.set('manufacturing', 'Manufacturing');
    map.set('other', 'Other');
    return map;
  }, []);

  // Get themed color for an industry
  const getThemedColor = useCallback(
    (name: string) => getThemedIndustryColor(name, currentTheme),
    [currentTheme],
  );

  // Handle pie chart focus change
  const onPieFocusChange = useCallback((city: string | null) => {
    setPieChartFocusCity(city);
  }, []);

  return {
    isLoading,
    error,
    currentTheme,
    topCitiesData,
    distributionData,
    industryNameMap,
    getThemedColor,
    selectedCities,
    pieChartFocusCity,
    onPieFocusChange,
    comparisonData,
    selectedIndustryDisplayNames,
    canFetchMultiCity,
    industriesByCityData,
  };
}
