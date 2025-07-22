import React, { useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./LayoutManager.module.css";
import { globalViewRegistry } from "../types/ViewRegistry";
import { useTheme } from "../contexts/useTheme";

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
  onTabDrop: (tabId: string, targetPanel: string) => void;
  panelId: string;
  rightContent?: React.ReactNode;
}

// Dropdown for adding new tabs (declare outside component)

const AddTabDropdown: React.FC<{ panelId: string }> = ({ panelId }) => {
  const [open, setOpen] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const { theme } = useTheme();

  React.useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const handleAdd = (viewId: string) => {
    console.log(
      "TabManager: Attempting to add view:",
      viewId,
      "to panel:",
      panelId
    );
    const event = new CustomEvent("add-tab", {
      detail: { panelId, viewId },
      bubbles: true,
    });
    console.log("TabManager: Dispatching event:", event);
    document.dispatchEvent(event);
    setOpen(false);
  };

  // For portal positioning
  const [menuPos, setMenuPos] = React.useState<{
    top: number;
    left: number;
  } | null>(null);

  const handleButtonClick = () => {
    console.log("Add button clicked, current open state:", open);
    setOpen((v) => {
      if (!v && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setMenuPos({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
        });
      }
      const newState = !v;
      console.log("Setting open state to:", newState);
      return newState;
    });
  };

  return (
    <div style={{ position: "relative", marginLeft: 4 }}>
      <button
        ref={buttonRef}
        className={styles.addTabButton || ""}
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
      {open &&
        menuPos &&
        createPortal(
          <div
            style={{
              position: "absolute",
              top: menuPos.top,
              left: menuPos.left,
              background: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: 4,
              boxShadow: theme.sizes.shadow.lg,
              zIndex: 10000,
              minWidth: 120,
              pointerEvents: "auto",
              color: theme.colors.text,
            }}
            onMouseDown={(e) => {
              console.log("Dropdown container mouse down");
              e.stopPropagation();
            }}
          >
            {(() => {
              const views = globalViewRegistry.getAllViews();
              console.log("Available views in dropdown:", views);
              return views.map((view) => (
                <div
                  key={view.id}
                  style={{
                    padding: "8px 12px",
                    cursor: "pointer",
                    color: theme.colors.text,
                    fontSize: 14,
                    borderBottom: `1px solid ${theme.colors.border}`,
                    backgroundColor: theme.colors.surface,
                    userSelect: "none",
                    pointerEvents: "auto",
                    transition: "background-color 0.15s ease",
                  }}
                  onMouseDown={(e) => {
                    console.log("Mouse down on dropdown item:", view.id);
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onMouseUp={(e) => {
                    console.log("Mouse up on dropdown item:", view.id);
                    e.preventDefault();
                    e.stopPropagation();
                    handleAdd(view.id);
                  }}
                  onMouseEnter={(e) => {
                    console.log("Mouse enter:", view.id);
                    e.currentTarget.style.backgroundColor =
                      theme.colors.surfaceHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      theme.colors.surface;
                  }}
                >
                  {view.title}
                </div>
              ));
            })()}
          </div>,
          document.body
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
  const { theme } = useTheme();

  const handleDragStart = (e: React.DragEvent, tabId: string) => {
    dragTabId.current = tabId;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", tabId);
    e.dataTransfer.setData("panel-id", panelId);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const tabId = e.dataTransfer.getData("text/plain");
    const fromPanel = e.dataTransfer.getData("panel-id");
    if (tabId && fromPanel !== panelId) {
      onTabDrop(tabId, panelId);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  return (
    <div
      className={styles.tabBar}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      data-panel-id={panelId}
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        backgroundColor: theme.colors.workspaceTitleBackground,
        borderBottom: `1px solid ${theme.colors.border}`,
        padding: "4px 8px",
        minHeight: "32px",
      }}
    >
      <div
        style={{ display: "flex", flex: 1, alignItems: "center", minWidth: 0 }}
      >
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={
              styles.tab +
              (tab.id === activeTabId ? " " + styles.activeTab : "")
            }
            draggable
            onDragStart={(e) => handleDragStart(e, tab.id)}
            onClick={() => onTabSelect(tab.id)}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "4px 8px",
              marginRight: "2px",
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
              className={styles.tabTitle}
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
              className={styles.closeTabButton}
              onClick={(e) => {
                e.stopPropagation();
                onTabClose(tab.id);
              }}
              style={{
                background: "none",
                border: "none",
                color: "inherit",
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
                transition: "background-color 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.error;
                e.currentTarget.style.color = theme.colors.textInverse;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "inherit";
              }}
            >
              ×
            </button>
          </div>
        ))}
        <AddTabDropdown panelId={panelId} />
      </div>
      {rightContent && (
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            paddingRight: "8px",
            marginRight: "4px",
          }}
        >
          {rightContent}
        </div>
      )}
    </div>
  );
};
