import React from "react";
import sharedStyles from "../App.module.css";
import styles from "./WorkspaceConfigEditor.module.css";
import { useTheme } from "../contexts/useAppShell";
import { getThemeStyles } from "../utils/themeUtils";
import { themes } from "../themes/themes";
import type { ThemeId } from "../types/Theme";

const WorkspaceConfigEditor = () => {
  const { theme, setTheme } = useTheme();
  const themeStyles = getThemeStyles(theme);

  // Get all available themes from the new theme system
  const availableThemes = Object.values(themes).map((theme) => ({
    id: theme.id,
    name: theme.name,
    bg: theme.colors.workspaceBackground,
    panel: theme.colors.workspacePanel,
    accent: theme.colors.primary,
  }));

  return (
    <div
      className={sharedStyles["aes-viewContainer"]}
      style={{
        ...themeStyles.workspace.panel,
        color: theme.colors.text,
      }}
    >
      <div className={sharedStyles["aes-viewHeader"]}>
        <h2 style={{ color: theme.colors.text }}>Workspace Configuration</h2>
        <p style={{ color: theme.colors.textSecondary }}>
          Customize your workspace appearance and behavior
        </p>
      </div>

      <div className={sharedStyles["aes-configSection"]}>
        <h3 style={{ color: theme.colors.text }}>Theme Settings</h3>
        <div className={styles["aes-themeSelector"]}>
          {availableThemes.map((themeOption) => (
            <label
              key={themeOption.id}
              className={styles["aes-themeOption"]}
              onClick={() => {
                setTheme(themeOption.id as ThemeId);
                // Also update the theme context for immediate visual feedback
                setTheme(themeOption.id);
              }}
              style={{
                backgroundColor:
                  theme.id === themeOption.id
                    ? theme.colors.primary + "30"
                    : "transparent",
                border: `2px solid ${
                  theme.id === themeOption.id
                    ? theme.colors.primary
                    : theme.colors.border
                }`,
              }}
            >
              <input
                type="radio"
                name="theme"
                value={themeOption.id}
                checked={theme.id === themeOption.id}
                onChange={(e) => {
                  const themeId = e.target.value as ThemeId;
                  setTheme(themeId);
                  // Also update the theme context for immediate visual feedback
                  setTheme(themeId);
                }}
                style={{ display: "none" }}
              />
              <div className={styles["aes-themePreview"]}>
                <div className={styles["aes-themePreviewHeader"]}>
                  <div
                    className={styles["aes-themePreviewDot"]}
                    style={{ backgroundColor: themeOption.accent }}
                  ></div>
                  <div
                    className={styles["aes-themePreviewDot"]}
                    style={{ backgroundColor: themeOption.accent }}
                  ></div>
                  <div
                    className={styles["aes-themePreviewDot"]}
                    style={{ backgroundColor: themeOption.accent }}
                  ></div>
                </div>
                <div
                  className={styles["aes-themePreviewContent"]}
                  style={{ backgroundColor: themeOption.bg }}
                >
                  <div
                    style={{
                      backgroundColor: themeOption.panel,
                      height: "20px",
                      margin: "4px",
                      borderRadius: "2px",
                    }}
                  ></div>
                  <div
                    style={{
                      backgroundColor: themeOption.accent,
                      height: "12px",
                      margin: "4px",
                      borderRadius: "2px",
                      width: "60%",
                    }}
                  ></div>
                </div>
              </div>
              <span style={{ color: theme.colors.text }}>
                {themeOption.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className={sharedStyles["aes-configSection"]}>
        <h3 style={{ color: theme.colors.text }}>Current Theme Details</h3>
        <p style={{ color: theme.colors.textSecondary }}>
          Preview of workspace-specific colors from the selected theme
        </p>
        <div
          className={styles["aes-themeDetails"]}
          style={{
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          <div className={styles["aes-colorGrid"]}>
            <div className={styles["aes-colorSwatch"]}>
              <div
                className={styles["aes-colorPreview"]}
                style={{
                  backgroundColor:
                    availableThemes.find((t) => t.id === theme.id)?.bg ||
                    "#1e1e1e",
                }}
              ></div>
              <span style={{ color: theme.colors.text }}>
                Workspace Background
              </span>
            </div>
            <div className={styles["aes-colorSwatch"]}>
              <div
                className={styles["aes-colorPreview"]}
                style={{
                  backgroundColor:
                    availableThemes.find((t) => t.id === theme.id)?.panel ||
                    "#23272e",
                }}
              ></div>
              <span style={{ color: theme.colors.text }}>Panel Background</span>
            </div>
            <div className={styles["aes-colorSwatch"]}>
              <div
                className={styles["aes-colorPreview"]}
                style={{
                  backgroundColor:
                    availableThemes.find((t) => t.id === theme.id)?.panel ||
                    "#23272e",
                }}
              ></div>
              <span style={{ color: theme.colors.text }}>Title Background</span>
            </div>
            <div className={styles["aes-colorSwatch"]}>
              <div
                className={styles["aes-colorPreview"]}
                style={{
                  backgroundColor:
                    availableThemes.find((t) => t.id === theme.id)?.panel ||
                    "#23272e",
                }}
              ></div>
              <span style={{ color: theme.colors.text }}>Resizer</span>
            </div>
            <div className={styles["aes-colorSwatch"]}>
              <div
                className={styles["aes-colorPreview"]}
                style={{
                  backgroundColor:
                    availableThemes.find((t) => t.id === theme.id)?.accent ||
                    "#007acc",
                }}
              ></div>
              <span style={{ color: theme.colors.text }}>Resizer Hover</span>
            </div>
            <div className={styles["aes-colorSwatch"]}>
              <div
                className={styles["aes-colorPreview"]}
                style={{
                  backgroundColor:
                    availableThemes.find((t) => t.id === theme.id)?.accent ||
                    "#007acc",
                }}
              ></div>
              <span style={{ color: theme.colors.text }}>Primary Accent</span>
            </div>
          </div>
        </div>
      </div>

      <div className={sharedStyles["aes-configSection"]}>
        <h3 style={{ color: theme.colors.text }}>Pane Configuration</h3>
        <p style={{ color: theme.colors.textSecondary }}>
          Pane size and behavior settings will be available here in future
          updates.
        </p>
        <div className={sharedStyles["aes-placeholderText"]}>
          <span style={{ color: theme.colors.textMuted }}>Coming soon...</span>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceConfigEditor;
