import type { TableColumnConfig } from '@/components/table/tableConfig';

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

  // Column visibility state
  visibleColumns: TableColumnConfig[];
  toggleColumnVisibility: (key: keyof Business) => void;
  resetColumns: () => void;
}
