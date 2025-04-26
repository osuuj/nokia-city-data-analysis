'use client';

import {
  useFetchCities,
  useFetchCompanies,
} from '@/features/dashboard/hooks/data/useCompaniesQuery';
import { API_ENDPOINTS } from '@/shared/api/endpoints';
import { ApiResponse } from '@/shared/api/types';
import { createQueryKey } from '@/shared/hooks/api';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

/**
 * Preloader component
 * Fetches initial data for the home page when the landing page loads
 * This helps reduce the perceived loading time when navigating to the home page
 */
export function Preloader() {
  const queryClient = useQueryClient();

  // Prefetch cities and initial companies data
  const { data: citiesResponse } = useFetchCities();
  const { data: companies } = useFetchCompanies('Helsinki');

  const cities = citiesResponse?.data;

  // Prefetch additional data for other cities to improve initial load
  useEffect(() => {
    if (cities && cities.length > 0) {
      // Prefetch data for the top 3 cities
      const topCities = cities.slice(0, 3);
      for (const city of topCities) {
        if (city !== 'Helsinki') {
          const queryKey = createQueryKey(API_ENDPOINTS.COMPANIES.LIST, {
            city,
          });
          queryClient.prefetchQuery({
            queryKey,
            queryFn: () =>
              fetch(`${API_ENDPOINTS.COMPANIES.LIST}?city=${encodeURIComponent(city)}`).then(
                (res) => res.json(),
              ),
            staleTime: 60000, // Cache for 1 minute
          });
        }
      }
    }
  }, [cities, queryClient]);

  // This component doesn't render anything visible
  return null;
}
