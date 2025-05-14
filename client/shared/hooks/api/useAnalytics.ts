'use client';

import { useApiQuery } from './useReactQuery';

// Smart default URL based on environment
const isProd = process.env.NODE_ENV === 'production';
const PROD_DEFAULT = 'https://api.osuuj.ai';
const DEV_DEFAULT = 'http://localhost:8000';
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || (isProd ? PROD_DEFAULT : DEV_DEFAULT);

// Type definitions
export interface TopCityData {
  city: string;
  count: number;
}

export type DistributionItemRaw = {
  name: string;
  value: number;
  others_breakdown?: Array<{ name: string; value: number }>;
};

export type DistributionDataRaw = Array<DistributionItemRaw>;

// Type for data coming from /industries-by-city and /city-comparison
export type PivotedData = Array<Record<string, string | number>>;

/**
 * Hook for fetching industry distribution data for a city
 *
 * @param city The city to fetch data for
 * @returns Distribution data and query state
 */
export function useIndustryDistribution(city: string | null) {
  return useApiQuery<DistributionDataRaw>(
    ['industryDistribution', city],
    async () => {
      if (!city) return [];

      const response = await fetch(
        `${BASE_URL}/api/v1/analytics/industry-distribution?cities=${encodeURIComponent(city)}`,
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch industry distribution: ${response.status}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
    {
      enabled: !!city,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  );
}

/**
 * Hook for fetching industries by city data
 *
 * @param cities Array of cities to fetch data for
 * @returns Industries by city data and query state
 */
export function useIndustriesByCity(cities: string[]) {
  const citiesParam = cities.join(',');

  return useApiQuery<PivotedData>(
    ['industriesByCity', citiesParam],
    async () => {
      if (!cities.length) return [];

      const response = await fetch(
        `${BASE_URL}/api/v1/analytics/industries-by-city?cities=${encodeURIComponent(citiesParam)}`,
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch industries by city: ${response.status}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
    {
      enabled: cities.length > 0 && cities.length <= 5,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  );
}

/**
 * Hook for fetching city comparison data
 *
 * @param cities Array of cities to compare
 * @returns City comparison data and query state
 */
export function useCityComparison(cities: string[]) {
  const citiesParam = cities.join(',');

  return useApiQuery<PivotedData>(
    ['cityComparison', citiesParam],
    async () => {
      if (!cities.length) return [];

      const response = await fetch(
        `${BASE_URL}/api/v1/analytics/city-comparison?cities=${encodeURIComponent(citiesParam)}`,
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch city comparison: ${response.status}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
    {
      enabled: cities.length > 0 && cities.length <= 5,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  );
}

/**
 * Hook for fetching top cities data
 *
 * @returns Top cities data and query state
 */
export function useTopCities() {
  return useApiQuery<TopCityData[]>(
    ['topCities'],
    async () => {
      const response = await fetch(`${BASE_URL}/api/v1/analytics/top-cities`);

      if (!response.ok) {
        throw new Error(`Failed to fetch top cities: ${response.status}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    },
  );
}
