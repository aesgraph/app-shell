// Main components
export { default as Workspace } from "./components/Workspace";
export { default as Pane } from "./components/Pane";
export { default as Tab } from "./components/Tab";
export { default as TabContainer } from "./components/TabContainer";
export { default as TabManager } from "./components/TabManager";
export { default as ViewDropdown } from "./components/ViewDropdown";

// Views
export { WorkspaceConfigEditor, WorkspaceManager } from "./components/views";

// Context and hooks
export {
  WorkspaceProvider,
  WorkspaceContext,
} from "./contexts/WorkspaceContext";
export { useWorkspace } from "./contexts/useWorkspace";

// View registration API
export { registerViews, defaultViews, clearViews } from "./views/registerViews";

// Types
export type { WorkspaceConfig } from "./types/WorkspaceConfig";
export type { ViewRegistry } from "./types/ViewRegistry";
export type { ThemeId } from "./types/Theme";

// CSS module styles
import styles from "./App.module.css";
export { styles };
