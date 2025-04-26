import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface FilterState {
  // City filter
  selectedCity: string;
  setSelectedCity: (city: string) => void;

  // Industry filters
  selectedIndustries: string[];
  setSelectedIndustries: (values: string[]) => void;
  toggleIndustry: (industry: string) => void;
  clearIndustries: () => void;

  // Location filters
  userLocation: Coordinates | null;
  setUserLocation: (coords: Coordinates | null) => void;
  distanceLimit: number | null;
  setDistanceLimit: (value: number | null) => void;

  // Search filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useFilterStore = create<FilterState>()(
  devtools(
    persist(
      (set) => ({
        // City filter
        selectedCity: '',
        setSelectedCity: (city: string) => set({ selectedCity: city }),

        // Industry filters
        selectedIndustries: [],
        setSelectedIndustries: (values: string[]) => set({ selectedIndustries: values }),
        toggleIndustry: (industry: string) =>
          set((state) => {
            const exists = state.selectedIndustries.includes(industry);
            const updated = exists
              ? state.selectedIndustries.filter((i) => i !== industry)
              : [...state.selectedIndustries, industry];
            return { selectedIndustries: updated };
          }),
        clearIndustries: () => set({ selectedIndustries: [] }),

        // Location filters
        userLocation: null,
        setUserLocation: (coords) => set({ userLocation: coords }),
        distanceLimit: null,
        setDistanceLimit: (value) => set({ distanceLimit: value }),

        // Search filter
        searchQuery: '',
        setSearchQuery: (query: string) => set({ searchQuery: query }),
      }),
      {
        name: 'dashboard-filter-store',
        partialize: (state) => ({
          selectedCity: state.selectedCity,
          selectedIndustries: state.selectedIndustries,
          userLocation: state.userLocation,
          distanceLimit: state.distanceLimit,
        }),
      },
    ),
  ),
);
