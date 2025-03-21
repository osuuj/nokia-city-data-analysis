import type { Business } from '@/types/business';
import type { SortDescriptor, SortDropdownProps } from '@/types/table';
import { columns } from '@/types/table';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react';
import { Icon } from '@iconify/react';

export function SortDropdown({ setSortDescriptor }: SortDropdownProps) {
  const hiddenColumns = columns.filter((col) => col.visible);

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
        className="p-1"
        classNames={{
          base: 'text-left',
        }}
      >
        {hiddenColumns.map((item) => (
          <DropdownItem
            className="text-xs md:text-sm h-6 md:h-8"
            key={item.key}
            onPress={() =>
              setSortDescriptor((prev: SortDescriptor) => ({
                column: item.key as keyof Business,
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
