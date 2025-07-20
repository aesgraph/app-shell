import React, { useEffect, useState, useRef, useCallback } from "react";
import type { ResizeDirection } from "re-resizable";
import Pane from "./Pane";
import { useWorkspace } from "../contexts/useWorkspace";
import WorkspaceConfigEditor from "./views/WorkspaceConfigEditor";
import WorkspaceManager from "./views/WorkspaceManager";
import styles from "../App.module.css";

interface WorkspaceProps {
  /** Whether to use full viewport (legacy behavior) or act as a contained component */
  fullViewport?: boolean;
  /** Custom style for the container */
  style?: React.CSSProperties;
  /** Custom className for the container */
  className?: string;
}

const Workspace: React.FC<WorkspaceProps> = ({ 
  fullViewport = false, 
  style = {}, 
  className = "" 
}) => {
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

  // Container ref for measuring dimensions
  const containerRef = useRef<HTMLDivElement>(null);

  // Track container dimensions for responsive sizing
  const [containerDimensions, setContainerDimensions] = useState({
    width: fullViewport ? window.innerWidth : 0,
    height: fullViewport ? window.innerHeight : 0,
  });

  // Get container dimensions
  const updateDimensions = useCallback(() => {
    if (fullViewport) {
      setContainerDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    } else if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setContainerDimensions({
        width: rect.width,
        height: rect.height,
      });
    }
  }, [fullViewport]);

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

  // Handle container resize
  useEffect(() => {
    // Initial measurement
    updateDimensions();

    if (fullViewport) {
      const handleResize = () => updateDimensions();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    } else {
      // For contained mode, use ResizeObserver to track container size changes
      const resizeObserver = new ResizeObserver(() => {
        updateDimensions();
      });
      
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [fullViewport, updateDimensions]);

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
      ref={containerRef}
      className={[
        styles.appShellContainer,
        styles[
          `theme${
            currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)
          }` as keyof typeof styles
        ],
        className,
      ].join(" ")}
      style={{
        display: "flex",
        height: fullViewport ? "100vh" : "100%",
        width: fullViewport ? "100vw" : "100%",
        overflow: "hidden",
        ...(fullViewport ? {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        } : {
          position: "relative",
          minHeight: "100%",
          minWidth: "100%",
        }),
        ...style,
      }}
    >
      {/* Left Panel */}
      <Pane
        title="Explorer"
        size={{ 
          width: leftCollapsed ? workspaceConfig.leftPane.collapsedSize : leftWidth, 
          height: containerDimensions.height 
        }}
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
              width: containerDimensions.width,
              height: containerDimensions.height,
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
            size={{ 
              height: bottomCollapsed ? workspaceConfig.bottomPane.collapsedSize : bottomHeight 
            }}
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
          size={{ 
            width: rightCollapsed ? workspaceConfig.rightPane.collapsedSize : rightWidth, 
            height: containerDimensions.height 
          }}
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
