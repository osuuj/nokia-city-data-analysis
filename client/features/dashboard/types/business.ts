import type { AddressType, BusinessAddress, Coordinates } from './address';

/**
 * @interface Business
 * @description Represents a normalized business record.
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
 * @description Rich company metadata used in UI (table, map, etc).
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

  /**
   * @optional Only set on transformed features (not raw from API)
   */
  addressType?: AddressType;

  /**
   * @optional Internal tagging for display logic
   */
  isActive?: boolean;

  /**
   * @optional Internal tagging for display logic
   */
  isOverlapping?: boolean;
}

/**
 * @interface GeoJSONGeometry
 * @description GeoJSON geometry with coordinates.
 */
export interface GeoJSONGeometry {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

/**
 * @interface CompanyFeature
 * @description A full GeoJSON Feature for a company.
 */
export interface CompanyFeature {
  type: 'Feature';
  geometry: GeoJSONGeometry;
  properties: CompanyProperties;
}

/**
 * @interface CompanyFeatureWithAddressType
 * @description A transformed company feature with addressType tagged.
 */
export interface CompanyFeatureWithAddressType extends Omit<CompanyFeature, 'properties'> {
  properties: CompanyProperties & {
    addressType: AddressType;
  };
}
