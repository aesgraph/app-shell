import { useContext } from "react";
import { AppShellContext, AppShellContextValue } from "./AppShellContext";

// New unified hook for app shell functionality
export const useAppShell = (): AppShellContextValue => {
  const context = useContext(AppShellContext);
  if (context === undefined) {
    throw new Error("useAppShell must be used within an AppShellProvider");
  }
  return context;
};

// Legacy hook for workspace functionality (for backward compatibility)
export const useWorkspace = () => {
  const context = useAppShell();
  return {
    savedWorkspaces: context.savedWorkspaces,
    currentWorkspace: context.currentWorkspace,
    saveWorkspace: context.saveWorkspace,
    loadWorkspace: context.loadWorkspace,
    deleteWorkspace: context.deleteWorkspace,
    getAllWorkspaces: context.getAllWorkspaces,
    getCurrentWorkspace: context.getCurrentWorkspace,
    setCurrentWorkspace: context.setCurrentWorkspace,
    updateWorkspace: context.updateWorkspace,
    duplicateWorkspace: context.duplicateWorkspace,
    saveCurrentLayout: context.saveCurrentLayout,
    applyWorkspaceLayout: context.applyWorkspaceLayout,
    captureCurrentState: context.captureCurrentState,
  };
};

// Theme-specific hook for easier theme access
export const useTheme = () => {
  const context = useAppShell();
  return {
    theme: context.theme,
    themeId: context.themeId,
    setTheme: context.setTheme,
    themes: context.themes,
  };
};
