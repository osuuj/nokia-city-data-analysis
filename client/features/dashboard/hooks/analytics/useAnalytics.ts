import { ApiResponse } from '@/shared/api/types';
import { createQueryKey, useApiQuery } from '@/shared/hooks/useApi';
import { API_ENDPOINTS } from '@shared/api';

// Types
export interface TopCityData {
  city: string;
  count: number;
  companyCount: number;
  industryCount: number;
  averageCompaniesPerIndustry: number;
}

export type PivotedData = Array<Record<string, string | number>>;

export type DistributionItemRaw = {
  name: string;
  value: number;
  others_breakdown?: Array<{ name: string; value: number }>;
};

export type DistributionDataRaw = Array<DistributionItemRaw>;

// Hooks
export const useTopCities = (limit = 10) => {
  return useApiQuery<TopCityData[]>(
    createQueryKey('top-cities', { limit }),
    `${API_ENDPOINTS.ANALYTICS.TOP_CITIES}?limit=${limit}`,
  );
};

export const useIndustryDistribution = (cities: string[]) => {
  const citiesParam = cities.join(',');
  return useApiQuery<DistributionDataRaw>(
    createQueryKey('industry-distribution', { cities }),
    `${API_ENDPOINTS.ANALYTICS.INDUSTRY_DISTRIBUTION}?cities=${encodeURIComponent(citiesParam)}`,
    undefined,
    {
      enabled: cities.length > 0,
    },
  );
};

export const useIndustriesByCity = (cities: string[]) => {
  const citiesParam = cities.join(',');
  return useApiQuery<PivotedData>(
    createQueryKey('industries-by-city', { cities }),
    `${API_ENDPOINTS.ANALYTICS.INDUSTRIES_BY_CITY}?cities=${encodeURIComponent(citiesParam)}`,
    undefined,
    {
      enabled: cities.length > 0 && cities.length <= 5,
    },
  );
};

export const useCityComparison = (cities: string[]) => {
  const citiesParam = cities.join(',');
  return useApiQuery<PivotedData>(
    createQueryKey('city-comparison', { cities }),
    `${API_ENDPOINTS.ANALYTICS.CITY_COMPARISON}?cities=${encodeURIComponent(citiesParam)}`,
    undefined,
    {
      enabled: cities.length > 0 && cities.length <= 5,
    },
  );
};
