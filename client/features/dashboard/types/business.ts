/**
 * Company Properties interface
 * Defines the structure of company data from the API
 */
import { Address, type AddressMap, Coordinates } from './addressTypes';

export interface CompanyProperties {
  business_id: string;
  company_name: string;
  registration_date?: string;
  industry_letter?: string;
  industry_description?: string;
  main_business_line?: string;
  main_business_line_name?: string;
  active?: boolean;

  /** Company addresses, mapped by address type */
  addresses?: AddressMap;

  [key: string]: unknown;
}

/**
 * Address types available in company data
 * @deprecated Use AddressTypeEnum from addressTypes instead
 */
export type AddressType = 'Visiting address' | 'Postal address';

/**
 * Extended GeoJSON feature properties with address type
 */
export interface CompanyFeatureWithAddressType {
  properties: CompanyProperties & {
    addressType: AddressType;
  };
}
