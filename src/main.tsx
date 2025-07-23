import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { globalViewRegistry } from "./types/ViewRegistry";
import App from "./App";
import WorkspaceManager from "./views/WorkspaceManager";
import WorkspaceConfigEditor from "./views/WorkspaceConfigEditor";
import { ExampleThemedComponent } from "./views/examples/ExampleThemedComponent";
import ThemeDemoView from "./views/examples/ThemeDemoView";
import ProgrammaticWorkspaceAccess from "./views/examples/ProgrammaticWorkspaceAccess";

// Wrapper components for components with specific prop requirements
const ExampleThemedComponentWrapper: React.FC<Record<string, unknown>> = () => (
  <ExampleThemedComponent
    title="Theme Demo Component"
    content="This component demonstrates how to use the app-shell theme system in your own components."
  />
);

// Register default views
globalViewRegistry.registerView({
  id: "workspace-manager",
  title: "Workspace Manager",
  component: WorkspaceManager,
  icon: "⚙️",
  category: "core",
});

globalViewRegistry.registerView({
  id: "workspace-config-editor",
  title: "Workspace Config Editor",
  component: WorkspaceConfigEditor,
  icon: "🎨",
  category: "configuration",
});

globalViewRegistry.registerView({
  id: "theme-demo-component",
  title: "Theme Demo Component",
  component: ExampleThemedComponentWrapper,
  icon: "🎨",
  category: "examples",
});

globalViewRegistry.registerView({
  id: "theme-demo-view",
  title: "Theme Demo View",
  component: ThemeDemoView,
  icon: "🌈",
  category: "examples",
});

globalViewRegistry.registerView({
  id: "programmatic-workspace-access",
  title: "Programmatic Workspace Access",
  component: ProgrammaticWorkspaceAccess,
  icon: "🔧",
  category: "examples",
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
