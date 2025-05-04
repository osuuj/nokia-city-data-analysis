/**
 * Address and location types for the dashboard
 */

/**
 * @interface Coordinates
 * @description Represents geographical coordinates (latitude, longitude).
 */
export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * @typedef AddressType
 * @description Type of business address.
 * @example 'Postal address' | 'Visiting address'
 */
export type AddressType = 'Postal address' | 'Visiting address';

/**
 * @interface BusinessAddress
 * @description Represents a single address (Postal or Visiting).
 */
export interface BusinessAddress extends Coordinates {
  street: string;
  building_number: string;
  entrance?: string;
  postal_code: string;
  city: string;
  address_type?: AddressType;
}

/**
 * @typedef AddressKey
 * @description Keys derived from nested 'Visiting' or 'Postal' addresses.
 */
export type AddressKey =
  | 'street'
  | 'building_number'
  | 'postal_code'
  | 'city'
  | 'entrance'
  | 'address_type';
