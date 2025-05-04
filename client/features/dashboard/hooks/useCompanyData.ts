'use client';

import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { fetchCompanyGeoJSON } from '../services/api';
import { useDashboardStore } from '../store/useDashboardStore';

/**
 * Custom hook for fetching company data using React Query
 * Uses the selected city from the dashboard store
 * Returns GeoJSON data for companies
 */
export function useCompanyData() {
  // Get the selected city from the dashboard store
  const selectedCity = useDashboardStore((state) => state.selectedCity);
  const setDataLoading = useDashboardStore((state) => state.setDataLoading);

  // Use React Query to fetch data based on selected city
  const result = useQuery({
    queryKey: ['companies', selectedCity],
    queryFn: () => fetchCompanyGeoJSON(selectedCity),
    enabled: !!selectedCity, // Only run the query if we have a city selected
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: false,
    retry: 2,
    refetchInterval: false,
  });

  // Update loading state in the store
  const { isLoading, isFetching } = result;

  React.useEffect(() => {
    setDataLoading(isLoading || isFetching);

    return () => {
      setDataLoading(false);
    };
  }, [isLoading, isFetching, setDataLoading]);

  return result;
}
