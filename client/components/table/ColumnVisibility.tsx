import { columns } from '@/components/table/tableConfig';
import { useCompanyStore } from '@/store/useCompanyStore';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react';
import { Icon } from '@iconify/react';

export function ColumnVisibilityDropdown() {
  const visibleColumns = useCompanyStore((state) => state.visibleColumns);
  const toggleColumnVisibility = useCompanyStore((state) => state.toggleColumnVisibility);

  const selectedKeys = new Set(visibleColumns.map((col) => col.key));

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
        classNames={{
          base: 'text-left',
        }}
        disallowEmptySelection
        aria-label="Columns"
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        onSelectionChange={(keys) => {
          const selected = keys as unknown as Set<string>;
          for (const col of columns) {
            const isVisible = selected.has(col.key);
            const isCurrentlyVisible = visibleColumns.some((v) => v.key === col.key);
            if (isVisible !== isCurrentlyVisible) {
              toggleColumnVisibility(col.key);
            }
          }
        }}
      >
        {columns
          .filter((col) => col.userVisible !== false) // ✅ only show user-visible
          .map((item) => (
            <DropdownItem key={item.key}>{item.label}</DropdownItem>
          ))}
      </DropdownMenu>
    </Dropdown>
  );
}
