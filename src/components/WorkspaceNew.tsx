import React from "react";
import Workspace from "./Workspace";
import { WorkspaceProvider } from "../contexts/WorkspaceContext";
import { ThemeProvider } from "../contexts/ThemeContext";
import type { WorkspaceConfig } from "../types/WorkspaceConfig";

/**
 * Example of using Workspace as a contained component within other UI elements
 */
const WorkspaceContainerDemo: React.FC = () => {
  const PANE_COLLAPSE_THRESHOLD = 80;
  const PANE_MIN_SIZE = PANE_COLLAPSE_THRESHOLD - 10;
  const PANE_MAX_SIZE = 700;

  const workspaceConfig: Partial<WorkspaceConfig> = {
    theme: "dark",
    leftPane: {
      defaultSize: 250,
      maxSize: PANE_MAX_SIZE,
      minSize: PANE_MIN_SIZE,
      collapseThreshold: PANE_COLLAPSE_THRESHOLD,
      collapsedSize: 16,
    },
    rightPane: {
      defaultSize: 300,
      maxSize: PANE_MAX_SIZE,
      minSize: PANE_MIN_SIZE,
      collapseThreshold: PANE_COLLAPSE_THRESHOLD,
      collapsedSize: 16,
    },
    bottomPane: {
      defaultSize: 200,
      maxSize: PANE_MAX_SIZE,
      minSize: PANE_MIN_SIZE,
      collapseThreshold: PANE_COLLAPSE_THRESHOLD,
      collapsedSize: 8,
    },
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#f0f0f0",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 0,
        padding: 0,
      }}
    >
      {/* Top Navigation Bar */}
      <div
        style={{
          height: "60px",
          backgroundColor: "#2d3748",
          color: "white",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          borderBottom: "1px solid #4a5568",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "18px" }}>My Application</h1>
        <nav style={{ marginLeft: "auto", display: "flex", gap: "20px" }}>
          <button
            style={{
              background: "transparent",
              border: "1px solid #4a5568",
              color: "white",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            File
          </button>
          <button
            style={{
              background: "transparent",
              border: "1px solid #4a5568",
              color: "white",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Edit
          </button>
        </nav>
      </div>

      {/* Main Content Area with Workspace */}
      <div
        style={{
          flex: 1,
          display: "flex",
          minHeight: 0, // Important for flex child to shrink
        }}
      >
        <ThemeProvider themeId="dark">
          <WorkspaceProvider initialConfig={workspaceConfig}>
            <Workspace
              fullViewport={false}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                flex: 1, // Make sure workspace fills available space
              }}
            />
          </WorkspaceProvider>
        </ThemeProvider>
      </div>

      {/* Status Bar */}
      <div
        style={{
          height: "30px",
          backgroundColor: "#4a5568",
          color: "white",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          fontSize: "12px",
          borderTop: "1px solid #2d3748",
        }}
      >
        Ready • TypeScript • UTF-8 • Ln 1, Col 1
      </div>
    </div>
  );
};

export default WorkspaceContainerDemo;
