import type { Business } from '@/types/business';

export interface TableColumnConfig {
  key: keyof Business;
  label: string;
  visible: boolean; // Determines if the column is shown in the table
}

export const columns: TableColumnConfig[] = [
  { key: 'business_id', label: 'Business ID', visible: true },
  { key: 'company_name', label: 'Company Name', visible: true },
  { key: 'street', label: 'Street', visible: false },
  { key: 'building_number', label: 'Building Number', visible: false },
  { key: 'entrance', label: 'Entrance', visible: false },
  { key: 'postal_code', label: 'Postal Code', visible: false },
  { key: 'city', label: 'City', visible: false },
  { key: 'latitude_wgs84', label: 'Latitude', visible: false },
  { key: 'longitude_wgs84', label: 'Longitude', visible: false },
  { key: 'address_type', label: 'Address Type', visible: false },
  { key: 'company_type', label: 'Company Type', visible: false },
  { key: 'industry', label: 'Industry', visible: true },
  { key: 'industry_description', label: 'Industry Description', visible: false },
  { key: 'industry_letter', label: 'Industry Letter', visible: false },
  { key: 'registration_date', label: 'Registration Date', visible: true },
  { key: 'active', label: 'Active', visible: true },
  { key: 'website', label: 'Website', visible: false },
];

export interface TableViewProps {
  data: Business[];
  columns: TableColumnConfig[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

export interface TableHeaderProps {
  columns: TableColumnConfig[];
}

export interface TableCellRendererProps {
  item: Business;
  columnKey: keyof Business;
}

export interface SearchInputProps {
  searchTerm: string;
  onSearch: (value: string) => void;
}

export interface ToolbarProps extends SearchInputProps {
  selectedKeys: Set<string> | 'all';
}
