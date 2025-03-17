export interface TableColumnConfig {
  key: keyof Business;
  label: string;
}

export const columns: TableColumnConfig[] = [
  { key: 'company_name', label: 'Company Name' },
  { key: 'business_id', label: 'Business ID' },
  { key: 'industry_description', label: 'Industry' },
  { key: 'latitude_wgs84', label: 'Latitude' },
  { key: 'longitude_wgs84', label: 'Longitude' },
];

export interface Business {
  business_id: string;
  company_name: string;
  industry_description: string;
  latitude_wgs84: number;
  longitude_wgs84: number;
}

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
