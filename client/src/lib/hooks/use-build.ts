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
  removeComponent: (category: string, id?: number) => void;
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

// Debug function to check what's in the store
function debugStore() {
  const state = useBuild.getState();
  console.log("Current store state:", {
    drone: state.drone?.id || null,
    goggles: state.goggles?.id || null,
    radio: state.radio?.id || null,
    battery: state.battery?.id || null,
    accessories: state.accessories?.map(a => a.id) || []
  });
}

// Use immer for immutable state updates
export const useBuild = create<BuildState & BuildActions>((set, get) => ({
  ...initialState,
  
  // Debugging middleware
  ...(process.env.NODE_ENV !== 'production' && {
    __SET_STATE_WRAPPER__: (fn: any) => {
      const prevState = get();
      console.log('Previous state:', prevState);
      const result = set(fn);
      console.log('New state:', get());
      return result;
    }
  }),
  
  addComponent: (category, component) => {
    // Add some debug logging
    console.log(`Adding component with category: ${category}`, component);
    
    // Normalize category for consistent handling
    const normalizedCategory = category.toLowerCase();
    
    // Debug current state
    const currentState = get();
    console.log("Before adding, current state is:", {
      drone: currentState.drone?.id || null,
      goggles: currentState.goggles?.id || null,
      radio: currentState.radio?.id || null,
      battery: currentState.battery?.id || null,
      accessories: currentState.accessories?.map(a => a.id) || []
    });
    
    // Create newState object based on category
    let newState: Partial<BuildState> = {};
    
    switch (normalizedCategory) {
      case "drone":
        newState = { drone: component };
        break;
      case "goggles":
        newState = { goggles: component };
        break;
      case "radio":
        newState = { radio: component };
        break;
      case "battery":
        newState = { battery: component };
        break;
      case "accessory":
      case "accessories":
        newState = { 
          accessories: [...currentState.accessories.filter(acc => acc.id !== component.id), component] 
        };
        break;
      default:
        console.warn(`Unknown component category: ${category}`);
        return; // Exit if category is unknown
    }
    
    // Apply the update and log the updated state
    set(newState);
    
    // Verify the update worked
    const updatedState = get();
    console.log("After adding, updated state is:", {
      drone: updatedState.drone?.id || null,
      goggles: updatedState.goggles?.id || null,
      radio: updatedState.radio?.id || null,
      battery: updatedState.battery?.id || null,
      accessories: updatedState.accessories?.map(a => a.id) || []
    });
  },
  
  removeComponent: (category, id) => {
    // Add some debug logging
    console.log(`Removing component with category: ${category}${id ? ` and id: ${id}` : ''}`);
    
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
        // If an ID is provided, only remove that accessory
        if (id !== undefined) {
          set(state => ({
            accessories: state.accessories.filter(acc => acc.id !== id)
          }));
        } else {
          // Otherwise remove all accessories
          set({ accessories: [] });
        }
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
