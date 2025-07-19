import sharedStyles from "../../App.module.css";
import styles from "./WorkspaceConfigEditor.module.css";
import { useWorkspace } from "../../contexts/useWorkspace";
import type { ThemeId } from "../../types/Theme";
import React from "react";

const WorkspaceConfigEditor = () => {
  const { currentTheme, setCurrentTheme } = useWorkspace();

  const themes = [
    {
      id: "light",
      name: "Light",
      bg: "#f5f5f5",
      panel: "#fff",
      accent: "#333",
    },
    {
      id: "dark",
      name: "Dark",
      bg: "#1e1e1e",
      panel: "#23272e",
      accent: "#d4d4d4",
    },
    {
      id: "dracula",
      name: "Dracula",
      bg: "#282a36",
      panel: "#44475a",
      accent: "#bd93f9",
    },
    {
      id: "oneDark",
      name: "One Dark",
      bg: "#282c34",
      panel: "#3e4451",
      accent: "#61afef",
    },
    {
      id: "solarized",
      name: "Solarized",
      bg: "#002b36",
      panel: "#073642",
      accent: "#268bd2",
    },
    {
      id: "monokai",
      name: "Monokai",
      bg: "#272822",
      panel: "#3e3d32",
      accent: "#f92672",
    },
    {
      id: "nord",
      name: "Nord",
      bg: "#2e3440",
      panel: "#3b4252",
      accent: "#88c0d0",
    },
    {
      id: "gruvbox",
      name: "Gruvbox",
      bg: "#282828",
      panel: "#3c3836",
      accent: "#fabd2f",
    },
    {
      id: "tokyo",
      name: "Tokyo Night",
      bg: "#1a1b26",
      panel: "#24283b",
      accent: "#7aa2f7",
    },
    {
      id: "catppuccin",
      name: "Catppuccin",
      bg: "#1e1e2e",
      panel: "#313244",
      accent: "#cba6f7",
    },
  ];

  return (
    <div className={sharedStyles.viewContainer}>
      <div className={sharedStyles.viewHeader}>
        <h2>Workspace Configuration</h2>
        <p>Customize your workspace appearance and behavior</p>
      </div>

      <div className={sharedStyles.configSection}>
        <h3>Theme Settings</h3>
        <div className={styles.themeSelector}>
          {themes.map((theme) => (
            <label
              key={theme.id}
              className={styles.themeOption}
              onClick={() => setCurrentTheme(theme.id as ThemeId)}
            >
              <input
                type="radio"
                name="theme"
                value={theme.id}
                checked={currentTheme === theme.id}
                onChange={(e) => setCurrentTheme(e.target.value as ThemeId)}
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
