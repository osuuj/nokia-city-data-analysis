// 8. TableSorting.tsx
// Main Purpose:
// Handles sorting UI and interactions.

// Main Parts:

// Uses DropdownTrigger and DropdownMenu to list sortable columns.
// Calls setSortDescriptor to update sorting state.
// Toggles sorting order between ascending and descending.


import React from "react";
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { Icon } from "@iconify/react";

const TableSorting = ({ headerColumns, sortDescriptor, setSortDescriptor }) => {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button className="bg-default-100 text-default-800" size="sm" startContent={<Icon className="text-default-400" icon="solar:sort-linear" width={16} />}>
          Sort
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Sort" items={headerColumns.filter((c) => !["actions", "teams"].includes(c.uid))}>
        {(item) => (
          <DropdownItem
            key={item.uid}
            onPress={() => {
              setSortDescriptor({
                column: item.uid,
                direction: sortDescriptor.direction === "ascending" ? "descending" : "ascending",
              });
            }}
          >
            {item.name}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
};

export default TableSorting;