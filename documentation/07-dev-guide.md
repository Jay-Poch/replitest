# Developer Guide

This guide provides instructions for common development tasks and best practices.

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server with `npm run dev`

The application will be available at http://localhost:5000

## Project Structure

- `client/` - Frontend React application
- `server/` - Backend Express server
- `shared/` - Shared code and schemas
- `documentation/` - Project documentation

## Common Development Tasks

### Adding a New Component Category

To add a new component category (e.g., "cameras"):

1. Update the schema in `shared/schema.ts`:
   ```typescript
   export const ComponentCategory = z.enum([
     "drone",
     "goggles",
     "radio",
     "battery",
     "accessory",
     "camera" // New category
   ]);
   ```

2. Update the BuildState interface in `client/src/lib/hooks/use-build.ts`:
   ```typescript
   interface BuildState {
     drone: Component | null;
     goggles: Component | null;
     radio: Component | null;
     battery: Component | null;
     camera: Component | null; // New category
     accessories: Component[];
   }
   ```

3. Update the initial state:
   ```typescript
   const initialState: BuildState = {
     drone: null,
     goggles: null,
     radio: Component | null;
     battery: null,
     camera: null, // New category
     accessories: []
   };
   ```

4. Update add/remove component methods in the store

5. Add category to the sidebar navigation in `client/src/components/layout/sidebar.tsx`

6. Update the current build display in `client/src/pages/home.tsx`

### Adding New Fields to Components

To add a new field to the Component model:

1. Update the schema in `shared/schema.ts`:
   ```typescript
   export const components = pgTable("components", {
     // ... existing fields
     videoFormat: text("video_format"), // New field
   });
   ```

2. Update the component in-memory store in `server/storage.ts`

3. Update component display in `client/src/components/ui/component-card.tsx`

4. Update detailed view in `client/src/components/part-details.tsx`

### Implementing Database Storage

To replace the in-memory storage with a database:

1. Create a new implementation of `IStorage` in `server/storage.ts`
   ```typescript
   export class DbStorage implements IStorage {
     // Implement all methods using database queries
   }
   ```

2. Configure the database connection in `server/index.ts`

3. Update the storage instance:
   ```typescript
   // export const storage = new MemStorage();
   export const storage = new DbStorage();
   ```

### Adding New Features

When adding new features, follow these steps:

1. Define new data models in `shared/schema.ts` if needed
2. Implement backend functionality in `server/routes.ts` and `server/storage.ts`
3. Create new React components in `client/src/components/`
4. Update state management in appropriate hooks
5. Add new pages in `client/src/pages/` if needed
6. Register routes in `client/src/App.tsx` if adding new pages

## Best Practices

### State Management

- Use selectors with Zustand to prevent unnecessary re-renders
- Keep related state in a single store
- Use React Query for API data fetching
- Avoid prop drilling by using context or Zustand

### Component Design

- Keep components small and focused
- Use composition over inheritance
- Extract reusable logic into custom hooks
- Follow the controlled component pattern for forms

### Type Safety

- Always define proper types for data and props
- Use Zod schemas for validation
- Leverage TypeScript's inference where possible
- Add appropriate error handling with type checking

### Performance Considerations

- Memoize expensive calculations with `useMemo`
- Prevent unnecessary re-renders with `useCallback` and `React.memo`
- Optimize React Query with proper cache configurations
- Use pagination or virtualization for large lists

## Common Issues and Solutions

### Problem: Component not updating when state changes

**Solution:** Ensure you're using selectors with Zustand correctly:

```typescript
// Wrong: Will cause unnecessary re-renders
const build = useBuild();

// Correct: Only re-renders when selected state changes
const drone = useBuild(state => state.drone);
```

### Problem: API requests failing

**Solution:** Check for proper error handling:

```typescript
try {
  const response = await apiRequest("GET", "/api/components");
  const data = await response.json();
  // Handle data
} catch (error) {
  console.error("Failed to fetch components:", error);
  // Show error message to user
}
```

### Problem: TypeScript errors with specifications or compatibleWith

**Solution:** Add proper type casting for JSON fields:

```typescript
const specifications = component.specifications as Record<string, string>;
```