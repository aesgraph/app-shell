import React from "react";
import { LayoutManager } from "../components/LayoutManager";
import { useAppShell } from "../contexts/useAppShell";

/**
 * Debug controls component that demonstrates centralized debug management
 */
const DebugControls: React.FC = () => {
  const { debug, setDebug, log } = useAppShell();

  const testLogging = () => {
    log("Testing centralized logging from DebugControls component");
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 1000,
        background: "rgba(0,0,0,0.8)",
        color: "white",
        padding: "10px",
        borderRadius: "5px",
        fontSize: "12px",
      }}
    >
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          marginBottom: "5px",
        }}
      >
        <input
          type="checkbox"
          checked={debug}
          onChange={(e) => setDebug(e.target.checked)}
        />
        Enable Debug Logging
      </label>
      <button
        onClick={testLogging}
        style={{
          background: "#007acc",
          color: "white",
          border: "none",
          padding: "4px 8px",
          borderRadius: "3px",
          fontSize: "11px",
        }}
      >
        Test Log
      </button>
    </div>
  );
};

/**
 * Demo component to showcase the LayoutManager with unified app shell context
 */
const WorkspaceDemo: React.FC = () => {
  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <DebugControls />
      <LayoutManager />
    </div>
  );
};

export default WorkspaceDemo;
