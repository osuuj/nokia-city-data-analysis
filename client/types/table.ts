import type { Business } from '@/types/business';
import type { Dispatch, SetStateAction } from 'react';

/**
 * Defines metadata for a column in the data table.
 */
export interface TableColumnConfig {
  key: keyof Business;
  label: string;
  visible: boolean;
  userVisible: boolean;
}

/**
 * Default column definitions used across the app.
 *
 * - `visible`: determines if column is shown in the table
 * - `userVisible`: determines if user can toggle it in the UI
 */
export const columns: TableColumnConfig[] = [
  { key: 'business_id', label: 'Business ID', visible: true, userVisible: true },
  { key: 'company_name', label: 'Company Name', visible: true, userVisible: true },
  { key: 'street', label: 'Street', visible: false, userVisible: false },
  { key: 'building_number', label: 'Building Number', visible: false, userVisible: false },
  { key: 'entrance', label: 'Entrance', visible: false, userVisible: false },
  { key: 'postal_code', label: 'Postal Code', visible: false, userVisible: false },
  { key: 'city', label: 'City', visible: false, userVisible: false },
  { key: 'latitude_wgs84', label: 'Latitude', visible: false, userVisible: false },
  { key: 'longitude_wgs84', label: 'Longitude', visible: false, userVisible: false },
  { key: 'address_type', label: 'Address Type', visible: false, userVisible: false },
  { key: 'company_type', label: 'Company Type', visible: false, userVisible: false },
  { key: 'industry', label: 'Industry', visible: true, userVisible: true },
  {
    key: 'industry_description',
    label: 'Industry Description',
    visible: false,
    userVisible: false,
  },
  { key: 'industry_letter', label: 'Industry Letter', visible: false, userVisible: false },
  { key: 'registration_date', label: 'Registration Date', visible: true, userVisible: true },
  { key: 'active', label: 'Active', visible: true, userVisible: true },
  { key: 'website', label: 'Website', visible: false, userVisible: false },
];

/**
 * Props for the main data table view.
 */
export interface TableViewProps {
  data: Business[];
  columns: TableColumnConfig[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  sortDescriptor: SortDescriptor;
  setSortDescriptor: Dispatch<SetStateAction<SortDescriptor>>;
}

/**
 * Props for the table header component.
 */
export interface TableHeaderProps {
  columns: TableColumnConfig[];
}

/**
 * Props for rendering a single table cell.
 */
export interface TableCellRendererProps {
  item: Business;
  columnKey: keyof Business;
}

/**
 * Props for the search input in the toolbar.
 */
export interface SearchInputProps {
  searchTerm: string;
  onSearch: (value: string) => void;
}

/**
 * Props passed to the filter group (industry, distance).
 */
export interface FilterGroupProps {
  useLocation: boolean;
  setUseLocation: Dispatch<SetStateAction<boolean>>;
  address: string;
  setAddress: Dispatch<SetStateAction<string>>;
}

/**
 * Props for the top table toolbar, including search, filters, and sort.
 */
export interface ToolbarProps {
  searchTerm: string;
  onSearch: (value: string) => void;
  selectedKeys: Set<string> | 'all';
  useLocation: boolean;
  setUseLocation: Dispatch<SetStateAction<boolean>>;
  address: string;
  setAddress: Dispatch<SetStateAction<string>>;
  sortDescriptor: SortDescriptor;
  setSortDescriptor: Dispatch<SetStateAction<SortDescriptor>>;
  setSelectedKeys: Dispatch<SetStateAction<Set<string>>>;
}

/**
 * Props for the column visibility dropdown.
 */
export interface ColumnVisibilityDropdownProps {
  visibleColumns: Set<string>;
  setVisibleColumns: Dispatch<SetStateAction<Set<string>>>;
}

/**
 * Represents the current sorting state of the table.
 */
export interface SortDescriptor {
  column: keyof Business;
  direction: 'asc' | 'desc';
}

/**
 * Props passed to the sort dropdown in the toolbar.
 */
export interface SortDropdownProps {
  sortDescriptor: SortDescriptor;
  setSortDescriptor: Dispatch<SetStateAction<SortDescriptor>>;
}

export interface FilteredBusinessParams {
  data: Business[] | undefined;
  searchTerm: string;
  selectedIndustries: string[];
  userLocation: { latitude: number; longitude: number } | null;
  distanceLimit: number | null;
  sortDescriptor: SortDescriptor;
  isFetching: boolean;
}
