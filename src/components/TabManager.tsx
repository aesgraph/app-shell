import React, { useRef } from "react";
import styles from "./LayoutManager.module.css";
import { globalViewRegistry, ViewDefinition } from "../types/ViewRegistry";
import { useTheme } from "../contexts/useAppShell";
import ViewDropdown from "./ViewDropdown";

export interface Tab {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface TabManagerProps {
  tabs: Tab[];
  activeTabId: string;
  onTabSelect: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onTabDrop: (tabId: string, targetPanel: string, dropIndex?: number) => void;
  panelId: string;
  rightContent?: React.ReactNode;
}

// Dropdown for adding new tabs (declare outside component)
const AddTabDropdown: React.FC<{ panelId: string }> = ({ panelId }) => {
  const [open, setOpen] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const { theme } = useTheme();

  const handleAdd = (view: ViewDefinition) => {
    const event = new CustomEvent("add-tab", {
      detail: {
        viewId: view.id,
        panelId,
      },
    });
    document.dispatchEvent(event);
    setOpen(false);
  };

  const handleButtonClick = () => {
    setOpen((v) => !v);
  };

  const views = globalViewRegistry.getAllViews();

  return (
    <div style={{ position: "relative", marginLeft: 4 }}>
      <button
        ref={buttonRef}
        className={styles["aes-addTabButton"] || ""}
        style={{
          background: "transparent",
          border: "none",
          borderRadius: 4,
          width: 24,
          height: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          fontSize: 18,
          color: theme.colors.textSecondary,
          transition: "background-color 0.15s ease, color 0.15s ease",
          padding: 0,
        }}
        title="Add tab"
        onClick={handleButtonClick}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = theme.colors.surfaceHover;
          e.currentTarget.style.color = theme.colors.text;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.color = theme.colors.textSecondary;
        }}
      >
        +
      </button>
      {open && buttonRef.current && (
        <ViewDropdown
          views={views}
          onSelectView={handleAdd}
          onClose={() => setOpen(false)}
          position={{
            x: buttonRef.current.getBoundingClientRect().left,
            y: buttonRef.current.getBoundingClientRect().bottom,
          }}
          buttonRect={buttonRef.current.getBoundingClientRect()}
          containerId={panelId}
          theme={theme.id}
        />
      )}
    </div>
  );
};

export const TabManager: React.FC<TabManagerProps> = ({
  tabs,
  activeTabId,
  onTabSelect,
  onTabClose,
  onTabDrop,
  panelId,
  rightContent,
}) => {
  const dragTabId = useRef<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null);
  const [dropPosition, setDropPosition] = React.useState<number>(0);
  const { theme } = useTheme();

  const handleDragStart = (e: React.DragEvent, tabId: string) => {
    dragTabId.current = tabId;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", tabId);
    e.dataTransfer.setData("panel-id", panelId);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverIndex(null);
    const tabId = e.dataTransfer.getData("text/plain");
    if (tabId) {
      // Calculate drop index based on mouse position relative to tab elements
      const tabElements = e.currentTarget.querySelectorAll("[data-tab-index]");
      const mouseX = e.clientX;
      let dropIndex = tabs.length; // Default to end

      for (let i = 0; i < tabElements.length; i++) {
        const element = tabElements[i] as HTMLElement;
        const rect = element.getBoundingClientRect();
        if (mouseX < rect.left + rect.width / 2) {
          dropIndex = i;
          break;
        }
      }

      onTabDrop(tabId, panelId, dropIndex);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    // Calculate drop index for visual feedback
    const tabElements = e.currentTarget.querySelectorAll("[data-tab-index]");
    const mouseX = e.clientX;
    let dropIndex = tabs.length; // Default to end

    const containerRect = e.currentTarget.getBoundingClientRect();
    for (let i = 0; i < tabElements.length; i++) {
      const element = tabElements[i] as HTMLElement;
      const rect = element.getBoundingClientRect();
      const relativeLeft = rect.left - containerRect.left;
      if (mouseX < rect.left + rect.width / 2) {
        dropIndex = i;
        setDropPosition(relativeLeft);
        break;
      }
    }

    if (dropIndex === tabs.length && tabElements.length > 0) {
      const lastElement = tabElements[tabElements.length - 1] as HTMLElement;
      const rect = lastElement.getBoundingClientRect();
      const relativeLeft = rect.left - containerRect.left + rect.width;
      setDropPosition(relativeLeft);
    }
    setDragOverIndex(dropIndex);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  return (
    <div
      className={styles["aes-tabBar"]}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      data-panel-id={panelId}
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        backgroundColor: theme.colors.workspaceTitleBackground,
        borderBottom: `1px solid ${theme.colors.border}`,
        minHeight: "32px",
        position: "relative",
      }}
    >
      {/* Scrollable tabs section */}
      <div
        className={styles["aes-tabScrollContainer"]}
        style={{
          display: "flex",
          flex: 1,
          alignItems: "center",
          minWidth: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            minWidth: "fit-content",
            gap: "2px",
            position: "relative",
          }}
        >
          {tabs.map((tab, index) => (
            <React.Fragment key={tab.id}>
              <div
                className={
                  styles["aes-tab"] +
                  (tab.id === activeTabId ? " " + styles["aes-activeTab"] : "")
                }
                draggable
                data-tab-index={index}
                onDragStart={(e) => handleDragStart(e, tab.id)}
                onClick={() => onTabSelect(tab.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "4px 8px",
                  borderRadius: "4px 4px 0 0",
                  cursor: "pointer",
                  userSelect: "none",
                  backgroundColor:
                    tab.id === activeTabId
                      ? theme.colors.surface
                      : theme.colors.backgroundSecondary,
                  color:
                    tab.id === activeTabId
                      ? theme.colors.text
                      : theme.colors.textMuted,
                  border: `1px solid ${theme.colors.border}`,
                  borderBottom:
                    tab.id === activeTabId
                      ? `1px solid ${theme.colors.surface}`
                      : `1px solid ${theme.colors.border}`,
                  transition: "background-color 0.15s ease, color 0.15s ease",
                  position: "relative",
                  zIndex: tab.id === activeTabId ? 2 : 1,
                  whiteSpace: "nowrap",
                  flexShrink: 0, // Prevent tabs from shrinking
                }}
                onMouseEnter={(e) => {
                  if (tab.id !== activeTabId) {
                    e.currentTarget.style.backgroundColor =
                      theme.colors.surfaceHover;
                    e.currentTarget.style.color = theme.colors.text;
                  }
                }}
                onMouseLeave={(e) => {
                  if (tab.id !== activeTabId) {
                    e.currentTarget.style.backgroundColor =
                      theme.colors.backgroundSecondary;
                    e.currentTarget.style.color = theme.colors.textMuted;
                  }
                }}
              >
                <span
                  className={styles["aes-tabTitle"]}
                  style={{
                    fontSize: "13px",
                    fontWeight: tab.id === activeTabId ? 500 : 400,
                    marginRight: "6px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "120px",
                  }}
                >
                  {tab.title}
                </span>
                <button
                  className={styles["aes-closeTabButton"]}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTabClose(tab.id);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: theme.colors.textMuted,
                    cursor: "pointer",
                    fontSize: "16px",
                    padding: "0 2px",
                    borderRadius: "2px",
                    lineHeight: 1,
                    width: "16px",
                    height: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background-color 0.15s ease, color 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.error;
                    e.currentTarget.style.color = theme.colors.textInverse;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = theme.colors.textMuted;
                  }}
                >
                  ×
                </button>
              </div>
            </React.Fragment>
          ))}
          {/* Drop indicators */}
          {dragOverIndex !== null && (
            <div
              style={{
                position: "absolute",
                left: `${dropPosition}px`,
                top: "0",
                bottom: "0",
                width: "2px",
                backgroundColor: theme.colors.borderFocus,
                zIndex: 10,
                pointerEvents: "none",
              }}
              title={`Drop indicator at ${dropPosition}px for index ${dragOverIndex} in ${panelId}`}
            />
          )}
          <AddTabDropdown panelId={panelId} />
        </div>
      </div>

      {/* Fixed right content (always visible) */}
      {rightContent && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginLeft: "4px",
            paddingRight: "2px",
            flexShrink: 0, // Never shrink the action buttons
            borderLeft: `1px solid ${theme.colors.backgroundSecondary}`,
            paddingLeft: "8px",
          }}
        >
          {rightContent}
        </div>
      )}
    </div>
  );
};
