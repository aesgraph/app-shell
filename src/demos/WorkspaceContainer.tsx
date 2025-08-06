import React from "react";
import styles from "./WorkspaceContainer.module.css";
import { LayoutManager } from "../components/LayoutManager";
import { AppShellProvider } from "../contexts/AppShellContext";
import { exampleCustomConfig } from "../utils/exampleConfigs";
import { addViewAsTab, addCustomViewAsTab } from "../utils/programmaticViews";

/**
 * File menu component with test actions
 */
const FileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addTestTab = (title: string, viewId: string = "workspace-manager") => {
    console.log(`Adding tab with title: ${title}`);
    addViewAsTab({
      viewId,
      pane: "center",
      title,
    });
    setIsOpen(false);
  };

  const addCustomTestTab = (title: string) => {
    console.log(`Adding custom tab with title: ${title}`);

    const CustomComponent = () => (
      <div style={{ padding: "16px" }}>
        <h4>{title}</h4>
        <p>This is a custom component added programmatically!</p>
        <p>Created at: {new Date().toLocaleTimeString()}</p>
      </div>
    );

    addCustomViewAsTab({
      component: CustomComponent,
      title,
      pane: "right",
    });
    setIsOpen(false);
  };

  return (
    <div ref={menuRef} style={{ position: "relative" }}>
      <button
        className={styles["aes-topBarButton"]}
        onClick={() => setIsOpen(!isOpen)}
      >
        File
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: "0",
            backgroundColor: "#2d2d2d",
            border: "1px solid #555",
            borderRadius: "4px",
            padding: "4px 0",
            minWidth: "200px",
            zIndex: 1000,
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
          }}
        >
          <div
            style={{
              padding: "8px 12px",
              fontSize: "12px",
              color: "#ccc",
              borderBottom: "1px solid #555",
            }}
          >
            Test Actions
          </div>

          <button
            style={{
              width: "100%",
              padding: "8px 12px",
              backgroundColor: "transparent",
              border: "none",
              color: "#fff",
              textAlign: "left",
              cursor: "pointer",
              fontSize: "12px",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#3d3d3d")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
            onClick={() =>
              addTestTab("Workspace Manager Tab", "workspace-manager")
            }
          >
            Add Workspace Manager Tab
          </button>

          <button
            style={{
              width: "100%",
              padding: "8px 12px",
              backgroundColor: "transparent",
              border: "none",
              color: "#fff",
              textAlign: "left",
              cursor: "pointer",
              fontSize: "12px",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#3d3d3d")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
            onClick={() =>
              addTestTab("Config Editor Tab", "workspace-config-editor")
            }
          >
            Add Config Editor Tab
          </button>

          <button
            style={{
              width: "100%",
              padding: "8px 12px",
              backgroundColor: "transparent",
              border: "none",
              color: "#fff",
              textAlign: "left",
              cursor: "pointer",
              fontSize: "12px",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#3d3d3d")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
            onClick={() => addCustomTestTab("Custom Test Component")}
          >
            Add Custom Component Tab
          </button>

          <button
            style={{
              width: "100%",
              padding: "8px 12px",
              backgroundColor: "transparent",
              border: "none",
              color: "#fff",
              textAlign: "left",
              cursor: "pointer",
              fontSize: "12px",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#3d3d3d")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
            onClick={() => addTestTab("Counter Tab", "stateful-counter")}
          >
            Add Counter Tab
          </button>
        </div>
      )}
    </div>
  );
};

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
          <FileMenu />
          <button className={styles["aes-topBarButton"]}>Edit</button>
          <button
            className={styles["aes-topBarButton"]}
            onClick={() => {
              console.log("Adding tab with title: Test Tab");
              addViewAsTab({
                viewId: "workspace-manager",
                pane: "center",
                title: "Test Tab",
              });
            }}
            style={{ backgroundColor: "#4CAF50", color: "white" }}
          >
            Add Tab
          </button>
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
