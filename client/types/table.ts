import type { Dispatch, SetStateAction } from 'react';
import type { CompanyProperties } from './business';

/**
 * Defines metadata for a column in the data table.
 */
export type CompanyTableKey =
  | keyof CompanyProperties
  | 'street'
  | 'building_number'
  | 'postal_code'
  | 'city'
  | 'entrance'
  | 'address_type';

export interface TableColumnConfig {
  key: CompanyTableKey;
  label: string;
  visible: boolean;
  userVisible: boolean;
}

export interface SortDescriptor {
  column: CompanyTableKey;
  direction: 'asc' | 'desc';
}

/**
 * Default column definitions used across the app.
 * These refer to core fields, and some virtual ones from `addresses.Visiting address`
 */
export const columns: TableColumnConfig[] = [
  { key: 'business_id', label: 'Business ID', visible: true, userVisible: true },
  { key: 'company_name', label: 'Company Name', visible: true, userVisible: true },

  // 🏡 Derived from Visiting address
  { key: 'street', label: 'Street', visible: false, userVisible: false },
  { key: 'building_number', label: 'Building Number', visible: false, userVisible: false },
  { key: 'entrance', label: 'Entrance', visible: false, userVisible: false },
  { key: 'postal_code', label: 'Postal Code', visible: false, userVisible: false },
  { key: 'city', label: 'City', visible: false, userVisible: false },
  { key: 'address_type', label: 'Address Type', visible: false, userVisible: false },

  // 🏭 From company metadata
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
 * Safely returns displayable data for table cell rendering.
 * Handles derived fields from Visiting address.
 */
export function getCellValue(item: CompanyProperties, columnKey: TableColumnConfig['key']): string {
  const visiting = item.addresses?.['Visiting address'];

  switch (columnKey) {
    case 'street':
      return visiting?.street ?? '';
    case 'building_number':
      return visiting?.building_number ?? '';
    case 'entrance':
      return visiting?.entrance ?? '';
    case 'postal_code':
      return visiting?.postal_code ?? '';
    case 'city':
      return visiting?.city ?? '';
    case 'address_type':
      return 'Visiting address';
    case 'business_id':
    case 'company_name':
    case 'company_type':
    case 'industry_letter':
    case 'industry':
    case 'industry_description':
    case 'website':
    case 'active':
    case 'registration_date':
      return item[columnKey] ?? '';
    default:
      return '';
  }
}
/**
 * Props for the main data table view.
 */
export interface TableViewProps {
  data: CompanyProperties[];
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
  item: CompanyProperties;
  columnKey: TableColumnConfig['key'];
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
  selectedKeys: Set<string>;
  useLocation: boolean;
  setUseLocation: Dispatch<SetStateAction<boolean>>;
  address: string;
  setAddress: Dispatch<SetStateAction<string>>;
  sortDescriptor: SortDescriptor;
  setSortDescriptor: Dispatch<SetStateAction<SortDescriptor>>;
  setSelectedKeys: (keys: Set<string> | 'all') => void;
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
  column: TableColumnConfig['key'];
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
  data: CompanyProperties[] | undefined;
  searchTerm: string;
  selectedIndustries: string[];
  userLocation: { latitude: number; longitude: number } | null;
  distanceLimit: number | null;
  sortDescriptor: SortDescriptor;
  isFetching: boolean;
}
