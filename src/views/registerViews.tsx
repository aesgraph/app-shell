import React from "react";
import { globalViewRegistry } from "../types/ViewRegistry";
import type { ViewDefinition } from "../types/ViewRegistry";
import WorkspaceManager from "./WorkspaceManager";
import WorkspaceConfigEditor from "./WorkspaceConfigEditor";
import ProgrammaticWorkspaceAccess from "./examples/ProgrammaticWorkspaceAccess";

// Create some simple demo components for additional views
const FileExplorerView = () => (
  <div style={{ padding: "16px" }}>
    <h3>File Explorer</h3>
    <div style={{ marginTop: "12px" }}>
      <div style={{ marginBottom: "8px", cursor: "pointer" }}>📁 src/</div>
      <div
        style={{ marginLeft: "16px", marginBottom: "4px", cursor: "pointer" }}
      >
        📄 App.tsx
      </div>
      <div
        style={{ marginLeft: "16px", marginBottom: "4px", cursor: "pointer" }}
      >
        📄 main.tsx
      </div>
      <div
        style={{ marginLeft: "16px", marginBottom: "8px", cursor: "pointer" }}
      >
        📁 components/
      </div>
      <div style={{ marginBottom: "8px", cursor: "pointer" }}>📁 public/</div>
      <div style={{ marginBottom: "4px", cursor: "pointer" }}>
        📄 package.json
      </div>
    </div>
  </div>
);

const TerminalView = () => (
  <div
    style={{
      padding: "16px",
      backgroundColor: "#1e1e1e",
      color: "#ffffff",
      fontFamily: "monospace",
      height: "100%",
    }}
  >
    <div>$ npm run dev</div>
    <div style={{ color: "#90ee90", marginTop: "8px" }}>
      ✓ Server started on http://localhost:5173
    </div>
    <div style={{ marginTop: "12px", color: "#888" }}>
      Waiting for file changes...
    </div>
  </div>
);

const PropertiesView = () => (
  <div style={{ padding: "16px" }}>
    <h3>Properties</h3>
    <div style={{ marginTop: "12px" }}>
      <div style={{ marginBottom: "12px" }}>
        <label
          style={{ display: "block", marginBottom: "4px", fontWeight: "bold" }}
        >
          Width:
        </label>
        <input
          type="number"
          defaultValue="100"
          style={{ width: "100%", padding: "4px" }}
        />
      </div>
      <div style={{ marginBottom: "12px" }}>
        <label
          style={{ display: "block", marginBottom: "4px", fontWeight: "bold" }}
        >
          Height:
        </label>
        <input
          type="number"
          defaultValue="100"
          style={{ width: "100%", padding: "4px" }}
        />
      </div>
      <div style={{ marginBottom: "12px" }}>
        <label
          style={{ display: "block", marginBottom: "4px", fontWeight: "bold" }}
        >
          Background:
        </label>
        <input
          type="color"
          defaultValue="#ffffff"
          style={{ width: "100%", padding: "4px" }}
        />
      </div>
    </div>
  </div>
);

const OutputView = () => (
  <div
    style={{
      padding: "16px",
      backgroundColor: "#f8f8f8",
      fontFamily: "monospace",
      height: "100%",
      overflow: "auto",
    }}
  >
    <div style={{ color: "#0066cc" }}>[INFO] Application started</div>
    <div style={{ color: "#666", marginTop: "4px" }}>
      [DEBUG] Initializing components...
    </div>
    <div style={{ color: "#0066cc", marginTop: "4px" }}>
      [INFO] Layout system ready
    </div>
    <div style={{ color: "#666", marginTop: "4px" }}>
      [DEBUG] View registry loaded with {Object.keys(globalViewRegistry).length} views
    </div>
    <div style={{ color: "#009900", marginTop: "4px" }}>
      [SUCCESS] All systems operational
    </div>
  </div>
);

const DebugView = () => (
  <div style={{ padding: "16px" }}>
    <h3>Debug Console</h3>
    <div
      style={{
        marginTop: "12px",
        padding: "12px",
        backgroundColor: "#f5f5f5",
        border: "1px solid #ddd",
        borderRadius: "4px",
        fontFamily: "monospace",
        fontSize: "14px",
      }}
    >
      <div style={{ color: "#666" }}>console.log("Debug mode active")</div>
      <div style={{ color: "#0066cc", marginTop: "4px" }}>
        → Debug mode active
      </div>
      <div style={{ color: "#666", marginTop: "8px" }}>
        console.info("Layout:", layoutState)
      </div>
      <div style={{ color: "#0066cc", marginTop: "4px" }}>
        → Layout: {`{horizontal: [20, 60, 20], vertical: [75, 25]}`}
      </div>
    </div>
    <div style={{ marginTop: "12px" }}>
      <button
        style={{
          padding: "6px 12px",
          marginRight: "8px",
          backgroundColor: "#007acc",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Clear Console
      </button>
      <button
        style={{
          padding: "6px 12px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Run Tests
      </button>
    </div>
  </div>
);

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
