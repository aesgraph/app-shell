import React, { useCallback, useEffect, useRef, useState } from "react";
import type { ImperativePanelGroupHandle } from "react-resizable-panels";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useTheme, useAppShell } from "../contexts/useAppShell";
import {
  LayoutConfig,
  LayoutManagerProps,
  PaneType,
} from "../types/LayoutConfig";
import { ThemeId } from "../types/Theme";
import { globalViewRegistry } from "../types/ViewRegistry";
import { WorkspaceState } from "../types/workspace";
import { createDefaultLayoutConfig } from "../utils/layoutConfigUtils";
import { applyThemeVars, getThemeStyles } from "../utils/themeUtils";
import styles from "./LayoutManager.module.css";
import { Tab, TabManager } from "./TabManager";
import { registerLayoutManagerViews } from "../views/layoutManagerViews";

type Pane = PaneType;

export const LayoutManager: React.FC<LayoutManagerProps> = ({
  initialConfig,
  onConfigChange,
}) => {
  const { log } = useAppShell();

  // Create a logger function based on context log
  const logWithLevel = useCallback(
    (level: "info" | "warn" | "error", message: string, ...args: unknown[]) => {
      log(`[${level.toUpperCase()}] ${message}`, ...args);
    },
    [log]
  );

  // Get theme context
  const { theme } = useTheme();
  const themeStyles = getThemeStyles(theme);

  // Use provided config or default
  const config = initialConfig || createDefaultLayoutConfig();

  // Log initial configuration
  logWithLevel("info", "Initializing LayoutManager with config:", config);

  // Initial values from config
  const initialLayout = config.layout;
  const initialBottomHeight = config.bottomHeight;

  // Tab instance cache - maps tab ID to cached React element
  const tabInstanceCache = useRef<Map<string, React.ReactNode>>(new Map());

  // Convert config tabs to Tab format with caching
  const convertConfigToTabs = (paneConfig: typeof config.panes.left): Tab[] => {
    if (!paneConfig || !paneConfig.tabs) {
      logWithLevel("warn", "Invalid pane config provided", paneConfig);
      return [];
    }

    logWithLevel(
      "info",
      `Converting ${paneConfig.tabs.length} tabs to Tab format`
    );

    return paneConfig.tabs.map((tab) => ({
      id: tab.id,
      title: tab.title,
      content: (() => {
        // Check if we have a cached instance first
        const cachedContent = tabInstanceCache.current.get(tab.id);
        if (cachedContent) {
          logWithLevel("info", `Using cached content for tab: ${tab.id}`);
          return cachedContent;
        }

        // Create new instance and cache it
        let newContent: React.ReactNode;

        try {
          // Handle React component type
          if (typeof tab.content === "function") {
            const Component = tab.content as React.ComponentType<
              Record<string, unknown>
            >;
            logWithLevel("info", `Creating React component for tab: ${tab.id}`);
            newContent = React.createElement(Component, { key: tab.id });
          }
          // Handle string (view ID)
          else if (typeof tab.content === "string") {
            // Try to resolve as a view ID first
            const viewDef = globalViewRegistry.getView(tab.content);
            if (viewDef) {
              const ViewComponent = viewDef.component;
              logWithLevel(
                "info",
                `Creating component for view ID: ${tab.content}`,
                viewDef
              );
              newContent = React.createElement(ViewComponent, {
                key: tab.id,
                ...(viewDef.props || {}),
              });
            } else {
              logWithLevel(
                "warn",
                `View ID not found in registry: ${tab.content}`
              );
              // Fallback to simple content div
              newContent = React.createElement(
                "div",
                { key: tab.id },
                `${tab.content} Content`
              );
            }
          }
          // Handle ReactNode (JSX)
          else {
            logWithLevel("info", `Using ReactNode content for tab: ${tab.id}`);
            newContent = tab.content;
          }
        } catch (error) {
          logWithLevel(
            "error",
            `Error creating component for tab ${tab.id}:`,
            error
          );
          newContent = React.createElement(
            "div",
            { key: tab.id },
            `Error loading ${tab.title}`
          );
        }

        // Cache the instance for reuse
        tabInstanceCache.current.set(tab.id, newContent);
        return newContent;
      })(),
    }));
  };

  const initialTabs: Record<Pane, Tab[]> = {
    left: convertConfigToTabs(config.panes.left),
    center: convertConfigToTabs(config.panes.center),
    right: convertConfigToTabs(config.panes.right),
    bottom: convertConfigToTabs(config.panes.bottom),
  };

  // Apply theme CSS variables to document when theme changes
  useEffect(() => {
    if (document.documentElement) {
      applyThemeVars(document.documentElement, theme);
    }

    // Also update CSS custom properties for resize handle hover effects
    const style = document.createElement("style");
    style.textContent = `
      .${styles["aes-resizeHandle"]}:hover {
        background-color: ${theme.colors.workspaceResizerHover} !important;
      }
      .${styles["aes-resizeHandle"]}:active {
        background-color: ${theme.colors.primary} !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [theme]);

  // Function to add a view as a tab
  const addViewAsTab = useCallback(
    (
      viewId: string,
      pane: Pane,
      options?: {
        props?: Record<string, unknown>;
        title?: string;
        activate?: boolean;
      }
    ) => {
      logWithLevel(
        "info",
        "LayoutManager: addViewAsTab called with:",
        viewId,
        pane,
        options
      );
      const viewDef = globalViewRegistry.getView(viewId);
      logWithLevel("info", "LayoutManager: viewDef found:", viewDef);
      if (!viewDef) return;

      const tabId = `${viewId}-${Date.now()}`;
      const ViewComponent = viewDef.component;
      const { props = {}, title, activate = true } = options || {};

      // Create and cache the component instance
      const content = React.createElement(ViewComponent, {
        key: tabId,
        ...(viewDef.props || {}),
        ...props,
      });
      tabInstanceCache.current.set(tabId, content);

      const newTab: Tab = {
        id: tabId,
        title: title || viewDef.title,
        content: content,
      };

      logWithLevel("info", "LayoutManager: Adding new tab:", newTab);

      setTabs((prev) => ({
        ...prev,
        [pane]: [...prev[pane], newTab],
      }));

      if (activate) {
        setActiveTabIds((prev) => ({
          ...prev,
          [pane]: newTab.id,
        }));
      }
    },
    [logWithLevel]
  );

  // Function to add a custom component as a tab
  const addCustomTabAsTab = useCallback(
    (
      tabId: string,
      component: React.ComponentType<Record<string, unknown>>,
      title: string,
      pane: Pane,
      options?: {
        props?: Record<string, unknown>;
        activate?: boolean;
      }
    ) => {
      logWithLevel(
        "info",
        "LayoutManager: addCustomTabAsTab called with:",
        tabId,
        title,
        pane,
        options
      );

      const { props = {}, activate = true } = options || {};

      // Create and cache the component instance
      const content = React.createElement(component, {
        key: tabId,
        ...props,
      });
      tabInstanceCache.current.set(tabId, content);

      const newTab: Tab = {
        id: tabId,
        title: title,
        content: content,
      };

      logWithLevel("info", "LayoutManager: Adding custom tab:", newTab);

      setTabs((prev) => ({
        ...prev,
        [pane]: [...prev[pane], newTab],
      }));

      if (activate) {
        setActiveTabIds((prev) => ({
          ...prev,
          [pane]: newTab.id,
        }));
      }
    },
    [logWithLevel]
  );

  // Register views on mount
  useEffect(() => {
    registerLayoutManagerViews(log);
  }, [log]);

  // Add event listener for tab addition
  useEffect(() => {
    const handleAddTab = (event: CustomEvent) => {
      logWithLevel(
        "info",
        "LayoutManager: Received add-tab event:",
        event.detail
      );
      const { panelId, viewId, props, title, activate } = event.detail;
      addViewAsTab(viewId, panelId as Pane, { props, title, activate });
    };

    const handleAddCustomTab = (event: CustomEvent) => {
      logWithLevel(
        "info",
        "LayoutManager: Received add-custom-tab event:",
        event.detail
      );
      const { panelId, tabId, component, title, props, activate } =
        event.detail;
      addCustomTabAsTab(tabId, component, title, panelId as Pane, {
        props,
        activate,
      });
    };

    document.addEventListener("add-tab", handleAddTab as EventListener);
    document.addEventListener(
      "add-custom-tab",
      handleAddCustomTab as EventListener
    );
    return () => {
      document.removeEventListener("add-tab", handleAddTab as EventListener);
      document.removeEventListener(
        "add-custom-tab",
        handleAddCustomTab as EventListener
      );
    };
  }, [addViewAsTab, addCustomTabAsTab, logWithLevel]);

  // Cleanup tab instance cache on unmount
  useEffect(() => {
    const cache = tabInstanceCache.current;
    return () => {
      cache.clear();
    };
  }, []);

  // Minimize and maximize button rendering for TabManager
  const renderMinimizeButton = (pane: Pane) => (
    <button
      className={styles["aes-iconButton"]}
      onClick={() => handleMinimize(pane)}
      title="Minimize"
      type="button"
    >
      −
    </button>
  );

  const renderMaximizeButton = (pane: Pane) => (
    <button
      className={styles["aes-iconButton"]}
      onClick={() => handleMaximize(pane)}
      title={maximizedPane === pane ? "Restore" : "Maximize"}
      type="button"
    >
      {maximizedPane === pane ? "❐" : "□"}
    </button>
  );

  // Collapse logic for each pane
  const handleMinimize = (pane: Pane) => {
    if (pane === "bottom") {
      verticalGroupRef.current?.setLayout([85, 15]); // Respect minimum bottom size
    } else {
      // left, center, right
      const layoutArr = horizontalGroupRef.current?.getLayout?.() || layout;
      let newLayout = [...layoutArr];
      if (pane === "left")
        newLayout = [10, newLayout[1] + newLayout[0] - 10, newLayout[2]]; // Minimize to min size
      if (pane === "center")
        newLayout = [newLayout[0], 20, newLayout[2] + newLayout[1] - 20]; // Minimize to min size
      if (pane === "right")
        newLayout = [newLayout[0], newLayout[1] + newLayout[2] - 10, 10]; // Minimize to min size
      horizontalGroupRef.current?.setLayout(newLayout);
    }
  };
  // Tab state
  const [tabs, setTabs] = useState<Record<Pane, Tab[]>>(initialTabs);
  const [activeTabIds, setActiveTabIds] = useState<Record<Pane, string>>({
    left: config.panes.left.activeTabId || config.panes.left.tabs[0]?.id || "",
    center:
      config.panes.center.activeTabId || config.panes.center.tabs[0]?.id || "",
    right:
      config.panes.right.activeTabId || config.panes.right.tabs[0]?.id || "",
    bottom:
      config.panes.bottom.activeTabId || config.panes.bottom.tabs[0]?.id || "",
  });

  const [maximizedPane, setMaximizedPane] = useState<Pane | null>(
    config.maximizedPane || null
  );
  const [layout, setLayout] = useState<number[]>(initialLayout);
  const [bottomHeight, setBottomHeight] = useState<number>(initialBottomHeight);

  // State for maximize/minimize functionality - simple layout storage
  const [savedLayout, setSavedLayout] = useState<{
    horizontal: number[];
    vertical: number[];
  } | null>(null);

  // Refs and layout management
  const horizontalGroupRef = useRef<ImperativePanelGroupHandle>(null);
  const verticalGroupRef = useRef<ImperativePanelGroupHandle>(null);

  // Notify configuration changes
  const notifyConfigChange = useCallback(() => {
    if (onConfigChange) {
      const currentLayout = horizontalGroupRef.current?.getLayout?.() || layout;
      const currentBottomHeight =
        verticalGroupRef.current?.getLayout?.()?.[1] || bottomHeight;

      const newConfig: LayoutConfig = {
        layout: [
          currentLayout[0] || 0,
          currentLayout[1] || 0,
          currentLayout[2] || 0,
        ],
        bottomHeight: currentBottomHeight,
        panes: {
          left: {
            tabs: tabs.left.map((tab) => ({
              id: tab.id,
              title: tab.title,
              content: tab.content,
              closable: true,
            })),
            activeTabId: activeTabIds.left,
          },
          center: {
            tabs: tabs.center.map((tab) => ({
              id: tab.id,
              title: tab.title,
              content: tab.content,
              closable: true,
            })),
            activeTabId: activeTabIds.center,
          },
          right: {
            tabs: tabs.right.map((tab) => ({
              id: tab.id,
              title: tab.title,
              content: tab.content,
              closable: true,
            })),
            activeTabId: activeTabIds.right,
          },
          bottom: {
            tabs: tabs.bottom.map((tab) => ({
              id: tab.id,
              title: tab.title,
              content: tab.content,
              closable: true,
            })),
            activeTabId: activeTabIds.bottom,
          },
        },
        maximizedPane,
      };
      onConfigChange(newConfig);
    }
  }, [onConfigChange, tabs, activeTabIds, layout, bottomHeight, maximizedPane]);

  // Call notifyConfigChange whenever configuration changes
  useEffect(() => {
    notifyConfigChange();
  }, [notifyConfigChange]);

  // Tab actions
  const handleTabSelect = (pane: Pane, tabId: string) => {
    logWithLevel("info", `Tab selected - Pane: ${pane}, Tab ID: ${tabId}`);
    setActiveTabIds((prev) => ({ ...prev, [pane]: tabId }));
  };

  // Function to get current workspace state
  const getCurrentWorkspaceState = useCallback((): Omit<
    WorkspaceState,
    "id" | "name" | "timestamp"
  > => {
    const currentLayout = horizontalGroupRef.current?.getLayout?.() || layout;
    const currentBottomHeight =
      verticalGroupRef.current?.getLayout?.()?.[1] || bottomHeight;

    return {
      config: {},
      layout: {
        horizontal: currentLayout,
        vertical: [100 - currentBottomHeight, currentBottomHeight],
      },
      maximizedPane: maximizedPane, // Include maximized pane state
      savedLayout: savedLayout, // Include saved layout for restore
      tabContainers: [
        {
          id: "left",
          tabs: tabs.left.map((tab) => {
            // Check if this tab is a registered view
            if (tab.id.includes("workspace-manager")) {
              return {
                id: tab.id,
                title: tab.title,
                content: "workspace-manager",
                closable: true,
              };
            }

            // For other dynamically added views, try to match by title
            const matchingView = globalViewRegistry
              .getAllViews()
              .find((view) => view.title === tab.title);

            if (matchingView) {
              return {
                id: tab.id,
                title: tab.title,
                content: matchingView.id,
                closable: true,
              };
            }

            // Default tabs
            return {
              id: tab.id,
              title: tab.title,
              content: tab.title.toLowerCase().replace(/\s+/g, "-"),
              closable: true,
            };
          }),
          activeTabId: activeTabIds.left,
        },
        {
          id: "center",
          tabs: tabs.center.map((tab) => {
            // Check if this tab is a registered view
            if (tab.id.includes("workspace-manager")) {
              return {
                id: tab.id,
                title: tab.title,
                content: "workspace-manager",
                closable: true,
              };
            }

            // For other dynamically added views, try to match by title
            const matchingView = globalViewRegistry
              .getAllViews()
              .find((view) => view.title === tab.title);

            if (matchingView) {
              return {
                id: tab.id,
                title: tab.title,
                content: matchingView.id,
                closable: true,
              };
            }

            // Default tabs
            return {
              id: tab.id,
              title: tab.title,
              content: tab.title.toLowerCase().replace(/\s+/g, "-"),
              closable: true,
            };
          }),
          activeTabId: activeTabIds.center,
        },
        {
          id: "right",
          tabs: tabs.right.map((tab) => {
            // Check if this tab is a registered view
            if (tab.id.includes("workspace-manager")) {
              return {
                id: tab.id,
                title: tab.title,
                content: "workspace-manager",
                closable: true,
              };
            }

            // For other dynamically added views, try to match by title
            const matchingView = globalViewRegistry
              .getAllViews()
              .find((view) => view.title === tab.title);

            if (matchingView) {
              return {
                id: tab.id,
                title: tab.title,
                content: matchingView.id,
                closable: true,
              };
            }

            // Default tabs
            return {
              id: tab.id,
              title: tab.title,
              content: tab.title.toLowerCase().replace(/\s+/g, "-"),
              closable: true,
            };
          }),
          activeTabId: activeTabIds.right,
        },
        {
          id: "bottom",
          tabs: tabs.bottom.map((tab) => {
            // Check if this tab is a registered view
            if (tab.id.includes("workspace-manager")) {
              return {
                id: tab.id,
                title: tab.title,
                content: "workspace-manager",
                closable: true,
              };
            }

            // For other dynamically added views, try to match by title
            const matchingView = globalViewRegistry
              .getAllViews()
              .find((view) => view.title === tab.title);

            if (matchingView) {
              return {
                id: tab.id,
                title: tab.title,
                content: matchingView.id,
                closable: true,
              };
            }

            // Default tabs
            return {
              id: tab.id,
              title: tab.title,
              content: tab.title.toLowerCase().replace(/\s+/g, "-"),
              closable: true,
            };
          }),
          activeTabId: activeTabIds.bottom,
        },
      ],
      theme: "light" as ThemeId, // Default theme, can be made dynamic
    };
  }, [tabs, activeTabIds, layout, bottomHeight, maximizedPane, savedLayout]);

  // Function to restore workspace state
  const restoreWorkspaceState = useCallback(
    (workspaceState: WorkspaceState) => {
      logWithLevel(
        "info",
        "LayoutManager: Restoring workspace state:",
        workspaceState
      );

      // Restore panel layout directly
      if (workspaceState.layout) {
        horizontalGroupRef.current?.setLayout(workspaceState.layout.horizontal);
        verticalGroupRef.current?.setLayout(workspaceState.layout.vertical);
      }

      // Restore maximized pane state
      if (workspaceState.maximizedPane) {
        setMaximizedPane(workspaceState.maximizedPane as Pane);
        // Restore saved layout for future restore operations
        if (workspaceState.savedLayout) {
          setSavedLayout(workspaceState.savedLayout);
        }
        // Apply maximized layout immediately
        const pane = workspaceState.maximizedPane as Pane;
        if (pane === "bottom") {
          verticalGroupRef.current?.setLayout([0, 100]);
        } else {
          verticalGroupRef.current?.setLayout([100, 0]);
          if (pane === "left") {
            horizontalGroupRef.current?.setLayout([100, 0, 0]);
          } else if (pane === "center") {
            horizontalGroupRef.current?.setLayout([0, 100, 0]);
          } else if (pane === "right") {
            horizontalGroupRef.current?.setLayout([0, 0, 100]);
          }
        }
      } else {
        setMaximizedPane(null);
        setSavedLayout(null);
      }

      // Restore tabs for each container
      const newTabs: Record<Pane, Tab[]> = {
        left: [],
        center: [],
        right: [],
        bottom: [],
      };

      const newActiveTabIds: Record<Pane, string> = {
        left: "",
        center: "",
        right: "",
        bottom: "",
      };

      workspaceState.tabContainers.forEach((container) => {
        const pane = container.id as Pane;
        if (!pane || !(pane in newTabs)) return;

        newTabs[pane] = container.tabs.map((tabData) => {
          // Handle registered views by content ID
          const viewDef = globalViewRegistry.getView(tabData.content);
          if (viewDef) {
            const ViewComponent = viewDef.component;
            return {
              id: tabData.id,
              title: tabData.title,
              content: <ViewComponent {...(viewDef.props || {})} />,
            };
          }

          // For default tabs (Left Tab 1, etc.), create simple content
          if (tabData.title.match(/^(Left|Center|Right|Bottom) Tab \d+$/)) {
            return {
              id: tabData.id,
              title: tabData.title,
              content: <div>{tabData.title} Content</div>,
            };
          }

          // Fallback for unknown content
          return {
            id: tabData.id,
            title: tabData.title,
            content: <div>{tabData.content || `${tabData.title} Content`}</div>,
          };
        });

        if (
          container.activeTabId &&
          container.tabs.some((t) => t.id === container.activeTabId)
        ) {
          newActiveTabIds[pane] = container.activeTabId;
        } else if (container.tabs.length > 0) {
          newActiveTabIds[pane] = container.tabs[0].id;
        }
      });

      setTabs(newTabs);
      setActiveTabIds(newActiveTabIds);

      logWithLevel("info", "LayoutManager: Workspace restored successfully");
    },
    [logWithLevel]
  );

  // Expose restoreWorkspaceState globally for WorkspaceManager
  useEffect(() => {
    (
      globalThis as {
        getCurrentWorkspaceState?: () => Omit<
          WorkspaceState,
          "id" | "name" | "timestamp"
        >;
        restoreWorkspaceState?: (state: WorkspaceState) => void;
      }
    ).getCurrentWorkspaceState = getCurrentWorkspaceState;
    (
      globalThis as {
        getCurrentWorkspaceState?: () => Omit<
          WorkspaceState,
          "id" | "name" | "timestamp"
        >;
        restoreWorkspaceState?: (state: WorkspaceState) => void;
      }
    ).restoreWorkspaceState = restoreWorkspaceState;
    return () => {
      delete (
        globalThis as {
          getCurrentWorkspaceState?: () => Omit<
            WorkspaceState,
            "id" | "name" | "timestamp"
          >;
          restoreWorkspaceState?: (state: WorkspaceState) => void;
        }
      ).getCurrentWorkspaceState;
      delete (
        globalThis as {
          getCurrentWorkspaceState?: () => Omit<
            WorkspaceState,
            "id" | "name" | "timestamp"
          >;
          restoreWorkspaceState?: (state: WorkspaceState) => void;
        }
      ).restoreWorkspaceState;
    };
  }, [getCurrentWorkspaceState, restoreWorkspaceState]);

  const handleTabClose = (pane: Pane, tabId: string) => {
    logWithLevel("info", `Tab closed - Pane: ${pane}, Tab ID: ${tabId}`);
    // Remove from cache when tab is closed
    tabInstanceCache.current.delete(tabId);

    setTabs((prev) => {
      const newTabs = { ...prev };
      newTabs[pane] = newTabs[pane].filter((tab) => tab.id !== tabId);
      return newTabs;
    });
    setActiveTabIds((prev) => {
      const paneTabs = tabs[pane].filter((tab) => tab.id !== tabId);
      return {
        ...prev,
        [pane]: paneTabs.length > 0 ? paneTabs[0].id : "",
      };
    });
  };

  const handleTabDrop = (tabId: string, targetPane: Pane) => {
    logWithLevel(
      "info",
      `Tab drop initiated - Tab ID: ${tabId}, Target Pane: ${targetPane}`
    );
    // Find which pane the tab is currently in
    let fromPane: Pane | null = null;
    let tabToMove: Tab | null = null;
    (Object.keys(tabs) as Pane[]).forEach((pane) => {
      const found = tabs[pane].find((tab) => tab.id === tabId);
      if (found) {
        fromPane = pane;
        tabToMove = found;
      }
    });
    if (!fromPane || !tabToMove || fromPane === targetPane) {
      logWithLevel(
        "warn",
        `Tab drop cancelled - fromPane: ${fromPane}, tabToMove: ${!!tabToMove}, targetPane: ${targetPane}`
      );
      return;
    }

    logWithLevel("info", `Moving tab from ${fromPane} to ${targetPane}`);
    setTabs((prev) => {
      const newTabs = { ...prev };
      newTabs[fromPane!] = newTabs[fromPane!].filter((tab) => tab.id !== tabId);
      newTabs[targetPane] = [...newTabs[targetPane], tabToMove!];
      return newTabs;
    });
    setActiveTabIds((prev) => ({
      ...prev,
      [fromPane!]:
        tabs[fromPane!].filter((tab) => tab.id !== tabId)[0]?.id || "",
      [targetPane]: tabId,
    }));
  };

  // ...existing maximize/restore logic...

  const handleMaximize = useCallback(
    (pane: Pane) => {
      logWithLevel(
        "info",
        `Maximize triggered for pane: ${pane}, current maximized: ${maximizedPane}`
      );

      if (maximizedPane === pane) {
        logWithLevel("info", "Restoring pane from maximized state");
        setMaximizedPane(null);
        // Restore layout from saved state
        if (
          savedLayout &&
          savedLayout.horizontal.length &&
          savedLayout.vertical.length
        ) {
          logWithLevel("info", "Restoring from saved layout", savedLayout);
          horizontalGroupRef.current?.setLayout(savedLayout.horizontal);
          verticalGroupRef.current?.setLayout(savedLayout.vertical);
        } else {
          logWithLevel("info", "Restoring to initial layout");
          horizontalGroupRef.current?.setLayout(initialLayout);
          verticalGroupRef.current?.setLayout([
            100 - initialBottomHeight,
            initialBottomHeight,
          ]);
        }
        // Clear saved layout after restoring
        setSavedLayout(null);
      } else {
        logWithLevel("info", `Maximizing pane: ${pane}`);
        // Save current layout before maximizing
        const currentHorizontal =
          horizontalGroupRef.current?.getLayout?.() || layout;
        const currentVertical = verticalGroupRef.current?.getLayout?.() || [
          100 - bottomHeight,
          bottomHeight,
        ];

        logWithLevel("info", "Saving current layout before maximize", {
          horizontal: currentHorizontal,
          vertical: currentVertical,
        });

        setSavedLayout({
          horizontal: currentHorizontal,
          vertical: currentVertical,
        });

        setMaximizedPane(pane);
        if (pane === "bottom") {
          logWithLevel("info", "Setting bottom pane to full height");
          verticalGroupRef.current?.setLayout([0, 100]);
        } else {
          logWithLevel(
            "info",
            "Hiding bottom pane and maximizing horizontal pane"
          );
          verticalGroupRef.current?.setLayout([100, 0]);
          if (pane === "left") {
            horizontalGroupRef.current?.setLayout([100, 0, 0]);
          } else if (pane === "center") {
            horizontalGroupRef.current?.setLayout([0, 100, 0]);
          } else if (pane === "right") {
            horizontalGroupRef.current?.setLayout([0, 0, 100]);
          }
        }
      }
    },
    [
      maximizedPane,
      savedLayout,
      layout,
      bottomHeight,
      initialLayout,
      initialBottomHeight,
      logWithLevel,
    ]
  );

  // Add event listener for pane maximization
  useEffect(() => {
    const handleMaximizePane = (event: CustomEvent) => {
      logWithLevel(
        "info",
        "LayoutManager: Received maximize-pane event:",
        event.detail
      );
      const { pane } = event.detail;
      handleMaximize(pane as Pane);
    };

    document.addEventListener(
      "maximize-pane",
      handleMaximizePane as EventListener
    );
    return () =>
      document.removeEventListener(
        "maximize-pane",
        handleMaximizePane as EventListener
      );
  }, [handleMaximize, logWithLevel]);

  // Helper to render tab content for a pane
  const renderTabContent = (pane: Pane) => {
    const tab = tabs[pane].find((t) => t.id === activeTabIds[pane]);
    return tab ? tab.content : null;
  };

  return (
    <div
      className={
        styles["aes-layoutManager"] +
        (maximizedPane ? " " + styles["aes-layoutManagerMaximized"] : "")
      }
      style={themeStyles.workspace.container}
    >
      <PanelGroup
        direction="vertical"
        ref={verticalGroupRef}
        style={{ height: "100%", width: "100%" }}
        onLayout={(sizes) => {
          logWithLevel(
            "info",
            `Vertical layout changed - sizes: [${sizes.join(", ")}]`
          );
          setBottomHeight(sizes[1]);
        }}
        autoSaveId="vertical-group"
      >
        <Panel defaultSize={100 - initialBottomHeight} collapsible>
          <PanelGroup
            direction="horizontal"
            ref={horizontalGroupRef}
            style={{ height: "100%", width: "100%" }}
            onLayout={(sizes) => {
              logWithLevel(
                "info",
                `Horizontal layout changed - sizes: [${sizes.join(", ")}]`
              );
              setLayout(sizes);
            }}
            autoSaveId="horizontal-group"
          >
            {/* Left Pane */}
            <Panel defaultSize={initialLayout[0]} collapsible>
              <div
                className={`${styles["aes-pane"]} ${styles["aes-leftPane"]}`}
                style={themeStyles.workspace.panel}
              >
                <TabManager
                  tabs={tabs.left}
                  activeTabId={activeTabIds.left}
                  onTabSelect={(tabId) => handleTabSelect("left", tabId)}
                  onTabClose={(tabId) => handleTabClose("left", tabId)}
                  onTabDrop={(tabId, targetPanel) =>
                    handleTabDrop(tabId, targetPanel as Pane)
                  }
                  panelId="left"
                  rightContent={
                    <>
                      {renderMinimizeButton("left")}
                      {renderMaximizeButton("left")}
                    </>
                  }
                />
                <div className={styles["aes-paneContent"]}>
                  {renderTabContent("left")}
                </div>
              </div>
            </Panel>
            <PanelResizeHandle
              className={`${styles["aes-resizeHandle"]} ${styles["aes-verticalHandle"]}`}
              style={{
                backgroundColor: theme.colors.workspaceResizer,
              }}
            />
            {/* Center Pane */}
            <Panel defaultSize={initialLayout[1]} collapsible>
              <div
                className={`${styles["aes-pane"]} ${styles["aes-centerPane"]}`}
                style={themeStyles.workspace.panel}
              >
                <TabManager
                  tabs={tabs.center}
                  activeTabId={activeTabIds.center}
                  onTabSelect={(tabId) => handleTabSelect("center", tabId)}
                  onTabClose={(tabId) => handleTabClose("center", tabId)}
                  onTabDrop={(tabId, targetPanel) =>
                    handleTabDrop(tabId, targetPanel as Pane)
                  }
                  panelId="center"
                  rightContent={
                    <>
                      {renderMinimizeButton("center")}
                      {renderMaximizeButton("center")}
                    </>
                  }
                />
                <div className={styles["aes-paneContent"]}>
                  {renderTabContent("center")}
                </div>
              </div>
            </Panel>
            <PanelResizeHandle
              className={`${styles["aes-resizeHandle"]} ${styles["aes-verticalHandle"]}`}
              style={{
                backgroundColor: theme.colors.workspaceResizer,
              }}
            />
            {/* Right Pane */}
            <Panel defaultSize={initialLayout[2]} collapsible>
              <div
                className={`${styles["aes-pane"]} ${styles["aes-rightPane"]}`}
                style={themeStyles.workspace.panel}
              >
                <TabManager
                  tabs={tabs.right}
                  activeTabId={activeTabIds.right}
                  onTabSelect={(tabId) => handleTabSelect("right", tabId)}
                  onTabClose={(tabId) => handleTabClose("right", tabId)}
                  onTabDrop={(tabId, targetPanel) =>
                    handleTabDrop(tabId, targetPanel as Pane)
                  }
                  panelId="right"
                  rightContent={
                    <>
                      {renderMinimizeButton("right")}
                      {renderMaximizeButton("right")}
                    </>
                  }
                />
                <div className={styles["aes-paneContent"]}>
                  {renderTabContent("right")}
                </div>
              </div>
            </Panel>
          </PanelGroup>
        </Panel>
        <PanelResizeHandle
          className={`${styles["aes-resizeHandle"]} ${styles["aes-horizontalHandle"]}`}
          style={{
            backgroundColor: theme.colors.workspaceResizer,
          }}
        />
        {/* Bottom Pane */}
        <Panel defaultSize={initialBottomHeight} collapsible>
          <div
            className={`${styles["aes-pane"]} ${styles["aes-bottomPane"]}`}
            style={themeStyles.workspace.panel}
          >
            <TabManager
              tabs={tabs.bottom}
              activeTabId={activeTabIds.bottom}
              onTabSelect={(tabId) => handleTabSelect("bottom", tabId)}
              onTabClose={(tabId) => handleTabClose("bottom", tabId)}
              onTabDrop={(tabId, targetPanel) =>
                handleTabDrop(tabId, targetPanel as Pane)
              }
              panelId="bottom"
              rightContent={
                <>
                  {renderMinimizeButton("bottom")}
                  {renderMaximizeButton("bottom")}
                </>
              }
            />
            <div className={styles["aes-paneContent"]}>
              {renderTabContent("bottom")}
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
};
