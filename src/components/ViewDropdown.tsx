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
  const [maxHeight, setMaxHeight] = useState(400);

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

  // Calculate available space and adjust position and max-height
  useEffect(() => {
    if (dropdownRef.current) {
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // Find the nearest positioned container (workspace container or body)
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
              right: viewportWidth,
              top: 0,
              bottom: viewportHeight,
            }
          : container.getBoundingClientRect();

      let newX = position.x;
      let newY = position.y;
      let newMaxHeight = 400;

      // Calculate available space above and below the button
      const spaceBelow = effectiveRect.bottom - buttonRect.bottom;
      const spaceAbove = buttonRect.top - effectiveRect.top;

      // Determine if we should show above or below the button
      const isBottomPane = containerId === "bottom-pane";
      const wouldGoOffBottom = dropdownRect.bottom > effectiveRect.bottom;
      const showAbove = isBottomPane || wouldGoOffBottom || spaceBelow < 200;

      if (showAbove) {
        // Position above the button
        newY = buttonRect.top - dropdownRect.height - 2;

        // Calculate max height for above positioning
        const availableHeightAbove = spaceAbove - 20; // 20px margin
        newMaxHeight = Math.min(400, Math.max(200, availableHeightAbove));

        // If dropdown goes off the top, adjust position
        if (newY < effectiveRect.top) {
          newY = effectiveRect.top + 20;
          // Recalculate max height for this position
          const availableHeightBelow = effectiveRect.bottom - newY - 20;
          newMaxHeight = Math.min(400, Math.max(200, availableHeightBelow));
        }
      } else {
        // Position below the button
        newY = buttonRect.bottom + 2;

        // Calculate max height for below positioning
        const availableHeightBelow = spaceBelow - 20; // 20px margin
        newMaxHeight = Math.min(400, Math.max(200, availableHeightBelow));

        // If dropdown goes off the bottom, adjust position
        if (dropdownRect.bottom > effectiveRect.bottom) {
          newY = effectiveRect.bottom - dropdownRect.height - 20;
          // Recalculate max height for this position
          const availableHeightAbove = newY - effectiveRect.top - 20;
          newMaxHeight = Math.min(400, Math.max(200, availableHeightAbove));
        }
      }

      // Check if dropdown goes off the right edge of container
      if (dropdownRect.right > effectiveRect.right) {
        newX = effectiveRect.right - dropdownRect.width - 20;
      }

      // Check if dropdown goes off the left edge of container
      if (dropdownRect.left < effectiveRect.left) {
        newX = effectiveRect.left + 20;
      }

      // Ensure dropdown doesn't go off the left edge of viewport
      if (newX < 20) {
        newX = 20;
      }

      // Ensure dropdown doesn't go off the right edge of viewport
      if (newX + dropdownRect.width > viewportWidth - 20) {
        newX = viewportWidth - dropdownRect.width - 20;
      }

      setAdjustedPosition({ x: newX, y: newY });
      setMaxHeight(newMaxHeight);
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
        maxHeight: `${maxHeight}px`,
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
