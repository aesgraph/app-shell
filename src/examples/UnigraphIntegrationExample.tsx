import React from "react";
import {
  addViewAsTab,
  addCustomViewAsTab,
  addViewsAsTabs,
  getAvailableViewIds,
  getViewsByCategory,
  hasView,
} from "../utils/programmaticViews";

/**
 * Example showing how Unigraph would integrate with the app-shell
 * to programmatically add views as tabs with specific parameters.
 */
export const UnigraphIntegrationExample: React.FC = () => {
  const handleAddUnigraphViews = () => {
    // Example 1: Add a simple registered view
    const fileExplorerTabId = addViewAsTab({
      viewId: "file-explorer",
      pane: "left",
      props: { initialPath: "/unigraph/data", showHidden: false },
      title: "Unigraph Files",
    });

    // Example 2: Add a terminal with specific session
    const terminalTabId = addViewAsTab({
      viewId: "terminal",
      pane: "bottom",
      props: {
        sessionId: "unigraph-main",
        initialCommand: "cd /unigraph && ls -la",
      },
      title: "Unigraph Terminal",
    });

    // Example 3: Add a custom Unigraph component
    const customTabId = addCustomViewAsTab({
      component: UnigraphDataViewer,
      title: "Unigraph Data",
      pane: "center",
      props: {
        dataSource: "unigraph://entities",
        filters: { type: "person" },
        viewMode: "table",
      },
    });

    console.log("Added tabs:", {
      fileExplorerTabId,
      terminalTabId,
      customTabId,
    });
  };

  const handleAddBatchViews = () => {
    // Example 4: Add multiple views in batch
    const tabIds = addViewsAsTabs([
      {
        viewId: "workspace-manager",
        pane: "right",
        props: { workspaceId: "unigraph-workspace" },
        title: "Unigraph Workspace",
      },
      {
        viewId: "properties",
        pane: "right",
        props: { entityId: "person-123" },
        title: "Entity Properties",
        activate: false,
      },
      {
        viewId: "debug-console",
        pane: "bottom",
        props: { logLevel: "debug", source: "unigraph" },
        title: "Unigraph Debug",
      },
    ]);

    console.log("Batch added tab IDs:", tabIds);
  };

  const handleCheckAvailableViews = () => {
    // Example 5: Check what views are available
    const availableViews = getAvailableViewIds();
    console.log("Available views:", availableViews);

    // Example 6: Get views by category
    const toolViews = getViewsByCategory("tools");
    console.log("Tool views:", toolViews);

    // Example 7: Check if specific views exist
    const hasFileExplorer = hasView("file-explorer");
    const hasUnigraphView = hasView("unigraph-view");
    console.log("Has file explorer:", hasFileExplorer);
    console.log("Has unigraph view:", hasUnigraphView);
  };

  const handleAddUnigraphCustomComponents = () => {
    // Example 8: Add multiple custom Unigraph components
    const customTabIds = addCustomViewsAsTabs([
      {
        component: UnigraphEntityGraph,
        title: "Entity Graph",
        pane: "center",
        props: {
          entityIds: ["person-123", "company-456"],
          layout: "force-directed",
          showLabels: true,
        },
      },
      {
        component: UnigraphQueryBuilder,
        title: "Query Builder",
        pane: "right",
        props: {
          defaultQuery: "SELECT * FROM entities WHERE type = 'person'",
          autoExecute: true,
        },
      },
      {
        component: UnigraphSchemaEditor,
        title: "Schema Editor",
        pane: "left",
        props: {
          schemaId: "person-schema",
          mode: "edit",
        },
      },
    ]);

    console.log("Added custom component tabs:", customTabIds);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h2>Unigraph Integration Examples</h2>

      <div style={{ marginBottom: "20px" }}>
        <h3>Single View Operations</h3>
        <button onClick={handleAddUnigraphViews}>Add Unigraph Views</button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>Batch Operations</h3>
        <button onClick={handleAddBatchViews}>Add Batch Views</button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>Custom Components</h3>
        <button onClick={handleAddUnigraphCustomComponents}>
          Add Custom Components
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>View Discovery</h3>
        <button onClick={handleCheckAvailableViews}>
          Check Available Views
        </button>
      </div>

      <div
        style={{
          marginTop: "30px",
          padding: "15px",
          backgroundColor: "#f5f5f5",
        }}
      >
        <h4>Usage Notes:</h4>
        <ul>
          <li>Click buttons to see console output</li>
          <li>Views will be added as tabs in the specified panes</li>
          <li>Custom components are temporarily registered and cleaned up</li>
          <li>Props are passed to the component instances</li>
          <li>Tab titles can be customized</li>
          <li>
            Use <code>activate: false</code> to add tabs without switching to
            them
          </li>
        </ul>
      </div>
    </div>
  );
};

// Example Unigraph components
const UnigraphDataViewer: React.FC<{
  dataSource: string;
  filters: Record<string, unknown>;
  viewMode: string;
}> = ({ dataSource, filters, viewMode }) => (
  <div style={{ padding: "20px" }}>
    <h3>Unigraph Data Viewer</h3>
    <p>Data Source: {dataSource}</p>
    <p>Filters: {JSON.stringify(filters)}</p>
    <p>View Mode: {viewMode}</p>
    <div
      style={{
        backgroundColor: "#f0f0f0",
        padding: "10px",
        borderRadius: "4px",
      }}
    >
      <p>📊 Data visualization would appear here...</p>
    </div>
  </div>
);

const UnigraphEntityGraph: React.FC<{
  entityIds: string[];
  layout: string;
  showLabels: boolean;
}> = ({ entityIds, layout, showLabels }) => (
  <div style={{ padding: "20px" }}>
    <h3>Entity Graph</h3>
    <p>Entities: {entityIds.join(", ")}</p>
    <p>Layout: {layout}</p>
    <p>Show Labels: {showLabels ? "Yes" : "No"}</p>
    <div
      style={{
        backgroundColor: "#e8f4fd",
        padding: "10px",
        borderRadius: "4px",
      }}
    >
      <p>🕸️ Graph visualization would appear here...</p>
    </div>
  </div>
);

const UnigraphQueryBuilder: React.FC<{
  defaultQuery: string;
  autoExecute: boolean;
}> = ({ defaultQuery, autoExecute }) => (
  <div style={{ padding: "20px" }}>
    <h3>Query Builder</h3>
    <p>Default Query: {defaultQuery}</p>
    <p>Auto Execute: {autoExecute ? "Yes" : "No"}</p>
    <div
      style={{
        backgroundColor: "#fff3cd",
        padding: "10px",
        borderRadius: "4px",
      }}
    >
      <p>🔍 Query builder interface would appear here...</p>
    </div>
  </div>
);

const UnigraphSchemaEditor: React.FC<{
  schemaId: string;
  mode: string;
}> = ({ schemaId, mode }) => (
  <div style={{ padding: "20px" }}>
    <h3>Schema Editor</h3>
    <p>Schema ID: {schemaId}</p>
    <p>Mode: {mode}</p>
    <div
      style={{
        backgroundColor: "#d1ecf1",
        padding: "10px",
        borderRadius: "4px",
      }}
    >
      <p>📝 Schema editor would appear here...</p>
    </div>
  </div>
);

export default UnigraphIntegrationExample;
