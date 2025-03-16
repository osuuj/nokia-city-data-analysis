// 3. TableBodyComponent.tsx
// Main Purpose:
// Renders the table rows dynamically based on sorted and filtered data.

// Main Parts:

// Loops through sortedItems to render TableRowComponent.
// Uses TableBody and ensures proper rendering of empty states.
// Passes necessary row props such as selectedKeys.


import React from "react";
import { TableBody } from "@heroui/react";
import TableRowComponent from "./TableRowComponent";

const TableBodyComponent = ({ sortedItems }) => {
  return (
    <TableBody emptyContent={"No users found"} items={sortedItems}>
      {sortedItems.map((item) => (
        <TableRowComponent key={item.id} item={item} />
      ))}
    </TableBody>
  );
};

export default TableBodyComponent;