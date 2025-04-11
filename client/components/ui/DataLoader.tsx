'use client';

import { Spinner } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const fetcher = (url: string) => fetch(url).then((res) => res.json());

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
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [dataReady, setDataReady] = useState(false);

  // Prefetch cities data
  const { data: cities } = useSWR<string[]>(`${BASE_URL}/api/v1/cities`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 300000, // Cache for 5 minutes
    suspense: false,
  });

  // Prefetch initial company data (using a default city)
  const { data: companies } = useSWR(
    `${BASE_URL}/api/v1/companies.geojson?city=Helsinki`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // Cache for 1 minute
      suspense: false,
    },
  );

  // Check if data is ready
  useEffect(() => {
    if (cities && companies) {
      setDataReady(true);
      setIsLoading(false);
      if (onDataReady) {
        onDataReady();
      }
    }
  }, [cities, companies, onDataReady]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Spinner size="lg" color="primary" />
        <p className="mt-4 text-default-600">Loading data...</p>
      </div>
    );
  }

  return <>{children}</>;
}
