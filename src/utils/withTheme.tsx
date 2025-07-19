import React from "react";
import { useTheme } from "../contexts/useTheme";
import { Theme } from "../types/ThemeDefinition";
import { getThemeStyles } from "../utils/themeUtils";

interface WithThemeProps {
  theme: Theme;
  themeStyles: ReturnType<typeof getThemeStyles>;
}

/**
 * Higher-order component that provides theme and themeStyles props to wrapped component
 */
export function withTheme<P extends object>(
  WrappedComponent: React.ComponentType<P & WithThemeProps>
): React.ComponentType<P> {
  const WithThemeComponent = (props: P) => {
    const { theme } = useTheme();
    const themeStyles = getThemeStyles(theme);
    
    return (
      <WrappedComponent
        {...props}
        theme={theme}
        themeStyles={themeStyles}
      />
    );
  };
  
  WithThemeComponent.displayName = `withTheme(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return WithThemeComponent;
}
