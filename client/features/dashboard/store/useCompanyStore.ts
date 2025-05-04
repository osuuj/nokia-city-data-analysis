import { columns } from '@/features/dashboard/config/columns';
import type { CompanyProperties } from '@/features/dashboard/types/business';
import type { CompanyTableKey, TableColumnConfig } from '@/features/dashboard/types/table';
import { create } from 'zustand';

/**
 * @store useCompanyStore
 *
 * Zustand global store managing:
 *
 * @state selectedCity {string} - Currently selected city for filtering.
 * @state selectedRows {Record<string, CompanyProperties>} - Selected businesses mapped by IDs.
 * @state selectedKeys {Set<string>} - Quick-access set of selected row keys.
 * @state visibleColumns {TableColumnConfig[]} - Currently visible columns in the table.
 * @state selectedIndustries {string[]} - Industries currently filtered.
 * @state userLocation {Coordinates | null} - User's geolocation for filtering.
 * @state distanceLimit {number | null} - Current maximum distance for location-based filtering.
 *
 * @actions
 * - setSelectedCity(city: string): void
 * - setSelectedKeys(keys: Set<string> | 'all', allFilteredData?: CompanyProperties[]): void
 * - toggleRow(business: CompanyProperties): void
 * - clearSelection(): void
 * - toggleColumnVisibility(key: CompanyTableKey): void
 * - resetColumns(): void
 * - setSelectedIndustries(values: string[]): void
 * - toggleIndustry(industry: string): void
 * - clearIndustries(): void
 * - setUserLocation(coords: Coordinates | null): void
 * - setDistanceLimit(value: number | null): void
 */

/**
 * CompanyStore interface
 */
interface CompanyStore {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedRows: Record<string, CompanyProperties>;
  selectedKeys: Set<string>;
  setSelectedKeys: (keys: Set<string> | 'all', allFilteredData?: CompanyProperties[]) => void;
  toggleRow: (business: CompanyProperties) => void;
  clearSelection: () => void;
  visibleColumns: TableColumnConfig[];
  toggleColumnVisibility: (key: CompanyTableKey) => void;
  resetColumns: () => void;
  selectedIndustries: string[];
  setSelectedIndustries: (values: string[]) => void;
  toggleIndustry: (industry: string) => void;
  clearIndustries: () => void;
  userLocation: { latitude: number; longitude: number } | null;
  setUserLocation: (coords: { latitude: number; longitude: number } | null) => void;
  distanceLimit: number | null;
  setDistanceLimit: (value: number | null) => void;
}

// Get initially visible columns based on configuration
const initialVisibleColumns = columns.filter((col) => col.visible);

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
  visibleColumns: initialVisibleColumns,

  toggleColumnVisibility: (key: CompanyTableKey) =>
    set((state) => {
      const isVisible = state.visibleColumns.some((col) => col.key === key);
      const column = columns.find((col) => col.key === key);

      if (!column) {
        console.error(`Column with key ${key} not found!`);
        return state;
      }

      const updatedColumns = isVisible
        ? state.visibleColumns.filter((col) => col.key !== key)
        : [...state.visibleColumns, column];

      return { visibleColumns: updatedColumns };
    }),

  resetColumns: () =>
    set({
      visibleColumns: initialVisibleColumns,
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
