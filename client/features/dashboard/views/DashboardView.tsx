'use client';

import { Autocomplete, Input } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ViewSwitcher } from '../components/ViewSwitcher/ViewSwitcher';
import { ViewModeToggle } from '../components/controls/ViewModeToggle/ViewModeToggle';
import { useCitiesData, useGeoJSONData } from '../hooks/data';
import { useCompanyStore } from '../store/useCompanyStore';
import type { CompanyProperties, SortDescriptor, TableColumnConfig, ViewMode } from '../types';

// Define the table columns to match the expected types
const columns: TableColumnConfig[] = [
  {
    key: 'company_name',
    label: 'Company Name',
  },
  {
    key: 'city',
    label: 'City',
  },
  {
    key: 'postal_code',
    label: 'Postal Code',
  },
  {
    key: 'business_id', // Fixing to match available key in CompanyTableKey
    label: 'Business Line',
  },
  {
    key: 'industry_description',
    label: 'Industry',
  },
  {
    key: 'website',
    label: 'Website',
  },
];

export function DashboardView() {
  // Use only the store properties that exist
  const { selectedCity, setSelectedCity } = useCompanyStore();

  // Local state for filters that aren't in store
  const [selectedBusinessLine, setSelectedBusinessLine] = useState<string | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);

  // Local component state
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'company_name',
    direction: 'asc', // Changed to match expected type
  });

  // Get any URL parameters
  const searchParams = useSearchParams();
  const cityParam = searchParams.get('city');

  // Initialize city from URL parameter if available
  useEffect(() => {
    if (cityParam && cityParam !== selectedCity) {
      setSelectedCity(cityParam);
    }
  }, [cityParam, selectedCity, setSelectedCity]);

  // Fetch city and company data
  const { data: cities, isLoading: isLoadingCities } = useCitiesData();
  const { data: companiesData, isLoading: isLoadingCompanies } = useGeoJSONData(selectedCity);

  // Extract company data from GeoJSON
  const companies = useMemo(() => {
    if (!companiesData) return [];

    return companiesData.features.map((f) => f.properties);
  }, [companiesData]);

  // Apply filters to companies
  const filteredCompanies = useMemo(() => {
    if (!companies || companies.length === 0) return [];

    let filtered = [...companies];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (company) =>
          company.company_name?.toLowerCase().includes(searchLower) ||
          company.address?.city?.toLowerCase().includes(searchLower) ||
          company.address?.postal_code?.toLowerCase().includes(searchLower) ||
          company.industry_description?.toLowerCase().includes(searchLower),
      );
    }

    // Apply industry filter
    if (selectedIndustry) {
      filtered = filtered.filter((company) => company.industry_letter === selectedIndustry);
    }

    // Apply business line filter
    if (selectedBusinessLine) {
      filtered = filtered.filter((company) => company.business_id === selectedBusinessLine);
    }

    return filtered;
  }, [companies, searchTerm, selectedIndustry, selectedBusinessLine]);

  // For table pagination
  const totalPages = Math.ceil(filteredCompanies.length / pageSize);
  const paginatedCompanies = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredCompanies.slice(start, end);
  }, [filteredCompanies, currentPage, pageSize]);

  // Calculate a message when no data is available
  const emptyStateReason = useMemo(() => {
    if (!selectedCity) return 'Please select a city to view data';
    if (companies.length === 0 && !isLoadingCompanies) return 'No companies found for this city';
    if (filteredCompanies.length === 0) return 'No companies match the current filters';
    return 'No data available';
  }, [selectedCity, companies, filteredCompanies, isLoadingCompanies]);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-background border border-default-200 rounded-lg p-4 mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* City Selection */}
          <div>
            <label
              htmlFor="city-select"
              className="text-sm font-medium mb-1 block text-default-700"
            >
              Select City
            </label>
            <Autocomplete
              id="city-select"
              defaultItems={cities || []}
              label="City"
              placeholder="Select a city"
              className="w-full"
              isLoading={isLoadingCities}
              selectedKey={selectedCity || ''}
              onSelectionChange={(city) => {
                if (typeof city === 'string') {
                  setSelectedCity(city);
                  setCurrentPage(1); // Reset to first page when changing city
                }
              }}
            >
              {(city) => <div key={city}>{city}</div>}
            </Autocomplete>
          </div>

          {/* Search */}
          <div>
            <label
              htmlFor="company-search"
              className="text-sm font-medium mb-1 block text-default-700"
            >
              Search Companies
            </label>
            <Input
              id="company-search"
              type="text"
              placeholder="Search by name, city, etc..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
              }}
              startContent={<Icon icon="lucide:search" className="text-default-400" />}
              className="w-full"
            />
          </div>

          {/* View Mode Selection */}
          <div>
            <label
              htmlFor="view-mode-toggle"
              className="text-sm font-medium mb-1 block text-default-700"
            >
              View Mode
            </label>
            <div id="view-mode-toggle">
              <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <ViewSwitcher
        data={paginatedCompanies}
        allFilteredData={filteredCompanies}
        viewMode={viewMode}
        setViewMode={setViewMode}
        columns={columns}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        isLoading={isLoadingCompanies}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortDescriptor={sortDescriptor}
        setSortDescriptor={setSortDescriptor}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        emptyStateReason={emptyStateReason}
        geojson={companiesData}
      />
    </div>
  );
}
