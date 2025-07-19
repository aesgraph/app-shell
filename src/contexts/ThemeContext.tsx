import React, { createContext, ReactNode } from "react";
import { Theme } from "../types/ThemeDefinition";
import { themes, defaultTheme } from "../themes/themes";

interface ThemeContextValue {
  theme: Theme;
  themeId: string;
  setTheme: (themeId: string) => void;
  themes: Record<string, Theme>;
}

export type { ThemeContextValue };

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export { ThemeContext };

interface ThemeProviderProps {
  children: ReactNode;
  themeId?: string;
  onThemeChange?: (themeId: string) => void;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  themeId = "dark",
  onThemeChange,
}) => {
  const [currentThemeId, setCurrentThemeId] = React.useState(themeId);
  
  const setTheme = React.useCallback((newThemeId: string) => {
    if (themes[newThemeId]) {
      setCurrentThemeId(newThemeId);
      onThemeChange?.(newThemeId);
    }
  }, [onThemeChange]);
  
  const theme = themes[currentThemeId] || defaultTheme;
  
  const value: ThemeContextValue = {
    theme,
    themeId: currentThemeId,
    setTheme,
    themes,
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
