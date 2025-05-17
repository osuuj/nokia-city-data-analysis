'use client';

import { columns } from '@/features/dashboard/config/columns';
import { useCompanyStore } from '@/features/dashboard/store/useCompanyStore';
import type { TableColumnConfig } from '@/features/dashboard/types/table';
import { AccessibleIconify } from '@/shared/icons/AccessibleIconify';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from '@heroui/react';
import type React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

/**
 * ColumnVisibilityDropdown
 * A dropdown menu that lets the user toggle column visibility on the table.
 */
export function ColumnVisibilityDropdown() {
  const visibleColumns = useCompanyStore(
    (state: { visibleColumns: TableColumnConfig[] }) => state.visibleColumns,
  );
  const toggleColumnVisibility = useCompanyStore(
    (state: { toggleColumnVisibility: (key: string) => void }) => state.toggleColumnVisibility,
  );
  const resetColumns = useCompanyStore((state: { resetColumns: () => void }) => state.resetColumns);
  const [isOpen, setIsOpen] = useState(false);

  // Memoize toggleable columns for performance
  const toggleableColumns = useMemo(() => {
    return columns.filter((col: TableColumnConfig) => col.userVisible !== false);
  }, []);

  // Get the selected keys set
  const selectedKeys = useMemo(() => {
    return new Set<string>(visibleColumns.map((col: TableColumnConfig) => col.key));
  }, [visibleColumns]);

  // Determine if the dropdown should show an "active" state (not all columns visible)
  const isActive = useMemo(() => {
    return selectedKeys.size !== toggleableColumns.length;
  }, [selectedKeys.size, toggleableColumns.length]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }, []);

  // Reset columns to default
  const handleResetColumns = useCallback(() => {
    resetColumns();
    // Don't close dropdown after reset to allow users to see the changes
  }, [resetColumns]);

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
      onOpenChange={(open) => setIsOpen(open)}
      closeOnSelect={false}
      onKeyDown={handleKeyDown}
      classNames={{
        base: 'focus:outline-none focus:ring-0',
        trigger: 'focus:outline-none focus:ring-0',
        content: 'focus:outline-none focus:ring-0',
      }}
    >
      <DropdownTrigger>
        <Button
          className={`bg-default-100 text-default-800 min-w-0 px-2 sm:px-3 focus:outline-none focus:ring-0 hover:bg-default-200 active:bg-default-300 active:outline-none active:ring-0 ${
            isActive ? 'bg-primary-50 text-primary-700 border-primary-200' : ''
          }`}
          size="sm"
          startContent={
            <AccessibleIconify
              icon="solar:sort-horizontal-linear"
              width={16}
              className={isActive ? 'text-primary-500' : 'text-default-400'}
              ariaLabel="Toggle columns"
            />
          }
          aria-label={`Toggle column visibility ${isActive ? `(${selectedKeys.size}/${toggleableColumns.length} visible)` : ''}`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span className="hidden xs:inline-block text-[10px] xs:text-xs sm:text-sm">
            Columns {isActive ? `(${selectedKeys.size}/${toggleableColumns.length})` : ''}
          </span>
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
        <DropdownSection aria-label="Columns" showDivider>
          {toggleableColumns.map((item: TableColumnConfig) => (
            <DropdownItem
              key={item.key}
              className="text-[10px] xs:text-xs sm:text-sm h-6 xs:h-7 sm:h-8 focus:outline-none focus:ring-0 data-[selected=true]:bg-default-100 data-[selected=true]:text-default-800 text-foreground"
              aria-label={`${item.label} column ${selectedKeys.has(item.key) ? 'visible' : 'hidden'}`}
            >
              <span className="text-foreground">{item.label}</span>
            </DropdownItem>
          ))}
        </DropdownSection>

        <DropdownSection aria-label="Actions">
          <DropdownItem
            key="reset"
            className="text-[10px] xs:text-xs sm:text-sm h-6 xs:h-7 sm:h-8 focus:outline-none focus:ring-0 text-primary-600 font-medium"
            onPress={handleResetColumns}
            aria-label="Reset columns to default visibility"
          >
            Reset to Default
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
