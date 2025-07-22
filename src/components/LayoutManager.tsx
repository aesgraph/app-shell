import React, { useRef, useState, useEffect, useCallback } from "react";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import type { ImperativePanelGroupHandle } from "react-resizable-panels";
import styles from "./LayoutManager.module.css";
import { TabData } from "./Tab";
import { registerLayoutManagerViews } from "./views/layoutManagerViews";
import { useLayoutContext } from "../contexts/useLayoutContext";
import { globalViewRegistry } from "../types/ViewRegistry";
import { ThemeId } from "../types/Theme";
import { Tab, TabManager } from "./TabManager";
import { WorkspaceState } from "../types/workspace";
import { useTheme } from "../contexts/useTheme";
import { getThemeStyles, applyThemeVars } from "../utils/themeUtils";

type Pane = "left" | "center" | "right" | "bottom";

const initialLayout = [20, 60, 20];
const initialBottomHeight = 25;

const initialTabs: Record<Pane, TabData[]> = {
  left: [
    { id: "l1", title: "Left Tab 1", content: <div>Left Tab 1 Content</div> },
    { id: "l2", title: "Left Tab 2", content: <div>Left Tab 2 Content</div> },
  ],
  center: [
    {
      id: "c1",
      title: "Center Tab 1",
      content: <div>Center Tab 1 Content</div>,
    },
    {
      id: "c2",
      title: "Center Tab 2",
      content: <div>Center Tab 2 Content</div>,
    },
  ],
  right: [
    { id: "r1", title: "Right Tab 1", content: <div>Right Tab 1 Content</div> },
    { id: "r2", title: "Right Tab 2", content: <div>Right Tab 2 Content</div> },
  ],
  bottom: [
    {
      id: "b1",
      title: "Bottom Tab 1",
      content: <div>Bottom Tab 1 Content</div>,
    },
    {
      id: "b2",
      title: "Bottom Tab 2",
      content: <div>Bottom Tab 2 Content</div>,
    },
  ],
};

export const LayoutManager: React.FC = () => {
  // Get theme context
  const { theme } = useTheme();
  const themeStyles = getThemeStyles(theme);
  
  // Apply theme CSS variables to document when theme changes
  useEffect(() => {
    if (document.documentElement) {
      applyThemeVars(document.documentElement, theme);
    }
    
    // Also update CSS custom properties for resize handle hover effects
    const style = document.createElement('style');
    style.textContent = `
      .${styles.resizeHandle}:hover {
        background-color: ${theme.colors.workspaceResizerHover} !important;
      }
      .${styles.resizeHandle}:active {
        background-color: ${theme.colors.primary} !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, [theme]);
  
  // Function to add a view as a tab
  const addViewAsTab = useCallback((viewId: string, pane: Pane) => {
    console.log("LayoutManager: addViewAsTab called with:", viewId, pane);
    const viewDef = globalViewRegistry.getView(viewId);
    console.log("LayoutManager: viewDef found:", viewDef);
    if (!viewDef) return;

    const ViewComponent = viewDef.component;
    const newTab: Tab = {
      id: `${viewId}-${Date.now()}`,
      title: viewDef.title,
      content: <ViewComponent {...(viewDef.props || {})} />,
    };

    console.log("LayoutManager: Adding new tab:", newTab);

    setTabs((prev) => ({
      ...prev,
      [pane]: [...prev[pane], newTab],
    }));

    setActiveTabIds((prev) => ({
      ...prev,
      [pane]: newTab.id,
    }));
  }, []);

  // Register views on mount
  useEffect(() => {
    registerLayoutManagerViews();
  }, []);

  // Add event listener for tab addition
  useEffect(() => {
    const handleAddTab = (event: CustomEvent) => {
      console.log("LayoutManager: Received add-tab event:", event.detail);
      const { panelId, viewId } = event.detail;
      addViewAsTab(viewId, panelId as Pane);
    };

    document.addEventListener("add-tab", handleAddTab as EventListener);
    return () =>
      document.removeEventListener("add-tab", handleAddTab as EventListener);
  }, [addViewAsTab]);

  // Minimize and maximize button rendering for TabManager
  const renderMinimizeButton = (pane: Pane) => (
    <button
      className={styles.iconButton}
      onClick={() => handleMinimize(pane)}
      title="Minimize"
      type="button"
    >
      −
    </button>
  );

  const renderMaximizeButton = (pane: Pane) => (
    <button
      className={styles.iconButton}
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
      verticalGroupRef.current?.setLayout([100, 0]);
    } else {
      // left, center, right
      const layoutArr = horizontalGroupRef.current?.getLayout?.() || layout;
      let newLayout = [...layoutArr];
      if (pane === "left")
        newLayout = [0, newLayout[1] + newLayout[0], newLayout[2]];
      if (pane === "center")
        newLayout = [newLayout[0], 0, newLayout[2] + newLayout[1]];
      if (pane === "right")
        newLayout = [newLayout[0], newLayout[1] + newLayout[2], 0];
      horizontalGroupRef.current?.setLayout(newLayout);
    }
  };
  const horizontalGroupRef = useRef<ImperativePanelGroupHandle>(null);
  const verticalGroupRef = useRef<ImperativePanelGroupHandle>(null);
  const [maximizedPane, setMaximizedPane] = useState<Pane | null>(null);
  const [layout, setLayout] = useState<number[]>(initialLayout);
  const [bottomHeight, setBottomHeight] = useState<number>(initialBottomHeight);
  const { saveLayout, loadLayout } = useLayoutContext();

  // Tab state
  const [tabs, setTabs] = useState<Record<Pane, Tab[]>>(initialTabs);
  const [activeTabIds, setActiveTabIds] = useState<Record<Pane, string>>({
    left: initialTabs.left[0].id,
    center: initialTabs.center[0].id,
    right: initialTabs.right[0].id,
    bottom: initialTabs.bottom[0].id,
  });

  // Tab actions
  const handleTabSelect = (pane: Pane, tabId: string) => {
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
      panelSizes: {
        leftWidth: currentLayout[0] || 0,
        rightWidth: currentLayout[2] || 0,
        bottomHeight: currentBottomHeight || 0,
      },
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
  }, [tabs, activeTabIds, layout, bottomHeight]);

  // Function to restore workspace state
  const restoreWorkspaceState = useCallback(
    (workspaceState: WorkspaceState) => {
      console.log("LayoutManager: Restoring workspace state:", workspaceState);

      // Restore panel sizes
      const { panelSizes } = workspaceState;
      const centerWidth = 100 - panelSizes.leftWidth - panelSizes.rightWidth;
      const mainHeight = 100 - panelSizes.bottomHeight;

      horizontalGroupRef.current?.setLayout([
        panelSizes.leftWidth,
        centerWidth,
        panelSizes.rightWidth,
      ]);

      verticalGroupRef.current?.setLayout([
        mainHeight,
        panelSizes.bottomHeight,
      ]);

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

      console.log("LayoutManager: Workspace restored successfully");
    },
    []
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
    if (!fromPane || !tabToMove || fromPane === targetPane) return;
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

  const handleMaximize = (pane: Pane) => {
    if (maximizedPane === pane) {
      setMaximizedPane(null);
      // Restore layout from context
      const prev = loadLayout();
      if (prev && prev.horizontal.length && prev.vertical.length) {
        horizontalGroupRef.current?.setLayout(prev.horizontal);
        verticalGroupRef.current?.setLayout(prev.vertical);
      } else {
        horizontalGroupRef.current?.setLayout(initialLayout);
        verticalGroupRef.current?.setLayout([
          100 - initialBottomHeight,
          initialBottomHeight,
        ]);
      }
    } else {
      // Save current layout before maximizing
      saveLayout({
        horizontal: horizontalGroupRef.current?.getLayout?.() || layout,
        vertical: verticalGroupRef.current?.getLayout?.() || [
          100 - bottomHeight,
          bottomHeight,
        ],
      });
      setMaximizedPane(pane);
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
    }
  };

  useEffect(() => {
    // Set initial layout
    horizontalGroupRef.current?.setLayout(initialLayout);
    verticalGroupRef.current?.setLayout([
      100 - initialBottomHeight,
      initialBottomHeight,
    ]);
  }, []);

  // Helper to render tab content for a pane
  const renderTabContent = (pane: Pane) => {
    const tab = tabs[pane].find((t) => t.id === activeTabIds[pane]);
    return tab ? tab.content : null;
  };

  return (
    <div
      className={
        styles.layoutManager +
        (maximizedPane ? " " + styles.layoutManagerMaximized : "")
      }
      style={themeStyles.workspace.container}
    >
      <PanelGroup
        direction="vertical"
        ref={verticalGroupRef}
        style={{ height: "100vh", width: "100%" }}
        onLayout={(sizes) => setBottomHeight(sizes[0])}
        autoSaveId="vertical-group"
      >
        <Panel defaultSize={100 - initialBottomHeight} minSize={0} collapsible>
          <PanelGroup
            direction="horizontal"
            ref={horizontalGroupRef}
            style={{ height: "100%", width: "100%" }}
            onLayout={setLayout}
            autoSaveId="horizontal-group"
          >
            {/* Left Pane */}
            <Panel defaultSize={initialLayout[0]} minSize={0} collapsible>
              <div 
                className={`${styles.pane} ${styles.leftPane}`}
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
                <div className={styles.paneContent}>
                  {renderTabContent("left")}
                </div>
              </div>
            </Panel>
            <PanelResizeHandle
              className={`${styles.resizeHandle} ${styles.verticalHandle}`}
              style={{
                backgroundColor: theme.colors.workspaceResizer,
              }}
            />
            {/* Center Pane */}
            <Panel defaultSize={initialLayout[1]} minSize={0} collapsible>
              <div 
                className={`${styles.pane} ${styles.centerPane}`}
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
                <div className={styles.paneContent}>
                  {renderTabContent("center")}
                </div>
              </div>
            </Panel>
            <PanelResizeHandle
              className={`${styles.resizeHandle} ${styles.verticalHandle}`}
              style={{
                backgroundColor: theme.colors.workspaceResizer,
              }}
            />
            {/* Right Pane */}
            <Panel defaultSize={initialLayout[2]} minSize={0} collapsible>
              <div 
                className={`${styles.pane} ${styles.rightPane}`}
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
                <div className={styles.paneContent}>
                  {renderTabContent("right")}
                </div>
              </div>
            </Panel>
          </PanelGroup>
        </Panel>
        <PanelResizeHandle
          className={`${styles.resizeHandle} ${styles.horizontalHandle}`}
          style={{
            backgroundColor: theme.colors.workspaceResizer,
          }}
        />
        {/* Bottom Pane */}
        <Panel defaultSize={initialBottomHeight} minSize={0} collapsible>
          <div 
            className={`${styles.pane} ${styles.bottomPane}`}
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
            <div className={styles.paneContent}>
              {renderTabContent("bottom")}
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
};
