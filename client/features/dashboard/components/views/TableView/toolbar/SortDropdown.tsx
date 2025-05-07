'use client';

import { useCompanyStore } from '@/features/dashboard/store/useCompanyStore';
import type {
  SortDescriptor,
  SortDropdownProps,
  TableColumnConfig,
} from '@/features/dashboard/types/table';
import { AccessibleIconify } from '@/shared/icons/AccessibleIconify';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react';
import type React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

/**
 * SortDropdown
 * A dropdown menu to apply column sorting logic in the table.
 */
export function SortDropdown({ sortDescriptor, setSortDescriptor }: SortDropdownProps) {
  // Get visibleColumns from the store instead of filtering locally
  const visibleColumns = useCompanyStore((state) => state.visibleColumns);
  const [isOpen, setIsOpen] = useState(false);

  // Memoize the current sort direction icon
  const sortIcon = useMemo(() => {
    return 'solar:sort-from-bottom-to-top-linear';
  }, []);

  // Memoize the sort button aria label for better accessibility
  const sortButtonAriaLabel = useMemo(() => {
    if (!sortDescriptor.column) return 'Sort columns';

    const columnLabel =
      visibleColumns.find((col) => col.key === sortDescriptor.column)?.label ||
      sortDescriptor.column;
    const directionLabel = sortDescriptor.direction === 'asc' ? 'ascending' : 'descending';

    return `Currently sorted by ${columnLabel} in ${directionLabel} order`;
  }, [sortDescriptor, visibleColumns]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }, []);

  // Close dropdown on window resize
  useEffect(() => {
    const handleResize = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  return (
    <Dropdown
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      closeOnSelect
      onKeyDown={handleKeyDown}
      classNames={{
        base: 'focus:outline-none focus:ring-0',
        trigger: 'focus:outline-none focus:ring-0',
        content: 'focus:outline-none focus:ring-0',
      }}
    >
      <DropdownTrigger>
        <Button
          className="bg-default-100 text-default-800 min-w-0 px-2 sm:px-3 focus:outline-none focus:ring-0 hover:bg-default-200 active:bg-default-300 active:outline-none active:ring-0"
          size="sm"
          startContent={
            <AccessibleIconify
              icon={sortIcon}
              width={16}
              className="text-default-400"
              ariaLabel="Sort by column"
            />
          }
          aria-label={sortButtonAriaLabel}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span className="hidden xs:inline-block text-[10px] xs:text-xs sm:text-sm">Sort</span>
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        aria-label="Sort columns"
        selectionMode="single"
        selectedKeys={[sortDescriptor.column]}
        className="p-1 focus:outline-none focus:ring-0"
        classNames={{
          base: 'text-left min-w-[150px] focus:outline-none focus:ring-0',
        }}
        onSelectionChange={(keys) => {
          const key = Array.from(keys)[0] as string;
          setSortDescriptor((prev: SortDescriptor) => ({
            column: key,
            direction: prev.column === key && prev.direction === 'asc' ? 'desc' : 'asc',
          }));
        }}
      >
        {visibleColumns.map((item: TableColumnConfig) => {
          // Memoize the item aria label for each dropdown item
          const itemAriaLabel = `Sort by ${item.label} ${
            sortDescriptor.column === item.key
              ? sortDescriptor.direction === 'asc'
                ? 'ascending, click to sort descending'
                : 'descending, click to sort ascending'
              : ''
          }`;

          return (
            <DropdownItem
              key={item.key}
              className="text-[10px] xs:text-xs sm:text-sm h-6 xs:h-7 sm:h-8 focus:outline-none focus:ring-0 data-[selected=true]:bg-default-100 data-[selected=true]:text-default-800"
              textValue={item.label}
              aria-label={itemAriaLabel}
            >
              <div className="flex items-center justify-between w-full">
                <span className="truncate">{item.label}</span>
                {sortDescriptor.column === item.key && (
                  <AccessibleIconify
                    icon={
                      sortDescriptor.direction === 'asc'
                        ? 'solar:arrow-up-linear'
                        : 'solar:arrow-down-linear'
                    }
                    width={12}
                    className="text-default-400"
                    ariaLabel={`${sortDescriptor.direction === 'asc' ? 'Ascending' : 'Descending'} order`}
                  />
                )}
              </div>
            </DropdownItem>
          );
        })}
      </DropdownMenu>
    </Dropdown>
  );
}
