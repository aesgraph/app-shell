import React, { useEffect, useState } from "react";
import type { ResizeDirection } from "re-resizable";
import Pane from "./Pane";
import { useWorkspace } from "../contexts/useWorkspace";
import WorkspaceConfigEditor from "./views/WorkspaceConfigEditor";
import WorkspaceManager from "./views/WorkspaceManager";
import styles from "../App.module.css";

const Workspace = () => {
  const {
    // State
    leftWidth,
    rightWidth,
    bottomHeight,
    leftCollapsed,
    rightCollapsed,
    bottomCollapsed,
    currentTheme,
    workspaceConfig,
    tabContainers,

    // Setters
    setLeftWidth,
    setRightWidth,
    setBottomHeight,
    setLeftCollapsed,
    setRightCollapsed,
    setBottomCollapsed,
    setTabContainers,

    // Tab handlers
    handleTabSelect,
    handleTabClose,
    handleTabMove,
    handleTabAdd,

    // View management
    addView,
    getAvailableViews,
  } = useWorkspace();

  // Track window dimensions for responsive sizing
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Initialize tab containers if empty
  useEffect(() => {
    console.log(
      "Workspace useEffect - tabContainers.length:",
      tabContainers.length
    );

    // Always initialize if no containers exist
    if (tabContainers.length === 0) {
      console.log("Initializing tab containers...");
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
              closable: true,
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
              closable: true,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Resize handlers
  const handleLeftResize = (
    _: MouseEvent | TouchEvent,
    __: ResizeDirection,
    ref: HTMLElement
  ) => {
    const width = ref.offsetWidth;
    setLeftWidth(width);

    if (!leftCollapsed && width < workspaceConfig.leftPane.collapseThreshold) {
      setLeftCollapsed(true);
    } else if (
      leftCollapsed &&
      width > workspaceConfig.leftPane.collapseThreshold
    ) {
      setLeftCollapsed(false);
    }
  };

  const handleRightResize = (
    _: MouseEvent | TouchEvent,
    __: ResizeDirection,
    ref: HTMLElement
  ) => {
    const width = ref.offsetWidth;
    setRightWidth(width);

    if (
      !rightCollapsed &&
      width < workspaceConfig.rightPane.collapseThreshold
    ) {
      setRightCollapsed(true);
    } else if (
      rightCollapsed &&
      width > workspaceConfig.rightPane.collapseThreshold
    ) {
      setRightCollapsed(false);
    }
  };

  const handleBottomResize = (
    _: MouseEvent | TouchEvent,
    __: ResizeDirection,
    ref: HTMLElement
  ) => {
    const height = ref.offsetHeight;
    setBottomHeight(height);

    if (
      !bottomCollapsed &&
      height < workspaceConfig.bottomPane.collapseThreshold
    ) {
      setBottomCollapsed(true);
    } else if (
      bottomCollapsed &&
      height > workspaceConfig.bottomPane.collapseThreshold
    ) {
      setBottomCollapsed(false);
    }
  };

  return (
    <div
      className={[
        styles.appShellContainer,
        styles[
          `theme${
            currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)
          }` as keyof typeof styles
        ],
      ].join(" ")}
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      {/* Left Panel */}
      <Pane
        title="Explorer"
        size={{ width: leftWidth, height: windowDimensions.height }}
        minSize={{ width: 0 }}
        maxSize={{ width: workspaceConfig.leftPane.maxSize }}
        isCollapsed={leftCollapsed}
        collapsedSize={workspaceConfig.leftPane.collapsedSize}
        collapseThreshold={workspaceConfig.leftPane.collapseThreshold}
        direction="left"
        containerId="left-pane"
        onResize={handleLeftResize}
        className={styles.leftPanel}
        tabs={tabContainers.find((c) => c.id === "left-pane")?.tabs}
        activeTabId={
          tabContainers.find((c) => c.id === "left-pane")?.activeTabId
        }
        onTabSelect={handleTabSelect}
        onTabClose={handleTabClose}
        onTabMove={handleTabMove}
        onTabAdd={handleTabAdd}
        onAddView={addView}
        availableViews={getAvailableViews()}
      />

      {/* Center and Right */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "row",
          minWidth: 0,
          minHeight: 0,
        }}
      >
        {/* Center Area (Editor + Bottom) */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          <Pane
            title="Main Editor"
            size={{ height: 0 }}
            minSize={{ width: 0, height: 100 }}
            maxSize={{
              width: windowDimensions.width,
              height: windowDimensions.height,
            }}
            isCollapsed={false}
            collapsedSize={0}
            collapseThreshold={0}
            direction="main"
            containerId="main-pane"
            onResize={() => {}}
            className={styles.mainPanel}
            tabs={tabContainers.find((c) => c.id === "main-pane")?.tabs}
            activeTabId={
              tabContainers.find((c) => c.id === "main-pane")?.activeTabId
            }
            onTabSelect={handleTabSelect}
            onTabClose={handleTabClose}
            onTabMove={handleTabMove}
            onTabAdd={handleTabAdd}
            onAddView={addView}
            availableViews={getAvailableViews()}
            style={{ flex: 1, minHeight: 0, minWidth: 0 }}
          />

          <Pane
            title="Terminal"
            size={{ height: bottomHeight }}
            minSize={{ height: workspaceConfig.bottomPane.minSize }}
            maxSize={{ height: workspaceConfig.bottomPane.maxSize }}
            isCollapsed={bottomCollapsed}
            collapsedSize={workspaceConfig.bottomPane.collapsedSize}
            collapseThreshold={workspaceConfig.bottomPane.collapseThreshold}
            direction="bottom"
            containerId="bottom-pane"
            onResize={handleBottomResize}
            className={styles.bottomPanel}
            tabs={tabContainers.find((c) => c.id === "bottom-pane")?.tabs}
            activeTabId={
              tabContainers.find((c) => c.id === "bottom-pane")?.activeTabId
            }
            onTabSelect={handleTabSelect}
            onTabClose={handleTabClose}
            onTabMove={handleTabMove}
            onTabAdd={handleTabAdd}
            onAddView={addView}
            availableViews={getAvailableViews()}
            style={{ width: "100%" }}
          />
        </div>

        {/* Right Panel */}
        <Pane
          title="Outline"
          size={{ width: rightWidth, height: windowDimensions.height }}
          minSize={{ width: 0 }}
          maxSize={{ width: workspaceConfig.rightPane.maxSize }}
          isCollapsed={rightCollapsed}
          collapsedSize={workspaceConfig.rightPane.collapsedSize}
          collapseThreshold={workspaceConfig.rightPane.collapseThreshold}
          direction="right"
          containerId="right-pane"
          onResize={handleRightResize}
          className={styles.rightPanel}
          tabs={tabContainers.find((c) => c.id === "right-pane")?.tabs}
          activeTabId={
            tabContainers.find((c) => c.id === "right-pane")?.activeTabId
          }
          onTabSelect={handleTabSelect}
          onTabClose={handleTabClose}
          onTabMove={handleTabMove}
          onTabAdd={handleTabAdd}
          onAddView={addView}
          availableViews={getAvailableViews()}
        />
      </div>
    </div>
  );
};

export default Workspace;
