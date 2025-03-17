import { create } from "zustand";
import { Component } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

// Build interface
interface BuildState {
  drone: Component | null;
  goggles: Component | null;
  radio: Component | null;
  battery: Component | null;
  accessories: Component[];
}

// Build actions
interface BuildActions {
  addComponent: (category: string, component: Component) => void;
  removeComponent: (category: string) => void;
  resetBuild: () => void;
  loadBuild: (build: BuildState) => void;
  loadBuildById: (id: number) => Promise<void>;
}

// Initial state
const initialState: BuildState = {
  drone: null,
  goggles: null,
  radio: null,
  battery: null,
  accessories: []
};

export const useBuild = create<BuildState & BuildActions>((set, get) => ({
  ...initialState,
  
  addComponent: (category, component) => {
    // Add some debug logging
    console.log(`Adding component with category: ${category}`, component);
    
    // Normalize category for consistent handling
    const normalizedCategory = category.toLowerCase();
    
    switch (normalizedCategory) {
      case "drone":
        set({ drone: component });
        break;
      case "goggles":
        set({ goggles: component });
        break;
      case "radio":
        set({ radio: component });
        break;
      case "battery":
        set({ battery: component });
        break;
      case "accessory":
      case "accessories":
        set(state => ({
          accessories: [...state.accessories.filter(acc => acc.id !== component.id), component]
        }));
        break;
      default:
        console.warn(`Unknown component category: ${category}`);
    }
  },
  
  removeComponent: (category) => {
    // Add some debug logging
    console.log(`Removing component with category: ${category}`);
    
    // Normalize category for consistent handling
    const normalizedCategory = category.toLowerCase();
    
    switch (normalizedCategory) {
      case "drone":
        set({ drone: null });
        break;
      case "goggles":
        set({ goggles: null });
        break;
      case "radio":
        set({ radio: null });
        break;
      case "battery":
        set({ battery: null });
        break;
      case "accessory":
      case "accessories":
        set({ accessories: [] });
        break;
      default:
        console.warn(`Unknown component category: ${category}`);
    }
  },
  
  resetBuild: () => {
    set(initialState);
  },
  
  loadBuild: (build) => {
    set(build);
  },
  
  loadBuildById: async (id) => {
    try {
      const response = await apiRequest("GET", `/api/builds/${id}/with-components`);
      const buildWithComponents = await response.json();
      
      // Map the response to our state format
      set({
        drone: buildWithComponents.components.drone,
        goggles: buildWithComponents.components.goggles,
        radio: buildWithComponents.components.radio,
        battery: buildWithComponents.components.battery,
        accessories: buildWithComponents.components.accessories || []
      });
    } catch (error) {
      console.error("Failed to load build:", error);
      throw error;
    }
  }
}));

// Provider component for context
export function BuildProvider({ children }: { children: React.ReactNode }) {
  return children;
}
