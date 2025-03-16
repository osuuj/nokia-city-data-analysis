import { create } from 'zustand';

interface CompanyStore {
  selectedCity: string;
  availableCities: string[];

  setSelectedCity: (city: string) => void;
  setAvailableCities: (cities: string[]) => void;
}

export const useCompanyStore = create<CompanyStore>((set) => ({
  selectedCity: '',
  availableCities: [],

  setSelectedCity: (city) => set({ selectedCity: city }),
  setAvailableCities: (cities) => set({ availableCities: cities }),
}));