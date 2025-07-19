import React, { useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import type { ViewDefinition } from "../types/ViewRegistry";
import styles from "../App.module.css";

interface ViewDropdownProps {
  views: ViewDefinition[];
  onSelectView: (view: ViewDefinition) => void;
  onClose: () => void;
  position: { x: number; y: number };
}

const ViewDropdown = ({
  views,
  onSelectView,
  onClose,
  position,
}: ViewDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleViewSelect = (view: ViewDefinition) => {
    onSelectView(view);
    onClose();
  };

  const viewsByCategory = views.reduce((acc, view) => {
    const category = view.category || "General";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(view);
    return acc;
  }, {} as Record<string, ViewDefinition[]>);

  const dropdownContent = (
    <div
      ref={dropdownRef}
      className={styles.viewDropdown}
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        zIndex: 9999,
      }}
    >
      <div className={styles.viewDropdownContent}>
        {Object.entries(viewsByCategory).map(([category, categoryViews]) => (
          <div key={category} className={styles.viewCategory}>
            <div className={styles.viewCategoryTitle}>{category}</div>
            {categoryViews.map((view) => (
              <div
                key={view.id}
                className={styles.viewOption}
                onClick={() => handleViewSelect(view)}
              >
                {view.icon && (
                  <span className={styles.viewIcon}>{view.icon}</span>
                )}
                <div className={styles.viewInfo}>
                  <div className={styles.viewTitle}>{view.title}</div>
                  {view.description && (
                    <div className={styles.viewDescription}>
                      {view.description}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  // Render the dropdown as a portal to avoid overflow clipping// Render the dropdown as a portal to avoid overflow clipping
  return createPortal(dropdownContent, document.body);
};

export default ViewDropdown;
