import type { SortDescriptor } from '@/components/table/tableConfig';
import { columns } from '@/components/table/tableConfig';
import type { Business } from '@/types/business';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react';
import { Icon } from '@iconify/react';

interface SortDropdownProps {
  setSortDescriptor: React.Dispatch<React.SetStateAction<SortDescriptor>>;
}

export function SortDropdown({ setSortDescriptor }: SortDropdownProps) {
  // ✅ Filter only columns where visible: false
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
