import React, { useState } from "react";
import { LayoutManager } from "../components/LayoutManager";
import { LayoutConfig } from "../types/LayoutConfig";
import { createDefaultLayoutConfig } from "../utils/layoutConfigUtils";
import { exampleCustomConfig } from "../utils/exampleConfigs";

export interface LayoutManagerDemoProps {
  customConfig?: LayoutConfig;
  defaultConfig?: LayoutConfig;
  showControls?: boolean;
  title?: string;
}

// Example component showing how to use the new LayoutManager
const LayoutManagerDemo: React.FC<LayoutManagerDemoProps> = ({
  customConfig,
  defaultConfig,
  showControls = true,
  title = "Layout Manager Demo",
}) => {
  const [useCustomConfig, setUseCustomConfig] = useState(false);

  const handleConfigChange = (newConfig: LayoutConfig) => {
    console.log("Layout configuration changed:", newConfig);
  };

  const handleToggleConfig = () => {
    setUseCustomConfig((prev) => !prev);
  };

  const handleResetToDefault = () => {
    setUseCustomConfig(false);
  };

  // Get the current config to display
  const currentConfig = useCustomConfig
    ? customConfig || exampleCustomConfig
    : defaultConfig || createDefaultLayoutConfig();

  // Determine if we have a custom config to toggle between
  const hasCustomConfig = customConfig || true; // Always show controls since we have exampleCustomConfig as fallback

  return (
    <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
      <h1
        style={{
          margin: 0,
          padding: "8px 16px",
          backgroundColor: "#043668ff",
          fontSize: "18px",
          position: "relative",
        }}
      >
        {title}
        {/* Configuration Controls */}
        {showControls && hasCustomConfig && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              right: 16,
              transform: "translateY(-50%)",
              display: "flex",
              gap: "8px",
              alignItems: "center",
            }}
          >
            <button
              onClick={handleToggleConfig}
              style={{
                padding: "4px 8px",
                fontSize: "12px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {useCustomConfig ? "Use Default Config" : "Use Custom Config"}
            </button>
            <button
              onClick={handleResetToDefault}
              style={{
                padding: "4px 8px",
                fontSize: "12px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Reset to Default
            </button>
            <span style={{ fontSize: "12px", color: "#666" }}>
              Current: {useCustomConfig ? "Custom" : "Default"}
            </span>
          </div>
        )}
      </h1>
      <div style={{ height: "calc(100vh - 50px)" }}>
        <LayoutManager
          key={useCustomConfig ? "custom" : "default"} // Force re-render when config changes
          initialConfig={currentConfig}
          onConfigChange={handleConfigChange}
        />
      </div>
    </div>
  );
};

export default LayoutManagerDemo;
