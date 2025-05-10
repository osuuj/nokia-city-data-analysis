import type { CompanyProperties } from './business';

/**
 * Interface for the company store state
 */
export interface CompanyStore {
  companies: CompanyProperties[];
  filteredCompanies: CompanyProperties[];
  selectedCompanies: CompanyProperties[];
  isLoading: boolean;
  searchTerm: string;
  selectedIndustries: string[];
  distanceLimit: number | null;
  userLocation: { latitude: number; longitude: number } | null;

  // Actions
  setCompanies: (companies: CompanyProperties[]) => void;
  setFilteredCompanies: (companies: CompanyProperties[]) => void;
  setSelectedCompanies: (companies: CompanyProperties[]) => void;
  setSearchTerm: (term: string) => void;
  setSelectedIndustries: (industries: string[]) => void;
  setDistanceLimit: (limit: number | null) => void;
  setUserLocation: (location: { latitude: number; longitude: number } | null) => void;
}
