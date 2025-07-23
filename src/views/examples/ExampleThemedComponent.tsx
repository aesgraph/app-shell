import React from "react";
import { useTheme } from "../../contexts/useAppShell";

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
    padding: theme.sizes.spacing.lg,
    borderRadius: theme.sizes.borderRadius.lg,
    border: `1px solid ${theme.colors.border}`,
    fontFamily: "system-ui, -apple-system, sans-serif",
    maxHeight: "80vh",
    overflowY: "auto",
    ...customStyle,
  };

  return (
    <div className={className} style={containerStyle}>
      {/* Header */}
      <div
        style={{
          borderBottom: `2px solid ${theme.colors.primary}`,
          paddingBottom: theme.sizes.spacing.md,
          marginBottom: theme.sizes.spacing.lg,
        }}
      >
        <h2
          style={{
            fontSize: theme.sizes.fontSize.xl,
            margin: 0,
            color: theme.colors.text,
            fontWeight: "bold",
          }}
        >
          {title}
        </h2>
        <p
          style={{
            margin: `${theme.sizes.spacing.sm} 0 0 0`,
            color: theme.colors.textSecondary,
            fontSize: theme.sizes.fontSize.sm,
          }}
        >
          {content}
        </p>
      </div>

      {/* UI Component Examples Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: theme.sizes.spacing.lg,
        }}
      >
        {/* Button Showcase */}
        <div
          style={{
            backgroundColor: theme.colors.backgroundSecondary,
            padding: theme.sizes.spacing.md,
            borderRadius: theme.sizes.borderRadius.md,
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          <h4
            style={{
              margin: `0 0 ${theme.sizes.spacing.md} 0`,
              fontSize: theme.sizes.fontSize.md,
              fontWeight: "600",
            }}
          >
            Buttons & Actions
          </h4>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: theme.sizes.spacing.sm,
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
                fontWeight: "600",
                boxShadow: theme.sizes.shadow.sm,
              }}
            >
              Primary Action
            </button>
            <button
              style={{
                backgroundColor: "transparent",
                color: theme.colors.text,
                border: `1px solid ${theme.colors.border}`,
                padding: `${theme.sizes.spacing.sm} ${theme.sizes.spacing.md}`,
                borderRadius: theme.sizes.borderRadius.md,
                cursor: "pointer",
              }}
            >
              Secondary Action
            </button>
            <button
              style={{
                backgroundColor: theme.colors.error,
                color: theme.colors.textInverse,
                border: "none",
                padding: `${theme.sizes.spacing.xs} ${theme.sizes.spacing.sm}`,
                borderRadius: theme.sizes.borderRadius.sm,
                cursor: "pointer",
                fontSize: theme.sizes.fontSize.sm,
              }}
            >
              Delete
            </button>
          </div>
        </div>

        {/* Typography Showcase */}
        <div
          style={{
            backgroundColor: theme.colors.backgroundSecondary,
            padding: theme.sizes.spacing.md,
            borderRadius: theme.sizes.borderRadius.md,
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          <h4
            style={{
              margin: `0 0 ${theme.sizes.spacing.md} 0`,
              fontSize: theme.sizes.fontSize.md,
              fontWeight: "600",
            }}
          >
            Typography Scale
          </h4>
          <div
            style={{
              fontSize: theme.sizes.fontSize.xl,
              fontWeight: "bold",
              marginBottom: theme.sizes.spacing.xs,
            }}
          >
            Heading XL
          </div>
          <div
            style={{
              fontSize: theme.sizes.fontSize.lg,
              fontWeight: "600",
              marginBottom: theme.sizes.spacing.xs,
            }}
          >
            Heading Large
          </div>
          <div
            style={{
              fontSize: theme.sizes.fontSize.md,
              marginBottom: theme.sizes.spacing.xs,
            }}
          >
            Body Text Medium
          </div>
          <div
            style={{
              fontSize: theme.sizes.fontSize.sm,
              color: theme.colors.textSecondary,
              marginBottom: theme.sizes.spacing.xs,
            }}
          >
            Body Text Small
          </div>
          <div
            style={{
              fontSize: theme.sizes.fontSize.xs,
              color: theme.colors.textMuted,
            }}
          >
            Caption Text
          </div>
        </div>

        {/* Form Elements */}
        <div
          style={{
            backgroundColor: theme.colors.backgroundSecondary,
            padding: theme.sizes.spacing.md,
            borderRadius: theme.sizes.borderRadius.md,
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          <h4
            style={{
              margin: `0 0 ${theme.sizes.spacing.md} 0`,
              fontSize: theme.sizes.fontSize.md,
              fontWeight: "600",
            }}
          >
            Form Elements
          </h4>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: theme.sizes.spacing.sm,
            }}
          >
            <input
              type="text"
              placeholder="Text input"
              style={{
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                border: `1px solid ${theme.colors.border}`,
                padding: theme.sizes.spacing.sm,
                borderRadius: theme.sizes.borderRadius.sm,
                fontSize: theme.sizes.fontSize.sm,
              }}
            />
            <select
              style={{
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                border: `1px solid ${theme.colors.border}`,
                padding: theme.sizes.spacing.sm,
                borderRadius: theme.sizes.borderRadius.sm,
                fontSize: theme.sizes.fontSize.sm,
              }}
            >
              <option>Select option</option>
              <option>Option 1</option>
              <option>Option 2</option>
            </select>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: theme.sizes.spacing.xs,
                fontSize: theme.sizes.fontSize.sm,
              }}
            >
              <input type="checkbox" />
              Checkbox option
            </label>
          </div>
        </div>

        {/* Color Palette */}
        <div
          style={{
            backgroundColor: theme.colors.backgroundSecondary,
            padding: theme.sizes.spacing.md,
            borderRadius: theme.sizes.borderRadius.md,
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          <h4
            style={{
              margin: `0 0 ${theme.sizes.spacing.md} 0`,
              fontSize: theme.sizes.fontSize.md,
              fontWeight: "600",
            }}
          >
            Color System
          </h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: theme.sizes.spacing.xs,
            }}
          >
            {[
              { name: "Primary", color: theme.colors.primary },
              { name: "Surface", color: theme.colors.surface },
              { name: "Success", color: theme.colors.success || "#10b981" },
              { name: "Error", color: theme.colors.error },
              { name: "Warning", color: theme.colors.warning || "#f59e0b" },
              { name: "Border", color: theme.colors.border },
            ].map(({ name, color }) => (
              <div
                key={name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: theme.sizes.spacing.xs,
                }}
              >
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    backgroundColor: color,
                    borderRadius: theme.sizes.borderRadius.sm,
                    border: `1px solid ${theme.colors.border}`,
                  }}
                ></div>
                <span
                  style={{
                    fontSize: theme.sizes.fontSize.xs,
                    color: theme.colors.textSecondary,
                  }}
                >
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Card Examples */}
        <div
          style={{
            backgroundColor: theme.colors.backgroundSecondary,
            padding: theme.sizes.spacing.md,
            borderRadius: theme.sizes.borderRadius.md,
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          <h4
            style={{
              margin: `0 0 ${theme.sizes.spacing.md} 0`,
              fontSize: theme.sizes.fontSize.md,
              fontWeight: "600",
            }}
          >
            Card Variations
          </h4>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: theme.sizes.spacing.sm,
            }}
          >
            {/* Basic Card */}
            <div
              style={{
                backgroundColor: theme.colors.surface,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.sizes.borderRadius.md,
                padding: theme.sizes.spacing.sm,
                boxShadow: theme.sizes.shadow.sm,
              }}
            >
              <div
                style={{
                  fontSize: theme.sizes.fontSize.sm,
                  fontWeight: "600",
                  marginBottom: theme.sizes.spacing.xs,
                }}
              >
                Basic Card
              </div>
              <div
                style={{
                  fontSize: theme.sizes.fontSize.xs,
                  color: theme.colors.textSecondary,
                }}
              >
                Simple card with shadow
              </div>
            </div>

            {/* Elevated Card */}
            <div
              style={{
                backgroundColor: theme.colors.surface,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.sizes.borderRadius.lg,
                padding: theme.sizes.spacing.md,
                boxShadow: theme.sizes.shadow.md,
              }}
            >
              <div
                style={{
                  fontSize: theme.sizes.fontSize.sm,
                  fontWeight: "600",
                  marginBottom: theme.sizes.spacing.xs,
                }}
              >
                Elevated Card
              </div>
              <div
                style={{
                  fontSize: theme.sizes.fontSize.xs,
                  color: theme.colors.textSecondary,
                }}
              >
                Card with larger shadow and rounded corners
              </div>
            </div>
          </div>
        </div>

        {/* Status & Feedback */}
        <div
          style={{
            backgroundColor: theme.colors.backgroundSecondary,
            padding: theme.sizes.spacing.md,
            borderRadius: theme.sizes.borderRadius.md,
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          <h4
            style={{
              margin: `0 0 ${theme.sizes.spacing.md} 0`,
              fontSize: theme.sizes.fontSize.md,
              fontWeight: "600",
            }}
          >
            Status Elements
          </h4>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: theme.sizes.spacing.sm,
            }}
          >
            <div
              style={{
                backgroundColor: theme.colors.success || "#10b981",
                color: theme.colors.textInverse,
                padding: `${theme.sizes.spacing.xs} ${theme.sizes.spacing.sm}`,
                borderRadius: theme.sizes.borderRadius.sm,
                fontSize: theme.sizes.fontSize.xs,
                fontWeight: "500",
              }}
            >
              ✓ Success Message
            </div>
            <div
              style={{
                backgroundColor: theme.colors.error,
                color: theme.colors.textInverse,
                padding: `${theme.sizes.spacing.xs} ${theme.sizes.spacing.sm}`,
                borderRadius: theme.sizes.borderRadius.sm,
                fontSize: theme.sizes.fontSize.xs,
                fontWeight: "500",
              }}
            >
              ✗ Error Message
            </div>
            <div
              style={{
                backgroundColor: theme.colors.warning || "#f59e0b",
                color: theme.colors.textInverse,
                padding: `${theme.sizes.spacing.xs} ${theme.sizes.spacing.sm}`,
                borderRadius: theme.sizes.borderRadius.sm,
                fontSize: theme.sizes.fontSize.xs,
                fontWeight: "500",
              }}
            >
              ⚠ Warning Message
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
