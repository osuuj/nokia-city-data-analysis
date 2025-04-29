'use client';

import type { TableColumnConfig } from '@/features/dashboard/types';
import { cn } from '@/shared/utils/cn';
import { useCompanyStore } from '@features/dashboard/store';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react';
import { Icon } from '@iconify/react';
import { columns } from '@shared/config/columns';
import { useCallback, useEffect, useState } from 'react';

/**
 * ColumnVisibilityDropdown
 * A dropdown menu that lets the user toggle column visibility on the table.
 */
export function ColumnVisibilityDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const visibleColumns = useCompanyStore((state) => state.visibleColumns);
  const toggleColumnVisibility = useCompanyStore((state) => state.toggleColumnVisibility);

  // Get selected keys for the dropdown
  const selectedKeys = new Set(visibleColumns.map((col) => col.key));

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }, []);

  // Close dropdown when window is resized
  useEffect(() => {
    const handleResize = () => {
      setIsOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Dropdown
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      closeOnSelect={false}
      placement="bottom-end"
      shouldFlip={true}
      onKeyDown={handleKeyDown}
      classNames={{
        base: 'z-40',
        content: 'min-w-[180px] max-w-[250px]',
      }}
    >
      <DropdownTrigger>
        <Button
          className={cn(
            'bg-default-100 text-default-800 min-w-0 px-2 sm:px-3 hover:bg-default-200',
            'transition-colors duration-200',
          )}
          size="sm"
          startContent={
            <Icon
              icon="lucide:columns"
              width={16}
              className="text-default-500"
              aria-hidden="true"
            />
          }
          aria-label="Toggle column visibility"
        >
          <span className="hidden xs:inline-block text-xs">Columns</span>
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        classNames={{
          base: 'text-left',
          list: 'max-h-[300px] overflow-y-auto p-1',
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
              className={cn(
                'text-xs py-1 h-8',
                'data-[selected=true]:bg-default-100 data-[selected=true]:text-default-800',
                'transition-colors duration-200',
              )}
              aria-label={`${item.label} column ${selectedKeys.has(item.key) ? 'visible' : 'hidden'}`}
            >
              {item.label}
            </DropdownItem>
          ))}
      </DropdownMenu>
    </Dropdown>
  );
}
