// 4. TableRowComponent.tsx
// Main Purpose:
// Represents a single row in the table, handling selection and rendering cells.

// Main Parts:

// Receives row data and columnKeys.
// Calls TableCellComponent for each column in the row.
// Uses useMemoizedCallback to optimize rendering.

import React from "react";
import { TableRow, TableCell } from "@heroui/react";

const TableRowComponent = ({ item, renderCell }) => {
  return (
    <TableRow key={item.id}>
      {Object.keys(item).map((columnKey) => (
        <TableCell key={columnKey}>{renderCell(item, columnKey)}</TableCell>
      ))}
    </TableRow>
  );
};

export default TableRowComponent;