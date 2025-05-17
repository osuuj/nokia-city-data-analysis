/**
 * Normalized address types for use across the application
 */

/**
 * Enum for address types supported in the application
 */
export enum AddressTypeEnum {
  VISITING = 'Visiting address',
  POSTAL = 'Postal address',
}

/**
 * Base address structure with common fields
 */
export interface BaseAddress {
  /** Street name */
  street?: string;
  /** Building number */
  building_number?: string;
  /** Entrance identifier (e.g., 'A', 'B', etc.) */
  entrance?: string;
  /** Postal/ZIP code */
  postal_code?: string;
  /** City name */
  city?: string;
  /** Post office name (may differ from city) */
  post_office?: string;
}

/**
 * Full address with geographical coordinates
 */
export interface Address extends BaseAddress {
  /** Latitude coordinate */
  latitude?: number;
  /** Longitude coordinate */
  longitude?: number;
}

/**
 * Type for address with explicit type field
 */
export interface TypedAddress extends Address {
  /** The type of address (visiting, postal, etc.) */
  address_type: AddressTypeEnum | string;
}

/**
 * Union type of all address field keys
 */
export type AddressKey = keyof Address | 'address_type';

/**
 * Mapped type for company addresses
 */
export type AddressMap = {
  [key in AddressTypeEnum]?: Address;
} & Record<string, Address | undefined>;

/**
 * Coordinates interface for geolocation
 */
export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Format address as a string for display
 * @param address The address to format
 * @returns Formatted address string
 */
export function formatAddress(address?: BaseAddress): string {
  if (!address) return '';

  const parts = [
    address.street,
    address.building_number ? address.building_number : '',
    address.entrance ? `(${address.entrance})` : '',
  ]
    .filter(Boolean)
    .join(' ');

  const location = [address.postal_code, address.city || address.post_office]
    .filter(Boolean)
    .join(' ');

  return [parts, location].filter(Boolean).join(', ');
}

/**
 * Extract coordinates from an address
 * @param address The address to extract coordinates from
 * @returns Coordinates object or null if coordinates are missing
 */
export function getCoordinates(address?: Address): Coordinates | null {
  if (!address || typeof address.latitude !== 'number' || typeof address.longitude !== 'number') {
    return null;
  }

  return {
    latitude: address.latitude,
    longitude: address.longitude,
  };
}
