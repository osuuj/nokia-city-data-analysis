import { create } from 'zustand';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface Business {
  business_id: string;
  company_name: string;
  industry_description: string;
  latitude_wgs84: number;
  longitude_wgs84: number;
}

interface CompanyStore {
  companies: Business[];
  selectedCompanies: Business[];
  isLoading: boolean;
  fetchCompanies: (city: string) => Promise<void>;
  setSelectedCompanies: (selected: Business[]) => void;
}

export const useCompanyStore = create<CompanyStore>((set) => ({
  companies: [],
  selectedCompanies: [],
  isLoading: false,

  fetchCompanies: async (city) => {
    if (!city) return;

    set({ isLoading: true });

    try {
      const res = await fetch(`${BASE_URL}/api/v1/businesses_by_city?city=${city}`);
      const data = await res.json();

      set({ companies: data, isLoading: false, selectedCompanies: [] }); // ✅ Clear selections when fetching new data
    } catch (error) {
      console.error('Error fetching companies:', error);
      set({ isLoading: false });
    }
  },

  setSelectedCompanies: (selected) => set({ selectedCompanies: selected }),
}));
