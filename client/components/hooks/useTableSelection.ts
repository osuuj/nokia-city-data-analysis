import type { Business } from '@/app/types/business'; // Use Business type to match API data
import { useState } from 'react';

interface UseTableSelectionReturn {
  selectedRows: Set<string>; // Use string IDs to match `business_id` from API
  toggleRowSelection: (id: string) => void;
  isRowSelected: (id: string) => boolean;
  selectAllRows: () => void;
  clearSelection: () => void;
}

export function useTableSelection(data: Business[]): UseTableSelectionReturn {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const toggleRowSelection = (id: string) => {
    setSelectedRows((prevSelected) => {
      const newSelection = new Set(prevSelected);
      if (newSelection.has(id)) {
        newSelection.delete(id);
      } else {
        newSelection.add(id);
      }
      return newSelection;
    });
  };

  const isRowSelected = (id: string): boolean => selectedRows.has(id);

  const selectAllRows = () =>
    setSelectedRows(new Set(data.map((item: Business) => item.business_id)));

  const clearSelection = () => setSelectedRows(new Set());

  return {
    selectedRows,
    toggleRowSelection,
    isRowSelected,
    selectAllRows,
    clearSelection,
  };
}
