import { columns } from '@/components/table/tableConfig';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useState } from 'react';

export function SortDropdown({ setSortDescriptor }) {
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
      <DropdownMenu aria-label="Sort">
        {columns.map((item) => (
          <DropdownItem
            key={item.key}
            onPress={() =>
              setSortDescriptor((prev) => ({
                column: item.key,
                direction: prev.column === item.key && prev.direction === 'asc' ? 'desc' : 'asc',
              }))
            }
          >
            {item.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
