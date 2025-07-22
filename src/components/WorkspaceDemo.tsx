import React from "react";
import { ThemeProvider } from "../contexts/ThemeContext";
import { WorkspaceProvider } from "../contexts/WorkspaceContext";
import { LayoutManager } from "./LayoutManager";
import { LayoutProvider } from "./LayoutContext";

/**
 * Demo component to showcase the new LayoutManager with proper react-resizable-panels layout system
 */
const WorkspaceDemo: React.FC = () => {
  return (
    <ThemeProvider>
      <WorkspaceProvider>
        <LayoutProvider>
          <div style={{ width: "100vw", height: "100vh" }}>
            <LayoutManager />
          </div>
        </LayoutProvider>
      </WorkspaceProvider>
    </ThemeProvider>
  );
};

export default WorkspaceDemo;
