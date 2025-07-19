# App Shell

A flexible, resizable workspace shell component for React applications with tab management, theme support, and customizable layouts.

## Installation

```bash
npm install app-shell
```

## Usage

### Basic Setup

```tsx
import React from "react";
import { WorkspaceProvider, Workspace } from "app-shell";

function App() {
  return (
    <WorkspaceProvider>
      <Workspace />
    </WorkspaceProvider>
  );
}
```

### With Custom Configuration

```tsx
import React from "react";
import { WorkspaceProvider, Workspace } from "app-shell";

function App() {
  const initialConfig = {
    leftPane: {
      defaultSize: 250,
      minSize: 200,
      maxSize: 400,
    },
    rightPane: {
      defaultSize: 300,
      minSize: 250,
      maxSize: 500,
    },
    bottomPane: {
      defaultSize: 200,
      minSize: 150,
      maxSize: 400,
    },
  };

  return (
    <WorkspaceProvider initialConfig={initialConfig}>
      <Workspace />
    </WorkspaceProvider>
  );
}
```

### Available Themes

The workspace supports multiple terminal-inspired themes:

- `light` - Light theme
- `dark` - Dark theme
- `dracula` - Dracula theme
- `oneDark` - One Dark theme
- `solarized` - Solarized theme
- `monokai` - Monokai theme
- `nord` - Nord theme
- `gruvbox` - Gruvbox theme
- `tokyo` - Tokyo Night theme
- `catppuccin` - Catppuccin theme

### Components

- `Workspace` - Main workspace component
- `WorkspaceProvider` - Context provider for workspace state
- `Pane` - Individual resizable pane
- `TabContainer` - Container for tabs
- `Tab` - Individual tab component
- `ViewDropdown` - Dropdown for adding new views

### Hooks

- `useWorkspace()` - Hook to access workspace context

### Types

- `WorkspaceConfig` - Configuration interface
- `ThemeId` - Theme type definitions
- `ViewRegistry` - View registry types

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build library
npm run build-lib

# Build for production
npm run build
```

## License

MIT
