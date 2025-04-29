'use client';

import type { CompanyTableKey, SortDescriptor } from '@/features/dashboard/types';
import { AccessibleIconify } from '@/shared/icons/AccessibleIconify';
import { cn } from '@/shared/utils/cn';
import { useCompanyStore } from '@features/dashboard/store';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react';
import { useCallback, useMemo, useState } from 'react';

interface SortDropdownProps {
  sortDescriptor: SortDescriptor;
  setSortDescriptor: (value: SortDescriptor) => void;
  'aria-label'?: string;
}

/**
 * SortDropdown component
 * A dropdown menu for applying column sorting in the table view.
 * Provides options to sort by any visible column in ascending or descending order.
 */
export function SortDropdown({
  sortDescriptor,
  setSortDescriptor,
  'aria-label': ariaLabel,
}: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const visibleColumns = useCompanyStore((state) => state.visibleColumns);

  // Get the current sort direction icon
  const getSortIcon = useCallback(() => {
    if (!sortDescriptor.column) return 'lucide:arrow-up-down';
    return sortDescriptor.direction === 'asc' ? 'lucide:arrow-up' : 'lucide:arrow-down';
  }, [sortDescriptor]);

  // Get the current sort label
  const getSortLabel = useCallback(() => {
    if (!sortDescriptor.column) return 'Sort';
    // Find column label by key
    const columnLabel =
      visibleColumns.find((col) => col.key === sortDescriptor.column)?.label ||
      sortDescriptor.column;
    return `${columnLabel} (${sortDescriptor.direction === 'asc' ? '↑' : '↓'})`;
  }, [sortDescriptor, visibleColumns]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }, []);

  // Memoize the sort icon to prevent unnecessary re-renders
  const sortIcon = useMemo(() => getSortIcon(), [getSortIcon]);

  // Memoize the sort label to prevent unnecessary re-renders
  const sortLabel = useMemo(() => getSortLabel(), [getSortLabel]);

  return (
    <Dropdown
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      placement="bottom-end"
      shouldFlip={true}
      onKeyDown={handleKeyDown}
    >
      <DropdownTrigger>
        <Button
          size="sm"
          className={cn(
            'bg-default-100 text-default-800 min-w-0 px-2 sm:px-3 hover:bg-default-200',
            'transition-colors duration-200',
          )}
          startContent={
            <AccessibleIconify
              icon={sortIcon}
              className="text-default-500"
              width={16}
              ariaLabel={`${sortLabel} icon`}
            />
          }
          aria-label={ariaLabel || `Sort: ${sortLabel}`}
        >
          <span className="hidden xs:inline-block text-xs truncate max-w-[80px]">{sortLabel}</span>
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Sort options"
        className="max-h-[400px] overflow-y-auto"
        onAction={(key) => {
          const [column, direction] = String(key).split('-');
          setSortDescriptor({
            column: column as CompanyTableKey,
            direction: direction === 'ascending' ? 'asc' : 'desc',
          });
          setIsOpen(false);
        }}
      >
        {visibleColumns.flatMap((column) => [
          <DropdownItem
            key={`${column.key}-ascending`}
            startContent={
              <AccessibleIconify
                icon="lucide:arrow-up"
                className="text-default-500"
                width={16}
                ariaLabel={`Sort ${column.label} ascending icon`}
              />
            }
            className="text-xs py-1"
            aria-label={`Sort ${column.label} ascending`}
          >
            {column.label} (ascending)
          </DropdownItem>,
          <DropdownItem
            key={`${column.key}-descending`}
            startContent={
              <AccessibleIconify
                icon="lucide:arrow-down"
                className="text-default-500"
                width={16}
                ariaLabel={`Sort ${column.label} descending icon`}
              />
            }
            className="text-xs py-1"
            aria-label={`Sort ${column.label} descending`}
          >
            {column.label} (descending)
          </DropdownItem>,
        ])}
      </DropdownMenu>
    </Dropdown>
  );
}
