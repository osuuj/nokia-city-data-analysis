import type { FeatureCollection, Point } from 'geojson';
import type { CompanyProperties } from './business';
import type { SortDescriptor, TableColumnConfig } from './table';

/**
 * View modes for the dashboard
 */
export type ViewMode = 'table' | 'map' | 'split' | 'analytics';

/**
 * Props for the ViewSwitcher component
 */
export interface ViewSwitcherProps {
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
  setSortDescriptor: (descriptor: SortDescriptor) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  selectedBusinesses: CompanyProperties[];
  geojson: FeatureCollection<Point, CompanyProperties & { addressType?: string }>;
}
