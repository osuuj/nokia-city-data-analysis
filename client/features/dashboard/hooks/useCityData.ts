'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchCities } from '../services/api';

/**
 * Custom hook for fetching city data using React Query
 * Optimized with caching and stale time
 */
export function useCityData() {
  return useQuery({
    queryKey: ['cities'],
    queryFn: fetchCities,
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 3,
    refetchInterval: false,
  });
}
