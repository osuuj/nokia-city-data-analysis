/**
 * Represents a single business entity in the system.
 */
export interface Business {
  business_id: string;
  company_name: string;
  street: string;
  building_number: string;
  entrance?: string;
  postal_code: string;
  city: string;
  latitude_wgs84: number;
  longitude_wgs84: number;
  address_type: string;
  active: boolean;
  company_type: string;
  industry_description: string;
  industry_letter?: string;
  industry?: string;
  registration_date?: string;
  website?: string;
}

/**
 * Represents a single address (Postal or Visiting).
 */
export interface BusinessAddress {
  street: string;
  building_number: string;
  entrance?: string;
  postal_code: string;
  city: string;
  longitude: number;
  latitude: number;
}

/**
 * Represents a company feature returned from GeoJSON API.
 */
export interface CompanyProperties {
  business_id: string;
  company_name: string;
  company_type?: string;
  industry_letter: string;
  industry?: string;
  industry_description?: string;
  website?: string;
  active?: string;
  registration_date?: string;

  // 👇 Grouped addresses by type (Postal address, Visiting address, etc.)
  addresses: Record<string, BusinessAddress>;
}

/**
 * A full GeoJSON feature (with geometry).
 */
export interface CompanyFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  properties: CompanyProperties;
}
