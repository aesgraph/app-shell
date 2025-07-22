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

      // Find the nearest positioned container (workspace container or body)
      // Look specifically for our workspace container first
      let container = document.querySelector(
        ".aes-workspaceContainer"
      ) as HTMLElement;

      // If no workspace container found, find the nearest positioned ancestor
      if (!container) {
        let parent = dropdownRef.current.parentElement;
        while (
          parent &&
          parent !== document.body &&
          window.getComputedStyle(parent).position === "static"
        ) {
          parent = parent.parentElement;
        }
        container = parent || document.body;
      }

      // Use viewport dimensions for document.body to avoid issues
      const effectiveRect =
        container === document.body
          ? {
              left: 0,
              right: window.innerWidth,
              top: 0,
              bottom: window.innerHeight,
            }
          : container.getBoundingClientRect();

      let newX = position.x;
      let newY = position.y;

      // Check if dropdown goes off the right edge of container
      if (dropdownRect.right > effectiveRect.right) {
        newX = effectiveRect.right - dropdownRect.width - 20;
      }

      // Check if dropdown goes off the left edge of container
      if (dropdownRect.left < effectiveRect.left) {
        newX = effectiveRect.left + 20;
      }

      // For bottom pane or if dropdown goes off bottom edge of container, show above button
      const isBottomPane = containerId === "bottom-pane";
      const wouldGoOffBottom = dropdownRect.bottom > effectiveRect.bottom;

      if (isBottomPane || wouldGoOffBottom) {
        newY = buttonRect.top - dropdownRect.height - 2;
      }

      // Check if dropdown goes off the top edge of container
      if (newY < effectiveRect.top) {
        newY = effectiveRect.top + 20;
      }

      setAdjustedPosition({ x: newX, y: newY });
    }
  }, [position, buttonRect, containerId]);

  const handleViewSelect = (view: ViewDefinition) => {
    onSelectView(view);
    onClose();
  };

  const viewsByCategory = views.reduce(
    (acc, view) => {
      const category = view.category || "General";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(view);
      return acc;
    },
    {} as Record<string, ViewDefinition[]>
  );

  const dropdownContent = (
    <div
      ref={dropdownRef}
      className={`${styles["aes-viewDropdown"]} ${
        styles[`aes-theme${theme.charAt(0).toUpperCase() + theme.slice(1)}`] ||
        styles[`theme${theme.charAt(0).toUpperCase() + theme.slice(1)}`] ||
        ""
      }`}
      style={{
        position: "fixed",
        left: adjustedPosition.x,
        top: adjustedPosition.y,
        zIndex: 9999,
      }}
    >
      <div className={styles["aes-viewDropdownContent"]}>
        {Object.entries(viewsByCategory).map(([category, categoryViews]) => (
          <div key={category} className={styles["aes-viewCategory"]}>
            <div className={styles["aes-viewCategoryTitle"]}>{category}</div>
            {categoryViews.map((view) => (
              <div
                key={view.id}
                className={styles["aes-viewOption"]}
                onClick={() => handleViewSelect(view)}
              >
                {view.icon && (
                  <span className={styles["aes-viewIcon"]}>{view.icon}</span>
                )}
                <div className={styles["aes-viewInfo"]}>
                  <div className={styles["aes-viewTitle"]}>{view.title}</div>
                  {view.description && (
                    <div className={styles["aes-viewDescription"]}>
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

  // Render the dropdown as a portal to avoid overflow clipping
  // Use document.body for consistent absolute positioning
  return createPortal(dropdownContent, document.body);
};

export default ViewDropdown;
