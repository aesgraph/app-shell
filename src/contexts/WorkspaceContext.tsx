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

  // Theme and config
  currentTheme: ThemeId;
  workspaceConfig: WorkspaceConfig;

  // Tab containers
  tabContainers: TabContainerData[];
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
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(workspaceConfig.theme);
  const [currentWorkspaceConfig, setWorkspaceConfig] =
    useState(workspaceConfig);
  const [tabContainers, setTabContainers] = useState<TabContainerData[]>([]);

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
              id: "main-pane",
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
            id: "main-pane",
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
          id: "main-pane",
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

  const contextValue: WorkspaceContextType = {
    // State
    leftWidth,
    rightWidth,
    bottomHeight,
    leftCollapsed,
    rightCollapsed,
    bottomCollapsed,
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
  };

  return (
    <WorkspaceContext.Provider value={contextValue}>
      {children}
    </WorkspaceContext.Provider>
  );
};
