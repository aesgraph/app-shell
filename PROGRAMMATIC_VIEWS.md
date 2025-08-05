# Programmatic View Management API

The app-shell package provides a convenient API for upstream applications like Unigraph to programmatically add views as tabs to panes with specific parameters and component props.

## Overview

This API allows you to:

- Add registered views as tabs to specific panes
- Add custom React components as tabs without pre-registration
- Pass specific props to view components
- Control tab activation behavior
- Add multiple views in batch operations
- Discover available views and their categories

## Core Functions

### `addViewAsTab(options: AddViewOptions): string | null`

Add a registered view as a tab to a specific pane.

```typescript
import { addViewAsTab } from "@aesgraph/app-shell";

// Basic usage
const tabId = addViewAsTab({
  viewId: "file-explorer",
  pane: "left",
});

// With custom props and title
const tabId = addViewAsTab({
  viewId: "terminal",
  pane: "bottom",
  props: { sessionId: "main", initialCommand: "ls -la" },
  title: "My Terminal",
  activate: true,
});
```

**Parameters:**

- `viewId`: The ID of the registered view
- `pane`: Target pane ("left", "center", "right", "bottom")
- `props`: Optional props to pass to the component
- `title`: Optional custom tab title
- `activate`: Whether to make this tab active (default: true)

**Returns:** Generated tab ID or null if view not found

### `addCustomViewAsTab(options: AddCustomViewOptions): string`

Add a custom React component as a tab without pre-registration. The component is added directly without affecting the global view registry.

```typescript
import { addCustomViewAsTab } from "@aesgraph/app-shell";

const MyCustomComponent = ({ data, title }) => (
  <div>
    <h3>{title}</h3>
    <p>Data: {data}</p>
  </div>
);

const tabId = addCustomViewAsTab({
  component: MyCustomComponent,
  title: "Custom View",
  pane: "center",
  props: { data: "Hello World", title: "My Data" }
});
```

**Parameters:**

- `component`: React component to render
- `title`: Tab title
- `pane`: Target pane
- `props`: Optional props to pass to the component
- `activate`: Whether to make this tab active (default: true)

**Returns:** Generated tab ID

### `addViewsAsTabs(views: AddViewOptions[]): (string | null)[]`

Add multiple registered views as tabs in batch.

```typescript
import { addViewsAsTabs } from "@aesgraph/app-shell";

const tabIds = addViewsAsTabs([
  {
    viewId: "file-explorer",
    pane: "left",
    props: { initialPath: "/home/user" },
  },
  {
    viewId: "terminal",
    pane: "bottom",
    props: { sessionId: "main" },
    activate: false,
  },
  {
    viewId: "properties",
    pane: "right",
    title: "Custom Properties",
  },
]);
```

### `addCustomViewsAsTabs(views: AddCustomViewOptions[]): string[]`

Add multiple custom components as tabs in batch.

```typescript
import { addCustomViewsAsTabs } from "@aesgraph/app-shell";

const customTabIds = addCustomViewsAsTabs([
  {
    component: DataViewer,
    title: "Data Viewer",
    pane: "center",
    props: { dataSource: "api://data" },
  },
  {
    component: GraphViewer,
    title: "Graph Viewer",
    pane: "right",
    props: { nodes: graphData.nodes },
  },
]);
```

## Discovery Functions

### `getAvailableViewIds(): string[]`

Get all available view IDs that can be added as tabs.

```typescript
import { getAvailableViewIds } from "@aesgraph/app-shell";

const availableViews = getAvailableViewIds();
console.log("Available views:", availableViews);
// Output: ["workspace-manager", "file-explorer", "terminal", ...]
```

### `getViewsByCategory(category: string): ViewDefinition[]`

Get views filtered by category.

```typescript
import { getViewsByCategory } from "@aesgraph/app-shell";

const toolViews = getViewsByCategory("tools");
console.log("Tool views:", toolViews);
```

### `hasView(viewId: string): boolean`

Check if a view exists in the registry.

```typescript
import { hasView } from "@aesgraph/app-shell";

if (hasView("file-explorer")) {
  addViewAsTab({ viewId: "file-explorer", pane: "left" });
}
```

## Types

### `AddViewOptions`

```typescript
interface AddViewOptions {
  viewId: string;
  pane: PaneType; // "left" | "center" | "right" | "bottom"
  props?: Record<string, unknown>;
  title?: string;
  activate?: boolean;
}
```

### `AddCustomViewOptions`

```typescript
interface AddCustomViewOptions {
  component: React.ComponentType<Record<string, unknown>>;
  title: string;
  pane: PaneType;
  props?: Record<string, unknown>;
  activate?: boolean;
}
```

## Unigraph Integration Example

Here's how Unigraph would integrate with this API:

```typescript
import {
  addViewAsTab,
  addCustomViewAsTab,
  addViewsAsTabs,
  getAvailableViewIds,
} from "@aesgraph/app-shell";

class UnigraphAppShellIntegration {
  private registeredTabIds: string[] = [];

  // Add Unigraph data viewer
  addDataViewer(entityId: string) {
    const tabId = addViewAsTab({
      viewId: "file-explorer",
      pane: "left",
      props: {
        initialPath: `/unigraph/entities/${entityId}`,
        showHidden: false,
      },
      title: `Entity: ${entityId}`,
    });

    if (tabId) {
      this.registeredTabIds.push(tabId);
    }
  }

  // Add custom Unigraph component
  addEntityGraph(entityIds: string[]) {
    const tabId = addCustomViewAsTab({
      component: UnigraphEntityGraph,
      title: "Entity Relationships",
      pane: "center",
      props: {
        entityIds,
        layout: "force-directed",
        showLabels: true,
      },
    });

    this.registeredTabIds.push(tabId);
  }

  // Add multiple Unigraph views
  setupUnigraphWorkspace() {
    const tabIds = addViewsAsTabs([
      {
        viewId: "workspace-manager",
        pane: "right",
        props: { workspaceId: "unigraph-workspace" },
        title: "Unigraph Workspace",
      },
      {
        viewId: "terminal",
        pane: "bottom",
        props: { sessionId: "unigraph-main" },
        title: "Unigraph Terminal",
      },
      {
        viewId: "debug-console",
        pane: "bottom",
        props: { logLevel: "debug", source: "unigraph" },
        title: "Unigraph Debug",
        activate: false,
      },
    ]);

    this.registeredTabIds.push(...tabIds.filter(Boolean));
  }

  // Clean up Unigraph tabs
  cleanup() {
    // Note: Tab removal is handled by the app-shell's internal tab management
    // This is just for tracking purposes
    this.registeredTabIds = [];
  }
}
```

## Best Practices

1. **Check View Availability**: Always check if a view exists before trying to add it
2. **Use Descriptive Titles**: Provide meaningful tab titles for better UX
3. **Batch Operations**: Use batch functions when adding multiple related views
4. **Props Validation**: Ensure props match the component's expected interface
5. **Cleanup**: Consider cleanup strategies for custom components
6. **Error Handling**: Handle cases where views don't exist or fail to load

## Error Handling

The API provides graceful error handling:

- Returns `null` for non-existent views instead of throwing errors
- Logs warnings for missing views
- Continues processing in batch operations even if some views fail
- Provides console warnings for debugging

## Performance Considerations

- Custom components are temporarily registered and automatically cleaned up
- Tab instances are cached for better performance
- Batch operations are more efficient than individual calls
- View discovery functions are lightweight and safe to call frequently
