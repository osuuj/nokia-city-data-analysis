import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

// Smart default URL - consider moving to a shared constants file
const isProd = process.env.NODE_ENV === 'production';
const PROD_DEFAULT = 'https://api.osuuj.ai';
const DEV_DEFAULT = 'http://localhost:8000';
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || (isProd ? PROD_DEFAULT : DEV_DEFAULT);

interface PrefetchOptions {
  prefetchCityList?: boolean;
  prefetchCompanyData?: boolean;
  citiesToPrefetch?: string[];
  shouldPrefetch?: boolean;
  abortSignal?: AbortSignal;
}

/**
 * Optimized hook to selectively prefetch data
 * - City list (small payload): Prefetch by default
 * - Company data: Only prefetch for specified cities (default Helsinki)
 * - Supports abort signals to cancel requests when navigating away
 */
export const usePrefetchData = ({
  prefetchCityList = true,
  prefetchCompanyData = false,
  citiesToPrefetch = ['Helsinki'],
  shouldPrefetch = true,
  abortSignal,
}: PrefetchOptions = {}) => {
  const queryClient = useQueryClient();

  // Prefetch the city list (small payload)
  useEffect(() => {
    if (shouldPrefetch && prefetchCityList) {
      console.debug('🔄 Prefetching city list in background');
      queryClient.prefetchQuery({
        queryKey: ['cities'],
        queryFn: async () => {
          const response = await fetch(`${BASE_URL}/api/v1/cities`, {
            signal: abortSignal,
          });
          if (!response.ok) throw new Error(`Failed to fetch cities: ${response.status}`);
          const data = await response.json();
          console.debug(`✅ Successfully prefetched ${data.length} cities in background`);
          return data;
        },
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      });
    }
  }, [queryClient, shouldPrefetch, prefetchCityList, abortSignal]);

  // Prefetch company data only if explicitly requested
  useEffect(() => {
    if (shouldPrefetch && prefetchCompanyData && citiesToPrefetch.length > 0) {
      // Only prefetch for specified cities (default just Helsinki)
      for (const city of citiesToPrefetch) {
        console.debug(`🔄 Prefetching company data for ${city} in background`);
        queryClient.prefetchQuery({
          queryKey: ['companies', 'geojson', city],
          queryFn: async () => {
            const response = await fetch(
              `${BASE_URL}/api/v1/companies.geojson?city=${encodeURIComponent(city)}`,
              { signal: abortSignal },
            );
            if (!response.ok) throw new Error(`Failed to fetch data: ${response.status}`);
            const data = await response.json();
            const companyCount = data?.features?.length || 0;
            console.debug(
              `✅ Successfully prefetched ${companyCount} companies for ${city} in background`,
            );
            return data;
          },
          staleTime: 60 * 1000,
        });
      }
    }
  }, [citiesToPrefetch, queryClient, shouldPrefetch, prefetchCompanyData, abortSignal]);
};
