'use client';

import type { Business } from '@/app/types/business';
import { Button, Checkbox } from '@heroui/react';

interface TableSelectionProps {
  data: Business[]; // ✅ Use Business type (matches API response)
  selectedRows: Set<string>; // ✅ Selection should match `business_id`
  toggleRowSelection: (id: string) => void;
  selectAllRows: () => void;
  clearSelection: () => void;
}

export default function TableSelection({
  data,
  selectedRows,
  toggleRowSelection,
  selectAllRows,
  clearSelection,
}: TableSelectionProps) {
  const allSelected = selectedRows.size === data.length;
  const someSelected = selectedRows.size > 0 && selectedRows.size < data.length;

  return (
    <div className="flex justify-between items-center mb-2">
      {/* ✅ Select All Checkbox */}
      <Checkbox
        isSelected={allSelected}
        isIndeterminate={someSelected} // ✅ Show partial selection state
        onChange={() => (allSelected ? clearSelection() : selectAllRows())}
      >
        Select All
      </Checkbox>

      {/* ✅ Clear Selection Button */}
      <Button
        size="sm"
        variant="light"
        aria-label="Clear selection"
        onClick={clearSelection}
        disabled={selectedRows.size === 0}
      >
        Clear Selection
      </Button>
    </div>
  );
}
