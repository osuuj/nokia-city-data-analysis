import FilterGroup from '@/components/filters/FilterGroup';
import { ColumnVisibilityDropdown } from '@/components/table/ColumnVisibility';
import { SearchInput } from '@/components/table/SearchInput';
import { SortDropdown } from '@/components/table/SortDropdown';
import type { ToolbarProps } from '@/components/table/tableConfig';
import { Divider } from '@heroui/react';
import { useMemo } from 'react';

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
  return useMemo(
    () => (
      <div className="flex items-center w-full min-h-14 whitespace-nowrap min-w-[240px]:overflow-x-hidden overflow-x-auto">
        <div className="flex items-center gap-2">
          <SearchInput searchTerm={searchTerm} onSearch={onSearch} />
          <Divider className="h-5" orientation="vertical" />
          <SortDropdown setSortDescriptor={setSortDescriptor} />
          <ColumnVisibilityDropdown />
          <Divider className="h-5" orientation="vertical" />
          <FilterGroup
            useLocation={useLocation}
            setUseLocation={setUseLocation}
            address={address}
            setAddress={setAddress}
          />
          <Divider className="h-5" orientation="vertical" />
          <div className="text-xs whitespace-nowrap">
            {selectedKeys === 'all'
              ? 'All items selected'
              : `${selectedKeys instanceof Set ? selectedKeys.size : 0} Selected`}
          </div>
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
      setSortDescriptor,
    ],
  );
}
