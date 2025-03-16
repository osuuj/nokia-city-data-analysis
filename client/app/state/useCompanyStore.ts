import type { Business, CompanyStore } from "@/types/business";
import { create } from 'zustand';


export const useCompanyStore = create<CompanyStore>((set) => ({
  selectedCity: '',
  setSelectedCity: (city: string) => set({ selectedCity: city }),
  selectedRows: {},
  toggleRow: (business: Business) =>
    set((state) => {
      const newSelection = { ...state.selectedRows };
      if (newSelection[business.business_id]) {
        delete newSelection[business.business_id];
      } else {
        newSelection[business.business_id] = business;
      }
      return { selectedRows: newSelection };
    }),
  clearSelection: () => set({ selectedRows: {} }),
}));