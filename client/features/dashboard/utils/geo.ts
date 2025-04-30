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
 * Transforms company GeoJSON data to handle overlapping coordinates
 * Creates separate features for postal and visiting addresses when needed
 *
 * @param geojson - Original GeoJSON data
 * @returns Transformed GeoJSON with proper address type handling
 */
export function transformCompanyGeoJSON(
  geojson: FeatureCollection<Point, CompanyProperties>,
): FeatureCollection<
  Point,
  CompanyProperties & { addressType?: 'Visiting address' | 'Postal address' }
> {
  if (!geojson || !geojson.features) {
    return { type: 'FeatureCollection', features: [] };
  }

  const transformedFeatures: Feature<
    Point,
    CompanyProperties & { addressType?: 'Visiting address' | 'Postal address' }
  >[] = [];

  for (const feature of geojson.features) {
    if (!feature.geometry) continue;

    const addresses = feature.properties.addresses;
    if (typeof addresses === 'string') continue;

    const visiting = addresses?.['Visiting address'];
    const postal = addresses?.['Postal address'];

    // Skip if no valid coordinates in either address
    if (
      (!visiting || !visiting.latitude || !visiting.longitude) &&
      (!postal || !postal.latitude || !postal.longitude)
    ) {
      continue;
    }

    // Check if addresses have different coordinates
    const hasDifferentCoords =
      visiting &&
      postal &&
      (visiting.latitude !== postal.latitude || visiting.longitude !== postal.longitude) &&
      visiting.latitude &&
      visiting.longitude &&
      postal.latitude &&
      postal.longitude;

    if (hasDifferentCoords) {
      // Create separate features for visiting and postal addresses
      if (visiting?.latitude && visiting.longitude) {
        transformedFeatures.push({
          ...feature,
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

      if (postal?.latitude && postal.longitude) {
        transformedFeatures.push({
          ...feature,
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
    } else {
      // Use the visiting address or fall back to postal address
      if (visiting?.latitude && visiting.longitude) {
        transformedFeatures.push({
          ...feature,
          geometry: {
            type: 'Point',
            coordinates: [visiting.longitude, visiting.latitude],
          },
          properties: {
            ...feature.properties,
          },
        });
      } else if (postal?.latitude && postal.longitude) {
        transformedFeatures.push({
          ...feature,
          geometry: {
            type: 'Point',
            coordinates: [postal.longitude, postal.latitude],
          },
          properties: {
            ...feature.properties,
          },
        });
      }
    }
  }

  return {
    type: 'FeatureCollection',
    features: transformedFeatures,
  };
}

/**
 * Calculates the distance between two coordinates using the Haversine formula
 *
 * @param lat1 - Latitude of first point
 * @param lon1 - Longitude of first point
 * @param lat2 - Latitude of second point
 * @param lon2 - Longitude of second point
 * @returns Distance in kilometers
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Filters companies based on distance from a reference location
 *
 * @param data - Array of company properties
 * @param userLocation - User's coordinates
 * @param distanceLimit - Maximum distance in kilometers
 * @returns Filtered list of companies
 */
export function filterByDistance(
  data: CompanyProperties[],
  userLocation: { latitude: number; longitude: number } | null,
  distanceLimit: number | null,
): CompanyProperties[] {
  if (!userLocation || !distanceLimit || distanceLimit <= 0) {
    return data;
  }

  return data.filter((company) => {
    const visiting = company.addresses?.['Visiting address'];
    if (!visiting || !visiting.latitude || !visiting.longitude) return false;

    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      visiting.latitude,
      visiting.longitude,
    );

    return distance <= distanceLimit;
  });
}
