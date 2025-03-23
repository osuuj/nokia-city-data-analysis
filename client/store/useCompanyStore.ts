import type { Business } from '@/types/business';
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

  /** Set selected city */
  setSelectedCity: (city: string) => set({ selectedCity: city }),

  /** Currently selected rows (keyed by business_id) */
  selectedRows: {},

  /** Set of selected row keys (used for fast lookup in components) */
  selectedKeys: new Set<string>(),
  setSelectedKeys: (keys) => {
    set((state) => {
      if (keys === 'all') {
        const allKeys = new Set(Object.keys(state.selectedRows));
        return { selectedKeys: allKeys };
      }
      return { selectedKeys: keys };
    });
  },

  /**
   * Toggle a row's selection status.
   * Adds/removes business from selectedRows and updates selectedKeys.
   */
  toggleRow: (business: Business) =>
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

  /** Clear all selected rows */
  clearSelection: () => set({ selectedRows: {}, selectedKeys: new Set<string>() }),

  /** Columns visible in the table (from config) */
  visibleColumns: columns.filter((col) => col.visible),

  /** Toggle visibility of a column by key */
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

  /** Reset visible columns to default (from config) */
  resetColumns: () => set({ visibleColumns: columns.filter((col) => col.visible) }),

  /** Selected industry letter filters (A-Z) */
  selectedIndustries: [],

  /** Replace all selected industries */
  setSelectedIndustries: (values: string[]) => set({ selectedIndustries: values }),

  /** Toggle individual industry selection */
  toggleIndustry: (industry: string) =>
    set((state) => {
      const exists = state.selectedIndustries.includes(industry);
      const updated = exists
        ? state.selectedIndustries.filter((i) => i !== industry)
        : [...state.selectedIndustries, industry];
      return { selectedIndustries: updated };
    }),

  /** Clear all industry filters */
  clearIndustries: () => set({ selectedIndustries: [] }),

  /** Coordinates from browser geolocation (if allowed) */
  userLocation: null,

  /** Set coordinates */
  setUserLocation: (coords) => set({ userLocation: coords }),

  /** Distance limit for filtering companies (in km) */
  distanceLimit: null,

  /** Set distance limit */
  setDistanceLimit: (value) => set({ distanceLimit: value }),
}));
