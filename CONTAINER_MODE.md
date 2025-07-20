# Workspace Container Mode

The `Workspace` component now supports two modes of operation:

## Full Viewport Mode (Default/Legacy)
This is the original behavior where the workspace takes up the entire viewport with fixed positioning.

```tsx
import { Workspace, WorkspaceProvider, ThemeProvider } from "@aesgraph/app-shell";

function App() {
  return (
    <ThemeProvider themeId="dark">
      <WorkspaceProvider initialConfig={workspaceConfig}>
        <Workspace fullViewport={true} />
      </WorkspaceProvider>
    </ThemeProvider>
  );
}
```

## Container Mode (New)
The workspace can now be embedded within other UI elements and will adapt to its container's dimensions.

```tsx
import { Workspace, WorkspaceProvider, ThemeProvider } from "@aesgraph/app-shell";

function MyApplication() {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{ height: "60px", backgroundColor: "#333" }}>
        My App Header
      </header>
      
      {/* Workspace Container */}
      <main style={{ flex: 1, padding: "10px" }}>
        <ThemeProvider themeId="dark">
          <WorkspaceProvider initialConfig={workspaceConfig}>
            <Workspace 
              fullViewport={false}
              style={{ 
                border: "1px solid #ccc",
                borderRadius: "8px" 
              }}
              className="my-workspace"
            />
          </WorkspaceProvider>
        </ThemeProvider>
      </main>
      
      {/* Footer */}
      <footer style={{ height: "30px", backgroundColor: "#666" }}>
        Status Bar
      </footer>
    </div>
  );
}
```

## Props

### WorkspaceProps

- `fullViewport?: boolean` - Whether to use full viewport mode (default: `false`)
- `style?: React.CSSProperties` - Custom styles for the workspace container
- `className?: string` - Additional CSS class names

## Key Features

- **Responsive Sizing**: In container mode, the workspace uses `ResizeObserver` to track container size changes
- **Flexible Layout**: Can be embedded in complex layouts with headers, sidebars, and footers
- **Backward Compatible**: Existing implementations continue to work with `fullViewport={true}`
- **Custom Styling**: Supports custom styles and CSS classes for integration with design systems

## Example Component

See `WorkspaceNew.tsx` for a complete example of using the workspace in container mode with a custom application shell.
