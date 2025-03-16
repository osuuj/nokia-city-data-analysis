// 7. TableFilters.tsx
// Main Purpose:
// Manages filtering UI, including worker type, status, and start date filters.

// Main Parts:

// Uses PopoverTrigger and PopoverContent to open filter options.
// Implements RadioGroup for filtering (workerTypeFilter, statusFilter, startDateFilter).
// Calls setWorkerTypeFilter, setStatusFilter, and setStartDateFilter.


import React from "react";
import { Input, Popover, PopoverTrigger, PopoverContent, Button, RadioGroup, Radio } from "@heroui/react";
import { SearchIcon } from "@heroui/shared-icons";
import { Icon } from "@iconify/react";

const TableFilters = ({ filterValue, onSearchChange, workerTypeFilter, setWorkerTypeFilter, statusFilter, setStatusFilter, startDateFilter, setStartDateFilter }) => {
  return (
    <div className="flex items-center gap-4">
      {/* Search Input */}
      <Input
        className="min-w-[200px]"
        endContent={<SearchIcon className="text-default-400" width={16} />}
        placeholder="Search"
        size="sm"
        value={filterValue}
        onValueChange={onSearchChange}
      />

      {/* Filter Button */}
      <Popover placement="bottom">
        <PopoverTrigger>
          <Button
            className="bg-default-100 text-default-800"
            size="sm"
            startContent={<Icon className="text-default-400" icon="solar:tuning-2-linear" width={16} />}
          >
            Filter
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="flex w-full flex-col gap-6 px-2 py-4">
            <RadioGroup label="Worker Type" value={workerTypeFilter} onValueChange={setWorkerTypeFilter}>
              <Radio value="all">All</Radio>
              <Radio value="employee">Employee</Radio>
              <Radio value="contractor">Contractor</Radio>
            </RadioGroup>
            <RadioGroup label="Status" value={statusFilter} onValueChange={setStatusFilter}>
              <Radio value="all">All</Radio>
              <Radio value="active">Active</Radio>
              <Radio value="inactive">Inactive</Radio>
              <Radio value="paused">Paused</Radio>
              <Radio value="vacation">Vacation</Radio>
            </RadioGroup>
            <RadioGroup label="Start Date" value={startDateFilter} onValueChange={setStartDateFilter}>
              <Radio value="all">All</Radio>
              <Radio value="last7Days">Last 7 days</Radio>
              <Radio value="last30Days">Last 30 days</Radio>
              <Radio value="last60Days">Last 60 days</Radio>
            </RadioGroup>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TableFilters;