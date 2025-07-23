// Main components

export { default as WorkspaceContainerDemo } from "./components/WorkspaceContainer";
export { LayoutManager } from "./components/LayoutManager";
export { TabManager } from "./components/TabManager";
export { default as Tab } from "./components/Tab";
export { default as ViewDropdown } from "./components/ViewDropdown";
export { ThemeVariables } from "./components/ThemeVariables";
export { ExampleThemedComponent } from "./views/examples/ExampleThemedComponent";

// Views
export { WorkspaceConfigEditor, WorkspaceManager } from "./views";
export { default as ProgrammaticWorkspaceAccess } from "./views/examples/ProgrammaticWorkspaceAccess";
export { defaultViews, registerViews, clearViews } from "./views/registerViews";

// Unified app shell context - for workspace and theme management
export { AppShellProvider } from "./contexts/AppShellContext";
export { useAppShell, useWorkspace, useTheme } from "./contexts/useAppShell";

export {
  generateCSSVars,
  generateLegacyCSSVars,
  getThemeStyles,
  applyThemeVars,
  getColor,
} from "./utils/themeUtils";
export { themes, defaultTheme, commonSizes } from "./themes/themes";

// Types
export type { WorkspaceConfig } from "./types/WorkspaceConfig";
export type { ViewRegistry, ViewDefinition } from "./types/ViewRegistry";
export type { WorkspaceState } from "./types/workspace";
export type { AppShellContextValue } from "./contexts/AppShellContext";

// Theme types - everything needed to create custom themes
export type {
  ThemeId,
  Theme,
  ThemeColors,
  ThemeSizes,
} from "./types/ThemeDefinition";

// CSS module styles
import styles from "./App.module.css";
export { styles };
