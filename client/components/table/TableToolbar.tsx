import FilterGroup from '@/components/filters/FilterGroup';
import { ColumnVisibilityDropdown } from '@/components/table/ColumnVisibility';
import { SearchInput } from '@/components/table/SearchInput';
import { SortDropdown } from '@/components/table/SortDropdown';
import type { ToolbarProps } from '@/components/table/tableConfig';
import { Divider } from '@heroui/react';
import { useMemo, useState } from 'react';

export function TableToolbar({
  searchTerm,
  onSearch,
  selectedKeys,
  useLocation,
  setUseLocation,
  address,
  setAddress,
}: ToolbarProps) {
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set([
      'company_name',
      'business_id',
      'industry_description',
      'latitude_wgs84',
      'longitude_wgs84',
    ]),
  );

  const [sortDescriptor, setSortDescriptor] = useState({
    column: 'company_name',
    direction: 'asc',
  });

  return useMemo(
    () => (
      <div className="flex items-center gap-4 overflow-x-auto w-full px-[6px] py-[4px] whitespace-nowrap">
        <div className="flex items-center gap-3">
          <SearchInput searchTerm={searchTerm} onSearch={onSearch} />
          <Divider className="h-5" orientation="vertical" />
          <SortDropdown setSortDescriptor={setSortDescriptor} />
          <ColumnVisibilityDropdown
            visibleColumns={visibleColumns}
            setVisibleColumns={setVisibleColumns}
          />
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
      visibleColumns,
    ],
  );
}
