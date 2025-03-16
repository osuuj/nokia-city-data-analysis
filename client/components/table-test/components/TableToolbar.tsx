
// Encapsulates TableFilters.tsx, TableSorting.tsx, and TableColumnSelector.tsx into a single component.
// Ensures the top toolbar remains structured while keeping each part modular.
// Makes it easy to reuse or update the toolbar without modifying the table directly.



import React from "react";
import { Divider } from "@heroui/react";
import TableFilters from "./TableFilters";
import TableSorting from "./TableSorting";
import TableColumnSelector from "./TableColumnSelector";
import TableSelectedActions from "./TableSelectedActions";

const TableToolbar = () => {
  return (
    <div className="flex items-center gap-4 overflow-auto px-[6px] py-[4px]">
      <div className="flex items-center gap-3">
        {/* Search Input & Filters */}
        <TableFilters />

        {/* Sorting Dropdown */}
        <TableSorting />

        {/* Column Visibility Selector */}
        <TableColumnSelector />

        {/* Divider */}
        <Divider className="h-5" orientation="vertical" />

        {/* Selected Items Text & Actions */}
        <TableSelectedActions />
      </div>
    </div>
  );
};

export default TableToolbar;