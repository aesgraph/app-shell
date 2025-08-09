import { Theme, ThemeColors, ThemeSizes } from "../types/ThemeDefinition";

// Common sizes used across all themes - exported for external theme creation
export const commonSizes: ThemeSizes = {
  spacing: {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    xxl: "3rem", // 48px
  },
  borderRadius: {
    none: "0",
    sm: "0.25rem", // 4px
    md: "0.5rem", // 8px
    lg: "1rem", // 16px
    full: "9999px",
  },
  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    md: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    xxl: "1.5rem", // 24px
  },
  shadow: {
    none: "none",
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  },
};

// Light theme
const lightColors: ThemeColors = {
  primary: "#3b82f6",
  secondary: "#6b7280",
  accent: "#8b5cf6",

  background: "#ffffff",
  backgroundSecondary: "#f9fafb",
  backgroundTertiary: "#f3f4f6",

  surface: "#ffffff",
  surfaceHover: "#f9fafb",
  surfaceActive: "#f3f4f6",

  text: "#111827",
  textSecondary: "#6b7280",
  textMuted: "#9ca3af",
  textInverse: "#ffffff",

  border: "#e5e7eb",
  borderFocus: "#3b82f6",
  borderHover: "#d1d5db",

  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#3b82f6",

  link: "#3b82f6",
  linkHover: "#2563eb",

  // Workspace-specific colors
  workspaceBackground: "#f5f5f5", // --color-bg
  workspacePanel: "#ffffff", // --color-panel
  workspaceTitleBackground: "#f5f5f5", // --color-title-bg
  workspaceTitleText: "#222222", // --color-title-text
  workspaceResizer: "#e0e0e0", // --color-resizer
  workspaceResizerHover: "#bdbdbd", // --color-resizer-hover
  workspaceScrollbar: "#b0b0b0", // --color-scrollbar
  workspaceScrollbarHover: "#909090", // --color-scrollbar-hover
};

// Dark theme
const darkColors: ThemeColors = {
  primary: "#3b82f6",
  secondary: "#9ca3af",
  accent: "#8b5cf6",

  background: "#111827",
  backgroundSecondary: "#1f2937",
  backgroundTertiary: "#374151",

  surface: "#1f2937",
  surfaceHover: "#374151",
  surfaceActive: "#4b5563",

  text: "#f9fafb",
  textSecondary: "#d1d5db",
  textMuted: "#9ca3af",
  textInverse: "#111827",

  border: "#374151",
  borderFocus: "#3b82f6",
  borderHover: "#4b5563",

  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#3b82f6",

  link: "#60a5fa",
  linkHover: "#93c5fd",

  // Workspace-specific colors
  workspaceBackground: "#1e1e1e", // --color-bg
  workspacePanel: "#23272e", // --color-panel
  workspaceTitleBackground: "#23272e", // --color-title-bg
  workspaceTitleText: "#d4d4d4", // --color-title-text
  workspaceResizer: "#666666", // slightly brighter for visibility
  workspaceResizerHover: "#808080", // hover also slightly brighter
  workspaceScrollbar: "#555555", // --color-scrollbar
  workspaceScrollbarHover: "#777777", // --color-scrollbar-hover
};

// Dracula theme
const draculaColors: ThemeColors = {
  primary: "#bd93f9",
  secondary: "#6272a4",
  accent: "#ff79c6",

  background: "#282a36",
  backgroundSecondary: "#44475a",
  backgroundTertiary: "#6272a4",

  surface: "#44475a",
  surfaceHover: "#6272a4",
  surfaceActive: "#bd93f9",

  text: "#f8f8f2",
  textSecondary: "#f8f8f2",
  textMuted: "#6272a4",
  textInverse: "#282a36",

  border: "#6272a4",
  borderFocus: "#bd93f9",
  borderHover: "#ff79c6",

  success: "#50fa7b",
  warning: "#f1fa8c",
  error: "#ff5555",
  info: "#8be9fd",

  link: "#8be9fd",
  linkHover: "#bd93f9",

  // Workspace-specific colors
  workspaceBackground: "#282a36", // --color-bg
  workspacePanel: "#44475a", // --color-panel
  workspaceTitleBackground: "#44475a", // --color-title-bg
  workspaceTitleText: "#bd93f9", // --color-title-text
  workspaceResizer: "#7a89b8", // slightly more distinct than scrollbar
  workspaceResizerHover: "#bd93f9", // --color-resizer-hover
  workspaceScrollbar: "#6272a4", // --color-scrollbar
  workspaceScrollbarHover: "#bd93f9", // --color-scrollbar-hover
};

// One Dark theme
const oneDarkColors: ThemeColors = {
  primary: "#61afef",
  secondary: "#abb2bf",
  accent: "#c678dd",

  background: "#282c34",
  backgroundSecondary: "#21252b",
  backgroundTertiary: "#181a1f",

  surface: "#21252b",
  surfaceHover: "#2c313c",
  surfaceActive: "#383e4a",

  text: "#abb2bf",
  textSecondary: "#5c6370",
  textMuted: "#4b5263",
  textInverse: "#282c34",

  border: "#2c313c",
  borderFocus: "#61afef",
  borderHover: "#3e4451",

  success: "#98c379",
  warning: "#e5c07b",
  error: "#e06c75",
  info: "#61afef",

  link: "#61afef",
  linkHover: "#56b6c2",

  // Workspace-specific colors
  workspaceBackground: "#282c34", // --color-bg
  workspacePanel: "#3e4451", // --color-panel
  workspaceTitleBackground: "#3e4451", // --color-title-bg
  workspaceTitleText: "#61afef", // --color-title-text
  workspaceResizer: "#7a8290", // slightly more distinct than scrollbar
  workspaceResizerHover: "#61afef", // --color-resizer-hover
  workspaceScrollbar: "#5c6370", // --color-scrollbar
  workspaceScrollbarHover: "#61afef", // --color-scrollbar-hover
};

// Solarized theme
const solarizedColors: ThemeColors = {
  primary: "#268bd2",
  secondary: "#839496",
  accent: "#d33682",

  background: "#002b36",
  backgroundSecondary: "#073642",
  backgroundTertiary: "#586e75",

  surface: "#073642",
  surfaceHover: "#586e75",
  surfaceActive: "#268bd2",

  text: "#839496",
  textSecondary: "#586e75",
  textMuted: "#657b83",
  textInverse: "#002b36",

  border: "#586e75",
  borderFocus: "#268bd2",
  borderHover: "#93a1a1",

  success: "#859900",
  warning: "#b58900",
  error: "#dc322f",
  info: "#268bd2",

  link: "#268bd2",
  linkHover: "#6c71c4",

  // Workspace-specific colors
  workspaceBackground: "#002b36", // --color-bg
  workspacePanel: "#073642", // --color-panel
  workspaceTitleBackground: "#073642", // --color-title-bg
  workspaceTitleText: "#268bd2", // --color-title-text
  workspaceResizer: "#6f8790", // slightly more distinct than scrollbar
  workspaceResizerHover: "#268bd2", // --color-resizer-hover
  workspaceScrollbar: "#586e75", // --color-scrollbar
  workspaceScrollbarHover: "#268bd2", // --color-scrollbar-hover
};

// Monokai theme
const monokaiColors: ThemeColors = {
  primary: "#f92672",
  secondary: "#f8f8f2",
  accent: "#a6e22e",

  background: "#272822",
  backgroundSecondary: "#3e3d32",
  backgroundTertiary: "#75715e",

  surface: "#3e3d32",
  surfaceHover: "#75715e",
  surfaceActive: "#f92672",

  text: "#f8f8f2",
  textSecondary: "#75715e",
  textMuted: "#66d9ef",
  textInverse: "#272822",

  border: "#75715e",
  borderFocus: "#f92672",
  borderHover: "#a6e22e",

  success: "#a6e22e",
  warning: "#fd971f",
  error: "#f92672",
  info: "#66d9ef",

  link: "#66d9ef",
  linkHover: "#f92672",

  // Workspace-specific colors
  workspaceBackground: "#272822", // --color-bg
  workspacePanel: "#3e3d32", // --color-panel
  workspaceTitleBackground: "#3e3d32", // --color-title-bg
  workspaceTitleText: "#f92672", // --color-title-text
  workspaceResizer: "#8d8973", // slightly more distinct than scrollbar
  workspaceResizerHover: "#f92672", // --color-resizer-hover
  workspaceScrollbar: "#75715e", // --color-scrollbar
  workspaceScrollbarHover: "#f92672", // --color-scrollbar-hover
};

// Nord theme
const nordColors: ThemeColors = {
  primary: "#88c0d0",
  secondary: "#eceff4",
  accent: "#5e81ac",

  background: "#2e3440",
  backgroundSecondary: "#3b4252",
  backgroundTertiary: "#4c566a",

  surface: "#3b4252",
  surfaceHover: "#4c566a",
  surfaceActive: "#88c0d0",

  text: "#eceff4",
  textSecondary: "#d8dee9",
  textMuted: "#81a1c1",
  textInverse: "#2e3440",

  border: "#4c566a",
  borderFocus: "#88c0d0",
  borderHover: "#81a1c1",

  success: "#a3be8c",
  warning: "#ebcb8b",
  error: "#bf616a",
  info: "#5e81ac",

  link: "#5e81ac",
  linkHover: "#88c0d0",

  // Workspace-specific colors
  workspaceBackground: "#2e3440", // --color-bg
  workspacePanel: "#3b4252", // --color-panel
  workspaceTitleBackground: "#3b4252", // --color-title-bg
  workspaceTitleText: "#88c0d0", // --color-title-text
  workspaceResizer: "#667389", // slightly more distinct than scrollbar
  workspaceResizerHover: "#88c0d0", // --color-resizer-hover
  workspaceScrollbar: "#4c566a", // --color-scrollbar
  workspaceScrollbarHover: "#88c0d0", // --color-scrollbar-hover
};

// Gruvbox theme
const gruvboxColors: ThemeColors = {
  primary: "#fabd2f",
  secondary: "#ebdbb2",
  accent: "#fe8019",

  background: "#282828",
  backgroundSecondary: "#3c3836",
  backgroundTertiary: "#504945",

  surface: "#3c3836",
  surfaceHover: "#504945",
  surfaceActive: "#fabd2f",

  text: "#ebdbb2",
  textSecondary: "#a89984",
  textMuted: "#928374",
  textInverse: "#282828",

  border: "#504945",
  borderFocus: "#fabd2f",
  borderHover: "#fe8019",

  success: "#b8bb26",
  warning: "#fabd2f",
  error: "#fb4934",
  info: "#83a598",

  link: "#83a598",
  linkHover: "#fabd2f",

  // Workspace-specific colors
  workspaceBackground: "#282828", // --color-bg
  workspacePanel: "#3c3836", // --color-panel
  workspaceTitleBackground: "#3c3836", // --color-title-bg
  workspaceTitleText: "#fabd2f", // --color-title-text
  workspaceResizer: "#6a625b", // slightly more distinct than scrollbar
  workspaceResizerHover: "#fabd2f", // --color-resizer-hover
  workspaceScrollbar: "#504945", // --color-scrollbar
  workspaceScrollbarHover: "#fabd2f", // --color-scrollbar-hover
};

// Tokyo Night theme
const tokyoColors: ThemeColors = {
  primary: "#7aa2f7",
  secondary: "#a9b1d6",
  accent: "#bb9af7",

  background: "#1a1b26",
  backgroundSecondary: "#24283b",
  backgroundTertiary: "#414868",

  surface: "#24283b",
  surfaceHover: "#414868",
  surfaceActive: "#7aa2f7",

  text: "#a9b1d6",
  textSecondary: "#9aa5ce",
  textMuted: "#565f89",
  textInverse: "#1a1b26",

  border: "#414868",
  borderFocus: "#7aa2f7",
  borderHover: "#bb9af7",

  success: "#9ece6a",
  warning: "#e0af68",
  error: "#f7768e",
  info: "#7dcfff",

  link: "#7dcfff",
  linkHover: "#7aa2f7",

  // Workspace-specific colors
  workspaceBackground: "#1a1b26", // --color-bg
  workspacePanel: "#24283b", // --color-panel
  workspaceTitleBackground: "#24283b", // --color-title-bg
  workspaceTitleText: "#7aa2f7", // --color-title-text
  workspaceResizer: "#5a6482", // slightly more distinct than scrollbar
  workspaceResizerHover: "#7aa2f7", // --color-resizer-hover
  workspaceScrollbar: "#414868", // --color-scrollbar
  workspaceScrollbarHover: "#7aa2f7", // --color-scrollbar-hover
};

// Catppuccin theme
const catppuccinColors: ThemeColors = {
  primary: "#cba6f7",
  secondary: "#cdd6f4",
  accent: "#f5c2e7",

  background: "#1e1e2e",
  backgroundSecondary: "#313244",
  backgroundTertiary: "#45475a",

  surface: "#313244",
  surfaceHover: "#45475a",
  surfaceActive: "#cba6f7",

  text: "#cdd6f4",
  textSecondary: "#bac2de",
  textMuted: "#9399b2",
  textInverse: "#1e1e2e",

  border: "#45475a",
  borderFocus: "#cba6f7",
  borderHover: "#f5c2e7",

  success: "#a6e3a1",
  warning: "#f9e2af",
  error: "#f38ba8",
  info: "#89b4fa",

  link: "#89b4fa",
  linkHover: "#cba6f7",

  // Workspace-specific colors
  workspaceBackground: "#1e1e2e", // --color-bg
  workspacePanel: "#313244", // --color-panel
  workspaceTitleBackground: "#313244", // --color-title-bg
  workspaceTitleText: "#cba6f7", // --color-title-text
  workspaceResizer: "#5e6273", // slightly more distinct than scrollbar
  workspaceResizerHover: "#cba6f7", // --color-resizer-hover
  workspaceScrollbar: "#45475a", // --color-scrollbar
  workspaceScrollbarHover: "#cba6f7", // --color-scrollbar-hover
};

// Export all themes
export const themes: Record<string, Theme> = {
  light: {
    id: "light",
    name: "Light",
    colors: lightColors,
    sizes: commonSizes,
  },
  dark: {
    id: "dark",
    name: "Dark",
    colors: darkColors,
    sizes: commonSizes,
  },
  dracula: {
    id: "dracula",
    name: "Dracula",
    colors: draculaColors,
    sizes: commonSizes,
  },
  oneDark: {
    id: "oneDark",
    name: "One Dark",
    colors: oneDarkColors,
    sizes: commonSizes,
  },
  // Add more themes as needed
  solarized: {
    id: "solarized",
    name: "Solarized",
    colors: solarizedColors,
    sizes: commonSizes,
  },
  monokai: {
    id: "monokai",
    name: "Monokai",
    colors: monokaiColors,
    sizes: commonSizes,
  },
  nord: {
    id: "nord",
    name: "Nord",
    colors: nordColors,
    sizes: commonSizes,
  },
  gruvbox: {
    id: "gruvbox",
    name: "Gruvbox",
    colors: gruvboxColors,
    sizes: commonSizes,
  },
  tokyo: {
    id: "tokyo",
    name: "Tokyo Night",
    colors: tokyoColors,
    sizes: commonSizes,
  },
  catppuccin: {
    id: "catppuccin",
    name: "Catppuccin",
    colors: catppuccinColors,
    sizes: commonSizes,
  },
};

export const defaultTheme = themes.dark;
