# Data Model

## Core Data Entities

The application is based on two primary data entities defined in `shared/schema.ts`:

### Component

Components are the individual parts that make up a drone build:

```typescript
export const components = pgTable("components", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: numeric("price").notNull(),
  image: text("image").notNull(),
  description: text("description").notNull(),
  weight: numeric("weight"),
  inStock: boolean("in_stock"),
  specifications: jsonb("specifications").notNull(),
  compatibleWith: jsonb("compatible_with").notNull(),
});
```

Key fields:
- **id**: Unique identifier
- **name**: Component name
- **category**: One of: "drone", "goggles", "radio", "battery", "accessory"
- **price**: Component price
- **image**: URL to component image
- **description**: Text description of the component
- **specifications**: JSON object with component specs
- **compatibleWith**: Array of compatibility tags (ex: "battery-1s", "radio-frsky")

### Build

Builds represent a complete or partial drone configuration:

```typescript
export const builds = pgTable("builds", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  componentIds: jsonb("component_ids").notNull(),
});
```

Key fields:
- **id**: Unique identifier
- **name**: Build name
- **createdAt**: Creation timestamp
- **componentIds**: JSON object mapping component types to IDs

## Component Categories

The application organizes components into the following categories:

1. **Drone**: The base TinyWhoop frame/flight controller
2. **Goggles**: FPV video receiver system
3. **Radio**: Radio transmitter for control
4. **Battery**: Power source (typically 1S or 2S LiPo)
5. **Accessory**: Additional components like props, antennas, etc.

## Build State

In the application, the current build is managed through Zustand with this structure:

```typescript
interface BuildState {
  drone: Component | null;
  goggles: Component | null;
  radio: Component | null;
  battery: Component | null;
  accessories: Component[];
}
```

This allows for a single component in each main category, but multiple accessories.

## Compatibility System

Compatibility is determined using tags in the `compatibleWith` array. The application checks:

1. If a drone is selected, other components must have compatible tags
2. Battery voltage must match drone requirements (1S, 2S)
3. Radio protocol must match drone receiver type (FrSky, ELRS, etc.)

The application displays warnings when incompatible components are selected.

## Storage Implementation

The application uses an in-memory storage system (`MemStorage`) that implements the `IStorage` interface:

```typescript
export interface IStorage {
  // Component operations
  getComponents(category?: string): Promise<Component[]>;
  getComponent(id: number): Promise<Component | undefined>;
  createComponent(component: InsertComponent): Promise<Component>;
  updateComponent(id: number, component: Partial<Component>): Promise<Component | undefined>;
  deleteComponent(id: number): Promise<boolean>;
  
  // Build operations
  getBuilds(): Promise<Build[]>;
  getBuild(id: number): Promise<Build | undefined>;
  getBuildWithComponents(id: number): Promise<BuildWithComponents | undefined>;
  createBuild(build: InsertBuild): Promise<Build>;
  updateBuild(id: number, build: Partial<Build>): Promise<Build | undefined>;
  deleteBuild(id: number): Promise<boolean>;
}
```

This interface allows for easy extension to database persistence in the future.