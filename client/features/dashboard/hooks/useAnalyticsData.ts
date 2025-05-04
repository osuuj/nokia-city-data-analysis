'use client';

import type {
  TopCityData,
  TransformedCityComparison,
  TransformedDistribution,
  TransformedIndustriesByCity,
} from '@/features/dashboard/types/analytics';
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

  return {
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
  };
}
