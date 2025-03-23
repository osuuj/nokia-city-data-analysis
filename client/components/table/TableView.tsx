'use client';
import { TableToolbar } from '@/config/components/table/TableToolbar';
import { useMemoizedCallback } from '@/config/components/table/useMemoizedCallback';
import { useCompanyStore } from '@/store/useCompanyStore';
import type { Business } from '@/types/business';
import type { TableViewProps } from '@/types/table';
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

export default function TableView({
  data,
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
  searchTerm,
  setSearchTerm,
  sortDescriptor,
  setSortDescriptor,
}: TableViewProps) {
  const { visibleColumns } = useCompanyStore();
  const [useLocation, setUseLocation] = useState(false);
  const [address, setAddress] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  const toggleSort = useMemoizedCallback((key: keyof Business) => {
    setSortDescriptor((prev) => ({
      column: key,
      direction: prev.column === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  });

  const filteredData = useMemo(() => {
    return (
      data?.filter((item) => item.company_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      []
    );
  }, [data, searchTerm]);

  const bottomContent = useMemo(
    () => (
      <div className="flex flex-col items-center justify-center gap-2 px-2 py-2">
        <Pagination
          disableCursorAnimation={true}
          classNames={{
            base: 'text-sm gap-1',
            item: 'w-8 h-8 md:w-10 md:h-10',
            cursor: 'w-8 h-8 md:w-10 md:h-10', // Add explicit padding
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
        onSelectionChange={(keys) => setSelectedKeys(new Set(keys as Set<string>))}
        topContent={
          <TableToolbar
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
            selectedKeys={selectedKeys}
            useLocation={useLocation} // ✅ Added
            setUseLocation={setUseLocation} // ✅ Added
            address={address} // ✅ Added
            setAddress={setAddress} // ✅ Added
            sortDescriptor={sortDescriptor}
            setSortDescriptor={setSortDescriptor}
          />
        }
        topContentPlacement="outside"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
      >
        {/* ✅ Clickable Table Header for Sorting */}
        <TableHeader>
          {visibleColumns.map(({ key, label }) => (
            <TableColumn key={key} onClick={() => toggleSort(key)}>
              {label}
              {sortDescriptor.column === key
                ? sortDescriptor.direction === 'asc'
                  ? '▲'
                  : '▼'
                : ''}
            </TableColumn>
          ))}
        </TableHeader>

        {/* ✅ Sorted Table Body */}
        <TableBody isLoading={isLoading} loadingState={isLoading ? 'loading' : 'idle'}>
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <TableRow key={item.business_id}>
                {visibleColumns.map((col) => (
                  <TableCell key={col.key}>{String(item[col.key as keyof Business])}</TableCell>
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
