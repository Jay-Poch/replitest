import { create } from "zustand";

interface FilterState {
  maxPrice: number;
  inStockOnly: boolean;
  maxWeight: number;
  filters: {
    maxPrice: number;
    inStockOnly: boolean;
    maxWeight: number;
  };
  updateFilter: (key: string, value: any) => void;
  resetFilters: () => void;
}

const initialState = {
  maxPrice: 200,
  inStockOnly: false,
  maxWeight: 35
};

export const useFilter = create<FilterState>((set) => ({
  ...initialState,
  filters: { ...initialState },
  
  updateFilter: (key, value) => {
    set((state) => ({
      [key]: value,
      filters: {
        ...state.filters,
        [key]: value
      }
    }));
  },
  
  resetFilters: () => {
    set({
      ...initialState,
      filters: { ...initialState }
    });
  }
}));
