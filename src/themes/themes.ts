import { Theme, ThemeColors, ThemeSizes } from "../types/ThemeDefinition";

// Common sizes used across all themes - exported for external theme creation
export const commonSizes: ThemeSizes = {
  spacing: {
    xs: "0.25rem",  // 4px
    sm: "0.5rem",   // 8px
    md: "1rem",     // 16px
    lg: "1.5rem",   // 24px
    xl: "2rem",     // 32px
    xxl: "3rem",    // 48px
  },
  borderRadius: {
    none: "0",
    sm: "0.25rem",  // 4px
    md: "0.5rem",   // 8px
    lg: "1rem",     // 16px
    full: "9999px",
  },
  fontSize: {
    xs: "0.75rem",  // 12px
    sm: "0.875rem", // 14px
    md: "1rem",     // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem",  // 20px
    xxl: "1.5rem",  // 24px
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
    colors: darkColors, // Placeholder - can be customized
    sizes: commonSizes,
  },
  monokai: {
    id: "monokai",
    name: "Monokai",
    colors: darkColors, // Placeholder - can be customized
    sizes: commonSizes,
  },
  nord: {
    id: "nord",
    name: "Nord",
    colors: darkColors, // Placeholder - can be customized
    sizes: commonSizes,
  },
  gruvbox: {
    id: "gruvbox",
    name: "Gruvbox",
    colors: darkColors, // Placeholder - can be customized
    sizes: commonSizes,
  },
  tokyo: {
    id: "tokyo",
    name: "Tokyo Night",
    colors: darkColors, // Placeholder - can be customized
    sizes: commonSizes,
  },
  catppuccin: {
    id: "catppuccin",
    name: "Catppuccin",
    colors: darkColors, // Placeholder - can be customized
    sizes: commonSizes,
  },
};

export const defaultTheme = themes.dark;
