# Application Architecture

## Project Structure

The application follows a modern full-stack JavaScript architecture with clear separation between client and server:

```
/
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # React components
│   │   │   ├── ui/      # Shadcn UI components
│   │   │   └── layout/  # Layout components (header, sidebar)
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utility functions and hooks
│   │   ├── pages/       # Page components
│   │   ├── App.tsx      # Main application component
│   │   └── main.tsx     # Application entry point
├── server/              # Backend Express server
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # API route definitions
│   ├── storage.ts       # Data storage implementation
│   └── vite.ts          # Vite server integration
├── shared/              # Shared code between client and server
│   └── schema.ts        # Data models and validation schemas
└── documentation/       # Project documentation
```

## Frontend Architecture

The frontend uses React with TypeScript and is organized around the following principles:

1. **Component-Based**: UI is broken down into reusable components
2. **Global State Management**: Zustand store for managing the current build state
3. **API Integration**: React Query for data fetching with caching 
4. **Type Safety**: TypeScript with Zod validation for form inputs

Key frontend features:

- **Home Page**: Main component browser with categories, filtering, and build display
- **Component Cards**: Display individual components with key info and actions
- **BuildSummary**: Dialog showing complete build with compatibility info
- **PartDetails**: Dialog showing detailed component specifications
- **Sidebar**: Category navigation and filtering options

## Backend Architecture

The backend follows a simple REST API architecture:

1. **Express Routes**: Define API endpoints in `routes.ts`
2. **Storage Interface**: Abstract data access through `IStorage` interface
3. **In-Memory Implementation**: `MemStorage` class for data persistence
4. **Type Validation**: Zod schemas for request validation

## Data Flow

1. User selects component category via sidebar
2. Frontend fetches components via React Query
3. User adds component to build via state management (useBuild hook)
4. Compatibility is checked via utility functions
5. User can save build via API endpoints

## State Management

The application uses Zustand for state management with the following key states:

1. **Build State**: Current components selected for the build
2. **UI State**: Sidebar open/closed, current category, filters
3. **Query State**: Managed by React Query for API data