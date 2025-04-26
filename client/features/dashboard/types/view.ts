import type { FeatureCollection, Point } from 'geojson';
import type { CompanyProperties } from './business';
import type { TableViewProps } from './table';

/**
 * Defines possible view modes explicitly for displaying company data.
 */
export type ViewMode = 'table' | 'map' | 'split' | 'analytics';

/**
 * @interface ViewSwitcherProps
 *
 * Props for switching between Table and Map views explicitly.
 *
 * @extends TableViewProps
 *
 * @property data {CompanyProperties[]} - Current page data.
 * @property allFilteredData {CompanyProperties[]} - Complete dataset for filters/selections.
 * @property geojson {FeatureCollection<Point, CompanyProperties>} - GeoJSON data for map view.
 * @property viewMode {ViewMode} - Current selected view mode explicitly.
 * @property setViewMode {(mode: ViewMode) => void} - Callback to explicitly change the view mode.
 */
export interface ViewSwitcherProps extends Omit<TableViewProps, 'data'> {
  data: CompanyProperties[];
  allFilteredData: CompanyProperties[];
  geojson?: FeatureCollection<
    Point,
    CompanyProperties & { addressType?: 'Visiting address' | 'Postal address' }
  >;
  viewMode: ViewMode;
  selectedBusinesses: CompanyProperties[];
  setViewMode: (mode: ViewMode) => void;
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
