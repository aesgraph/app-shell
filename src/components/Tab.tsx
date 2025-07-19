import React from "react";
import type { ReactNode } from "react";
import styles from "../App.module.css";

export interface TabData {
  id: string;
  title: string;
  content: ReactNode;
  type?: string;
  closable?: boolean;
}

interface TabProps {
  tab: TabData;
  isActive: boolean;
  onSelect: (tabId: string) => void;
  onClose?: (tabId: string) => void;
  onDragStart: (e: React.DragEvent, tabId: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
  isDragOver?: boolean;
}

const Tab = ({
  tab,
  isActive,
  onSelect,
  onClose,
  onDragStart,
  onDragEnd,
  isDragOver = false,
}: TabProps) => {
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose?.(tab.id);
  };

  return (
    <div
      className={`${styles.tab} ${isActive ? styles.tabActive : ""} ${
        isDragOver ? styles.tabDragOver : ""
      }`}
      onClick={() => onSelect(tab.id)}
      draggable
      onDragStart={(e) => onDragStart(e, tab.id)}
      onDragEnd={onDragEnd}
    >
      <span className={styles.tabTitle}>{tab.title}</span>
      {tab.closable !== false && (
        <button
          className={styles.tabCloseButton}
          onClick={handleClose}
          title="Close tab"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Tab;
