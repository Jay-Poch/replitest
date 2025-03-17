# API Routes

The application's backend is built with Express.js and exposes a RESTful API for interacting with components and builds. All routes are defined in `server/routes.ts`.

## API Endpoints

### Components

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/components` | Get all components, optionally filtered by category |
| GET | `/api/components/:id` | Get a specific component by ID |
| POST | `/api/components` | Create a new component |
| PATCH | `/api/components/:id` | Update an existing component |
| DELETE | `/api/components/:id` | Delete a component |

### Builds

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/builds` | Get all builds |
| GET | `/api/builds/:id` | Get a specific build by ID |
| GET | `/api/builds/:id/with-components` | Get a build with full component details |
| POST | `/api/builds` | Create a new build |
| PATCH | `/api/builds/:id` | Update an existing build |
| DELETE | `/api/builds/:id` | Delete a build |

## Example Route Implementation

Here's an example of how the routes are implemented:

```typescript
// GET /api/components
app.get("/api/components", async (req, res) => {
  const category = req.query.category as string | undefined;
  try {
    const components = await storage.getComponents(category);
    res.json(components);
  } catch (error) {
    console.error("Error fetching components:", error);
    res.status(500).json({ error: "Failed to fetch components" });
  }
});

// POST /api/components
app.post("/api/components", async (req, res) => {
  try {
    // Validate request body
    const newComponent = insertComponentSchema.parse(req.body);
    
    // Create component
    const component = await storage.createComponent(newComponent);
    res.status(201).json(component);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: formatZodError(error) });
    } else {
      console.error("Error creating component:", error);
      res.status(500).json({ error: "Failed to create component" });
    }
  }
});
```

## Client-Side API Interaction

The frontend interacts with the API using a custom `apiRequest` wrapper function from `client/src/lib/queryClient.ts`:

```typescript
export async function apiRequest(
  method: "GET" | "POST" | "PATCH" | "DELETE",
  path: string,
  body?: any
) {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(path, options);
  await throwIfResNotOk(res);
  return res;
}
```

## React Query Integration

The application uses React Query for data fetching with caching:

```typescript
// Fetching components
const { data: components = [], isLoading } = useQuery({
  queryKey: ['/api/components', currentCategory],
  queryFn: () => apiRequest("GET", `/api/components?category=${apiCategory}`)
    .then(res => res.json()),
});

// Creating a build
const createBuild = async (buildData) => {
  await apiRequest("POST", "/api/builds", buildData);
  // Invalidate cache
  queryClient.invalidateQueries({ queryKey: ["/api/builds"] });
};
```

## Error Handling

The API implements consistent error handling:

1. For validation errors, returns `400 Bad Request` with formatted Zod error messages
2. For not found errors, returns `404 Not Found`
3. For server errors, returns `500 Internal Server Error`

All errors follow a standard format:

```json
{
  "error": "Error message description"
}
```