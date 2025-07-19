# App Shell Theming System

The app-shell package provides a comprehensive theming system that allows external projects to easily inherit and use app-shell themes for consistent styling.

## Quick Start

### 1. Wrap your app with ThemeProvider

```tsx
import { ThemeProvider } from "app-shell";

function App() {
  return (
    <ThemeProvider themeId="dark">
      {/* Your app components */}
    </ThemeProvider>
  );
}
```

### 2. Use the useTheme hook in your components

```tsx
import { useTheme } from "app-shell";

function MyComponent() {
  const { theme, themeId, setTheme } = useTheme();
  
  const styles = {
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    padding: theme.sizes.spacing.md,
    borderRadius: theme.sizes.borderRadius.md,
  };
  
  return <div style={styles}>Themed content</div>;
}
```

## Available Themes

- `light` - Light theme
- `dark` - Dark theme (default)
- `dracula` - Dracula color scheme
- `oneDark` - One Dark Pro theme
- `solarized` - Solarized theme
- `monokai` - Monokai theme
- `nord` - Nord theme
- `gruvbox` - Gruvbox theme
- `tokyo` - Tokyo Night theme
- `catppuccin` - Catppuccin theme

## Theme Structure

Each theme contains:

### Colors
```tsx
interface ThemeColors {
  // Core colors
  primary: string;
  secondary: string;
  accent: string;
  
  // Background colors
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  
  // Surface colors (for cards, panels, etc.)
  surface: string;
  surfaceHover: string;
  surfaceActive: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  
  // Border colors
  border: string;
  borderFocus: string;
  borderHover: string;
  
  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Interactive colors
  link: string;
  linkHover: string;
}
```

### Sizes
```tsx
interface ThemeSizes {
  spacing: {
    xs: string;    // 4px
    sm: string;    // 8px
    md: string;    // 16px
    lg: string;    // 24px
    xl: string;    // 32px
    xxl: string;   // 48px
  };
  
  borderRadius: {
    none: string;
    sm: string;    // 4px
    md: string;    // 8px
    lg: string;    // 16px
    full: string;  // 9999px
  };
  
  fontSize: {
    xs: string;    // 12px
    sm: string;    // 14px
    md: string;    // 16px
    lg: string;    // 18px
    xl: string;    // 20px
    xxl: string;   // 24px
  };
  
  shadow: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}
```

## Usage Patterns

### 1. Using the Theme Hook

```tsx
import { useTheme, getColor } from "app-shell";

function MyButton({ children, variant = "primary" }) {
  const { theme } = useTheme();
  
  const styles = {
    backgroundColor: variant === "primary" 
      ? theme.colors.primary 
      : theme.colors.surface,
    color: variant === "primary" 
      ? theme.colors.textInverse 
      : theme.colors.text,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.sizes.borderRadius.sm,
    padding: `${theme.sizes.spacing.sm} ${theme.sizes.spacing.md}`,
    fontSize: theme.sizes.fontSize.sm,
  };
  
  return <button style={styles}>{children}</button>;
}
```

### 2. Using CSS Variables

```tsx
import { ThemeVariables } from "app-shell";

function MyApp() {
  return (
    <ThemeVariables>
      <div className="my-themed-component">
        Content with CSS variables
      </div>
    </ThemeVariables>
  );
}
```

```css
.my-themed-component {
  background-color: var(--app-shell-surface);
  color: var(--app-shell-text);
  padding: var(--app-shell-spacing-md);
  border-radius: var(--app-shell-border-radius-md);
  border: 1px solid var(--app-shell-border);
}
```

### 3. Using Higher-Order Component

```tsx
import { withTheme } from "app-shell";

const MyComponent = withTheme(({ theme, themeStyles, title }) => {
  return (
    <div style={themeStyles.card}>
      <h2 style={{ color: theme.colors.primary }}>{title}</h2>
    </div>
  );
});
```

### 4. Using Utility Functions

```tsx
import { getThemeStyles, getColor } from "app-shell";

function MyComponent() {
  const { theme } = useTheme();
  const themeStyles = getThemeStyles(theme);
  
  return (
    <div style={themeStyles.panel}>
      <button style={themeStyles.button.primary}>
        Primary Button
      </button>
      <button style={themeStyles.button.secondary}>
        Secondary Button
      </button>
    </div>
  );
}
```

## Pre-built Styled Components

The theme system includes pre-built styled components for common UI elements:

```tsx
const themeStyles = getThemeStyles(theme);

// Card component
<div style={themeStyles.card}>Card content</div>

// Buttons
<button style={themeStyles.button.primary}>Primary</button>
<button style={themeStyles.button.secondary}>Secondary</button>

// Input
<input style={themeStyles.input} />

// Panel
<div style={themeStyles.panel}>Panel content</div>
```

## Creating Custom Themes

```tsx
import { Theme, themes } from "app-shell";

const myCustomTheme: Theme = {
  id: "custom",
  name: "My Custom Theme",
  colors: {
    ...themes.dark.colors,
    primary: "#ff6b6b",
    accent: "#4ecdc4",
  },
  sizes: themes.dark.sizes,
};

// Register the custom theme
const customThemes = {
  ...themes,
  custom: myCustomTheme,
};
```

## TypeScript Support

All theme utilities are fully typed:

```tsx
import { Theme, ThemeColors, ThemeSizes } from "app-shell";

function createThemedStyles(theme: Theme) {
  // Full TypeScript support for theme properties
  return {
    container: {
      backgroundColor: theme.colors.surface,
      padding: theme.sizes.spacing.lg,
    },
  };
}
```

## Best Practices

1. **Use semantic color names**: Use `theme.colors.text` instead of hardcoded colors
2. **Leverage size tokens**: Use `theme.sizes.spacing.md` for consistent spacing
3. **Wrap your app with ThemeProvider**: Ensure all components can access the theme
4. **Use CSS variables for performance**: When styling many elements, CSS variables can be more performant
5. **Create reusable styled components**: Build a library of themed components for your project

## Example Component

See `ExampleThemedComponent` for a complete example of how to create a themed component that adapts to all app-shell themes.
