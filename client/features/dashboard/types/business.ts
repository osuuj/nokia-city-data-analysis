/**
 * Company Properties interface
 * Defines the structure of company data from the API
 */
import type { AddressMap, AddressTypeEnum } from './addressTypes';

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
 * Extended GeoJSON feature properties with address type
 */
export interface CompanyFeatureWithAddressType {
  properties: CompanyProperties & {
    addressType: AddressTypeEnum;
  };
}
