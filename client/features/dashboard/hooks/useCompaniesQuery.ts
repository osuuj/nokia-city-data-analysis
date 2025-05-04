import type { CompanyProperties } from '@/features/dashboard/types/business';
import { useQuery } from '@tanstack/react-query';
import type { FeatureCollection, Point } from 'geojson';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

/**
 * fetchCompanies
 * Fetches businesses for the given city from the backend API.
 *
 * @param city - The city name to filter businesses
 * @returns A promise that resolves to an array of CompanyProperties objects
 */
const fetchCompanies = async (city: string): Promise<CompanyProperties[]> => {
  if (!city) {
    console.warn('⚠️ City is empty, skipping fetch.');
    return [];
  }

  console.log('📡 Fetching companies from:', city);

  // Updated to use the same endpoint as the working implementation
  const response = await fetch(
    `${BASE_URL}/api/v1/companies.geojson?city=${encodeURIComponent(city)}`,
    {
      // Add credentials and headers if needed by your backend
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch businesses: ${response.status} ${response.statusText}`);
  }

  const geojsonData = (await response.json()) as FeatureCollection<Point, CompanyProperties>;
  console.log('✅ Companies fetched:', geojsonData);

  // Extract company properties from GeoJSON features
  const companies = geojsonData.features.map((feature) => feature.properties);

  return companies;
};

/**
 * fetchCities
 * Fetches a list of all supported cities from the backend API.
 *
 * @returns A promise that resolves to an array of city names
 */
const fetchCities = async (): Promise<string[]> => {
  console.log('📡 Fetching cities...');
  const response = await fetch(`${BASE_URL}/api/v1/cities`, {
    // Add credentials and headers if needed by your backend
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch cities: ${response.status} ${response.statusText}`);
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
  return useQuery<string[], Error>({
    queryKey: ['cities'],
    queryFn: fetchCities,
    staleTime: 1000 * 60 * 5, // 5 minutes (equivalent to SWR's dedupingInterval of 300000)
    refetchOnWindowFocus: false, // equivalent to SWR's revalidateOnFocus: false
    refetchOnReconnect: false, // equivalent to SWR's revalidateOnReconnect: false
    placeholderData: [], // equivalent to SWR's fallbackData
    keepPreviousData: true, // equivalent to SWR's keepPreviousData
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
  return useQuery<CompanyProperties[], Error>({
    queryKey: ['companies', city],
    queryFn: () => fetchCompanies(city),
    enabled: !!city, // only fetch if a city is selected
    staleTime: 1000 * 60 * 1, // 1 minute (equivalent to SWR's dedupingInterval of 60000)
    refetchOnWindowFocus: false, // equivalent to SWR's revalidateOnFocus: false
    refetchOnReconnect: false, // equivalent to SWR's revalidateOnReconnect: false
    placeholderData: [], // equivalent to SWR's fallbackData
    keepPreviousData: true, // equivalent to SWR's keepPreviousData
  });
}
