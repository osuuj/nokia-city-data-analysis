import type { CompanyProperties } from '@/features/dashboard/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface SelectionState {
  // Selected rows
  selectedRows: Record<string, CompanyProperties>;
  selectedKeys: Set<string>;
  setSelectedKeys: (keys: Set<string> | 'all', allFilteredData?: CompanyProperties[]) => void;
  toggleRow: (business: CompanyProperties) => void;
  clearSelection: () => void;

  // Multi-select state
  isMultiSelectMode: boolean;
  toggleMultiSelectMode: () => void;
  lastSelectedKey: string | null;
  setLastSelectedKey: (key: string | null) => void;
}

export const useSelectionStore = create<SelectionState>()(
  devtools(
    (set) => ({
      // Selected rows
      selectedRows: {},
      selectedKeys: new Set<string>(),

      setSelectedKeys: (keys: Set<string> | 'all', allFilteredData?: CompanyProperties[]) =>
        set((state) => {
          if (keys === 'all' && allFilteredData) {
            // Select all rows across all pages (using `allFilteredData`)
            const newRows = allFilteredData.reduce(
              (acc, item) => {
                acc[item.business_id] = item;
                return acc;
              },
              {} as Record<string, CompanyProperties>,
            );
            return {
              selectedKeys: new Set(allFilteredData.map((item) => item.business_id)),
              selectedRows: newRows,
            };
          }
          return { selectedKeys: keys instanceof Set ? keys : new Set() };
        }),

      toggleRow: (business: CompanyProperties) =>
        set((state) => {
          const newRows = { ...state.selectedRows };
          const newKeys = new Set(state.selectedKeys);

          if (newRows[business.business_id]) {
            delete newRows[business.business_id];
            newKeys.delete(business.business_id);
          } else {
            newRows[business.business_id] = business;
            newKeys.add(business.business_id);
          }

          return { selectedRows: newRows, selectedKeys: newKeys };
        }),

      clearSelection: () =>
        set({
          selectedRows: {},
          selectedKeys: new Set<string>(),
          lastSelectedKey: null,
        }),

      // Multi-select state
      isMultiSelectMode: false,
      toggleMultiSelectMode: () =>
        set((state) => ({ isMultiSelectMode: !state.isMultiSelectMode })),
      lastSelectedKey: null,
      setLastSelectedKey: (key: string | null) => set({ lastSelectedKey: key }),
    }),
    {
      name: 'dashboard-selection-store',
    },
  ),
);
