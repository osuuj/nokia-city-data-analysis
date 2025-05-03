'use client';

import type { CompanyTableKey, TableColumnConfig } from '@/features/dashboard/types';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { type Key, useCallback, useEffect, useMemo, useState } from 'react';

interface ColumnVisibilityDropdownProps {
  columns: TableColumnConfig[];
  visibleColumnKeys: Set<CompanyTableKey>;
  onVisibilityChange: (keys: Set<CompanyTableKey>) => void;
}

/**
 * ColumnVisibilityDropdown component
 * A dropdown menu that lets users toggle column visibility in the table
 */
export function ColumnVisibilityDropdown({
  columns,
  visibleColumnKeys,
  onVisibilityChange,
}: ColumnVisibilityDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

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

  // Filter columns that can be toggled by users
  const toggleableColumns = useMemo(
    () => columns.filter((col) => col.userVisible !== false),
    [columns],
  );

  // Default visibility - all toggleable columns are visible
  const defaultVisibleKeys = useMemo(() => {
    return new Set(toggleableColumns.map((col) => col.key));
  }, [toggleableColumns]);

  // Handle resetting columns to default
  const handleResetColumns = useCallback(() => {
    onVisibilityChange(defaultVisibleKeys);
    setIsOpen(false);
  }, [defaultVisibleKeys, onVisibilityChange]);

  // Handle selection changes
  const handleSelectionChange = useCallback(
    (keys: Set<Key> | 'all') => {
      if (keys === 'all') return;

      // Convert the generic Key type to our specific CompanyTableKey type
      const selectedKeys = new Set<CompanyTableKey>();
      for (const key of keys) {
        selectedKeys.add(key as CompanyTableKey);
      }

      onVisibilityChange(selectedKeys);
    },
    [onVisibilityChange],
  );

  // Determine if the dropdown should show an "active" state
  const isActive = useMemo(() => {
    // If not all toggleable columns are visible, the dropdown is in an active state
    return visibleColumnKeys.size !== toggleableColumns.length;
  }, [visibleColumnKeys.size, toggleableColumns.length]);

  return (
    <Dropdown
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      closeOnSelect={false}
      placement="bottom-end"
      shouldFlip={true}
      onKeyDown={handleKeyDown}
    >
      <DropdownTrigger>
        <Button
          className={`
            bg-default-100 text-default-800 min-w-0 px-2 sm:px-3 hover:bg-default-200
            transition-colors duration-200
            ${isActive ? 'bg-primary-100 text-primary-800' : ''}
          `}
          size="sm"
          startContent={
            <Icon
              icon="lucide:columns"
              width={16}
              className={isActive ? 'text-primary-500' : 'text-default-500'}
            />
          }
          aria-label="Toggle column visibility"
        >
          <span className="hidden xs:inline-block text-xs">
            Columns {isActive ? `(${visibleColumnKeys.size}/${toggleableColumns.length})` : ''}
          </span>
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        className="min-w-[180px] max-w-[250px]"
        disallowEmptySelection
        aria-label="Toggle column visibility"
        selectedKeys={visibleColumnKeys}
        selectionMode="multiple"
        onSelectionChange={handleSelectionChange}
      >
        <DropdownSection aria-label="Columns">
          {toggleableColumns.map((column) => (
            <DropdownItem key={column.key} className="text-xs py-1 h-8">
              {column.label}
            </DropdownItem>
          ))}
        </DropdownSection>

        <DropdownSection aria-label="Actions">
          <DropdownItem key="divider" className="h-px bg-default-200 my-1 p-0" isReadOnly />
          <DropdownItem
            key="reset"
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
