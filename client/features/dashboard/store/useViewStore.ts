import type { CompanyTableKey } from '@/features/dashboard/types';
import { columns } from '@shared/config/columns';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';

export type ViewMode = 'table' | 'map' | 'analytics';

export interface ViewState {
  // Current view mode
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;

  // Column visibility
  visibleColumns: typeof columns;
  toggleColumnVisibility: (key: CompanyTableKey) => void;
  resetColumns: () => void;

  // Layout preferences
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}

export const useViewStore = create<ViewState>()(
  devtools(
    persist(
      (set) => ({
        // Current view mode
        currentView: 'table',
        setCurrentView: (view: ViewMode) => set({ currentView: view }),

        // Column visibility
        visibleColumns: columns.filter((col) => col.visible),
        toggleColumnVisibility: (key: CompanyTableKey) =>
          set((state) => {
            const isVisible = state.visibleColumns.some((col) => col.key === key);
            const column = columns.find((col) => col.key === key);

            if (!column) {
              console.error(`Column with key ${key} not found!`);
              return state;
            }

            const updatedColumns = isVisible
              ? state.visibleColumns.filter((col) => col.key !== key)
              : [...state.visibleColumns, column];

            return { visibleColumns: updatedColumns };
          }),
        resetColumns: () =>
          set({
            visibleColumns: columns.filter((col) => col.visible),
          }),

        // Layout preferences
        isSidebarOpen: true,
        toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
        isFullscreen: false,
        toggleFullscreen: () => set((state) => ({ isFullscreen: !state.isFullscreen })),
      }),
      {
        name: 'dashboard-view-store',
        partialize: (state) => ({
          currentView: state.currentView,
          visibleColumns: state.visibleColumns,
          isSidebarOpen: state.isSidebarOpen,
          isFullscreen: state.isFullscreen,
        }),
      },
    ),
  ),
);
