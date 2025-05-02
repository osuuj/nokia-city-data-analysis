'use client';

import { useEffect } from 'react';
import useSWR from 'swr';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const fetcher = (url: string) => fetch(url).then((res) => res.json());

/**
 * Preloader component
 * Fetches initial data for the home page when the landing page loads
 * This helps reduce the perceived loading time when navigating to the home page
 */
export function Preloader() {
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

  // Prefetch additional data for other cities to improve initial load
  useEffect(() => {
    if (cities && cities.length > 0) {
      // Prefetch data for the top 3 cities
      const topCities = cities.slice(0, 3);
      for (const city of topCities) {
        if (city !== 'Helsinki') {
          fetch(`${BASE_URL}/api/v1/companies.geojson?city=${encodeURIComponent(city)}`)
            .then((res) => res.json())
            .catch((err) => console.error(`Failed to prefetch data for ${city}:`, err));
        }
      }
    }
  }, [cities]);

  // This component doesn't render anything visible
  return null;
}
