import sharedStyles from "../../App.module.css";
import styles from "./WorkspaceManager.module.css";
import { useWorkspace } from "../../contexts/useWorkspace";
import type { WorkspaceConfig } from "../../types/WorkspaceConfig";
import type { ThemeId } from "../../types/Theme";
import React, { useState, useEffect } from "react";

interface WorkspaceState {
  id: string;
  name: string;
  timestamp: number;
  config: WorkspaceConfig;
  panelSizes: {
    leftWidth: number;
    rightWidth: number;
    bottomHeight: number;
  };
  tabContainers: Array<{
    id: string;
    tabs: Array<{
      id: string;
      title: string;
      content: string;
      closable?: boolean;
    }>;
    activeTabId?: string;
  }>;
  theme: ThemeId;
}

const WorkspaceManager = () => {
  const {
    workspaceConfig,
    leftWidth,
    rightWidth,
    bottomHeight,
    leftCollapsed,
    rightCollapsed,
    bottomCollapsed,
    tabContainers,
    currentTheme,
    loadWorkspace: loadWorkspaceFromContext,
  } = useWorkspace();
  const [savedWorkspaces, setSavedWorkspaces] = useState<WorkspaceState[]>([]);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(
    null
  );
  const [hasLoadedInitial, setHasLoadedInitial] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("app-shell-workspaces");
    if (saved) {
      try {
        const workspaces = JSON.parse(saved);
        setSavedWorkspaces(workspaces);
      } catch (error) {
        console.error("Failed to load saved workspaces:", error);
      }
    }
    setHasLoadedInitial(true);
  }, []);

  useEffect(() => {
    if (hasLoadedInitial) {
      localStorage.setItem(
        "app-shell-workspaces",
        JSON.stringify(savedWorkspaces)
      );
    }
  }, [savedWorkspaces, hasLoadedInitial]);

  const saveCurrentWorkspace = () => {
    if (!newWorkspaceName.trim()) {
      alert("Please enter a workspace name");
      return;
    }

    const workspaceState: WorkspaceState = {
      id: `workspace-${Date.now()}`,
      name: newWorkspaceName.trim(),
      timestamp: Date.now(),
      config: workspaceConfig,
      panelSizes: { leftWidth, rightWidth, bottomHeight },
      tabContainers: tabContainers.map((container) => ({
        ...container,
        tabs: container.tabs.map((tab) => ({
          ...tab,
          content: typeof tab.content === "string" ? tab.content : tab.title,
          closable: tab.closable ?? true,
        })),
      })),
      theme: currentTheme,
    };

    setSavedWorkspaces((prev) => [...prev, workspaceState]);
    setNewWorkspaceName("");
  };

  const loadWorkspace = (workspaceId: string) => {
    const workspace = savedWorkspaces.find((w) => w.id === workspaceId);
    if (workspace) {
      loadWorkspaceFromContext(workspace);
      setSelectedWorkspace(workspaceId);
    }
  };

  const deleteWorkspace = (workspaceId: string) => {
    if (confirm("Are you sure you want to delete this workspace?")) {
      setSavedWorkspaces((prev) => prev.filter((w) => w.id !== workspaceId));
      if (selectedWorkspace === workspaceId) {
        setSelectedWorkspace(null);
      }
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className={sharedStyles.viewContainer}>
      <div className={sharedStyles.viewHeader}>
        <h2>Workspace Manager</h2>
        <p>Save and load different workspace configurations</p>
      </div>

      <div className={sharedStyles.configSection}>
        <h3>Save Current Workspace</h3>
        <div className={styles.saveWorkspaceForm}>
          <input
            type="text"
            placeholder="Enter workspace name..."
            value={newWorkspaceName}
            onChange={(e) => setNewWorkspaceName(e.target.value)}
            className={styles.workspaceNameInput}
          />
          <button
            onClick={saveCurrentWorkspace}
            className={styles.saveWorkspaceButton}
            disabled={!newWorkspaceName.trim()}
          >
            Save Workspace
          </button>
        </div>
        <div className={styles.currentWorkspaceInfo}>
          <h4>Current Workspace State:</h4>
          <ul>
            <li>Theme: {currentTheme}</li>
            <li>Left Panel: {leftCollapsed ? "hidden" : `${leftWidth}px`}</li>
            <li>
              Right Panel: {rightCollapsed ? "hidden" : `${rightWidth}px`}
            </li>
            <li>
              Bottom Panel: {bottomCollapsed ? "hidden" : `${bottomHeight}px`}
            </li>
            <li>
              Total Tabs:{" "}
              {tabContainers.reduce(
                (sum, container) => sum + container.tabs.length,
                0
              )}
            </li>
          </ul>
        </div>
      </div>

      <div className={sharedStyles.configSection}>
        <h3>Saved Workspaces</h3>
        {savedWorkspaces.length === 0 ? (
          <div className={sharedStyles.placeholderText}>
            <span>
              No saved workspaces yet. Save your first workspace above!
            </span>
          </div>
        ) : (
          <div className={styles.workspaceList}>
            {savedWorkspaces.map((workspace) => (
              <div
                key={workspace.id}
                className={`${styles.workspaceItem} ${
                  selectedWorkspace === workspace.id
                    ? styles.workspaceItemSelected
                    : ""
                }`}
              >
                <div className={styles.workspaceInfo}>
                  <h4>{workspace.name}</h4>
                  <p>Created: {formatDate(workspace.timestamp)}</p>
                  <p>Theme: {workspace.theme}</p>
                  <p>
                    Tabs:{" "}
                    {workspace.tabContainers.reduce(
                      (sum, container) => sum + container.tabs.length,
                      0
                    )}
                  </p>
                </div>
                <div className={styles.workspaceActions}>
                  <button
                    onClick={() => loadWorkspace(workspace.id)}
                    className={styles.loadWorkspaceButton}
                  >
                    Load
                  </button>
                  <button
                    onClick={() => deleteWorkspace(workspace.id)}
                    className={styles.deleteWorkspaceButton}
                  >
                    Delete
                  </button>
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
