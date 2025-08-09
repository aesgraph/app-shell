# App Shell

[![npm version](https://img.shields.io/npm/v/@aesgraph/app-shell.svg)](https://www.npmjs.com/package/@aesgraph/app-shell)
[![Deployed on Vercel](https://vercel.com/button)](https://app-shell-aesgraph.vercel.app)

A workspace shell component for React applications with tab management, theme support, and customizable layouts.

<img width="1644" height="1179" alt="image" src="https://github.com/user-attachments/assets/d9c46995-6892-4e55-b361-287d8e333d6a" />

## Live Demo

🚀 **[Try the live demo on Vercel](https://app-shell-aesgraph.vercel.app)**

## Installation

```bash
npm install @aesgraph/app-shell
```

## Running Locally

To run the app locally for development or testing:

```bash
# Clone the repository (if you haven't already)
git clone https://github.com/aesgraph/app-shell.git
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
import { AppShellProvider, LayoutManager } from "@aesgraph/app-shell";

function App() {
  return (
    <AppShellProvider themeId="dark">
      <LayoutManager />
    </AppShellProvider>
  );
}
```

### With Custom Configuration

```tsx
import React from "react";
import { AppShellProvider, LayoutManager } from "@aesgraph/app-shell";
import { createDefaultLayoutConfig } from "@aesgraph/app-shell/utils/layoutConfigUtils";

function App() {
  const customConfig = createDefaultLayoutConfig();
  // Customize the config as needed
  customConfig.layout = [30, 40, 30]; // Adjust pane sizes
  customConfig.bottomHeight = 25; // Adjust bottom pane height

  return (
    <AppShellProvider themeId="dark">
      <LayoutManager config={customConfig} />
    </AppShellProvider>
  );
}
```

### Demo Components

The library includes several demo components to help you get started:

```tsx
import React from "react";
import {
  WorkspaceDemo,
  LayoutManagerDemo,
  WorkspaceContainerDemo,
} from "@aesgraph/app-shell/demos";

function App() {
  return (
    <div>
      {/* Main workspace demo */}
      <WorkspaceDemo />

      {/* Layout manager demo with controls */}
      <LayoutManagerDemo />

      {/* Workspace as a contained component */}
      <WorkspaceContainerDemo />
    </div>
  );
}
```

### Core Components

- `LayoutManager` - Main workspace component with resizable panes
- `AppShellProvider` - Context provider for theme and workspace state
- `TabManager` - Tab management component
- `ViewDropdown` - Dropdown for adding new views
- `Tab` - Individual tab component

### Hooks

- `useTheme()` - Hook to access theme context
- `useWorkspace()` - Hook to access workspace context
- `useLayoutContext()` - Hook to access layout context

### Types

- `LayoutConfig` - Layout configuration interface
- `ThemeId` - Theme type definitions
- `ViewDefinition` - View definition interface
- `WorkspaceState` - Workspace state interface

## Project Structure

```
src/
├── components/          # Core UI components
│   ├── LayoutManager.tsx
│   ├── TabManager.tsx
│   ├── ViewDropdown.tsx
│   └── Tab.tsx
├── views/              # View components
│   ├── WorkspaceManager.tsx
│   ├── WorkspaceConfigEditor.tsx
│   ├── examples/       # Example views
│   │   ├── ExampleThemedComponent.tsx
│   │   ├── ThemeDemoView.tsx
│   │   └── ProgrammaticWorkspaceAccess.tsx
│   └── registerViews.tsx
├── demos/              # Demo components
│   ├── WorkspaceDemo.tsx
│   ├── LayoutManagerDemo.tsx
│   ├── WorkspaceContainer.tsx
│   └── ExampleComponents.tsx
├── contexts/           # React contexts
│   ├── AppShellContext.tsx
│   ├── ThemeContext.tsx
│   └── WorkspaceContext.tsx
├── themes/             # Theme definitions
├── types/              # TypeScript types
└── utils/              # Utility functions
```

## Themes

The workspace supports multiple terminal-inspired themes that can be customized and extended.

### Available Themes

The workspace comes with 10 built-in themes:

- **Light** - Clean light theme with dark text
- **Dark** - Classic dark theme (default)
- **Dracula** - Purple-accented dark theme
- **One Dark** - Blue-accented dark theme
- **Solarized** - Blue-green theme
- **Monokai** - High contrast with pink accents
- **Nord** - Cool blue-gray theme
- **Gruvbox** - Warm brown theme
- **Tokyo** - Blue-purple theme
- **Catppuccin** - Soft purple theme

### Using Themes

#### Programmatic Theme Switching

```tsx
import React from "react";
import { AppShellProvider, useTheme } from "@aesgraph/app-shell";

function App() {
  const { theme, setTheme } = useTheme();

  return (
    <AppShellProvider themeId="dark">
      <div>
        <select value={theme.id} onChange={(e) => setTheme(e.target.value)}>
          <option value="dark">Dark</option>
          <option value="light">Light</option>
          <option value="dracula">Dracula</option>
          <option value="oneDark">One Dark</option>
          <option value="solarized">Solarized</option>
          <option value="monokai">Monokai</option>
        </select>
        <LayoutManager />
      </div>
    </AppShellProvider>
  );
}
```

#### Initial Theme Configuration

```tsx
import React from "react";
import { AppShellProvider, LayoutManager } from "@aesgraph/app-shell";

function App() {
  return (
    <AppShellProvider themeId="dracula">
      <LayoutManager />
    </AppShellProvider>
  );
}
```

### Custom Themes

You can create custom themes by extending the theme system:

```tsx
import { registerTheme } from "@aesgraph/app-shell";

registerTheme({
  id: "my-custom-theme",
  name: "My Custom Theme",
  colors: {
    primary: "#ff6b6b",
    secondary: "#4ecdc4",
    accent: "#45b7d1",
    background: "#2c3e50",
    backgroundSecondary: "#34495e",
    backgroundTertiary: "#3a4a5c",
    surface: "#34495e",
    surfaceHover: "#4a5f7a",
    surfaceActive: "#5a6f8a",
    text: "#ecf0f1",
    textSecondary: "#bdc3c7",
    textMuted: "#95a5a6",
    textInverse: "#2c3e50",
    border: "#34495e",
    borderFocus: "#3498db",
    borderHover: "#4a5f7a",
    success: "#27ae60",
    warning: "#f39c12",
    error: "#e74c3c",
    info: "#3498db",
    link: "#3498db",
    linkHover: "#2980b9",
    workspaceBackground: "#2c3e50",
    workspacePanel: "#34495e",
    workspaceTitleBackground: "#34495e",
    workspaceTitleText: "#ecf0f1",
    workspaceResizer: "#34495e",
    workspaceResizerHover: "#4a5f7a",
    workspaceScrollbar: "#4a5f7a",
    workspaceScrollbarHover: "#5a6f8a",
  },
  sizes: {
    spacing: {
      xs: "4px",
      sm: "8px",
      md: "16px",
      lg: "24px",
      xl: "32px",
      xxl: "48px",
    },
    borderRadius: {
      none: "0",
      sm: "2px",
      md: "4px",
      lg: "8px",
      full: "9999px",
    },
    fontSize: {
      xs: "12px",
      sm: "14px",
      md: "16px",
      lg: "18px",
      xl: "20px",
      xxl: "24px",
    },
    shadow: {
      none: "none",
      sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
      md: "0 4px 6px rgba(0, 0, 0, 0.1)",
      lg: "0 10px 15px rgba(0, 0, 0, 0.1)",
      xl: "0 20px 25px rgba(0, 0, 0, 0.15)",
    },
  },
});
```

## Registering Custom Views

You can add your own custom views to the workspace using the view registry system. This allows you to extend the workspace with your own components.

### Basic View Registration

```tsx
import React from "react";
import {
  globalViewRegistry,
  AppShellProvider,
  LayoutManager,
} from "@aesgraph/app-shell";

// Define your custom view
const MyCustomView = () => <div>My Custom View Content</div>;

// Register the view
globalViewRegistry.register({
  id: "my-custom-view",
  title: "My Custom View",
  component: MyCustomView,
  icon: "🔧",
  category: "custom",
});

function App() {
  return (
    <AppShellProvider themeId="dark">
      <LayoutManager />
    </AppShellProvider>
  );
}
```

### Advanced View Configuration

```tsx
globalViewRegistry.register({
  id: "advanced-view",
  title: "Advanced View",
  description: "A more complex view with additional features",
  component: AdvancedView,
  icon: "⚡",
  category: "development",
  closable: true,
  defaultActive: false,
});
```

### View Categories

Organize your views into categories for better organization:

```tsx
globalViewRegistry.register([
  {
    id: "file-explorer",
    title: "File Explorer",
    component: FileExplorer,
    icon: "📁",
    category: "navigation",
  },
  {
    id: "terminal",
    title: "Terminal",
    component: Terminal,
    icon: "💻",
    category: "development",
  },
  {
    id: "settings",
    title: "Settings",
    component: Settings,
    icon: "⚙️",
    category: "configuration",
  },
]);
```

### Managing Registered Views

You can access and manage registered views:

```tsx
import { globalViewRegistry } from "@aesgraph/app-shell";

// Get all registered views
const allViews = globalViewRegistry.getAllViews();

// Get views by category
const devViews = globalViewRegistry.getViewsByCategory("development");

// Clear all views
globalViewRegistry.clear();
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

# Run tests
npm test
```

## Security

This project includes automated security scanning to prevent accidental exposure of sensitive information:

### Security Checks

- **TruffleHog**: Scans for verified secrets and API keys

### Security Workflow

The security scan runs automatically on:

- All pushes to `main` and `develop` branches
- All pull requests to `main` and `develop` branches

### What Gets Scanned

- API keys and secrets
- Access tokens and tokens
- Private keys and certificates
- Environment files (.env\*)
- Hardcoded credentials
- Service-specific tokens (GitHub, npm, AWS, etc.)
- And many more patterns automatically detected by Gitleaks

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
