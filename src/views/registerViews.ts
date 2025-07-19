import { globalViewRegistry } from "../types/ViewRegistry";
import type { ViewDefinition } from "../types/ViewRegistry";
import WorkspaceManager from "../components/views/WorkspaceManager";
import WorkspaceConfigEditor from "../components/views/WorkspaceConfigEditor";

export const defaultViews: ViewDefinition[] = [
  {
    id: "workspace-manager",
    title: "Workspace Manager",
    component: WorkspaceManager,
    icon: undefined,
    category: "core",
  },
  {
    id: "workspace-config",
    title: "Workspace Config",
    component: WorkspaceConfigEditor,
    icon: undefined,
    category: "core",
  },
  // Add more built-in views here if needed
];

export function registerViews(views: ViewDefinition[]) {
  for (const view of views) {
    globalViewRegistry.registerView(view);
  }
}

export function clearViews() {
  for (const view of globalViewRegistry.getAllViews()) {
    globalViewRegistry.unregisterView(view.id);
  }
}
