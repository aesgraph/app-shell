# LayoutManager Component

A sophisticated layout management system for VS Code-style applications with resizable panels, tab management, and maximize/minimize functionality.

## Features

- **4-Pane Layout**: Left, Center, Right, and Bottom panels
- **Resizable Panels**: Uses `react-resizable-panels` for smooth resizing
- **Tab Management**: Full tab system with drag-and-drop, add/close functionality
- **Maximize/Minimize**: Click buttons to maximize individual panes or minimize them
- **Theme Integration**: Works with your existing theme system
- **Layout Persistence**: Remembers panel sizes when maximizing/restoring
- **Responsive Design**: Mobile-friendly with proper touch handling

## Usage

### Basic Setup

```tsx
import { LayoutManager } from './components/LayoutManager';
import { LayoutProvider } from './contexts/LayoutContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { WorkspaceProvider } from './contexts/WorkspaceContext';

function App() {
  return (
    <ThemeProvider>
      <WorkspaceProvider>
        <LayoutProvider>
          <LayoutManager fullViewport={true} />
        </LayoutProvider>
      </WorkspaceProvider>
    </ThemeProvider>
  );
}
```

### Props

```tsx
interface LayoutManagerProps {
  /** Whether to use full viewport or act as a contained component */
  fullViewport?: boolean;
  /** Custom style for the container */
  style?: React.CSSProperties;
  /** Custom className for the container */
  className?: string;
}
```

## Architecture

### Panel Structure

```
┌─────────────────────────────────────┐
│              Header/Menu            │
├──────┬─────────────────┬────────────┤
│      │                 │            │
│ Left │     Center      │   Right    │
│      │                 │            │
├──────┴─────────────────┴────────────┤
│             Bottom                  │
└─────────────────────────────────────┘
```

### Default Layout Sizes

- **Horizontal Split**: 20% - 60% - 20% (Left - Center - Right)
- **Vertical Split**: 75% - 25% (Top - Bottom)

### Tab System Integration

The LayoutManager integrates with your existing `TabContainer` and workspace context:

- **Tab Containers**: Each pane contains a `TabContainer` with tabs
- **Tab Actions**: Add, close, drag-and-drop between panes
- **View Registration**: Integrates with the view registry system
- **Theme Support**: Respects current theme settings

## Controls

### Panel Controls

Each panel header includes:

- **Minimize Button** (─): Collapses the panel to zero size
- **Maximize Button** (□): Maximizes the panel to full screen
- **Restore Button** (⧉): Restores panel from maximized state

### Tab Controls

- **Tab Selection**: Click to switch between tabs
- **Tab Closing**: X button on closable tabs
- **Drag & Drop**: Drag tabs between panes
- **Add Tab**: + button to add new tabs
- **View Dropdown**: Select from available view types

## Layout Persistence

The component automatically saves and restores panel layouts:

- **Auto-save**: `react-resizable-panels` handles basic persistence
- **Maximize State**: Remembers layout before maximizing
- **Local Storage**: Can be extended to persist across sessions

## Styling

### CSS Modules

The component uses CSS modules (`LayoutManager.module.css`) for styling:

```css
.layoutManager { /* Main container */ }
.pane { /* Individual panel styling */ }
.resizeHandle { /* Resize handle styling */ }
.iconButton { /* Control button styling */ }
```

### Theme Integration

Automatically applies theme classes from your theme context:

- Reads current theme via `useTheme()`
- Applies theme-specific CSS classes
- Inherits colors and styling from app theme

## Responsive Design

- **Mobile Support**: Handles touch interactions
- **Flexible Layout**: Panels can be collapsed/expanded
- **Scroll Handling**: Proper overflow handling in content areas

## Development

### Adding New Panel Types

To add a new panel position:

1. Update the `Pane` type union
2. Add panel to the PanelGroup structure
3. Update minimize/maximize logic
4. Add corresponding CSS classes

### Custom Tab Content

Tab content is provided through the workspace context:

```tsx
const customTab: TabData = {
  id: 'my-tab',
  title: 'My Custom Tab',
  content: <MyCustomComponent />,
  closable: true
};
```

### Integration with View Registry

The component automatically integrates with your view registry:

- Available views from `getAvailableViews()`
- View addition via `addView()`
- Automatic view resolution and rendering

## Migration from WorkspaceGridNew

The LayoutManager replaces `WorkspaceGridNew` with better:

- **Panel Management**: Proper collapsing and maximizing
- **Layout Persistence**: Better state management
- **Performance**: Optimized rendering and resizing
- **Accessibility**: Better keyboard and screen reader support

### Migration Steps

1. Replace `WorkspaceGridNew` imports with `LayoutManager`
2. Add `LayoutProvider` to your component tree
3. Update any custom styling to use new CSS classes
4. Test panel resizing and tab functionality

## Troubleshooting

### Panel Not Collapsing

- Ensure `minSize={0}` and `collapsible` are set on Panel components
- Check CSS for conflicting min-width/min-height rules
- Verify data attributes are properly applied

### Tab Drag/Drop Issues

- Ensure proper event handlers are passed to TabContainer
- Check that workspace context is properly provided
- Verify tab IDs are unique across panes

### Theme Not Applied

- Confirm ThemeProvider wraps the component
- Check that theme CSS classes exist
- Verify theme context is properly configured

## Best Practices

- Always wrap in required providers (Theme, Workspace, Layout)
- Use `fullViewport={false}` when embedding in larger UIs
- Provide meaningful tab titles and content
- Handle loading states in tab content
- Test panel interactions on mobile devices
- Ensure keyboard accessibility for all controls
