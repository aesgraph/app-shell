import { globalViewRegistry } from "../types/ViewRegistry";
import type { ViewDefinition } from "../types/ViewRegistry";
import WorkspaceManager from "./WorkspaceManager";
import WorkspaceConfigEditor from "./WorkspaceConfigEditor";
import ProgrammaticWorkspaceAccess from "./examples/ProgrammaticWorkspaceAccess";
import TestComponentWithProps from "../demos/TestComponentWithProps";
import {
  FileExplorerView,
  TerminalView,
  PropertiesView,
  OutputView,
  DebugView,
} from "./demoComponents";

export const defaultViews: ViewDefinition[] = [
  {
    id: "workspace-manager",
    title: "Workspace Manager",
    component: WorkspaceManager,
    description: "Manage workspace settings and configuration",
    category: "core",
  },
  {
    id: "workspace-config",
    title: "Workspace Config",
    component: WorkspaceConfigEditor,
    description: "Edit workspace configuration",
    category: "core",
  },
  {
    id: "programmatic-workspace",
    title: "Programmatic Access",
    component: ProgrammaticWorkspaceAccess,
    description: "Example of programmatic workspace access",
    category: "example",
  },
  {
    id: "test-component-with-props",
    title: "Test Component with Props",
    component: TestComponentWithProps,
    description: "Test component that displays received props",
    category: "test",
  },
  {
    id: "file-explorer",
    title: "File Explorer",
    component: FileExplorerView,
    description: "Browse and manage files",
    category: "tools",
  },
  {
    id: "terminal",
    title: "Terminal",
    component: TerminalView,
    description: "Command line interface",
    category: "tools",
  },
  {
    id: "properties",
    title: "Properties",
    component: PropertiesView,
    description: "Edit object properties",
    category: "tools",
  },
  {
    id: "output",
    title: "Output",
    component: OutputView,
    description: "View application output",
    category: "tools",
  },
  {
    id: "debug-console",
    title: "Debug Console",
    component: DebugView,
    description: "Debug and inspect application state",
    category: "debug",
  },
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
