import { Button } from '@heroui/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
  pageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
  totalItems?: number;
}

/**
 * PaginationControls component
 *
 * Renders pagination controls for navigating through pages of data.
 * Includes previous/next buttons, current page indicator, and page size selector.
 *
 * @param props - Component props
 * @returns The rendered pagination controls
 */
export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
  pageSize = 10,
  onPageSizeChange,
  totalItems = 0,
}: PaginationControlsProps) {
  const [selectedPageSize, setSelectedPageSize] = useState(pageSize);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = Number.parseInt(e.target.value, 10);
    setSelectedPageSize(newPageSize);
    if (onPageSizeChange) {
      onPageSizeChange(newPageSize);
    }
  };

  // Calculate the range of items being displayed
  const startItem = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-2 border-t gap-2">
      <div className="flex items-center gap-2">
        <Button
          variant="bordered"
          size="sm"
          onPress={handlePreviousPage}
          disabled={currentPage === 1 || isLoading}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">
          {totalItems > 0 ? (
            <>
              Showing {startItem}-{endItem} of {totalItems} items
              <span className="mx-2">|</span>
              Page {currentPage} of {totalPages}
            </>
          ) : (
            <>No items to display</>
          )}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show:</span>
            <select
              className="w-20 h-9 rounded-md border border-gray-300 px-2 text-sm"
              value={selectedPageSize}
              onChange={handlePageSizeChange}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        )}

        <Button
          variant="bordered"
          size="sm"
          onPress={handleNextPage}
          disabled={currentPage === totalPages || isLoading}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
