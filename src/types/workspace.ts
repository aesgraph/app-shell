import { ThemeId } from "./Theme";

export interface WorkspaceState {
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

export interface WorkspaceConfig {
  // Add workspace configuration properties as needed
  [key: string]: unknown;
}

export interface WorkspaceManagerContext {
  saveWorkspace: (state: WorkspaceState) => void;
  loadWorkspace: (id: string) => WorkspaceState | null;
  deleteWorkspace: (id: string) => void;
  getAllWorkspaces: () => WorkspaceState[];
  getCurrentWorkspace: () => WorkspaceState | null;
}
