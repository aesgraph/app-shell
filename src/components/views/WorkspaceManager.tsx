import React, { useEffect, useState } from "react";
import { useTheme } from "../../contexts/useTheme";
import type { WorkspaceState } from "../../types/workspace";

const WorkspaceManager = () => {
  const { theme } = useTheme();

  const [savedWorkspaces, setSavedWorkspaces] = useState<WorkspaceState[]>([]);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(
    null
  );

  useEffect(() => {
    const saved = localStorage.getItem("layout-workspaces");
    if (saved) {
      try {
        const workspaces = JSON.parse(saved);
        setSavedWorkspaces(workspaces);
      } catch (error) {
        console.error("Failed to load saved workspaces:", error);
      }
    }
  }, []);

  const saveCurrentWorkspace = () => {
    if (!newWorkspaceName.trim()) {
      alert("Please enter a workspace name");
      return;
    }

    // Get current workspace state from LayoutManager
    const getCurrentWorkspaceState = (
      globalThis as {
        getCurrentWorkspaceState?: () => Omit<
          WorkspaceState,
          "id" | "name" | "timestamp"
        >;
      }
    ).getCurrentWorkspaceState;
    if (!getCurrentWorkspaceState) {
      alert("Unable to access current workspace state");
      return;
    }

    const currentState = getCurrentWorkspaceState();
    const workspaceState: WorkspaceState = {
      id: `workspace-${Date.now()}`,
      name: newWorkspaceName.trim(),
      timestamp: Date.now(),
      ...currentState,
    };

    const updatedWorkspaces = [...savedWorkspaces, workspaceState];
    setSavedWorkspaces(updatedWorkspaces);
    localStorage.setItem(
      "layout-workspaces",
      JSON.stringify(updatedWorkspaces)
    );
    setNewWorkspaceName("");
    console.log("Saved workspace:", workspaceState);
  };

  const loadWorkspace = (workspaceId: string) => {
    const workspace = savedWorkspaces.find((w) => w.id === workspaceId);
    if (!workspace) {
      alert("Workspace not found!");
      return;
    }

    // Get restore function from LayoutManager
    const restoreWorkspaceState = (
      globalThis as {
        restoreWorkspaceState?: (state: WorkspaceState) => void;
      }
    ).restoreWorkspaceState;

    if (!restoreWorkspaceState) {
      alert("Unable to access workspace restore functionality");
      return;
    }

    try {
      restoreWorkspaceState(workspace);
      setSelectedWorkspace(workspaceId);
      console.log("Successfully loaded workspace:", workspace.name);
    } catch (error) {
      console.error("Error loading workspace:", error);
      alert("Failed to load workspace. Check console for details.");
    }
  };

  const deleteWorkspace = (workspaceId: string) => {
    if (confirm("Are you sure you want to delete this workspace?")) {
      const updatedWorkspaces = savedWorkspaces.filter(
        (w) => w.id !== workspaceId
      );
      setSavedWorkspaces(updatedWorkspaces);
      localStorage.setItem(
        "layout-workspaces",
        JSON.stringify(updatedWorkspaces)
      );
      if (selectedWorkspace === workspaceId) {
        setSelectedWorkspace(null);
      }
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatPanelInfo = (workspace: WorkspaceState) => {
    const { panelSizes } = workspace;
    return `Panels: L=${panelSizes.leftWidth.toFixed(
      1
    )}%, R=${panelSizes.rightWidth.toFixed(
      1
    )}%, B=${panelSizes.bottomHeight.toFixed(1)}%`;
  };

  const formatTabInfo = (workspace: WorkspaceState) => {
    const totalTabs = workspace.tabContainers.reduce(
      (sum, container) => sum + container.tabs.length,
      0
    );
    return `${totalTabs} tabs across ${workspace.tabContainers.length} panels`;
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        minHeight: "100vh",
      }}
    >
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ marginBottom: "10px", color: theme.colors.text }}>
          Workspace Manager
        </h2>
        <p style={{ color: theme.colors.textSecondary, margin: 0 }}>
          Save and restore complete workspace configurations including panel
          sizes, tabs, and theme settings.
        </p>
      </div>

      <div
        style={{
          marginBottom: "30px",
          padding: "20px",
          border: `1px solid ${theme.colors.border}`,
          borderRadius: "8px",
          backgroundColor: theme.colors.backgroundSecondary,
        }}
      >
        <h3 style={{ marginBottom: "15px", color: theme.colors.text }}>
          Save Current Workspace
        </h3>
        <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
          <input
            type="text"
            placeholder="Enter workspace name..."
            value={newWorkspaceName}
            onChange={(e) => setNewWorkspaceName(e.target.value)}
            style={{
              flex: 1,
              padding: "8px 12px",
              border: `1px solid ${theme.colors.border}`,
              borderRadius: "4px",
              fontSize: "14px",
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
            }}
          />
          <button
            onClick={saveCurrentWorkspace}
            disabled={!newWorkspaceName.trim()}
            style={{
              padding: "8px 16px",
              backgroundColor: newWorkspaceName.trim()
                ? theme.colors.primary
                : theme.colors.textMuted,
              color: theme.colors.textInverse,
              border: "none",
              borderRadius: "4px",
              cursor: newWorkspaceName.trim() ? "pointer" : "not-allowed",
              fontSize: "14px",
            }}
          >
            Save Workspace
          </button>
        </div>
        <div style={{ fontSize: "14px", color: theme.colors.textSecondary }}>
          <p style={{ margin: "5px 0" }}>
            Current workspace will be saved with:
          </p>
          <ul style={{ margin: "10px 0", paddingLeft: "20px" }}>
            <li>Panel sizes and layout</li>
            <li>All tabs and their content</li>
            <li>Active tab selections</li>
            <li>Theme settings</li>
          </ul>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: "15px", color: theme.colors.text }}>
          Saved Workspaces
        </h3>
        {savedWorkspaces.length === 0 ? (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: theme.colors.textMuted,
              border: `2px dashed ${theme.colors.border}`,
              borderRadius: "8px",
            }}
          >
            <p style={{ margin: 0, fontSize: "16px" }}>
              No saved workspaces yet.
            </p>
            <p style={{ margin: "10px 0 0 0", fontSize: "14px" }}>
              Save your first workspace above!
            </p>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            {savedWorkspaces.map((workspace) => (
              <div
                key={workspace.id}
                style={{
                  padding: "20px",
                  border:
                    selectedWorkspace === workspace.id
                      ? `2px solid ${theme.colors.primary}`
                      : `1px solid ${theme.colors.border}`,
                  borderRadius: "8px",
                  backgroundColor:
                    selectedWorkspace === workspace.id
                      ? theme.colors.surfaceActive
                      : theme.colors.surface,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h4
                      style={{
                        margin: "0 0 10px 0",
                        color: theme.colors.text,
                        fontSize: "18px",
                      }}
                    >
                      {workspace.name}
                    </h4>
                    <div
                      style={{
                        fontSize: "14px",
                        color: theme.colors.textSecondary,
                        lineHeight: "1.4",
                      }}
                    >
                      <p style={{ margin: "5px 0" }}>
                        Created: {formatDate(workspace.timestamp)}
                      </p>
                      <p style={{ margin: "5px 0" }}>
                        {formatPanelInfo(workspace)}
                      </p>
                      <p style={{ margin: "5px 0" }}>
                        {formatTabInfo(workspace)}
                      </p>
                      <p style={{ margin: "5px 0" }}>
                        Theme: {workspace.theme}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => loadWorkspace(workspace.id)}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: theme.colors.success,
                        color: theme.colors.textInverse,
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "14px",
                      }}
                    >
                      Load
                    </button>
                    <button
                      onClick={() => deleteWorkspace(workspace.id)}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: theme.colors.error,
                        color: theme.colors.textInverse,
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "14px",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkspaceManager;
