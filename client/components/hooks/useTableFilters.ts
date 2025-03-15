import { useMemo, useState } from 'react';

// ✅ Define Business Type (matching your API data structure)
interface Business {
  business_id: string;
  company_name: string;
  industry_description: string;
  street: string;
  building_number: string;
  postal_code: string;
  city: string;
  latitude_wgs84: string;
  longitude_wgs84: string;
  status: 'active' | 'inactive';
}

interface UseTableFiltersReturn {
  filteredItems: Business[];
  filterValue: string; // Company name search
  setFilterValue: (value: string) => void;
  statusFilter: 'all' | 'active' | 'inactive'; // Status filter
  setStatusFilter: (value: 'all' | 'active' | 'inactive') => void;
  cityFilter: string; // City filter
  setCityFilter: (value: string) => void;
  postalCodeFilter: string; // Postal code filter
  setPostalCodeFilter: (value: string) => void;
  industryFilter: string; // Industry description filter
  setIndustryFilter: (value: string) => void;
}

export function useTableFilters(data: Business[]): UseTableFiltersReturn {
  const [filterValue, setFilterValue] = useState<string>(''); // Company name search value
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all'); // Filter for status (active/inactive)
  const [cityFilter, setCityFilter] = useState<string>(''); // City filter value
  const [postalCodeFilter, setPostalCodeFilter] = useState<string>(''); // Postal code filter value
  const [industryFilter, setIndustryFilter] = useState<string>(''); // Industry description filter value

  const filteredItems = useMemo(() => {
    return data.filter((item) => {
      // ✅ Search Filter: Apply filter by company name
      const matchesSearch = item.company_name.toLowerCase().includes(filterValue.toLowerCase());

      // ✅ Status Filter: Apply if not "all"
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

      // ✅ City Filter: Apply if not empty
      const matchesCity =
        cityFilter === '' || item.city.toLowerCase().includes(cityFilter.toLowerCase());

      // ✅ Postal Code Filter: Apply if not empty
      const matchesPostalCode =
        postalCodeFilter === '' ||
        item.postal_code.toLowerCase().includes(postalCodeFilter.toLowerCase());

      // ✅ Industry Filter: Apply if not empty
      const matchesIndustry =
        industryFilter === '' ||
        item.industry_description.toLowerCase().includes(industryFilter.toLowerCase());

      // ✅ Return only if all conditions are true
      return matchesSearch && matchesStatus && matchesCity && matchesPostalCode && matchesIndustry;
    });
  }, [filterValue, statusFilter, cityFilter, postalCodeFilter, industryFilter, data]);

  return {
    filteredItems,
    filterValue,
    setFilterValue,
    statusFilter,
    setStatusFilter,
    cityFilter,
    setCityFilter,
    postalCodeFilter,
    setPostalCodeFilter,
    industryFilter,
    setIndustryFilter,
  };
}
