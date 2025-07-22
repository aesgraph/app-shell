import React, { createContext, useState, useCallback, useEffect } from "react";
import type { ReactNode } from "react";
import type { TabData } from "../components/Tab";
import type { WorkspaceConfig } from "../types/WorkspaceConfig";
import { DEFAULT_WORKSPACE_CONFIG } from "../types/WorkspaceConfig";
import type { ViewDefinition } from "../types/ViewRegistry";
import type { ThemeId } from "../types/Theme";
import { globalViewRegistry } from "../types/ViewRegistry";
import WorkspaceManager from "../components/views/WorkspaceManager";
import WorkspaceConfigEditor from "../components/views/WorkspaceConfigEditor";
import { themes } from "../themes/themes";
import { applyThemeVars } from "../utils/themeUtils";

export interface TabContainerData {
  id: string;
  tabs: TabData[];
  activeTabId?: string;
}

export interface WorkspaceState {
  // Panel sizes and collapse states
  leftWidth: number;
  rightWidth: number;
  bottomHeight: number;
  leftCollapsed: boolean;
  rightCollapsed: boolean;
  bottomCollapsed: boolean;
  mainCollapsed: boolean;

  // Theme and config
  currentTheme: ThemeId;
  workspaceConfig: WorkspaceConfig;

  // Tab containers
  tabContainers: TabContainerData[];
}

// Interface for saved layout state
interface SavedLayoutState {
  leftWidth: number;
  rightWidth: number;
  bottomHeight: number;
  leftCollapsed: boolean;
  rightCollapsed: boolean;
  bottomCollapsed: boolean;
  mainCollapsed: boolean;
}

// Type for the saved workspace state (matching WorkspaceManager expectations)
interface SavedWorkspaceState {
  id: string;
  name: string;
  timestamp: number;
  config?: WorkspaceConfig;
  workspaceConfig?: WorkspaceConfig;
  theme?: ThemeId;
  currentTheme?: ThemeId;
  panelSizes?: {
    leftWidth: number;
    rightWidth: number;
    bottomHeight: number;
  };
  leftWidth?: number;
  rightWidth?: number;
  bottomHeight?: number;
  leftCollapsed?: boolean;
  rightCollapsed?: boolean;
  bottomCollapsed?: boolean;
  mainCollapsed?: boolean;
  tabContainers: Array<{
    id: string;
    tabs: Array<{
      id: string;
      title: string;
      content?: string;
      closable?: boolean;
    }>;
    activeTabId?: string;
  }>;
}

export interface WorkspaceContextType extends WorkspaceState {
  // Panel size setters
  setLeftWidth: (width: number) => void;
  setRightWidth: (width: number) => void;
  setBottomHeight: (height: number) => void;

  // Panel collapse setters
  setLeftCollapsed: (collapsed: boolean) => void;
  setRightCollapsed: (collapsed: boolean) => void;
  setBottomCollapsed: (collapsed: boolean) => void;
  setMainCollapsed: (collapsed: boolean) => void;

  // Theme setter
  setCurrentTheme: (theme: ThemeId) => void;

  // Config setter
  setWorkspaceConfig: (config: WorkspaceConfig) => void;

  // Tab management
  setTabContainers: React.Dispatch<React.SetStateAction<TabContainerData[]>>;

  // Tab event handlers
  handleTabSelect: (containerId: string, tabId: string) => void;
  handleTabClose: (containerId: string, tabId: string) => void;
  handleTabMove: (
    fromContainerId: string,
    toContainerId: string,
    tabId: string
  ) => void;
  handleTabAdd: (containerId: string) => void;

  // Workspace management
  loadWorkspace: (workspaceData: {
    theme: ThemeId;
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
        content?: string;
        closable?: boolean;
      }>;
      activeTabId?: string;
    }>;
    config?: WorkspaceConfig;
  }) => void;

  // View management
  addView: (containerId: string, view: ViewDefinition) => void;
  getAvailableViews: () => ViewDefinition[];

  // Pane maximization
  maximizePane: (paneId: "left" | "right" | "bottom" | "center") => void;

  // Minimize specific pane
  minimizePane: (paneId: "left" | "right" | "bottom" | "center") => void;

  // Restore all panes to normal state
  restorePanes: () => void;

  // Check if any pane is currently maximized
  isAnyPaneMaximized: () => boolean;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined
);

export { WorkspaceContext };

interface WorkspaceProviderProps {
  children: ReactNode;
  initialConfig?: Partial<WorkspaceConfig>;
}

export const WorkspaceProvider = ({
  children,
  initialConfig = {},
}: WorkspaceProviderProps) => {
  // Merge provided config with defaults
  const workspaceConfig: WorkspaceConfig = React.useMemo(
    () => ({
      ...DEFAULT_WORKSPACE_CONFIG,
      ...initialConfig,
      leftPane: {
        ...DEFAULT_WORKSPACE_CONFIG.leftPane,
        ...initialConfig.leftPane,
      },
      rightPane: {
        ...DEFAULT_WORKSPACE_CONFIG.rightPane,
        ...initialConfig.rightPane,
      },
      bottomPane: {
        ...DEFAULT_WORKSPACE_CONFIG.bottomPane,
        ...initialConfig.bottomPane,
      },
    }),
    [initialConfig]
  );

  // State management
  const [leftWidth, setLeftWidth] = useState(
    workspaceConfig.leftPane.defaultSize
  );
  const [rightWidth, setRightWidth] = useState(
    workspaceConfig.rightPane.defaultSize
  );
  const [bottomHeight, setBottomHeight] = useState(
    workspaceConfig.bottomPane.defaultSize
  );
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [bottomCollapsed, setBottomCollapsed] = useState(false);
  const [mainCollapsed, setMainCollapsed] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(
    workspaceConfig.theme
  );
  const [currentWorkspaceConfig, setWorkspaceConfig] =
    useState(workspaceConfig);
  const [tabContainers, setTabContainers] = useState<TabContainerData[]>([]);

  // Saved layout state for maximize/restore functionality
  const [savedLayoutState, setSavedLayoutState] =
    useState<SavedLayoutState | null>(null);

  // Tab event handlers
  const handleTabSelect = useCallback((containerId: string, tabId: string) => {
    setTabContainers((containers) =>
      containers.map((container) =>
        container.id === containerId
          ? { ...container, activeTabId: tabId }
          : container
      )
    );
  }, []);

  const handleTabClose = useCallback((containerId: string, tabId: string) => {
    setTabContainers((containers) =>
      containers.map((container) => {
        if (container.id === containerId) {
          const filteredTabs = container.tabs.filter((tab) => tab.id !== tabId);
          const newActiveTabId =
            container.activeTabId === tabId
              ? filteredTabs[0]?.id || undefined
              : container.activeTabId;

          return {
            ...container,
            tabs: filteredTabs,
            activeTabId: newActiveTabId,
          };
        }
        return container;
      })
    );
  }, []);

  const handleTabMove = useCallback(
    (fromContainerId: string, toContainerId: string, tabId: string) => {
      setTabContainers((containers) => {
        const sourceContainer = containers.find(
          (c) => c.id === fromContainerId
        );
        const tabToMove = sourceContainer?.tabs.find((tab) => tab.id === tabId);

        if (!tabToMove) return containers;

        return containers.map((container) => {
          if (container.id === fromContainerId) {
            const filteredTabs = container.tabs.filter(
              (tab) => tab.id !== tabId
            );
            const newActiveTabId =
              container.activeTabId === tabId
                ? filteredTabs[0]?.id || undefined
                : container.activeTabId;

            return {
              ...container,
              tabs: filteredTabs,
              activeTabId: newActiveTabId,
            };
          }

          if (container.id === toContainerId) {
            return {
              ...container,
              tabs: [...container.tabs, tabToMove],
              activeTabId: tabId,
            };
          }

          return container;
        });
      });
    },
    []
  );

  const handleTabAdd = useCallback((containerId: string) => {
    const newTab: TabData = {
      id: `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: `New Tab ${Date.now()}`,
      content: <div>New tab content for {containerId}</div>,
      closable: true,
    };

    setTabContainers((containers) =>
      containers.map((container) =>
        container.id === containerId
          ? {
              ...container,
              tabs: [...container.tabs, newTab],
              activeTabId: newTab.id,
            }
          : container
      )
    );
  }, []);

  // Workspace management
  const loadWorkspace = useCallback(
    (workspaceData: {
      theme: ThemeId;
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
          content?: string;
          closable?: boolean;
        }>;
        activeTabId?: string;
      }>;
      config?: WorkspaceConfig;
    }) => {
      setCurrentTheme(workspaceData.theme);
      setLeftWidth(workspaceData.panelSizes.leftWidth);
      setRightWidth(workspaceData.panelSizes.rightWidth);
      setBottomHeight(workspaceData.panelSizes.bottomHeight);

      if (workspaceData.config) {
        setWorkspaceConfig(workspaceData.config);
      }

      // Convert saved tab containers back to React components
      setTabContainers(
        workspaceData.tabContainers.map((container) => ({
          ...container,
          tabs: container.tabs.map((tab) => {
            // Create proper React components based on tab ID
            let content: React.ReactNode;

            // First, try to find the view in the global registry
            // Handle timestamped tab IDs by extracting the base view ID
            const baseViewId = tab.id.replace(/-\d+$/, ""); // Remove timestamp suffix
            let viewDefinition = globalViewRegistry.getView(tab.id); // Try exact match first
            if (!viewDefinition) {
              viewDefinition = globalViewRegistry.getView(baseViewId); // Try base ID
            }

            if (viewDefinition) {
              content = React.createElement(
                viewDefinition.component,
                viewDefinition.props || {}
              );
            } else {
              // For other tabs, use the saved content or fallback to title
              content = tab.content ? (
                <div>{tab.content}</div>
              ) : (
                <div>{tab.title}</div>
              );
            }

            return {
              ...tab,
              content,
              closable: tab.closable ?? true,
            };
          }),
        }))
      );
    },
    []
  );

  // View management
  const addView = useCallback((containerId: string, view: ViewDefinition) => {
    const newTab: TabData = {
      id: `${view.id}-${Date.now()}`,
      title: view.title,
      content: React.createElement(view.component, view.props || {}),
      closable: true,
    };

    setTabContainers((containers) =>
      containers.map((container) =>
        container.id === containerId
          ? {
              ...container,
              tabs: [...container.tabs, newTab],
              activeTabId: newTab.id,
            }
          : container
      )
    );
  }, []);

  const getAvailableViews = useCallback(() => {
    return globalViewRegistry.getAllViews();
  }, []);

  // Pane maximization
  const maximizePane = useCallback(
    (paneId: "left" | "right" | "bottom" | "center") => {
      // If any pane is already maximized, restore first
      if (savedLayoutState !== null) {
        // Restore to the saved layout state
        setLeftWidth(savedLayoutState.leftWidth);
        setRightWidth(savedLayoutState.rightWidth);
        setBottomHeight(savedLayoutState.bottomHeight);
        setLeftCollapsed(savedLayoutState.leftCollapsed);
        setRightCollapsed(savedLayoutState.rightCollapsed);
        setBottomCollapsed(savedLayoutState.bottomCollapsed);
        setMainCollapsed(savedLayoutState.mainCollapsed);
        // Clear the saved state
        setSavedLayoutState(null);
        return;
      }

      // Save current layout state before maximizing
      const currentLayout: SavedLayoutState = {
        leftWidth,
        rightWidth,
        bottomHeight,
        leftCollapsed,
        rightCollapsed,
        bottomCollapsed,
        mainCollapsed,
      };
      setSavedLayoutState(currentLayout);

      if (paneId === "left") {
        // Maximize left pane: expand it and collapse others
        setLeftWidth(currentWorkspaceConfig.leftPane.defaultSize);
        setLeftCollapsed(false);
        setRightCollapsed(true);
        setBottomCollapsed(true);
        setMainCollapsed(true);
      } else if (paneId === "right") {
        // Maximize right pane: expand it and collapse others
        setRightWidth(currentWorkspaceConfig.rightPane.defaultSize);
        setRightCollapsed(false);
        setLeftCollapsed(true);
        setBottomCollapsed(true);
        setMainCollapsed(true);
      } else if (paneId === "bottom") {
        // Maximize bottom pane: expand it and collapse others
        setBottomHeight(currentWorkspaceConfig.bottomPane.defaultSize);
        setBottomCollapsed(false);
        setLeftCollapsed(true);
        setRightCollapsed(true);
        setMainCollapsed(true);
      } else if (paneId === "center") {
        // Maximize center pane: collapse all side panes
        setLeftCollapsed(true);
        setRightCollapsed(true);
        setBottomCollapsed(true);
        setMainCollapsed(false);
      }
    },
    [
      currentWorkspaceConfig,
      leftWidth,
      rightWidth,
      bottomHeight,
      leftCollapsed,
      rightCollapsed,
      bottomCollapsed,
      mainCollapsed,
      savedLayoutState,
    ]
  );

  // Minimize specific pane
  const minimizePane = useCallback(
    (paneId: "left" | "right" | "bottom" | "center") => {
      if (paneId === "left") {
        setLeftCollapsed(true);
      } else if (paneId === "right") {
        setRightCollapsed(true);
      } else if (paneId === "bottom") {
        setBottomCollapsed(true);
      } else if (paneId === "center") {
        setMainCollapsed(true);
      }
    },
    []
  );

  // Restore all panes to normal state
  const restorePanes = useCallback(() => {
    if (savedLayoutState) {
      // Restore to the saved layout state
      setLeftWidth(savedLayoutState.leftWidth);
      setRightWidth(savedLayoutState.rightWidth);
      setBottomHeight(savedLayoutState.bottomHeight);
      setLeftCollapsed(savedLayoutState.leftCollapsed);
      setRightCollapsed(savedLayoutState.rightCollapsed);
      setBottomCollapsed(savedLayoutState.bottomCollapsed);
      setMainCollapsed(savedLayoutState.mainCollapsed);
      // Clear the saved state after restoring
      setSavedLayoutState(null);
    } else {
      // Fallback to default layout if no saved state
      setLeftCollapsed(false);
      setRightCollapsed(false);
      setBottomCollapsed(false);
      setMainCollapsed(false);
      // Reset sizes to defaults
      setLeftWidth(currentWorkspaceConfig.leftPane.defaultSize);
      setRightWidth(currentWorkspaceConfig.rightPane.defaultSize);
      setBottomHeight(currentWorkspaceConfig.bottomPane.defaultSize);
    }
  }, [savedLayoutState, currentWorkspaceConfig]);

  // Check if any pane is currently maximized (indicated by having a saved layout state)
  const isAnyPaneMaximized = useCallback(() => {
    return savedLayoutState !== null;
  }, [savedLayoutState]);

  // Apply CSS variables when theme changes
  useEffect(() => {
    const theme = themes[currentTheme];
    if (theme && document.documentElement) {
      applyThemeVars(document.documentElement, theme);
    }
  }, [currentTheme]);

  // Load the last saved workspace on startup
  useEffect(() => {
    const saved = localStorage.getItem("app-shell-workspaces");
    if (saved) {
      try {
        const workspaces = JSON.parse(saved);
        if (workspaces.length > 0) {
          // Load the most recently saved workspace
          const lastWorkspace = workspaces[workspaces.length - 1];

          // Update theme
          setCurrentTheme(lastWorkspace.theme);

          // Update panel sizes
          setLeftWidth(lastWorkspace.panelSizes.leftWidth);
          setRightWidth(lastWorkspace.panelSizes.rightWidth);
          setBottomHeight(lastWorkspace.panelSizes.bottomHeight);

          // Update config if available
          if (lastWorkspace.config) {
            setWorkspaceConfig(lastWorkspace.config);
          }

          // Convert saved tab containers back to React components
          setTabContainers(
            lastWorkspace.tabContainers.map(
              (container: {
                id: string;
                tabs: Array<{
                  id: string;
                  title: string;
                  content?: string;
                  closable?: boolean;
                }>;
                activeTabId?: string;
              }) => ({
                ...container,
                tabs: container.tabs.map(
                  (tab: {
                    id: string;
                    title: string;
                    content?: string;
                    closable?: boolean;
                  }) => {
                    // Create proper React components based on tab ID
                    let content: React.ReactNode;

                    // First, try to find the view in the global registry
                    // Handle timestamped tab IDs by extracting the base view ID
                    const baseViewId = tab.id.replace(/-\d+$/, ""); // Remove timestamp suffix
                    let viewDefinition = globalViewRegistry.getView(tab.id); // Try exact match first
                    if (!viewDefinition) {
                      viewDefinition = globalViewRegistry.getView(baseViewId); // Try base ID
                    }

                    if (viewDefinition) {
                      content = React.createElement(
                        viewDefinition.component,
                        viewDefinition.props || {}
                      );
                    } else {
                      // Fallback to hardcoded components for backwards compatibility
                      if (tab.id === "workspace-manager") {
                        content = <WorkspaceManager />;
                      } else if (tab.id === "workspace-config") {
                        content = <WorkspaceConfigEditor />;
                      } else {
                        // For other tabs, use the saved content or fallback to title
                        content = tab.content ? (
                          <div>{tab.content}</div>
                        ) : (
                          <div>{tab.title}</div>
                        );
                      }
                    }

                    return {
                      ...tab,
                      content,
                      closable: tab.closable ?? true,
                    };
                  }
                ),
              })
            )
          );
        } else {
          // No saved workspaces, create default layout
          setTabContainers([
            {
              id: "left-pane",
              tabs: [
                {
                  id: "explorer",
                  title: "Explorer",
                  content: <div>File Explorer Content</div>,
                  closable: true,
                },
              ],
              activeTabId: "explorer",
            },
            {
              id: "center-pane",
              tabs: [
                {
                  id: "workspace-manager",
                  title: "Workspace Manager",
                  content: <WorkspaceManager />,
                  closable: false,
                },
              ],
              activeTabId: "workspace-manager",
            },
            {
              id: "right-pane",
              tabs: [
                {
                  id: "workspace-config",
                  title: "Workspace Config",
                  content: <WorkspaceConfigEditor />,
                  closable: false,
                },
              ],
              activeTabId: "workspace-config",
            },
            {
              id: "bottom-pane",
              tabs: [
                {
                  id: "terminal",
                  title: "Terminal",
                  content: <div>Terminal Output</div>,
                  closable: true,
                },
              ],
              activeTabId: "terminal",
            },
          ]);
        }
      } catch (error) {
        console.error("Failed to load saved workspace:", error);
        // Fallback to default layout on error
        setTabContainers([
          {
            id: "left-pane",
            tabs: [
              {
                id: "explorer",
                title: "Explorer",
                content: <div>File Explorer Content</div>,
                closable: true,
              },
            ],
            activeTabId: "explorer",
          },
          {
            id: "center-pane",
            tabs: [
              {
                id: "workspace-manager",
                title: "Workspace Manager",
                content: <WorkspaceManager />,
                closable: false,
              },
            ],
            activeTabId: "workspace-manager",
          },
          {
            id: "right-pane",
            tabs: [
              {
                id: "workspace-config",
                title: "Workspace Config",
                content: <WorkspaceConfigEditor />,
                closable: false,
              },
            ],
            activeTabId: "workspace-config",
          },
          {
            id: "bottom-pane",
            tabs: [
              {
                id: "terminal",
                title: "Terminal",
                content: <div>Terminal Output</div>,
                closable: true,
              },
            ],
            activeTabId: "terminal",
          },
        ]);
      }
    } else {
      // No saved workspaces, create default layout
      setTabContainers([
        {
          id: "left-pane",
          tabs: [
            {
              id: "explorer",
              title: "Explorer",
              content: <div>File Explorer Content</div>,
              closable: true,
            },
          ],
          activeTabId: "explorer",
        },
        {
          id: "center-pane",
          tabs: [
            {
              id: "workspace-manager",
              title: "Workspace Manager",
              content: <WorkspaceManager />,
              closable: false,
            },
          ],
          activeTabId: "workspace-manager",
        },
        {
          id: "right-pane",
          tabs: [
            {
              id: "workspace-config",
              title: "Workspace Config",
              content: <WorkspaceConfigEditor />,
              closable: false,
            },
          ],
          activeTabId: "workspace-config",
        },
        {
          id: "bottom-pane",
          tabs: [
            {
              id: "terminal",
              title: "Terminal",
              content: <div>Terminal Output</div>,
              closable: true,
            },
          ],
          activeTabId: "terminal",
        },
      ]);
    }
  }, []);

  // Create enhanced workspace state getter for global access
  const getCurrentWorkspaceState = useCallback(() => {
    return {
      leftWidth,
      rightWidth,
      bottomHeight,
      leftCollapsed,
      rightCollapsed,
      bottomCollapsed,
      mainCollapsed,
      currentTheme,
      workspaceConfig: currentWorkspaceConfig,
      tabContainers: tabContainers.map((container) => ({
        ...container,
        tabs: container.tabs.map((tab) => ({
          id: tab.id,
          title: tab.title,
          closable: tab.closable ?? true,
          // Use viewId if available, otherwise fall back to string content
          content:
            tab.id ||
            (typeof tab.content === "string" ? tab.content : tab.title),
          viewProps: tab.content || {},
        })),
      })),
      // Also include panelSizes for compatibility with WorkspaceManager
      panelSizes: {
        leftWidth,
        rightWidth,
        bottomHeight,
      },
    };
  }, [
    leftWidth,
    rightWidth,
    bottomHeight,
    leftCollapsed,
    rightCollapsed,
    bottomCollapsed,
    mainCollapsed,
    currentTheme,
    currentWorkspaceConfig,
    tabContainers,
  ]);

  // Expose functions globally for WorkspaceManager (following app-shell-3 pattern)
  useEffect(() => {
    (
      globalThis as {
        getCurrentWorkspaceState?: () => Omit<
          WorkspaceState,
          "id" | "name" | "timestamp"
        >;
        restoreWorkspaceState?: (state: SavedWorkspaceState) => void;
      }
    ).getCurrentWorkspaceState = getCurrentWorkspaceState;
    (
      globalThis as {
        getCurrentWorkspaceState?: () => Omit<
          WorkspaceState,
          "id" | "name" | "timestamp"
        >;
        restoreWorkspaceState?: (state: SavedWorkspaceState) => void;
      }
    ).restoreWorkspaceState = (state: SavedWorkspaceState) => {
      // Set theme
      setCurrentTheme(state.theme || state.currentTheme || "dark");

      // Set panel sizes
      if (state.panelSizes) {
        setLeftWidth(state.panelSizes.leftWidth);
        setRightWidth(state.panelSizes.rightWidth);
        setBottomHeight(state.panelSizes.bottomHeight);
      } else {
        // Fallback to individual properties
        setLeftWidth(state.leftWidth || 240);
        setRightWidth(state.rightWidth || 320);
        setBottomHeight(state.bottomHeight || 180);
      }

      // Set collapsed states (crucial for proper restoration)
      setLeftCollapsed(state.leftCollapsed || false);
      setRightCollapsed(state.rightCollapsed || false);
      setBottomCollapsed(state.bottomCollapsed || false);
      setMainCollapsed(state.mainCollapsed || false);

      // Set config
      if (state.config || state.workspaceConfig) {
        setWorkspaceConfig(state.config || state.workspaceConfig!);
      }

      // Set tab containers with proper React components
      setTabContainers(
        state.tabContainers.map((container) => ({
          ...container,
          tabs: container.tabs.map((tab) => {
            // Create proper React components based on tab ID
            let content: React.ReactNode;

            // First, try to find the view in the global registry
            const baseViewId = tab.id.replace(/-\d+$/, ""); // Remove timestamp suffix
            let viewDefinition = globalViewRegistry.getView(tab.id); // Try exact match first
            if (!viewDefinition) {
              viewDefinition = globalViewRegistry.getView(baseViewId); // Try base ID
            }

            if (viewDefinition) {
              content = React.createElement(
                viewDefinition.component,
                viewDefinition.props || {}
              );
            } else {
              // Fallback to hardcoded components for backwards compatibility
              if (tab.id === "workspace-manager") {
                content = <WorkspaceManager />;
              } else if (tab.id === "workspace-config") {
                content = <WorkspaceConfigEditor />;
              } else {
                // For other tabs, use the saved content or fallback to title
                content = tab.content ? (
                  <div>{tab.content}</div>
                ) : (
                  <div>{tab.title}</div>
                );
              }
            }

            return {
              ...tab,
              content,
              closable: tab.closable ?? true,
            };
          }),
        }))
      );

      console.log("Workspace state restored with:", {
        leftWidth: state.leftWidth || state.panelSizes?.leftWidth,
        rightWidth: state.rightWidth || state.panelSizes?.rightWidth,
        bottomHeight: state.bottomHeight || state.panelSizes?.bottomHeight,
        leftCollapsed: state.leftCollapsed,
        rightCollapsed: state.rightCollapsed,
        bottomCollapsed: state.bottomCollapsed,
      });
    };

    return () => {
      delete (
        globalThis as {
          getCurrentWorkspaceState?: () => Omit<
            WorkspaceState,
            "id" | "name" | "timestamp"
          >;
          restoreWorkspaceState?: (state: SavedWorkspaceState) => void;
        }
      ).getCurrentWorkspaceState;
      delete (
        globalThis as {
          getCurrentWorkspaceState?: () => Omit<
            WorkspaceState,
            "id" | "name" | "timestamp"
          >;
          restoreWorkspaceState?: (state: SavedWorkspaceState) => void;
        }
      ).restoreWorkspaceState;
    };
  }, [getCurrentWorkspaceState, loadWorkspace]);

  const contextValue: WorkspaceContextType = {
    // State
    leftWidth,
    rightWidth,
    bottomHeight,
    leftCollapsed,
    rightCollapsed,
    bottomCollapsed,
    mainCollapsed,
    currentTheme,
    workspaceConfig: currentWorkspaceConfig,
    tabContainers,

    // Panel size setters
    setLeftWidth,
    setRightWidth,
    setBottomHeight,

    // Panel collapse setters
    setLeftCollapsed,
    setRightCollapsed,
    setBottomCollapsed,
    setMainCollapsed,

    // Theme setter
    setCurrentTheme,

    // Config setter
    setWorkspaceConfig,

    // Tab management
    setTabContainers,

    // Tab event handlers
    handleTabSelect,
    handleTabClose,
    handleTabMove,
    handleTabAdd,

    // Workspace management
    loadWorkspace,

    // View management
    addView,
    getAvailableViews,

    // Pane maximization
    maximizePane,

    // Minimize pane
    minimizePane,

    // Restore panes
    restorePanes,

    // Check if maximized
    isAnyPaneMaximized,
  };

  return (
    <WorkspaceContext.Provider value={contextValue}>
      {children}
    </WorkspaceContext.Provider>
  );
};
