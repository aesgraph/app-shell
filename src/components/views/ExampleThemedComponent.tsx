import React from "react";
import { useTheme } from "../../contexts/useTheme";

/**
 * Example themed component that demonstrates how external projects
 * can create components that inherit the app-shell theme
 */
interface ExampleThemedComponentProps {
  title: string;
  content: string;
  className?: string;
  style?: React.CSSProperties;
}

export const ExampleThemedComponent: React.FC<ExampleThemedComponentProps> = ({
  title,
  content,
  className,
  style: customStyle,
}) => {
  const { theme } = useTheme();

  const containerStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    padding: theme.sizes.spacing.xl,
    borderRadius: theme.sizes.borderRadius.lg,
    border: `1px solid ${theme.colors.border}`,
    fontFamily: "system-ui, -apple-system, sans-serif",
    ...customStyle,
  };

  const sectionStyle: React.CSSProperties = {
    marginBottom: theme.sizes.spacing.xl,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: theme.sizes.fontSize.xl,
    fontWeight: "bold",
    marginBottom: theme.sizes.spacing.lg,
    color: theme.colors.text,
    borderBottom: `2px solid ${theme.colors.primary}`,
    paddingBottom: theme.sizes.spacing.sm,
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: theme.sizes.fontSize.lg,
    fontWeight: "600",
    marginBottom: theme.sizes.spacing.md,
    color: theme.colors.textSecondary,
  };

  const colorGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: theme.sizes.spacing.md,
    marginBottom: theme.sizes.spacing.lg,
  };

  const colorCardStyle: React.CSSProperties = {
    padding: theme.sizes.spacing.md,
    borderRadius: theme.sizes.borderRadius.md,
    border: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.backgroundSecondary,
  };

  const colorSwatchStyle = (color: string): React.CSSProperties => ({
    width: "100%",
    height: "40px",
    backgroundColor: color,
    borderRadius: theme.sizes.borderRadius.sm,
    border: `1px solid ${theme.colors.border}`,
    marginBottom: theme.sizes.spacing.sm,
  });

  const typographyExampleStyle = (fontSize: string): React.CSSProperties => ({
    fontSize: fontSize,
    marginBottom: theme.sizes.spacing.sm,
    color: theme.colors.text,
  });

  const spacingExampleStyle = (spacing: string): React.CSSProperties => ({
    backgroundColor: theme.colors.primary,
    height: "20px",
    width: spacing,
    marginBottom: theme.sizes.spacing.sm,
    borderRadius: theme.sizes.borderRadius.sm,
  });

  const shadowExampleStyle = (shadow: string): React.CSSProperties => ({
    backgroundColor: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.sizes.borderRadius.md,
    padding: theme.sizes.spacing.md,
    boxShadow: shadow,
    marginBottom: theme.sizes.spacing.md,
  });

  return (
    <div className={className} style={containerStyle}>
      <h2 style={titleStyle}>{title}</h2>
      <p
        style={{
          marginBottom: theme.sizes.spacing.xl,
          color: theme.colors.textSecondary,
        }}
      >
        {content}
      </p>

      {/* Colors Section */}
      <div style={sectionStyle}>
        <h3 style={subtitleStyle}>Colors</h3>
        <div style={colorGridStyle}>
          {Object.entries(theme.colors).map(([name, color]) => (
            <div key={name} style={colorCardStyle}>
              <div style={colorSwatchStyle(color)}></div>
              <div
                style={{
                  fontSize: theme.sizes.fontSize.sm,
                  fontWeight: "600",
                  marginBottom: "4px",
                }}
              >
                {name
                  .replace(/([A-Z])/g, " $1")
                  .toLowerCase()
                  .replace(/^\w/, (c) => c.toUpperCase())}
              </div>
              <div
                style={{
                  fontSize: theme.sizes.fontSize.xs,
                  color: theme.colors.textMuted,
                  fontFamily: "monospace",
                }}
              >
                {color}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography Section */}
      <div style={sectionStyle}>
        <h3 style={subtitleStyle}>Typography</h3>
        {Object.entries(theme.sizes.fontSize).map(([name, size]) => (
          <div key={name} style={typographyExampleStyle(size)}>
            {name.toUpperCase()}: The quick brown fox jumps over the lazy dog (
            {size})
          </div>
        ))}
      </div>

      {/* Spacing Section */}
      <div style={sectionStyle}>
        <h3 style={subtitleStyle}>Spacing</h3>
        {Object.entries(theme.sizes.spacing).map(([name, spacing]) => (
          <div key={name} style={{ marginBottom: theme.sizes.spacing.sm }}>
            <div
              style={{ fontSize: theme.sizes.fontSize.sm, marginBottom: "4px" }}
            >
              {name} ({spacing})
            </div>
            <div style={spacingExampleStyle(spacing)}></div>
          </div>
        ))}
      </div>

      {/* Border Radius Section */}
      <div style={sectionStyle}>
        <h3 style={subtitleStyle}>Border Radius</h3>
        <div
          style={{
            display: "flex",
            gap: theme.sizes.spacing.md,
            flexWrap: "wrap",
          }}
        >
          {Object.entries(theme.sizes.borderRadius).map(([name, radius]) => (
            <div
              key={name}
              style={{
                backgroundColor: theme.colors.primary,
                color: theme.colors.textInverse,
                padding: theme.sizes.spacing.md,
                borderRadius: radius,
                fontSize: theme.sizes.fontSize.sm,
                fontWeight: "600",
              }}
            >
              {name} ({radius})
            </div>
          ))}
        </div>
      </div>

      {/* Shadows Section */}
      <div style={sectionStyle}>
        <h3 style={subtitleStyle}>Shadows</h3>
        {Object.entries(theme.sizes.shadow).map(([name, shadow]) => (
          <div key={name}>
            <div
              style={{
                fontSize: theme.sizes.fontSize.sm,
                marginBottom: theme.sizes.spacing.sm,
              }}
            >
              {name} Shadow
            </div>
            <div style={shadowExampleStyle(shadow)}>
              <div
                style={{
                  fontSize: theme.sizes.fontSize.sm,
                  fontFamily: "monospace",
                }}
              >
                {shadow}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Elements Section */}
      <div style={sectionStyle}>
        <h3 style={subtitleStyle}>Interactive Elements</h3>
        <div
          style={{
            display: "flex",
            gap: theme.sizes.spacing.md,
            flexWrap: "wrap",
            marginBottom: theme.sizes.spacing.md,
          }}
        >
          <button
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.textInverse,
              border: "none",
              padding: `${theme.sizes.spacing.sm} ${theme.sizes.spacing.md}`,
              borderRadius: theme.sizes.borderRadius.md,
              cursor: "pointer",
              fontSize: theme.sizes.fontSize.md,
              fontWeight: "600",
            }}
          >
            Primary Button
          </button>
          <button
            style={{
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
              border: `1px solid ${theme.colors.border}`,
              padding: `${theme.sizes.spacing.sm} ${theme.sizes.spacing.md}`,
              borderRadius: theme.sizes.borderRadius.md,
              cursor: "pointer",
              fontSize: theme.sizes.fontSize.md,
            }}
          >
            Secondary Button
          </button>
        </div>

        <div
          style={{
            backgroundColor: theme.colors.backgroundSecondary,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.sizes.borderRadius.md,
            padding: theme.sizes.spacing.md,
          }}
        >
          <div
            style={{
              marginBottom: theme.sizes.spacing.sm,
              fontSize: theme.sizes.fontSize.md,
              fontWeight: "600",
            }}
          >
            Card Example
          </div>
          <div
            style={{
              color: theme.colors.textSecondary,
              fontSize: theme.sizes.fontSize.sm,
            }}
          >
            This is an example card using the current theme's surface colors and
            spacing.
          </div>
        </div>
      </div>
    </div>
  );
};
