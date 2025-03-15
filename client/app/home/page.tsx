'use client';

import { useCompanies } from '@/components/hooks/useCompanies';
import { Card, CardBody, Tab, Tabs } from '@heroui/react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

// ✅ Import Hooks for Table Behavior
import { useTableFilters } from '@/components/hooks/useTableFilters';
import { useTablePagination } from '@/components/hooks/useTablePagination';
import { useTableSelection } from '@/components/hooks/useTableSelection';
import { useTableSorting } from '@/components/hooks/useTableSorting';

// ✅ Dynamically Import Components for Better Performance
const MapView = dynamic(() => import('@/components/map/MapView'), { ssr: false });
const TableView = dynamic(() => import('@/components/table/Table'), { ssr: false });
const AnalyticsView = dynamic(() => import('@/components/analytics/AnalyticsView'), { ssr: false });

export default function HomePage() {
  const searchParams = useSearchParams();
  const city = searchParams.get('city');

  console.log('City query parameter:', city); // Log the city query parameter

  const { data: companies = [], isLoading, error } = useCompanies(city as string);

  useEffect(() => {
    if (error) {
      console.error('Error fetching companies:', error);
    }
  }, [error]);

  const [page, setPage] = useState(1);
  const rowsPerPage = 25;

  const removeDuplicates = (businesses: Business[]): Business[] => {
    const uniqueBusinesses = new Map<string, Business>();
    for (const business of businesses) {
      uniqueBusinesses.set(business.business_id, business);
    }
    return Array.from(uniqueBusinesses.values());
  };

  const uniqueData = useMemo(() => {
    return companies ? removeDuplicates(companies) : [];
  }, [companies]);

  const paginatedData: Business[] = useMemo(() => {
    if (!uniqueData) return [];
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return uniqueData.slice(startIndex, endIndex);
  }, [uniqueData, page]);

  const pages = useMemo(() => {
    return companies ? Math.ceil(uniqueData.length / rowsPerPage) : 0;
  }, [companies, uniqueData.length]);

  // ✅ Table Hooks (Filtering, Sorting, Pagination, Selection)
  const filters = useTableFilters(paginatedData);
  const sorting = useTableSorting(filters.filteredItems);
  const pagination = useTablePagination(sorting.sortedItems);
  const selection = useTableSelection(paginatedData);

  return (
    <div className="relative flex flex-col p-4 rounded-medium border-small border-divider">
      {/* ✅ Tabs for Navigation */}
      <Tabs defaultSelectedKey="table" aria-label="Data Views">
        <Tab key="map" title="Map">
          <Card>
            <CardBody>
              <div className="relative w-full h-[710px]">
                <MapView
                  locations={
                    selection.selectedRows.size > 0 ? selection.selectedRows : paginatedData
                  }
                />
              </div>
            </CardBody>
          </Card>
        </Tab>

        <Tab key="analytics" title="Analytics">
          <Card>
            <CardBody>
              <AnalyticsView
                data={selection.selectedRows.size > 0 ? selection.selectedRows : paginatedData}
              />
            </CardBody>
          </Card>
        </Tab>

        {/* ✅ Table Section */}
        <Tab key="table" title="Table">
          <Card>
            <CardBody>
              {/* ✅ Pass all necessary table props */}
              <TableView
                data={paginatedData}
                filteredItems={filters.filteredItems}
                filterValue={filters.filterValue}
                setFilterValue={filters.setFilterValue}
                workerTypeFilter={filters.workerTypeFilter}
                setWorkerTypeFilter={filters.setWorkerTypeFilter}
                statusFilter={filters.statusFilter}
                setStatusFilter={filters.setStatusFilter}
                sortedItems={sorting.sortedItems}
                sortDescriptor={sorting.sortDescriptor}
                setSortDescriptor={sorting.setSortDescriptor}
                paginatedItems={pagination.paginatedItems}
                currentPage={pagination.currentPage}
                totalPages={pages}
                goToPage={setPage}
                selectedRows={selection.selectedRows}
                toggleRowSelection={selection.toggleRowSelection}
                selectAllRows={selection.selectAllRows}
                clearSelection={selection.clearSelection}
                isLoading={isLoading}
              />
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
