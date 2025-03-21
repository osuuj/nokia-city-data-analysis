import type { TableColumnConfig } from '@/types/table';
import type { Coordinates } from '@/utils/geo';

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

export interface CompanyStore {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedRows: Record<string, Business>;
  toggleRow: (business: Business) => void;
  clearSelection: () => void;
  visibleColumns: TableColumnConfig[];
  toggleColumnVisibility: (key: keyof Business) => void;
  resetColumns: () => void;
  selectedIndustries: string[];
  setSelectedIndustries: (values: string[]) => void;
  toggleIndustry: (industry: string) => void;
  clearIndustries: () => void;
  userLocation: Coordinates | null;
  setUserLocation: (coords: Coordinates | null) => void;
  distanceLimit: number | null;
  setDistanceLimit: (value: number | null) => void;
}
