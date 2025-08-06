// Main components
export { LayoutManager } from "./components/LayoutManager";
export { TabManager } from "./components/TabManager";
export { default as Tab } from "./components/Tab";
export { default as ViewDropdown } from "./components/ViewDropdown";
export { ThemeVariables } from "./components/ThemeVariables";

// Demo components
export {
  LayoutManagerDemo,
  WorkspaceContainerDemo,
  PersistentEditor,
  StatefulCounter,
} from "./demos";

// Examples
export { default as UnigraphIntegrationExample } from "./examples/UnigraphIntegrationExample";
export { default as TestCustomViewRegistration } from "./examples/TestCustomViewRegistration";

// Views
export { WorkspaceConfigEditor, WorkspaceManager } from "./views";
export { default as ProgrammaticWorkspaceAccess } from "./views/examples/ProgrammaticWorkspaceAccess";
export { ExampleThemedComponent } from "./views/examples/ExampleThemedComponent";
export { default as ThemeDemoView } from "./views/examples/ThemeDemoView";

// View registry
export { globalViewRegistry } from "./types/ViewRegistry";
export { defaultViews, registerViews } from "./views/registerViews";

// Unified app shell context - for workspace and theme management
export { AppShellProvider } from "./contexts/AppShellContext";
export { useAppShell, useWorkspace, useTheme } from "./contexts/useAppShell";

// Theme utilities
export {
  generateCSSVars,
  generateLegacyCSSVars,
  getThemeStyles,
  applyThemeVars,
  getColor,
} from "./utils/themeUtils";
export { withTheme } from "./utils/withTheme";
export { themes, defaultTheme, commonSizes } from "./themes/themes";

// Layout utilities
export { createDefaultLayoutConfig } from "./utils/layoutConfigUtils";
export { exampleCustomConfig } from "./utils/exampleConfigs";

// Programmatic view management utilities
export {
  addViewAsTab,
  addCustomViewAsTab,
  addViewsAsTabs,
  addCustomViewsAsTabs,
  getAvailableViewIds,
  getViewsByCategory,
  hasView,
} from "./utils/programmaticViews";

// Tab management utilities (use within components with AppShell context)
export { useTabManagement } from "./contexts/useAppShell";
export type {
  AddViewOptions,
  AddCustomViewOptions,
} from "./utils/programmaticViews";

// Types
export type { LayoutConfig } from "./types/LayoutConfig";
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
