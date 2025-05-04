import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { CompanyProperties } from '../types/business';
import type { ViewMode } from '../types/view';

interface DashboardState {
  // City selection state
  selectedCity: string;
  citySearchTerm: string;

  // View mode state
  activeView: ViewMode;

  // Company selection state
  selectedCompanies: Record<string, CompanyProperties>;
  selectedCompanyIds: Set<string>;

  // Filter state
  selectedIndustries: string[];
  searchTerm: string;

  // Pagination state
  currentPage: number;
  pageSize: number;

  // Sorting state
  sortColumn: string;
  sortDirection: 'asc' | 'desc';

  // Loading states
  isCitiesLoading: boolean;
  isDataLoading: boolean;
}

interface DashboardActions {
  // City selection actions
  setSelectedCity: (city: string) => void;
  setCitySearchTerm: (term: string) => void;

  // View mode actions
  setActiveView: (view: ViewMode) => void;

  // Company selection actions
  selectCompany: (company: CompanyProperties) => void;
  deselectCompany: (companyId: string) => void;
  clearSelectedCompanies: () => void;
  setSelectedCompanies: (companies: CompanyProperties[]) => void;

  // Filter actions
  setSelectedIndustries: (industries: string[]) => void;
  toggleIndustry: (industry: string) => void;
  setSearchTerm: (term: string) => void;

  // Pagination actions
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;

  // Sorting actions
  setSorting: (column: string, direction: 'asc' | 'desc') => void;

  // Loading state actions
  setCitiesLoading: (isLoading: boolean) => void;
  setDataLoading: (isLoading: boolean) => void;
}

type DashboardStore = DashboardState & DashboardActions;

/**
 * Dashboard store for managing global dashboard state
 * Uses persist middleware to save selected city and view mode to localStorage
 */
export const useDashboardStore = create<DashboardStore>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        selectedCity: '',
        citySearchTerm: '',
        activeView: 'table',
        selectedCompanies: {},
        selectedCompanyIds: new Set(),
        selectedIndustries: [],
        searchTerm: '',
        currentPage: 1,
        pageSize: 25,
        sortColumn: 'company_name',
        sortDirection: 'asc',
        isCitiesLoading: false,
        isDataLoading: false,

        // Action implementations
        setSelectedCity: (city) => set({ selectedCity: city }),
        setCitySearchTerm: (term) => set({ citySearchTerm: term }),
        setActiveView: (view) => set({ activeView: view }),

        selectCompany: (company) =>
          set((state) => {
            const newSelectedCompanies = { ...state.selectedCompanies };
            newSelectedCompanies[company.business_id] = company;

            const newSelectedIds = new Set(state.selectedCompanyIds);
            newSelectedIds.add(company.business_id);

            return {
              selectedCompanies: newSelectedCompanies,
              selectedCompanyIds: newSelectedIds,
            };
          }),

        deselectCompany: (companyId) =>
          set((state) => {
            const newSelectedCompanies = { ...state.selectedCompanies };
            delete newSelectedCompanies[companyId];

            const newSelectedIds = new Set(state.selectedCompanyIds);
            newSelectedIds.delete(companyId);

            return {
              selectedCompanies: newSelectedCompanies,
              selectedCompanyIds: newSelectedIds,
            };
          }),

        clearSelectedCompanies: () =>
          set({
            selectedCompanies: {},
            selectedCompanyIds: new Set(),
          }),

        setSelectedCompanies: (companies) =>
          set(() => {
            const selectedCompanies: Record<string, CompanyProperties> = {};
            const selectedCompanyIds = new Set<string>();

            for (const company of companies) {
              selectedCompanies[company.business_id] = company;
              selectedCompanyIds.add(company.business_id);
            }

            return { selectedCompanies, selectedCompanyIds };
          }),

        setSelectedIndustries: (industries) => set({ selectedIndustries: industries }),

        toggleIndustry: (industry) =>
          set((state) => {
            const exists = state.selectedIndustries.includes(industry);
            const selectedIndustries = exists
              ? state.selectedIndustries.filter((i) => i !== industry)
              : [...state.selectedIndustries, industry];

            return { selectedIndustries };
          }),

        setSearchTerm: (term) => set({ searchTerm: term }),
        setCurrentPage: (page) => set({ currentPage: page }),
        setPageSize: (size) => set({ pageSize: size }),

        setSorting: (column, direction) =>
          set({
            sortColumn: column,
            sortDirection: direction,
          }),

        setCitiesLoading: (isLoading) => set({ isCitiesLoading: isLoading }),
        setDataLoading: (isLoading) => set({ isDataLoading: isLoading }),
      }),
      {
        name: 'dashboard-store',
        partialize: (state) => ({
          selectedCity: state.selectedCity,
          activeView: state.activeView,
          pageSize: state.pageSize,
          selectedIndustries: state.selectedIndustries,
        }),
      },
    ),
    { name: 'Dashboard Store' },
  ),
);
