import { columns } from '@/components/table/tableConfig';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react';
import { Icon } from '@iconify/react';

export function ColumnVisibilityDropdown({ visibleColumns, setVisibleColumns }) {
  return (
    <Dropdown closeOnSelect={false}>
      <DropdownTrigger>
        <Button
          className="bg-default-100 text-default-800"
          size="sm"
          startContent={
            <Icon className="text-default-400" icon="solar:sort-horizontal-linear" width={16} />
          }
        >
          Columns
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        disallowEmptySelection
        aria-label="Columns"
        selectedKeys={visibleColumns}
        selectionMode="multiple"
        onSelectionChange={setVisibleColumns}
      >
        {columns.map((item) => (
          <DropdownItem key={item.key}>{item.label}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
