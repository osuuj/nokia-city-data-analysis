import { useCallback, useState } from 'react';
import { useCompanyStore } from '../store/useCompanyStore';

interface GeoJSONPoint {
  type: 'Point';
  coordinates: [number, number];
}

interface GeoJSONFeature {
  type: 'Feature';
  geometry: GeoJSONPoint;
  properties: {
    id: string;
    name: string;
    [key: string]: unknown;
  };
}

interface GeojsonBatch {
  features: GeoJSONFeature[];
  metadata: {
    has_more: boolean;
    last_id?: string;
    total?: number;
  };
}

interface LoaderError {
  message: string;
  status?: number;
  retryable: boolean;
}

/**
 * Hook for progressively loading GeoJSON data in batches
 *
 * @param city - The city to load data for
 * @returns Object containing loading state and control functions
 */
export const useProgressiveGeojsonLoader = (city: string) => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<LoaderError | null>(null);
  const setCompanies = useCompanyStore((state) => state.setCompanies);

  const fetchWithRetry = useCallback(
    async (url: string, retries = 3, delay = 1000): Promise<Response> => {
      try {
        console.log('Fetching URL:', url); // Debug log
        const response = await fetch(url);

        if (!response.ok) {
          const error: LoaderError = {
            message: `HTTP error! status: ${response.status}`,
            status: response.status,
            retryable: response.status >= 500 || response.status === 429,
          };

          if (error.retryable && retries > 0) {
            console.log(`Retrying request (${retries} attempts left)...`); // Debug log
            await new Promise((resolve) => setTimeout(resolve, delay));
            return fetchWithRetry(url, retries - 1, delay * 2);
          }

          throw error;
        }

        return response;
      } catch (e) {
        const error: LoaderError = {
          message: e instanceof Error ? e.message : 'Unknown error occurred',
          retryable: retries > 0,
        };

        if (error.retryable) {
          console.log(`Retrying request after error (${retries} attempts left)...`); // Debug log
          await new Promise((resolve) => setTimeout(resolve, delay));
          return fetchWithRetry(url, retries - 1, delay * 2);
        }

        throw error;
      }
    },
    [],
  );

  const load = useCallback(async () => {
    setIsLoading(true);
    setIsComplete(false);
    setProgress(0);
    setError(null);

    const allFeatures: GeoJSONFeature[] = [];
    let lastId: string | undefined = undefined;
    let total = 0;
    let hasMore = true;

    try {
      while (hasMore) {
        // Ensure proper URL encoding of the city name
        const encodedCity = encodeURIComponent(city);
        console.log('Original city:', city); // Debug log
        console.log('Encoded city:', encodedCity); // Debug log

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const url = `${baseUrl}/api/v1/companies.geojson?city=${encodedCity}&limit=1000${lastId ? `&last_id=${lastId}` : ''}`;
        const res = await fetchWithRetry(url);
        const data: GeojsonBatch = await res.json();

        allFeatures.push(...data.features);
        lastId = data.metadata.last_id;
        hasMore = data.metadata.has_more;

        if (data.metadata.total) total = data.metadata.total;

        setProgress(Math.round((allFeatures.length / (total || 1)) * 100));
        setCompanies(allFeatures); // Update your Zustand store incrementally

        await new Promise((resolve) => setTimeout(resolve, 50)); // Throttle requests
      }

      setIsComplete(true);
    } catch (e) {
      const error: LoaderError = {
        message: e instanceof Error ? e.message : 'Unknown error occurred',
        retryable: true,
      };
      setError(error);
      console.error('Progressive loader error:', e);
    } finally {
      setIsLoading(false);
    }
  }, [city, setCompanies, fetchWithRetry]);

  return {
    load,
    isLoading,
    isComplete,
    progress,
    error,
  };
};
