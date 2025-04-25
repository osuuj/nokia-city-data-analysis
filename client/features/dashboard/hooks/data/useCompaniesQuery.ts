import type { Business } from '@/features/dashboard/types';
import { API_ENDPOINTS } from '@shared/api';
import apiClient from '@shared/api';
import { createQueryKey, useApiQuery } from '@shared/hooks/api';

/**
 * fetchCompanies
 * Fetches businesses for the given city from the backend API.
 *
 * @param city - The city name to filter businesses
 * @returns A promise that resolves to an array of Business objects
 */
const fetchCompanies = async (city: string): Promise<Business[]> => {
  if (!city) {
    console.warn('⚠️ City is empty, skipping fetch.');
    return [];
  }

  console.log('📡 Fetching companies from:', city);
  try {
    const response = await apiClient.get<Business[]>(API_ENDPOINTS.COMPANIES.LIST, {
      params: { city },
    });
    console.log('✅ Companies fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to fetch businesses:', error);
    throw error;
  }
};

/**
 * fetchCities
 * Fetches a list of all supported cities from the backend API.
 *
 * @returns A promise that resolves to an array of city names
 */
const fetchCities = async (): Promise<string[]> => {
  console.log('📡 Fetching cities...');
  try {
    const response = await apiClient.get<string[]>(API_ENDPOINTS.CITIES.LIST);
    console.log('✅ Cities fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to fetch cities:', error);
    throw error;
  }
};

/**
 * useFetchCities
 * React Query hook to fetch available cities.
 *
 * @returns { data, error, isLoading }
 */
export function useFetchCities() {
  return useApiQuery<string[]>('cities', API_ENDPOINTS.CITIES.LIST, undefined, {
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * useFetchCompanies
 * React Query hook to fetch businesses by selected city.
 *
 * @param city - Selected city name
 * @returns { data, error, isLoading }
 */
export function useFetchCompanies(city: string) {
  return useApiQuery<Business[]>(
    createQueryKey('companies', city),
    API_ENDPOINTS.COMPANIES.LIST,
    {
      params: { city },
    },
    {
      enabled: !!city, // only fetch if a city is selected
    },
  );
}
