import type { TableColumnConfig } from '@/types/table';

/**
 * Returns only the columns marked as visible.
 *
 * @param columns - Full list of column configs
 * @returns Array of columns where `visible: true`
 *
 * @example
 * const visible = getVisibleColumns(columns);
 */
export const getVisibleColumns = (columns: TableColumnConfig[]): TableColumnConfig[] => {
  return columns.filter((column) => column.visible);
};
