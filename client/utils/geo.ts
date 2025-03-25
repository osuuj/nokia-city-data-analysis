import type { CompanyProperties } from '@/types/business';

/**
 * Represents a geographic coordinate pair.
 */
export type Coordinates = {
  latitude: number;
  longitude: number;
};

/**
 * Calculates the distance in kilometers between two geo-coordinates
 * using the Haversine formula.
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
 * Prompts the user for browser location access and returns their current coordinates.
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
 * Filters a list of companies to those within the specified distance (in km) of the user.
 */
export function filterByDistance(
  data: CompanyProperties[],
  userLocation: Coordinates,
  maxDistanceKm: number,
): CompanyProperties[] {
  return data.filter((company) => {
    // Safely extract lat/lon from known property names
    const latRaw =
      (company as Record<string, unknown>).latitude ??
      (company as Record<string, unknown>).latitude_wgs84;
    const lonRaw =
      (company as Record<string, unknown>).longitude ??
      (company as Record<string, unknown>).longitude_wgs84;

    const lat =
      typeof latRaw === 'string'
        ? Number.parseFloat(latRaw)
        : typeof latRaw === 'number'
          ? latRaw
          : Number.NaN;

    const lon =
      typeof lonRaw === 'string'
        ? Number.parseFloat(lonRaw)
        : typeof lonRaw === 'number'
          ? lonRaw
          : Number.NaN;

    if (Number.isNaN(lat) || Number.isNaN(lon)) {
      return false;
    }

    const distance = getDistanceInKm(userLocation, { latitude: lat, longitude: lon });
    return distance <= maxDistanceKm;
  });
}
