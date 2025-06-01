import { logger } from '@/shared/utils/logger';
import { notifySystemWarning } from '@/shared/utils/notifications';
import { useQuery } from '@tanstack/react-query';
import type { Feature, FeatureCollection, Point } from 'geojson';
import { useCompanyStore } from '../store/useCompanyStore';
import { AddressTypeEnum } from '../types/addressTypes';
import type { CompanyProperties } from '../types/business';

interface GeoJSONResponse {
  type: 'FeatureCollection';
  features: Feature<Point, CompanyProperties>[];
  metadata: {
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

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

  while (hasMore) {
    const url: string = `${baseUrl}/api/v1/companies.geojson?city=${encodeURIComponent(city)}&limit=1000${lastId ? `&last_id=${lastId}` : ''}`;
    const res: Response = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch companies for ${city}: ${res.statusText}`);
    const data: GeoJSONResponse = await res.json();

    // Get total count from first batch
    if (lastId === undefined && data.metadata.total) {
      totalCompanies = data.metadata.total;
      logger.info(`Total companies to fetch for ${city}: ${totalCompanies}`);
    }

    for (const feature of data.features) {
      const props = feature.properties as CompanyProperties;
      if (!props?.business_id) continue;

      // Get coordinates from addresses object
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

    lastId = data.metadata.last_id;
    hasMore = data.metadata.has_more;

    // Report progress
    if (onProgress) {
      onProgress({
        total: totalCompanies,
        fetched: allFeatures.length,
        lastId,
        hasMore,
      });
    }

    // Only log progress at 25%, 50%, 75%, and 100%
    const progress = (allFeatures.length / totalCompanies) * 100;
    if (progress >= 25 && progress < 30) {
      logger.info(`Progress for ${city}: 25% complete`);
    } else if (progress >= 50 && progress < 55) {
      logger.info(`Progress for ${city}: 50% complete`);
    } else if (progress >= 75 && progress < 80) {
      logger.info(`Progress for ${city}: 75% complete`);
    } else if (!hasMore) {
      logger.info(`Progress for ${city}: 100% complete`);
    }
  }

  logger.info(
    `Completed fetching all companies for ${city}. Total features: ${allFeatures.length}`,
  );
  return allFeatures;
}

export function useCompaniesByCity(city: string) {
  const { setCompanies, appendCompanies, resetCompanies } = useCompanyStore();

  return useQuery<Feature<Point, CompanyProperties>[]>({
    queryKey: ['geojson', city],
    queryFn: async () => {
      // Reset companies when starting a new fetch
      resetCompanies();

      // List of known large cities that might have performance issues
      const largeCities = ['Helsinki', 'Espoo', 'Tampere', 'Vantaa', 'Oulu'];

      // Warn about potential performance issues for large cities
      if (largeCities.includes(city)) {
        notifySystemWarning(
          `Data fetching for ${city} might be slower due to the large number of companies.`,
        );
      }

      const features = await fetchCompanyPatches(city, (progress) => {
        // Update store with progress information
        if (progress.fetched % 1000 === 0) {
          logger.info(
            `Fetching progress for ${city}: ${progress.fetched}/${progress.total} features`,
          );
        }
      });

      // Extract company properties from features
      const companies = features.map((feature) => feature.properties);

      // Update store with all companies
      setCompanies(companies);

      logger.info(`Successfully fetched ${companies.length} companies for ${city}`);

      return features;
    },
    enabled: !!city,
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
