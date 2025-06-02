// client/features/dashboard/hooks/useCompaniesQueryPatches.ts

import { logger } from '@/shared/utils/logger';
import { notifySystemWarning } from '@/shared/utils/notifications';
import { useQuery } from '@tanstack/react-query';
import type { Feature, FeatureCollection, Point } from 'geojson';
import { useState } from 'react';
import { useCompanyStore } from '../store/useCompanyStore';
import { AddressTypeEnum } from '../types/addressTypes';
import type { CompanyProperties } from '../types/business';

interface GeoJSONResponse {
  type: 'FeatureCollection';
  features: Feature<Point, CompanyProperties>[];
  metadata?: {
    total?: number;
    limit: number;
    last_id?: string;
    has_more: boolean;
  };
}

interface FetchProgress {
  total: number;
  fetched: number;
  lastId?: string;
  hasMore: boolean;
}

export async function fetchCompanyPatches(
  city: string,
  onProgress?: (progress: FetchProgress) => void,
): Promise<Feature<Point, CompanyProperties>[]> {
  const allFeatures: Feature<Point, CompanyProperties>[] = [];
  let lastId: string | undefined = undefined;
  let hasMore = true;
  let totalCompanies = 0;
  const processedCompanies = new Set<string>();

  // Use your frontend’s env var (set in .env.local or Vercel) or default to localhost for dev
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

  // Increase patch size to 5000 instead of 1000
  const PATCH_SIZE = 5000;

  while (hasMore) {
    // Build a URL like:
    // https://api.osuuj.ai/api/v1/companies.geojson?city=Helsinki&limit=5000&last_id=xxxxx
    const url = `${baseUrl}/api/v1/companies.geojson?city=${encodeURIComponent(
      city,
    )}&limit=${PATCH_SIZE}${lastId ? `&last_id=${lastId}` : ''}`;

    const res: Response = await fetch(url);
    if (!res.ok) {
      // If the server sends a 429, we pause 2 seconds and retry
      if (res.status === 429) {
        await new Promise((r) => setTimeout(r, 2000));
        continue;
      }
      throw new Error(`Failed to fetch companies for ${city}: ${res.statusText}`);
    }

    const data: GeoJSONResponse = await res.json();

    // On the first batch, record totalCompanies (from metadata or length)
    if (lastId === undefined) {
      totalCompanies = data.metadata?.total || data.features.length;
      logger.info(`Total companies to fetch for ${city}: ${totalCompanies}`);
    }

    // Add each feature to allFeatures, tracking unique business_id
    for (const feature of data.features) {
      const props = feature.properties as CompanyProperties;
      if (!props?.business_id) continue;
      processedCompanies.add(props.business_id);

      const visitingAddress = props.addresses?.[AddressTypeEnum.VISITING];
      const postalAddress = props.addresses?.[AddressTypeEnum.POSTAL];

      const visitCoords =
        visitingAddress?.longitude && visitingAddress?.latitude
          ? ([visitingAddress.longitude, visitingAddress.latitude] as [number, number])
          : null;

      const postalCoords =
        postalAddress?.longitude && postalAddress?.latitude
          ? ([postalAddress.longitude, postalAddress.latitude] as [number, number])
          : null;

      if (visitCoords) {
        allFeatures.push({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: visitCoords },
          properties: { ...props, addressType: AddressTypeEnum.VISITING },
        });
      }

      if (postalCoords && (!visitCoords || visitCoords.join(',') !== postalCoords.join(','))) {
        allFeatures.push({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: postalCoords },
          properties: { ...props, addressType: AddressTypeEnum.POSTAL },
        });
      }
    }

    // Set up for the next iteration
    lastId = data.metadata?.last_id;
    hasMore = data.metadata?.has_more || false;

    // Report progress to the calling hook
    if (onProgress) {
      onProgress({
        total: totalCompanies,
        fetched: processedCompanies.size,
        lastId,
        hasMore,
      });
    }

    // Log at 25%, 50%, 75%, etc.
    const progress = (processedCompanies.size / totalCompanies) * 100;
    if (progress % 25 < 1) {
      logger.info(`Progress for ${city}: ${Math.round(progress)}%`);
    }

    // Wait 500 ms before fetching the next patch.
    // With PATCH_SIZE = 5000, Helsinki (75k rows) becomes 15 patches, ~7.5 s total delay.
    await new Promise((r) => setTimeout(r, 500));
  }

  logger.info(
    `Completed fetching all companies for ${city}. Total companies: ${processedCompanies.size}, Total features: ${allFeatures.length}`,
  );
  return allFeatures;
}

interface UseCompaniesByCityResult {
  data: Feature<Point, CompanyProperties>[];
  isLoading: boolean;
  error: Error | null;
  fetchProgress: number;
}

/**
 * React Query hook that uses fetchCompanyPatches to retrieve all companies for a given city.
 */
export function useCompaniesByCity(city: string): UseCompaniesByCityResult {
  const { setCompanies, resetCompanies } = useCompanyStore();
  const [fetchProgress, setFetchProgress] = useState(0);

  const queryResult = useQuery<Feature<Point, CompanyProperties>[]>({
    queryKey: ['geojson', city],
    queryFn: async () => {
      // Reset the store for a fresh fetch
      resetCompanies();
      setFetchProgress(0);

      // Warn if it’s a large city
      const largeCities = ['Helsinki', 'Espoo', 'Tampere', 'Vantaa', 'Oulu'];
      if (largeCities.includes(city)) {
        notifySystemWarning(
          `Data fetching for ${city} might be slower due to the large number of companies.`,
        );
      }

      // Fetch all patches in sequence
      const features = await fetchCompanyPatches(city, (progress) => {
        const percentage = Math.round((progress.fetched / progress.total) * 100);
        setFetchProgress(percentage);

        if (progress.fetched % 1000 === 0) {
          logger.info(
            `Fetching progress for ${city}: ${progress.fetched}/${progress.total} companies (${percentage}%)`,
          );
        }
      });

      // Update the store with every company’s properties
      const companies = features.map((feature) => feature.properties);
      setCompanies(companies);
      setFetchProgress(100);

      logger.info(`Successfully fetched ${companies.length} companies for ${city}`);
      return features;
    },
    enabled: !!city,
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    data: queryResult.data ?? [],
    isLoading: queryResult.isLoading,
    error: queryResult.error,
    fetchProgress,
  };
}
