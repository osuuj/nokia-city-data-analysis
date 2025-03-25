import type { CompanyProperties } from '@/types/business';
import type { SortDescriptor, TableColumnConfig } from '@/types/table';

/**
 * Returns only the columns marked as visible.
 */
export const getVisibleColumns = (columns: TableColumnConfig[]): TableColumnConfig[] => {
  return columns.filter((column) => column.visible);
};

/**
 * Sorts companies based on the provided sort descriptor.
 */
export const sortCompanies = (
  data: CompanyProperties[],
  descriptor: SortDescriptor,
): CompanyProperties[] => {
  const { column, direction } = descriptor;
  return [...data].sort((a, b) => {
    const aVal = a[column] ?? '';
    const bVal = b[column] ?? '';
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Filters companies by search term (company_name).
 */
export const applySearchFilter = (
  data: CompanyProperties[],
  searchTerm: string,
): CompanyProperties[] => {
  const term = searchTerm.toLowerCase();
  return data.filter((item) => item.company_name.toLowerCase().includes(term));
};

/**
 * Optionally filters companies by selected industry letters.
 */
export const applyIndustryFilter = (
  data: CompanyProperties[],
  selectedIndustries: string[],
): CompanyProperties[] => {
  if (selectedIndustries.length === 0) return data;
  return data.filter((item) => selectedIndustries.includes(item.industry_letter));
};
