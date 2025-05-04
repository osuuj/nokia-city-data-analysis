// Export all hooks from the dashboard feature
// These will be implemented properly, but for now we'll use stubs to make the app compile

// Re-export hooks from shared directory
export { useDebounce } from '@/shared/hooks/useDebounce';

// Placeholder exports for hooks that don't exist yet
export const useFilteredBusinesses = () => [];
export const usePagination = (data: unknown[], page: number, rowsPerPage: number) => ({
  paginated: [],
  totalPages: 1,
});
