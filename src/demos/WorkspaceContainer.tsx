import React from "react";
import styles from "./WorkspaceContainer.module.css";
import { LayoutManager } from "../components/LayoutManager";
import { AppShellProvider } from "../contexts/AppShellContext";
import { exampleCustomConfig } from "../utils/exampleConfigs";

/**
 * Example of using Workspace as a contained component within other UI elements
 */
const WorkspaceContainerDemo: React.FC = () => {
  return (
    <div className={styles["aes-appContainer"]}>
      {/* Top Navigation Bar */}
      <div className={styles["aes-statusBar"]}>
        <h1 className={styles["aes-topBarTitle"]}>My Application</h1>
        <nav className={styles["aes-topBarNav"]}>
          <button className={styles["aes-topBarButton"]}>File</button>
          <button className={styles["aes-topBarButton"]}>Edit</button>
        </nav>
      </div>

      {/* Main Content Area with Workspace */}
      <div className={styles["aes-mainContent"]}>
        <AppShellProvider themeId="dracula">
          <LayoutManager initialConfig={exampleCustomConfig} />
          {/* <WorkspaceGrid fullViewport={false} /> */}
        </AppShellProvider>
      </div>

      {/* Status Bar */}
      <div className={styles["aes-statusBar"]}>
        Ready • TypeScript • UTF-8 • Ln 1, Col 1
      </div>
    </div>
  );
};

export default WorkspaceContainerDemo;
