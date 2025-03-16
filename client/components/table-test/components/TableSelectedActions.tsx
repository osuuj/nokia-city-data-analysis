import React from "react";
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { Icon } from "@iconify/react";

const TableSelectedActions = ({ filterSelectedKeys }) => {
  return (
    <>
      <div className="whitespace-nowrap text-sm text-default-800">
        {filterSelectedKeys === "all" ? "All items selected" : `${filterSelectedKeys.size} Selected`}
      </div>

      {(filterSelectedKeys === "all" || filterSelectedKeys.size > 0) && (
        <Dropdown>
          <DropdownTrigger>
            <Button className="bg-default-100 text-default-800" size="sm" endContent={<Icon className="text-default-400" icon="solar:alt-arrow-down-linear" />}>
              Selected Actions
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Selected Actions">
            <DropdownItem key="send-email">Send email</DropdownItem>
            <DropdownItem key="pay-invoices">Pay invoices</DropdownItem>
            <DropdownItem key="bulk-edit">Bulk edit</DropdownItem>
            <DropdownItem key="end-contract">End contract</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      )}
    </>
  );
};

export default TableSelectedActions;