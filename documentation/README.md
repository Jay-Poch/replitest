# TinyWhoop FPV Component Picker Documentation

Welcome to the documentation for the TinyWhoop FPV Component Picker application.

## Table of Contents

1. [Project Overview](./01-project-overview.md)
2. [Architecture](./02-architecture.md)
3. [Data Model](./03-data-model.md)
4. [State Management](./04-state-management.md)
5. [API Routes](./05-api-routes.md)
6. [Component Guide](./06-component-guide.md)
7. [Developer Guide](./07-dev-guide.md)

## Quick Start

To start the application in development mode:

```bash
npm run dev
```

This will start both the Express backend server and the React frontend using Vite.

## Key Features

- Browse components by category (drones, goggles, radios, batteries, accessories)
- Add components to builds with automatic compatibility checking
- Save and load complete drone builds
- Filter and search for components
- View detailed specifications for all components

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, Shadcn UI
- **State Management**: Zustand, React Query
- **Backend**: Express.js, REST API
- **Storage**: In-memory with MemStorage implementation
- **Type Safety**: TypeScript, Zod

## Important Directories

- `client/src/components/` - React components
- `client/src/pages/` - Page components
- `client/src/lib/hooks/` - Custom hooks, including state management
- `server/routes.ts` - API endpoints
- `shared/schema.ts` - Data models and schemas

## Codebase Conventions

- Component props are defined using TypeScript interfaces
- React hooks follow the `use` prefix naming convention
- API routes follow RESTful conventions
- State management is isolated in custom hooks
- UI components are built with Shadcn UI and TailwindCSS