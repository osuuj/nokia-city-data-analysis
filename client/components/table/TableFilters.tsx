'use client';

import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Radio,
  RadioGroup,
} from '@heroui/react';
import { SearchIcon } from '@heroui/shared-icons';
import { Icon } from '@iconify/react';

interface TableFiltersProps {
  filterValue: string;
  setFilterValue: (value: string) => void;
  workerTypeFilter: string;
  setWorkerTypeFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}

export default function TableFilters({
  filterValue,
  setFilterValue,
  workerTypeFilter,
  setWorkerTypeFilter,
  statusFilter,
  setStatusFilter,
}: TableFiltersProps) {
  // ✅ Worker Type Options
  const workerTypes = [
    { value: 'all', label: 'All' },
    { value: 'employee', label: 'Employee' },
    { value: 'contractor', label: 'Contractor' },
  ];

  // ✅ Status Options
  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  return (
    <div className="flex items-center gap-4">
      {/* ✅ Search Input */}
      <Input
        className="min-w-[200px]"
        aria-label="Search companies"
        endContent={<SearchIcon width={16} />}
        placeholder="Search"
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
      />

      {/* ✅ Filter Button (Opens Popover) */}
      <Popover>
        <PopoverTrigger>
          <Button size="sm" startContent={<Icon icon="solar:tuning-2-linear" width={16} />}>
            Filter
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4">
          {/* ✅ Worker Type Filter */}
          <RadioGroup
            label="Worker Type"
            aria-label="Filter by Worker Type"
            value={workerTypeFilter}
            onValueChange={setWorkerTypeFilter}
          >
            {workerTypes.map(({ value, label }) => (
              <Radio key={value} value={value}>
                {label}
              </Radio>
            ))}
          </RadioGroup>

          {/* ✅ Status Filter */}
          <RadioGroup
            label="Status"
            aria-label="Filter by Status"
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            {statusOptions.map(({ value, label }) => (
              <Radio key={value} value={value}>
                {label}
              </Radio>
            ))}
          </RadioGroup>
        </PopoverContent>
      </Popover>
    </div>
  );
}
