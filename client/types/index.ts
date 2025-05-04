export type { IconSvgProps } from '@/shared/types';

/**
 * Coordinates type
 * Represents a geographical point with latitude and longitude
 */
export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Address types available in company data
 */
export type AddressType = 'Visiting address' | 'Postal address';

/**
 * Company Properties interface
 * Defines the structure of company data from the API
 */
export interface CompanyProperties {
  business_id: string;
  company_name: string;
  registration_date?: string;
  industry_letter?: string;
  industry_description?: string;
  main_business_line?: string;
  main_business_line_name?: string;
  active?: boolean;

  addresses?: {
    'Visiting address'?: {
      street?: string;
      building_number?: string;
      entrance?: string;
      postal_code?: string;
      city?: string;
      post_office?: string;
      latitude?: number;
      longitude?: number;
    };
    'Postal address'?: {
      street?: string;
      building_number?: string;
      entrance?: string;
      postal_code?: string;
      city?: string;
      post_office?: string;
      latitude?: number;
      longitude?: number;
    };
  };

  [key: string]: unknown;
}

/**
 * Extended GeoJSON feature properties with address type
 */
export interface CompanyFeatureWithAddressType {
  properties: CompanyProperties & {
    addressType: AddressType;
  };
}
