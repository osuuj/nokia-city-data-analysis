'use client';

import { Button, Chip, Divider, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useCallback, useEffect, useMemo, useState } from 'react';

// Updated imports with correct paths
import { useCompanyStore } from '@/features/dashboard/store/useCompanyStore';
import type { Filter, FilterOption } from '@/features/dashboard/types/filters';
import type { ToolbarProps } from '@/features/dashboard/types/table';
import { filters } from '@/features/dashboard/utils/filters';

import { ColumnVisibilityDropdown } from './ColumnVisibilityDropdown';
// Import UI components from their correct locations in the same directory
import { FilterGroup } from './FilterGroup';
import { SearchInput } from './SearchInput';
import { SortDropdown } from './SortDropdown';

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
  setSelectedKeys,
}: ToolbarProps) {
  const selectedIndustries = useCompanyStore((s) => s.selectedIndustries);
  const setSelectedIndustries = useCompanyStore((s) => s.setSelectedIndustries);
  const distanceLimit = useCompanyStore((s) => s.distanceLimit);
  const setDistanceLimit = useCompanyStore((s) => s.setDistanceLimit);
  const setUserLocation = useCompanyStore((s) => s.setUserLocation);

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024,
  );

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const industryOptions = filters.find((f: Filter) => f.key === 'industries')?.options ?? [];

  const selectedIndustryItems = useMemo(() => {
    return selectedIndustries.flatMap((val: string) => {
      const match = industryOptions.find((opt: FilterOption) => opt.value === val);
      return match ? [match] : [];
    });
  }, [selectedIndustries, industryOptions]);

  const resetAllFilters = useCallback(() => {
    onSearch('');
    setSelectedIndustries([]);
    setDistanceLimit(null);
    setUserLocation(null);
    setUseLocation(false);
    setAddress('');
    setSelectedKeys(new Set());
  }, [
    onSearch,
    setSelectedIndustries,
    setDistanceLimit,
    setUserLocation,
    setUseLocation,
    setAddress,
    setSelectedKeys,
  ]);

  const handleLocationChipClose = useCallback(() => {
    setDistanceLimit(null);
    setUserLocation(null);
    setUseLocation(false);
  }, [setDistanceLimit, setUserLocation, setUseLocation]);

  const handleIndustryChipClose = useCallback(
    (value: string) => {
      const newIndustries = selectedIndustries.filter((v: string) => v !== value);
      setSelectedIndustries(newIndustries);
    },
    [selectedIndustries, setSelectedIndustries],
  );

  const hasActiveFilters = selectedKeys.size > 0 || selectedIndustries.length > 0 || useLocation;

  return (
    <div className="w-full bg-content2/50 p-1 xs:p-2 sm:p-3 rounded-lg mb-1 xs:mb-2">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-center w-full min-h-12 xs:min-h-14 whitespace-nowrap overflow-x-auto scrollbar-hide gap-1 xs:gap-2">
        <div className="flex flex-col md:flex-row  gap-1 xs:gap-2 flex-wrap w-full">
          <SearchInput searchTerm={searchTerm} onSearch={onSearch} />

          <div className="flex items-center gap-1 w-full md:w-auto">
            <Divider className="hidden md:block h-4 xs:h-5" orientation="vertical" />
            <Tooltip content="Sort by column" placement="bottom">
              <div>
                <SortDropdown
                  sortDescriptor={sortDescriptor}
                  setSortDescriptor={setSortDescriptor}
                  aria-label="Sort columns"
                />
              </div>
            </Tooltip>
            <Divider className="hidden md:block h-4 xs:h-5" orientation="vertical" />
            <Tooltip content="Column Visibility" placement="bottom">
              <div>
                <ColumnVisibilityDropdown />
              </div>
            </Tooltip>
            <Divider className="hidden md:block h-4 xs:h-5" orientation="vertical" />
            <FilterGroup
              useLocation={useLocation}
              setUseLocation={setUseLocation}
              address={address}
              setAddress={setAddress}
            />
            {hasActiveFilters && (
              <Button
                size="sm"
                variant="flat"
                color="primary"
                className="text-[10px] xs:text-xs sm:text-sm md:text-base focus:outline-none focus:ring-0 h-6 xs:h-7 sm:h-8 md:h-9 bg-default-100 text-default-800"
                onPress={resetAllFilters}
                aria-label="Reset all filters"
              >
                Reset Filters
              </Button>
            )}
          </div>

          <div className="flex md:hidden w-full  mt-1">
            <div className="font-medium text-primary text-[10px] xs:text-xs sm:text-sm">
              {`${selectedKeys.size} companies selected`}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <div className="font-medium text-primary text-sm md:text-sm">
              {`${selectedKeys.size} companies selected`}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tags */}
      {(selectedIndustryItems.length > 0 || (useLocation && distanceLimit != null)) && (
        <div className="flex flex-wrap gap-1 xs:gap-2 mt-1 xs:mt-2 ml-0.5 xs:ml-1">
          {selectedIndustryItems.map((item: FilterOption) => (
            <Chip
              key={item.value}
              size="sm"
              radius="sm"
              variant="flat"
              className="bg-primary-50 text-primary-700 border-primary-200 focus:outline-none focus:ring-0 text-[10px] xs:text-xs"
              startContent={
                item.icon ? (
                  <Icon icon={item.icon} className="text-primary-500 shrink-0" width={12} />
                ) : null
              }
              onClose={() => handleIndustryChipClose(item.value)}
            >
              <span className="truncate">{item.title}</span>
            </Chip>
          ))}

          {useLocation && distanceLimit != null && (
            <Chip
              size="sm"
              radius="sm"
              variant="flat"
              className="bg-secondary-50 text-secondary-700 border-secondary-200 focus:outline-none focus:ring-0 text-[10px] xs:text-xs"
              startContent={<span className="text-xs">📍</span>}
              onClose={handleLocationChipClose}
            >
              Within {distanceLimit} km
            </Chip>
          )}
        </div>
      )}
    </div>
  );
}
