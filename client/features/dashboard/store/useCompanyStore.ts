import { columns } from '@/features/dashboard/config/columns';
import type { CompanyProperties } from '@/features/dashboard/types/business';
import type { CompanyTableKey, TableColumnConfig } from '@/features/dashboard/types/table';
import { create } from 'zustand';

/**
 * Company data store using Zustand
 *
 * Manages state for:
 * - Selected city and companies
 * - Table column visibility
 * - Industry filters
 * - Location-based filtering
 */
interface CompanyStore {
  // Core selection
  selectedCity: string;
  selectedRows: Record<string, CompanyProperties>;
  selectedKeys: Set<string>;

  // Table configuration
  visibleColumns: TableColumnConfig[];

  // Filters
  selectedIndustries: string[];
  userLocation: { latitude: number; longitude: number } | null;
  distanceLimit: number | null;

  // Actions
  setSelectedCity: (city: string) => void;
  setSelectedKeys: (keys: Set<string> | 'all', allFilteredData?: CompanyProperties[]) => void;
  toggleRow: (business: CompanyProperties) => void;
  clearSelection: () => void;
  toggleColumnVisibility: (key: CompanyTableKey) => void;
  resetColumns: () => void;
  setSelectedIndustries: (values: string[]) => void;
  toggleIndustry: (industry: string) => void;
  clearIndustries: () => void;
  setUserLocation: (coords: { latitude: number; longitude: number } | null) => void;
  setDistanceLimit: (value: number | null) => void;
}

// Initially visible columns from configuration
const initialVisibleColumns = columns.filter((col) => col.visible);

export const useCompanyStore = create<CompanyStore>((set) => ({
  // Core selection state
  selectedCity: '',
  selectedRows: {},
  selectedKeys: new Set<string>(),

  // Table configuration
  visibleColumns: initialVisibleColumns,

  // Filters
  selectedIndustries: [],
  userLocation: null,
  distanceLimit: null,

  // City selection
  setSelectedCity: (city: string) => set({ selectedCity: city }),

  // Row selection
  setSelectedKeys: (keys: Set<string> | 'all', allFilteredData?: CompanyProperties[]) =>
    set((state) => {
      if (keys === 'all' && allFilteredData) {
        return { selectedKeys: new Set(allFilteredData.map((item) => item.business_id)) };
      }
      return { selectedKeys: keys instanceof Set ? keys : new Set() };
    }),

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

  clearSelection: () => set((_state) => ({ selectedRows: {}, selectedKeys: new Set<string>() })),

  // Column visibility
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

  resetColumns: () => set((_state) => ({ visibleColumns: initialVisibleColumns })),

  // Industry filtering
  setSelectedIndustries: (values: string[]) => set((_state) => ({ selectedIndustries: values })),

  toggleIndustry: (industry: string) =>
    set((state) => {
      const exists = state.selectedIndustries.includes(industry);
      const updated = exists
        ? state.selectedIndustries.filter((i) => i !== industry)
        : [...state.selectedIndustries, industry];
      return { selectedIndustries: updated };
    }),

  clearIndustries: () => set((_state) => ({ selectedIndustries: [] })),

  // Location filters
  setUserLocation: (coords) => set((_state) => ({ userLocation: coords })),
  setDistanceLimit: (value) => set((_state) => ({ distanceLimit: value })),
}));
