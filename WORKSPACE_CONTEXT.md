# Workspace Context

The Workspace Context provides a centralized way to manage saved layouts and workspace configurations in your application. It enables programmatic access to saved layouts, making it easy for upstream projects to integrate workspace management functionality.

## Features

- **Centralized Storage**: Manages all workspace states in a single context
- **Persistent Storage**: Automatically saves to localStorage with configurable storage key
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Programmatic Access**: Complete API for creating, reading, updating, and deleting workspaces
- **Validation**: Built-in workspace state validation and error handling
- **Event Handling**: Optional callbacks for workspace changes

## Basic Setup

### 1. Wrap Your App with WorkspaceProvider

```tsx
import React from 'react';
import { WorkspaceProvider } from '@your-org/app-shell';
import { YourApp } from './YourApp';

function App() {
  const handleWorkspaceChange = (workspace) => {
    console.log('Active workspace changed:', workspace?.name);
  };

  return (
    <WorkspaceProvider
      storageKey="my-app-workspaces"
      onWorkspaceChange={handleWorkspaceChange}
    >
      <YourApp />
    </WorkspaceProvider>
  );
}
```

### 2. Use the Workspace Context in Components

```tsx
import React from 'react';
import { useWorkspace } from '@your-org/app-shell';

function MyWorkspaceComponent() {
  const {
    savedWorkspaces,
    currentWorkspace,
    saveWorkspace,
    loadWorkspace,
    deleteWorkspace,
    getAllWorkspaces,
    updateWorkspace,
    duplicateWorkspace
  } = useWorkspace();

  // Your component logic here
}
```

## API Reference

### WorkspaceProvider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Child components |
| `storageKey` | `string` | `"layout-workspaces"` | localStorage key for persistence |
| `onWorkspaceChange` | `(workspace: WorkspaceState \| null) => void` | - | Callback when current workspace changes |

### useWorkspace Hook Returns

| Property | Type | Description |
|----------|------|-------------|
| `savedWorkspaces` | `WorkspaceState[]` | Array of all saved workspaces |
| `currentWorkspace` | `WorkspaceState \| null` | Currently active workspace |
| `saveWorkspace` | `(state: WorkspaceState) => void` | Save or update a workspace |
| `loadWorkspace` | `(id: string) => WorkspaceState \| null` | Load a workspace by ID |
| `deleteWorkspace` | `(id: string) => void` | Delete a workspace |
| `getAllWorkspaces` | `() => WorkspaceState[]` | Get all saved workspaces |
| `getCurrentWorkspace` | `() => WorkspaceState \| null` | Get current workspace |
| `setCurrentWorkspace` | `(workspace: WorkspaceState \| null) => void` | Set current workspace |
| `updateWorkspace` | `(id: string, updates: Partial<WorkspaceState>) => void` | Update workspace properties |
| `duplicateWorkspace` | `(id: string, newName?: string) => WorkspaceState \| null` | Duplicate a workspace |

## Usage Examples

### Saving a Workspace

```tsx
function SaveWorkspaceButton() {
  const { saveWorkspace } = useWorkspace();

  const handleSave = () => {
    const workspace: WorkspaceState = {
      id: `workspace-${Date.now()}`,
      name: 'My Custom Layout',
      timestamp: Date.now(),
      config: { /* your config */ },
      layout: {
        horizontal: [25, 50, 25],
        vertical: [80, 20]
      },
      tabContainers: [
        {
          id: 'container-1',
          tabs: [
            {
              id: 'tab-1',
              title: 'My Tab',
              content: 'Tab content',
              closable: true
            }
          ],
          activeTabId: 'tab-1'
        }
      ],
      theme: 'dark'
    };

    saveWorkspace(workspace);
  };

  return <button onClick={handleSave}>Save Current Layout</button>;
}
```

### Loading a Workspace

```tsx
function WorkspaceSelector() {
  const { savedWorkspaces, loadWorkspace } = useWorkspace();

  return (
    <select onChange={(e) => loadWorkspace(e.target.value)}>
      <option value="">Select a workspace...</option>
      {savedWorkspaces.map(workspace => (
        <option key={workspace.id} value={workspace.id}>
          {workspace.name}
        </option>
      ))}
    </select>
  );
}
```

### Programmatic Workspace Management

```tsx
function WorkspaceManager() {
  const {
    getAllWorkspaces,
    updateWorkspace,
    duplicateWorkspace,
    deleteWorkspace
  } = useWorkspace();

  const workspaces = getAllWorkspaces();

  const renameWorkspace = (id: string, newName: string) => {
    updateWorkspace(id, { name: newName });
  };

  const cloneWorkspace = (id: string) => {
    const cloned = duplicateWorkspace(id, 'Cloned Layout');
    console.log('Created clone:', cloned);
  };

  const removeWorkspace = (id: string) => {
    if (confirm('Delete this workspace?')) {
      deleteWorkspace(id);
    }
  };

  return (
    <div>
      <h3>Workspace Management</h3>
      {workspaces.map(workspace => (
        <div key={workspace.id}>
          <span>{workspace.name}</span>
          <button onClick={() => renameWorkspace(workspace.id, 'New Name')}>
            Rename
          </button>
          <button onClick={() => cloneWorkspace(workspace.id)}>
            Clone
          </button>
          <button onClick={() => removeWorkspace(workspace.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
```

## WorkspaceState Type

```typescript
interface WorkspaceState {
  id: string;
  name: string;
  timestamp: number;
  config: WorkspaceConfig;
  layout: {
    horizontal: number[];
    vertical: number[];
  };
  maximizedPane?: string | null;
  savedLayout?: {
    horizontal: number[];
    vertical: number[];
  } | null;
  tabContainers: Array<{
    id: string;
    tabs: Array<{
      id: string;
      title: string;
      content: string;
      closable?: boolean;
    }>;
    activeTabId?: string;
  }>;
  theme: ThemeId;
}
```

## Integration with WorkspaceManager Component

The `WorkspaceManager` component from the app-shell automatically integrates with this context. Simply include both the `WorkspaceProvider` and `WorkspaceManager` in your app:

```tsx
import React from 'react';
import { WorkspaceProvider, WorkspaceManager } from '@your-org/app-shell';

function App() {
  return (
    <WorkspaceProvider>
      <div>
        <WorkspaceManager />
        {/* Your other components */}
      </div>
    </WorkspaceProvider>
  );
}
```

## Error Handling

The workspace context includes built-in validation and error handling:

- Invalid workspace states are automatically filtered out
- localStorage errors are caught and logged
- Type guards ensure data integrity
- Failed operations return null or false rather than throwing

## Best Practices

1. **Always wrap your app with WorkspaceProvider** at the root level
2. **Use meaningful workspace names** for better user experience
3. **Handle loading states** when programmatically accessing workspaces
4. **Validate workspace data** before saving if you're creating workspaces programmatically
5. **Use the onWorkspaceChange callback** to sync with external state management
6. **Choose unique storage keys** for different applications or environments

## Migration from Direct localStorage

If you're currently using localStorage directly for workspace management, migrating is straightforward:

```tsx
// Before (direct localStorage)
const savedWorkspaces = JSON.parse(localStorage.getItem('workspaces') || '[]');

// After (using context)
const { savedWorkspaces } = useWorkspace();
```

The context handles all the localStorage operations internally and provides additional features like validation and error handling.
