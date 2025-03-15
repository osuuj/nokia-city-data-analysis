'use client';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
}

export default function TablePagination({
  currentPage,
  totalPages,
  goToPage,
}: TablePaginationProps) {
  // ✅ Ensure goToPage does not update state unnecessarily
  const handlePrevious = () => {
    if (currentPage > 1) goToPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) goToPage(currentPage + 1);
  };

  return (
    <div className="flex justify-center items-center gap-4 mt-4">
      {/* ✅ Previous Page Button */}
      <Button
        size="sm"
        variant="light"
        aria-label="Previous Page"
        onPress={handlePrevious}
        disabled={currentPage === 1}
      >
        <Icon icon="solar:arrow-left-outline" width={16} />
      </Button>

      {/* ✅ Page Indicator */}
      <span className="text-sm text-gray-500">
        Page {currentPage} of {totalPages}
      </span>

      {/* ✅ Next Page Button */}
      <Button
        size="sm"
        variant="light"
        aria-label="Next Page"
        onPress={handleNext}
        disabled={currentPage === totalPages}
      >
        <Icon icon="solar:arrow-right-outline" width={16} />
      </Button>
    </div>
  );
}
