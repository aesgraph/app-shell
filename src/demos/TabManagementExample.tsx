import React from "react";
import { useTabManagement } from "../contexts/useAppShell";
import { addViewAsTab, addCustomViewAsTab } from "../utils/programmaticViews";

export const TabManagementExample: React.FC = () => {
  const { getExistingTabIds, isTabIdUnique } = useTabManagement();
  const [logs, setLogs] = React.useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const testTabManagement = () => {
    addLog("=== Testing Tab Management ===");

    // Get all existing tab IDs
    const existingTabIds = getExistingTabIds();
    addLog(`Existing tab IDs: ${existingTabIds.join(", ")}`);

    // Check uniqueness of some tab IDs
    const testIds = ["my-tab", "workspace-manager", "new-tab"];
    testIds.forEach((id) => {
      const isUnique = isTabIdUnique(id);
      addLog(`Tab ID '${id}' is unique: ${isUnique}`);
    });

    // Try to add a tab with a custom ID
    addLog("Adding tab with custom ID 'my-custom-tab'");
    console.log("About to call addViewAsTab with title:", "My Custom Tab");
    const tabId = addViewAsTab({
      viewId: "workspace-manager",
      pane: "center",
      tabId: "my-custom-tab",
      title: "My Custom Tab",
    });
    addLog(`Result: ${tabId}`);

    // Check uniqueness again
    const updatedTabIds = getExistingTabIds();
    addLog(`Updated tab IDs: ${updatedTabIds.join(", ")}`);
  };

  const testCustomComponent = () => {
    addLog("=== Testing Custom Component ===");

    const CustomComponent = () => (
      <div style={{ padding: "16px" }}>
        <h4>Custom Component</h4>
        <p>This component was added with context-based tab management!</p>
      </div>
    );

    addLog("Adding custom component with ID 'my-custom-component'");
    const tabId = addCustomViewAsTab({
      component: CustomComponent,
      title: "Custom Component",
      pane: "right",
      tabId: "my-custom-component",
    });
    addLog(`Result: ${tabId}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Tab Management Example</h2>
      <p>
        This example demonstrates how to use the new context-based tab
        management functions.
      </p>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={testTabManagement}
          style={{ marginRight: "10px", padding: "8px 16px" }}
        >
          Test Tab Management
        </button>
        <button onClick={testCustomComponent} style={{ padding: "8px 16px" }}>
          Test Custom Component
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>Features Demonstrated:</h3>
        <ul>
          <li>
            <strong>Context-based tab management:</strong> Functions are now
            part of the AppShell context
          </li>
          <li>
            <strong>Real-time tab ID tracking:</strong> Always reflects the
            current workspace state
          </li>
          <li>
            <strong>Accurate uniqueness validation:</strong> Based on actual tab
            containers in the workspace
          </li>
          <li>
            <strong>Easy integration:</strong> Use the{" "}
            <code>useTabManagement</code> hook in any component
          </li>
        </ul>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>Usage Examples:</h3>
        <pre
          style={{
            backgroundColor: "#f5f5f5",
            padding: "10px",
            borderRadius: "4px",
          }}
        >
          {`// In a component with AppShell context access
import { useTabManagement } from "@aesgraph/app-shell";

const MyComponent = () => {
  const { getExistingTabIds, isTabIdUnique } = useTabManagement();
  
  // Get all existing tab IDs
  const existingIds = getExistingTabIds();
  
  // Check if a tab ID is unique
  if (isTabIdUnique('my-tab')) {
    addViewAsTab({ 
      viewId: "workspace-manager", 
      pane: "center", 
      tabId: "my-tab" 
    });
  }
};`}
        </pre>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>Console Logs:</h3>
        <div
          style={{
            backgroundColor: "#f8f9fa",
            padding: "10px",
            borderRadius: "4px",
            maxHeight: "300px",
            overflowY: "auto",
            fontFamily: "monospace",
            fontSize: "12px",
          }}
        >
          {logs.map((log, index) => (
            <div key={index} style={{ marginBottom: "2px" }}>
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabManagementExample;
