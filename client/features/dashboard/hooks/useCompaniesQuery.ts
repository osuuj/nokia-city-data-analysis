import type { Business } from '@/features/dashboard/types';
import { API_ENDPOINTS } from '@shared/api';
import { createQueryKey, useApiQuery } from '@shared/hooks/useApi';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

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
  const response = await fetch(
    `${BASE_URL}/api/v1/businesses_by_city?city=${encodeURIComponent(city)}`,
  );

  if (!response.ok) {
    throw new Error('Failed to fetch businesses');
  }

  const data = await response.json();
  console.log('✅ Companies fetched:', data);

  return Array.isArray(data) ? data : [];
};

/**
 * fetchCities
 * Fetches a list of all supported cities from the backend API.
 *
 * @returns A promise that resolves to an array of city names
 */
const fetchCities = async (): Promise<string[]> => {
  console.log('📡 Fetching cities...');
  const response = await fetch(`${BASE_URL}/api/v1/cities`);

  if (!response.ok) {
    throw new Error('Failed to fetch cities');
  }

  const cities = await response.json();
  console.log('✅ Cities fetched:', cities);
  return cities;
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
