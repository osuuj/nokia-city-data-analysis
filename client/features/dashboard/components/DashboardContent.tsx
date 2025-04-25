import { ViewSwitcher } from '@/features/dashboard/components/ViewSwitcher';
import { useFilteredBusinesses } from '@/features/dashboard/hooks';
import type {
  CompanyProperties,
  SortDescriptor,
  TableColumnConfig,
  ViewMode,
} from '@/features/dashboard/types';
import { transformCompanyGeoJSON } from '@/features/dashboard/utils/geo';
import { usePagination } from '@/shared/hooks';
import type { FeatureCollection, Point } from 'geojson';
import { useMemo } from 'react';
import type { Dispatch, SetStateAction } from 'react';

interface DashboardContentProps {
  data: CompanyProperties[];
  allFilteredData: CompanyProperties[];
  selectedBusinesses: CompanyProperties[];
  geojson: FeatureCollection<Point, CompanyProperties>;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  columns: TableColumnConfig[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortDescriptor: SortDescriptor;
  setSortDescriptor: Dispatch<SetStateAction<SortDescriptor>>;
}

/**
 * DashboardContent component for the main content of the dashboard
 * Extracted from the dashboard page for better separation of concerns
 */
export function DashboardContent({
  data,
  allFilteredData,
  selectedBusinesses,
  geojson,
  viewMode,
  setViewMode,
  columns,
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
  searchTerm,
  setSearchTerm,
  sortDescriptor,
  setSortDescriptor,
}: DashboardContentProps) {
  return (
    <ViewSwitcher
      data={data}
      allFilteredData={allFilteredData}
      selectedBusinesses={selectedBusinesses}
      geojson={geojson}
      viewMode={viewMode}
      setViewMode={setViewMode}
      columns={columns}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      isLoading={isLoading}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      sortDescriptor={sortDescriptor}
      setSortDescriptor={setSortDescriptor}
    />
  );
}
