import type { Feature, FeatureCollection, Point } from 'geojson';
import type { CompanyProperties, Coordinates } from '../types';

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
 * Compares two coordinates exactly (lat/lng).
 *
 * @param a - First coordinate.
 * @param b - Second coordinate.
 * @returns True if they are identical.
 */
export function coordinatesEqual(a: Coordinates, b: Coordinates): boolean {
  return a.latitude === b.latitude && a.longitude === b.longitude;
}

/**
 * Transforms company data into GeoJSON format, handling both visiting and postal addresses.
 *
 * @param data - FeatureCollection of company data.
 * @returns Transformed GeoJSON FeatureCollection with Point geometries.
 */
export function transformCompanyGeoJSON(
  data: FeatureCollection<Point, CompanyProperties>,
): FeatureCollection<
  Point,
  CompanyProperties & { addressType?: 'Visiting address' | 'Postal address' }
> {
  const features: Feature<
    Point,
    CompanyProperties & { addressType?: 'Visiting address' | 'Postal address' }
  >[] = [];

  for (const feature of data.features) {
    const visiting = feature.properties.addresses?.['Visiting address'];
    const postal = feature.properties.addresses?.['Postal address'];

    if (visiting?.latitude && visiting?.longitude) {
      features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [visiting.longitude, visiting.latitude],
        },
        properties: {
          ...feature.properties,
          addressType: 'Visiting address',
        },
      });
    }

    // Only add postal address if it's different from visiting address
    if (
      postal?.latitude &&
      postal?.longitude &&
      (!visiting ||
        !coordinatesEqual(
          { latitude: postal.latitude, longitude: postal.longitude },
          { latitude: visiting.latitude, longitude: visiting.longitude },
        ))
    ) {
      features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [postal.longitude, postal.latitude],
        },
        properties: {
          ...feature.properties,
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
