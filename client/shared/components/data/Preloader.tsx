'use client';

import { API_ENDPOINTS } from '@/shared/api/endpoints';
import { createQueryKey } from '@/shared/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { type FC, useEffect } from 'react';

// Define interface for city data
interface City {
  id: string;
  name: string;
  country: string;
  population?: number;
}

/**
 * Preloader component for fetching initial data without rendering anything visible
 * This helps with loading data for the home page in the background
 */
const Preloader: FC = () => {
  const queryClient = useQueryClient();

  // Prefetch cities and initial data
  useEffect(() => {
    const prefetchData = async () => {
      try {
        // Fetch all cities
        const citiesResponse = await fetch(API_ENDPOINTS.CITIES);
        const citiesData: City[] = await citiesResponse.json();

        if (citiesData && Array.isArray(citiesData)) {
          // Get Helsinki data (most commonly viewed)
          const helsinkiCity = citiesData.find(
            (city: City) => city.name.toLowerCase() === 'helsinki',
          );

          // Get top 3 cities (excluding Helsinki)
          const topCities = citiesData
            .filter((city: City) => city.name.toLowerCase() !== 'helsinki')
            .slice(0, 3);

          // Prefetch Helsinki data
          if (helsinkiCity) {
            // Prefetch city data
            queryClient.prefetchQuery({
              queryKey: createQueryKey('city', helsinkiCity.id),
              queryFn: () =>
                fetch(`${API_ENDPOINTS.CITIES}/${helsinkiCity.id}`).then((res) => res.json()),
            });

            // Prefetch companies data
            queryClient.prefetchQuery({
              queryKey: createQueryKey('companies', { city: helsinkiCity.id }),
              queryFn: () =>
                fetch(`${API_ENDPOINTS.COMPANIES}?city=${helsinkiCity.id}`).then((res) =>
                  res.json(),
                ),
            });
          }

          // Prefetch data for top cities
          for (const city of topCities) {
            // Prefetch city data
            queryClient.prefetchQuery({
              queryKey: createQueryKey('city', city.id),
              queryFn: () => fetch(`${API_ENDPOINTS.CITIES}/${city.id}`).then((res) => res.json()),
            });

            // Prefetch companies data
            queryClient.prefetchQuery({
              queryKey: createQueryKey('companies', { city: city.id }),
              queryFn: () =>
                fetch(`${API_ENDPOINTS.COMPANIES}?city=${city.id}`).then((res) => res.json()),
            });
          }
        }
      } catch (error) {
        console.error('Error prefetching data:', error);
      }
    };

    prefetchData();
  }, [queryClient]);

  // This component doesn't render anything visible
  return null;
};

export default Preloader;
