// Main components
export { default as Workspace } from "./components/Workspace";
export { default as WorkspaceContainerDemo } from "./components/WorkspaceNew";
export { default as Pane } from "./components/Pane";
export { default as Tab } from "./components/Tab";
export { default as TabContainer } from "./components/TabContainer";
export { default as TabManager } from "./components/TabManager";
export { default as ViewDropdown } from "./components/ViewDropdown";
export { ThemeVariables } from "./components/ThemeVariables";
export { ExampleThemedComponent } from "./components/ExampleThemedComponent";

// Views
export { WorkspaceConfigEditor, WorkspaceManager } from "./components/views";
export { defaultViews, registerViews, clearViews } from "./views/registerViews";

// Context and hooks
export {
  WorkspaceProvider,
  WorkspaceContext,
} from "./contexts/WorkspaceContext";
export { useWorkspace } from "./contexts/useWorkspace";

// Theming system - for creating custom themes and using theme context
export { ThemeProvider } from "./contexts/ThemeContext";
export { useTheme } from "./contexts/useTheme";
export { withTheme } from "./utils/withTheme";
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
