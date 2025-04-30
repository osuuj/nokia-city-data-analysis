import type { AddressType, CompanyProperties, CompanyStore } from '@/features/dashboard/types';
import type { CompanyTableKey } from '@/features/dashboard/types';
import { columns } from '@shared/config/columns';
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
 * @state preferredAddressType {AddressType} - Preferred address type for display.
 * @state filteredBusinessIds {string[]} - All filtered business IDs for pagination.
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
 * - setPreferredAddressType(type: AddressType): void
 * - setFilteredBusinessIds(ids: string[]): void
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
        const newKeys = new Set(allFilteredData.map((item) => item.business_id));
        const newRows = allFilteredData.reduce(
          (acc, item) => {
            acc[item.business_id] = item;
            return acc;
          },
          {} as Record<string, CompanyProperties>,
        );

        return {
          selectedKeys: newKeys,
          selectedRows: newRows,
        };
      }
      // Just update the keys, but keep the selected rows
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
      visibleColumns: columns.filter((col) => col.visible),
    }),

  /** Industry filtering */
  selectedIndustries: [],

  setSelectedIndustries: (values: string[]) => {
    // Use a stable reference if the arrays are identical
    if (Array.isArray(values)) {
      set({ selectedIndustries: values });
    }
  },

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

  setDistanceLimit: (value: number | null) => set({ distanceLimit: value }),

  /** Preferred address type */
  preferredAddressType: 'Postal address',

  setPreferredAddressType: (type: AddressType) => set({ preferredAddressType: type }),

  /** Filtered business IDs for pagination */
  filteredBusinessIds: [],

  setFilteredBusinessIds: (ids: string[]) => set({ filteredBusinessIds: ids }),
}));
