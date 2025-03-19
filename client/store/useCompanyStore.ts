import { columns } from '@/components/table/tableConfig';
import type { Business, CompanyStore } from '@/types/business';
import { create } from 'zustand';

export const useCompanyStore = create<CompanyStore>((set) => ({
  // City selection
  selectedCity: '',
  setSelectedCity: (city: string) => set({ selectedCity: city }),

  // Row selection logic
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

  // Column visibility logic
  visibleColumns: columns.filter((col) => col.visible), // Initialize from config
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
}));
