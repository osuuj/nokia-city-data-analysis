import type { CompanyProperties } from '@/types/business';
import type { CompanyStore } from '@/types/companyStore';
import { columns } from '@/types/table';
import { create } from 'zustand';

/**
 * Zustand global store for managing:
 * - Selected city
 * - Table row selection
 * - Column visibility
 * - Industry filters
 * - Location-based filtering
 */
export const useCompanyStore = create<CompanyStore>((set) => ({
  /** Selected city from search or URL */
  selectedCity: '',

  setSelectedCity: (city: string) => set({ selectedCity: city }),

  /** Currently selected rows (keyed by business_id) */
  selectedRows: {},

  /** Set of selected row keys (used for fast lookup in components) */
  selectedKeys: new Set<string>(),

  /** Set selected keys directly or via "all" */
  setSelectedKeys: (keys: Set<string> | 'all', allFilteredData?: CompanyProperties[]) =>
    set((state) => {
      if (keys === 'all' && allFilteredData) {
        // Select all rows across all pages (using `allFilteredData`)
        return { selectedKeys: new Set(allFilteredData.map((item) => item.business_id)) };
      }
      return { selectedKeys: keys instanceof Set ? keys : new Set() };
    }),

  /** Toggle selection of a single row */
  toggleRow: (business: CompanyProperties) =>
    set((state) => {
      const newRows = { ...state.selectedRows };
      const newKeys = new Set(state.selectedKeys);

      if (newRows[business.business_id]) {
        delete newRows[business.business_id];
        newKeys.delete(business.business_id);
      } else {
        newRows[business.business_id] = business;
        newKeys.add(business.business_id);
      }

      return { selectedRows: newRows, selectedKeys: newKeys };
    }),

  clearSelection: () => set({ selectedRows: {}, selectedKeys: new Set<string>() }),

  /** Column visibility */
  visibleColumns: columns.filter((col) => col.visible),

  toggleColumnVisibility: (key: keyof CompanyProperties) =>
    set((state) => {
      // Check if column is already visible
      const isVisible = state.visibleColumns.some((col) => col.key === key);

      // Find the column definition from the available columns
      const column = columns.find((col) => col.key === key);

      if (!column) {
        console.error(`Column with key ${key} not found!`);
        return state; // Return unchanged state if column is not found
      }

      // Update the columns visibility based on whether it's visible or not
      const updatedColumns = isVisible
        ? state.visibleColumns.filter((col) => col.key !== key)
        : [...state.visibleColumns, column]; // No need to check `find` again

      return { visibleColumns: updatedColumns };
    }),

  resetColumns: () =>
    set({
      visibleColumns: columns.filter((col) => col.visible),
    }),

  /** Industry filtering */
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

  /** Location filters */
  userLocation: null,

  setUserLocation: (coords) => set({ userLocation: coords }),

  distanceLimit: null,

  setDistanceLimit: (value) => set({ distanceLimit: value }),
}));
