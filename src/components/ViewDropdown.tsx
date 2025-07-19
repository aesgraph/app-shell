import React, { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { ViewDefinition } from "../types/ViewRegistry";
import styles from "../App.module.css";

interface ViewDropdownProps {
  views: ViewDefinition[];
  onSelectView: (view: ViewDefinition) => void;
  onClose: () => void;
  position: { x: number; y: number };
  buttonRect: DOMRect;
  containerId: string;
  theme: string;
}

const ViewDropdown = ({
  views,
  onSelectView,
  onClose,
  position,
  buttonRect,
  containerId,
  theme,
}: ViewDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);

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

  // Adjust position based on actual dropdown size and viewport constraints
  useEffect(() => {
    if (dropdownRef.current) {
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let newX = position.x;
      let newY = position.y;

      // Check if dropdown goes off the right edge
      if (dropdownRect.right > viewportWidth) {
        newX = viewportWidth - dropdownRect.width - 20;
      }

      // Check if dropdown goes off the left edge
      if (dropdownRect.left < 0) {
        newX = 20;
      }

      // For bottom pane or if dropdown goes off bottom edge, show above button
      const isBottomPane = containerId === "bottom-pane";
      const wouldGoOffBottom = dropdownRect.bottom > viewportHeight;

      if (isBottomPane || wouldGoOffBottom) {
        newY = buttonRect.top - dropdownRect.height - 2;
      }

      // Check if dropdown goes off the top edge
      if (newY < 0) {
        newY = 20;
      }

      setAdjustedPosition({ x: newX, y: newY });
    }
  }, [position, buttonRect, containerId]);

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
      className={`${styles.viewDropdown} ${
        styles[`theme${theme.charAt(0).toUpperCase() + theme.slice(1)}`]
      }`}
      style={{
        position: "fixed",
        left: adjustedPosition.x,
        top: adjustedPosition.y,
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
