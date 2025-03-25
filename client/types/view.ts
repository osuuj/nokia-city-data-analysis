import type { FeatureCollection, Point } from 'geojson';
import type { CompanyProperties } from './business';
import type { TableViewProps } from './table';

export type ViewMode = 'table' | 'map' | 'split';

export interface ViewSwitcherProps extends Omit<TableViewProps, 'data'> {
  data: CompanyProperties[];
  allFilteredData: CompanyProperties[]; // 👈 add this
  geojson?: FeatureCollection<Point, CompanyProperties>;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}
