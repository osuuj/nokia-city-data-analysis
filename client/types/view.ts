import type { FeatureCollection, Point } from 'geojson';
import type { CompanyProperties } from './business';
import type { TableViewProps } from './table';

/**
 * Defines possible view modes explicitly for displaying company data.
 */
export type ViewMode = 'table' | 'map' | 'split';

/**
 * @interface ViewSwitcherProps
 *
 * Props for switching between Table and Map views explicitly.
 *
 * @extends Omit<TableViewProps, 'data'>
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
  geojson?: FeatureCollection<Point, CompanyProperties>;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}
