# State Management

## Zustand Store for Build Management

The application uses Zustand for state management, primarily centered around the current build. The main store is defined in `client/src/lib/hooks/use-build.ts`.

### Build State

```typescript
interface BuildState {
  drone: Component | null;
  goggles: Component | null;
  radio: Component | null;
  battery: Component | null;
  accessories: Component[];
}
```

### Build Actions

```typescript
interface BuildActions {
  addComponent: (category: string, component: Component) => void;
  removeComponent: (category: string, id?: number) => void;
  resetBuild: () => void;
  loadBuild: (build: BuildState) => void;
  loadBuildById: (id: number) => Promise<void>;
}
```

### Key Store Implementation

```typescript
export const useBuild = create<BuildState & BuildActions>((set, get) => ({
  ...initialState,
  
  addComponent: (category, component) => {
    // Normalize category and add component to state
    const normalizedCategory = category.toLowerCase();
    
    // Create new state based on category
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
          accessories: [...get().accessories.filter(acc => acc.id !== component.id), component] 
        };
        break;
    }
    
    // Update state
    set(newState);
  },
  
  removeComponent: (category, id) => {
    // Normalize category
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
    }
  },
  
  resetBuild: () => set(initialState),
  
  loadBuild: (build) => set(build),
  
  loadBuildById: async (id) => {
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
  }
}));
```

## Using the Store

Components access the store using the `useBuild` hook with selectors to prevent unnecessary re-renders:

```typescript
// Access single field
const drone = useBuild(state => state.drone);

// Access multiple fields
const { drone, goggles, radio } = useBuild(
  state => ({ 
    drone: state.drone, 
    goggles: state.goggles, 
    radio: state.radio 
  })
);

// Access actions
const addComponent = useBuild(state => state.addComponent);
```

For imperative updates outside of React components (like in event handlers), use direct store access:

```typescript
// Direct store access for imperative updates
useBuild.getState().addComponent("drone", droneComponent);
```

## Filter State Management

The application also has a separate filter state for component filtering:

```typescript
// In client/src/lib/hooks/use-filter.ts
export const useFilter = create<FilterState>((set) => ({
  maxPrice: 500,
  inStockOnly: false,
  maxWeight: 100,
  filters: {
    maxPrice: 500,
    inStockOnly: false,
    maxWeight: 100
  },
  
  updateFilter: (key, value) => 
    set(state => ({
      [key]: value,
      filters: {
        ...state.filters,
        [key]: value
      }
    })),
  
  resetFilters: () => 
    set({
      maxPrice: 500,
      inStockOnly: false,
      maxWeight: 100,
      filters: {
        maxPrice: 500,
        inStockOnly: false,
        maxWeight: 100
      }
    })
}));
```

## UI State

Individual UI components manage their local state using React's `useState` hook, particularly for:

- Modal/Dialog open/close state
- Form input values
- Search and sort controls
- Sidebar mobile visibility

## Data Fetching State

API data fetching state is managed by React Query, which provides loading, error and data states.