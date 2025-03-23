'use client';

import type { Business } from '@/types/business';
import type { SortDropdownProps } from '@/types/table';
import { columns } from '@/types/table';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react';
import { Icon } from '@iconify/react';
/**
 * SortDropdown
 * A dropdown menu to apply column sorting logic in the table.
 */
export function SortDropdown({ sortDescriptor, setSortDescriptor }: SortDropdownProps) {
  const visibleColumns = columns.filter((col) => col.visible);

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          className="bg-default-100 text-default-800"
          size="sm"
          startContent={<Icon className="text-default-400" icon="solar:sort-linear" width={16} />}
        >
          Sort
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        aria-label="Sort"
        selectionMode="single"
        selectedKeys={[sortDescriptor.column]}
        className="p-1"
        classNames={{
          base: 'text-left',
        }}
        onSelectionChange={(keys) => {
          const key = Array.from(keys)[0] as keyof Business;
          setSortDescriptor((prev) => ({
            column: key,
            direction: prev.column === key && prev.direction === 'asc' ? 'desc' : 'asc',
          }));
        }}
      >
        {visibleColumns.map((item) => (
          <DropdownItem
            key={item.key}
            className="text-xs md:text-sm h-6 md:h-8"
            textValue={item.label}
          >
            {item.label}
            {sortDescriptor.column === item.key && (
              <span className="ml-2 text-default-400">
                {sortDescriptor.direction === 'asc' ? '▲' : '▼'}
              </span>
            )}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
