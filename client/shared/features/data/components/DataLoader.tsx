'use client';

import {
  useFetchCities,
  useFetchCompanies,
} from '@/features/dashboard/hooks/data/useCompaniesQuery';
import { Spinner } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Props for the DataLoader component
 */
export interface DataLoaderProps {
  /** Optional callback function to be called when data is ready */
  onDataReady?: () => void;
  /** The content to render when data is loaded */
  children: React.ReactNode;
}

/**
 * DataLoader Component
 *
 * Fetches data and shows a loading indicator until data is ready.
 * Then renders children when data is available.
 *
 * @example
 * <DataLoader>
 *   <YourComponent />
 * </DataLoader>
 *
 * @example
 * <DataLoader onDataReady={() => console.log('Data is ready!')}>
 *   <YourComponent />
 * </DataLoader>
 */
export function DataLoader({ onDataReady, children }: DataLoaderProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Set mounted state after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prefetch cities and companies data using React Query
  const { data: cities, isLoading: citiesLoading } = useFetchCities();
  const { data: companies, isLoading: companiesLoading } = useFetchCompanies('Helsinki');

  const isLoading = citiesLoading || companiesLoading;
  const dataReady = !isLoading && cities && companies;

  // Notify parent when data is ready
  useEffect(() => {
    if (dataReady && onDataReady) {
      onDataReady();
    }
  }, [dataReady, onDataReady]);

  // During SSR or before hydration, render a placeholder with the same structure
  if (!mounted) {
    return <div className="hidden">{children}</div>;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Spinner size="lg" color="primary" aria-label="Loading" />
        <p className="mt-4 text-default-600">Loading data...</p>
      </div>
    );
  }

  return <>{children}</>;
}
