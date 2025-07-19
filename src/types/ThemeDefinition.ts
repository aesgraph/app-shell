export interface ThemeColors {
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

  // Workspace-specific colors
  workspaceBackground: string;      // --color-bg
  workspacePanel: string;          // --color-panel
  workspaceTitleBackground: string; // --color-title-bg
  workspaceTitleText: string;      // --color-title-text
  workspaceResizer: string;        // --color-resizer
  workspaceResizerHover: string;   // --color-resizer-hover
  workspaceScrollbar: string;      // --color-scrollbar
  workspaceScrollbarHover: string; // --color-scrollbar-hover
}

export interface ThemeSizes {
  // Spacing
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };

  // Border radius
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    full: string;
  };

  // Font sizes
  fontSize: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };

  // Shadows
  shadow: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export interface Theme {
  id: ThemeId;
  name: string;
  colors: ThemeColors;
  sizes: ThemeSizes;
}

export type ThemeId =
  | "light"
  | "dark"
  | "dracula"
  | "oneDark"
  | "solarized"
  | "monokai"
  | "nord"
  | "gruvbox"
  | "tokyo"
  | "catppuccin";
