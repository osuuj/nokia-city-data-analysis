// 9. TableColumnSelector.tsx
// Main Purpose:
// Manages column visibility settings.

// Main Parts:

// Uses DropdownTrigger and DropdownMenu for column selection.
// Calls setVisibleColumns to update visible columns.
// Prevents removing all columns to maintain table structure.


import React from "react";
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { Icon } from "@iconify/react";

const TableColumnSelector = ({ columns, visibleColumns, setVisibleColumns }) => {
  return (
    <Dropdown closeOnSelect={false}>
      <DropdownTrigger>
        <Button className="bg-default-100 text-default-800" size="sm" startContent={<Icon className="text-default-400" icon="solar:sort-horizontal-linear" width={16} />}>
          Columns
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        disallowEmptySelection
        aria-label="Columns"
        items={columns.filter((c) => !["actions"].includes(c.uid))}
        selectedKeys={visibleColumns}
        selectionMode="multiple"
        onSelectionChange={setVisibleColumns}
      >
        {(item) => <DropdownItem key={item.uid}>{item.name}</DropdownItem>}
      </DropdownMenu>
    </Dropdown>
  );
};

export default TableColumnSelector;