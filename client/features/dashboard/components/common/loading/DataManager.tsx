'use client';

import { useCities, useCompanies } from '@/shared/hooks/api/useData';
import { usePrefetchData } from '@/shared/hooks/api/usePrefetchData';
import { Button, Spinner } from '@heroui/react';
import { useEffect, useState } from 'react';

// Removing redundant hooks:
// - useCitiesData
// - useCompanyData
// - usePrefetchData (now imported from shared hooks)

interface DataManagerProps {
  children: React.ReactNode;
  showLoadingUI?: boolean;
  prefetchCityList?: boolean;
  prefetchCompanyData?: boolean; // More explicit prefetch controls
  prefetchCities?: string[];
  onDataReady?: () => void;
  loadingMessage?: string;
  loadingComponent?: React.ReactNode;
  prefetchDelay?: number; // New prop for delayed prefetching
}

/**
 * DataManager component
 * Unified solution that can:
 * 1. Prefetch data in the background (like DataPrefetcher)
 * 2. Show loading UI when needed (like DataLoader)
 * 3. Provide error handling with retry functionality
 *
 * @example
 * // Just prefetch city list with no UI
 * <DataManager prefetchCityList={true} showLoadingUI={false}>
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
  prefetchCityList = true,
  prefetchCompanyData = false, // Disabled by default to prevent navigation issues
  prefetchCities = [],
  onDataReady,
  loadingMessage = 'Loading data...',
  loadingComponent,
  prefetchDelay = 0, // Default to no delay
}: DataManagerProps) {
  const [mounted, setMounted] = useState(false);
  const [shouldPrefetch, setShouldPrefetch] = useState(!prefetchDelay); // Start prefetching immediately if no delay

  // Set mounted state after hydration
  useEffect(() => {
    setMounted(true);

    // If there's a prefetch delay, set up a timer
    if (prefetchDelay > 0) {
      const timer = setTimeout(() => {
        setShouldPrefetch(true);
      }, prefetchDelay);

      return () => clearTimeout(timer);
    }
  }, [prefetchDelay]);

  // Fetch essential data using centralized hooks directly
  const {
    data: cities,
    error: citiesError,
    isLoading: isCitiesLoading,
    refetch: refetchCities,
  } = useCities();

  // Only fetch Helsinki companies if prefetchCompanyData is true
  const {
    data: helsinkiCompanies,
    error: companiesError,
    isLoading: isCompaniesLoading,
    refetch: refetchCompanies,
  } = useCompanies('Helsinki', mounted && prefetchCompanyData);

  // Use the shared prefetch hook with more conservative settings
  usePrefetchData({
    prefetchCityList: prefetchCityList && !cities, // Only prefetch cities if not already fetching
    prefetchCompanyData, // Explicit opt-in to company data prefetching
    citiesToPrefetch: prefetchCompanyData
      ? prefetchCities.length > 0
        ? prefetchCities
        : ['Helsinki']
      : [],
    shouldPrefetch: mounted && shouldPrefetch,
  });

  // Notify when data is ready - more flexible based on what we're fetching
  useEffect(() => {
    if (!onDataReady) return;

    // If we're only fetching/showing city data
    if (!prefetchCompanyData && cities) {
      onDataReady();
      return;
    }

    // If we're fetching both city and company data
    if (prefetchCompanyData && cities && helsinkiCompanies) {
      onDataReady();
    }
  }, [cities, helsinkiCompanies, onDataReady, prefetchCompanyData]);

  // Handle loading state - only consider company loading if we're fetching it
  const isLoading = isCitiesLoading || (prefetchCompanyData && isCompaniesLoading);

  // Handle errors - only consider company errors if we're fetching it
  const error = citiesError || (prefetchCompanyData ? companiesError : null);

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
              if (prefetchCompanyData) {
                refetchCompanies();
              }
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
