import type { CompanyProperties, Coordinates } from './business';
import type { CompanyTableKey, TableColumnConfig } from './table';

/**
 * @interface CompanyState
 * @description Represents the Zustand store state for filtering, selection, and UI.
 *
 * @property selectedCity {string} - The currently selected city used for filtering.
 * @property selectedRows {Record<string, CompanyProperties>} - Selected businesses keyed by their ID.
 * @property selectedKeys {Set<string>} - Set of selected business IDs (used in the table).
 * @property visibleColumns {TableColumnConfig[]} - Active/visible table columns.
 * @property selectedIndustries {string[]} - Currently selected industry codes (e.g., ['A', 'B']).
 * @property userLocation {Coordinates | null} - User's current location if location sharing is allowed.
 * @property distanceLimit {number | null} - Max distance (in km) to show businesses from user location.
 */
export interface CompanyState {
  selectedCity: string;
  selectedRows: Record<string, CompanyProperties>;
  selectedKeys: Set<string>;
  visibleColumns: TableColumnConfig[];
  selectedIndustries: string[];
  userLocation: Coordinates | null;
  distanceLimit: number | null;
  addressFilterMode: 'VisitingOnly' | 'All';
}

/**
 * @interface CompanyActions
 * @description Defines all mutations/actions for the Zustand company store.
 *
 * @method setSelectedCity - Updates the selected city string.
 * @method setSelectedKeys - Sets selected rows by ID or selects all.
 * @method toggleRow - Toggles a single row's selection.
 * @method clearSelection - Clears all selected rows.
 *
 * @method toggleColumnVisibility - Toggles column visibility by key.
 * @method resetColumns - Resets visible columns to default.
 *
 * @method setSelectedIndustries - Replaces selected industries.
 * @method toggleIndustry - Adds or removes an industry from the filter.
 * @method clearIndustries - Clears all selected industries.
 *
 * @method setUserLocation - Updates user location.
 * @method setDistanceLimit - Sets max filter distance in km.
 */
export interface CompanyActions {
  setSelectedCity: (city: string) => void;

  setSelectedKeys: (keys: Set<string> | 'all', allFilteredData?: CompanyProperties[]) => void;
  toggleRow: (business: CompanyProperties) => void;
  clearSelection: () => void;

  toggleColumnVisibility: (key: CompanyTableKey) => void;
  resetColumns: () => void;

  setSelectedIndustries: (values: string[]) => void;
  toggleIndustry: (industry: string) => void;
  clearIndustries: () => void;

  setUserLocation: (coords: Coordinates | null) => void;
  setDistanceLimit: (value: number | null) => void;
  setAddressFilterMode: (mode: 'VisitingOnly' | 'All') => void;
}

/**
 * @typedef CompanyStore
 * @description Zustand store combining state and actions for filtering and UI logic.
 */
export type CompanyStore = CompanyState & CompanyActions;
