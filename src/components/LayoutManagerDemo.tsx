import React from "react";
import { LayoutProvider } from "../contexts/LayoutContext";
import { LayoutManager } from "./LayoutManager";

// Example component showing how to use the new LayoutManager
const LayoutManagerDemo: React.FC = () => {
  return (
    <LayoutProvider>
      <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
        <h1
          style={{
            margin: 0,
            padding: "8px 16px",
            backgroundColor: "#f8f9fa",
            borderBottom: "1px solid #e0e0e0",
            fontSize: "18px",
          }}
        >
          Layout Manager Demo
        </h1>
        <div style={{ height: "calc(100vh - 50px)" }}>
          <LayoutManager />
        </div>
      </div>
    </LayoutProvider>
  );
};

export default LayoutManagerDemo;
