import type { Business } from '@/app/types/business'; // Use the Business type instead of Company
import { useMemo, useState } from 'react';

interface UseTablePaginationReturn {
  paginatedItems: Business[]; // Updated to Business type
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
}

export function useTablePagination(data: Business[], itemsPerPage = 10): UseTablePaginationReturn {
  const [currentPage, setCurrentPage] = useState<number>(1); // Ensures currentPage is typed as a number

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  }, [data, currentPage, itemsPerPage]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return {
    paginatedItems,
    currentPage,
    totalPages,
    goToPage,
  };
}
