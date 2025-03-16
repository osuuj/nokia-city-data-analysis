export interface Business {
  business_id: string;
  company_name: string;
  industry_description: string;
  latitude_wgs84: number;
  longitude_wgs84: number;
}

export interface CompanyStore {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedRows: Record<string, Business>;
  toggleRow: (business: Business) => void;
  clearSelection: () => void;
}