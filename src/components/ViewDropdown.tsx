import React, { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAppShell } from "../contexts/useAppShell";
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
  const { log } = useAppShell();

  log(
    "ViewDropdown: Rendering with views:",
    views.map((v) => ({ id: v.id, title: v.title, category: v.category }))
  );

  // Check if our specific views are in the list
  const devToolsInList = views.find((v) => v.id === "dev-tools");
  const testViewInList = views.find((v) => v.id === "test-view");
  log("ViewDropdown: dev-tools in list:", !!devToolsInList);
  log("ViewDropdown: test-view in list:", !!testViewInList);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const selectedItemRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);
  const [maxHeight, setMaxHeight] = useState(400);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

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

  // Auto-select first item when dropdown opens and focus the search input
  useEffect(() => {
    setSelectedIndex(0); // Start with first item selected
    // Focus the search input after a short delay to ensure it's rendered
    const timer = setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
        searchInputRef.current.select(); // Select all text for easy replacement
      }
    }, 10);
    return () => clearTimeout(timer);
  }, []);

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      // Move to the next item in the list
      const newIndex = Math.min(selectedIndex + 1, flatFilteredViews.length - 1);
      setSelectedIndex(newIndex);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      // Move to previous item, wrap to last item if at first item
      const newIndex = selectedIndex > 0 ? selectedIndex - 1 : flatFilteredViews.length - 1;
      setSelectedIndex(newIndex);
    } else if (e.key === "Enter") {
      e.preventDefault();
      // Select the currently highlighted item
      if (selectedIndex >= 0 && flatFilteredViews[selectedIndex]) {
        handleViewSelect(flatFilteredViews[selectedIndex]);
      } else if (flatFilteredViews.length > 0) {
        handleViewSelect(flatFilteredViews[0]);
      }
    }
  };

  const handleDropdownKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // This handler is mainly for cases where the dropdown has focus
    // Most navigation should happen through the search input
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && flatFilteredViews[selectedIndex]) {
        handleViewSelect(flatFilteredViews[selectedIndex]);
      }
    } else if (e.key.length === 1 || e.key === "Backspace") {
      // If user types while dropdown has focus, redirect to search input
      searchInputRef.current?.focus();
    }
  };

  // Filter views based on search term
  const filteredViews = views.filter((view) => {
    if (!searchTerm.trim()) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      view.title.toLowerCase().includes(searchLower) ||
      view.description?.toLowerCase().includes(searchLower) ||
      view.category?.toLowerCase().includes(searchLower) ||
      view.id.toLowerCase().includes(searchLower)
    );
  });

  const viewsByCategory = filteredViews.reduce(
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

  // Create a flat list that matches the rendered structure
  const flatFilteredViews: ViewDefinition[] = [];
  Object.entries(viewsByCategory).forEach(([, categoryViews]) => {
    categoryViews.forEach((view) => {
      flatFilteredViews.push(view);
    });
  });

  // Auto-select first item when filtered views change
  useEffect(() => {
    if (flatFilteredViews.length > 0) {
      setSelectedIndex(0); // Auto-select first item when search results change
    } else {
      setSelectedIndex(-1); // No items to select
    }
  }, [flatFilteredViews.length, searchTerm]);

  // Auto-scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    }
  }, [selectedIndex]);

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
      onKeyDown={handleDropdownKeyDown}
      tabIndex={-1}
    >
      <div className={styles["aes-viewDropdownContent"]}>
        {/* Search Bar */}
        <div className={styles["aes-viewSearchContainer"]}>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search views..."
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            className={styles["aes-viewSearchInput"]}
            autoFocus
            onFocus={(e) => e.target.select()}
          />
        </div>

        {/* Views List */}
        {Object.entries(viewsByCategory).map(([category, categoryViews]) => (
          <div key={category} className={styles["aes-viewCategory"]}>
            <div className={styles["aes-viewCategoryTitle"]}>{category}</div>
            {categoryViews.map((view) => {
              const globalIndex = flatFilteredViews.findIndex(
                (v) => v.id === view.id
              );
              const isSelected =
                globalIndex === selectedIndex && selectedIndex >= 0;

              return (
                <div
                  key={view.id}
                  ref={isSelected ? selectedItemRef : null}
                  className={`${styles["aes-viewOption"]} ${
                    isSelected ? styles["aes-viewOptionSelected"] : ""
                  }`}
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
              );
            })}
          </div>
        ))}

        {/* No results message */}
        {searchTerm.trim() && Object.keys(viewsByCategory).length === 0 && (
          <div className={styles["aes-viewNoResults"]}>
            No views found matching "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );

  // Render the dropdown as a portal to avoid overflow clipping
  // Use document.body for consistent absolute positioning
  return createPortal(dropdownContent, document.body);
};

export default ViewDropdown;
