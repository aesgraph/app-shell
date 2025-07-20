import React, { useState } from "react";
import Tab from "./Tab";
import type { TabData } from "./Tab";
import type { ViewDefinition } from "../types/ViewRegistry";
import ViewDropdown from "./ViewDropdown";
import { useWorkspace } from "../contexts/useWorkspace";
import styles from "../App.module.css";

interface TabContainerProps {
  id: string;
  tabs: TabData[];
  activeTabId?: string;
  onTabSelect: (containerId: string, tabId: string) => void;
  onTabClose: (containerId: string, tabId: string) => void;
  onTabMove: (
    fromContainerId: string,
    toContainerId: string,
    tabId: string
  ) => void;
  onTabAdd?: (containerId: string) => void;
  onAddView?: (containerId: string, view: ViewDefinition) => void;
  availableViews?: ViewDefinition[];
  className?: string;
  style?: React.CSSProperties;
}

type DropZone = "before" | "after" | "center" | null;

const TabContainer = ({
  id,
  tabs,
  activeTabId,
  onTabSelect,
  onTabClose,
  onTabMove,
  onTabAdd,
  onAddView,
  availableViews = [],
  className = "",
  style = {},
}: TabContainerProps) => {
  const { currentTheme } = useWorkspace();
  const [dragOver, setDragOver] = useState(false);
  const [dropZone, setDropZone] = useState<DropZone>(null);
  const [dragOverTabId, setDragOverTabId] = useState<string | null>(null);
  const [showViewDropdown, setShowViewDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);

  const handleDragStart = (e: React.DragEvent, tabId: string) => {
    e.dataTransfer.setData(
      "application/tab",
      JSON.stringify({ containerId: id, tabId })
    );
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOver(true);

    // Determine drop zone based on mouse position
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // If dragging over tab bar area
    if (y < 40) {
      // Approximate tab bar height
      const tabElements = e.currentTarget.querySelectorAll(`.${styles.tab}`);
      let foundZone = false;

      if (tabElements.length > 0) {
        tabElements.forEach((tabElement, index) => {
          const tabRect = tabElement.getBoundingClientRect();
          const tabLeft = tabRect.left - rect.left;
          const tabRight = tabRect.right - rect.left;

          if (x >= tabLeft && x <= tabRight) {
            const tabId = tabs[index]?.id;
            if (tabId) {
              setDragOverTabId(tabId);

              // Determine if dropping before, after, or on the tab
              const tabWidth = tabRight - tabLeft;
              const relativeX = x - tabLeft;

              if (relativeX < tabWidth * 0.3) {
                setDropZone("before");
              } else if (relativeX > tabWidth * 0.7) {
                setDropZone("after");
              } else {
                setDropZone("center");
              }
              foundZone = true;
            }
          }
        });
      }

      // If no tabs or not over any tab, default to "after" in tab bar
      if (!foundZone) {
        setDropZone("after");
        setDragOverTabId(null);
      }
    } else {
      setDropZone("center");
      setDragOverTabId(null);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    setDropZone(null);
    setDragOverTabId(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    setDropZone(null);
    setDragOverTabId(null);

    try {
      const data = JSON.parse(e.dataTransfer.getData("application/tab"));
      if (data.containerId !== id && data.tabId) {
        onTabMove(data.containerId, id, data.tabId);
      }
    } catch (error) {
      console.error("Failed to parse tab data:", error);
    }
  };

  const handleAddButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (availableViews.length > 0 && onAddView) {
      // Get the button element's bounding rectangle for accurate positioning
      const buttonRect = (
        e.currentTarget as HTMLElement
      ).getBoundingClientRect();

      // Find the nearest positioned container (appShellContainer)
      let container = (e.currentTarget as HTMLElement).parentElement;
      while (container && window.getComputedStyle(container).position === 'static') {
        container = container.parentElement;
      }
      
      // Fall back to document.body if no positioned container found
      if (!container) container = document.body;
      const containerRect = container.getBoundingClientRect();

      let x = buttonRect.left;
      let y = buttonRect.bottom + 2; // Default: show below the button

      const dropdownHeight = 400; // Approximate dropdown height
      const dropdownWidth = 300; // Approximate dropdown width

      // Adjust horizontal position if dropdown would go off the right edge of container
      if (x + dropdownWidth > containerRect.right) {
        x = containerRect.right - dropdownWidth - 20; // 20px margin
      }

      // Check if this is the bottom pane or if dropdown would go off the bottom edge of container
      const isBottomPane = id === "bottom-pane";
      const wouldGoOffBottom = y + dropdownHeight > containerRect.bottom;

      if (isBottomPane || wouldGoOffBottom) {
        // Show dropdown above the button
        y = buttonRect.top - dropdownHeight - 2;
      }

      setButtonRect(buttonRect);
      setDropdownPosition({ x, y });
      setShowViewDropdown(true);
    } else if (onTabAdd) {
      onTabAdd(id);
    }
  };

  const handleViewSelect = (view: ViewDefinition) => {
    if (onAddView) {
      onAddView(id, view);
    }
  };

  const activeTab = tabs.find((tab) => tab.id === activeTabId) || tabs[0];

  return (
    <div
      className={`${styles.tabContainer} ${className} ${
        dragOver ? styles.tabContainerDragOver : ""
      }`}
      style={style}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className={styles.tabBar}>
        {tabs.map((tab) => (
          <React.Fragment key={tab.id}>
            {/* Drop indicator before tab */}
            {dragOver && dragOverTabId === tab.id && dropZone === "before" && (
              <div className={styles.tabDropIndicator} />
            )}

            <Tab
              tab={tab}
              isActive={tab.id === activeTabId}
              onSelect={(tabId) => onTabSelect(id, tabId)}
              onClose={(tabId) => onTabClose(id, tabId)}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              isDragOver={
                dragOver && dragOverTabId === tab.id && dropZone === "center"
              }
            />

            {/* Drop indicator after tab */}
            {dragOver && dragOverTabId === tab.id && dropZone === "after" && (
              <div className={styles.tabDropIndicator} />
            )}
          </React.Fragment>
        ))}

        {/* Drop indicator at the end */}
        {dragOver && !dragOverTabId && dropZone === "after" && (
          <div className={styles.tabDropIndicator} />
        )}

        {/* Empty tab bar drop indicator */}
        {dragOver && tabs.length === 0 && dropZone === "after" && (
          <div className={styles.emptyTabBarDropIndicator}>Drop tab here</div>
        )}

        {(onTabAdd || (availableViews.length > 0 && onAddView)) && (
          <button
            className={styles.tabAddButton}
            onClick={handleAddButtonClick}
            title="Add new tab or view"
          >
            +
          </button>
        )}
      </div>

      {/* Center drop zone indicator */}
      {dragOver && dropZone === "center" && !dragOverTabId && (
        <div className={styles.centerDropZone}>
          <div className={styles.centerDropIndicator}>Drop tab here</div>
        </div>
      )}

      <div className={styles.tabContent}>
        {activeTab ? (
          activeTab.content
        ) : (
          <div className={styles.tabEmpty}>
            <p>No tabs available</p>
            {onTabAdd && <button onClick={() => onTabAdd(id)}>Add Tab</button>}
          </div>
        )}
      </div>

      {showViewDropdown && buttonRect && (
        <ViewDropdown
          views={availableViews}
          onSelectView={handleViewSelect}
          onClose={() => setShowViewDropdown(false)}
          position={dropdownPosition}
          buttonRect={buttonRect}
          containerId={id}
          theme={currentTheme}
        />
      )}
    </div>
  );
};

export default TabContainer;
