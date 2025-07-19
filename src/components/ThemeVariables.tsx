import React from "react";
import { useTheme } from "../contexts/useTheme";

/**
 * React component that provides theme styles as CSS variables to its children
 */
interface ThemeVariablesProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const ThemeVariables: React.FC<ThemeVariablesProps> = ({
  children,
  className,
  style: customStyle,
}) => {
  const { theme } = useTheme();

  // Generate CSS variables
  const cssVars: Record<string, string> = {};

  // Colors
  Object.entries(theme.colors).forEach(([key, value]) => {
    cssVars[`--app-shell-${key}`] = value;
  });

  // Spacing
  Object.entries(theme.sizes.spacing).forEach(([key, value]) => {
    cssVars[`--app-shell-spacing-${key}`] = value;
  });

  // Border radius
  Object.entries(theme.sizes.borderRadius).forEach(([key, value]) => {
    cssVars[`--app-shell-border-radius-${key}`] = value;
  });

  // Font sizes
  Object.entries(theme.sizes.fontSize).forEach(([key, value]) => {
    cssVars[`--app-shell-font-size-${key}`] = value;
  });

  // Shadows
  Object.entries(theme.sizes.shadow).forEach(([key, value]) => {
    cssVars[`--app-shell-shadow-${key}`] = value;
  });

  const style: React.CSSProperties = {
    ...(cssVars as React.CSSProperties),
    ...customStyle,
  };

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
};
