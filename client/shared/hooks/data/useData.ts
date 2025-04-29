import { useQuery } from '@tanstack/react-query';

// Base API URL - this should come from environment variables in production
const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Default fetcher function
const fetchData = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
};

interface DataFetcherOptions {
  enabled?: boolean;
  staleTime?: number;
  refetchOnWindowFocus?: boolean;
  refetchInterval?: number | false;
  retry?: boolean | number;
}

export function useCities(options: DataFetcherOptions = {}) {
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus = false,
    refetchInterval = false,
    retry = 1,
  } = options;

  return useQuery({
    queryKey: ['cities'],
    queryFn: () => fetchData<string[]>(`${BASE_API_URL}/cities`),
    enabled,
    staleTime,
    refetchOnWindowFocus,
    refetchInterval,
    retry,
  });
}

export function useCompaniesByCity(city: string | null, options: DataFetcherOptions = {}) {
  const {
    staleTime = 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus = false,
    refetchInterval = false,
    retry = 1,
  } = options;

  return useQuery({
    queryKey: ['companies', city],
    queryFn: () => fetchData(`${BASE_API_URL}/companies?city=${encodeURIComponent(city || '')}`),
    enabled: !!city, // Only fetch when city is provided
    staleTime,
    refetchOnWindowFocus,
    refetchInterval,
    retry,
  });
}

export function useGeoJsonByCity(city: string | null, options: DataFetcherOptions = {}) {
  const {
    staleTime = 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus = false,
    refetchInterval = false,
    retry = 1,
  } = options;

  return useQuery({
    queryKey: ['geojson', city],
    queryFn: () =>
      fetchData(`${BASE_API_URL}/companies.geojson?city=${encodeURIComponent(city || '')}`),
    enabled: !!city, // Only fetch when city is provided
    staleTime,
    refetchOnWindowFocus,
    refetchInterval,
    retry,
  });
}

export function useCityStats(city: string | null, options: DataFetcherOptions = {}) {
  const {
    staleTime = 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus = false,
    refetchInterval = false,
    retry = 1,
  } = options;

  return useQuery({
    queryKey: ['stats', 'city', city],
    queryFn: () => fetchData(`${BASE_API_URL}/stats/city/${encodeURIComponent(city || '')}`),
    enabled: !!city, // Only fetch when city is provided
    staleTime,
    refetchOnWindowFocus,
    refetchInterval,
    retry,
  });
}

// Generic data fetcher for any endpoint
export function useData<T>(
  endpoint: string | null,
  queryKey: unknown[],
  options: DataFetcherOptions = {},
) {
  const {
    staleTime = 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus = false,
    refetchInterval = false,
    retry = 1,
  } = options;

  return useQuery({
    queryKey,
    queryFn: () => fetchData<T>(`${BASE_API_URL}/${endpoint}`),
    enabled: !!endpoint, // Only fetch when endpoint is provided
    staleTime,
    refetchOnWindowFocus,
    refetchInterval,
    retry,
  });
}
