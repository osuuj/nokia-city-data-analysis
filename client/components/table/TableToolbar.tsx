'use client';

import { FilterGroup } from '@/components/filters/FilterGroup';
import { ColumnVisibilityDropdown } from '@/components/table/ColumnVisibilityDropdown';
import { SearchInput } from '@/components/table/SearchInput';
import { SortDropdown } from '@/components/table/SortDropdown';
import { useCompanyStore } from '@/store/useCompanyStore';
import type { FilterOption } from '@/types/filters';
import type { ToolbarProps } from '@/types/table';
import { filters } from '@/utils/filters';
import { Chip, Divider } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useMemo } from 'react';

/**
 * TableToolbar
 * Top section of the table that includes search, sorting, column visibility, filters, and summary tags.
 */
export function TableToolbar({
  searchTerm,
  onSearch,
  selectedKeys,
  useLocation,
  setUseLocation,
  address,
  setAddress,
  sortDescriptor,
  setSortDescriptor,
}: ToolbarProps) {
  const selectedIndustries = useCompanyStore((s) => s.selectedIndustries);
  const setSelectedIndustries = useCompanyStore((s) => s.setSelectedIndustries);
  const distanceLimit = useCompanyStore((s) => s.distanceLimit);
  const setDistanceLimit = useCompanyStore((s) => s.setDistanceLimit);
  const setUserLocation = useCompanyStore((s) => s.setUserLocation);

  const industryOptions = filters.find((f) => f.key === 'industries')?.options ?? [];

  const selectedIndustryItems = selectedIndustries.flatMap((val: string) => {
    const match = industryOptions.find((opt: FilterOption) => opt.value === val);
    return match ? [match] : [];
  });

  return useMemo(
    () => (
      <div className="w-full">
        {/* Top toolbar row */}
        <div className="flex items-center w-full min-h-14 whitespace-nowrap min-w-[240px]:overflow-x-hidden overflow-x-auto">
          <div className="flex items-center gap-2">
            <SearchInput searchTerm={searchTerm} onSearch={onSearch} />
            <Divider className="h-5" orientation="vertical" />
            <SortDropdown sortDescriptor={sortDescriptor} setSortDescriptor={setSortDescriptor} />
            <ColumnVisibilityDropdown />
            <Divider className="h-5" orientation="vertical" />
            <FilterGroup
              useLocation={useLocation}
              setUseLocation={setUseLocation}
              address={address}
              setAddress={setAddress}
            />
            <Divider className="h-5" orientation="vertical" />
            <div className="text-xs whitespace-nowrap text-default-600">
              {selectedKeys === 'all'
                ? 'All companies selected'
                : `${selectedKeys instanceof Set ? selectedKeys.size : 0} companies selected`}
            </div>
          </div>
        </div>

        {/* Filter tags row */}
        <div className="flex flex-wrap gap-2 mt-2 ml-1">
          {/* Industry tags */}
          {selectedIndustryItems.map((item: FilterOption) => (
            <Chip
              key={item.value}
              size="sm"
              radius="sm"
              variant="flat"
              className="bg-default-100 text-default-800"
              startContent={
                item.icon ? <Icon icon={item.icon} className="text-default-500" width={14} /> : null
              }
              onClose={() => {
                setSelectedIndustries(selectedIndustries.filter((v: string) => v !== item.value));
              }}
            >
              {item.title}
            </Chip>
          ))}

          {/* Distance tag */}
          {useLocation && distanceLimit != null && (
            <Chip
              size="sm"
              radius="sm"
              variant="flat"
              className="bg-default-100 text-default-800"
              startContent={<span className="text-sm">📍</span>}
              onClose={() => {
                setDistanceLimit(null);
                setUserLocation(null);
                setUseLocation(false);
              }}
            >
              Within {distanceLimit} km
            </Chip>
          )}
        </div>
      </div>
    ),
    [
      searchTerm,
      onSearch,
      selectedKeys,
      useLocation,
      setUseLocation,
      address,
      setAddress,
      sortDescriptor,
      setSortDescriptor,
      selectedIndustryItems,
      selectedIndustries,
      setSelectedIndustries,
      distanceLimit,
      setDistanceLimit,
      setUserLocation,
    ],
  );
}
