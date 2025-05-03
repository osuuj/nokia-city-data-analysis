'use client';

import type {
  CompanyTableKey,
  SortDescriptor,
  TableColumnConfig,
} from '@/features/dashboard/types';
import { Button, Tooltip } from '@heroui/react';
import type React from 'react';
import { useCallback, useMemo, useState } from 'react';
import { ColumnVisibilityDropdown } from './ColumnVisibilityDropdown';
import { SortDropdown } from './SortDropdown';

interface TableToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  columns: TableColumnConfig[];
  selectedCount: number;
  useLocation: boolean;
  setUseLocation: (value: boolean) => void;
  address: string;
  setAddress: (value: string) => void;
  sortDescriptor?: SortDescriptor;
  setSortDescriptor?: (value: SortDescriptor) => void;
}

export const TableToolbar: React.FC<TableToolbarProps> = ({
  searchTerm,
  onSearchChange,
  columns,
  selectedCount,
  useLocation,
  setUseLocation,
  address,
  setAddress,
  sortDescriptor,
  setSortDescriptor,
}) => {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024,
  );

  // State for visible columns
  const [visibleColumnKeys, setVisibleColumnKeys] = useState<Set<CompanyTableKey>>(
    new Set(columns.filter((col) => col.visible).map((col) => col.key)),
  );

  // Filter columns that users can toggle visibility for
  const toggleableColumns = useMemo(() => {
    return columns.filter((col) => col.userVisible !== false);
  }, [columns]);

  // Reset all filters handler
  const resetFilters = useCallback(() => {
    onSearchChange('');
    setUseLocation(false);
    setAddress('');
  }, [onSearchChange, setUseLocation, setAddress]);

  // Handle column visibility changes
  const handleVisibilityChange = useCallback((keys: Set<CompanyTableKey>) => {
    setVisibleColumnKeys(keys);
    // In a real implementation, you would also update the store or parent component
  }, []);

  return (
    <div className="p-4 border-b border-default-100">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        {/* Search input */}
        <div className="flex flex-grow items-center gap-2">
          <input
            type="text"
            placeholder="Search..."
            className="border border-default-200 p-2 rounded-md flex-grow max-w-md"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />

          {searchTerm && (
            <Button size="sm" variant="flat" className="ml-1" onClick={() => onSearchChange('')}>
              Clear
            </Button>
          )}
        </div>

        {/* Toolbar controls */}
        <div className="flex items-center gap-2">
          {selectedCount > 0 && (
            <span className="text-sm text-primary-600 font-medium">{selectedCount} selected</span>
          )}

          {sortDescriptor && setSortDescriptor && (
            <SortDropdown
              sortDescriptor={sortDescriptor}
              setSortDescriptor={setSortDescriptor}
              columns={columns}
            />
          )}

          {toggleableColumns.length > 0 && (
            <ColumnVisibilityDropdown
              columns={columns}
              visibleColumnKeys={visibleColumnKeys}
              onVisibilityChange={handleVisibilityChange}
            />
          )}

          <Tooltip content="Reset all filters" placement="top">
            <Button
              size="sm"
              variant="flat"
              onClick={resetFilters}
              isDisabled={!searchTerm && !useLocation}
            >
              Reset
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
