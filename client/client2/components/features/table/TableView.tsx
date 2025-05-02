'use client';

import { useMemoizedCallback } from '@/hooks/';
import { useCompanyStore } from '@/store/useCompanyStore';
import type {
  CompanyProperties,
  CompanyTableKey,
  TableColumnConfig,
  TableViewProps,
} from '@/types';
import {
  Card,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import { useEffect, useMemo, useState } from 'react';
import { TableToolbar } from './TableToolbar';

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
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024,
  );
  const [mounted, setMounted] = useState(false);

  // Set mounted state to true after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Use window width to detect screen size
  const isMobile = windowWidth < 640;
  const isXsScreen = windowWidth < 400;

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      <div className="flex w-full flex-col items-center justify-center gap-1 px-1 py-1 sm:gap-1 sm:px-2 sm:py-2 md:gap-2 md:px-3 md:py-3">
        <div className="flex w-full justify-center">
          <Pagination
            disableCursorAnimation
            classNames={{
              base: 'text-xs gap-0.5 sm:text-sm sm:gap-1 md:text-sm md:gap-1',
              item: 'w-7 h-7 min-w-6 xs:w-8 xs:h-8 sm:w-9 sm:h-9 md:w-10 md:h-10',
              cursor: 'w-7 h-7 min-w-6 xs:w-8 xs:h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-primary-500',
              next: 'w-7 h-7 min-w-6 xs:w-8 xs:h-8 sm:w-9 sm:h-9 md:w-10 md:h-10',
              prev: 'w-7 h-7 min-w-6 xs:w-8 xs:h-8 sm:w-9 sm:h-9 md:w-10 md:h-10',
              ellipsis: 'w-7 h-7 min-w-6 xs:w-8 xs:h-8 sm:w-9 sm:h-9 md:w-10 md:h-10',
              wrapper: 'w-full flex justify-center max-w-full overflow-x-auto px-0',
            }}
            siblings={1}
            boundaries={1}
            showControls={true}
            isCompact={isMobile}
            showShadow={!isXsScreen}
            dotsJump={1}
            color="primary"
            page={currentPage}
            total={totalPages}
            onChange={onPageChange}
            size={isMobile ? 'sm' : 'md'}
            aria-label="Table pagination"
          />
        </div>

        {/* Only show page info on larger screens */}
        {!isMobile && (
          <div className="text-xs text-default-500 mt-0.5 sm:mt-1">
            Page {currentPage} of {totalPages}
          </div>
        )}
      </div>
    ),
    [currentPage, totalPages, onPageChange, isMobile, isXsScreen],
  );

  // Don't render the table until the component is mounted on the client
  if (!mounted) {
    return (
      <Card className="h-full w-full p-0.5 xs:p-1 sm:p-2 md:p-3 lg:p-4 shadow-md border border-default-200">
        <div className="flex items-center justify-center h-[70vh]">
          <Spinner size="lg" color="primary" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full w-full p-0.5 xs:p-1 sm:p-2 md:p-3 lg:p-4 shadow-md border border-default-200">
      <Table
        isHeaderSticky
        isStriped
        selectionMode="multiple"
        aria-label="Sortable Table"
        classNames={{
          base: 'max-w-full overflow-x-auto overflow-y-hidden h-[70vh] sm:h-[65vh] md:h-[70vh] lg:h-[75vh]',
          wrapper: 'w-full rounded-lg border border-default-200',
          table: 'min-w-full w-auto sm:w-full',
          /* Improved cell spacing with horizontal padding */
          td: 'text-[10px] xs:text-xs sm:text-xs md:text-sm w-auto px-1 py-0.5 xs:px-1.5 xs:py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-2 lg:px-4 lg:py-3',
          /* Improved header spacing with horizontal padding */
          th: 'text-[10px] xs:text-xs sm:text-xs md:text-sm w-auto px-1 py-0.5 xs:px-1.5 xs:py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-2 lg:px-4 lg:py-3 bg-default-200 text-default-800 font-semibold',
          tr: 'hover:bg-default-50 data-[selected=true]:bg-primary-50',
        }}
        rowHeight={isXsScreen ? 30 : isMobile ? 35 : 40}
        selectedKeys={selectedKeys}
        onSelectionChange={(keys) => {
          if (keys === 'all') {
            const allKeys = new Set(allFilteredData.map((item) => item.business_id));
            setSelectedKeys(allKeys);
          } else if (keys instanceof Set) {
            setSelectedKeys(new Set(Array.from(keys).map(String)));
          } else {
            setSelectedKeys(new Set(Array.from(keys).map(String)));
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
        checkboxesProps={{
          size: isXsScreen ? 'sm' : isMobile ? 'sm' : 'md',
          radius: 'sm',
          color: 'primary',
        }}
      >
        {/* Fixed header height with added height and lineHeight constraints */}
        <TableHeader>
          {visibleColumns.map((col: TableColumnConfig) => (
            <TableColumn
              key={col.key}
              onClick={() => toggleSort(col.key)}
              /* Removed explicit height constraints that were overriding browser defaults */
              className="py-1"
            >
              {/* Improved spacing with wider gap and better alignment */}
              <div className="flex items-center justify-start gap-1.5 w-full">
                <span className="truncate text-[10px] xs:text-xs sm:text-xs md:text-sm whitespace-nowrap">
                  {col.label}
                </span>
                {sortDescriptor.column === col.key && (
                  <span className="text-[8px] xs:text-[10px] sm:text-xs text-primary  p-0.5">
                    {sortDescriptor.direction === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </div>
            </TableColumn>
          ))}
        </TableHeader>

        <TableBody
          isLoading={isLoading}
          loadingState={isLoading ? 'loading' : 'idle'}
          loadingContent={<Spinner size="md" color="primary" />}
          emptyContent={
            <div className="text-center py-3 text-default-500 text-xs md:text-sm">
              No data available
            </div>
          }
        >
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <TableRow key={item.business_id}>
                {visibleColumns.map((col: TableColumnConfig) => (
                  <TableCell key={col.key}>
                    {/* Added more horizontal padding space for better content separation */}
                    <span className="truncate block px-0.5">
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
                    </span>
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
    </Card>
  );
}
