'use client';
import { TableToolbar } from '@/components/table/TableToolbar';
import type { Business, TableViewProps } from '@/components/table/tableConfig';
import { columns } from '@/components/table/tableConfig';
import { useMemoizedCallback } from '@/components/table/useMemoizedCallback';
import {
  Pagination,
  type Selection,
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set<string>());

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

  /** ✅ Selection Handling (Improved with Filters) */
  const filterSelectedKeys = useMemo(() => {
    if (selectedKeys === 'all') {
      return new Set(sortedData.map((item) => item.business_id));
    }

    let resultKeys = new Set<string>();
    if (searchTerm) {
      for (const item of sortedData) {
        if ((selectedKeys as Set<string>).has(item.business_id)) {
          resultKeys.add(item.business_id);
        }
      }
    } else {
      resultKeys = new Set(Array.from(selectedKeys as Set<string>));
    }
    return resultKeys;
  }, [selectedKeys, sortedData, searchTerm]);

  /** ✅ Selection Change Handler */
  const handleSelectionChange = useMemoizedCallback((keys: Selection) => {
    if (keys === 'all') {
      const filteredKeys = new Set(sortedData.map((item) => item.business_id));
      setSelectedKeys(filteredKeys);
    } else {
      setSelectedKeys(new Set(keys as Set<string>));
    }
  });

  return (
    <>
      <div className="p-2">
        <TableToolbar
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
          selectedKeys={filterSelectedKeys} // ✅ Ensure `TableToolbar` supports this
        />

        <Table
          isHeaderSticky
          aria-label="Sortable & Selectable Table"
          classNames={{
            base: 'max-h-[520px] overflow-scroll',
            table: 'min-h-[400px]',
          }}
          selectionMode="multiple"
          selectedKeys={filterSelectedKeys}
          onSelectionChange={handleSelectionChange}
        >
          {/* ✅ Clickable Table Header for Sorting */}
          <TableHeader>
            {columns.map(({ key, label }) => (
              <TableColumn key={key} onClick={() => toggleSort(key)} className="cursor-pointer">
                {label}{' '}
                {sortDescriptor.column === key
                  ? sortDescriptor.direction === 'asc'
                    ? '▲'
                    : '▼'
                  : ''}
              </TableColumn>
            ))}
          </TableHeader>

          {/* ✅ Sorted & Selectable Table Body */}
          <TableBody isLoading={isLoading} loadingState={isLoading ? 'loading' : 'idle'}>
            {sortedData.length > 0 ? (
              sortedData.map((item) => (
                <TableRow key={item.business_id}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>{String(item[col.key as keyof Business])}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex justify-center mt-4">
          <Pagination
            showControls
            showShadow
            color="primary"
            page={currentPage}
            total={totalPages}
            onChange={onPageChange}
          />
        </div>
      </div>
    </>
  );
}
