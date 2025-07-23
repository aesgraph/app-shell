import React, { useState } from "react";
import { useWorkspace, useTheme } from "../../contexts/useAppShell";

/**
 * Simple example showing programmatic access to workspace data
 */
const ProgrammaticWorkspaceAccess: React.FC = () => {
  const { theme } = useTheme();
  const {
    savedWorkspaces,
    currentWorkspace,
    saveCurrentLayout,
    applyWorkspaceLayout,
    duplicateWorkspace,
    deleteWorkspace,
  } = useWorkspace();

  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [status, setStatus] = useState<string>("");

  const handleSaveCurrentLayout = async () => {
    if (!newWorkspaceName.trim()) {
      setStatus("Please enter a workspace name");
      return;
    }

    const savedWorkspace = await saveCurrentLayout(newWorkspaceName.trim());
    if (savedWorkspace) {
      setStatus(`✅ Saved workspace: ${savedWorkspace.name}`);
      setNewWorkspaceName("");
    } else {
      setStatus("❌ Failed to save workspace");
    }
  };

  const handleApplyLayout = async (
    workspaceId: string,
    workspaceName: string
  ) => {
    const success = await applyWorkspaceLayout(workspaceId);
    if (success) {
      setStatus(`✅ Applied layout: ${workspaceName}`);
    } else {
      setStatus(`❌ Failed to apply layout: ${workspaceName}`);
    }
  };

  const handleDuplicate = (workspaceId: string) => {
    const duplicated = duplicateWorkspace(workspaceId);
    if (duplicated) {
      setStatus(`✅ Duplicated workspace: ${duplicated.name}`);
    } else {
      setStatus("❌ Failed to duplicate workspace");
    }
  };

  const handleDelete = (workspaceId: string, workspaceName: string) => {
    if (confirm(`Are you sure you want to delete "${workspaceName}"?`)) {
      deleteWorkspace(workspaceId);
      setStatus(`✅ Deleted workspace: ${workspaceName}`);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
      }}
    >
      <h2>Programmatic Workspace Access</h2>
      <p style={{ color: theme.colors.textSecondary }}>
        Demonstrates programmatic access to saved workspaces with convenience
        functions.
      </p>

      {status && (
        <div
          style={{
            padding: "10px",
            marginBottom: "20px",
            backgroundColor: status.includes("✅")
              ? `${theme.colors.success}20`
              : `${theme.colors.error}20`,
            border: `1px solid ${status.includes("✅") ? theme.colors.success : theme.colors.error}`,
            borderRadius: "4px",
            color: status.includes("✅")
              ? theme.colors.success
              : theme.colors.error,
          }}
        >
          {status}
        </div>
      )}

      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: theme.colors.surface,
          borderRadius: "4px",
        }}
      >
        <h3>Save Current Layout</h3>
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
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
              backgroundColor: theme.colors.background,
              color: theme.colors.text,
            }}
          />
          <button
            onClick={handleSaveCurrentLayout}
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
            }}
          >
            Save Current Layout
          </button>
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>Current Workspace</h3>
        {currentWorkspace ? (
          <div
            style={{
              padding: "10px",
              backgroundColor: theme.colors.surface,
              borderRadius: "4px",
            }}
          >
            <strong>{currentWorkspace.name}</strong>
            <br />
            <small>ID: {currentWorkspace.id}</small>
          </div>
        ) : (
          <p style={{ color: theme.colors.textMuted }}>No workspace loaded</p>
        )}
      </div>

      <div>
        <h3>Saved Workspaces ({savedWorkspaces.length})</h3>
        {savedWorkspaces.length === 0 ? (
          <p style={{ color: theme.colors.textMuted }}>
            No workspaces saved. Use the form above to save the current layout!
          </p>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {savedWorkspaces.map((workspace) => (
              <div
                key={workspace.id}
                style={{
                  padding: "15px",
                  backgroundColor: theme.colors.surface,
                  borderRadius: "4px",
                  border:
                    currentWorkspace?.id === workspace.id
                      ? `2px solid ${theme.colors.primary}`
                      : `1px solid ${theme.colors.border}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <strong>{workspace.name}</strong>
                    {currentWorkspace?.id === workspace.id && (
                      <span
                        style={{
                          color: theme.colors.primary,
                          marginLeft: "8px",
                        }}
                      >
                        (Current)
                      </span>
                    )}
                    <br />
                    <small style={{ color: theme.colors.textSecondary }}>
                      Created: {new Date(workspace.timestamp).toLocaleString()}
                      <br />
                      Layout: {workspace.layout.horizontal.join("/")} (H) |{" "}
                      {workspace.layout.vertical.join("/")} (V)
                      <br />
                      Tabs:{" "}
                      {workspace.tabContainers.reduce(
                        (sum, container) => sum + container.tabs.length,
                        0
                      )}
                    </small>
                  </div>
                  <div style={{ display: "flex", gap: "5px" }}>
                    <button
                      onClick={() =>
                        handleApplyLayout(workspace.id, workspace.name)
                      }
                      style={{
                        padding: "6px 12px",
                        backgroundColor: theme.colors.success,
                        color: theme.colors.textInverse,
                        border: "none",
                        borderRadius: "3px",
                        cursor: "pointer",
                        fontSize: "12px",
                      }}
                    >
                      Apply
                    </button>
                    <button
                      onClick={() => handleDuplicate(workspace.id)}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: theme.colors.info,
                        color: theme.colors.textInverse,
                        border: "none",
                        borderRadius: "3px",
                        cursor: "pointer",
                        fontSize: "12px",
                      }}
                    >
                      Duplicate
                    </button>
                    <button
                      onClick={() => handleDelete(workspace.id, workspace.name)}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: theme.colors.error,
                        color: theme.colors.textInverse,
                        border: "none",
                        borderRadius: "3px",
                        cursor: "pointer",
                        fontSize: "12px",
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

      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          backgroundColor: theme.colors.backgroundSecondary,
          borderRadius: "4px",
        }}
      >
        <h4>🚀 Unified App Shell API:</h4>
        <pre
          style={{
            backgroundColor: theme.colors.surface,
            padding: "15px",
            borderRadius: "4px",
            overflow: "auto",
            fontSize: "12px",
            color: theme.colors.text,
            whiteSpace: "pre-wrap",
          }}
        >
          {`// Single unified context for everything!
import { AppShellProvider, useAppShell } from '@your-org/app-shell';

// Wrap your app with one provider:
<AppShellProvider 
  themeId="dark" 
  storageKey="my-workspaces"
  onThemeChange={(theme) => console.log(theme)}
  onWorkspaceChange={(ws) => console.log(ws)}
>
  <YourApp />
</AppShellProvider>

// Use the unified hook for everything:
const MyComponent = () => {
  const { 
    // Theme management
    theme, themeId, setTheme, themes,
    
    // Workspace management  
    savedWorkspaces, currentWorkspace,
    saveCurrentLayout, applyWorkspaceLayout,
    duplicateWorkspace, deleteWorkspace
  } = useAppShell();

  // Or use specific hooks for convenience:
  const { theme, setTheme } = useTheme();
  const { savedWorkspaces, saveCurrentLayout } = useWorkspace();

  return (
    <div style={{ backgroundColor: theme.colors.background }}>
      <button onClick={() => setTheme('light')}>
        Switch Theme
      </button>
      <button onClick={() => saveCurrentLayout('My Layout')}>
        Save Layout
      </button>
    </div>
  );
};`}
        </pre>
      </div>
    </div>
  );
};

export default ProgrammaticWorkspaceAccess;
