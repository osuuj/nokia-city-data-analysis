import type { TableColumnConfig } from '@/types/table';

export const getVisibleColumns = (columns: TableColumnConfig[]): TableColumnConfig[] => {
  return columns.filter((column) => column.visible);
};
