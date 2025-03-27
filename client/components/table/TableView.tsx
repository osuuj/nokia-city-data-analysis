'use client';

import { useMemoizedCallback } from '@/components/hooks/useMemoizedCallback';
import { TableToolbar } from '@/components/table/TableToolbar';
import { useCompanyStore } from '@/store/useCompanyStore';
import type { CompanyProperties } from '@/types';
import type { CompanyTableKey, TableColumnConfig, TableViewProps } from '@/types/table';
import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import { useMemo, useState } from 'react';

export function TableView({
  data,
  allFilteredData,
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
  searchTerm,
  setSearchTerm,
  sortDescriptor,
  setSortDescriptor,
}: TableViewProps & { allFilteredData: CompanyProperties[] }) {
  const { visibleColumns } = useCompanyStore();
  const [useLocation, setUseLocation] = useState(false);
  const [address, setAddress] = useState('');
  const selectedKeys = useCompanyStore((s) => s.selectedKeys);
  const setSelectedKeys = useCompanyStore((s) => s.setSelectedKeys);

  const toggleSort = useMemoizedCallback((key: CompanyTableKey) => {
    setSortDescriptor((prev) => ({
      column: key,
      direction: prev.column === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  });

  const filteredData = useMemo(() => {
    return (
      data?.filter((item) => item.company_name.toLowerCase().includes(searchTerm.toLowerCase())) ??
      []
    );
  }, [data, searchTerm]);

  const bottomContent = useMemo(
    () => (
      <div className="flex flex-col items-center justify-center gap-2 px-2 py-2">
        <Pagination
          disableCursorAnimation
          classNames={{
            base: 'text-sm gap-1',
            item: 'w-8 h-8 md:w-10 md:h-10',
            cursor: 'w-8 h-8 md:w-10 md:h-10',
            next: 'w-8 h-8 md:w-10 md:h-10',
            prev: 'w-8 h-8 md:w-10 md:h-10',
          }}
          showControls
          showShadow
          color="primary"
          page={currentPage}
          total={totalPages}
          onChange={onPageChange}
        />
      </div>
    ),
    [currentPage, totalPages, onPageChange],
  );

  return (
    <div className="h-full w-full p-1 md:p-2">
      <Table
        isHeaderSticky
        selectionMode="multiple"
        aria-label="Sortable Table"
        classNames={{
          base: 'max-w-full overflow-x-auto overflow-y-hidden md:h-[780px] h-[800px]',
          wrapper: 'w-full',
          table: 'min-w-full w-auto sm:w-full',
          td: 'md:text-sm text-xs w-auto',
          th: 'md:text-sm text-xs w-auto',
        }}
        selectedKeys={selectedKeys}
        onSelectionChange={(keys) => {
          if (keys === 'all') {
            const allKeys = new Set(allFilteredData.map((item) => item.business_id));
            setSelectedKeys(allKeys);
          } else {
            setSelectedKeys(new Set(keys as Set<string>));
          }
        }}
        topContent={
          <TableToolbar
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
            selectedKeys={selectedKeys}
            useLocation={useLocation}
            setUseLocation={setUseLocation}
            address={address}
            setAddress={setAddress}
            sortDescriptor={sortDescriptor}
            setSortDescriptor={setSortDescriptor}
            setSelectedKeys={setSelectedKeys}
          />
        }
        topContentPlacement="outside"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
      >
        <TableHeader>
          {visibleColumns.map((col: TableColumnConfig) => (
            <TableColumn key={col.key} onClick={() => toggleSort(col.key)}>
              {col.label}
              {sortDescriptor.column === col.key
                ? sortDescriptor.direction === 'asc'
                  ? '▲'
                  : '▼'
                : ''}
            </TableColumn>
          ))}
        </TableHeader>

        <TableBody isLoading={isLoading} loadingState={isLoading ? 'loading' : 'idle'}>
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <TableRow key={item.business_id}>
                {visibleColumns.map((col: TableColumnConfig) => (
                  <TableCell key={col.key}>
                    {(() => {
                      const visiting = item.addresses?.['Visiting address'];
                      switch (col.key) {
                        case 'street':
                          return visiting?.street ?? '-';
                        case 'building_number':
                          return visiting?.building_number ?? '-';
                        case 'postal_code':
                          return visiting?.postal_code ?? '-';
                        case 'city':
                          return visiting?.city ?? '-';
                        case 'entrance':
                          return visiting?.entrance ?? '-';
                        case 'address_type':
                          return 'Visiting address';
                        default:
                          return String(item[col.key as keyof CompanyProperties] ?? '-');
                      }
                    })()}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={visibleColumns.length} className="text-center">
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
