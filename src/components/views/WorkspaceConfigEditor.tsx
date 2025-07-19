import sharedStyles from "../../App.module.css";
import styles from "./WorkspaceConfigEditor.module.css";
import { useWorkspace } from "../../contexts/useWorkspace";
import { useTheme } from "../../contexts/useTheme";
import { themes } from "../../themes/themes";
import type { ThemeId } from "../../types/Theme";
import React from "react";

const WorkspaceConfigEditor = () => {
  const { currentTheme, setCurrentTheme } = useWorkspace();
  const { setTheme } = useTheme();

  // Get all available themes from the new theme system
  const availableThemes = Object.values(themes).map((theme) => ({
    id: theme.id,
    name: theme.name,
    bg: theme.colors.workspaceBackground,
    panel: theme.colors.workspacePanel,
    accent: theme.colors.primary,
  }));

  return (
    <div className={sharedStyles.viewContainer}>
      <div className={sharedStyles.viewHeader}>
        <h2>Workspace Configuration</h2>
        <p>Customize your workspace appearance and behavior</p>
      </div>

      <div className={sharedStyles.configSection}>
        <h3>Theme Settings</h3>
        <div className={styles.themeSelector}>
          {availableThemes.map((theme) => (
            <label
              key={theme.id}
              className={styles.themeOption}
              onClick={() => {
                setCurrentTheme(theme.id as ThemeId);
                // Also update the theme context for immediate visual feedback
                setTheme(theme.id);
              }}
            >
              <input
                type="radio"
                name="theme"
                value={theme.id}
                checked={currentTheme === theme.id}
                onChange={(e) => {
                  const themeId = e.target.value as ThemeId;
                  setCurrentTheme(themeId);
                  // Also update the theme context for immediate visual feedback
                  setTheme(themeId);
                }}
              />
              <div className={styles.themePreview}>
                <div className={styles.themePreviewHeader}>
                  <div
                    className={styles.themePreviewDot}
                    style={{ backgroundColor: theme.accent }}
                  ></div>
                  <div
                    className={styles.themePreviewDot}
                    style={{ backgroundColor: theme.accent }}
                  ></div>
                  <div
                    className={styles.themePreviewDot}
                    style={{ backgroundColor: theme.accent }}
                  ></div>
                </div>
                <div
                  className={styles.themePreviewContent}
                  style={{ backgroundColor: theme.bg }}
                >
                  <div
                    style={{
                      backgroundColor: theme.panel,
                      height: "20px",
                      margin: "4px",
                      borderRadius: "2px",
                    }}
                  ></div>
                  <div
                    style={{
                      backgroundColor: theme.accent,
                      height: "12px",
                      margin: "4px",
                      borderRadius: "2px",
                      width: "60%",
                    }}
                  ></div>
                </div>
              </div>
              <span>{theme.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={sharedStyles.configSection}>
        <h3>Current Theme Details</h3>
        <p>Preview of workspace-specific colors from the selected theme</p>
        <div className={styles.themeDetails}>
          <div className={styles.colorGrid}>
            <div className={styles.colorSwatch}>
              <div
                className={styles.colorPreview}
                style={{
                  backgroundColor:
                    availableThemes.find((t) => t.id === currentTheme)?.bg ||
                    "#1e1e1e",
                }}
              ></div>
              <span>Workspace Background</span>
            </div>
            <div className={styles.colorSwatch}>
              <div
                className={styles.colorPreview}
                style={{
                  backgroundColor:
                    availableThemes.find((t) => t.id === currentTheme)?.panel ||
                    "#23272e",
                }}
              ></div>
              <span>Panel Background</span>
            </div>
            <div className={styles.colorSwatch}>
              <div
                className={styles.colorPreview}
                style={{
                  backgroundColor:
                    availableThemes.find((t) => t.id === currentTheme)?.panel ||
                    "#23272e",
                }}
              ></div>
              <span>Title Background</span>
            </div>
            <div className={styles.colorSwatch}>
              <div
                className={styles.colorPreview}
                style={{
                  backgroundColor:
                    availableThemes.find((t) => t.id === currentTheme)?.panel ||
                    "#23272e",
                }}
              ></div>
              <span>Resizer</span>
            </div>
            <div className={styles.colorSwatch}>
              <div
                className={styles.colorPreview}
                style={{
                  backgroundColor:
                    availableThemes.find((t) => t.id === currentTheme)
                      ?.accent || "#007acc",
                }}
              ></div>
              <span>Resizer Hover</span>
            </div>
            <div className={styles.colorSwatch}>
              <div
                className={styles.colorPreview}
                style={{
                  backgroundColor:
                    availableThemes.find((t) => t.id === currentTheme)
                      ?.accent || "#007acc",
                }}
              ></div>
              <span>Primary Accent</span>
            </div>
          </div>
        </div>
      </div>

      <div className={sharedStyles.configSection}>
        <h3>Pane Configuration</h3>
        <p>
          Pane size and behavior settings will be available here in future
          updates.
        </p>
        <div className={sharedStyles.placeholderText}>
          <span>Coming soon...</span>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceConfigEditor;
