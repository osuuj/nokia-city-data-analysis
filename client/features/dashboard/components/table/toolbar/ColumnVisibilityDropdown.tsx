'use client';

import type { TableColumnConfig } from '@/features/dashboard/types';
import { cn } from '@/shared/utils/cn';
import { useCompanyStore } from '@features/dashboard/store';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { columns } from '@shared/config/columns';
import { type Key, useCallback, useEffect, useMemo, useState } from 'react';

/**
 * ColumnVisibilityDropdown
 * A dropdown menu that lets the user toggle column visibility on the table.
 */
export function ColumnVisibilityDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const visibleColumns = useCompanyStore((state) => state.visibleColumns);
  const toggleColumnVisibility = useCompanyStore((state) => state.toggleColumnVisibility);
  const resetColumns = useCompanyStore((state) => state.resetColumns);

  // Get selected keys for the dropdown
  const selectedKeys = useMemo(() => {
    return new Set(visibleColumns.map((col) => col.key));
  }, [visibleColumns]);

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

  // Handle resetting columns to default
  const handleResetColumns = useCallback(() => {
    resetColumns();
    // Close the dropdown after resetting
    setIsOpen(false);
  }, [resetColumns]);

  // Filter columns that can be toggled by users
  const toggleableColumns = useMemo(
    () => columns.filter((col: TableColumnConfig) => col.userVisible !== false),
    [],
  );

  // Handle selection changes directly
  const handleSelectionChange = useCallback(
    (keys: Set<Key> | 'all') => {
      if (keys === 'all') return;

      const selected = keys as Set<string>;

      for (const col of columns) {
        if (!col.userVisible) continue; // Skip columns that users shouldn't toggle

        const isVisible = selected.has(col.key);
        const isCurrentlyVisible = visibleColumns.some((v) => v.key === col.key);

        if (isVisible !== isCurrentlyVisible) {
          toggleColumnVisibility(col.key);
        }
      }
    },
    [visibleColumns, toggleColumnVisibility],
  );

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
            {
              'bg-primary-100 text-primary-800':
                visibleColumns.length !== columns.filter((c) => c.visible).length,
            },
          )}
          size="sm"
          startContent={
            <Icon
              icon="lucide:columns"
              width={16}
              className={
                visibleColumns.length !== columns.filter((c) => c.visible).length
                  ? 'text-primary-500'
                  : 'text-default-500'
              }
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
        onSelectionChange={handleSelectionChange}
      >
        <DropdownSection aria-label="Columns" items={toggleableColumns}>
          {(column) => (
            <DropdownItem
              key={column.key}
              textValue={column.label}
              className={cn(
                'text-xs py-1 h-8',
                'data-[selected=true]:bg-default-100 data-[selected=true]:text-default-800',
                'transition-colors duration-200',
              )}
            >
              {column.label}
            </DropdownItem>
          )}
        </DropdownSection>

        <DropdownSection aria-label="Actions">
          <DropdownItem
            key="divider"
            textValue="Divider"
            className="h-px bg-default-200 my-1 p-0 focus:outline-none"
            isReadOnly
          />
          <DropdownItem
            key="reset"
            textValue="Reset to Default"
            className="text-xs py-1 h-8 text-primary-500 font-medium"
            onPress={handleResetColumns}
          >
            Reset to Default
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
