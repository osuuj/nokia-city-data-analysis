'use client';

import { Button, Spinner } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

// Smart default URL based on environment
const isProd = process.env.NODE_ENV === 'production';
const PROD_DEFAULT = 'https://api.osuuj.ai';
const DEV_DEFAULT = 'http://localhost:8000';
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || (isProd ? PROD_DEFAULT : DEV_DEFAULT);

const fetcher = async (url: string) => {
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-cache',
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch data from ${url}: ${res.status} ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error(`Failed to fetch from ${url}:`, error);
    throw error;
  }
};

interface DataLoaderProps {
  onDataReady?: () => void;
  children: React.ReactNode;
}

/**
 * DataLoader component
 * Fetches data and shows a loading indicator until data is ready
 * Then renders children
 */
export function DataLoader({ onDataReady, children }: DataLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Set mounted state after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prefetch cities data
  const {
    data: cities,
    error: citiesError,
    mutate: refetchCities,
  } = useSWR<string[]>(mounted ? `${BASE_URL}/api/v1/cities` : null, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 300000, // Cache for 5 minutes
    suspense: false,
    onError: (err) => {
      console.error('Failed to fetch cities:', err);
      setError(err);
    },
  });

  // Prefetch initial company data (using a default city)
  const {
    data: companies,
    error: companiesError,
    mutate: refetchCompanies,
  } = useSWR(mounted ? `${BASE_URL}/api/v1/companies.geojson?city=Helsinki` : null, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000, // Cache for 1 minute
    suspense: false,
    onError: (err) => {
      console.error('Failed to fetch companies:', err);
      setError(err);
    },
  });

  // Check if data is ready
  useEffect(() => {
    if (cities && companies) {
      setIsLoading(false);
      setError(null);
      if (onDataReady) {
        onDataReady();
      }
    }
  }, [cities, companies, onDataReady]);

  // Track errors
  useEffect(() => {
    if (citiesError || companiesError) {
      setError(citiesError || companiesError);
      setIsLoading(false);
    }
  }, [citiesError, companiesError]);

  // Handle retry
  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    refetchCities();
    refetchCompanies();
  };

  // During SSR or before hydration, render a placeholder with the same structure
  if (!mounted) {
    return <div className="hidden">{children}</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="bg-danger-50 dark:bg-danger-900/20 p-4 rounded-lg border border-danger max-w-lg text-center">
          <h3 className="text-danger font-semibold mb-2">Error Loading Data</h3>
          <p className="text-default-700 dark:text-default-400 mb-4">
            {error.message || 'Failed to load essential data. Please try again.'}
          </p>
          <Button color="primary" onPress={handleRetry}>
            Retry
          </Button>
        </div>
      </div>
    );
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
