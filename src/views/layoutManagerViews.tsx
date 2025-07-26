import { globalViewRegistry, ViewDefinition } from "../types/ViewRegistry";
import WorkspaceConfigEditor from "./WorkspaceConfigEditor";
import WorkspaceManager from "./WorkspaceManager";
import ThemeDemoView from "./examples/ThemeDemoView";

export const layoutManagerViews: ViewDefinition[] = [
  {
    id: "workspace-manager",
    title: "Workspace Manager",
    description: "Manage and save workspace layouts",
    component: WorkspaceManager,
    category: "core",
  },
  {
    id: "workspace-config-editor",
    title: "Theme Selector",
    description: "Select and customize workspace themes",
    component: WorkspaceConfigEditor, // This can be a different component if needed
    category: "core",
  },
  {
    id: "theme-demo-component",
    title: "Theme Demo",
    description: "Example component to demonstrate theme usage",
    component: ThemeDemoView,
    category: "core",
  },
];

export function registerLayoutManagerViews(
  log?: (message: string, ...args: unknown[]) => void
) {
  log?.("Registering layout manager views:", layoutManagerViews);
  for (const view of layoutManagerViews) {
    globalViewRegistry.registerView(view);
  }
  log?.("All registered views:", globalViewRegistry.getAllViews());
}
