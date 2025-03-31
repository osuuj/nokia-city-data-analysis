/**
 * @interface Coordinates
 * @description Represents geographical coordinates.
 * @property latitude {number} - Latitude in decimal degrees.
 * @property longitude {number} - Longitude in decimal degrees.
 */
export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * @typedef AddressType
 * @description Type of business address.
 * @example 'Postal' | 'Visiting'
 */
export type AddressType = 'Postal' | 'Visiting';

/**
 * @interface BusinessAddress
 * @description Represents a single address (Postal or Visiting).
 * Extends Coordinates.
 *
 * @property street {string} - Street name.
 * @property building_number {string} - Street number.
 * @property entrance? {string} - Optional entrance detail.
 * @property postal_code {string} - Postal/ZIP code.
 * @property city {string} - City name.
 * @property address_type? {AddressType} - Type of address ('Postal' or 'Visiting').
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
 * @interface Business
 * @description Represents a single business entity in the system.
 *
 * @property business_id {string} - Unique business identifier.
 * @property company_name {string} - Name of the business.
 * @property street {string} - Street of the main address.
 * @property building_number {string} - Number of the building.
 * @property entrance? {string} - Optional entrance identifier.
 * @property postal_code {string} - ZIP/postal code.
 * @property city {string} - City where business is located.
 * @property address_type {AddressType} - Main address type.
 * @property active {boolean} - Whether business is currently active.
 * @property company_type {string} - Business legal type.
 * @property industry_description {string} - Industry description.
 * @property industry_letter? {string} - Industry sector letter (A–V).
 * @property industry? {string} - Industry sector name.
 * @property registration_date? {string} - Optional date of registration (ISO format).
 * @property website? {string} - Optional website URL.
 */
export interface Business extends Coordinates {
  business_id: string;
  company_name: string;
  street: string;
  building_number: string;
  entrance?: string;
  postal_code: string;
  city: string;
  address_type: AddressType;
  active: boolean;
  company_type: string;
  industry_description: string;
  industry_letter?: string;
  industry?: string;
  registration_date?: string;
  website?: string;
}

/**
 * @interface CompanyProperties
 * @description Metadata of a company used in the map and table UI.
 *
 * @property business_id {string}
 * @property company_name {string}
 * @property company_type? {string}
 * @property industry_letter {string}
 * @property industry? {string}
 * @property industry_description? {string}
 * @property website? {string}
 * @property active? {boolean}
 * @property registration_date? {string}
 * @property addresses {Record<AddressType | string, BusinessAddress>} - Addresses grouped by type.
 */
export interface CompanyProperties {
  business_id: string;
  company_name: string;
  company_type?: string;
  industry_letter: string;
  industry?: string;
  industry_description?: string;
  website?: string;
  active?: boolean;
  registration_date?: string;
  addresses: Record<AddressType | string, BusinessAddress>;
}

/**
 * @interface GeoJSONGeometry
 * @description GeoJSON point geometry.
 * @property type {'Point'} - Always "Point".
 * @property coordinates {[number, number]} - Longitude, latitude.
 */
export interface GeoJSONGeometry {
  type: 'Point';
  coordinates: [number, number];
}

/**
 * @interface CompanyFeature
 * @description A full GeoJSON feature with company properties and geometry.
 * @property type {'Feature'}
 * @property geometry {GeoJSONGeometry}
 * @property properties {CompanyProperties}
 */
export interface CompanyFeature {
  type: 'Feature';
  geometry: GeoJSONGeometry;
  properties: CompanyProperties;
}
