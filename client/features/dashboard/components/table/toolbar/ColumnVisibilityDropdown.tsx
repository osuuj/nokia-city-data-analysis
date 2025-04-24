'use client';

import { columns } from '@/config/columns';
import { AccessibleIconify } from '@/icons/AccessibleIconify';
import { useCompanyStore } from '@/store/useCompanyStore';
import type { TableColumnConfig } from '@/types/table';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react';
import { useEffect, useState } from 'react';

/**
 * ColumnVisibilityDropdown
 * A dropdown menu that lets the user toggle column visibility on the table.
 */
export function ColumnVisibilityDropdown() {
  const visibleColumns = useCompanyStore((state) => state.visibleColumns);
  const toggleColumnVisibility = useCompanyStore((state) => state.toggleColumnVisibility);
  const [isOpen, setIsOpen] = useState(false);

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

  const selectedKeys = new Set<string>(visibleColumns.map((col: TableColumnConfig) => col.key));

  return (
    <Dropdown
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      closeOnSelect={false}
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
              icon="solar:sort-horizontal-linear"
              width={16}
              className="text-default-400"
              ariaLabel="Toggle columns"
            />
          }
          aria-label="Toggle column visibility"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span className="hidden xs:inline-block text-[10px] xs:text-xs sm:text-sm">Columns</span>
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        classNames={{
          base: 'text-left min-w-[180px] focus:outline-none focus:ring-0',
          list: 'max-h-[300px] overflow-y-auto',
        }}
        disallowEmptySelection
        aria-label="Toggle column visibility"
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        onSelectionChange={(keys) => {
          const selected = keys as Set<string>;
          for (const col of columns) {
            const isVisible = selected.has(col.key);
            const isCurrentlyVisible = visibleColumns.some(
              (v: TableColumnConfig) => v.key === col.key,
            );
            if (isVisible !== isCurrentlyVisible) {
              toggleColumnVisibility(col.key);
            }
          }
        }}
      >
        {columns
          .filter((col: TableColumnConfig) => col.userVisible !== false)
          .map((item: TableColumnConfig) => (
            <DropdownItem
              key={item.key}
              className="text-[10px] xs:text-xs sm:text-sm h-6 xs:h-7 sm:h-8 focus:outline-none focus:ring-0 data-[selected=true]:bg-default-100 data-[selected=true]:text-default-800"
              aria-label={`${item.label} column ${selectedKeys.has(item.key) ? 'visible' : 'hidden'}`}
            >
              {item.label}
            </DropdownItem>
          ))}
      </DropdownMenu>
    </Dropdown>
  );
}
