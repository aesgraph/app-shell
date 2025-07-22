import React, { useState, useCallback } from "react";

interface LayoutProviderProps {
  children: React.ReactNode;
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  const [savedLayout, setSavedLayout] = useState<LayoutState | null>(null);

  const saveLayout = useCallback((layout: LayoutState) => {
    setSavedLayout(layout);
    try {
      localStorage.setItem("layout-manager-state", JSON.stringify(layout));
    } catch (error) {
      console.warn("Failed to save layout to localStorage:", error);
    }
  }, []);

  const loadLayout = useCallback((): LayoutState | null => {
    if (savedLayout) {
      return savedLayout;
    }
    try {
      const stored = localStorage.getItem("layout-manager-state");
      if (stored) {
        const parsed = JSON.parse(stored) as LayoutState;
        setSavedLayout(parsed);
        return parsed;
      }
    } catch (error) {
      console.warn("Failed to load layout from localStorage:", error);
    }
    return null;
  }, [savedLayout]);

  const clearLayout = useCallback(() => {
    setSavedLayout(null);
    try {
      localStorage.removeItem("layout-manager-state");
    } catch (error) {
      console.warn("Failed to clear layout from localStorage:", error);
    }
  }, []);

  const contextValue: LayoutContextType = {
    saveLayout,
    loadLayout,
    clearLayout,
  };

  return (
    <LayoutContext.Provider value={contextValue}>
      {children}
    </LayoutContext.Provider>
  );
};
