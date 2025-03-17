# Key Components Guide

This guide explains the main React components in the application and how they work together.

## Home Page (`client/src/pages/home.tsx`)

The main page component that handles:
- Displaying the component browser
- Managing category selection
- Showing the current build
- Handling component filtering and sorting

Key features:
- Uses React Query to fetch components by category
- Manages sidebar state for mobile responsiveness
- Implements search and filtering functionality
- Displays the current build components
- Shows compatibility warnings

## ComponentCard (`client/src/components/ui/component-card.tsx`)

Displays a single component in the grid with:
- Component image
- Basic details (name, price, in-stock status)
- "Add to Build" button
- "View Details" button

Implementation:
```jsx
export function ComponentCard({ component, onViewDetails }: ComponentCardProps) {
  const addToBuild = useBuild(state => state.addComponent);
  
  // Handle adding component to build
  const handleAddToBuild = () => {
    console.log(`Component card: Adding component with category ${component.category}`, component);
    // Category in the API is singular (drone, goggle), component state uses either form
    addToBuild(component.category, component);
  };

  return (
    <Card className="overflow-hidden">
      {/* Card content with image, details, and buttons */}
      <CardFooter className="flex justify-between pt-0">
        <Button variant="outline" size="sm" onClick={() => onViewDetails(component)}>
          View Details
        </Button>
        <Button size="sm" onClick={handleAddToBuild}>
          Add to Build
        </Button>
      </CardFooter>
    </Card>
  );
}
```

## BuildSummary (`client/src/components/build-summary.tsx`)

Dialog that shows the complete current build:
- Lists all selected components
- Shows total price
- Displays compatibility issues
- Allows saving the build

Key features:
- Subscribes to build state with fine-grained selectors
- Calculates total price
- Checks component compatibility
- Handles saving builds to API

## PartDetails (`client/src/components/part-details.tsx`)

Modal dialog showing detailed component information:
- Full specifications
- Compatibility information
- Detailed description
- Component image

## Sidebar (`client/src/components/layout/sidebar.tsx`)

Navigation and filtering sidebar:
- Category selection
- Filter controls (price, weight, in-stock)
- Mobile-responsive design

## Header (`client/src/components/layout/header.tsx`)

Top navigation bar with:
- Logo/title
- Current build summary button
- Saved builds button
- Mobile menu toggle

## UI Components

The application uses the Shadcn UI component library with customized variants:

- **Buttons**: Various styles for actions
- **Cards**: For component display
- **Dialogs**: For modals and popovers
- **Forms**: For filtering and builds
- **Sidebar**: For navigation
- **Tables**: For data display

## Component Interaction Flow

1. **Header** allows opening the build summary
2. **Sidebar** allows selecting a component category
3. **Home Page** fetches and displays components for the selected category
4. **ComponentCard** displays individual components and allows adding to build
5. **BuildSummary** shows all components in current build
6. **PartDetails** shows detailed information for a selected component

## Form Handling

Forms (like filters) use the `react-hook-form` library with Zod validation:

```jsx
const form = useForm({
  resolver: zodResolver(filterSchema),
  defaultValues: {
    maxPrice: 500,
    inStockOnly: false,
    maxWeight: 100
  }
});

// On form submission
const onSubmit = (data) => {
  updateFilter("maxPrice", data.maxPrice);
  updateFilter("inStockOnly", data.inStockOnly);
  updateFilter("maxWeight", data.maxWeight);
};
```