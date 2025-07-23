import React from "react";
import { AppShellProvider } from "../contexts/AppShellContext";
import { LayoutManager } from "../components/LayoutManager";
import type { WorkspaceState } from "../types/workspace";

/**
 * Demo component to showcase the LayoutManager with unified app shell context
 */
const WorkspaceDemo: React.FC = () => {
  const handleWorkspaceChange = (workspace: WorkspaceState | null) => {
    console.log("Current workspace changed:", workspace?.name || "None");
  };

  const handleThemeChange = (themeId: string) => {
    console.log("Theme changed:", themeId);
  };

  return (
    <AppShellProvider
      storageKey="demo-workspaces"
      themeId="dark"
      onWorkspaceChange={handleWorkspaceChange}
      onThemeChange={handleThemeChange}
    >
      <div style={{ width: "100vw", height: "100vh" }}>
        <LayoutManager />
      </div>
    </AppShellProvider>
  );
};

export default WorkspaceDemo;
