// 1. TableContainer.tsx
// Main Purpose:
// Acts as the main wrapper for the table, integrating all components and passing down required props.

// Main Parts:

// Wraps the table UI layout.
// Uses TableHeaderComponent, TableBodyComponent, and TablePagination.
// Passes state props like sortDescriptor, filteredItems, selectedKeys, etc.
// Handles the onSelectionChange and onSortChange functions.
// Provides topContent (filters, search, sorting) and bottomContent (pagination).

import React from "react";
import { Table, TableHeader, TableColumn } from "@heroui/react";
import { Tooltip, Icon } from "@iconify/react";
import TableBodyComponent from "@/components/table-test/components/TableBodyComponent";

const TableContainer = ({
  topBar,
  bottomContent,
  topContent,
  headerColumns,
  filterSelectedKeys,
  sortDescriptor,
  onSelectionChange,
  setSortDescriptor,
  getMemberInfoProps
}) => {
  return (
    <div className="h-full w-full p-6">
      {topBar}
      <Table
        isHeaderSticky
        aria-label="Example table with custom cells, pagination and sorting"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          td: "before:bg-transparent",
        }}
        selectedKeys={filterSelectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={onSelectionChange}
        onSortChange={setSortDescriptor}
      >
        {/* Table Header */}
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "end" : "start"}
              className={column.uid === "actions" ? "flex items-center justify-end px-[20px]" : ""}
            >
              {column.uid === "memberInfo" ? (
                <div
                  {...getMemberInfoProps()}
                  className="flex w-full cursor-pointer items-center justify-between"
                >
                  {column.name}
                  {column.sortDirection === "ascending" ? (
                    <ArrowUpIcon className="text-default-400" />
                  ) : (
                    <ArrowDownIcon className="text-default-400" />
                  )}
                </div>
              ) : column.info ? (
                <div className="flex min-w-[108px] items-center justify-between">
                  {column.name}
                  <Tooltip content={column.info}>
                    <Icon className="text-default-300" height={16} icon="solar:info-circle-linear" width={16} />
                  </Tooltip>
                </div>
              ) : (
                column.name
              )}
            </TableColumn>
          )}
        </TableHeader>

        {/* Table Body */}
        <TableBodyComponent />
      </Table>
    </div>
  );
};

export default TableContainer;