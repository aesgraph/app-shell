import React, {
  createContext,
  ReactNode,
  useCallback,
  useState,
  useEffect,
} from "react";
import type { WorkspaceState } from "../types/workspace";
import { Theme } from "../types/ThemeDefinition";
import { themes, defaultTheme } from "../themes/themes";

interface AppShellContextValue {
  // Workspace management
  savedWorkspaces: WorkspaceState[];
  currentWorkspace: WorkspaceState | null;
  saveWorkspace: (state: WorkspaceState) => void;
  loadWorkspace: (id: string) => WorkspaceState | null;
  deleteWorkspace: (id: string) => void;
  getAllWorkspaces: () => WorkspaceState[];
  getCurrentWorkspace: () => WorkspaceState | null;
  setCurrentWorkspace: (workspace: WorkspaceState | null) => void;
  updateWorkspace: (id: string, updates: Partial<WorkspaceState>) => void;
  duplicateWorkspace: (id: string, newName?: string) => WorkspaceState | null;
  // Convenience functions for layout management
  saveCurrentLayout: (name: string) => Promise<WorkspaceState | null>;
  applyWorkspaceLayout: (id: string) => Promise<boolean>;
  captureCurrentState: () => Promise<Omit<
    WorkspaceState,
    "id" | "name" | "timestamp"
  > | null>;
  // Theme management
  theme: Theme;
  themeId: string;
  setTheme: (themeId: string) => void;
  themes: Record<string, Theme>;
  // Debug management
  debug: boolean;
  setDebug: (debug: boolean) => void;
  log: (message: string, ...args: unknown[]) => void;
}

export type { AppShellContextValue };

const AppShellContext = createContext<AppShellContextValue | undefined>(
  undefined
);

export { AppShellContext };

interface WorkspaceProviderProps {
  children: ReactNode;
  storageKey?: string;
  themeId?: string;
  debug?: boolean;
  onWorkspaceChange?: (workspace: WorkspaceState | null) => void;
  onThemeChange?: (themeId: string) => void;
}

// Type guard to check if an object is a valid WorkspaceState
const isValidWorkspace = (workspace: unknown): workspace is WorkspaceState => {
  if (!workspace || typeof workspace !== "object") return false;
  const w = workspace as Record<string, unknown>;
  return Boolean(
    typeof w.id === "string" &&
      typeof w.name === "string" &&
      typeof w.timestamp === "number" &&
      w.layout &&
      typeof w.layout === "object" &&
      (w.layout as Record<string, unknown>).horizontal &&
      (w.layout as Record<string, unknown>).vertical &&
      Array.isArray((w.layout as Record<string, unknown>).horizontal) &&
      Array.isArray((w.layout as Record<string, unknown>).vertical) &&
      Array.isArray(w.tabContainers) &&
      typeof w.theme === "string"
  );
};

export const AppShellProvider: React.FC<WorkspaceProviderProps> = ({
  children,
  storageKey = "layout-workspaces",
  themeId = "dark",
  debug = false,
  onWorkspaceChange,
  onThemeChange,
}) => {
  const [savedWorkspaces, setSavedWorkspaces] = useState<WorkspaceState[]>([]);
  const [currentWorkspace, setCurrentWorkspace] =
    useState<WorkspaceState | null>(null);
  const [currentThemeId, setCurrentThemeId] = useState(themeId);
  const [debugEnabled, setDebugEnabled] = useState(debug);

  // Debug logging function
  const log = useCallback(
    (message: string, ...args: unknown[]) => {
      if (debugEnabled) {
        console.log(`[AppShell] ${message}`, ...args);
      }
    },
    [debugEnabled]
  );

  // Load workspaces from localStorage on initialization
  useEffect(() => {
    const loadWorkspaces = () => {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const workspaces = JSON.parse(saved);
          // Filter out invalid workspaces that don't match the current WorkspaceState structure
          const validWorkspaces = workspaces.filter(isValidWorkspace);

          setSavedWorkspaces(validWorkspaces);

          // If we filtered out invalid workspaces, update localStorage
          if (validWorkspaces.length !== workspaces.length) {
            localStorage.setItem(storageKey, JSON.stringify(validWorkspaces));
            console.log(
              `Filtered out ${workspaces.length - validWorkspaces.length} invalid workspaces from cache`
            );
          }
        } else {
          // If no saved workspaces exist, start with empty array
          // External consumers can provide initial workspaces via props if needed
          setSavedWorkspaces([]);
        }
      } catch (error) {
        console.error("Failed to load saved workspaces:", error);
        // Clear invalid data and start fresh
        localStorage.removeItem(storageKey);
        setSavedWorkspaces([]);
      }
    };

    loadWorkspaces();
  }, [storageKey]);

  // Persist workspaces to localStorage whenever savedWorkspaces changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(savedWorkspaces));
    } catch (error) {
      console.error("Failed to save workspaces to localStorage:", error);
    }
  }, [savedWorkspaces, storageKey]);

  // Notify of current workspace changes
  useEffect(() => {
    onWorkspaceChange?.(currentWorkspace);
  }, [currentWorkspace, onWorkspaceChange]);

  const saveWorkspace = useCallback((state: WorkspaceState) => {
    if (!isValidWorkspace(state)) {
      console.error(
        "Invalid workspace state provided to saveWorkspace:",
        state
      );
      return;
    }

    setSavedWorkspaces((prev) => {
      const existingIndex = prev.findIndex((ws) => ws.id === state.id);
      const updatedState = { ...state, timestamp: Date.now() };

      if (existingIndex !== -1) {
        // Update existing workspace
        const updated = [...prev];
        updated[existingIndex] = updatedState;
        return updated;
      } else {
        // Add new workspace
        return [...prev, updatedState];
      }
    });
  }, []);

  const loadWorkspace = useCallback(
    (id: string): WorkspaceState | null => {
      const workspace = savedWorkspaces.find((ws) => ws.id === id);
      if (workspace) {
        setCurrentWorkspace(workspace);
        return workspace;
      }
      return null;
    },
    [savedWorkspaces]
  );

  const deleteWorkspace = useCallback(
    (id: string) => {
      setSavedWorkspaces((prev) => prev.filter((ws) => ws.id !== id));

      // If the deleted workspace was the current one, clear current workspace
      if (currentWorkspace?.id === id) {
        setCurrentWorkspace(null);
      }
    },
    [currentWorkspace]
  );

  const getAllWorkspaces = useCallback((): WorkspaceState[] => {
    return [...savedWorkspaces];
  }, [savedWorkspaces]);

  const getCurrentWorkspace = useCallback((): WorkspaceState | null => {
    return currentWorkspace;
  }, [currentWorkspace]);

  const updateWorkspace = useCallback(
    (id: string, updates: Partial<WorkspaceState>) => {
      setSavedWorkspaces((prev) => {
        const index = prev.findIndex((ws) => ws.id === id);
        if (index === -1) return prev;

        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          ...updates,
          timestamp: Date.now(),
        };

        // Update current workspace if it's the one being updated
        if (currentWorkspace?.id === id) {
          setCurrentWorkspace(updated[index]);
        }

        return updated;
      });
    },
    [currentWorkspace]
  );

  const duplicateWorkspace = useCallback(
    (id: string, newName?: string): WorkspaceState | null => {
      const workspace = savedWorkspaces.find((ws) => ws.id === id);
      if (!workspace) return null;

      const duplicatedWorkspace: WorkspaceState = {
        ...workspace,
        id: `${workspace.id}-copy-${Date.now()}`,
        name: newName || `${workspace.name} (Copy)`,
        timestamp: Date.now(),
      };

      setSavedWorkspaces((prev) => [...prev, duplicatedWorkspace]);
      return duplicatedWorkspace;
    },
    [savedWorkspaces]
  );

  // Convenience function to capture current layout state
  const captureCurrentState = useCallback(async (): Promise<Omit<
    WorkspaceState,
    "id" | "name" | "timestamp"
  > | null> => {
    const getCurrentWorkspaceState = (
      globalThis as {
        getCurrentWorkspaceState?: () => Omit<
          WorkspaceState,
          "id" | "name" | "timestamp"
        >;
      }
    ).getCurrentWorkspaceState;

    if (!getCurrentWorkspaceState) {
      console.error(
        "LayoutManager getCurrentWorkspaceState function not available"
      );
      return null;
    }

    try {
      return getCurrentWorkspaceState();
    } catch (error) {
      console.error("Failed to capture current workspace state:", error);
      return null;
    }
  }, []);

  // Convenience function to save current layout with a name
  const saveCurrentLayout = useCallback(
    async (name: string): Promise<WorkspaceState | null> => {
      if (!name.trim()) {
        console.error("Workspace name is required");
        return null;
      }

      const currentState = await captureCurrentState();
      if (!currentState) {
        return null;
      }

      const workspaceState: WorkspaceState = {
        id: `workspace-${Date.now()}`,
        name: name.trim(),
        timestamp: Date.now(),
        ...currentState,
      };

      saveWorkspace(workspaceState);
      return workspaceState;
    },
    [captureCurrentState, saveWorkspace]
  );

  // Convenience function to apply a workspace layout
  const applyWorkspaceLayout = useCallback(
    async (id: string): Promise<boolean> => {
      const workspace = savedWorkspaces.find((ws) => ws.id === id);
      if (!workspace) {
        console.error(`Workspace with ID ${id} not found`);
        return false;
      }

      const restoreWorkspaceState = (
        globalThis as {
          restoreWorkspaceState?: (state: WorkspaceState) => void;
        }
      ).restoreWorkspaceState;

      if (!restoreWorkspaceState) {
        console.error(
          "LayoutManager restoreWorkspaceState function not available"
        );
        return false;
      }

      try {
        restoreWorkspaceState(workspace);
        setCurrentWorkspace(workspace);
        return true;
      } catch (error) {
        console.error("Failed to apply workspace layout:", error);
        return false;
      }
    },
    [savedWorkspaces, setCurrentWorkspace]
  );

  // Theme management functions
  const setTheme = useCallback(
    (newThemeId: string) => {
      if (themes[newThemeId]) {
        setCurrentThemeId(newThemeId);
        onThemeChange?.(newThemeId);
      }
    },
    [onThemeChange]
  );

  const theme = themes[currentThemeId] || defaultTheme;

  const value: AppShellContextValue = {
    // Workspace management
    savedWorkspaces,
    currentWorkspace,
    saveWorkspace,
    loadWorkspace,
    deleteWorkspace,
    getAllWorkspaces,
    getCurrentWorkspace,
    setCurrentWorkspace,
    updateWorkspace,
    duplicateWorkspace,
    saveCurrentLayout,
    applyWorkspaceLayout,
    captureCurrentState,
    // Theme management
    theme,
    themeId: currentThemeId,
    setTheme,
    themes,
    // Debug management
    debug: debugEnabled,
    setDebug: setDebugEnabled,
    log,
  };

  return (
    <AppShellContext.Provider value={value}>
      {children}
    </AppShellContext.Provider>
  );
};
