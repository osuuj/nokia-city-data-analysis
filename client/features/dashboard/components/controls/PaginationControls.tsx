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
 * Simplified PaginationControls component
 *
 * A minimal pagination indicator that shows the current state without buttons.
 *
 * @param props - Component props
 * @returns The rendered pagination controls
 */
export function PaginationControls({
  currentPage,
  totalPages,
  totalItems = 0,
}: PaginationControlsProps) {
  // Calculate the range of items being displayed
  const startItem = totalItems > 0 ? (currentPage - 1) * (totalItems / totalPages) + 1 : 0;
  const endItem = Math.min(currentPage * (totalItems / totalPages), totalItems);

  return (
    <div className="flex justify-center items-center px-4 py-3 border-t">
      <div className="text-sm text-gray-600">
        {totalItems > 0 ? (
          <>
            Showing {Math.round(startItem)}-{Math.round(endItem)} of {totalItems} items
            <span className="mx-2">|</span>
            Page {currentPage} of {totalPages}
          </>
        ) : (
          <>No items to display</>
        )}
      </div>
    </div>
  );
}
