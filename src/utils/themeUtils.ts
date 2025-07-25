import { Theme, ThemeColors } from "../types/ThemeDefinition";

/**
 * Generate CSS custom properties from theme colors
 * This allows external projects to use theme colors in CSS
 */
export const generateCSSVars = (theme: Theme): Record<string, string> => {
  const cssVars: Record<string, string> = {};

  // Colors
  Object.entries(theme.colors).forEach(([key, value]) => {
    cssVars[`--app-shell-${key}`] = value;
  });

  // Spacing
  Object.entries(theme.sizes.spacing).forEach(([key, value]) => {
    cssVars[`--app-shell-spacing-${key}`] = value;
  });

  // Border radius
  Object.entries(theme.sizes.borderRadius).forEach(([key, value]) => {
    cssVars[`--app-shell-border-radius-${key}`] = value;
  });

  // Font sizes
  Object.entries(theme.sizes.fontSize).forEach(([key, value]) => {
    cssVars[`--app-shell-font-size-${key}`] = value;
  });

  // Shadows
  Object.entries(theme.sizes.shadow).forEach(([key, value]) => {
    cssVars[`--app-shell-shadow-${key}`] = value;
  });

  return cssVars;
};

/**
 * Generate CSS styles object for React components
 */
export const getThemeStyles = (theme: Theme) => ({
  colors: theme.colors,
  sizes: theme.sizes,

  // Helper functions for common styling patterns
  card: {
    backgroundColor: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.sizes.borderRadius.md,
    boxShadow: theme.sizes.shadow.sm,
    color: theme.colors.text,
  },

  button: {
    primary: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.textInverse,
      border: `1px solid ${theme.colors.primary}`,
      borderRadius: theme.sizes.borderRadius.sm,
      padding: `${theme.sizes.spacing.sm} ${theme.sizes.spacing.md}`,
      fontSize: theme.sizes.fontSize.sm,
    },
    secondary: {
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.sizes.borderRadius.sm,
      padding: `${theme.sizes.spacing.sm} ${theme.sizes.spacing.md}`,
      fontSize: theme.sizes.fontSize.sm,
    },
  },

  input: {
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.sizes.borderRadius.sm,
    padding: `${theme.sizes.spacing.sm} ${theme.sizes.spacing.md}`,
    fontSize: theme.sizes.fontSize.sm,
  },

  panel: {
    backgroundColor: theme.colors.backgroundSecondary,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.sizes.borderRadius.lg,
    boxShadow: theme.sizes.shadow.md,
    color: theme.colors.text,
  },

  // Workspace-specific style helpers
  workspace: {
    container: {
      backgroundColor: theme.colors.workspaceBackground,
      color: theme.colors.text,
    },
    panel: {
      backgroundColor: theme.colors.workspacePanel,
      color: theme.colors.text,
    },
    titleBar: {
      backgroundColor: theme.colors.workspaceTitleBackground,
      color: theme.colors.workspaceTitleText,
    },
    resizer: {
      backgroundColor: theme.colors.workspaceResizer,
      "&:hover": {
        backgroundColor: theme.colors.workspaceResizerHover,
      },
    },
    scrollbar: {
      color: theme.colors.workspaceScrollbar,
      "&:hover": {
        color: theme.colors.workspaceScrollbarHover,
      },
    },
  },
});

/**
 * Apply theme CSS variables to a DOM element
 * Useful for external projects that want to use CSS custom properties
 */
export const applyThemeVars = (element: HTMLElement, theme: Theme) => {
  const cssVars = generateCSSVars(theme);
  Object.entries(cssVars).forEach(([property, value]) => {
    element.style.setProperty(property, value);
  });
};

/**
 * Get color value by name with fallback
 */
export const getColor = (
  colors: ThemeColors,
  colorName: keyof ThemeColors,
  fallback?: string
) => {
  return colors[colorName] || fallback || colors.text;
};

/**
 * Generate legacy CSS variables that match the original CSS variable names
 * This ensures backward compatibility with existing CSS that uses the original variable names
 */
export const generateLegacyCSSVars = (theme: Theme): Record<string, string> => {
  return {
    "--color-bg": theme.colors.workspaceBackground,
    "--color-panel": theme.colors.workspacePanel,
    "--color-text": theme.colors.text,
    "--color-border": theme.colors.border,
    "--color-title-bg": theme.colors.workspaceTitleBackground,
    "--color-title-text": theme.colors.workspaceTitleText,
    "--color-resizer": theme.colors.workspaceResizer,
    "--color-resizer-hover": theme.colors.workspaceResizerHover,
    "--color-scrollbar": theme.colors.workspaceScrollbar,
    "--color-scrollbar-hover": theme.colors.workspaceScrollbarHover,
  };
};
