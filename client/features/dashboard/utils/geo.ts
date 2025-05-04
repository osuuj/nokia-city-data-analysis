import type {
  AddressType,
  CompanyFeatureWithAddressType,
  CompanyProperties,
  Coordinates,
} from '@/features/dashboard/types/business';
import type { Feature, FeatureCollection, Point } from 'geojson';

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
 * Filters companies explicitly within a specified distance from user's location.
 *
 * @param data - List of companies to filter.
 * @param userLocation - User's geolocation.
 * @param maxDistanceKm - Maximum distance in kilometers.
 * @returns Filtered list of companies within the distance.
 */
export function filterByDistance(
  data: CompanyProperties[],
  userLocation: Coordinates,
  maxDistanceKm: number,
): CompanyProperties[] {
  return data.filter((company) => {
    const visiting = company.addresses?.['Visiting address'];
    if (!visiting) return false;

    // Check for valid coordinates before calculating distance
    if (typeof visiting.latitude !== 'number' || typeof visiting.longitude !== 'number') {
      return false;
    }

    const distance = getDistanceInKm(userLocation, {
      latitude: visiting.latitude,
      longitude: visiting.longitude,
    });

    return distance <= maxDistanceKm;
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

    // Skip features with valid geometry already
    if (feature.geometry?.coordinates) {
      features.push({
        ...feature,
        properties: {
          ...props,
          addressType: 'Visiting address',
        },
      });
      continue;
    }

    // Try to create feature from visiting address
    const visiting = props.addresses?.['Visiting address'];
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

    // Try to create feature from postal address
    const postal = props.addresses?.['Postal address'];
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
