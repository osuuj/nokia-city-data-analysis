'use client';

import type {
  CompanyProperties,
  TableColumnConfig,
  TableViewProps,
} from '@/features/dashboard/types';
import { ErrorBoundary, ErrorMessage } from '@/shared/components/error';
import type React from 'react';
import { Suspense } from 'react';
import { TableViewComponent } from './TableView';
import { TableSkeleton } from './skeletons';

// Adapter component to bridge between old and new structure during refactoring
export const TableView: React.FC<TableViewProps> = ({
  data,
  columns,
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
  searchTerm,
  setSearchTerm,
  sortDescriptor,
  setSortDescriptor,
  pageSize,
  onPageSizeChange,
  emptyStateReason = 'No data available for the selected filters',
  allFilteredData = [],
}) => {
  return (
    <ErrorBoundary
      fallback={
        <ErrorMessage
          title="Table Error"
          message="There was an error loading the table data. Please try again later."
        />
      }
    >
      <Suspense
        fallback={<TableSkeleton columns={columns.filter((col) => col.visible !== false)} />}
      >
        <div className="w-full h-full">
          <TableViewComponent
            data={data}
            columns={columns}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            isLoading={isLoading}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortDescriptor={sortDescriptor}
            setSortDescriptor={setSortDescriptor}
            pageSize={pageSize}
            onPageSizeChange={onPageSizeChange}
            emptyStateReason={emptyStateReason}
            allFilteredData={allFilteredData}
          />
        </div>
      </Suspense>
    </ErrorBoundary>
  );
};
