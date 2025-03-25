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

export type CompanyProperties = {
  business_id: string;
  company_name: string;
  industry_letter: string;
  industry_description?: string;
  company_type?: string;
  industry?: string;
  street?: string;
  building_number?: string;
  entrance?: string;
  address_type?: string;
  website?: string;
  city?: string;
  postal_code?: string;
  active?: string;
  registration_date?: string;
};
