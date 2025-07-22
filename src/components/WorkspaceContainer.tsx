import React from "react";
import { WorkspaceProvider } from "../contexts/WorkspaceContext";
import { ThemeProvider } from "../contexts/ThemeContext";
import styles from "./WorkspaceContainer.module.css";
import { LayoutManager } from "./LayoutManager";

/**
 * Example of using Workspace as a contained component within other UI elements
 */
const WorkspaceContainerDemo: React.FC = () => {
  return (
    <div className={styles["aes-appContainer"]}>
      {/* Top Navigation Bar */}
      <div className={styles["aes-topBar"]}>
        <h1 className={styles["aes-topBarTitle"]}>My Application</h1>
        <nav className={styles["aes-topBarNav"]}>
          <button className={styles["aes-topBarButton"]}>File</button>
          <button className={styles["aes-topBarButton"]}>Edit</button>
        </nav>
      </div>

      {/* Main Content Area with Workspace */}
      <div className={styles["aes-mainContent"]}>
        <ThemeProvider themeId="dark">
          <WorkspaceProvider>
            <LayoutManager />
            {/* <WorkspaceGrid fullViewport={false} /> */}
          </WorkspaceProvider>
        </ThemeProvider>
      </div>

      {/* Status Bar */}
      <div className={styles["aes-statusBar"]}>
        Ready • TypeScript • UTF-8 • Ln 1, Col 1
      </div>
    </div>
  );
};

export default WorkspaceContainerDemo;
