import type { Coordinates } from '@/utils/geo';
import type { CompanyProperties } from './business';
import type { TableColumnConfig } from './table';

/**
 * Zustand state and actions for managing company filtering, selection, and UI state.
 */
export interface CompanyStore {
  // 🌆 City selection
  selectedCity: string;
  setSelectedCity: (city: string) => void;

  // ✅ Row selection logic
  selectedRows: Record<string, CompanyProperties>;
  selectedKeys: Set<string>;
  setSelectedKeys: (keys: Set<string> | 'all') => void;
  toggleRow: (business: CompanyProperties) => void;
  clearSelection: () => void;

  // 📊 Column visibility control
  visibleColumns: TableColumnConfig[];
  toggleColumnVisibility: (key: keyof CompanyProperties) => void;
  resetColumns: () => void;

  // 🏭 Industry filter logic
  selectedIndustries: string[];
  setSelectedIndustries: (values: string[]) => void;
  toggleIndustry: (industry: string) => void;
  clearIndustries: () => void;

  // 📍 Location and distance-based filters
  userLocation: Coordinates | null;
  setUserLocation: (coords: Coordinates | null) => void;

  distanceLimit: number | null;
  setDistanceLimit: (value: number | null) => void;
}
