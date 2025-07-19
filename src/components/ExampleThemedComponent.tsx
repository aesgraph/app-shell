import React from "react";
import { useTheme } from "../contexts/useTheme";
import { getColor } from "../utils/themeUtils";

/**
 * Example themed component that demonstrates how external projects
 * can create components that inherit the app-shell theme
 */
interface ExampleThemedComponentProps {
  title: string;
  content: string;
  variant?: "primary" | "secondary" | "card";
  className?: string;
  style?: React.CSSProperties;
}

export const ExampleThemedComponent: React.FC<ExampleThemedComponentProps> = ({
  title,
  content,
  variant = "card",
  className,
  style: customStyle,
}) => {
  const { theme } = useTheme();

  // Define styles based on theme and variant
  const getVariantStyles = (): React.CSSProperties => {
    const { colors, sizes } = theme;

    switch (variant) {
      case "primary":
        return {
          backgroundColor: colors.primary,
          color: colors.textInverse,
          border: `1px solid ${colors.primary}`,
          borderRadius: sizes.borderRadius.md,
          padding: sizes.spacing.lg,
          boxShadow: sizes.shadow.md,
        };

      case "secondary":
        return {
          backgroundColor: colors.backgroundSecondary,
          color: colors.text,
          border: `1px solid ${colors.border}`,
          borderRadius: sizes.borderRadius.md,
          padding: sizes.spacing.lg,
          boxShadow: sizes.shadow.sm,
        };

      case "card":
      default:
        return {
          backgroundColor: colors.surface,
          color: colors.text,
          border: `1px solid ${colors.border}`,
          borderRadius: sizes.borderRadius.lg,
          padding: sizes.spacing.xl,
          boxShadow: sizes.shadow.md,
        };
    }
  };

  const titleStyles: React.CSSProperties = {
    fontSize: theme.sizes.fontSize.lg,
    fontWeight: "bold",
    marginBottom: theme.sizes.spacing.md,
    color: getColor(theme.colors, "text"),
  };

  const contentStyles: React.CSSProperties = {
    fontSize: theme.sizes.fontSize.md,
    lineHeight: "1.5",
    color: getColor(theme.colors, "textSecondary"),
  };

  const combinedStyles: React.CSSProperties = {
    ...getVariantStyles(),
    ...customStyle,
  };

  return (
    <div className={className} style={combinedStyles}>
      <h3 style={titleStyles}>{title}</h3>
      <p style={contentStyles}>{content}</p>
    </div>
  );
};
