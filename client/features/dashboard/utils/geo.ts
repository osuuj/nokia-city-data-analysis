import type {
  AddressType as CompanyAddressType,
  CompanyProperties,
  Coordinates,
} from '@/features/dashboard/types/business';
import type { Feature, FeatureCollection, Point } from 'geojson';

// Extended address type that includes 'Default' for companies without coordinates
export type AddressType = CompanyAddressType | 'Default';

/**
 * Calculates distance in kilometers between two coordinates explicitly
 * using the Haversine formula.
 *
 * @param point1 - First coordinate.
 * @param point2 - Second coordinate.
 * @returns Distance in kilometers.
 */
export function getDistanceInKm(point1: Coordinates, point2: Coordinates): number {
  const toRad = (value: number) => (value * Math.PI) / 180;

  const R = 6371; // Radius of Earth in km
  const dLat = toRad(point2.latitude - point1.latitude);
  const dLon = toRad(point2.longitude - point1.longitude);

  const lat1 = toRad(point1.latitude);
  const lat2 = toRad(point2.latitude);

  const a = Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Requests user's browser location explicitly.
 *
 * @returns Promise resolving to the current geolocation coordinates.
 */
export function requestBrowserLocation(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error('Geolocation is not supported by your browser.'));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
    );
  });
}

/**
 * Transform company GeoJSON data to add address type information and handle companies
 * with missing or invalid geometries by using postal address when available
 *
 * @param geojson The original GeoJSON data
 * @returns Enhanced GeoJSON with address type information
 */
export function transformCompanyGeoJSON(
  geojson: FeatureCollection<Point, CompanyProperties>,
): FeatureCollection<Point, CompanyProperties & { addressType?: AddressType }> {
  const features: Feature<Point, CompanyProperties & { addressType?: AddressType }>[] = [];

  // Process each feature
  for (const feature of geojson.features) {
    const props = feature.properties;

    // Get both address types
    const visiting = props.addresses?.['Visiting address'];
    const postal = props.addresses?.['Postal address'];

    // Check if addresses are the same (based on coordinates)
    const sameAddress =
      visiting?.latitude === postal?.latitude &&
      visiting?.longitude === postal?.longitude &&
      visiting?.latitude !== undefined &&
      visiting?.longitude !== undefined;

    // Case 1: If addresses are the same, use postal address
    if (sameAddress && postal?.latitude && postal?.longitude) {
      features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [postal.longitude, postal.latitude],
        },
        properties: {
          ...props,
          addressType: 'Postal address',
        },
      });
      continue;
    }

    // Case 2: If addresses are different, add both (if they have coordinates)

    // Add visiting address
    if (visiting?.latitude && visiting?.longitude) {
      features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [visiting.longitude, visiting.latitude],
        },
        properties: {
          ...props,
          addressType: 'Visiting address',
        },
      });
    }

    // Add postal address
    if (postal?.latitude && postal?.longitude) {
      features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [postal.longitude, postal.latitude],
        },
        properties: {
          ...props,
          addressType: 'Postal address',
        },
      });
    }

    // If neither address has coordinates (should not happen based on your description)
    if (!visiting?.latitude && !visiting?.longitude && !postal?.latitude && !postal?.longitude) {
      console.warn(`Company ${props.company_name} has no valid coordinates`);
    }
  }

  return {
    type: 'FeatureCollection',
    features,
  };
}

/**
 * Compares two coordinates exactly (lat/lng).
 *
 * @param a - First coordinate.
 * @param b - Second coordinate.
 * @returns True if they are identical.
 */
export function coordinatesEqual(a: Coordinates, b: Coordinates): boolean {
  return a.latitude === b.latitude && a.longitude === b.longitude;
}

// This file handles GeoJSON transformations for the dashboard map view
