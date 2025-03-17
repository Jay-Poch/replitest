# TinyWhoop FPV Component Picker

## Project Overview

This is a PC part picker-style website specifically designed for TinyWhoop FPV drone builds. The application allows users to select and configure compatible drone components including:

- Drones (the base frame/flight controller)
- Goggles (FPV video receivers)
- Radio transmitters
- Batteries
- Accessories

The application helps users build compatible setups by checking component compatibility, showing warnings for potential issues, and allowing users to save their builds for future reference.

## Key Features

1. **Component Browser**: Browse components by category with filtering and sorting
2. **Build Configuration**: Add/remove components to/from a current build
3. **Compatibility Checking**: Verify component compatibility using specified tags
4. **Build Saving**: Save and retrieve complete drone builds
5. **Detailed Component Views**: View detailed specifications for each component

## Technology Stack

- **Frontend**: React with TypeScript, TailwindCSS, and Shadcn UI components
- **State Management**: Zustand for global state management (current build)
- **Data Fetching**: TanStack React Query for API data fetching
- **Routing**: Wouter for client-side routing
- **Backend**: Express.js serving REST API endpoints
- **Storage**: In-memory storage with MemStorage implementation
- **Type Safety**: Zod for validation and TypeScript for type safety