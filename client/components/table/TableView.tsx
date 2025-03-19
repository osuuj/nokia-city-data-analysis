'use client';
import { TableToolbar } from '@/components/table/TableToolbar';
import type { TableViewProps } from '@/components/table/tableConfig';
import { useMemoizedCallback } from '@/components/table/useMemoizedCallback';
import { useCompanyStore } from '@/store/useCompanyStore'; // ✅ Zustand for visible columns & selected rows
import type { Business } from '@/types/business';
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
}: TableViewProps) {
  const { visibleColumns } = useCompanyStore(); // ✅ Zustand to control which columns are shown

  const [searchTerm, setSearchTerm] = useState('');

  // ✅ Sorting State
  const [sortDescriptor, setSortDescriptor] = useState<{
    column: keyof Business;
    direction: 'asc' | 'desc';
  }>({
    column: 'company_name',
    direction: 'asc',
  });

  /** ✅ Toggle Sorting */
  const toggleSort = useMemoizedCallback((key: keyof Business) => {
    setSortDescriptor((prev) => ({
      column: key,
      direction: prev.column === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  });

  /** ✅ Filtered Data */
  const filteredData = useMemo(() => {
    return (
      data?.filter((item) => item.company_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      []
    );
  }, [data, searchTerm]);

  /** ✅ Sorted Data Before Pagination */
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const col = sortDescriptor.column;
      const valueA = a[col];
      const valueB = b[col];

      const compareResult = valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      return sortDescriptor.direction === 'desc' ? -compareResult : compareResult;
    });
  }, [filteredData, sortDescriptor]);

  const bottomContent = useMemo(
    () => (
      <div className="flex flex-col items-center justify-center gap-2 px-2 py-2 sm:flex-row">
        <Pagination
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
    <div className="h-full w-full p-6">
      <Table
        isHeaderSticky
        aria-label="Sortable Table"
        classNames={{
          base: 'max-w-full overflow-x-auto md:overflow-visible h-[750px]',
          wrapper: 'w-full responsive-custom-class',
          table: 'min-w-full w-auto sm:w-full',
          thead: 'responsive-header-class',
          td: 'text-base md:text-sm sm:text-xs w-auto',
          th: 'text-base md:text-sm sm:text-xs w-auto',
        }}
        topContent={
          <TableToolbar searchTerm={searchTerm} onSearch={setSearchTerm} selectedKeys={new Set()} />
        }
        topContentPlacement="outside"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
      >
        {/* ✅ Clickable Table Header for Sorting */}
        <TableHeader>
          {visibleColumns.map(({ key, label }) => (
            <TableColumn
              key={key}
              onClick={() => toggleSort(key)}
              className="cursor-pointer min-w-[60px] sm:min-w-[80px] md:min-w-[100px] lg:min-w-[120px] xl:min-w-[150px] px-2"
            >
              {label}{' '}
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
          {sortedData.length > 0 ? (
            sortedData.map((item) => (
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
