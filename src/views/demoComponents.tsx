import React from "react";

// Create some simple demo components for additional views
export const FileExplorerView = () => (
  <div style={{ padding: "16px" }}>
    <h3>File Explorer</h3>
    <div style={{ marginTop: "12px" }}>
      <div style={{ marginBottom: "8px", cursor: "pointer" }}>📁 src/</div>
      <div
        style={{ marginLeft: "16px", marginBottom: "4px", cursor: "pointer" }}
      >
        📄 App.tsx
      </div>
      <div
        style={{ marginLeft: "16px", marginBottom: "4px", cursor: "pointer" }}
      >
        📄 main.tsx
      </div>
      <div
        style={{ marginLeft: "16px", marginBottom: "8px", cursor: "pointer" }}
      >
        📁 components/
      </div>
      <div style={{ marginBottom: "8px", cursor: "pointer" }}>📁 public/</div>
      <div style={{ marginBottom: "4px", cursor: "pointer" }}>
        📄 package.json
      </div>
    </div>
  </div>
);

export const TerminalView = () => (
  <div
    style={{
      padding: "16px",
      backgroundColor: "#1e1e1e",
      color: "#ffffff",
      fontFamily: "monospace",
      height: "100%",
    }}
  >
    <div>$ npm run dev</div>
    <div style={{ color: "#90ee90", marginTop: "8px" }}>
      ✓ Server started on http://localhost:5173
    </div>
    <div style={{ marginTop: "12px", color: "#888" }}>
      Waiting for file changes...
    </div>
  </div>
);

export const PropertiesView = () => (
  <div style={{ padding: "16px" }}>
    <h3>Properties</h3>
    <div style={{ marginTop: "12px" }}>
      <div style={{ marginBottom: "12px" }}>
        <label
          style={{ display: "block", marginBottom: "4px", fontWeight: "bold" }}
        >
          Width:
        </label>
        <input
          type="number"
          defaultValue="100"
          style={{ width: "100%", padding: "4px" }}
        />
      </div>
      <div style={{ marginBottom: "12px" }}>
        <label
          style={{ display: "block", marginBottom: "4px", fontWeight: "bold" }}
        >
          Height:
        </label>
        <input
          type="number"
          defaultValue="100"
          style={{ width: "100%", padding: "4px" }}
        />
      </div>
      <div style={{ marginBottom: "12px" }}>
        <label
          style={{ display: "block", marginBottom: "4px", fontWeight: "bold" }}
        >
          Background:
        </label>
        <input
          type="color"
          defaultValue="#ffffff"
          style={{ width: "100%", padding: "4px" }}
        />
      </div>
    </div>
  </div>
);

export const OutputView = () => (
  <div
    style={{
      padding: "16px",
      backgroundColor: "#f5f5f5",
      fontFamily: "monospace",
      height: "100%",
      overflow: "auto",
    }}
  >
    <div style={{ color: "#0066cc" }}>INFO: Application started</div>
    <div style={{ color: "#0066cc" }}>INFO: Loading configuration...</div>
    <div style={{ color: "#0066cc" }}>
      INFO: Configuration loaded successfully
    </div>
    <div style={{ color: "#cc6600" }}>
      WARN: Some deprecated features detected
    </div>
    <div style={{ color: "#0066cc" }}>INFO: Ready to accept connections</div>
    <div style={{ color: "#666" }}>...</div>
  </div>
);

export const DebugView = () => (
  <div style={{ padding: "16px" }}>
    <h3>Debug Console</h3>
    <div
      style={{
        backgroundColor: "#1e1e1e",
        color: "#ffffff",
        fontFamily: "monospace",
        padding: "12px",
        marginTop: "12px",
        borderRadius: "4px",
        height: "200px",
        overflow: "auto",
      }}
    >
      <div style={{ color: "#90ee90" }}>&gt; console.log("Hello World")</div>
      <div style={{ color: "#ffffff" }}>Hello World</div>
      <div style={{ color: "#90ee90" }}>&gt; const x = 42</div>
      <div style={{ color: "#ffffff" }}>undefined</div>
      <div style={{ color: "#90ee90" }}>&gt; x</div>
      <div style={{ color: "#ffffff" }}>42</div>
      <div style={{ color: "#90ee90" }}>&gt;</div>
    </div>
  </div>
);
