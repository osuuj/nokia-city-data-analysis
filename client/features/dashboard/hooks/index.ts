// Export all hooks from the dashboard feature

// Re-export hooks from shared directory
export { useDebounce } from '@/shared/hooks/useDebounce';

// Export actual hook implementations
export { getThemedIndustryColor, useChartTheme } from './useChartTheme';
export { useFetchCities, useFetchCompanies } from './useCompaniesQuery';
export { useFilteredBusinesses } from './useFilteredBusinesses';
export { useMapTheme } from './useMapTheme';
