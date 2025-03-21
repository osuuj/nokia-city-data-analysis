import type { Business, CompanyStore } from '@/types/business';
import { columns } from '@/types/table';
import { create } from 'zustand';

export const useCompanyStore = create<CompanyStore>((set) => ({
  // ✅ City selection
  selectedCity: '',
  setSelectedCity: (city: string) => set({ selectedCity: city }),

  // ✅ Row selection
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

  // ✅ Column visibility
  visibleColumns: columns.filter((col) => col.visible),
  toggleColumnVisibility: (key) =>
    set((state) => {
      const updatedColumns = state.visibleColumns.some((col) => col.key === key)
        ? state.visibleColumns.filter((col) => col.key !== key)
        : [
            ...state.visibleColumns,
            ...(columns.find((col) => col.key === key)
              ? [columns.find((col) => col.key === key) as (typeof columns)[0]]
              : []),
          ];
      return { visibleColumns: updatedColumns };
    }),
  resetColumns: () => set({ visibleColumns: columns.filter((col) => col.visible) }),

  // ✅ Industry filter state
  selectedIndustries: [],
  setSelectedIndustries: (values: string[]) => set({ selectedIndustries: values }),
  toggleIndustry: (industry: string) =>
    set((state) => {
      const exists = state.selectedIndustries.includes(industry);
      const updated = exists
        ? state.selectedIndustries.filter((i) => i !== industry)
        : [...state.selectedIndustries, industry];
      return { selectedIndustries: updated };
    }),
  clearIndustries: () => set({ selectedIndustries: [] }),

  // ✅ Location filter state
  userLocation: null,
  setUserLocation: (coords) => set({ userLocation: coords }),

  distanceLimit: null,
  setDistanceLimit: (value) => set({ distanceLimit: value }),
}));
