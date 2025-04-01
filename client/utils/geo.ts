import type {
  AddressType,
  CompanyFeatureWithAddressType,
  CompanyProperties,
  Coordinates,
} from '@/types';
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

    const distance = getDistanceInKm(userLocation, {
      latitude: visiting.latitude,
      longitude: visiting.longitude,
    });

    return distance <= maxDistanceKm;
  });
}

/**
 * Transforms a company-based GeoJSON into a marker-per-address format.
 * Generates separate features for each address type (visiting/postal) with coordinates.
 *
 * @param original - Original GeoJSON from API.
 * @returns Expanded GeoJSON with one feature per address type.
 */
export function transformCompanyGeoJSON(
  original: FeatureCollection<Point, CompanyProperties>,
): FeatureCollection<Point, CompanyFeatureWithAddressType['properties']> {
  const transformedFeatures: Feature<Point, CompanyFeatureWithAddressType['properties']>[] = [];

  for (const feature of original.features) {
    const props = feature.properties;
    const addresses = props.addresses;

    const addressTypes: AddressType[] = ['Visiting address', 'Postal address'];

    for (const type of addressTypes) {
      const address = addresses[type];
      if (!address?.latitude || !address?.longitude) continue;

      transformedFeatures.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [address.longitude, address.latitude],
        },
        properties: {
          ...props,
          addressType: type,
        },
        id: `${props.business_id}-${type}`, // ✅ Add unique ID for feature-state control
      } as Feature<Point, CompanyProperties & { addressType: AddressType }> & { id: string });
    }
  }

  return {
    type: 'FeatureCollection',
    features: transformedFeatures,
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
