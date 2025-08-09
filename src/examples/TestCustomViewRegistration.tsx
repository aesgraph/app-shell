import React from "react";
import {
  addViewAsTab,
  addCustomViewAsTab,
  getAvailableViewIds,
  hasView,
} from "../utils/programmaticViews";

/**
 * Test component to verify that custom view registration doesn't interfere
 * with existing registered views.
 */
export const TestCustomViewRegistration: React.FC = () => {
  const [results, setResults] = React.useState<string[]>([]);

  const addLog = (message: string) => {
    setResults((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const testCustomViewRegistration = () => {
    addLog("=== Starting Custom View Registration Test ===");

    // Step 1: Check initial available views
    const initialViews = getAvailableViewIds();
    addLog(`Initial available views: ${initialViews.length}`);
    addLog(`Has file-explorer: ${hasView("file-explorer")}`);

    // Step 2: Add a custom view
    addLog("Adding custom view...");
    const customTabId = addCustomViewAsTab({
      component: TestCustomComponent,
      title: "Test Custom Component",
      pane: "center",
      props: { testData: "Hello from custom component" },
    });
    addLog(`Custom tab ID: ${customTabId}`);

    // Step 3: Check if existing views are still available
    setTimeout(() => {
      const afterCustomViews = getAvailableViewIds();
      addLog(`Views after custom view: ${afterCustomViews.length}`);
      addLog(`Still has file-explorer: ${hasView("file-explorer")}`);

      // Step 4: Try to add a registered view
      addLog("Adding registered view...");
      const registeredTabId = addViewAsTab({
        viewId: "file-explorer",
        pane: "left",
        props: { initialPath: "/test" },
        title: "Test File Explorer",
      });
      addLog(`Registered tab ID: ${registeredTabId}`);

      // Step 5: Final check
      setTimeout(() => {
        const finalViews = getAvailableViewIds();
        addLog(`Final available views: ${finalViews.length}`);
        addLog(`Final has file-explorer: ${hasView("file-explorer")}`);
        addLog("=== Test Complete ===");
      }, 100);
    }, 100);
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h2>Custom View Registration Test</h2>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={testCustomViewRegistration}>Run Test</button>
        <button onClick={clearResults} style={{ marginLeft: "10px" }}>
          Clear Results
        </button>
      </div>

      <div
        style={{
          backgroundColor: "#f5f5f5",
          padding: "15px",
          borderRadius: "4px",
          maxHeight: "400px",
          overflowY: "auto",
        }}
      >
        <h4>Test Results:</h4>
        {results.length === 0 ? (
          <p>Click "Run Test" to start the test...</p>
        ) : (
          <pre style={{ margin: 0, fontSize: "12px" }}>
            {results.join("\n")}
          </pre>
        )}
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          backgroundColor: "#e8f4fd",
          borderRadius: "4px",
        }}
      >
        <h4>Test Description:</h4>
        <p>This test verifies that:</p>
        <ul>
          <li>Custom views can be added without affecting the view registry</li>
          <li>
            Existing registered views remain available after adding custom views
          </li>
          <li>
            Registered views can still be added as tabs after custom views
          </li>
          <li>No temporary registration/unregistration occurs</li>
        </ul>
      </div>
    </div>
  );
};

const TestCustomComponent: React.FC<Record<string, unknown>> = (props) => {
  const testData = (props.testData as string) || "Default test data";

  return (
    <div style={{ padding: "20px" }}>
      <h3>Test Custom Component</h3>
      <p>
        This is a test custom component that should not interfere with the view
        registry.
      </p>
      <p>Test data: {testData}</p>
      <div
        style={{
          backgroundColor: "#f0f0f0",
          padding: "10px",
          borderRadius: "4px",
          marginTop: "10px",
        }}
      >
        <p>
          ✅ If you can see this, the custom component was added successfully!
        </p>
      </div>
    </div>
  );
};

export default TestCustomViewRegistration;
