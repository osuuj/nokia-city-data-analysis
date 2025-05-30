import type { CompanyProperties } from '@/features/dashboard/types/business';
import type { Dispatch, SetStateAction } from 'react';
import type { AddressKey } from './addressTypes';

/**
 * @typedef DirectCompanyKey
 * @description Keys that exist directly on the CompanyProperties interface.
 */
export type DirectCompanyKey = keyof CompanyProperties;

/**
 * @typedef CompanyTableKey
 * @description All possible column keys used in the UI table. Includes direct company fields and nested address fields.
 */
export type CompanyTableKey = DirectCompanyKey | AddressKey;

/**
 * @interface TableColumnConfig
 * @description Metadata about a column in the table.
 * @property key {CompanyTableKey} - Unique key for the column.
 * @property label {string} - Display label shown in the table header.
 * @property visible {boolean} - Is this column currently visible?
 * @property userVisible {boolean} - Can users toggle this column's visibility?
 */
export interface TableColumnConfig {
  key: string;
  label: string;
  visible: boolean;
  userVisible: boolean;
}

/**
 * @interface SortDescriptor
 * @description Describes the column and direction used for sorting the table.
 * @property column {CompanyTableKey} - The column key being sorted.
 * @property direction {'asc' | 'desc'} - The sort direction.
 */
export interface SortDescriptor {
  column: string;
  direction: 'asc' | 'desc';
}

/**
 * @interface TableViewProps
 * @description Props for the main table view component.
 */
export interface TableViewProps {
  data: CompanyProperties[];
  allFilteredData: CompanyProperties[];
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
 * @interface TableHeaderProps
 * @description Props for rendering the column headers of the table.
 */
export interface TableHeaderProps {
  columns: TableColumnConfig[];
}

/**
 * @interface TableCellRendererProps
 * @description Props used to render an individual table cell.
 */
export interface TableCellRendererProps {
  item: CompanyProperties;
  columnKey: CompanyTableKey;
}

/**
 * @interface SearchInputProps
 * @description Props passed to the search input component.
 */
export interface SearchInputProps {
  searchTerm: string;
  onSearch: (value: string) => void;
}

/**
 * @interface FilterGroupProps
 * @description Props for rendering the group of filters above the table.
 */
export interface FilterGroupProps {
  address: string;
  setAddress: Dispatch<SetStateAction<string>>;
}

/**
 * @interface ToolbarProps
 * @description Props for the table toolbar component.
 */
export interface ToolbarProps {
  searchTerm: string;
  onSearch: (value: string) => void;
  selectedKeys: Set<string>;
  address: string;
  setAddress: Dispatch<SetStateAction<string>>;
  sortDescriptor: SortDescriptor;
  setSortDescriptor: Dispatch<SetStateAction<SortDescriptor>>;
  setSelectedKeys: (keys: Set<string> | 'all', allFilteredData?: CompanyProperties[]) => void;
}

/**
 * @interface ColumnVisibilityDropdownProps
 * @description Props for the dropdown that toggles column visibility.
 */
export interface ColumnVisibilityDropdownProps {
  visibleColumns: Set<string>;
  setVisibleColumns: Dispatch<SetStateAction<Set<string>>>;
}

/**
 * @interface SortDropdownProps
 * @description Props for the sort dropdown control.
 */
export interface SortDropdownProps {
  sortDescriptor: SortDescriptor;
  setSortDescriptor: Dispatch<SetStateAction<SortDescriptor>>;
}

/**
 * @interface FilteredBusinessParams
 * @description Arguments passed to hook or utils for filtering company data.
 */
export interface FilteredBusinessParams {
  data: CompanyProperties[] | undefined;
  searchTerm: string;
  selectedIndustries: string[];
  userLocation: { latitude: number; longitude: number } | null;
  distanceLimit: number | null;
  sortDescriptor: SortDescriptor;
  isFetching: boolean;
}
