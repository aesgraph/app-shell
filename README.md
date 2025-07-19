# App Shell

A flexible, resizable workspace shell component for React applications with tab management, theme support, and customizable layouts.

## Installation

```bash
npm install app-shell
```

## Running Locally

To run the app locally for development or testing:

```bash
# Clone the repository (if you haven't already)
git clone <repo-url>
cd app-shell

# Install dependencies
npm install

# Start the development server
npm run dev
```

This will start the app on [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal). You can now view and develop the app in your browser.

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

## Registering Custom Views

You can add your own custom views to the workspace using the `registerViews` API. This allows you to extend the workspace with your own components.

### Example

```tsx
import React from "react";
import { registerViews, WorkspaceProvider, Workspace } from "app-shell";

// Define your custom view
const MyCustomView = () => <div>My Custom View Content</div>;

registerViews([
  {
    id: "my-custom-view",
    title: "My Custom View",
    component: MyCustomView,
    icon: "🔧",
    category: "custom",
  },
]);

function App() {
  return (
    <WorkspaceProvider>
      <Workspace />
    </WorkspaceProvider>
  );
}
```

You can also access and register the built-in views using the `defaultViews` export:

```tsx
import { registerViews, defaultViews } from "app-shell";

registerViews(defaultViews);
```

To remove all registered views, use:

```tsx
import { clearViews } from "app-shell";

clearViews();
```

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

### Commit Message Format

This project uses [semantic-release](https://github.com/semantic-release/semantic-release) for automated versioning and releases. To ensure proper release detection, commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

#### Required Commit Prefixes

- `feat:` - New features (triggers minor version bump)
- `fix:` - Bug fixes (triggers patch version bump)
- `perf:` - Performance improvements (triggers patch version bump)
- `BREAKING CHANGE:` - Breaking changes (triggers major version bump)
- `docs:` - Documentation changes (no version bump)
- `style:` - Code style changes (no version bump)
- `refactor:` - Code refactoring (no version bump)
- `test:` - Adding or updating tests (no version bump)
- `chore:` - Maintenance tasks (no version bump)

#### Examples

```bash
# New feature
git commit -m "feat: add dark theme support"

# Bug fix
git commit -m "fix: resolve tab dragging issue"

# Breaking change
git commit -m "feat: redesign workspace layout

BREAKING CHANGE: Workspace component API has changed"

# Style changes (no release)
git commit -m "style: improve button spacing"

# Documentation (no release)
git commit -m "docs: update installation instructions"
```

**Note:** Commits without these prefixes (like "style improvements" or "update code") will not trigger semantic-release and won't create new versions.

## License

MIT
