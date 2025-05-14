'use client';

import { Button, Spinner } from '@heroui/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

// Smart default URL based on environment
const isProd = process.env.NODE_ENV === 'production';
const PROD_DEFAULT = 'https://api.osuuj.ai';
const DEV_DEFAULT = 'http://localhost:8000';
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || (isProd ? PROD_DEFAULT : DEV_DEFAULT);

/**
 * Fetcher function for API requests
 */
const fetchData = async (url: string) => {
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-cache',
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error(`Failed to fetch from ${url}:`, error);
    throw error;
  }
};

/**
 * Custom hook to fetch and cache cities data
 */
export const useCitiesData = (enabled = true) => {
  return useQuery({
    queryKey: ['cities'],
    queryFn: () => fetchData(`${BASE_URL}/api/v1/cities`),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    enabled,
  });
};

/**
 * Custom hook to fetch and cache company data for a specific city
 */
export const useCompanyData = (city: string, enabled = true) => {
  return useQuery({
    queryKey: ['companies', 'geojson', city],
    queryFn: () =>
      fetchData(
        `${BASE_URL}/api/v1/geojson_companies/companies.geojson?city=${encodeURIComponent(city)}`,
      ),
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    enabled,
  });
};

/**
 * Hook to prefetch data for multiple cities
 */
export const usePrefetchData = (citiesToPrefetch: string[] = []) => {
  const queryClient = useQueryClient();
  const { data: cities } = useCitiesData();

  useEffect(() => {
    // If specific cities are provided, prefetch those
    if (citiesToPrefetch.length > 0) {
      for (const city of citiesToPrefetch) {
        queryClient.prefetchQuery({
          queryKey: ['companies', 'geojson', city],
          queryFn: () =>
            fetchData(
              `${BASE_URL}/api/v1/geojson_companies/companies.geojson?city=${encodeURIComponent(city)}`,
            ),
          staleTime: 60 * 1000,
        });
      }
      return;
    }

    // Otherwise, if we have the list of cities, prefetch the top 3
    if (cities && cities.length > 0) {
      const topCities = cities.slice(0, 3);
      for (const city of topCities) {
        queryClient.prefetchQuery({
          queryKey: ['companies', 'geojson', city],
          queryFn: () =>
            fetchData(
              `${BASE_URL}/api/v1/geojson_companies/companies.geojson?city=${encodeURIComponent(city)}`,
            ),
          staleTime: 60 * 1000,
        });
      }
    }
  }, [cities, citiesToPrefetch, queryClient]);
};

interface DataManagerProps {
  children: React.ReactNode;
  showLoadingUI?: boolean;
  prefetch?: boolean;
  prefetchCities?: string[];
  onDataReady?: () => void;
  loadingMessage?: string;
  loadingComponent?: React.ReactNode;
}

/**
 * DataManager component
 * Unified solution that can:
 * 1. Prefetch data in the background (like DataPrefetcher)
 * 2. Show loading UI when needed (like DataLoader)
 * 3. Provide error handling with retry functionality
 *
 * @example
 * // Just prefetch data with no UI
 * <DataManager prefetch={true} showLoadingUI={false}>
 *   <YourComponent />
 * </DataManager>
 *
 * @example
 * // Show loading UI until data is ready
 * <DataManager showLoadingUI={true} onDataReady={() => console.log('Data ready!')}>
 *   <Dashboard />
 * </DataManager>
 */
export function DataManager({
  children,
  showLoadingUI = true,
  prefetch = false,
  prefetchCities = [],
  onDataReady,
  loadingMessage = 'Loading data...',
  loadingComponent,
}: DataManagerProps) {
  const [mounted, setMounted] = useState(false);

  // Set mounted state after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch essential data
  const {
    data: cities,
    error: citiesError,
    isLoading: isCitiesLoading,
    refetch: refetchCities,
  } = useCitiesData(mounted);

  const {
    data: helsinkiCompanies,
    error: companiesError,
    isLoading: isCompaniesLoading,
    refetch: refetchCompanies,
  } = useCompanyData('Helsinki', mounted);

  // Prefetch additional cities if requested
  if (prefetch && mounted) {
    usePrefetchData(prefetchCities);
  }

  // Notify when data is ready
  useEffect(() => {
    if (cities && helsinkiCompanies && onDataReady) {
      onDataReady();
    }
  }, [cities, helsinkiCompanies, onDataReady]);

  // Handle loading state
  const isLoading = isCitiesLoading || isCompaniesLoading;

  // Handle errors
  const error = citiesError || companiesError;

  // During SSR or before hydration, render a placeholder
  if (!mounted) {
    return <div className="hidden">{children}</div>;
  }

  // If not showing loading UI, render children immediately even while loading
  if (!showLoadingUI) {
    return <>{children}</>;
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="bg-danger-50 dark:bg-danger-900/20 p-4 rounded-lg border border-danger max-w-lg text-center">
          <h3 className="text-danger font-semibold mb-2">Error Loading Data</h3>
          <p className="text-default-700 dark:text-default-400 mb-4">
            {error.message || 'Failed to load essential data. Please try again.'}
          </p>
          <Button
            color="primary"
            onPress={() => {
              refetchCities();
              refetchCompanies();
            }}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Handle loading state
  if (isLoading) {
    if (loadingComponent) {
      return <>{loadingComponent}</>;
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Spinner size="lg" color="primary" aria-label="Loading" />
        <p className="mt-4 text-default-600">{loadingMessage}</p>
      </div>
    );
  }

  // Data loaded successfully
  return <>{children}</>;
}
