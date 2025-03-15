export interface Business {
  business_id: string;
  street: string;
  building_number: string;
  entrance?: string;
  postal_code: string;
  city: string;
  latitude_wgs84: string;
  longitude_wgs84: string;
  address_type: string;
  active: string;
  company_name: string;
  company_type: string;
  industry_description: string;
  website?: string;
}
