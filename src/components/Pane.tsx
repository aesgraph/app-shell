import React from "react";
import { Resizable } from "re-resizable";
import type { ResizeDirection } from "re-resizable";
import TabContainer from "./TabContainer";
import type { TabData } from "./Tab";
import type { ViewDefinition } from "../types/ViewRegistry";
import styles from "../App.module.css";

interface PaneProps {
  title: string;
  size: { width?: number; height?: number };
  minSize: { width?: number; height?: number };
  maxSize: { width?: number; height?: number };
  isCollapsed: boolean;
  collapsedSize: number;
  collapseThreshold: number;
  direction: "left" | "right" | "bottom" | "main";
  containerId?: string; // Optional container ID override
  onResize: (
    event: MouseEvent | TouchEvent,
    direction: ResizeDirection,
    ref: HTMLElement
  ) => void;
  className?: string;
  style?: React.CSSProperties;
  tabs?: TabData[];
  activeTabId?: string;
  onTabSelect?: (containerId: string, tabId: string) => void;
  onTabClose?: (containerId: string, tabId: string) => void;
  onTabMove?: (
    fromContainerId: string,
    toContainerId: string,
    tabId: string
  ) => void;
  onTabAdd?: (containerId: string) => void;
  onAddView?: (containerId: string, view: ViewDefinition) => void;
  availableViews?: ViewDefinition[];
}

const Pane = ({
  title,
  size,
  minSize,
  maxSize,
  isCollapsed,
  collapsedSize,
  collapseThreshold,
  direction,
  containerId,
  onResize,
  className = "",
  style = {},
  tabs,
  activeTabId,
  onTabSelect,
  onTabClose,
  onTabMove,
  onTabAdd,
  onAddView,
  availableViews = [],
}: PaneProps) => {
  const getResizeConfig = () => {
    switch (direction) {
      case "left":
        return {
          enable: { right: true },
          handleClasses: { right: styles.resizableHandleVertical },
          collapsedClass: styles.leftCollapsedBar,
        };
      case "right":
        return {
          enable: { left: true },
          handleClasses: { left: styles.resizableHandleVertical },
          collapsedClass: styles.rightCollapsedBar,
        };
      case "bottom":
        return {
          enable: { top: true },
          handleClasses: { top: styles.resizableHandleHorizontal },
          collapsedClass: styles.bottomCollapsedBar,
        };
      case "main":
        return {
          enable: {},
          handleClasses: {},
          collapsedClass: "",
        };
    }
  };

  const config = getResizeConfig();

  if (isCollapsed) {
    return (
      <Resizable
        className={`${styles.collapsedBar} ${config.collapsedClass}`}
        size={
          direction === "bottom"
            ? { width: "100%", height: collapsedSize }
            : { width: collapsedSize, height: "100%" }
        }
        minWidth={direction !== "bottom" ? collapsedSize : undefined}
        minHeight={direction === "bottom" ? collapsedSize : undefined}
        maxWidth={direction !== "bottom" ? collapseThreshold * 2 : undefined}
        maxHeight={direction === "bottom" ? collapseThreshold * 2 : undefined}
        enable={config.enable}
        onResize={onResize}
        handleClasses={config.handleClasses}
        style={
          direction === "bottom"
            ? { position: "absolute", left: 0, right: 0, bottom: 0, ...style }
            : style
        }
      />
    );
  }

  return (
    <Resizable
      className={`${styles.appShellPanel} ${className}`}
      size={size}
      minWidth={minSize.width}
      minHeight={minSize.height}
      maxWidth={maxSize.width}
      maxHeight={maxSize.height}
      enable={config.enable}
      onResize={onResize}
      handleClasses={config.handleClasses}
      style={style}
    >
      {onTabSelect || onTabClose || onTabMove || onTabAdd || onAddView ? (
        <TabContainer
          id={containerId || `${direction}-pane`}
          tabs={tabs || []}
          activeTabId={activeTabId}
          onTabSelect={onTabSelect || (() => {})}
          onTabClose={onTabClose || (() => {})}
          onTabMove={onTabMove || (() => {})}
          onTabAdd={onTabAdd}
          onAddView={onAddView}
          availableViews={availableViews}
          style={{ height: "100%" }}
        />
      ) : (
        <div className={styles.panelTitle}>{title}</div>
      )}
    </Resizable>
  );
};

export default Pane;
