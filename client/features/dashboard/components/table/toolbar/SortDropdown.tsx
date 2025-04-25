'use client';

import type { CompanyProperties } from '@/features/dashboard/types';
import type { SortDropdownProps } from '@/features/dashboard/types';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react';
import { columns } from '@shared/config/columns';
import { AccessibleIconify } from '@shared/icons';
import { useEffect, useState } from 'react';

/**
 * SortDropdown component
 * A dropdown menu for applying column sorting in the table view.
 * Provides options to sort by any visible column in ascending or descending order.
 */
export function SortDropdown({ sortDescriptor, setSortDescriptor }: SortDropdownProps) {
  // Get only visible columns for sorting options
  const visibleColumns = columns.filter((col) => col.visible);
  const [isOpen, setIsOpen] = useState(false);

  // Close dropdown on window resize to prevent layout issues
  useEffect(() => {
    const handleResize = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  // Get the current sort direction icon
  const getSortIcon = (columnKey: string) => {
    if (sortDescriptor.column !== columnKey) return 'lucide:arrow-up-down';
    return sortDescriptor.direction === 'asc' ? 'lucide:arrow-up' : 'lucide:arrow-down';
  };

  // Get the current sort label
  const getSortLabel = (columnKey: string) => {
    if (sortDescriptor.column !== columnKey) return 'Sort by';
    return `Sorted ${sortDescriptor.direction === 'asc' ? 'ascending' : 'descending'}`;
  };

  return (
    <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
      <DropdownTrigger>
        <Button
          size="sm"
          variant="flat"
          className="bg-default-100 text-default-800 min-w-0 px-2 sm:px-3 focus:outline-none focus:ring-0 hover:bg-default-200 active:bg-default-300 active:outline-none active:ring-0"
          startContent={
            <AccessibleIconify
              icon={getSortIcon(sortDescriptor.column)}
              width={16}
              className="text-default-400"
              ariaLabel={getSortLabel(sortDescriptor.column)}
            />
          }
          aria-label={getSortLabel(sortDescriptor.column)}
        >
          <span className="hidden xs:inline-block text-[10px] xs:text-xs sm:text-sm">
            {getSortLabel(sortDescriptor.column)}
          </span>
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Sort options"
        onAction={(key) => {
          const [column, direction] = String(key).split('-');
          setSortDescriptor({
            column: column as keyof CompanyProperties,
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
                width={16}
                className="text-default-400"
                ariaLabel="Sort ascending"
              />
            }
          >
            Sort {column.label} ascending
          </DropdownItem>,
          <DropdownItem
            key={`${column.key}-descending`}
            startContent={
              <AccessibleIconify
                icon="lucide:arrow-down"
                width={16}
                className="text-default-400"
                ariaLabel="Sort descending"
              />
            }
          >
            Sort {column.label} descending
          </DropdownItem>,
        ])}
      </DropdownMenu>
    </Dropdown>
  );
}
