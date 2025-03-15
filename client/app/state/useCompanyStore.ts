import { create } from 'zustand';

export interface Business {
  business_id: string;
  company_name: string;
  industry_description: string;
  latitude_wgs84: number;
  longitude_wgs84: number;
}

interface CompanyStore {
  companies: Business[];  // ✅ Added missing `companies`
  selectedCompanies: Business[];
  isLoading: boolean;
  setCompanies: (companies: Business[]) => void;  // ✅ Added missing `setCompanies`
  setSelectedCompanies: (selected: Business[]) => void;
}

export const useCompanyStore = create<CompanyStore>((set) => ({
  companies: [],
  selectedCompanies: [],
  isLoading: false,

  setCompanies: (companies) => {
    console.log("🏪 Zustand Store: Setting companies", companies.length);
    set({ companies });
  },

  setSelectedCompanies: (selected) => set({ selectedCompanies: selected }),
}));