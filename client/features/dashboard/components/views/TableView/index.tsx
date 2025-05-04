'use client';

import { useTableData } from '@/features/dashboard/hooks/useTableData';
import type {
  CompanyProperties,
  CompanyTableKey,
  SortDescriptor as HookSortDescriptor,
  SortDescriptor,
  TableColumnConfig,
  TableViewProps,
} from '@/features/dashboard/types';
import { ErrorBoundary, ErrorMessage } from '@/shared/components/error';
import type React from 'react';
import { Suspense, useCallback, useMemo, useState } from 'react';
import { TableViewComponent } from './TableView';
import { TableSkeleton } from './skeletons';

// Define UI-specific types for the component
type UIDirection = 'ascending' | 'descending';
interface UISortDescriptor {
  column: CompanyTableKey;
  direction: UIDirection;
}

// Type guards to ensure correct conversion
const isUIDirection = (direction: unknown): direction is UIDirection => {
  return direction === 'ascending' || direction === 'descending';
};

// Convert UI direction to hook direction
const convertToHookDirection = (uiDirection: UIDirection): 'asc' | 'desc' => {
  return uiDirection === 'ascending' ? 'asc' : 'desc';
};

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
  // Internal state to track search term
  const [internalSearchTerm, setInternalSearchTerm] = useState(searchTerm);

  // Ensure UI direction is properly typed and create a memoized hook descriptor
  const initialHookSortDescriptor = useMemo(() => {
    const uiDirection = isUIDirection(sortDescriptor.direction)
      ? sortDescriptor.direction
      : 'ascending';

    return {
      column: sortDescriptor.column,
      direction: convertToHookDirection(uiDirection),
    } as HookSortDescriptor;
  }, [sortDescriptor]);

  // Use the enhanced useTableData hook
  const {
    paginatedData,
    filteredData,
    currentPage: hookCurrentPage,
    totalPages: hookTotalPages,
    isLoading: hookIsLoading,
    setCurrentPage,
    setPageSize,
    updateSortDescriptor,
    error,
  } = useTableData({
    data: allFilteredData,
    pageSize,
    searchTerm: internalSearchTerm,
    sortDescriptor: initialHookSortDescriptor,
    useUrlParams: true,
  });

  // Handle search changes
  const handleSearchChange = useCallback(
    (value: string) => {
      setInternalSearchTerm(value);
      setSearchTerm(value);
    },
    [setSearchTerm],
  );

  // Custom sort handler that handles column clicks
  const handleSortChange = useCallback(
    (column: string) => {
      // Type casting for safety
      const columnKey = column as CompanyTableKey;

      // Determine the current direction in UI terms
      const currentDirection = isUIDirection(sortDescriptor.direction)
        ? sortDescriptor.direction
        : 'ascending';

      // Get the new direction in UI terms
      const newDirection: UIDirection =
        columnKey === sortDescriptor.column
          ? currentDirection === 'ascending'
            ? 'descending'
            : 'ascending'
          : 'ascending';

      // Update the hook's internal state
      updateSortDescriptor({
        column: columnKey,
        direction: convertToHookDirection(newDirection),
      });

      // Update external state with UI direction for backward compatibility
      setSortDescriptor({
        column: columnKey,
        direction: newDirection === 'ascending' ? 'asc' : 'desc',
      });
    },
    [sortDescriptor, setSortDescriptor, updateSortDescriptor],
  );

  // Create a wrapper function that conforms to Dispatch<SetStateAction<SortDescriptor>>
  const sortDescriptorSetter = useCallback<React.Dispatch<React.SetStateAction<SortDescriptor>>>(
    (value) => {
      if (typeof value === 'function') {
        // Handle functional updates
        setSortDescriptor(value);
      } else {
        // Handle direct value updates
        setSortDescriptor(value);
      }
    },
    [setSortDescriptor],
  );

  // Handle page changes
  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      // Update external state for backward compatibility
      if (onPageChange) {
        onPageChange(page);
      }
    },
    [onPageChange, setCurrentPage],
  );

  // Handle page size changes
  const handlePageSizeChange = useCallback(
    (size: number) => {
      setPageSize(size);
      // Update external state for backward compatibility
      if (onPageSizeChange) {
        onPageSizeChange(size);
      }
    },
    [onPageSizeChange, setPageSize],
  );

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
            data={paginatedData}
            columns={columns}
            currentPage={hookCurrentPage}
            totalPages={hookTotalPages}
            onPageChange={handlePageChange}
            isLoading={hookIsLoading || isLoading}
            searchTerm={internalSearchTerm}
            setSearchTerm={handleSearchChange}
            sortDescriptor={sortDescriptor}
            setSortDescriptor={sortDescriptorSetter}
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
            emptyStateReason={error ? error.message : emptyStateReason}
            allFilteredData={filteredData}
          />
        </div>
      </Suspense>
    </ErrorBoundary>
  );
};
