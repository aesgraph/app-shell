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

  // Adjust position based on actual dropdown size and container constraints
  useEffect(() => {
    if (dropdownRef.current) {
      const dropdownRect = dropdownRef.current.getBoundingClientRect();

      // Find the nearest positioned container (appShellContainer)
      let container = dropdownRef.current.parentElement;
      while (
        container &&
        window.getComputedStyle(container).position === "static"
      ) {
        container = container.parentElement;
      }

      // Fall back to document.body if no positioned container found
      if (!container) container = document.body;

      const containerRect = container.getBoundingClientRect();

      let newX = position.x;
      let newY = position.y;

      // Check if dropdown goes off the right edge of container
      if (dropdownRect.right > containerRect.right) {
        newX = containerRect.right - dropdownRect.width - 20;
      }

      // Check if dropdown goes off the left edge of container
      if (dropdownRect.left < containerRect.left) {
        newX = containerRect.left + 20;
      }

      // For bottom pane or if dropdown goes off bottom edge of container, show above button
      const isBottomPane = containerId === "bottom-pane";
      const wouldGoOffBottom = dropdownRect.bottom > containerRect.bottom;

      if (isBottomPane || wouldGoOffBottom) {
        newY = buttonRect.top - dropdownRect.height - 2;
      }

      // Check if dropdown goes off the top edge of container
      if (newY < containerRect.top) {
        newY = containerRect.top + 20;
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
