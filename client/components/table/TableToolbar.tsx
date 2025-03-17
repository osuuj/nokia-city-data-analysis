import { ColumnVisibilityDropdown } from '@/components/table/ColumnVisibility';
import { SearchInput } from '@/components/table/SearchInput';
import { SortDropdown } from '@/components/table/SortDropdown';
import type { ToolbarProps } from '@/components/table/tableConfig';
import { CheckboxGroup, Divider, Input, Switch } from '@heroui/react';
import { useState } from 'react';

import DistanceSlider from '@/components/filters/DistanceSlider';
import PopoverFilterWrapper from '@/components/filters/PopoverFilterWrapper';
import TagGroupItem from '@/components/filters/TagGroupItem';
import { filters } from '@/components/utils/filters';
import { Icon } from '@iconify/react';

export function TableToolbar({ searchTerm, onSearch, selectedKeys }: ToolbarProps) {
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

  const [useLocation, setUseLocation] = useState(false);
  const [address, setAddress] = useState('');
  const industryFilter = filters.find((filter) => filter.key === 'industries');

  return (
    <div className="items-center justify-center gap-4 overflow-auto p-2">
      <div className="flex items-center gap-3">
        <SearchInput searchTerm={searchTerm} onSearch={onSearch} />
        <Divider className="h-5" orientation="vertical" />
        <SortDropdown setSortDescriptor={setSortDescriptor} />
        <ColumnVisibilityDropdown
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
        />
        <Divider className="h-5" orientation="vertical" />
        <PopoverFilterWrapper title="Industry">
          <div className="max-h-60 w-64 overflow-y-auto transition-all duration-300 ease-in-out hover:w-72">
            <CheckboxGroup aria-label="Select industry" className="gap-1" orientation="vertical">
              {industryFilter?.options?.map((option) => (
                <TagGroupItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <Icon icon={option.icon || ''} className="text-lg" />
                    {option.title}
                  </div>
                </TagGroupItem>
              ))}
            </CheckboxGroup>
          </div>
        </PopoverFilterWrapper>
        <PopoverFilterWrapper title="Distance">
          <div className="flex flex-col gap-2">
            <Switch isSelected={useLocation} onValueChange={setUseLocation}>
              Share location
            </Switch>
            {!useLocation && (
              <Input
                aria-label="Enter address"
                placeholder="Enter address..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            )}
            {useLocation && (
              <DistanceSlider
                aria-label="Distance Filter"
                range={{
                  min: 0,
                  defaultValue: [0, 30],
                  max: 30,
                  step: 1,
                }}
              />
            )}
          </div>
        </PopoverFilterWrapper>
        <Divider className="h-5" orientation="vertical" />
        <div className="whitespace-nowrap text-sm text-default-800">
          {selectedKeys === 'all'
            ? 'All items selected'
            : `${selectedKeys instanceof Set ? selectedKeys.size : 0} Selected`}
        </div>
      </div>
    </div>
  );
}
