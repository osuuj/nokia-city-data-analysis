'use client';

import { filters } from '@/features/dashboard/data/filters';
import type { FilterOption, SortDescriptor } from '@/features/dashboard/types';
import { useCompanyStore } from '@features/dashboard/store';
import { Button } from '@heroui/button';
import { Divider } from '@heroui/divider';
import { Tooltip } from '@heroui/tooltip';
import type React from 'react';
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ColumnVisibilityDropdown } from './ColumnVisibilityDropdown';
import { FilterGroup } from './FilterGroup';
import { FilterTag } from './FilterTag';
import { SearchInput } from './SearchInput';
import { SortDropdown } from './SortDropdown';

export interface ToolbarProps {
  searchTerm: string;
  onSearch: (value: string) => void;
  selectedKeys: Set<string>;
  useLocation: boolean;
  setUseLocation: Dispatch<SetStateAction<boolean>>;
  address?: string;
  setAddress: Dispatch<SetStateAction<string>>;
  sortDescriptor: SortDescriptor;
  setSortDescriptor: (value: SortDescriptor) => void;
  setSelectedKeys: (value: Set<string>) => void;
}

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024,
  );
  const [mounted, setMounted] = useState(false);

  // Get filter state from store
  const selectedIndustries = useCompanyStore((s) => s.selectedIndustries);
  const setSelectedIndustries = useCompanyStore((s) => s.setSelectedIndustries);
  const distanceLimit = useCompanyStore((s) => s.distanceLimit);
  const setDistanceLimit = useCompanyStore((s) => s.setDistanceLimit);
  const setUserLocation = useCompanyStore((s) => s.setUserLocation);

  // Get industry options
  const industryOptions = filters.find((f) => f.key === 'industries')?.options ?? [];

  // Get selected industry items
  const selectedIndustryItems = useMemo(() => {
    return selectedIndustries.flatMap((val: string) => {
      const match = industryOptions.find((opt: FilterOption) => opt.value === val);
      return match ? [match] : [];
    });
  }, [selectedIndustries, industryOptions]);

  // Reset all filters
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

  // Check if there are active filters
  const hasActiveFilters = useMemo(() => {
    return selectedIndustryItems.length > 0 || (useLocation && distanceLimit != null);
  }, [selectedIndustryItems, useLocation, distanceLimit]);

  // Set mounted state to true after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Close mobile menu on resize to desktop
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Use window width to detect screen size
  const isMobile = windowWidth < 768;
  const isXsScreen = windowWidth < 400;

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsMobileMenuOpen(false);
    }
  }, []);

  return (
    <section
      className="w-full bg-content2/50 p-1.5 xs:p-2 sm:p-3 rounded-lg mb-1 xs:mb-2"
      aria-label="Table toolbar"
      onKeyDown={handleKeyDown}
    >
      {/* Toolbar - Improved layout with search first, then controls */}
      <div className="flex flex-col gap-2 w-full">
        {/* Search input with proper width control */}
        <div className="w-full">
          <SearchInput searchTerm={searchTerm} onSearch={onSearch} />
        </div>

        {/* Control buttons with proper spacing and positioning - added overflow-x-auto for mobile scrolling */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-default-300 scrollbar-track-default-100">
          <div className="flex items-center gap-1 sm:gap-2 flex-nowrap min-w-max">
            <Tooltip content="Sort data" placement="top" delay={300}>
              <div>
                <SortDropdown
                  sortDescriptor={sortDescriptor}
                  setSortDescriptor={setSortDescriptor}
                  aria-label="Sort columns"
                />
              </div>
            </Tooltip>

            {/* Vertical divider */}
            <Divider className="hidden sm:block h-4 xs:h-5" orientation="vertical" />

            <Tooltip content="Toggle columns" placement="top" delay={300}>
              <div>
                <ColumnVisibilityDropdown />
              </div>
            </Tooltip>

            {/* Vertical divider */}
            <Divider className="hidden sm:block h-4 xs:h-5" orientation="vertical" />

            <Tooltip content="Filter data" placement="top" delay={300}>
              <div className="flex items-center">
                <FilterGroup
                  useLocation={useLocation}
                  setUseLocation={setUseLocation}
                  setAddress={setAddress}
                />
              </div>
            </Tooltip>

            {hasActiveFilters && (
              <Tooltip content="Reset all filters" placement="top" delay={300}>
                <Button
                  size="sm"
                  variant="flat"
                  color="primary"
                  className="text-[10px] xs:text-xs sm:text-sm focus:outline-none focus:ring-0 h-7 sm:h-8 bg-default-100 text-default-800"
                  onPress={resetAllFilters}
                  aria-label="Reset all filters"
                >
                  <span className="hidden xs:inline">Reset</span> Filters
                </Button>
              </Tooltip>
            )}

            {/* Vertical divider */}
            <Divider className="hidden sm:block h-4 xs:h-5" orientation="vertical" />

            {/* Selection count */}
            <div className="font-medium text-primary text-xs sm:text-sm">
              {`${selectedKeys.size} selected`}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tags - Improved spacing and wrapping */}
      {(selectedIndustryItems.length > 0 || (useLocation && distanceLimit != null)) && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedIndustryItems.map((item: FilterOption) => (
            <FilterTag
              key={item.value}
              label={item.title}
              icon={item.icon}
              color={typeof item.color === 'string' ? item.color : undefined}
              onRemove={() => {
                const newSelected = selectedIndustries.filter((i: string) => i !== item.value);
                setSelectedIndustries(newSelected);
              }}
            />
          ))}

          {useLocation && distanceLimit != null && (
            <FilterTag
              label={`Within ${distanceLimit}km`}
              icon="lucide:map-pin"
              color="text-blue-500"
              onRemove={() => {
                setDistanceLimit(null);
                if (!address) {
                  setUseLocation(false);
                }
              }}
            />
          )}
        </div>
      )}
    </section>
  );
}
