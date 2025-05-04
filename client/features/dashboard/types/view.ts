import type { FeatureCollection, Point } from 'geojson';
import type { AddressType } from './address';
import type { CompanyProperties } from './business';

/**
 * Defines possible view modes explicitly for displaying company data.
 */
export type ViewMode = 'table' | 'map' | 'split' | 'analytics';

// Basic props needed from TableViewProps without creating a circular dependency
interface BaseTableProps {
  columns: {
    key: string;
    label: string;
    visible: boolean;
    userVisible: boolean;
  }[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  sortDescriptor: {
    column: string;
    direction: 'asc' | 'desc';
  };
  setSortDescriptor: React.Dispatch<
    React.SetStateAction<{
      column: string;
      direction: 'asc' | 'desc';
    }>
  >;
  emptyStateReason?: string;
}

/**
 * @interface ViewSwitcherProps
 *
 * Props for switching between Table and Map views explicitly.
 *
 * @property data {CompanyProperties[]} - Current page data.
 * @property allFilteredData {CompanyProperties[]} - Complete dataset for filters/selections.
 * @property geojson {FeatureCollection<Point, CompanyProperties>} - GeoJSON data for map view.
 * @property viewMode {ViewMode} - Current selected view mode explicitly.
 * @property setViewMode {(mode: ViewMode) => void} - Callback to explicitly change the view mode.
 * @property pageSize {number} - Number of rows to display per page.
 * @property onPageSizeChange {(pageSize: number) => void} - Callback to handle page size changes.
 */
export interface ViewSwitcherProps extends BaseTableProps {
  data: CompanyProperties[];
  allFilteredData: CompanyProperties[];
  geojson?: FeatureCollection<Point, CompanyProperties & { addressType?: AddressType }>;
  viewMode: ViewMode;
  selectedBusinesses: CompanyProperties[];
  setViewMode: (mode: ViewMode) => void;
  pageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
}

/**
 * Dashboard view configuration
 */
export interface ViewConfig {
  id: string;
  title: string;
  icon: string;
  component: React.LazyExoticComponent<React.ComponentType<Record<string, unknown>>>;
}

/**
 * Dashboard configuration
 */
export interface DashboardConfig {
  defaultView: string;
  views: ViewConfig[];
  theme: {
    default: 'light' | 'dark';
    storageKey: string;
  };
  sidebar: {
    defaultCollapsed: boolean;
    storageKey: string;
  };
}
