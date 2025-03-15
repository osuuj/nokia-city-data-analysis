'use client';

import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react';
import { Icon } from '@iconify/react';
import type { Selection } from '@react-types/shared';

interface Column {
  uid: string;
  name: string;
}

interface TableColumnVisibilityProps {
  columns: Column[];
  visibleColumns: Set<string>;
  setVisibleColumns: (selected: Set<string>) => void;
}

export default function TableColumnVisibility({
  columns,
  visibleColumns,
  setVisibleColumns,
}: TableColumnVisibilityProps) {
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
        aria-label="Select Columns"
        items={columns.filter((c) => c.uid !== 'actions')} // ✅ Hide "actions" column
        selectedKeys={Array.from(visibleColumns)}
        selectionMode="multiple"
        onSelectionChange={(keys: Selection) => {
          // ✅ Convert keys to a Set<string>
          const newSelection = new Set([...keys].map((key) => String(key)));
          setVisibleColumns(newSelection);
        }}
      >
        {(item: Column) => (
          <DropdownItem key={item.uid} isSelected={visibleColumns.has(item.uid)}>
            {item.name}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}
